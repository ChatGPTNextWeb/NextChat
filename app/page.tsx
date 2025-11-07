"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Send } from "lucide-react";
import { FeatureButton } from "@/components/feature-button";
import Image from "next/image";

export default function Home() {
  const [message, setMessage] = useState("");
  const [active, setActive] = useState("chat");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    const maxHeight = 160;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    setMessage(textarea.value);
  };

  // Reset height when cleared
  useEffect(() => {
    if (textareaRef.current && message === "") {
      textareaRef.current.style.height = "auto";
    }
  }, [message]);

  const features = [
    { key: "chat", label: "Chat" },
    { key: "talk", label: "Talk" },
  ];

  return (
    <div className="flex flex-col items-center justify-end min-h-[95vh] w-full bg-transparent py-6 max-w-5xl mx-auto">
      {active === "talk" ? (
        <div className="flex items-center justify-center w-xs md:w-6xl max-w-7xl ">
          <h1 className="text-3xl md:text-6xl text-white text-center font-bold w-full">
            What can I help you with?
          </h1>
        </div>
      ) : (
        <div className="flex items-center justify-center mb-72 w-xs md:w-6xl max-w-7xl">
          <h1 className="text-3xl md:text-6xl text-red-white text-center font-bold">
            What can I help you with?
          </h1>
        </div>
      )}

      {/* 👇 Show avatar only when Talk tab is active */}
      {active === "talk" && (
        <Image
          src="/avatar.png"
          width={700}
          height={100}
          alt="avatar"
          className="mb-5"
        />
      )}

      {/* Input area */}
      <div className="flex items-center justify-center w-full pb-5 px-5 lg:mx-20 bg-transparent">
        <form className="w-full flex justify-center items-center">
          <div className="w-full flex flex-row items-center bg-transparent px-3 md:px-5 border rounded-md gap-3 py-3 md:py-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <input id="file-upload" type="file" className="hidden" />
              <Paperclip className="w-5 h-5" />
            </label>

            <textarea
              id="message"
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={handleInput}
              className="grow w-full min-w-[150px] md:min-w-[350px] max-h-40 py-3 md:py-4 px-3 md:px-4 rounded-md bg-background text-foreground outline-none resize-none placeholder:text-muted-foreground overflow-y-auto"
              placeholder="Ask Anything..."
            />

            <button
              type="button"
              className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Feature buttons */}
      <div className="flex w-full justify-center items-center gap-2">
        {features.map((f) => (
          <FeatureButton
            key={f.key}
            label={f.label}
            active={active === f.key}
            onClick={() => setActive(f.key)}
          />
        ))}
      </div>
    </div>
  );
}
