import {
  GoogleSafetySettingsThreshold,
  ServiceProvider,
  StoreKey,
  ApiPath,
  OPENAI_BASE_URL,
  ANTHROPIC_BASE_URL,
  GEMINI_BASE_URL,
  BAIDU_BASE_URL,
  BYTEDANCE_BASE_URL,
  ALIBABA_BASE_URL,
  TENCENT_BASE_URL,
  MOONSHOT_BASE_URL,
  STABILITY_BASE_URL,
  IFLYTEK_BASE_URL,
  DEEPSEEK_BASE_URL,
  XAI_BASE_URL,
  CHATGLM_BASE_URL,
  SILICONFLOW_BASE_URL,
  AI302_BASE_URL,
} from "../constant";
import { getHeaders } from "../client/api";
import { getClientConfig } from "../config/client";
import { createPersistStore } from "../utils/store";
import { ensure } from "../utils/clone";
import { DEFAULT_CONFIG } from "./config";
import { getModelProvider } from "../utils/model";
import { useAppConfig } from "./config";

/**
 * A user-defined custom endpoint, bundling provider + base URL + API key +
 * custom model names into a single switchable configuration.
 */
export interface CustomEndpoint {
  id: string;
  name: string;
  provider: ServiceProvider;
  baseUrl: string;
  apiKey: string;
  customModels: string;
}

/**
 * Maps each ServiceProvider to the access-store fields that hold its
 * base URL and API key, so activateEndpoint can write a custom endpoint's
 * values into the right place without touching request-layer code.
 */
const PROVIDER_FIELD_MAP: Record<
  ServiceProvider,
  {
    url: keyof typeof DEFAULT_ACCESS_STATE;
    key: keyof typeof DEFAULT_ACCESS_STATE;
  }
> = {
  [ServiceProvider.OpenAI]: { url: "openaiUrl", key: "openaiApiKey" },
  [ServiceProvider.Azure]: { url: "azureUrl", key: "azureApiKey" },
  [ServiceProvider.Google]: { url: "googleUrl", key: "googleApiKey" },
  [ServiceProvider.Anthropic]: { url: "anthropicUrl", key: "anthropicApiKey" },
  [ServiceProvider.Baidu]: { url: "baiduUrl", key: "baiduApiKey" },
  [ServiceProvider.ByteDance]: { url: "bytedanceUrl", key: "bytedanceApiKey" },
  [ServiceProvider.Alibaba]: { url: "alibabaUrl", key: "alibabaApiKey" },
  [ServiceProvider.Tencent]: { url: "tencentUrl", key: "tencentSecretId" },
  [ServiceProvider.Moonshot]: { url: "moonshotUrl", key: "moonshotApiKey" },
  [ServiceProvider.Stability]: { url: "stabilityUrl", key: "stabilityApiKey" },
  [ServiceProvider.Iflytek]: { url: "iflytekUrl", key: "iflytekApiKey" },
  [ServiceProvider.XAI]: { url: "xaiUrl", key: "xaiApiKey" },
  [ServiceProvider.ChatGLM]: { url: "chatglmUrl", key: "chatglmApiKey" },
  [ServiceProvider.DeepSeek]: { url: "deepseekUrl", key: "deepseekApiKey" },
  [ServiceProvider.SiliconFlow]: {
    url: "siliconflowUrl",
    key: "siliconflowApiKey",
  },
  [ServiceProvider["302.AI"]]: { url: "ai302Url", key: "ai302ApiKey" },
};

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

const isApp = getClientConfig()?.buildMode === "export";

const DEFAULT_OPENAI_URL = isApp ? OPENAI_BASE_URL : ApiPath.OpenAI;

const DEFAULT_GOOGLE_URL = isApp ? GEMINI_BASE_URL : ApiPath.Google;

const DEFAULT_ANTHROPIC_URL = isApp ? ANTHROPIC_BASE_URL : ApiPath.Anthropic;

const DEFAULT_BAIDU_URL = isApp ? BAIDU_BASE_URL : ApiPath.Baidu;

const DEFAULT_BYTEDANCE_URL = isApp ? BYTEDANCE_BASE_URL : ApiPath.ByteDance;

const DEFAULT_ALIBABA_URL = isApp ? ALIBABA_BASE_URL : ApiPath.Alibaba;

const DEFAULT_TENCENT_URL = isApp ? TENCENT_BASE_URL : ApiPath.Tencent;

const DEFAULT_MOONSHOT_URL = isApp ? MOONSHOT_BASE_URL : ApiPath.Moonshot;

const DEFAULT_STABILITY_URL = isApp ? STABILITY_BASE_URL : ApiPath.Stability;

const DEFAULT_IFLYTEK_URL = isApp ? IFLYTEK_BASE_URL : ApiPath.Iflytek;

const DEFAULT_DEEPSEEK_URL = isApp ? DEEPSEEK_BASE_URL : ApiPath.DeepSeek;

const DEFAULT_XAI_URL = isApp ? XAI_BASE_URL : ApiPath.XAI;

const DEFAULT_CHATGLM_URL = isApp ? CHATGLM_BASE_URL : ApiPath.ChatGLM;

const DEFAULT_SILICONFLOW_URL = isApp
  ? SILICONFLOW_BASE_URL
  : ApiPath.SiliconFlow;

const DEFAULT_AI302_URL = isApp ? AI302_BASE_URL : ApiPath["302.AI"];

const DEFAULT_ACCESS_STATE = {
  accessCode: "",
  useCustomConfig: false,

  provider: ServiceProvider.OpenAI,

  // openai
  openaiUrl: DEFAULT_OPENAI_URL,
  openaiApiKey: "",

  // azure
  azureUrl: "",
  azureApiKey: "",
  azureApiVersion: "2023-08-01-preview",

  // google ai studio
  googleUrl: DEFAULT_GOOGLE_URL,
  googleApiKey: "",
  googleApiVersion: "v1",
  googleSafetySettings: GoogleSafetySettingsThreshold.BLOCK_ONLY_HIGH,

  // anthropic
  anthropicUrl: DEFAULT_ANTHROPIC_URL,
  anthropicApiKey: "",
  anthropicApiVersion: "2023-06-01",

  // baidu
  baiduUrl: DEFAULT_BAIDU_URL,
  baiduApiKey: "",
  baiduSecretKey: "",

  // bytedance
  bytedanceUrl: DEFAULT_BYTEDANCE_URL,
  bytedanceApiKey: "",

  // alibaba
  alibabaUrl: DEFAULT_ALIBABA_URL,
  alibabaApiKey: "",

  // moonshot
  moonshotUrl: DEFAULT_MOONSHOT_URL,
  moonshotApiKey: "",

  //stability
  stabilityUrl: DEFAULT_STABILITY_URL,
  stabilityApiKey: "",

  // tencent
  tencentUrl: DEFAULT_TENCENT_URL,
  tencentSecretKey: "",
  tencentSecretId: "",

  // iflytek
  iflytekUrl: DEFAULT_IFLYTEK_URL,
  iflytekApiKey: "",
  iflytekApiSecret: "",

  // deepseek
  deepseekUrl: DEFAULT_DEEPSEEK_URL,
  deepseekApiKey: "",

  // xai
  xaiUrl: DEFAULT_XAI_URL,
  xaiApiKey: "",

  // chatglm
  chatglmUrl: DEFAULT_CHATGLM_URL,
  chatglmApiKey: "",

  // siliconflow
  siliconflowUrl: DEFAULT_SILICONFLOW_URL,
  siliconflowApiKey: "",

  // 302.AI
  ai302Url: DEFAULT_AI302_URL,
  ai302ApiKey: "",

  // server config
  needCode: true,
  hideUserApiKey: false,
  hideBalanceQuery: false,
  disableGPT4: false,
  disableFastLink: false,
  customModels: "",
  defaultModel: "",
  visionModels: "",

  // tts config
  edgeTTSVoiceName: "zh-CN-YunxiNeural",

  // custom endpoints (user-defined switchable provider bundles)
  customEndpoints: [] as CustomEndpoint[],
  activeEndpointId: null as string | null,
};

export const useAccessStore = createPersistStore(
  { ...DEFAULT_ACCESS_STATE },

  (set, get) => ({
    enabledAccessControl() {
      this.fetch();

      return get().needCode;
    },
    getVisionModels() {
      this.fetch();
      return get().visionModels;
    },
    edgeVoiceName() {
      this.fetch();

      return get().edgeTTSVoiceName;
    },

    isValidOpenAI() {
      return ensure(get(), ["openaiApiKey"]);
    },

    isValidAzure() {
      return ensure(get(), ["azureUrl", "azureApiKey", "azureApiVersion"]);
    },

    isValidGoogle() {
      return ensure(get(), ["googleApiKey"]);
    },

    isValidAnthropic() {
      return ensure(get(), ["anthropicApiKey"]);
    },

    isValidBaidu() {
      return ensure(get(), ["baiduApiKey", "baiduSecretKey"]);
    },

    isValidByteDance() {
      return ensure(get(), ["bytedanceApiKey"]);
    },

    isValidAlibaba() {
      return ensure(get(), ["alibabaApiKey"]);
    },

    isValidTencent() {
      return ensure(get(), ["tencentSecretKey", "tencentSecretId"]);
    },

    isValidMoonshot() {
      return ensure(get(), ["moonshotApiKey"]);
    },
    isValidIflytek() {
      return ensure(get(), ["iflytekApiKey"]);
    },
    isValidDeepSeek() {
      return ensure(get(), ["deepseekApiKey"]);
    },

    isValidXAI() {
      return ensure(get(), ["xaiApiKey"]);
    },

    isValidChatGLM() {
      return ensure(get(), ["chatglmApiKey"]);
    },

    isValidSiliconFlow() {
      return ensure(get(), ["siliconflowApiKey"]);
    },

    isAuthorized() {
      this.fetch();

      // has token or has code or disabled access control
      return (
        this.isValidOpenAI() ||
        this.isValidAzure() ||
        this.isValidGoogle() ||
        this.isValidAnthropic() ||
        this.isValidBaidu() ||
        this.isValidByteDance() ||
        this.isValidAlibaba() ||
        this.isValidTencent() ||
        this.isValidMoonshot() ||
        this.isValidIflytek() ||
        this.isValidDeepSeek() ||
        this.isValidXAI() ||
        this.isValidChatGLM() ||
        this.isValidSiliconFlow() ||
        !this.enabledAccessControl() ||
        (this.enabledAccessControl() && ensure(get(), ["accessCode"]))
      );
    },
    fetch() {
      if (fetchState > 0 || getClientConfig()?.buildMode === "export") return;
      fetchState = 1;
      fetch("/api/config", {
        method: "post",
        body: null,
        headers: {
          ...getHeaders(),
        },
      })
        .then((res) => res.json())
        .then((res) => {
          const defaultModel = res.defaultModel ?? "";
          if (defaultModel !== "") {
            const [model, providerName] = getModelProvider(defaultModel);
            DEFAULT_CONFIG.modelConfig.model = model;
            DEFAULT_CONFIG.modelConfig.providerName = providerName as any;
          }

          return res;
        })
        .then((res: DangerConfig) => {
          console.log("[Config] got config from server", res);
          set(() => ({ ...res }));
        })
        .catch(() => {
          console.error("[Config] failed to fetch config");
        })
        .finally(() => {
          fetchState = 2;
        });
    },

    /**
     * Add a new custom endpoint. Returns the created id.
     */
    addCustomEndpoint(name?: string) {
      const id =
        Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      const endpoint: CustomEndpoint = {
        id,
        name: name ?? `Custom Endpoint ${get().customEndpoints.length + 1}`,
        provider: ServiceProvider.OpenAI,
        baseUrl: "",
        apiKey: "",
        customModels: "",
      };
      set((state) => ({
        customEndpoints: [...state.customEndpoints, endpoint],
      }));
      return id;
    },

    /**
     * Remove a custom endpoint by id. If it was the active one, clear
     * activeEndpointId.
     */
    removeCustomEndpoint(id: string) {
      set((state) => {
        const endpoints = state.customEndpoints.filter((e) => e.id !== id);
        const wasActive = state.activeEndpointId === id;
        return {
          customEndpoints: endpoints,
          activeEndpointId: wasActive ? null : state.activeEndpointId,
        };
      });
    },

    /**
     * Update a single custom endpoint.
     */
    updateCustomEndpoint(id: string, patch: Partial<CustomEndpoint>) {
      set((state) => ({
        customEndpoints: state.customEndpoints.map((e) =>
          e.id === id ? { ...e, ...patch } : e,
        ),
      }));
    },

    /**
     * Activate a custom endpoint by writing its values into the matching
     * provider URL/key fields and the global customModels, so existing
     * request-layer code picks them up without changes.
     */
    activateEndpoint(id: string) {
      const ep = get().customEndpoints.find((e) => e.id === id);
      if (!ep) return;

      const fields = PROVIDER_FIELD_MAP[ep.provider];
      const patch: any = {
        activeEndpointId: id,
        provider: ep.provider,
      };
      if (fields) {
        patch[fields.url] = ep.baseUrl;
        patch[fields.key] = ep.apiKey;
      }

      // Sync custom model list to config store so the model selector shows them.
      useAppConfig
        .getState()
        .update((config) => (config.customModels = ep.customModels));

      set(patch);
    },

    /**
     * Clear the active custom endpoint, falling back to the manually
     * configured provider/url/key values.
     */
    clearActiveEndpoint() {
      set({ activeEndpointId: null });
    },
  }),
  {
    name: StoreKey.Access,
    version: 3,
    migrate(persistedState, version) {
      if (version < 2) {
        const state = persistedState as {
          token: string;
          openaiApiKey: string;
          azureApiVersion: string;
          googleApiKey: string;
        };
        state.openaiApiKey = state.token;
        state.azureApiVersion = "2023-08-01-preview";
      }

      if (version < 3) {
        const state = persistedState as Record<string, any>;
        state.customEndpoints = Array.isArray(state.customEndpoints)
          ? state.customEndpoints
          : [];
        state.activeEndpointId = state.activeEndpointId ?? null;
      }

      return persistedState as any;
    },
  },
);
