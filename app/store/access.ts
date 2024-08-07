import {
  ApiPath,
  DEFAULT_API_HOST,
  GoogleSafetySettingsThreshold,
  ServiceProvider,
  StoreKey,
} from "../constant";
import { getHeaders } from "../client/api";
import { getClientConfig } from "../config/client";
import { createPersistStore } from "../utils/store";
import { ensure } from "../utils/clone";
import { DEFAULT_CONFIG } from "./config";

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

const isApp = getClientConfig()?.buildMode === "export";

const DEFAULT_OPENAI_URL = isApp
  ? DEFAULT_API_HOST + "/api/proxy/openai"
  : ApiPath.OpenAI;

const DEFAULT_GOOGLE_URL = isApp
  ? DEFAULT_API_HOST + "/api/proxy/google"
  : ApiPath.Google;

const DEFAULT_ANTHROPIC_URL = isApp
  ? DEFAULT_API_HOST + "/api/proxy/anthropic"
  : ApiPath.Anthropic;

const DEFAULT_BAIDU_URL = isApp
  ? DEFAULT_API_HOST + "/api/proxy/baidu"
  : ApiPath.Baidu;

const DEFAULT_BYTEDANCE_URL = isApp
  ? DEFAULT_API_HOST + "/api/proxy/bytedance"
  : ApiPath.ByteDance;

const DEFAULT_ALIBABA_URL = isApp
  ? DEFAULT_API_HOST + "/api/proxy/alibaba"
  : ApiPath.Alibaba;

const DEFAULT_TENCENT_URL = isApp
  ? DEFAULT_API_HOST + "/api/proxy/tencent"
  : ApiPath.Tencent;

const DEFAULT_MOONSHOT_URL = isApp
  ? DEFAULT_API_HOST + "/api/proxy/moonshot"
  : ApiPath.Moonshot;

const DEFAULT_STABILITY_URL = isApp
  ? DEFAULT_API_HOST + "/api/proxy/stability"
  : ApiPath.Stability;

const DEFAULT_IFLYTEK_URL = isApp
  ? DEFAULT_API_HOST + "/api/proxy/iflytek"
  : ApiPath.Iflytek;

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

  // server config
  needCode: true,
  hideUserApiKey: false,
  hideBalanceQuery: false,
  disableGPT4: false,
  disableFastLink: false,
  customModels: "",
  defaultModel: "",
};

export const useAccessStore = createPersistStore(
  { ...DEFAULT_ACCESS_STATE },

  (set, get) => ({
    enabledAccessControl() {
      this.fetch();

      return get().needCode;
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
        this.isValidTencent ||
        this.isValidMoonshot() ||
        this.isValidIflytek() ||
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
          // Set default model from env request
          let defaultModel = res.defaultModel ?? "";
          DEFAULT_CONFIG.modelConfig.model =
            defaultModel !== "" ? defaultModel : "gpt-3.5-turbo";
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
  }),
  {
    name: StoreKey.Access,
    version: 2,
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

      return persistedState as any;
    },
  },
);
