/**
 * Convert agency-agents .md files to BuiltinMask-compatible JSON.
 *
 * Generates two files:
 *   public/agency-agents.json     — English original names
 *   public/agency-agents-zh.json  — Chinese translated names + descriptions
 *
 * Full agent body content is preserved as system prompt context.
 */

import fs from "fs";
import path from "path";

// ---- Types ----

interface AgencyAgentMask {
  avatar: string;
  name: string;
  description: string;
  color: string;
  vibe: string;
  context: Array<{
    id: string;
    role: "system";
    content: string;
    date: string;
  }>;
  hideContext?: boolean;
  modelConfig: {
    model: string;
    providerName: string;
    temperature: number;
    max_tokens: number;
    presence_penalty: number;
    frequency_penalty: number;
    sendMemory: boolean;
    historyMessageCount: number;
    compressMessageLengthThreshold: number;
    compressModel: string;
    compressProviderName: string;
  };
  lang: string;
  builtin: boolean;
  category: string;
  createdAt: number;
}

interface ZhEntry {
  name: string;
  description: string;
}

// ---- Constants ----

const AGENCY_DIR = path.join(__dirname, "..", "agency-agents");

const AGENT_DIRS = [
  "academic",
  "design",
  "engineering",
  "finance",
  "game-development",
  "marketing",
  "paid-media",
  "product",
  "project-management",
  "sales",
  "spatial-computing",
  "specialized",
  "strategy",
  "support",
  "testing",
];

const DEFAULT_MODEL_CONFIG = {
  model: "deepseek-v4-pro",
  providerName: "DeepSeek",
  temperature: 0.7,
  max_tokens: 4000,
  presence_penalty: 0,
  frequency_penalty: 0,
  sendMemory: true,
  historyMessageCount: 20,
  compressMessageLengthThreshold: 2000,
  compressModel: "deepseek-v4-pro",
  compressProviderName: "DeepSeek",
};

/** Embedded Chinese translation map (from agency-agents/scripts/i18n/agent-names-zh.json) */
const ZH_MAP: Record<string, ZhEntry> = {
  "Frontend Developer": {
    name: "前端开发工程师",
    description:
      "专注现代 Web 技术、React/Vue/Angular 框架、UI 实现与性能优化的前端专家",
  },
  "Backend Architect": {
    name: "后端架构师",
    description: "负责 API 设计、数据库架构与可扩展性的后端系统专家",
  },
  "Mobile App Builder": {
    name: "移动端开发工程师",
    description: "iOS/Android、React Native、Flutter 跨平台移动应用构建者",
  },
  "AI Engineer": {
    name: "AI 工程师",
    description: "机器学习模型部署、AI 集成与数据管道专家",
  },
  "DevOps Automator": {
    name: "DevOps 自动化工程师",
    description: "CI/CD、基础设施自动化与云运营专家",
  },
  "Rapid Prototyper": {
    name: "快速原型工程师",
    description: "快速 POC 开发、MVP 与迭代验证专家",
  },
  "Senior Developer": {
    name: "高级开发工程师",
    description: "Laravel/Livewire、复杂模式与架构决策专家",
  },
  "Security Engineer": {
    name: "安全工程师",
    description: "威胁建模、安全代码审查与应用安全架构专家",
  },
  "Autonomous Optimization Architect": {
    name: "自主优化架构师",
    description: "LLM 路由、成本优化与影子测试专家",
  },
  "Embedded Firmware Engineer": {
    name: "嵌入式固件工程师",
    description: "裸金属、RTOS、ESP32/STM32/Nordic 固件开发专家",
  },
  "Incident Response Commander": {
    name: "故障响应指挥官",
    description: "事件管理、故障复盘与值班应急专家",
  },
  "Solidity Smart Contract Engineer": {
    name: "Solidity 智能合约工程师",
    description: "EVM 合约、Gas 优化与 DeFi 协议专家",
  },
  "Technical Writer": {
    name: "技术文档工程师",
    description: "开发者文档、API 参考手册与教程撰写专家",
  },
  "Threat Detection Engineer": {
    name: "威胁检测工程师",
    description: "SIEM 规则、威胁狩猎与 ATT&CK 映射专家",
  },
  "WeChat Mini Program Developer": {
    name: "微信小程序开发工程师",
    description: "微信生态、小程序与支付集成开发专家",
  },
  "Code Reviewer": {
    name: "代码审查工程师",
    description: "建设性代码审查、安全与可维护性评估专家",
  },
  "Database Optimizer": {
    name: "数据库优化工程师",
    description: "Schema 设计、查询优化与索引策略专家",
  },
  "Git Workflow Master": {
    name: "Git 工作流专家",
    description: "分支策略、规范提交与高级 Git 操作专家",
  },
  "Software Architect": {
    name: "软件架构师",
    description: "系统设计、DDD、架构模式与权衡分析专家",
  },
  SRE: {
    name: "站点可靠性工程师",
    description: "SLO、错误预算、可观测性与混沌工程专家",
  },
  "AI Data Remediation Engineer": {
    name: "AI 数据修复工程师",
    description: "自愈数据管道、离线 SLM 与语义聚类专家",
  },
  "Data Engineer": {
    name: "数据工程师",
    description: "数据管道、湖仓架构与 ETL/ELT 专家",
  },
  "Feishu Integration Developer": {
    name: "飞书集成开发工程师",
    description: "飞书/Lark 开放平台、机器人与工作流集成专家",
  },
  "CMS Developer": {
    name: "CMS 开发工程师",
    description: "WordPress/Drupal 主题、插件开发与内容架构专家",
  },
  "Codebase Onboarding Engineer": {
    name: "代码仓库入门工程师",
    description: "帮助新开发者快速熟悉代码仓库结构与行为的只读探索专家",
  },
  "Email Intelligence Engineer": {
    name: "邮件智能工程师",
    description: "邮件解析、MIME 提取与 AI Agent 结构化数据专家",
  },
  "Filament Optimization Specialist": {
    name: "Filament 优化专家",
    description: "Filament PHP 管理面板 UX 优化与表单/资源重构专家",
  },
  "Minimal Change Engineer": {
    name: "最小变更工程师",
    description: "用最少代码变更修复 bug 的精准编码专家",
  },
  "Voice AI Integration Engineer": {
    name: "语音 AI 集成工程师",
    description: "语音转文本管道、Whisper、ASR 与说话人分离专家",
  },
  "UI Designer": {
    name: "UI 设计师",
    description: "视觉设计、组件库与设计系统专家",
  },
  "UX Researcher": {
    name: "用户体验研究员",
    description: "用户测试、行为分析与可用性研究专家",
  },
  "UX Architect": {
    name: "用户体验架构师",
    description: "技术架构、CSS 系统与前端实现指导专家",
  },
  "Brand Guardian": {
    name: "品牌守护者",
    description: "品牌认知、一致性与品牌定位专家",
  },
  "Visual Storyteller": {
    name: "视觉叙事师",
    description: "视觉叙事、多媒体内容与品牌故事专家",
  },
  "Whimsy Injector": {
    name: "创意注入师",
    description: "品牌个性、微互动与趣味体验设计专家",
  },
  "Image Prompt Engineer": {
    name: "图像提示词工程师",
    description: "AI 图像生成提示词、摄影风格指令专家",
  },
  "Inclusive Visuals Specialist": {
    name: "包容性视觉专家",
    description: "多元化呈现、偏见消除与真实 AI 图像生成专家",
  },
  "Growth Hacker": {
    name: "增长黑客",
    description: "快速用户获取、病毒循环与实验驱动增长专家",
  },
  "Content Creator": {
    name: "内容创作者",
    description: "多平台内容策略、编辑日历与文案专家",
  },
  "Twitter Engager": {
    name: "Twitter 运营专家",
    description: "实时互动、思想领导力与推特策略专家",
  },
  "TikTok Strategist": {
    name: "TikTok 策略专家",
    description: "病毒内容、算法优化与 TikTok 增长专家",
  },
  "Instagram Curator": {
    name: "Instagram 运营专家",
    description: "视觉叙事、社区运营与 Instagram 策略专家",
  },
  "Reddit Community Builder": {
    name: "Reddit 社区运营",
    description: "真实互动、价值内容与 Reddit 营销专家",
  },
  "App Store Optimizer": {
    name: "应用商店优化专家",
    description: "ASO、转化率优化与应用曝光专家",
  },
  "Social Media Strategist": {
    name: "社交媒体策略师",
    description: "跨平台策略、营销活动与社媒整体规划专家",
  },
  "Xiaohongshu Specialist": {
    name: "小红书运营专家",
    description: "生活方式内容、趋势策略与小红书增长专家",
  },
  "WeChat Official Account Manager": {
    name: "微信公众号运营专家",
    description: "粉丝互动、内容营销与微信公众号策略专家",
  },
  "Zhihu Strategist": {
    name: "知乎运营专家",
    description: "思想领导力、知识驱动互动与知乎权威建立专家",
  },
  "Baidu SEO Specialist": {
    name: "百度 SEO 专家",
    description: "百度优化、中国 SEO 与 ICP 合规专家",
  },
  "Bilibili Content Strategist": {
    name: "Bilibili 内容策略师",
    description: "B站算法、弹幕文化与 UP 主成长专家",
  },
  "Carousel Growth Engine": {
    name: "轮播图增长引擎",
    description: "TikTok/Instagram 轮播图创作与自动发布专家",
  },
  "LinkedIn Content Creator": {
    name: "领英内容创作者",
    description: "个人品牌、思想领导力与领英专业内容专家",
  },
  "China E-Commerce Operator": {
    name: "中国电商运营专家",
    description: "淘宝/天猫/拼多多与直播电商运营专家",
  },
  "Kuaishou Strategist": {
    name: "快手运营策略师",
    description: "快手平台、老铁生态与下沉市场增长专家",
  },
  "SEO Specialist": {
    name: "SEO 专家",
    description: "技术 SEO、内容策略与外链建设专家",
  },
  "Book Co-Author": {
    name: "图书联合作者",
    description: "思想领导力书籍、代笔写作与出版策略专家",
  },
  "Cross-Border E-Commerce Specialist": {
    name: "跨境电商专家",
    description: "亚马逊/Shopee/Lazada 与跨境履约全链路专家",
  },
  "Douyin Strategist": {
    name: "抖音运营策略师",
    description: "抖音平台、短视频营销与算法增长专家",
  },
  "Livestream Commerce Coach": {
    name: "直播带货教练",
    description: "主播培训、直播间优化与转化提升专家",
  },
  "Podcast Strategist": {
    name: "播客策略师",
    description: "播客内容策略与平台运营专家",
  },
  "Private Domain Operator": {
    name: "私域运营专家",
    description: "企业微信、私域流量与社群运营专家",
  },
  "Short-Video Editing Coach": {
    name: "短视频剪辑教练",
    description: "后期制作、剪辑流程与平台规格优化专家",
  },
  "Weibo Strategist": {
    name: "微博运营策略师",
    description: "微博热搜、话题营销与粉丝互动专家",
  },
  "AI Citation Strategist": {
    name: "AI 引用策略师",
    description: "AEO/GEO、AI 推荐可见度与引用审计专家",
  },
  "Agentic Search Optimizer": {
    name: "AI 搜索优化专家",
    description: "LLM 搜索可见度、AI 回答引用与品牌提及优化专家",
  },
  "China Market Localization Strategist": {
    name: "中国市场本地化策略师",
    description: "中国市场准入、文化适配与本地化内容策略专家",
  },
  "Video Optimization Specialist": {
    name: "视频优化专家",
    description: "多平台视频格式适配、压缩效率与质量优化专家",
  },
  "Outbound Strategist": {
    name: "外呼销售策略师",
    description: "基于信号的精准找客、多渠道序列与 ICP 定位专家",
  },
  "Discovery Coach": {
    name: "销售发现教练",
    description: "SPIN、Gap Selling 与 Sandler 问题设计专家",
  },
  "Deal Strategist": {
    name: "商机策略师",
    description: "MEDDPICC 资格认定、竞争定位与赢单策略专家",
  },
  "Sales Engineer": {
    name: "售前工程师",
    description: "技术演示、POC 范围确定与竞争技术定位专家",
  },
  "Proposal Strategist": {
    name: "提案策略师",
    description: "RFP 响应、赢单主题与叙事结构专家",
  },
  "Pipeline Analyst": {
    name: "销售漏斗分析师",
    description: "预测、漏斗健康度、商机速度与 RevOps 专家",
  },
  "Account Strategist": {
    name: "客户策略师",
    description: "拓客留存、QBR 与利益相关者地图专家",
  },
  "Sales Coach": {
    name: "销售教练",
    description: "销售代表成长、通话辅导与管道审查促进专家",
  },
  "Bookkeeper & Controller": {
    name: "簿记与财务主管",
    description: "日常记账、财务报表与财务控制专家",
  },
  "Financial Analyst": {
    name: "金融分析师",
    description: "财务建模、估值分析与投资决策支持专家",
  },
  "FP&A Analyst": {
    name: "财务规划与分析分析师",
    description: "预算编制、预测建模与管理财务报告专家",
  },
  "Investment Researcher": {
    name: "投资研究员",
    description: "市场研究、投资标的筛选与尽职调查专家",
  },
  "Tax Strategist": {
    name: "税务策略师",
    description: "税务筹划、合规优化与跨境税务策略专家",
  },
  "PPC Campaign Strategist": {
    name: "竞价广告策略师",
    description: "Google/Microsoft/Amazon 广告、账户结构与出价专家",
  },
  "Search Query Analyst": {
    name: "搜索词分析师",
    description: "搜索词分析、否定关键词与意图映射专家",
  },
  "Paid Media Auditor": {
    name: "付费媒体审计师",
    description: "200+ 维度账户审计与竞争对手分析专家",
  },
  "Tracking & Measurement Specialist": {
    name: "追踪与埋点专家",
    description: "GTM、GA4、转化追踪与 CAPI 实施专家",
  },
  "Ad Creative Strategist": {
    name: "广告创意策略师",
    description: "RSA 文案、Meta 创意与 PMax 素材专家",
  },
  "Programmatic & Display Buyer": {
    name: "程序化广告购买专家",
    description: "GDN、DSP、合作媒体与 ABM 展示广告专家",
  },
  "Paid Social Strategist": {
    name: "付费社交策略师",
    description: "Meta/LinkedIn/TikTok 跨平台付费社交专家",
  },
  "Sprint Prioritizer": {
    name: "Sprint 优先级规划师",
    description: "敏捷规划、功能优先级与 Sprint 管理专家",
  },
  "Trend Researcher": {
    name: "市场趋势研究员",
    description: "市场情报、竞品分析与机会识别专家",
  },
  "Feedback Synthesizer": {
    name: "用户反馈综合分析师",
    description: "用户反馈分析、洞察提取与产品优先级专家",
  },
  "Behavioral Nudge Engine": {
    name: "行为助推引擎",
    description: "行为心理学、助推设计与用户激励专家",
  },
  "Product Manager": {
    name: "产品经理",
    description: "全生命周期产品管理：发现、PRD、路线图、GTM",
  },
  "Studio Producer": {
    name: "工作室制作人",
    description: "高层编排、投资组合管理与多项目监督专家",
  },
  "Project Shepherd": {
    name: "项目协调专家",
    description: "跨职能协调、时间轴管理与端到端项目统筹专家",
  },
  "Studio Operations": {
    name: "工作室运营专家",
    description: "日常效率优化、流程改进与生产支持专家",
  },
  "Experiment Tracker": {
    name: "实验追踪专家",
    description: "A/B 测试、假设验证与数据驱动决策专家",
  },
  "Senior Project Manager": {
    name: "高级项目经理",
    description: "现实范围评估与规格转任务分解专家",
  },
  "Jira Workflow Steward": {
    name: "Jira 工作流管理员",
    description: "Git 工作流、分支策略与 Jira 关联交付规范专家",
  },
  "Evidence Collector": {
    name: "测试证据采集员",
    description: "截图 QA、视觉验证与 Bug 文档专家",
  },
  "Reality Checker": {
    name: "生产就绪验证员",
    description: "基于证据的认证、质量门与发布认证专家",
  },
  "Test Results Analyzer": {
    name: "测试结果分析师",
    description: "测试评估、质量指标分析与覆盖率报告专家",
  },
  "Performance Benchmarker": {
    name: "性能基准测试专家",
    description: "性能测试、压力测试与速度优化专家",
  },
  "API Tester": {
    name: "API 测试工程师",
    description: "API 验证、集成测试与端点核查专家",
  },
  "Tool Evaluator": {
    name: "工具评估专家",
    description: "技术评估与工具选型专家",
  },
  "Workflow Optimizer": {
    name: "工作流优化专家",
    description: "流程分析、工作流改进与自动化机会挖掘专家",
  },
  "Accessibility Auditor": {
    name: "无障碍审计师",
    description: "WCAG 审计、辅助技术测试与包容性设计专家",
  },
  "Civil Engineer": {
    name: "土木工程师",
    description: "结构设计、施工管理与土木工程规范专家",
  },
  "Support Responder": {
    name: "客户支持专员",
    description: "客户服务、问题解决与支持运营专家",
  },
  "Analytics Reporter": {
    name: "数据分析报告员",
    description: "数据分析、仪表板与业务洞察专家",
  },
  "Finance Tracker": {
    name: "财务追踪专员",
    description: "财务规划、预算管理与业务绩效分析专家",
  },
  "Infrastructure Maintainer": {
    name: "基础设施维护工程师",
    description: "系统可靠性、性能优化与基础设施运营专家",
  },
  "Legal Compliance Checker": {
    name: "法律合规检查员",
    description: "合规审查、监管要求与风险管理专家",
  },
  "Executive Summary Generator": {
    name: "高管摘要生成师",
    description: "C 级沟通、战略摘要与决策支持专家",
  },
  "XR Interface Architect": {
    name: "XR 界面架构师",
    description: "空间交互设计与沉浸式 UX 专家（AR/VR/XR）",
  },
  "macOS Spatial/Metal Engineer": {
    name: "macOS 空间/Metal 工程师",
    description: "Swift、Metal 与高性能 3D macOS 空间计算专家",
  },
  "XR Immersive Developer": {
    name: "WebXR 沉浸式开发者",
    description: "WebXR、浏览器端 AR/VR 沉浸式体验开发专家",
  },
  "XR Cockpit Interaction Specialist": {
    name: "XR 座舱交互专家",
    description: "座舱控制系统与沉浸式控制界面专家",
  },
  "visionOS Spatial Engineer": {
    name: "visionOS 空间工程师",
    description: "Apple Vision Pro 应用与空间计算体验开发专家",
  },
  "Terminal Integration Specialist": {
    name: "终端集成专家",
    description: "终端集成、命令行工具与开发者工作流专家",
  },
  "Agents Orchestrator": {
    name: "多智能体编排师",
    description: "多 Agent 协调、工作流管理与复杂项目统筹专家",
  },
  "LSP/Index Engineer": {
    name: "语言服务器/索引工程师",
    description: "LSP 实现、代码智能与语义索引专家",
  },
  "Sales Data Extraction Agent": {
    name: "销售数据提取 Agent",
    description: "Excel 监控与销售指标提取（MTD/YTD）专家",
  },
  "Data Consolidation Agent": {
    name: "数据整合 Agent",
    description: "销售数据聚合与仪表板报告专家",
  },
  "Report Distribution Agent": {
    name: "报告分发 Agent",
    description: "自动化报告交付与按区域定时发送专家",
  },
  "Agentic Identity & Trust Architect": {
    name: "智能体身份与信任架构师",
    description: "Agent 身份、认证与信任验证专家",
  },
  "Identity Graph Operator": {
    name: "身份图谱运营专家",
    description: "多 Agent 系统实体去重与身份一致性专家",
  },
  "Accounts Payable Agent": {
    name: "应付账款 Agent",
    description: "支付处理、供应商管理与自主支付专家",
  },
  "Blockchain Security Auditor": {
    name: "区块链安全审计师",
    description: "智能合约审计与漏洞分析专家",
  },
  "Compliance Auditor": {
    name: "合规审计师",
    description: "SOC2/ISO27001/HIPAA/PCI-DSS 合规认证指导专家",
  },
  "Cultural Intelligence Strategist": {
    name: "文化智能策略师",
    description: "全球 UX、多元呈现与文化排斥规避专家",
  },
  "Developer Advocate": {
    name: "开发者布道师",
    description: "社区建设、开发者体验与技术内容创作专家",
  },
  "Model QA Specialist": {
    name: "模型 QA 专家",
    description: "ML 审计、特征分析与可解释性专家",
  },
  "ZK Steward": {
    name: "知识卡片管理员",
    description: "知识管理、Zettelkasten 与笔记系统专家",
  },
  "MCP Builder": {
    name: "MCP 构建专家",
    description: "Model Context Protocol 服务器与 AI Agent 工具链专家",
  },
  "Document Generator": {
    name: "文档生成专家",
    description: "PDF/PPTX/DOCX/XLSX 代码生成与专业文档创建专家",
  },
  "Automation Governance Architect": {
    name: "自动化治理架构师",
    description: "自动化治理、n8n 与工作流审计专家",
  },
  "Corporate Training Designer": {
    name: "企业培训设计师",
    description: "企业培训、课程开发与学习系统设计专家",
  },
  "Government Digital Presales Consultant": {
    name: "政务数字化售前顾问",
    description: "ToG 项目售前与数字政府转型方案专家",
  },
  "Healthcare Marketing Compliance": {
    name: "医疗营销合规专家",
    description: "中国医疗广告法规合规专家",
  },
  "Recruitment Specialist": {
    name: "招聘专家",
    description: "人才获取、招聘运营与雇主品牌专家",
  },
  "Study Abroad Advisor": {
    name: "留学顾问",
    description: "国际教育、申请规划与留学目的地专家（美/英/加/澳）",
  },
  "Supply Chain Strategist": {
    name: "供应链策略师",
    description: "供应链管理、采购策略与优化专家",
  },
  "Workflow Architect": {
    name: "工作流架构师",
    description: "工作流发现、流程映射与规格说明专家",
  },
  "Customer Service": {
    name: "客户服务专员",
    description: "客户问题解决、服务流程与满意度提升专家",
  },
  "Healthcare Customer Service": {
    name: "医疗客服专员",
    description: "医疗场景客户服务、患者沟通与医疗流程引导专家",
  },
  "Hospitality Guest Services": {
    name: "酒店客户服务专员",
    description: "酒店前台、VIP 接待与宾客体验管理专家",
  },
  "HR Onboarding": {
    name: "人力资源入职专员",
    description: "新员工入职流程、文化融入与行政事务专家",
  },
  "Language Translator": {
    name: "语言翻译专家",
    description: "多语言翻译、本地化与文化适配专家",
  },
  "Legal Billing & Time Tracking": {
    name: "法律计费与工时追踪专员",
    description: "律所计费系统、工时记录与合规管理专家",
  },
  "Legal Client Intake": {
    name: "法律客户受理专员",
    description: "法律咨询受理、案件筛选与客户引导专家",
  },
  "Legal Document Review": {
    name: "法律文件审查专员",
    description: "法律文件审阅、证据整理与文件管理专家",
  },
  "Loan Officer Assistant": {
    name: "贷款专员助理",
    description: "贷款申请处理、信用评估与文件准备专家",
  },
  "Real Estate Buyer & Seller": {
    name: "房地产买卖专员",
    description: "房产交易、买卖流程与市场分析专家",
  },
  "Retail Customer Returns": {
    name: "零售退货处理专员",
    description: "退货流程管理、退款处理与客户满意度专家",
  },
  "Sales Outreach": {
    name: "销售外联专员",
    description: "潜在客户开发、邮件外联与 CRM 跟进专家",
  },
  "Salesforce Architect": {
    name: "Salesforce 架构师",
    description: "多云 Salesforce 设计、Governor Limits 与集成专家",
  },
  "French Consulting Market Navigator": {
    name: "法国咨询市场导航师",
    description: "ESN/SI 生态与法国 IT 自由职业专家",
  },
  "Korean Business Navigator": {
    name: "韩国商务导航师",
    description: "韩国商业文化、品议流程与人际关系机制专家",
  },
  "Chief of Staff": {
    name: "幕僚长",
    description: "高层战略支持、跨部门协调与组织效能优化专家",
  },
  "Academic Anthropologist": {
    name: "学术人类学家",
    description: "文化研究、田野调查与人类学视角分析专家",
  },
  Anthropologist: {
    name: "学术人类学家",
    description: "文化研究、田野调查与人类学视角分析专家",
  },
  "Academic Geographer": {
    name: "学术地理学家",
    description: "空间分析、地理信息与地缘研究专家",
  },
  Geographer: {
    name: "学术地理学家",
    description: "空间分析、地理信息与地缘研究专家",
  },
  "Academic Historian": {
    name: "学术历史学家",
    description: "历史分析、史料解读与历史叙事专家",
  },
  Historian: {
    name: "学术历史学家",
    description: "历史分析、史料解读与历史叙事专家",
  },
  "Academic Narratologist": {
    name: "学术叙事学家",
    description: "叙事结构、故事理论与文本分析专家",
  },
  Narratologist: {
    name: "学术叙事学家",
    description: "叙事结构、故事理论与文本分析专家",
  },
  "Academic Psychologist": {
    name: "学术心理学家",
    description: "心理学研究、行为分析与认知科学专家",
  },
  Psychologist: {
    name: "学术心理学家",
    description: "心理学研究、行为分析与认知科学专家",
  },
  "Healthcare Marketing Compliance Specialist": {
    name: "医疗营销合规专家",
    description: "中国医疗广告法规合规专家",
  },
  "SRE (Site Reliability Engineer)": {
    name: "站点可靠性工程师",
    description: "SLO、错误预算、可观测性与混沌工程专家",
  },
  "Game Designer": {
    name: "游戏设计师",
    description: "系统设计、GDD 写作、经济平衡与玩法循环专家",
  },
  "Level Designer": {
    name: "关卡设计师",
    description: "布局理论、节奏、遭遇设计与环境叙事专家",
  },
  "Technical Artist": {
    name: "技术美术",
    description: "Shader、VFX、LOD 管线与美术到引擎优化专家",
  },
  "Game Audio Engineer": {
    name: "游戏音频工程师",
    description: "FMOD/Wwise、自适应音乐与空间音频专家",
  },
  "Narrative Designer": {
    name: "叙事设计师",
    description: "故事系统、分支对话与世界观架构专家",
  },
  "Unity Architect": {
    name: "Unity 架构师",
    description: "ScriptableObjects、数据驱动模块化与 DOTS/ECS 专家",
  },
  "Unity Shader Graph Artist": {
    name: "Unity Shader 艺术家",
    description: "Shader Graph、HLSL、URP/HDRP 与渲染特性专家",
  },
  "Unity Multiplayer Engineer": {
    name: "Unity 多人网络工程师",
    description: "Netcode for GameObjects、Unity Relay/Lobby 与服务器权威专家",
  },
  "Unity Editor Tool Developer": {
    name: "Unity 编辑器工具开发者",
    description: "EditorWindow、AssetPostprocessor 与构建自动化专家",
  },
  "Blender Add-on Engineer": {
    name: "Blender 插件工程师",
    description: "Blender Python API、自定义工具与 DCC 流程自动化专家",
  },
  "Godot Gameplay Scripter": {
    name: "Godot 游戏脚本工程师",
    description: "GDScript/C#、节点系统与 Godot 游戏逻辑专家",
  },
  "Godot Multiplayer Engineer": {
    name: "Godot 多人网络工程师",
    description: "Godot 多人同步、ENet/WebSocket 与服务器权威架构专家",
  },
  "Godot Shader Developer": {
    name: "Godot Shader 开发者",
    description: "Godot 着色器语言、视觉特效与渲染管线专家",
  },
  "Roblox Avatar Creator": {
    name: "Roblox 角色创建师",
    description: "Roblox 虚拟形象、自定义角色与装扮系统专家",
  },
  "Roblox Experience Designer": {
    name: "Roblox 体验设计师",
    description: "Roblox 游戏设计、关卡布局与玩家参与度专家",
  },
  "Roblox Systems Scripter": {
    name: "Roblox 系统脚本工程师",
    description: "Luau 脚本、Roblox 系统架构与性能优化专家",
  },
  "Unreal Multiplayer Architect": {
    name: "Unreal 多人架构师",
    description: "Unreal Engine 网络复制、专用服务器与大规模多人架构专家",
  },
  "Unreal Systems Engineer": {
    name: "Unreal 系统工程师",
    description: "Unreal C++、Gameplay Ability System 与引擎底层专家",
  },
  "Unreal Technical Artist": {
    name: "Unreal 技术美术",
    description: "Unreal 材质、Niagara VFX、LOD 管线与性能剖析专家",
  },
  "Unreal World Builder": {
    name: "Unreal 世界构建师",
    description: "Unreal 地形、World Partition、PCG 与开放世界构建专家",
  },
};

// ---- Helpers ----

function parseFrontmatter(
  content: string,
): { frontmatter: Record<string, string>; body: string } | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const frontmatterRaw = match[1];
  const body = match[2];
  const frontmatter: Record<string, string> = {};
  for (const line of frontmatterRaw.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) frontmatter[key] = value;
  }
  return { frontmatter, body };
}

function emojiToHex(emoji: string): string {
  if (!emoji) return "1f916";
  const cp = emoji.codePointAt(0);
  return cp ? cp.toString(16) : "1f916";
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function findMdFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["integrations", "scripts", "examples", ".git"].includes(entry.name))
        continue;
      results.push(...findMdFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const bn = entry.name.toLowerCase();
      if (
        [
          "readme.md",
          "contributing.md",
          "security.md",
          "license.md",
          "quickstart.md",
          "executive-brief.md",
        ].includes(bn)
      )
        continue;
      results.push(fullPath);
    }
  }
  return results;
}

// ---- Main ----

let idCounter = 200000;

export function convertAgencyAgents(): void {
  const agentsEn: AgencyAgentMask[] = [];
  const agentsZh: AgencyAgentMask[] = [];

  const allFiles: Array<{ filePath: string; category: string }> = [];
  for (const dir of AGENT_DIRS) {
    const dirPath = path.join(AGENCY_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      console.warn(`[Agency] Directory not found: ${dir}`);
      continue;
    }
    for (const fp of findMdFiles(dirPath)) {
      allFiles.push({ filePath: fp, category: dir });
    }
  }

  console.log(`[Agency] Found ${allFiles.length} agent .md files`);

  for (const { filePath, category } of allFiles) {
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = parseFrontmatter(content);
    if (!parsed) {
      console.warn(
        `[Agency] Skipping (no frontmatter): ${path.basename(filePath)}`,
      );
      continue;
    }
    const { frontmatter, body } = parsed;
    if (!frontmatter.name) {
      console.warn(`[Agency] Skipping (no name): ${path.basename(filePath)}`);
      continue;
    }

    const agentId = `agency-${slugify(category)}-${slugify(frontmatter.name)}`;
    const cleanBody = body.replace(/<!--[\s\S]*?-->/g, "").trim();
    const avatar = emojiToHex(frontmatter.emoji || "🤖");
    const desc = frontmatter.description || "";
    const color = frontmatter.color || "blue";
    const vibe = frontmatter.vibe || "";
    const cid = idCounter++;

    // English version
    agentsEn.push({
      avatar,
      name: frontmatter.name,
      description: desc,
      color,
      vibe,
      hideContext: true,
      context: [
        { id: `${agentId}-0`, role: "system", content: cleanBody, date: "" },
      ],
      modelConfig: { ...DEFAULT_MODEL_CONFIG },
      lang: "en",
      builtin: true,
      category,
      createdAt: cid,
    });

    // Chinese version (translate name + description if available)
    const zh = ZH_MAP[frontmatter.name];
    agentsZh.push({
      avatar,
      name: zh?.name || frontmatter.name,
      description: zh?.description || desc,
      color,
      vibe,
      hideContext: true,
      context: [
        { id: `${agentId}-0`, role: "system", content: cleanBody, date: "" },
      ],
      modelConfig: { ...DEFAULT_MODEL_CONFIG },
      lang: "zh",
      builtin: true,
      category,
      createdAt: cid,
    });
  }

  const outEn = path.join(__dirname, "..", "public", "agency-agents.json");
  const outZh = path.join(__dirname, "..", "public", "agency-agents-zh.json");
  fs.writeFileSync(outEn, JSON.stringify(agentsEn, null, 2));
  fs.writeFileSync(outZh, JSON.stringify(agentsZh, null, 2));
  console.log(
    `[Agency] Wrote ${agentsEn.length} agents (EN) to agency-agents.json`,
  );
  console.log(
    `[Agency] Wrote ${agentsZh.length} agents (ZH) to agency-agents-zh.json`,
  );
}

if (require.main === module) {
  convertAgencyAgents();
}
