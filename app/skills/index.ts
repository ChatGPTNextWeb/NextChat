/**
 * ActorChat Skills 系统 - 核心入口
 *
 * 这里统一导出所有角色 Skill 定义。
 * 要添加新角色：
 *   1. 在 ./roles/ 目录下创建新文件（参考现有文件格式）
 *   2. 在此文件导入并加入 ALL_SKILLS 数组
 *   3. 无需修改其他任何核心代码
 */

import { BuiltinMask } from "../masks/typing";

// ---- 导入各角色 Skill ----
import { GENERAL_SKILL } from "./roles/general";
import { OPERATIONS_SKILL } from "./roles/operations";
import { PROGRAMMER_SKILL } from "./roles/programmer";
import { PRODUCT_MANAGER_SKILL } from "./roles/product-manager";
import { SALES_SKILL } from "./roles/sales";
import { ENGINEER_SKILL } from "./roles/engineer";
import { ARTIST_SKILL } from "./roles/artist";
import { DESIGNER_SKILL } from "./roles/designer";
import { TEACHER_SKILL } from "./roles/teacher";

/**
 * 所有 Skill 的注册列表。
 * 顺序决定在 UI 中的展示顺序。
 * GENERAL_SKILL 始终排在第一位作为默认角色。
 */
export const ALL_SKILLS: BuiltinMask[] = [
  GENERAL_SKILL,
  OPERATIONS_SKILL,
  PROGRAMMER_SKILL,
  PRODUCT_MANAGER_SKILL,
  SALES_SKILL,
  ENGINEER_SKILL,
  ARTIST_SKILL,
  DESIGNER_SKILL,
  TEACHER_SKILL,
];

/**
 * 通过 skill 名称查找对应定义
 */
export function findSkillByName(name: string): BuiltinMask | undefined {
  return ALL_SKILLS.find((s) => s.name === name);
}

/**
 * 默认 Skill（通用 AI）
 */
export const DEFAULT_SKILL = GENERAL_SKILL;

export type { BuiltinMask as Skill };
