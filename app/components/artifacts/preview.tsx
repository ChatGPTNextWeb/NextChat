import { useEffect, useRef, useMemo, forwardRef, useImperativeHandle, useState } from "react";
import { nanoid } from "nanoid";
import styles from "./preview.module.scss";

type PreviewProps = {
  code: string;
  viewMode: "html" | "svg" | "react";
  height?: number | string;
};

export type PreviewHandler = {
  reload: () => void;
};

export const Preview = forwardRef<PreviewHandler, PreviewProps>(
  function Preview(props, ref) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [frameId, setFrameId] = useState<string>(nanoid());

    useImperativeHandle(ref, () => ({
      reload: () => {
        setFrameId(nanoid());
      },
    }));

    const srcDoc = useMemo(() => {
      // 添加消息监听器，用于处理iframe内部的事件
      const script = `<script>
        window.addEventListener("DOMContentLoaded", () => {
          // 发送iframe加载完成的消息
          parent.postMessage({ type: "iframe-loaded", id: '${frameId}' }, '*');
        });
      </script>`;

      let fullCode = props.code;

      // 根据viewMode处理代码
      if (props.viewMode === "svg") {
        // 为SVG代码添加HTML包装
        fullCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SVG Preview</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  </style>
</head>
<body>
  ${props.code}
</body>
</html>`;
      } else if (props.viewMode === "react") {
        // 为React代码添加HTML包装和React依赖
        fullCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>React Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${props.code}
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>`;
      } else {
        // HTML代码直接使用
        if (!fullCode.includes("<!DOCTYPE html>")) {
          fullCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>HTML Preview</title>
</head>
<body>
  ${fullCode}
</body>
</html>`;
        }
      }

      // 将脚本添加到HTML代码中
      if (fullCode.includes("</head>")) {
        fullCode = fullCode.replace("</head>", `${script}</head>`);
      } else {
        fullCode = script + fullCode;
      }

      return fullCode;
    }, [props.code, props.viewMode, frameId]);

    return (
      <iframe
        className={styles["preview-iframe"]}
        key={frameId}
        ref={iframeRef}
        sandbox="allow-forms allow-modals allow-scripts allow-same-origin"
        style={{ height: props.height || "100%" }}
        srcDoc={srcDoc}
      />
    );
  },
);
