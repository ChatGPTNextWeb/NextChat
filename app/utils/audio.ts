type TTSPlayer = {
  init: () => void;
  play: (
    audioBuffer: ArrayBuffer | AudioBuffer,
    onended: () => void | null,
  ) => Promise<void>;
  playQueueMethod: (
    audioBuffers: (ArrayBuffer | AudioBuffer)[],
    onended: () => void | null,
  ) => Promise<void>;
  addToQueue: (audioBuffer: ArrayBuffer | AudioBuffer) => void;
  startStreamPlay: (onended: () => void | null) => void;
  finishStreamPlay: () => void;
  setStreamController: (controller: AbortController) => void;
  clearStreamController: () => void;
  stop: () => void;
  pcmBase64ToAudioBuffer: (
    base64Data: string,
    config?: PCMConfig,
  ) => Promise<AudioBuffer>;
  pcmDataToAudioBuffer: (
    pcmData: Uint8Array,
    config?: PCMConfig,
  ) => Promise<AudioBuffer>;
};

// Audio processing utilities
export interface PCMConfig {
  channels?: number;
  sampleRate?: number;
  bitDepth?: 16 | 24 | 32;
}

export class TTSPlayManager implements TTSPlayer {
  private static audioContext: AudioContext | null = null;
  private audioBufferSourceNode: AudioBufferSourceNode | null = null;
  private isPlaying = false;
  private playQueue: (ArrayBuffer | AudioBuffer)[] = [];
  private currentOnended: (() => void | null) | null = null;
  private isStreamMode = false;
  private streamFinished = false;
  private streamController: AbortController | null = null;

  get getAudioContext() {
    if (!TTSPlayManager.audioContext) {
      TTSPlayManager.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    return TTSPlayManager.audioContext;
  }

  init() {
    console.log("[TTSPlayManager] init");
    if (TTSPlayManager.audioContext) {
      return;
    }
    this.getAudioContext.suspend();
  }

  async play(
    audioBuffer: ArrayBuffer | AudioBuffer,
    onended: () => void | null,
  ) {
    if (this.audioBufferSourceNode) {
      this.audioBufferSourceNode.stop();
      this.audioBufferSourceNode.disconnect();
    }
    let buffer: AudioBuffer;
    if (audioBuffer instanceof AudioBuffer) {
      buffer = audioBuffer;
    } else {
      buffer = await TTSPlayManager.audioContext!.decodeAudioData(audioBuffer);
    }
    this.audioBufferSourceNode =
      TTSPlayManager.audioContext!.createBufferSource();
    this.audioBufferSourceNode.buffer = buffer;
    this.audioBufferSourceNode.connect(
      TTSPlayManager.audioContext!.destination,
    );
    this.getAudioContext.resume().then(() => {
      this.audioBufferSourceNode!.start();
    });
    this.audioBufferSourceNode.onended = onended;
  }

  async stop() {
    console.log("[TTSPlayer] stop");

    // 首先中断流式请求
    try {
      if (this.streamController && !this.streamController.signal.aborted) {
        console.log("[TTSPlayer] Aborting stream request");
        this.streamController.abort();
      }
    } catch (e) {
      // 忽略中断请求时的错误
      console.log("[TTSPlayer] Error while aborting stream:", e);
    }
    this.clearStreamController();

    // 清理播放状态
    this.playQueue = [];
    this.isPlaying = false;
    this.isStreamMode = false;
    this.streamFinished = true;
    this.currentOnended = null;

    // 停止音频播放
    if (this.audioBufferSourceNode) {
      this.audioBufferSourceNode.stop();
      this.audioBufferSourceNode.disconnect();
      this.audioBufferSourceNode = null;
    }

    // 关闭音频上下文
    if (TTSPlayManager.audioContext) {
      await TTSPlayManager.audioContext.close();
      TTSPlayManager.audioContext = null;
    }
  }

  async playNext() {
    if (this.playQueue.length === 0) {
      // 在流模式下，如果队列为空但流还没结束，等待
      if (this.isStreamMode && !this.streamFinished) {
        setTimeout(() => this.playNext(), 100);
        return;
      }

      this.isPlaying = false;
      this.isStreamMode = false;
      this.streamFinished = false;
      if (this.currentOnended) {
        this.currentOnended();
        this.currentOnended = null;
      }
      return;
    }

    const nextBuffer = this.playQueue.shift()!;
    let buffer: AudioBuffer;
    if (nextBuffer instanceof AudioBuffer) {
      buffer = nextBuffer;
    } else {
      buffer = await this.getAudioContext.decodeAudioData(nextBuffer);
    }

    if (this.audioBufferSourceNode) {
      this.audioBufferSourceNode.stop();
      this.audioBufferSourceNode.disconnect();
    }

    this.audioBufferSourceNode = this.getAudioContext.createBufferSource();
    this.audioBufferSourceNode.buffer = buffer;
    this.audioBufferSourceNode.connect(this.getAudioContext.destination);
    this.audioBufferSourceNode.onended = () => {
      this.playNext();
    };

    await this.getAudioContext.resume();
    this.audioBufferSourceNode.start();
  }

  async playQueueMethod(
    audioBuffers: (ArrayBuffer | AudioBuffer)[],
    onended: () => void | null,
  ) {
    this.playQueue = [...audioBuffers];
    this.currentOnended = onended;
    if (!this.isPlaying) {
      this.isPlaying = true;
      await this.playNext();
    }
  }

  addToQueue(audioBuffer: ArrayBuffer | AudioBuffer) {
    if (this.streamFinished) {
      return;
    }
    this.playQueue.push(audioBuffer);
  }

  startStreamPlay(onended: () => void | null) {
    this.isStreamMode = true;
    this.streamFinished = false;
    this.playQueue = [];
    this.currentOnended = onended;
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.playNext();
    }
  }

  finishStreamPlay() {
    this.streamFinished = true;
  }

  // 设置流式请求控制器，用于在 stop 时中断请求
  setStreamController(controller: AbortController) {
    this.streamController = controller;
  }

  // 清除流式请求控制器
  clearStreamController() {
    this.streamController = null;
  }

  // 将 base64 PCM 数据转换为 AudioBuffer
  async pcmBase64ToAudioBuffer(
    base64Data: string,
    config: PCMConfig = {},
  ): Promise<AudioBuffer> {
    try {
      // 解码 base64
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 转换为 AudioBuffer
      return await this.pcmDataToAudioBuffer(bytes, config);
    } catch (error) {
      console.error("Failed to convert PCM base64 to AudioBuffer:", error);
      throw error;
    }
  }

  // 将 PCM 字节数据转换为 AudioBuffer
  async pcmDataToAudioBuffer(
    pcmData: Uint8Array,
    config: PCMConfig = {},
  ): Promise<AudioBuffer> {
    const { channels = 1, sampleRate = 24000, bitDepth = 16 } = config;

    const audioContext = this.getAudioContext;

    return new Promise<AudioBuffer>((resolve, reject) => {
      try {
        let float32Array: Float32Array;

        // 根据位深度选择转换方法
        switch (bitDepth) {
          case 16:
            float32Array = this.pcm16ToFloat32(pcmData);
            break;
          default:
            throw new Error(`Unsupported bit depth: ${bitDepth}`);
        }

        // 创建 AudioBuffer
        const audioBuffer = audioContext.createBuffer(
          channels,
          float32Array.length / channels,
          sampleRate,
        );

        // 复制数据到 AudioBuffer
        for (let channel = 0; channel < channels; channel++) {
          const channelData = audioBuffer.getChannelData(channel);
          for (let i = 0; i < channelData.length; i++) {
            channelData[i] = float32Array[i * channels + channel];
          }
        }

        resolve(audioBuffer);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 16位 PCM 转 32位浮点数
  pcm16ToFloat32(pcmData: Uint8Array): Float32Array {
    const length = pcmData.length / 2;
    const float32Array = new Float32Array(length);

    for (let i = 0; i < length; i++) {
      const int16 = (pcmData[i * 2 + 1] << 8) | pcmData[i * 2];
      const int16Signed = int16 > 32767 ? int16 - 65536 : int16;
      float32Array[i] = int16Signed / 32768;
    }

    return float32Array;
  }
}

export function createTTSPlayer(): TTSPlayManager {
  return new TTSPlayManager();
}
