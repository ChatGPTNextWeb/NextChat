import React from "react";

export default function AskTalkCard() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 rounded-3xl border border-gray-800/40 bg-gradient-to-b from-[#0a0a0a] to-[#111] shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)] transition-all duration-300 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.1)]">
      <h1 className="text-3xl font-semibold mb-4 text-white/90">
        What would you like to do?
      </h1>
      <div className="flex gap-6 mt-6">
        <button className="px-8 py-3 rounded-full text-lg font-medium bg-white/10 text-white/90 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10">
          Ask
        </button>
        <button className="px-8 py-3 rounded-full text-lg font-medium bg-white text-black hover:bg-gray-200 transition-all duration-300">
          Talk
        </button>
      </div>
    </div>
  );
}
