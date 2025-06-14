import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";
import { useRef, useState, RefObject, useEffect, useMemo } from "react";
import { copyToClipboard, useWindowSize } from "../utils";
import mermaid from "mermaid";
import Locale from "../locales";
import LoadingIcon from "../icons/three-dots.svg";
import ReloadButtonIcon from "../icons/reload.svg";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { showImageModal, FullScreen } from "./ui-lib";
import {
  ArtifactsShareButton,
  HTMLPreview,
  HTMLPreviewHander,
} from "./artifacts";
import { useChatStore } from "../store";
import { IconButton } from "./button";

import { useAppConfig } from "../store/config";
import clsx from "clsx";

export function Mermaid(props: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (props.code && ref.current) {
      mermaid
        .run({
          nodes: [ref.current],
          suppressErrors: true,
        })
        .catch((e) => {
          setHasError(true);
          console.error("[Mermaid] ", e.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.code]);

  function viewSvgInNewWindow() {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    const text = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([text], { type: "image/svg+xml" });
    showImageModal(URL.createObjectURL(blob));
  }

  if (hasError) {
    return null;
  }

  return (
    <div
      className={clsx("no-dark", "mermaid")}
      style={{
        cursor: "pointer",
        overflow: "auto",
      }}
      ref={ref}
      onClick={() => viewSvgInNewWindow()}
    >
      {props.code}
    </div>
  );
}

export function PreCode(props: { children: any }) {
  const ref = useRef<HTMLPreElement>(null);
  const previewRef = useRef<HTMLPreviewHander>(null);
  const [mermaidCode, setMermaidCode] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const { height } = useWindowSize();
  const chatStore = useChatStore();
  const session = chatStore.currentSession();

  const renderArtifacts = useDebouncedCallback(() => {
    if (!ref.current) return;
    const mermaidDom = ref.current.querySelector("code.language-mermaid");
    if (mermaidDom) {
      setMermaidCode((mermaidDom as HTMLElement).innerText);
    }
    const htmlDom = ref.current.querySelector("code.language-html");
    const refText = ref.current.querySelector("code")?.innerText;
    if (htmlDom) {
      setHtmlCode((htmlDom as HTMLElement).innerText);
    } else if (
      refText?.startsWith("<!DOCTYPE") ||
      refText?.startsWith("<svg") ||
      refText?.startsWith("<?xml")
    ) {
      setHtmlCode(refText);
    }
  }, 600);

  const config = useAppConfig();
  const enableArtifacts =
    session.mask?.enableArtifacts !== false && config.enableArtifacts;

  //Wrap the paragraph for plain-text
  useEffect(() => {
    if (ref.current) {
      const codeElements = ref.current.querySelectorAll(
        "code",
      ) as NodeListOf<HTMLElement>;
      const wrapLanguages = [
        "",
        "md",
        "markdown",
        "text",
        "txt",
        "plaintext",
        "tex",
        "latex",
      ];
      codeElements.forEach((codeElement) => {
        let languageClass = codeElement.className.match(/language-(\w+)/);
        let name = languageClass ? languageClass[1] : "";
        if (wrapLanguages.includes(name)) {
          codeElement.style.whiteSpace = "pre-wrap";
        }
      });
      setTimeout(renderArtifacts, 1);
    }
  }, []);

  return (
    <>
      <pre ref={ref}>
        <span
          className="copy-code-button"
          onClick={() => {
            if (ref.current) {
              copyToClipboard(
                ref.current.querySelector("code")?.innerText ?? "",
              );
            }
          }}
        ></span>
        {props.children}
      </pre>
      {mermaidCode.length > 0 && (
        <Mermaid code={mermaidCode} key={mermaidCode} />
      )}
      {htmlCode.length > 0 && enableArtifacts && (
        <FullScreen className="no-dark html" right={70}>
          <ArtifactsShareButton
            style={{ position: "absolute", right: 20, top: 10 }}
            getCode={() => htmlCode}
          />
          <IconButton
            style={{ position: "absolute", right: 120, top: 10 }}
            bordered
            icon={<ReloadButtonIcon />}
            shadow
            onClick={() => previewRef.current?.reload()}
          />
          <HTMLPreview
            ref={previewRef}
            code={htmlCode}
            autoHeight={!document.fullscreenElement}
            height={!document.fullscreenElement ? 600 : height}
          />
        </FullScreen>
      )}
    </>
  );
}

function CustomCode(props: { children: any; className?: string }) {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const config = useAppConfig();
  const enableCodeFold =
    session.mask?.enableCodeFold !== false && config.enableCodeFold;

  const ref = useRef<HTMLPreElement>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const codeHeight = ref.current.scrollHeight;
      setShowToggle(codeHeight > 400);
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [props.children]);

  const toggleCollapsed = () => {
    setCollapsed((collapsed) => !collapsed);
  };
  const renderShowMoreButton = () => {
    if (showToggle && enableCodeFold && collapsed) {
      return (
        <div
          className={clsx("show-hide-button", {
            collapsed,
            expanded: !collapsed,
          })}
        >
          <button onClick={toggleCollapsed}>{Locale.NewChat.More}</button>
        </div>
      );
    }
    return null;
  };
  return (
    <>
      <code
        className={clsx(props?.className)}
        ref={ref}
        style={{
          maxHeight: enableCodeFold && collapsed ? "400px" : "none",
          overflowY: "hidden",
        }}
      >
        {props.children}
      </code>

      {renderShowMoreButton()}
    </>
  );
}

function escapeBrackets(text: string) {
  const pattern =
    /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  return text.replace(
    pattern,
    (match, codeBlock, squareBracket, roundBracket) => {
      if (codeBlock) {
        return codeBlock;
      } else if (squareBracket) {
        return `$$${squareBracket}$$`;
      } else if (roundBracket) {
        return `$${roundBracket}$`;
      }
      return match;
    },
  );
}

function tryWrapHtmlCode(text: string) {
  // try add wrap html code (fixed: html codeblock include 2 newline)
  // ignore embed codeblock
  if (text.includes("```")) {
    return text;
  }
  return text
    .replace(
      /([`]*?)(\w*?)([\n\r]*?)(<!DOCTYPE html>)/g,
      (match, quoteStart, lang, newLine, doctype) => {
        return !quoteStart ? "\n```html\n" + doctype : match;
      },
    )
    .replace(
      /(<\/body>)([\r\n\s]*?)(<\/html>)([\n\r]*)([`]*)([\n\r]*?)/g,
      (match, bodyEnd, space, htmlEnd, newLine, quoteEnd) => {
        return !quoteEnd ? bodyEnd + space + htmlEnd + "\n```\n" : match;
      },
    );
}

// Split content into paragraphs while preserving code blocks
function splitContentIntoParagraphs(content: string) {
  // Check for unclosed code blocks
  const codeBlockStartCount = (content.match(/```/g) || []).length;
  let processedContent = content;

  // Add closing tag if there's an odd number of code block markers
  if (codeBlockStartCount % 2 !== 0) {
    processedContent = content + "\n```";
  }

  // Extract code blocks
  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeBlocks: string[] = [];
  let codeBlockCounter = 0;

  // Replace code blocks with placeholders
  const contentWithPlaceholders = processedContent.replace(
    codeBlockRegex,
    (match) => {
      codeBlocks.push(match);
      const placeholder = `__CODE_BLOCK_${codeBlockCounter++}__`;
      return placeholder;
    },
  );

  // Split by double newlines
  const paragraphs = contentWithPlaceholders
    .split(/\n\n+/)
    .filter((p) => p.trim());

  // Restore code blocks
  return paragraphs.map((p) => {
    if (p.match(/__CODE_BLOCK_\d+__/)) {
      return p.replace(/__CODE_BLOCK_\d+__/g, (match) => {
        const index = parseInt(match.match(/\d+/)?.[0] || "0");
        return codeBlocks[index] || match;
      });
    }
    return p;
  });
}

// Lazy-loaded paragraph component
function MarkdownParagraph({
  content,
  onLoad,
}: {
  content: string;
  onLoad?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (placeholderRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1, rootMargin: "200px 0px" },
      );
      observer.observe(placeholderRef.current);
    }
    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && !isLoaded) {
      setIsLoaded(true);
      onLoad?.();
    }
  }, [isVisible, isLoaded, onLoad]);

  // Generate preview content
  const previewContent = useMemo(() => {
    if (content.startsWith("```")) {
      return "```" + (content.split("\n")[0] || "").slice(3) + "...```";
    }
    return content.length > 60 ? content.slice(0, 60) + "..." : content;
  }, [content]);

  return (
    <div className="markdown-paragraph" ref={placeholderRef}>
      {!isLoaded ? (
        <div className="markdown-paragraph-placeholder">{previewContent}</div>
      ) : (
        <_MarkDownContent content={content} />
      )}
    </div>
  );
}

// Memoized paragraph component to prevent unnecessary re-renders
const MemoizedMarkdownParagraph = React.memo(
  ({ content }: { content: string }) => {
    return <_MarkDownContent content={content} />;
  },
  (prevProps, nextProps) => prevProps.content === nextProps.content,
);

MemoizedMarkdownParagraph.displayName = "MemoizedMarkdownParagraph";

// Specialized component for streaming content
function StreamingMarkdownContent({ content }: { content: string }) {
  const paragraphs = useMemo(
    () => splitContentIntoParagraphs(content),
    [content],
  );
  const lastParagraphRef = useRef<HTMLDivElement>(null);

  return (
    <div className="markdown-streaming-content">
      {paragraphs.map((paragraph, index) => (
        <div
          key={`p-${index}-${paragraph.substring(0, 20)}`}
          className="markdown-paragraph markdown-streaming-paragraph"
          ref={index === paragraphs.length - 1 ? lastParagraphRef : null}
        >
          <MemoizedMarkdownParagraph content={paragraph} />
        </div>
      ))}
    </div>
  );
}

function _MarkDownContent(props: { content: string }) {
  const escapedContent = useMemo(() => {
    return tryWrapHtmlCode(escapeBrackets(props.content));
  }, [props.content]);

  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[
        RehypeKatex,
        [
          RehypeHighlight,
          {
            detect: false,
            ignoreMissing: true,
          },
        ],
      ]}
      components={{
        pre: PreCode,
        code: CustomCode,
        p: (pProps) => <p {...pProps} dir="auto" />,
        a: (aProps) => {
          const href = aProps.href || "";
          if (/\.(aac|mp3|opus|wav)$/.test(href)) {
            return (
              <figure>
                <audio controls src={href}></audio>
              </figure>
            );
          }
          if (/\.(3gp|3g2|webm|ogv|mpeg|mp4|avi)$/.test(href)) {
            return (
              <video controls width="99.9%">
                <source src={href} />
              </video>
            );
          }
          const isInternal = /^\/#/i.test(href);
          const target = isInternal ? "_self" : aProps.target ?? "_blank";
          return <a {...aProps} target={target} />;
        },
      }}
    >
      {escapedContent}
    </ReactMarkdown>
  );
}

export const MarkdownContent = React.memo(_MarkDownContent);

export function Markdown(
  props: {
    content: string;
    loading?: boolean;
    fontSize?: number;
    fontFamily?: string;
    parentRef?: RefObject<HTMLDivElement>;
    defaultShow?: boolean;
    immediatelyRender?: boolean;
    streaming?: boolean; // Whether this is a streaming response
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const mdRef = useRef<HTMLDivElement>(null);
  const paragraphs = useMemo(
    () => splitContentIntoParagraphs(props.content),
    [props.content],
  );
  const [loadedCount, setLoadedCount] = useState(0);

  // Determine rendering strategy based on props
  const shouldAsyncRender =
    !props.immediatelyRender && !props.streaming && paragraphs.length > 1;

  useEffect(() => {
    // Immediately render all paragraphs if specified
    if (props.immediatelyRender) {
      setLoadedCount(paragraphs.length);
    }
  }, [props.immediatelyRender, paragraphs.length]);

  return (
    <div
      className="markdown-body"
      style={{
        fontSize: `${props.fontSize ?? 14}px`,
        fontFamily: props.fontFamily || "inherit",
      }}
      ref={mdRef}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
      dir="auto"
    >
      {props.loading ? (
        <LoadingIcon />
      ) : props.streaming ? (
        // Use specialized component for streaming content
        <StreamingMarkdownContent content={props.content} />
      ) : shouldAsyncRender ? (
        <div className="markdown-content">
          {paragraphs.map((paragraph, index) => (
            <MarkdownParagraph
              key={index}
              content={paragraph}
              onLoad={() => setLoadedCount((prev) => prev + 1)}
            />
          ))}
          {loadedCount < paragraphs.length && loadedCount > 0 && (
            <div className="markdown-paragraph-loading">
              <LoadingIcon />
            </div>
          )}
        </div>
      ) : (
        <MarkdownContent content={props.content} />
      )}
    </div>
  );
}
