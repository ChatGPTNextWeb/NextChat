/**
 * ActorAIchat - 角色快速切换器
 *
 * 在聊天界面底部工具栏显示当前角色，点击后弹出角色选择器。
 * 选择角色后会将该 Skill/Agent 的上下文和模型配置应用到当前会话。
 * 支持核心技能和 Agency Agents 子模块的 184+ 专业角色。
 */

import React, { useEffect, useMemo, useState } from "react";
import { useChatStore } from "../store";
import { getAgencyAgents, DEFAULT_SKILL } from "../skills";
import { BuiltinMask } from "../masks/typing";
import MaskIcon from "../icons/mask.svg";
import styles from "./role-switcher.module.scss";

interface RoleSwitcherProps {
  renderAction: (props: {
    text: string;
    icon: React.ReactNode;
    onClick: () => void;
  }) => React.ReactNode;
}

interface GroupedItems {
  category: string;
  items: Array<{
    title: string;
    subTitle: string;
    value: string;
  }>;
}

export function RoleSwitcher({ renderAction }: RoleSwitcherProps) {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const currentRoleName = session.mask.name;

  const [showSelector, setShowSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Re-compute when agency agents load asynchronously
  const [loaded, setLoaded] = useState(0);
  useEffect(() => {
    const handler = () => setLoaded((n) => n + 1);
    window.addEventListener("agency-agents-loaded", handler);
    return () => window.removeEventListener("agency-agents-loaded", handler);
  }, []);

  const allSkills = useMemo(() => {
    const agents = getAgencyAgents();
    if (agents.length === 0) {
      return [
        {
          skill: DEFAULT_SKILL,
          category: "core",
          categoryLabel: "通用",
        },
      ];
    }
    return agents.map((agent) => ({
      skill: agent,
      category: agent.category || "other",
      categoryLabel: formatCategoryLabel(agent.category || "other"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return allSkills;
    const q = searchQuery.toLowerCase();
    return allSkills.filter(
      (s) =>
        s.skill.name.toLowerCase().includes(q) ||
        (s.skill as any).description?.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q),
    );
  }, [allSkills, searchQuery]);

  const groupedItems: GroupedItems[] = useMemo(() => {
    const groupMap = new Map<string, BuiltinMask[]>();
    for (const { skill, categoryLabel } of filteredSkills) {
      const existing = groupMap.get(categoryLabel) || [];
      existing.push(skill);
      groupMap.set(categoryLabel, existing);
    }

    return Array.from(groupMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([categoryLabel, skills]) => ({
        category: categoryLabel,
        items: skills.map((skill) => ({
          title: skill.name,
          subTitle:
            (skill as any).description ||
            extractFirstLine(
              typeof skill.context[0]?.content === "string"
                ? skill.context[0].content
                : "",
            ),
          value: skill.name,
        })),
      }));
  }, [filteredSkills]);

  function applySkill(skill: BuiltinMask) {
    chatStore.updateTargetSession(session, (s) => {
      s.mask.name = skill.name;
      s.mask.avatar = skill.avatar;
      s.mask.context = skill.context.map((msg) => ({
        ...msg,
        id: msg.id + "-" + Date.now(),
      }));
      s.mask.modelConfig = {
        ...s.mask.modelConfig,
        ...skill.modelConfig,
      };
      s.topic = skill.name;
    });
  }

  return (
    <>
      {renderAction({
        text: currentRoleName || "切换角色",
        icon: <MaskIcon />,
        onClick: () => setShowSelector(true),
      })}

      {showSelector && (
        <div
          className={styles["role-overlay"]}
          onClick={() => setShowSelector(false)}
        >
          <div
            className={styles["role-selector"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["search-bar"]}>
              <input
                type="text"
                className={styles["search-input"]}
                placeholder="搜索角色..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {allSkills.length > 0 && (
                <span className={styles["count-badge"]}>
                  {filteredSkills.length}/{allSkills.length}
                </span>
              )}
            </div>

            <div className={styles["role-list"]}>
              {groupedItems.map((group) => (
                <div key={group.category} className={styles["role-group"]}>
                  <div className={styles["group-header"]}>
                    {group.category}
                    <span className={styles["group-count"]}>
                      {group.items.length}
                    </span>
                  </div>
                  {group.items.map((item) => (
                    <div
                      key={item.value}
                      className={`${styles["role-item"]} ${
                        item.value === currentRoleName
                          ? styles["role-item-selected"]
                          : ""
                      }`}
                      onClick={() => {
                        const selected = allSkills.find(
                          (s) => s.skill.name === item.value,
                        );
                        if (selected) {
                          applySkill(selected.skill);
                          setShowSelector(false);
                          setSearchQuery("");
                        }
                      }}
                    >
                      <div className={styles["role-item-name"]}>
                        {item.title}
                      </div>
                      {item.subTitle && (
                        <div className={styles["role-item-desc"]}>
                          {item.subTitle}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              {groupedItems.length === 0 && (
                <div className={styles["no-results"]}>没有找到匹配的角色</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function formatCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    academic: "学术研究",
    design: "设计",
    engineering: "工程开发",
    finance: "金融财务",
    "game-development": "游戏开发",
    marketing: "市场营销",
    "paid-media": "付费媒体",
    product: "产品管理",
    "project-management": "项目管理",
    sales: "销售",
    "spatial-computing": "空间计算",
    specialized: "专业服务",
    strategy: "战略",
    support: "支持运营",
    testing: "测试质保",
  };
  return labels[category] || category;
}

function extractFirstLine(content: string): string {
  const first = content.split("\n").find((l) => l.trim().length > 0) ?? "";
  return first.length > 40 ? first.slice(0, 40) + "…" : first;
}
