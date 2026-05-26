/**
 * ActorChat - 角色快速切换器
 *
 * 在聊天界面底部工具栏显示当前角色，点击后弹出角色选择器。
 * 选择角色后会将该 Skill 的上下文和模型配置应用到当前会话。
 */

import React, { useState } from "react";
import { useChatStore } from "../store";
import { ALL_SKILLS } from "../skills";
import { BuiltinMask } from "../masks/typing";
import { Avatar } from "./emoji";
import { Selector } from "./ui-lib";
import MaskIcon from "../icons/mask.svg";
import styles from "./chat.module.scss";

interface RoleSwitcherProps {
  /** 用于在 ChatActions 中渲染成统一风格的 ChatAction 包装 */
  renderAction: (props: {
    text: string;
    icon: React.ReactNode;
    onClick: () => void;
  }) => React.ReactNode;
}

export function RoleSwitcher({ renderAction }: RoleSwitcherProps) {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const currentRoleName = session.mask.name;

  const [showSelector, setShowSelector] = useState(false);

  function applySkill(skill: BuiltinMask) {
    chatStore.updateTargetSession(session, (s) => {
      // 应用角色名称和头像
      s.mask.name = skill.name;
      s.mask.avatar = skill.avatar;
      // 替换上下文（系统提示词）
      s.mask.context = skill.context.map((msg) => ({
        ...msg,
        id: msg.id + "-" + Date.now(),
      }));
      // 合并模型配置（仅覆盖 Skill 中明确设置的字段）
      s.mask.modelConfig = {
        ...s.mask.modelConfig,
        ...skill.modelConfig,
      };
      // 切换角色后重置会话标题
      s.topic = skill.name;
    });
  }

  const selectorItems = ALL_SKILLS.map((skill) => ({
    title: skill.name,
    subTitle: extractFirstLine(skill.context[0]?.content ?? ""),
    value: skill.name,
  }));

  return (
    <>
      {renderAction({
        text: currentRoleName || "切换角色",
        icon: <MaskIcon />,
        onClick: () => setShowSelector(true),
      })}

      {showSelector && (
        <Selector
          defaultSelectedValue={currentRoleName}
          items={selectorItems}
          onSelection={(names) => {
            const selected = ALL_SKILLS.find((s) => s.name === names[0]);
            if (selected) applySkill(selected);
          }}
          onClose={() => setShowSelector(false)}
        />
      )}
    </>
  );
}

/** 提取系统提示词第一行作为副标题（截断到 40 字符） */
function extractFirstLine(content: string): string {
  const first = content.split("\n").find((l) => l.trim().length > 0) ?? "";
  return first.length > 40 ? first.slice(0, 40) + "…" : first;
}
