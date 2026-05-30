/**
 * ActorAIchat — Skills 系统
 *
 * 所有角色均从 agency-agents 子模块动态加载。
 * 语言切换由 getAgencyAgents() 根据当前 UI 语言自动过滤。
 */

import { BuiltinMask } from "../masks/typing";

export { type BuiltinMask as Skill } from "../masks/typing";

/**
 * 获取所有 agency agents，按当前 UI 语言过滤（zh/en）。
 * 若无匹配语言的角色则回退到英文。
 */
export function getAgencyAgents(): BuiltinMask[] {
  const { BUILTIN_MASKS } = require("../masks");
  const { getLang } = require("../locales");
  const currentLang = getLang();

  const agents = BUILTIN_MASKS.filter(
    (m: any) => m.category && typeof m.category === "string",
  );

  const langFiltered = agents.filter((a: any) => a.lang === currentLang);
  if (langFiltered.length > 0) return langFiltered;
  return agents.filter((a: any) => a.lang === "en" || !a.lang);
}

/**
 * 默认 Skill — 通用 AI 助手，作为没有匹配角色时的 fallback。
 */
export const DEFAULT_SKILL: BuiltinMask = {
  avatar: "1f916",
  name: "通用 AI",
  context: [
    {
      id: "default-0",
      role: "system",
      content:
        "你是 ActorAIchat 的默认 AI 助手，具备深度推理能力。请根据用户的问题提供高质量、结构化的回答。",
      date: "",
    },
  ],
  modelConfig: {
    model: "deepseek-v4-pro",
    temperature: 0.7,
    max_tokens: 4000,
    presence_penalty: 0,
    frequency_penalty: 0,
    sendMemory: true,
    historyMessageCount: 20,
    compressMessageLengthThreshold: 2000,
  },
  lang: "cn",
  builtin: true,
  createdAt: 1700000000001,
};

/** @deprecated — 仅兼容旧代码，请使用 getAgencyAgents() */
export function findSkillByName(name: string): BuiltinMask | undefined {
  return getAgencyAgents().find((s) => s.name === name) || DEFAULT_SKILL;
}
