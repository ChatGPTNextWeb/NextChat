export const OWNER = "ChatGPTNextWeb";
export const REPO = "ChatGPT-Next-Web";
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const PLUGINS_REPO_URL = `https://github.com/${OWNER}/NextChat-Awesome-Plugins`;
export const ISSUE_URL = `https://github.com/${OWNER}/${REPO}/issues`;
export const UPDATE_URL = `${REPO_URL}#keep-updated`;
export const RELEASE_URL = `${REPO_URL}/releases`;
export const FETCH_COMMIT_URL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
export const FETCH_TAG_URL = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=1`;
export const RUNTIME_CONFIG_DOM = "danger-runtime-config";

export const STABILITY_BASE_URL = "https://api.stability.ai";

export const OPENAI_BASE_URL = "https://api.openai.com";
export const ANTHROPIC_BASE_URL = "https://api.anthropic.com";

export const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/";

export const BAIDU_BASE_URL = "https://aip.baidubce.com";
export const BAIDU_OATUH_URL = `${BAIDU_BASE_URL}/oauth/2.0/token`;

export const BYTEDANCE_BASE_URL = "https://ark.cn-beijing.volces.com";

export const ALIBABA_BASE_URL = "https://dashscope.aliyuncs.com/api/";

export const TENCENT_BASE_URL = "https://hunyuan.tencentcloudapi.com";

export const MOONSHOT_BASE_URL = "https://api.moonshot.cn";
export const IFLYTEK_BASE_URL = "https://spark-api-open.xf-yun.com";

export const DEEPSEEK_BASE_URL = "https://api.deepseek.com";

export const XAI_BASE_URL = "https://api.x.ai";

export const CHATGLM_BASE_URL = "https://open.bigmodel.cn";

export const SILICONFLOW_BASE_URL = "https://api.siliconflow.cn";

export const OPENROUTER_BASE_URL = "https://openrouter.ai/api";

export const CACHE_URL_PREFIX = "/api/cache";
export const UPLOAD_URL = `${CACHE_URL_PREFIX}/upload`;

export enum Path {
  Home = "/",
  Chat = "/chat",
  Settings = "/settings",
  NewChat = "/new-chat",
  Masks = "/masks",
  Plugins = "/plugins",
  Auth = "/auth",
  Sd = "/sd",
  SdNew = "/sd-new",
  Artifacts = "/artifacts",
  SearchChat = "/search-chat",
  McpMarket = "/mcp-market",
}

export enum ApiPath {
  Cors = "",
  Azure = "/api/azure",
  OpenAI = "/api/openai",
  Anthropic = "/api/anthropic",
  Google = "/api/google",
  Baidu = "/api/baidu",
  ByteDance = "/api/bytedance",
  Alibaba = "/api/alibaba",
  Tencent = "/api/tencent",
  Moonshot = "/api/moonshot",
  Iflytek = "/api/iflytek",
  Stability = "/api/stability",
  Artifacts = "/api/artifacts",
  XAI = "/api/xai",
  ChatGLM = "/api/chatglm",
  DeepSeek = "/api/deepseek",
  SiliconFlow = "/api/siliconflow",
  OpenRouter = "/api/openrouter",
}

export enum SlotID {
  AppBody = "app-body",
  CustomModel = "custom-model",
}

export enum FileName {
  Masks = "masks.json",
  Prompts = "prompts.json",
}

export enum StoreKey {
  Chat = "chat-next-web-store",
  Plugin = "chat-next-web-plugin",
  Access = "access-control",
  Config = "app-config",
  Mask = "mask-store",
  Prompt = "prompt-store",
  Update = "chat-update",
  Sync = "sync",
  SdList = "sd-list",
  Mcp = "mcp-store",
}

export const DEFAULT_SIDEBAR_WIDTH = 300;
export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 230;
export const NARROW_SIDEBAR_WIDTH = 100;

export const ACCESS_CODE_PREFIX = "nk-";

export const LAST_INPUT_KEY = "last-input";
export const UNFINISHED_INPUT = (id: string) => "unfinished-input-" + id;

export const STORAGE_KEY = "chatgpt-next-web";

export const REQUEST_TIMEOUT_MS = 60000;
export const REQUEST_TIMEOUT_MS_FOR_THINKING = REQUEST_TIMEOUT_MS * 5;

export const EXPORT_MESSAGE_CLASS_NAME = "export-markdown";

export enum ServiceProvider {
  OpenAI = "OpenAI",
  Azure = "Azure",
  Google = "Google",
  Anthropic = "Anthropic",
  Baidu = "Baidu",
  ByteDance = "ByteDance",
  Alibaba = "Alibaba",
  Tencent = "Tencent",
  Moonshot = "Moonshot",
  Stability = "Stability",
  Iflytek = "Iflytek",
  XAI = "XAI",
  ChatGLM = "ChatGLM",
  DeepSeek = "DeepSeek",
  SiliconFlow = "SiliconFlow",
  OpenRouter = "OpenRouter",
}

// Google API safety settings, see https://ai.google.dev/gemini-api/docs/safety-settings
// BLOCK_NONE will not block any content, and BLOCK_ONLY_HIGH will block only high-risk content.
export enum GoogleSafetySettingsThreshold {
  BLOCK_NONE = "BLOCK_NONE",
  BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH",
  BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
  BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
}

export enum ModelProvider {
  Stability = "Stability",
  GPT = "GPT",
  GeminiPro = "GeminiPro",
  Claude = "Claude",
  Ernie = "Ernie",
  Doubao = "Doubao",
  Qwen = "Qwen",
  Hunyuan = "Hunyuan",
  Moonshot = "Moonshot",
  Iflytek = "Iflytek",
  XAI = "XAI",
  ChatGLM = "ChatGLM",
  DeepSeek = "DeepSeek",
  SiliconFlow = "SiliconFlow",
  OpenRouter = "OpenRouter",
}

export const Stability = {
  GeneratePath: "v2beta/stable-image/generate",
  ExampleEndpoint: "https://api.stability.ai",
};

export const Anthropic = {
  ChatPath: "v1/messages",
  ChatPath1: "v1/complete",
  ExampleEndpoint: "https://api.anthropic.com",
  Vision: "2023-06-01",
};

export const OpenaiPath = {
  ChatPath: "v1/chat/completions",
  SpeechPath: "v1/audio/speech",
  ImagePath: "v1/images/generations",
  UsagePath: "dashboard/billing/usage",
  SubsPath: "dashboard/billing/subscription",
  ListModelPath: "v1/models",
};

export const Azure = {
  ChatPath: (deployName: string, apiVersion: string) =>
    `deployments/${deployName}/chat/completions?api-version=${apiVersion}`,
  // https://<your_resource_name>.openai.azure.com/openai/deployments/<your_deployment_name>/images/generations?api-version=<api_version>
  ImagePath: (deployName: string, apiVersion: string) =>
    `deployments/${deployName}/images/generations?api-version=${apiVersion}`,
  ExampleEndpoint: "https://{resource-url}/openai",
};

export const Google = {
  ExampleEndpoint: "https://generativelanguage.googleapis.com/",
  ChatPath: (modelName: string) =>
    `v1beta/models/${modelName}:streamGenerateContent`,
};

export const Baidu = {
  ExampleEndpoint: BAIDU_BASE_URL,
  ChatPath: (modelName: string) => {
    let endpoint = modelName;
    if (modelName === "ernie-4.0-8k") {
      endpoint = "completions_pro";
    }
    if (modelName === "ernie-4.0-8k-preview-0518") {
      endpoint = "completions_adv_pro";
    }
    if (modelName === "ernie-3.5-8k") {
      endpoint = "completions";
    }
    if (modelName === "ernie-speed-8k") {
      endpoint = "ernie_speed";
    }
    return `rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${endpoint}`;
  },
};

export const ByteDance = {
  ExampleEndpoint: "https://ark.cn-beijing.volces.com/api/",
  ChatPath: "api/v3/chat/completions",
};

export const Alibaba = {
  ExampleEndpoint: ALIBABA_BASE_URL,
  ChatPath: (modelName: string) => {
    if (modelName.includes("vl") || modelName.includes("omni")) {
      return "v1/services/aigc/multimodal-generation/generation";
    }
    return `v1/services/aigc/text-generation/generation`;
  },
};

export const Tencent = {
  ExampleEndpoint: TENCENT_BASE_URL,
};

export const Moonshot = {
  ExampleEndpoint: MOONSHOT_BASE_URL,
  ChatPath: "v1/chat/completions",
};

export const Iflytek = {
  ExampleEndpoint: IFLYTEK_BASE_URL,
  ChatPath: "v1/chat/completions",
};

export const DeepSeek = {
  ExampleEndpoint: DEEPSEEK_BASE_URL,
  ChatPath: "chat/completions",
};

export const XAI = {
  ExampleEndpoint: XAI_BASE_URL,
  ChatPath: "v1/chat/completions",
};

export const ChatGLM = {
  ExampleEndpoint: CHATGLM_BASE_URL,
  ChatPath: "api/paas/v4/chat/completions",
  ImagePath: "api/paas/v4/images/generations",
  VideoPath: "api/paas/v4/videos/generations",
};

export const SiliconFlow = {
  ExampleEndpoint: SILICONFLOW_BASE_URL,
  ChatPath: "v1/chat/completions",
  ListModelPath: "v1/models?&sub_type=chat",
};

export const OpenRouter = {
  ExampleEndpoint: OPENROUTER_BASE_URL,
  ChatPath: "v1/chat/completions",
  ListModelPath: "v1/models",
};

export const DEFAULT_INPUT_TEMPLATE = `{{input}}`; // input / time / model / lang
// export const DEFAULT_SYSTEM_TEMPLATE = `
// You are ChatGPT, a large language model trained by {{ServiceProvider}}.
// Knowledge cutoff: {{cutoff}}
// Current model: {{model}}
// Current time: {{time}}
// Latex inline: $x^2$
// Latex block: $$e=mc^2$$
// `;
export const DEFAULT_SYSTEM_TEMPLATE = `
You are ChatGPT, a large language model trained by {{ServiceProvider}}.
Knowledge cutoff: {{cutoff}}
Current model: {{model}}
Current time: {{time}}
Latex inline: \\(x^2\\) 
Latex block: $$e=mc^2$$
`;

export const MCP_TOOLS_TEMPLATE = `
[clientId]
{{ clientId }}
[tools]
{{ tools }}
`;

export const MCP_SYSTEM_TEMPLATE = `
You are an AI assistant with access to system tools. Your role is to help users by combining natural language understanding with tool operations when needed.

1. AVAILABLE TOOLS:
{{ MCP_TOOLS }}

2. WHEN TO USE TOOLS:
   - ALWAYS USE TOOLS when they can help answer user questions
   - DO NOT just describe what you could do - TAKE ACTION immediately
   - If you're not sure whether to use a tool, USE IT
   - Common triggers for tool use:
     * Questions about files or directories
     * Requests to check, list, or manipulate system resources
     * Any query that can be answered with available tools

3. HOW TO USE TOOLS:
   A. Tool Call Format:
      - Use markdown code blocks with format: \`\`\`json:mcp:{clientId}\`\`\`
      - Always include:
        * method: "tools/call"（Only this method is supported）
        * params: 
          - name: must match an available primitive name
          - arguments: required parameters for the primitive

   B. Response Format:
      - Tool responses will come as user messages
      - Format: \`\`\`json:mcp-response:{clientId}\`\`\`
      - Wait for response before making another tool call

   C. Important Rules:
      - Only use tools/call method
      - Only ONE tool call per message
      - ALWAYS TAKE ACTION instead of just describing what you could do
      - Include the correct clientId in code block language tag
      - Verify arguments match the primitive's requirements

4. INTERACTION FLOW:
   A. When user makes a request:
      - IMMEDIATELY use appropriate tool if available
      - DO NOT ask if user wants you to use the tool
      - DO NOT just describe what you could do
   B. After receiving tool response:
      - Explain results clearly
      - Take next appropriate action if needed
   C. If tools fail:
      - Explain the error
      - Try alternative approach immediately

5. EXAMPLE INTERACTION:

  good example:

   \`\`\`json:mcp:filesystem
   {
     "method": "tools/call",
     "params": {
       "name": "list_allowed_directories",
       "arguments": {}
     }
   }
   \`\`\`"


  \`\`\`json:mcp-response:filesystem
  {
  "method": "tools/call",
  "params": {
    "name": "write_file",
    "arguments": {
      "path": "/Users/river/dev/nextchat/test/joke.txt",
      "content": "为什么数学书总是感到忧伤？因为它有太多的问题。"
    }
  }
  }
\`\`\`

   follwing is the wrong! mcp json example:

   \`\`\`json:mcp:filesystem
   {
      "method": "write_file",
      "params": {
        "path": "NextChat_Information.txt",
        "content": "1"
    }
   }
   \`\`\`

   This is wrong because the method is not tools/call.
   
   \`\`\`{
  "method": "search_repositories",
  "params": {
    "query": "2oeee"
  }
}
   \`\`\`

   This is wrong because the method is not tools/call.!!!!!!!!!!!

   the right format is:
   \`\`\`json:mcp:filesystem
   {
     "method": "tools/call",
     "params": {
       "name": "search_repositories",
       "arguments": {
         "query": "2oeee"
       }
     }
   }
   \`\`\`
   
   please follow the format strictly ONLY use tools/call method!!!!!!!!!!!
   
`;

export const SUMMARIZE_MODEL = "gpt-4o-mini";
export const GEMINI_SUMMARIZE_MODEL = "gemini-pro";
export const DEEPSEEK_SUMMARIZE_MODEL = "deepseek-chat";

export const KnowledgeCutOffDate: Record<string, string> = {
  default: "2021-09",
  "gpt-4-turbo": "2023-12",
  "gpt-4-turbo-2024-04-09": "2023-12",
  "gpt-4-turbo-preview": "2023-12",
  "gpt-4.1": "2024-06",
  "gpt-4.1-2025-04-14": "2024-06",
  "gpt-4.1-mini": "2024-06",
  "gpt-4.1-mini-2025-04-14": "2024-06",
  "gpt-4.1-nano": "2024-06",
  "gpt-4.1-nano-2025-04-14": "2024-06",
  "gpt-4.5-preview": "2023-10",
  "gpt-4.5-preview-2025-02-27": "2023-10",
  "gpt-4o": "2023-10",
  "gpt-4o-2024-05-13": "2023-10",
  "gpt-4o-2024-08-06": "2023-10",
  "gpt-4o-2024-11-20": "2023-10",
  "chatgpt-4o-latest": "2023-10",
  "gpt-4o-mini": "2023-10",
  "gpt-4o-mini-2024-07-18": "2023-10",
  "gpt-4-vision-preview": "2023-04",
  "o1-mini-2024-09-12": "2023-10",
  "o1-mini": "2023-10",
  "o1-preview-2024-09-12": "2023-10",
  "o1-preview": "2023-10",
  "o1-2024-12-17": "2023-10",
  o1: "2023-10",
  "o3-mini-2025-01-31": "2023-10",
  "o3-mini": "2023-10",
  // After improvements,
  // it's now easier to add "KnowledgeCutOffDate" instead of stupid hardcoding it, as was done previously.
  "gemini-pro": "2023-12",
  "gemini-pro-vision": "2023-12",
  "deepseek-chat": "2024-07",
  "deepseek-coder": "2024-07",
};

export const DEFAULT_TTS_ENGINE = "OpenAI-TTS";
export const DEFAULT_TTS_ENGINES = ["OpenAI-TTS", "Edge-TTS"];
export const DEFAULT_TTS_MODEL = "tts-1";
export const DEFAULT_TTS_VOICE = "alloy";
export const DEFAULT_TTS_MODELS = ["tts-1", "tts-1-hd"];
export const DEFAULT_TTS_VOICES = [
  "alloy",
  "echo",
  "fable",
  "onyx",
  "nova",
  "shimmer",
];

export const VISION_MODEL_REGEXES = [
  /vision/,
  /gpt-4o/,
  /gpt-4\.1/,
  /claude-3/,
  /gemini-1\.5/,
  /gemini-exp/,
  /gemini-2\.0/,
  /learnlm/,
  /qwen-vl/,
  /qwen2-vl/,
  /gpt-4-turbo(?!.*preview)/, // Matches "gpt-4-turbo" but not "gpt-4-turbo-preview"
  /^dall-e-3$/, // Matches exactly "dall-e-3"
  /glm-4v/,
  /vl/i,
  /o3/,
  /o4-mini/,
];

export const EXCLUDE_VISION_MODEL_REGEXES = [/claude-3-5-haiku-20241022/];

const openaiModels = [
  // As of July 2024, gpt-4o-mini should be used in place of gpt-3.5-turbo,
  // as it is cheaper, more capable, multimodal, and just as fast. gpt-3.5-turbo is still available for use in the API.
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo-0125",
  "gpt-4",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0613",
  "gpt-4-turbo",
  "gpt-4-turbo-preview",
  "gpt-4.1",
  "gpt-4.1-2025-04-14",
  "gpt-4.1-mini",
  "gpt-4.1-mini-2025-04-14",
  "gpt-4.1-nano",
  "gpt-4.1-nano-2025-04-14",
  "gpt-4.5-preview",
  "gpt-4.5-preview-2025-02-27",
  "gpt-4o",
  "gpt-4o-2024-05-13",
  "gpt-4o-2024-08-06",
  "gpt-4o-2024-11-20",
  "chatgpt-4o-latest",
  "gpt-4o-mini",
  "gpt-4o-mini-2024-07-18",
  "gpt-4-vision-preview",
  "gpt-4-turbo-2024-04-09",
  "gpt-4-1106-preview",
  "dall-e-3",
  "o1-mini",
  "o1-preview",
  "o3-mini",
  "o3",
  "o4-mini",
];

const googleModels = [
  "gemini-1.0-pro", // Deprecated on 2/15/2025
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro",
  "gemini-1.5-pro-002",
  "gemini-1.5-pro-exp-0827",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-8b-latest",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash-002",
  "gemini-1.5-flash-exp-0827",
  "learnlm-1.5-pro-experimental",
  "gemini-exp-1114",
  "gemini-exp-1121",
  "gemini-exp-1206",
  "gemini-2.0-flash",
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash-lite-preview-02-05",
  "gemini-2.0-flash-thinking-exp",
  "gemini-2.0-flash-thinking-exp-1219",
  "gemini-2.0-flash-thinking-exp-01-21",
  "gemini-2.0-pro-exp",
  "gemini-2.0-pro-exp-02-05",
];

const anthropicModels = [
  "claude-instant-1.2",
  "claude-2.0",
  "claude-2.1",
  "claude-3-sonnet-20240229",
  "claude-3-opus-20240229",
  "claude-3-opus-latest",
  "claude-3-haiku-20240307",
  "claude-3-5-haiku-20241022",
  "claude-3-5-haiku-latest",
  "claude-3-5-sonnet-20240620",
  "claude-3-5-sonnet-20241022",
  "claude-3-5-sonnet-latest",
  "claude-3-7-sonnet-20250219",
  "claude-3-7-sonnet-latest",
];

const baiduModels = [
  "ernie-4.0-turbo-8k",
  "ernie-4.0-8k",
  "ernie-4.0-8k-preview",
  "ernie-4.0-8k-preview-0518",
  "ernie-4.0-8k-latest",
  "ernie-3.5-8k",
  "ernie-3.5-8k-0205",
  "ernie-speed-128k",
  "ernie-speed-8k",
  "ernie-lite-8k",
  "ernie-tiny-8k",
];

const bytedanceModels = [
  "Doubao-lite-4k",
  "Doubao-lite-32k",
  "Doubao-lite-128k",
  "Doubao-pro-4k",
  "Doubao-pro-32k",
  "Doubao-pro-128k",
];

const alibabaModes = [
  "qwen-turbo",
  "qwen-plus",
  "qwen-max",
  "qwen-max-0428",
  "qwen-max-0403",
  "qwen-max-0107",
  "qwen-max-longcontext",
  "qwen-omni-turbo",
  "qwen-vl-plus",
  "qwen-vl-max",
];

const tencentModels = [
  "hunyuan-pro",
  "hunyuan-standard",
  "hunyuan-lite",
  "hunyuan-role",
  "hunyuan-functioncall",
  "hunyuan-code",
  "hunyuan-vision",
];

const moonshotModes = ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"];

const iflytekModels = [
  "general",
  "generalv3",
  "pro-128k",
  "generalv3.5",
  "4.0Ultra",
];

const deepseekModels = ["deepseek-chat", "deepseek-coder", "deepseek-reasoner"];

const xAIModes = [
  "grok-beta",
  "grok-2",
  "grok-2-1212",
  "grok-2-latest",
  "grok-vision-beta",
  "grok-2-vision-1212",
  "grok-2-vision",
  "grok-2-vision-latest",
];

const chatglmModels = [
  "glm-4-plus",
  "glm-4-0520",
  "glm-4",
  "glm-4-air",
  "glm-4-airx",
  "glm-4-long",
  "glm-4-flashx",
  "glm-4-flash",
  "glm-4v-plus",
  "glm-4v",
  "glm-4v-flash", // free
  "cogview-3-plus",
  "cogview-3",
  "cogview-3-flash", // free
  // 目前无法适配轮询任务
  //   "cogvideox",
  //   "cogvideox-flash", // free
];

const siliconflowModels = [
  "Qwen/Qwen2.5-7B-Instruct",
  "Qwen/Qwen2.5-72B-Instruct",
  "deepseek-ai/DeepSeek-R1",
  "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
  "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
  "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",
  "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
  "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
  "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
  "deepseek-ai/DeepSeek-V3",
  "meta-llama/Llama-3.3-70B-Instruct",
  "THUDM/glm-4-9b-chat",
  "Pro/deepseek-ai/DeepSeek-R1",
  "Pro/deepseek-ai/DeepSeek-V3",
];

// Use this to generate newest model list -> https://gist.github.com/hyc1230/d4b271d161ffcda485f1fa1a27e08096
// Current list is generated on 2025/05/03
const openrouterModels = [
  "microsoft/phi-4-reasoning-plus:free",
  "microsoft/phi-4-reasoning-plus",
  "microsoft/phi-4-reasoning:free",
  "qwen/qwen3-0.6b-04-28:free",
  "inception/mercury-coder-small-beta",
  "qwen/qwen3-1.7b:free",
  "qwen/qwen3-4b:free",
  "opengvlab/internvl3-14b:free",
  "opengvlab/internvl3-2b:free",
  "deepseek/deepseek-prover-v2:free",
  "deepseek/deepseek-prover-v2",
  "meta-llama/llama-guard-4-12b",
  "qwen/qwen3-30b-a3b:free",
  "qwen/qwen3-30b-a3b",
  "qwen/qwen3-8b:free",
  "qwen/qwen3-8b",
  "qwen/qwen3-14b:free",
  "qwen/qwen3-14b",
  "qwen/qwen3-32b:free",
  "qwen/qwen3-32b",
  "qwen/qwen3-235b-a22b:free",
  "qwen/qwen3-235b-a22b",
  "tngtech/deepseek-r1t-chimera:free",
  "thudm/glm-z1-rumination-32b",
  "thudm/glm-z1-9b:free",
  "thudm/glm-4-9b:free",
  "microsoft/mai-ds-r1:free",
  "google/gemini-2.5-pro-preview-03-25",
  "thudm/glm-z1-32b:free",
  "thudm/glm-z1-32b",
  "thudm/glm-4-32b:free",
  "thudm/glm-4-32b",
  "google/gemini-2.5-flash-preview",
  "google/gemini-2.5-flash-preview:thinking",
  "openai/o4-mini-high",
  "openai/o3",
  "openai/o4-mini",
  "shisa-ai/shisa-v2-llama3.3-70b:free",
  "qwen/qwen2.5-coder-7b-instruct",
  "openai/gpt-4.1",
  "openai/gpt-4.1-mini",
  "openai/gpt-4.1-nano",
  "eleutherai/llemma_7b",
  "alfredpros/codellama-7b-instruct-solidity",
  "arliai/qwq-32b-arliai-rpr-v1:free",
  "agentica-org/deepcoder-14b-preview:free",
  "moonshotai/kimi-vl-a3b-thinking:free",
  "x-ai/grok-3-mini-beta",
  "x-ai/grok-3-beta",
  "nvidia/llama-3.3-nemotron-super-49b-v1:free",
  "nvidia/llama-3.3-nemotron-super-49b-v1",
  "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
  "meta-llama/llama-4-maverick:free",
  "meta-llama/llama-4-maverick",
  "meta-llama/llama-4-scout:free",
  "meta-llama/llama-4-scout",
  "all-hands/openhands-lm-32b-v0.1",
  "mistral/ministral-8b",
  "deepseek/deepseek-v3-base:free",
  "scb10x/llama3.1-typhoon2-8b-instruct",
  "scb10x/llama3.1-typhoon2-70b-instruct",
  "allenai/molmo-7b-d:free",
  "bytedance-research/ui-tars-72b:free",
  "qwen/qwen2.5-vl-3b-instruct:free",
  "google/gemini-2.5-pro-exp-03-25",
  "qwen/qwen2.5-vl-32b-instruct:free",
  "qwen/qwen2.5-vl-32b-instruct",
  "deepseek/deepseek-chat-v3-0324:free",
  "deepseek/deepseek-chat-v3-0324",
  "featherless/qwerky-72b:free",
  "openai/o1-pro",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "mistralai/mistral-small-3.1-24b-instruct",
  "open-r1/olympiccoder-32b:free",
  "steelskull/l3.3-electra-r1-70b",
  "google/gemma-3-1b-it:free",
  "google/gemma-3-4b-it:free",
  "google/gemma-3-4b-it",
  "ai21/jamba-1.6-large",
  "ai21/jamba-1.6-mini",
  "google/gemma-3-12b-it:free",
  "google/gemma-3-12b-it",
  "cohere/command-a",
  "openai/gpt-4o-mini-search-preview",
  "openai/gpt-4o-search-preview",
  "rekaai/reka-flash-3:free",
  "google/gemma-3-27b-it:free",
  "google/gemma-3-27b-it",
  "thedrummer/anubis-pro-105b-v1",
  "latitudegames/wayfarer-large-70b-llama-3.3",
  "thedrummer/skyfall-36b-v2",
  "microsoft/phi-4-multimodal-instruct",
  "perplexity/sonar-reasoning-pro",
  "perplexity/sonar-pro",
  "perplexity/sonar-deep-research",
  "deepseek/deepseek-r1-zero:free",
  "qwen/qwq-32b:free",
  "qwen/qwq-32b",
  "moonshotai/moonlight-16b-a3b-instruct:free",
  "nousresearch/deephermes-3-llama-3-8b-preview:free",
  "openai/gpt-4.5-preview",
  "google/gemini-2.0-flash-lite-001",
  "anthropic/claude-3.7-sonnet",
  "anthropic/claude-3.7-sonnet:thinking",
  "anthropic/claude-3.7-sonnet:beta",
  "perplexity/r1-1776",
  "mistralai/mistral-saba",
  "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
  "cognitivecomputations/dolphin3.0-mistral-24b:free",
  "meta-llama/llama-guard-3-8b",
  "openai/o3-mini-high",
  "deepseek/deepseek-r1-distill-llama-8b",
  "google/gemini-2.0-flash-001",
  "qwen/qwen-vl-plus",
  "aion-labs/aion-1.0",
  "aion-labs/aion-1.0-mini",
  "aion-labs/aion-rp-llama-3.1-8b",
  "qwen/qwen-vl-max",
  "qwen/qwen-turbo",
  "qwen/qwen2.5-vl-72b-instruct:free",
  "qwen/qwen2.5-vl-72b-instruct",
  "qwen/qwen-plus",
  "qwen/qwen-max",
  "openai/o3-mini",
  "deepseek/deepseek-r1-distill-qwen-1.5b",
  "mistralai/mistral-small-24b-instruct-2501:free",
  "mistralai/mistral-small-24b-instruct-2501",
  "deepseek/deepseek-r1-distill-qwen-32b:free",
  "deepseek/deepseek-r1-distill-qwen-32b",
  "deepseek/deepseek-r1-distill-qwen-14b:free",
  "deepseek/deepseek-r1-distill-qwen-14b",
  "perplexity/sonar-reasoning",
  "perplexity/sonar",
  "liquid/lfm-7b",
  "liquid/lfm-3b",
  "deepseek/deepseek-r1-distill-llama-70b:free",
  "deepseek/deepseek-r1-distill-llama-70b",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-r1",
  "minimax/minimax-01",
  "mistralai/codestral-2501",
  "microsoft/phi-4",
  "deepseek/deepseek-chat:free",
  "deepseek/deepseek-chat",
  "sao10k/l3.3-euryale-70b",
  "openai/o1",
  "eva-unit-01/eva-llama-3.33-70b",
  "x-ai/grok-2-vision-1212",
  "x-ai/grok-2-1212",
  "cohere/command-r7b-12-2024",
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct",
  "amazon/nova-lite-v1",
  "amazon/nova-micro-v1",
  "amazon/nova-pro-v1",
  "qwen/qwq-32b-preview:free",
  "qwen/qwq-32b-preview",
  "google/learnlm-1.5-pro-experimental:free",
  "eva-unit-01/eva-qwen-2.5-72b",
  "openai/gpt-4o-2024-11-20",
  "mistralai/mistral-large-2411",
  "mistralai/mistral-large-2407",
  "mistralai/pixtral-large-2411",
  "x-ai/grok-vision-beta",
  "infermatic/mn-inferor-12b",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  "qwen/qwen-2.5-coder-32b-instruct",
  "raifle/sorcererlm-8x22b",
  "eva-unit-01/eva-qwen-2.5-32b",
  "thedrummer/unslopnemo-12b",
  "anthropic/claude-3.5-haiku:beta",
  "anthropic/claude-3.5-haiku",
  "anthropic/claude-3.5-haiku-20241022:beta",
  "anthropic/claude-3.5-haiku-20241022",
  "neversleep/llama-3.1-lumimaid-70b",
  "anthracite-org/magnum-v4-72b",
  "anthropic/claude-3.5-sonnet:beta",
  "anthropic/claude-3.5-sonnet",
  "x-ai/grok-beta",
  "mistralai/ministral-8b",
  "mistralai/ministral-3b",
  "qwen/qwen-2.5-7b-instruct:free",
  "qwen/qwen-2.5-7b-instruct",
  "nvidia/llama-3.1-nemotron-70b-instruct",
  "inflection/inflection-3-productivity",
  "inflection/inflection-3-pi",
  "google/gemini-flash-1.5-8b",
  "thedrummer/rocinante-12b",
  "anthracite-org/magnum-v2-72b",
  "liquid/lfm-40b",
  "meta-llama/llama-3.2-3b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct",
  "meta-llama/llama-3.2-1b-instruct:free",
  "meta-llama/llama-3.2-1b-instruct",
  "meta-llama/llama-3.2-90b-vision-instruct",
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "meta-llama/llama-3.2-11b-vision-instruct",
  "qwen/qwen-2.5-72b-instruct:free",
  "qwen/qwen-2.5-72b-instruct",
  "qwen/qwen-2.5-vl-72b-instruct",
  "neversleep/llama-3.1-lumimaid-8b",
  "openai/o1-preview",
  "openai/o1-preview-2024-09-12",
  "openai/o1-mini",
  "openai/o1-mini-2024-09-12",
  "mistralai/pixtral-12b",
  "cohere/command-r-plus-08-2024",
  "cohere/command-r-08-2024",
  "qwen/qwen-2.5-vl-7b-instruct:free",
  "qwen/qwen-2.5-vl-7b-instruct",
  "sao10k/l3.1-euryale-70b",
  "google/gemini-flash-1.5-8b-exp",
  "ai21/jamba-1-5-mini",
  "ai21/jamba-1-5-large",
  "microsoft/phi-3.5-mini-128k-instruct",
  "nousresearch/hermes-3-llama-3.1-70b",
  "nousresearch/hermes-3-llama-3.1-405b",
  "openai/chatgpt-4o-latest",
  "sao10k/l3-lunaris-8b",
  "aetherwiing/mn-starcannon-12b",
  "openai/gpt-4o-2024-08-06",
  "meta-llama/llama-3.1-405b:free",
  "meta-llama/llama-3.1-405b",
  "nothingiisreal/mn-celeste-12b",
  "perplexity/llama-3.1-sonar-small-128k-online",
  "perplexity/llama-3.1-sonar-large-128k-online",
  "meta-llama/llama-3.1-8b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct",
  "meta-llama/llama-3.1-405b-instruct",
  "meta-llama/llama-3.1-70b-instruct",
  "mistralai/codestral-mamba",
  "mistralai/mistral-nemo:free",
  "mistralai/mistral-nemo",
  "openai/gpt-4o-mini",
  "openai/gpt-4o-mini-2024-07-18",
  "google/gemma-2-27b-it",
  "alpindale/magnum-72b",
  "google/gemma-2-9b-it:free",
  "google/gemma-2-9b-it",
  "01-ai/yi-large",
  "ai21/jamba-instruct",
  "anthropic/claude-3.5-sonnet-20240620:beta",
  "anthropic/claude-3.5-sonnet-20240620",
  "sao10k/l3-euryale-70b",
  "cognitivecomputations/dolphin-mixtral-8x22b",
  "qwen/qwen-2-72b-instruct",
  "mistralai/mistral-7b-instruct:free",
  "mistralai/mistral-7b-instruct",
  "nousresearch/hermes-2-pro-llama-3-8b",
  "mistralai/mistral-7b-instruct-v0.3",
  "microsoft/phi-3-mini-128k-instruct",
  "microsoft/phi-3-medium-128k-instruct",
  "neversleep/llama-3-lumimaid-70b",
  "deepseek/deepseek-coder",
  "google/gemini-flash-1.5",
  "openai/gpt-4o",
  "openai/gpt-4o:extended",
  "meta-llama/llama-guard-2-8b",
  "openai/gpt-4o-2024-05-13",
  "allenai/olmo-7b-instruct",
  "neversleep/llama-3-lumimaid-8b:extended",
  "neversleep/llama-3-lumimaid-8b",
  "sao10k/fimbulvetr-11b-v2",
  "meta-llama/llama-3-8b-instruct",
  "meta-llama/llama-3-70b-instruct",
  "mistralai/mixtral-8x22b-instruct",
  "microsoft/wizardlm-2-8x22b",
  "google/gemini-pro-1.5",
  "openai/gpt-4-turbo",
  "cohere/command-r-plus",
  "cohere/command-r-plus-04-2024",
  "sophosympatheia/midnight-rose-70b",
  "cohere/command",
  "cohere/command-r",
  "anthropic/claude-3-haiku:beta",
  "anthropic/claude-3-haiku",
  "anthropic/claude-3-opus:beta",
  "anthropic/claude-3-opus",
  "anthropic/claude-3-sonnet:beta",
  "anthropic/claude-3-sonnet",
  "cohere/command-r-03-2024",
  "mistralai/mistral-large",
  "openai/gpt-3.5-turbo-0613",
  "openai/gpt-4-turbo-preview",
  "nousresearch/nous-hermes-2-mixtral-8x7b-dpo",
  "mistralai/mistral-medium",
  "mistralai/mistral-small",
  "mistralai/mistral-tiny",
  "mistralai/mistral-7b-instruct-v0.2",
  "google/gemini-pro-vision",
  "mistralai/mixtral-8x7b-instruct",
  "neversleep/noromaid-20b",
  "anthropic/claude-2.1:beta",
  "anthropic/claude-2.1",
  "anthropic/claude-2:beta",
  "anthropic/claude-2",
  "undi95/toppy-m-7b",
  "alpindale/goliath-120b",
  "openrouter/auto",
  "openai/gpt-3.5-turbo-1106",
  "openai/gpt-4-1106-preview",
  "google/palm-2-chat-bison-32k",
  "google/palm-2-codechat-bison-32k",
  "jondurbin/airoboros-l2-70b",
  "openai/gpt-3.5-turbo-instruct",
  "mistralai/mistral-7b-instruct-v0.1",
  "pygmalionai/mythalion-13b",
  "openai/gpt-3.5-turbo-16k",
  "openai/gpt-4-32k",
  "openai/gpt-4-32k-0314",
  "mancer/weaver",
  "huggingfaceh4/zephyr-7b-beta:free",
  "anthropic/claude-2.0:beta",
  "anthropic/claude-2.0",
  "undi95/remm-slerp-l2-13b",
  "google/palm-2-chat-bison",
  "google/palm-2-codechat-bison",
  "gryphe/mythomax-l2-13b",
  "meta-llama/llama-2-70b-chat",
  "openai/gpt-3.5-turbo",
  "openai/gpt-3.5-turbo-0125",
  "openai/gpt-4",
  "openai/gpt-4-0314",
];

let seq = 1000; // 内置的模型序号生成器从1000开始
export const DEFAULT_MODELS = [
  ...openaiModels.map((name) => ({
    name,
    available: true,
    sorted: seq++, // Global sequence sort(index)
    provider: {
      id: "openai",
      providerName: "OpenAI",
      providerType: "openai",
      sorted: 1, // 这里是固定的，确保顺序与之前内置的版本一致
    },
  })),
  ...openaiModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "azure",
      providerName: "Azure",
      providerType: "azure",
      sorted: 2,
    },
  })),
  ...googleModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "google",
      providerName: "Google",
      providerType: "google",
      sorted: 3,
    },
  })),
  ...anthropicModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "anthropic",
      providerName: "Anthropic",
      providerType: "anthropic",
      sorted: 4,
    },
  })),
  ...baiduModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "baidu",
      providerName: "Baidu",
      providerType: "baidu",
      sorted: 5,
    },
  })),
  ...bytedanceModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "bytedance",
      providerName: "ByteDance",
      providerType: "bytedance",
      sorted: 6,
    },
  })),
  ...alibabaModes.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "alibaba",
      providerName: "Alibaba",
      providerType: "alibaba",
      sorted: 7,
    },
  })),
  ...tencentModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "tencent",
      providerName: "Tencent",
      providerType: "tencent",
      sorted: 8,
    },
  })),
  ...moonshotModes.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "moonshot",
      providerName: "Moonshot",
      providerType: "moonshot",
      sorted: 9,
    },
  })),
  ...iflytekModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "iflytek",
      providerName: "Iflytek",
      providerType: "iflytek",
      sorted: 10,
    },
  })),
  ...xAIModes.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "xai",
      providerName: "XAI",
      providerType: "xai",
      sorted: 11,
    },
  })),
  ...chatglmModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "chatglm",
      providerName: "ChatGLM",
      providerType: "chatglm",
      sorted: 12,
    },
  })),
  ...deepseekModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "deepseek",
      providerName: "DeepSeek",
      providerType: "deepseek",
      sorted: 13,
    },
  })),
  ...siliconflowModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "siliconflow",
      providerName: "SiliconFlow",
      providerType: "siliconflow",
      sorted: 14,
    },
  })),
  ...openrouterModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "openrouter",
      providerName: "OpenRouter",
      providerType: "openrouter",
      sorted: 14,
    },
  })),
] as const;

export const CHAT_PAGE_SIZE = 15;
export const MAX_RENDER_MSG_COUNT = 45;

// some famous webdav endpoints
export const internalAllowedWebDavEndpoints = [
  "https://dav.jianguoyun.com/dav/",
  "https://dav.dropdav.com/",
  "https://dav.box.com/dav",
  "https://nanao.teracloud.jp/dav/",
  "https://bora.teracloud.jp/dav/",
  "https://webdav.4shared.com/",
  "https://dav.idrivesync.com",
  "https://webdav.yandex.com",
  "https://app.koofr.net/dav/Koofr",
];

export const DEFAULT_GA_ID = "G-89WN60ZK2E";

export const SAAS_CHAT_URL = "https://nextchat.club";
export const SAAS_CHAT_UTM_URL = "https://nextchat.club?utm=github";
