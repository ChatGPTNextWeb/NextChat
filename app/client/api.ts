import { getClientConfig } from "../config/client";
import {
  ACCESS_CODE_PREFIX,
  ModelProvider,
  ServiceProvider,
} from "../constant";
import {
  ChatMessageTool,
  ChatMessage,
  ModelType,
  useAccessStore,
  useChatStore,
} from "../store";
import { ChatGPTApi, DalleRequestPayload } from "./platforms/openai";
import { GeminiProApi } from "./platforms/google";
import { ClaudeApi } from "./platforms/anthropic";
import { ErnieApi } from "./platforms/baidu";
import { DoubaoApi } from "./platforms/bytedance";
import { QwenApi } from "./platforms/alibaba";
import { HunyuanApi } from "./platforms/tencent";
import { MoonshotApi } from "./platforms/moonshot";
import { SparkApi } from "./platforms/iflytek";
import { DeepSeekApi } from "./platforms/deepseek";
import { XAIApi } from "./platforms/xai";
import { ChatGLMApi } from "./platforms/glm";
import { SiliconflowApi } from "./platforms/siliconflow";

export const ROLES = ["system", "user", "assistant"] as const;
export type MessageRole = (typeof ROLES)[number];

export const Models = ["gpt-3.5-turbo", "gpt-4"] as const;
export const TTSModels = ["tts-1", "tts-1-hd"] as const;
export type ChatModel = ModelType;

export interface MultimodalContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface MultimodalContentForAlibaba {
  text?: string;
  image?: string;
}

export interface RequestMessage {
  role: MessageRole;
  content: string | MultimodalContent[];
}

export interface LLMConfig {
  model: string;
  providerName?: string;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  presence_penalty?: number;
  frequency_penalty?: number;
  size?: DalleRequestPayload["size"];
  quality?: DalleRequestPayload["quality"];
  style?: DalleRequestPayload["style"];
}

export interface SpeechOptions {
  model: string;
  input: string;
  voice: string;
  response_format?: string;
  speed?: number;
  onController?: (controller: AbortController) => void;
}

export interface ChatOptions {
  messages: RequestMessage[];
  config: LLMConfig;

  onUpdate?: (message: string, chunk: string) => void;
  onFinish: (message: string, responseRes: Response) => void;
  onError?: (err: Error) => void;
  onController?: (controller: AbortController) => void;
  onBeforeTool?: (tool: ChatMessageTool) => void;
  onAfterTool?: (tool: ChatMessageTool) => void;
}

export interface LLMUsage {
  used: number;
  total: number;
}

export interface LLMModel {
  name: string;
  displayName?: string;
  available: boolean;
  provider: LLMModelProvider;
  sorted: number;
}

export interface LLMModelProvider {
  id: string;
  providerName: string;
  providerType: string;
  sorted: number;
}

export abstract class LLMApi {
  abstract chat(options: ChatOptions): Promise<void>;
  abstract speech(options: SpeechOptions): Promise<ArrayBuffer>;
  abstract usage(): Promise<LLMUsage>;
  abstract models(): Promise<LLMModel[]>;
}

type ProviderName = "openai" | "azure" | "claude" | "palm";

interface Model {
  name: string;
  provider: ProviderName;
  ctxlen: number;
}

interface ChatProvider {
  name: ProviderName;
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    summaryModel: Model;
  };
  models: Model[];

  chat: () => void;
  usage: () => void;
}

// Khởi tạo API client dựa trên nhà cung cấp mô hình được chỉ định
export class ClientApi {
  public llm: LLMApi;

  // Hàm khởi tạo nhận vào một provider (nhà cung cấp mô hình AI)
  // Mặc định là ModelProvider.GPT nếu không được chỉ định
  constructor(provider: ModelProvider = ModelProvider.GPT) {
    console.log("[ClientApi] provider ", provider);

    // Sử dụng switch để khởi tạo instance tương ứng với provider được chọn
    switch (provider) {
      case ModelProvider.GeminiPro:
        this.llm = new GeminiProApi();
        break;
      case ModelProvider.Claude:
        this.llm = new ClaudeApi();
        break;
      case ModelProvider.Ernie:
        this.llm = new ErnieApi();
        break;
      case ModelProvider.Doubao:
        this.llm = new DoubaoApi();
        break;
      case ModelProvider.Qwen:
        this.llm = new QwenApi();
        break;
      case ModelProvider.Hunyuan:
        this.llm = new HunyuanApi();
        break;
      case ModelProvider.Moonshot:
        this.llm = new MoonshotApi();
        break;
      case ModelProvider.Iflytek:
        this.llm = new SparkApi();
        break;
      case ModelProvider.DeepSeek:
        this.llm = new DeepSeekApi();
        break;
      case ModelProvider.XAI:
        this.llm = new XAIApi();
        break;
      case ModelProvider.ChatGLM:
        this.llm = new ChatGLMApi();
        break;
      case ModelProvider.SiliconFlow:
        this.llm = new SiliconflowApi();
        break;
      default:
        this.llm = new ChatGPTApi();
    }
  }

  // Hàm cấu hình (chưa triển khai chi tiết)
  config() {}

  // Hàm lấy prompts (chưa triển khai chi tiết)
  prompts() {}

  // Hàm lấy masks (chưa triển khai chi tiết)
  masks() {}

  // Hàm chia sẻ cuộc trò chuyện
  async share(messages: ChatMessage[], avatarUrl: string | null = null) {
    // Chuẩn bị dữ liệu tin nhắn để chia sẻ
    const msgs = messages
      .map((m) => ({
        from: m.role === "user" ? "human" : "gpt",
        value: m.content,
      }))
      .concat([
        {
          from: "human",
          value:
            "Share from [NextChat]: https://github.com/Yidadaa/ChatGPT-Next-Web",
        },
      ]);
    // Lưu ý: Không nên sửa đổi dòng thông báo cuối cùng này vì nó dùng cho việc làm sạch dữ liệu sau này
    // Please do not modify this message

    console.log("[Share]", messages, msgs);
    //
    // Lấy cấu hình client
    const clientConfig = getClientConfig();

    // Xác định URL để chia sẻ dựa trên môi trường (app hay web)
    const proxyUrl = "/sharegpt";
    const rawUrl = "https://sharegpt.com/api/conversations";
    const shareUrl = clientConfig?.isApp ? rawUrl : proxyUrl;

    // Gửi yêu cầu POST để chia sẻ cuộc trò chuyện
    const res = await fetch(shareUrl, {
      body: JSON.stringify({
        avatarUrl,
        items: msgs,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    // Xử lý phản hồi và trả về link chia sẻ
    const resJson = await res.json();
    // console.log("[Share]", resJson);
    if (resJson.id) {
      return `https://shareg.pt/${resJson.id}`;
    }
  }
}

// Hàm tạo token xác thực Bearer
export function getBearerToken(
  apiKey: string,
  noBearer: boolean = false,
): string {
  return validString(apiKey)
    ? `${noBearer ? "" : "Bearer "}${apiKey.trim()}`
    : "";
}

// Hàm kiểm tra chuỗi có hợp lệ không (có độ dài > 0)
export function validString(x: string): boolean {
  return x?.length > 0;
}

// Hàm lấy các header cần thiết cho yêu cầu API
export function getHeaders(ignoreHeaders: boolean = false) {
  // Lấy store để truy cập các trạng thái liên quan đến quyền truy cập và chat
  const accessStore = useAccessStore.getState();
  const chatStore = useChatStore.getState();

  // Khởi tạo đối tượng headers rỗng
  let headers: Record<string, string> = {};

  // Nếu không bỏ qua headers thì thêm các header mặc định
  if (!ignoreHeaders) {
    headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  // Lấy cấu hình client
  const clientConfig = getClientConfig();

  // Hàm getConfig sẽ xác định nhà cung cấp hiện tại và API key tương ứng
  function getConfig() {
    // Lấy cấu hình mô hình từ session hiện tại
    const modelConfig = chatStore.currentSession().mask.modelConfig;

    // Kiểm tra loại nhà cung cấp đang được sử dụng
    const isGoogle = modelConfig.providerName === ServiceProvider.Google;
    const isAzure = modelConfig.providerName === ServiceProvider.Azure;
    const isAnthropic = modelConfig.providerName === ServiceProvider.Anthropic;
    const isBaidu = modelConfig.providerName == ServiceProvider.Baidu;
    const isByteDance = modelConfig.providerName === ServiceProvider.ByteDance;
    const isAlibaba = modelConfig.providerName === ServiceProvider.Alibaba;
    const isMoonshot = modelConfig.providerName === ServiceProvider.Moonshot;
    const isIflytek = modelConfig.providerName === ServiceProvider.Iflytek;
    const isDeepSeek = modelConfig.providerName === ServiceProvider.DeepSeek;
    const isXAI = modelConfig.providerName === ServiceProvider.XAI;
    const isChatGLM = modelConfig.providerName === ServiceProvider.ChatGLM;
    const isSiliconFlow =
      modelConfig.providerName === ServiceProvider.SiliconFlow;

    // Kiểm tra xem có bật kiểm soát truy cập không
    const isEnabledAccessControl = accessStore.enabledAccessControl();

    // Xác định API key dựa trên nhà cung cấp đang được sử dụng
    const apiKey = isGoogle
      ? accessStore.googleApiKey
      : isAzure
      ? accessStore.azureApiKey
      : isAnthropic
      ? accessStore.anthropicApiKey
      : isByteDance
      ? accessStore.bytedanceApiKey
      : isAlibaba
      ? accessStore.alibabaApiKey
      : isMoonshot
      ? accessStore.moonshotApiKey
      : isXAI
      ? accessStore.xaiApiKey
      : isDeepSeek
      ? accessStore.deepseekApiKey
      : isChatGLM
      ? accessStore.chatglmApiKey
      : isSiliconFlow
      ? accessStore.siliconflowApiKey
      : isIflytek
      ? accessStore.iflytekApiKey && accessStore.iflytekApiSecret
        ? accessStore.iflytekApiKey + ":" + accessStore.iflytekApiSecret
        : ""
      : accessStore.openaiApiKey;

    console.log("apiKey:", apiKey);
    return {
      isGoogle,
      isAzure,
      isAnthropic,
      isBaidu,
      isByteDance,
      isAlibaba,
      isMoonshot,
      isIflytek,
      isDeepSeek,
      isXAI,
      isChatGLM,
      isSiliconFlow,
      apiKey,
      isEnabledAccessControl,
    };
  }

  // Hàm xác định header nào sẽ được sử dụng để xác thực
  function getAuthHeader(): string {
    return isAzure
      ? "api-key"
      : isAnthropic
      ? "x-api-key"
      : isGoogle
      ? "x-goog-api-key"
      : "Authorization";
  }

  // Lấy các giá trị đã được xác định trong getConfig
  const {
    isGoogle,
    isAzure,
    isAnthropic,
    isBaidu,
    isByteDance,
    isAlibaba,
    isMoonshot,
    isIflytek,
    isDeepSeek,
    isXAI,
    isChatGLM,
    isSiliconFlow,
    apiKey,
    isEnabledAccessControl,
  } = getConfig();

  // Khi sử dụng API của Baidu trong ứng dụng, không đặt header xác thực
  if (isBaidu && clientConfig?.isApp) return headers;

  // Xác định tên header xác thực
  const authHeader = getAuthHeader();

  // Tạo token xác thực
  const bearerToken = getBearerToken(
    apiKey,
    isAzure || isAnthropic || isGoogle,
  );

  // Nếu có bearer token thì thêm vào headers
  if (bearerToken) {
    headers[authHeader] = bearerToken;
  } else if (isEnabledAccessControl && validString(accessStore.accessCode)) {
    // Nếu có mã truy cập thì sử dụng nó để tạo bearer token
    headers["Authorization"] = getBearerToken(
      ACCESS_CODE_PREFIX + accessStore.accessCode,
    );
  }

  return headers;
}

// Hàm tạo instance của ClientApi dựa trên nhà cung cấp dịch vụ
export function getClientApi(provider: ServiceProvider): ClientApi {
  switch (provider) {
    case ServiceProvider.Google:
      return new ClientApi(ModelProvider.GeminiPro);
    case ServiceProvider.Anthropic:
      return new ClientApi(ModelProvider.Claude);
    case ServiceProvider.Baidu:
      return new ClientApi(ModelProvider.Ernie);
    case ServiceProvider.ByteDance:
      return new ClientApi(ModelProvider.Doubao);
    case ServiceProvider.Alibaba:
      return new ClientApi(ModelProvider.Qwen);
    case ServiceProvider.Tencent:
      return new ClientApi(ModelProvider.Hunyuan);
    case ServiceProvider.Moonshot:
      return new ClientApi(ModelProvider.Moonshot);
    case ServiceProvider.Iflytek:
      return new ClientApi(ModelProvider.Iflytek);
    case ServiceProvider.DeepSeek:
      return new ClientApi(ModelProvider.DeepSeek);
    case ServiceProvider.XAI:
      return new ClientApi(ModelProvider.XAI);
    case ServiceProvider.ChatGLM:
      return new ClientApi(ModelProvider.ChatGLM);
    case ServiceProvider.SiliconFlow:
      return new ClientApi(ModelProvider.SiliconFlow);
    default:
      return new ClientApi(ModelProvider.GPT);
  }
}
