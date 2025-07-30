type TTSPlayer = {
  init: () => void;
  play: (
    audioBuffer: ArrayBuffer | AudioBuffer,
    onended: () => void | null,
  ) => Promise<void>;
  playQueue: (
    audioBuffers: (ArrayBuffer | AudioBuffer)[],
    onended: () => void | null,
  ) => Promise<void>;
  addToQueue: (audioBuffer: ArrayBuffer | AudioBuffer) => void;
  startStreamPlay: (onended: () => void | null) => void;
  finishStreamPlay: () => void;
  stop: () => void;
};

export function createTTSPlayer(): TTSPlayer {
  let audioContext: AudioContext | null = null;
  let audioBufferSourceNode: AudioBufferSourceNode | null = null;
  let isPlaying = false;
  let playQueue: (ArrayBuffer | AudioBuffer)[] = [];
  let currentOnended: (() => void | null) | null = null;
  let isStreamMode = false;
  let streamFinished = false;

  const init = () => {
    console.log("[TTSPlayer] init");
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.suspend();
  };

  const play = async (
    audioBuffer: ArrayBuffer | AudioBuffer,
    onended: () => void | null,
  ) => {
    if (audioBufferSourceNode) {
      audioBufferSourceNode.stop();
      audioBufferSourceNode.disconnect();
    }
    let buffer: AudioBuffer;
    if (audioBuffer instanceof AudioBuffer) {
      buffer = audioBuffer;
    } else {
      buffer = await audioContext!.decodeAudioData(audioBuffer);
    }
    audioBufferSourceNode = audioContext!.createBufferSource();
    audioBufferSourceNode.buffer = buffer;
    audioBufferSourceNode.connect(audioContext!.destination);
    audioContext!.resume().then(() => {
      audioBufferSourceNode!.start();
    });
    audioBufferSourceNode.onended = onended;
  };

  const playNext = async () => {
    if (playQueue.length === 0) {
      // 在流模式下，如果队列为空但流还没结束，等待
      if (isStreamMode && !streamFinished) {
        setTimeout(() => playNext(), 100);
        return;
      }

      isPlaying = false;
      isStreamMode = false;
      streamFinished = false;
      if (currentOnended) {
        currentOnended();
        currentOnended = null;
      }
      return;
    }

    const nextBuffer = playQueue.shift()!;
    let buffer: AudioBuffer;
    if (nextBuffer instanceof AudioBuffer) {
      buffer = nextBuffer;
    } else {
      buffer = await audioContext!.decodeAudioData(nextBuffer);
    }

    if (audioBufferSourceNode) {
      audioBufferSourceNode.stop();
      audioBufferSourceNode.disconnect();
    }

    audioBufferSourceNode = audioContext!.createBufferSource();
    audioBufferSourceNode.buffer = buffer;
    audioBufferSourceNode.connect(audioContext!.destination);
    audioBufferSourceNode.onended = () => {
      playNext();
    };

    await audioContext!.resume();
    audioBufferSourceNode.start();
  };

  const playQueueMethod = async (
    audioBuffers: (ArrayBuffer | AudioBuffer)[],
    onended: () => void | null,
  ) => {
    playQueue = [...audioBuffers];
    currentOnended = onended;
    if (!isPlaying) {
      isPlaying = true;
      await playNext();
    }
  };

  const addToQueue = (audioBuffer: ArrayBuffer | AudioBuffer) => {
    if (streamFinished) {
      return;
    }
    playQueue.push(audioBuffer);
  };

  const startStreamPlay = (onended: () => void | null) => {
    isStreamMode = true;
    streamFinished = false;
    playQueue = [];
    currentOnended = onended;

    if (!isPlaying) {
      isPlaying = true;
      playNext();
    }
  };

  const finishStreamPlay = () => {
    streamFinished = true;
  };

  const stop = async () => {
    console.log("[TTSPlayer] stop");
    playQueue = [];
    isPlaying = false;
    isStreamMode = false;
    streamFinished = true;
    currentOnended = null;

    if (audioBufferSourceNode) {
      audioBufferSourceNode.stop();
      audioBufferSourceNode.disconnect();
      audioBufferSourceNode = null;
    }
    if (audioContext) {
      await audioContext.close();
      audioContext = null;
    }
  };

  return {
    init,
    play,
    playQueue: playQueueMethod,
    addToQueue,
    startStreamPlay,
    finishStreamPlay,
    stop,
  };
}
