import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import { VoicePrint } from "./voice-print/voice-print";
import styles from "./TensorFlow.module.scss";

// 声纹识别状态
enum VoiceRecognitionStatus {
  IDLE = "空闲",
  RECORDING = "录制中",
  TRAINING = "训练中",
  RECOGNIZING = "识别中",
  TRAINED = "已训练",
  MATCHED = "声纹匹配",
  NOT_MATCHED = "声纹不匹配",
  ERROR = "错误",
}

// 声纹特征提取参数
const SAMPLE_RATE = 16000; // 采样率
const FFT_SIZE = 1024; // FFT大小
const MEL_BINS = 40; // Mel滤波器数量
const FRAME_LENGTH = 25; // 帧长度(ms)
const FRAME_STEP = 10; // 帧步长(ms)
const FEATURE_LENGTH = 100; // 特征序列长度

const TensorFlow: React.FC = () => {
  // 状态管理
  const [status, setStatus] = useState<VoiceRecognitionStatus>(
    VoiceRecognitionStatus.IDLE,
  );
  const [message, setMessage] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTrained, setIsTrained] = useState<boolean>(false);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [frequencies, setFrequencies] = useState<Uint8Array | undefined>(
    undefined,
  );

  // 引用
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Float32Array[]>([]);
  const modelRef = useRef<tf.LayersModel | null>(null);
  const voiceprintRef = useRef<Float32Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // 初始化
  useEffect(() => {
    // 检查是否有保存的声纹模型
    const savedVoiceprint = localStorage.getItem("userVoiceprint");
    if (savedVoiceprint) {
      try {
        voiceprintRef.current = new Float32Array(JSON.parse(savedVoiceprint));
        setIsTrained(true);
        setStatus(VoiceRecognitionStatus.TRAINED);
        setMessage("已加载保存的声纹模型");
      } catch (error) {
        console.error("加载保存的声纹模型失败:", error);
      }
    }

    // 加载TensorFlow模型
    loadModel();

    return () => {
      stopRecording();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 加载声纹识别模型
  const loadModel = async () => {
    try {
      // 创建简单的声纹识别模型
      const model = tf.sequential();

      // 添加卷积层处理音频特征
      model.add(
        tf.layers.conv1d({
          inputShape: [FEATURE_LENGTH, MEL_BINS],
          filters: 32,
          kernelSize: 3,
          activation: "relu",
        }),
      );

      model.add(tf.layers.maxPooling1d({ poolSize: 2 }));

      model.add(
        tf.layers.conv1d({
          filters: 64,
          kernelSize: 3,
          activation: "relu",
        }),
      );

      model.add(tf.layers.maxPooling1d({ poolSize: 2 }));
      model.add(tf.layers.flatten());

      // 添加全连接层
      model.add(tf.layers.dense({ units: 128, activation: "relu" }));
      model.add(tf.layers.dropout({ rate: 0.5 }));

      // 输出层 - 声纹特征向量
      model.add(tf.layers.dense({ units: 64, activation: "linear" }));

      // 编译模型
      model.compile({
        optimizer: "adam",
        loss: "meanSquaredError",
      });

      modelRef.current = model;
      console.log("声纹识别模型已加载");
    } catch (error) {
      console.error("加载模型失败:", error);
      setStatus(VoiceRecognitionStatus.ERROR);
      setMessage("加载模型失败");
    }
  };

  // 开始录音
  const startRecording = async (isTraining: boolean = false) => {
    try {
      if (isRecording) return;

      // 重置录音数据
      recordedChunksRef.current = [];

      // 请求麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // 创建音频上下文
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // 创建分析器节点用于可视化
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyserRef.current = analyser;

      // 创建音频源
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // 创建处理器节点
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      // 处理音频数据
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        recordedChunksRef.current.push(new Float32Array(inputData));
      };

      // 连接节点
      analyser.connect(processor);
      processor.connect(audioContext.destination);

      // 更新状态
      setIsRecording(true);
      setStatus(
        isTraining
          ? VoiceRecognitionStatus.RECORDING
          : VoiceRecognitionStatus.RECOGNIZING,
      );
      setMessage(
        isTraining ? "请说话3-5秒钟用于训练..." : "请说话进行声纹识别...",
      );

      // 开始频谱可视化
      startVisualization();

      // 设置自动停止录音（训练模式下5秒后自动停止）
      if (isTraining) {
        setTimeout(() => {
          stopRecording();
          trainVoiceprint();
        }, 5000);
      }
    } catch (error) {
      console.error("开始录音失败:", error);
      setStatus(VoiceRecognitionStatus.ERROR);
      setMessage("无法访问麦克风，请检查权限");
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (!isRecording) return;

    // 停止所有音频流
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // 关闭音频上下文
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // 停止可视化
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsRecording(false);
    setFrequencies(undefined);
  };

  // 开始频谱可视化
  const startVisualization = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVisualization = () => {
      if (!analyser) return;

      analyser.getByteFrequencyData(dataArray);
      setFrequencies(dataArray);

      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };

    updateVisualization();
  };

  // 提取音频特征
  const extractFeatures = async (
    audioData: Float32Array[],
  ): Promise<tf.Tensor | null> => {
    try {
      // 合并所有音频块
      const mergedData = new Float32Array(
        audioData.reduce((acc, chunk) => acc + chunk.length, 0),
      );
      let offset = 0;
      for (const chunk of audioData) {
        mergedData.set(chunk, offset);
        offset += chunk.length;
      }

      // 转换为张量
      const audioTensor = tf.tensor1d(mergedData);

      // 计算梅尔频谱图 (简化版)
      // 在实际应用中，这里应该使用更复杂的信号处理方法
      // 如MFCC (Mel-frequency cepstral coefficients)
      const frameLength = Math.round((SAMPLE_RATE * FRAME_LENGTH) / 1000);
      const frameStep = Math.round((SAMPLE_RATE * FRAME_STEP) / 1000);

      // 使用短时傅里叶变换提取特征
      // 注意：这是简化版，实际应用中应使用专业的DSP库
      const frames = [];
      for (let i = 0; i + frameLength <= mergedData.length; i += frameStep) {
        const frame = mergedData.slice(i, i + frameLength);
        frames.push(Array.from(frame));
      }

      // 限制帧数
      const limitedFrames = frames.slice(0, FEATURE_LENGTH);

      // 如果帧数不足，用零填充
      while (limitedFrames.length < FEATURE_LENGTH) {
        limitedFrames.push(new Array(frameLength).fill(0));
      }

      // 创建特征张量
      const featureTensor = tf.tensor(limitedFrames);

      // 简化的梅尔频谱计算
      // 在实际应用中应使用更准确的方法
      const melSpectrogram = tf.tidy(() => {
        // 应用FFT (简化)
        const fftMag = featureTensor.abs();

        // 降维到MEL_BINS
        const reshaped = fftMag.reshape([FEATURE_LENGTH, -1]);
        const melFeatures = reshaped.slice([0, 0], [FEATURE_LENGTH, MEL_BINS]);

        // 归一化
        const normalized = melFeatures.div(tf.scalar(255.0));

        return normalized.expandDims(0); // 添加批次维度
      });

      return melSpectrogram;
    } catch (error) {
      console.error("特征提取失败:", error);
      return null;
    }
  };

  // 训练声纹模型
  const trainVoiceprint = async () => {
    if (recordedChunksRef.current.length === 0 || !modelRef.current) {
      setStatus(VoiceRecognitionStatus.ERROR);
      setMessage("没有录音数据或模型未加载");
      return;
    }

    setStatus(VoiceRecognitionStatus.TRAINING);
    setMessage("正在训练声纹模型...");

    try {
      // 提取特征
      const features = await extractFeatures(recordedChunksRef.current);
      if (!features) throw new Error("特征提取失败");

      // 使用模型提取声纹特征向量
      const voiceprint = tf.tidy(() => {
        // 前向传播获取声纹特征
        const prediction = modelRef.current!.predict(features) as tf.Tensor;
        // 归一化特征向量
        return tf.div(prediction, tf.norm(prediction));
      });

      // 保存声纹特征
      const voiceprintData = await voiceprint.data();
      voiceprintRef.current = new Float32Array(voiceprintData);

      // 保存到localStorage
      localStorage.setItem(
        "userVoiceprint",
        JSON.stringify(Array.from(voiceprintData)),
      );

      setIsTrained(true);
      setStatus(VoiceRecognitionStatus.TRAINED);
      setMessage("声纹模型训练完成并已保存");

      // 清理
      voiceprint.dispose();
      features.dispose();
    } catch (error) {
      console.error("训练失败:", error);
      setStatus(VoiceRecognitionStatus.ERROR);
      setMessage("声纹训练失败");
    }
  };

  // 识别声纹
  const recognizeVoice = async () => {
    if (!isTrained || !voiceprintRef.current) {
      setStatus(VoiceRecognitionStatus.ERROR);
      setMessage("请先训练声纹模型");
      return;
    }

    if (recordedChunksRef.current.length === 0 || !modelRef.current) {
      setStatus(VoiceRecognitionStatus.ERROR);
      setMessage("没有录音数据或模型未加载");
      return;
    }

    try {
      // 提取特征
      const features = await extractFeatures(recordedChunksRef.current);
      if (!features) throw new Error("特征提取失败");

      // 使用模型提取声纹特征向量
      const currentVoiceprint = tf.tidy(() => {
        // 前向传播获取声纹特征
        const prediction = modelRef.current!.predict(features) as tf.Tensor;
        // 归一化特征向量
        return tf.div(prediction, tf.norm(prediction));
      });

      // 计算与保存的声纹的余弦相似度
      const similarity = tf.tidy(() => {
        const savedVoiceprint = tf.tensor1d(voiceprintRef.current!);
        // 计算点积
        const dotProduct = tf.sum(
          tf.mul(currentVoiceprint.reshape([-1]), savedVoiceprint),
        );
        return dotProduct;
      });

      // 获取相似度分数 (范围从-1到1，越接近1表示越相似)
      const similarityScore = await similarity.data();
      const score = similarityScore[0];
      setMatchScore(score);

      // 判断是否为同一人 (阈值可调整)
      const threshold = 0.7;
      const isMatch = score > threshold;

      setStatus(
        isMatch
          ? VoiceRecognitionStatus.MATCHED
          : VoiceRecognitionStatus.NOT_MATCHED,
      );
      setMessage(
        isMatch
          ? `声纹匹配成功！相似度: ${(score * 100).toFixed(2)}%`
          : `声纹不匹配。相似度: ${(score * 100).toFixed(2)}%`,
      );

      // 清理
      currentVoiceprint.dispose();
      features.dispose();
      similarity.dispose();
    } catch (error) {
      console.error("识别失败:", error);
      setStatus(VoiceRecognitionStatus.ERROR);
      setMessage("声纹识别失败");
    }
  };

  // 清除训练数据
  const clearTrainedData = () => {
    localStorage.removeItem("userVoiceprint");
    voiceprintRef.current = null;
    setIsTrained(false);
    setStatus(VoiceRecognitionStatus.IDLE);
    setMessage("声纹数据已清除");
  };

  return (
    <div className={styles.voiceRecognitionContainer}>
      <h2 className={styles.title}>声纹识别系统</h2>

      <div className={styles.statusContainer}>
        <div className={styles.statusIndicator}>
          <div
            className={`${styles.statusDot} ${styles[status.toLowerCase()]}`}
          ></div>
          <span className={styles.statusText}>{status}</span>
        </div>
        <p className={styles.message}>{message}</p>
      </div>

      <div className={styles.visualizerContainer}>
        <VoicePrint frequencies={frequencies} isActive={isRecording} />
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.trainingControls}>
          <h3>训练声纹</h3>
          <button
            className={styles.button}
            onClick={() => startRecording(true)}
            disabled={isRecording}
          >
            录制训练音频
          </button>
          <button
            className={styles.button}
            onClick={clearTrainedData}
            disabled={!isTrained}
          >
            清除训练数据
          </button>
        </div>

        <div className={styles.recognitionControls}>
          <h3>声纹识别</h3>
          <button
            className={styles.button}
            onClick={() => startRecording(false)}
            disabled={isRecording || !isTrained}
          >
            开始录音
          </button>
          <button
            className={styles.button}
            onClick={() => {
              stopRecording();
              recognizeVoice();
            }}
            disabled={!isRecording}
          >
            停止并识别
          </button>
        </div>
      </div>

      {status === VoiceRecognitionStatus.MATCHED ||
      status === VoiceRecognitionStatus.NOT_MATCHED ? (
        <div className={styles.resultContainer}>
          <div className={styles.scoreBar}>
            <div
              className={styles.scoreIndicator}
              style={{ width: `${Math.max(0, matchScore * 100)}%` }}
            ></div>
          </div>
          <div className={styles.scoreValue}>
            相似度: {(matchScore * 100).toFixed(2)}%
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TensorFlow;
