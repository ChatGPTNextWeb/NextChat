# ActorChat — Skills 扩展指南

## 概览

Skills 是 ActorChat 的角色定义系统，每个 Skill 代表一个 AI 角色，包含：

- **系统提示词**：定义角色的专业背景、能力边界、回答风格
- **模型参数**：针对该角色的最优 temperature / max_tokens 等配置
- **示例对话**：引导模型快速进入角色状态的 few-shot 上下文

Skills 与 ActorAIchat 核心代码完全解耦，所有角色定义集中在 `app/skills/` 目录中维护。

---

## 目录结构

```
app/skills/
├── index.ts              ← 注册中心（唯一需要修改的文件）
└── roles/
    ├── general.ts        ← 通用 AI
    ├── operations.ts     ← 运营专家
    ├── programmer.ts     ← 程序员
    ├── product-manager.ts← 产品经理
    ├── sales.ts          ← 销售顾问
    ├── engineer.ts       ← 工程师
    ├── artist.ts         ← 美术创作者
    ├── designer.ts       ← UI/UX 设计师
    └── teacher.ts        ← 教师助手
```

---

## 添加新角色（5 分钟完成）

### 第 1 步：创建角色文件

在 `app/skills/roles/` 下创建新文件，例如 `lawyer.ts`：

```ts
import { BuiltinMask } from "../../masks/typing";

export const LAWYER_SKILL: BuiltinMask = {
  avatar: "2696-fe0f",         // emoji unicode，可在 https://emojipedia.org 查找
  name: "法律顾问",              // 显示在角色切换器中的名称

  context: [
    {
      id: "lawyer-0",
      role: "system",           // 系统提示词：定义角色核心能力
      content: `你是一位经验丰富的律师...（详细提示词）`,
      date: "",
    },
    {
      id: "lawyer-1",
      role: "user",             // 示例用户开场白（可选，增加 few-shot 效果）
      content: "我遇到了一个法律问题需要咨询",
      date: "",
    },
    {
      id: "lawyer-2",
      role: "assistant",        // 示例助手回复（可选）
      content: "您好，请描述您的问题...",
      date: "",
    },
  ],

  modelConfig: {
    model: "gpt-4o",
    temperature: 0.4,           // 法律场景要求精确，偏低
    max_tokens: 6000,
    presence_penalty: 0,
    frequency_penalty: 0,
    sendMemory: true,
    historyMessageCount: 20,
    compressMessageLengthThreshold: 2000,
  },

  lang: "cn",
  builtin: true,
  createdAt: 1700000000010,     // 时间戳，保证唯一递增即可
};
```

### 第 2 步：在注册中心添加引用

编辑 `app/skills/index.ts`，添加两行：

```ts
// 1. 在文件顶部导入区添加：
import { LAWYER_SKILL } from "./roles/lawyer";

// 2. 在 ALL_SKILLS 数组中添加：
export const ALL_SKILLS: BuiltinMask[] = [
  GENERAL_SKILL,
  OPERATIONS_SKILL,
  // ...已有角色...
  LAWYER_SKILL,   // ← 添加到末尾
];
```

### 第 3 步：重新构建面具列表

```bash
yarn mask
# 或开发模式下自动监听：yarn dev
```

完成！角色切换器中会立即出现新角色。

---

## Skill 字段说明

### context 消息角色

| role        | 用途                                |
|-------------|-------------------------------------|
| `system`    | 系统提示词，定义 AI 的角色和能力       |
| `user`      | 用户示例（few-shot）                  |
| `assistant` | 助手示例（few-shot）                  |

系统提示词可以有多条（按顺序叠加），例如先设定基础人格，再补充具体场景规则。

### modelConfig 参数调优

| 参数 | 范围 | 建议策略 |
|------|------|----------|
| `temperature` | 0–2 | 创意类（写作/艺术）→ 0.8–1.0；分析类（编程/法律）→ 0.2–0.5 |
| `max_tokens` | 1–8192 | 代码/文档生成用 6000–8000；快速问答用 2000–4000 |
| `historyMessageCount` | 0–64 | 需要长记忆的角色（教师/顾问）→ 25–30；独立问答→ 10–15 |
| `compressMessageLengthThreshold` | 500–5000 | 上下文压缩阈值，值越小越激进 |
| `sendMemory` | bool | 长对话角色设为 `true`，短问答可设 `false` |

---

## 优化 Skill 质量的最佳实践

### 1. 系统提示词结构化

推荐使用以下结构（参考内置 Skill）：

```
[角色定位] 你是...（一句话概括）

**专业能力**
- 能力点 1
- 能力点 2

**工作风格/原则**
- 原则 1
- 原则 2

**输出规范**（可选）
- 格式要求
- 质量标准
```

### 2. 善用 few-shot 对话

在 `context` 中加入 1–2 轮示例对话，可以显著提升模型的角色一致性，尤其是：
- 展示角色如何主动收集信息
- 展示角色的回答风格和格式
- 示范如何处理模糊需求

### 3. 避免常见问题

| 问题 | 现象 | 解决方案 |
|------|------|----------|
| 系统提示词过短 | 角色感不强，容易跑偏 | 增加能力边界和行为规范说明 |
| temperature 过高 | 专业角色回答随意 | 分析类角色建议 ≤ 0.5 |
| 上下文太长 | token 消耗快 | 适当降低 `historyMessageCount` 并开启压缩 |
| 缺少澄清引导 | 需求不明时乱猜 | 在 few-shot 中演示主动提问行为 |

---

## 删除或禁用角色

只需在 `app/skills/index.ts` 的 `ALL_SKILLS` 数组中删除或注释对应条目，然后重新执行 `yarn mask`。不需要删除角色文件本身。

---

## 上下文管理说明

ActorAIchat 继承了上下文管理机制：

- **持久记忆**：通过 `sendMemory: true` + `memoryPrompt` 实现跨多轮的记忆摘要
- **手动清空**：工具栏"清除上下文"按钮插入分隔符，之前的消息不再发送给模型
- **自动压缩**：当消息长度超过 `compressMessageLengthThreshold` 时，自动调用压缩模型生成摘要替换历史记录
- **上下文窗口**：`historyMessageCount` 控制每次请求携带的历史消息数量

压缩模型可在设置中独立配置（`compressModel` / `compressProviderName`），推荐使用速度快、成本低的模型（如 gpt-4o-mini）执行压缩任务。
