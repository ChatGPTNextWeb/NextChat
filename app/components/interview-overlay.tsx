import React, { useState, useEffect, useRef } from "react";
import StopIcon from "../icons/pause.svg";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./interview-overlay.scss";

interface InterviewOverlayProps {
  onClose: () => void;
  onTextUpdate: (text: string) => void;
  submitMessage: (text: string) => void;
}

export const InterviewOverlay: React.FC<InterviewOverlayProps> = ({
  onClose,
  onTextUpdate,
  submitMessage,
}) => {
  const [visible, setVisible] = useState(true);
  // const [countdown, setCountdown] = useState(20);
  // const countdownRef = useRef(countdown);
  // const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  // 添加暂停状态
  const [isPaused, setIsPaused] = useState(false);
  // 添加宽度状态和拖动状态
  const [width, setWidth] = useState("33vw");
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(isDragging);
  const dragStartXRef = useRef(0);
  const initialWidthRef = useRef(0);

  // 使用 react-speech-recognition 的钩子
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // 保存当前文本的引用，用于在倒计时结束时提交
  const transcriptRef = useRef(transcript);

  useEffect(() => {
    transcriptRef.current = transcript;
    onTextUpdate(transcript);
  }, [transcript, onTextUpdate]);

  // 检查浏览器是否支持语音识别
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("您的浏览器不支持语音识别功能");
    } else if (!isMicrophoneAvailable) {
      console.error("无法访问麦克风");
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  // 开始语音识别
  useEffect(() => {
    if (visible && !isPaused) {
      // 配置语音识别
      SpeechRecognition.startListening({
        continuous: true,
        language: "zh-CN",
      });
    }

    return () => {
      SpeechRecognition.stopListening();
    };
  }, [visible, isPaused]);

  const stopRecognition = () => {
    try {
      SpeechRecognition.stopListening();
      // 提交最终结果
      if (transcriptRef.current) {
        submitMessage(transcriptRef.current);
      }
      // 关闭overlay
      setVisible(false);
      onClose();
    } catch (error) {
      console.error("停止语音识别失败:", error);
    }
  };

  // 添加暂停/恢复功能
  const togglePause = () => {
    if (!isPaused) {
      // 使用更强制的中断方式
      SpeechRecognition.abortListening();
      // 然后再调用正常的停止方法确保完全停止
      setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 0);

      if (transcriptRef.current && transcriptRef.current.trim() !== "") {
        // 使用setTimeout将提交操作放到下一个事件循环，避免阻塞UI更新
        setTimeout(() => {
          submitMessage(transcriptRef.current);
          resetTranscript();
        }, 0);
      }
    } else {
      // 先确保停止当前可能存在的监听
      SpeechRecognition.abortListening();
      // 短暂延迟后重新启动监听
      setTimeout(() => {
        SpeechRecognition.startListening({
          continuous: true,
          language: "zh-CN",
        });
        // 重置文本
        resetTranscript();
      }, 0);
    }
    setIsPaused(!isPaused);
  };

  // 添加拖动相关的事件处理函数
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(() => {
      isDraggingRef.current = true;
      return true;
    });
    dragStartXRef.current = e.clientX;
    initialWidthRef.current = parseInt(width);
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const handleDragMove = (e: MouseEvent) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - dragStartXRef.current;
      const newWidth = Math.max(
        15,
        Math.min(
          80,
          initialWidthRef.current - (deltaX / window.innerWidth) * 100,
        ),
      );
      console.log(`mouse have moved  Width:${newWidth}vw`);
      setWidth(`${newWidth}vw`);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(() => {
      isDraggingRef.current = false;
      return false;
    });
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  // 组件卸载时清理事件监听器
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`interview-overlay ${isDragging ? "dragging" : ""}`}
      style={{ width }}
    >
      {/* 添加左侧拖动条 */}
      <div className="drag-handle" onMouseDown={handleDragStart} />

      <div className="content-container">
        {/* 语音识别状态指示器 */}
        <div className="status-indicator">
          <div
            className={`indicator-dot ${
              listening ? "listening" : "not-listening"
            }`}
          />
          <span className="status-text">
            {listening ? "正在监听..." : isPaused ? "已暂停" : "未监听"}
          </span>
        </div>

        {/* 错误提示 */}
        {(!browserSupportsSpeechRecognition || !isMicrophoneAvailable) && (
          <div className="error-message">
            {!browserSupportsSpeechRecognition
              ? "您的浏览器不支持语音识别功能,请使用Chrome浏览器"
              : "无法访问麦克风，请检查麦克风权限"}
          </div>
        )}

        {/* 识别文本显示区域 */}
        {transcript && <div className="transcript-display">{transcript}</div>}

        {/* 按钮区域 */}
        <div className="button-container">
          {/* 暂停/恢复按钮 */}
          <button
            onClick={togglePause}
            className={`button pause-button ${isPaused ? "paused" : ""}`}
          >
            <span>{isPaused ? "▶️ 恢复监听" : "⏸️ 暂停并发送"}</span>
          </button>

          <button onClick={stopRecognition} className="button stop-button">
            <StopIcon />
            <span>结束对话</span>
          </button>

          <button onClick={resetTranscript} className="button clear-button">
            <span>🗑️ 清空</span>
          </button>
        </div>
      </div>
    </div>
  );
};
