import md5 from "spark-md5";
import { DEFAULT_MODELS, DEFAULT_GA_ID } from "../constant";
import { isGPT4Model } from "../utils/model";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PROXY_URL?: string; // docker only

      OPENAI_API_KEY?: string;
      CODE?: string;

      BASE_URL?: string;
      OPENAI_ORG_ID?: string; // openai only

      VERCEL?: string;
      BUILD_MODE?: "standalone" | "export";
      BUILD_APP?: string; // is building desktop app

      HIDE_USER_API_KEY?: string; // disable user's api key input
      DISABLE_GPT4?: string; // allow user to use gpt-4 or not
      ENABLE_BALANCE_QUERY?: string; // allow user to query balance or not
      DISABLE_FAST_LINK?: string; // disallow parse settings from url or not
      CUSTOM_MODELS?: string; // to control custom models
      DEFAULT_MODEL?: string; // to control default model in every new chat window
      VISION_MODELS?: string; // to control vision models

      // stability only
      STABILITY_URL?: string;
      STABILITY_API_KEY?: string;

      // azure only
      AZURE_URL?: string; // https://{azure-url}/openai/deployments/{deploy-name}
      AZURE_API_KEY?: string;
      AZURE_API_VERSION?: string;

      // google only
      GOOGLE_API_KEY?: string;
      GOOGLE_URL?: string;

      // google tag manager
      GTM_ID?: string;

      // moonshot only
      MOONSHOT_URL?: string;
      MOONSHOT_API_KEY?: string;

      DEEPSEEK_URL?: string;
      DEEPSEEK_API_KEY?: string;

      // xai only
      XAI_URL?: string;
      XAI_API_KEY?: string;

      // 302.AI only
      AI302_URL?: string;
      AI302_API_KEY?: string;

      // custom template for preprocessing user input
      DEFAULT_INPUT_TEMPLATE?: string;

      ENABLE_MCP?: string; // enable mcp functionality
    }
  }
}

const ACCESS_CODES = (function getAccessCodes(): Set<string> {
  const code = process.env.CODE;

  try {
    const codes = (code?.split(",") ?? [])
      .filter((v) => !!v)
      .map((v) => md5.hash(v.trim()));
    return new Set(codes);
  } catch (e) {
    return new Set();
  }
})();

function getApiKey(keys?: string) {
  const apiKeyEnvVar = keys ?? "";
  const apiKeys = apiKeyEnvVar.split(",").map((v) => v.trim());
  const randomIndex = Math.floor(Math.random() * apiKeys.length);
  const apiKey = apiKeys[randomIndex];
  if (apiKey) {
    console.log(
      `[Server Config] using ${randomIndex + 1} of ${
        apiKeys.length
      } api key - ${apiKey}`,
    );
  }

  return apiKey;
}

export const getServerSideConfig = () => {
  if (typeof process === "undefined") {
    throw Error(
      "[Server Config] you are importing a nodejs-only module outside of nodejs",
    );
  }

  const disableGPT4 = !!process.env.DISABLE_GPT4;
  let customModels = process.env.CUSTOM_MODELS ?? "";
  let defaultModel = process.env.DEFAULT_MODEL ?? "";
  let visionModels = process.env.VISION_MODELS ?? "";

  if (disableGPT4) {
    if (customModels) customModels += ",";
    customModels += DEFAULT_MODELS.filter((m) => isGPT4Model(m.name))
      .map((m) => "-" + m.name)
      .join(",");
    if (defaultModel && isGPT4Model(defaultModel)) {
      defaultModel = "";
    }
  }

  const isStability = !!process.env.STABILITY_API_KEY;

  const isAzure = !!process.env.AZURE_URL;
  const isGoogle = !!process.env.GOOGLE_API_KEY;
  const isMoonshot = !!process.env.MOONSHOT_API_KEY;
  const isDeepSeek = !!process.env.DEEPSEEK_API_KEY;
  const isXAI = !!process.env.XAI_API_KEY;
  const isAI302 = !!process.env.AI302_API_KEY;

  const allowedWebDavEndpoints = (
    process.env.WHITE_WEBDAV_ENDPOINTS ?? ""
  ).split(",");

  return {
    baseUrl: process.env.BASE_URL,
    apiKey: getApiKey(process.env.OPENAI_API_KEY),
    openaiOrgId: process.env.OPENAI_ORG_ID,

    isStability,
    stabilityUrl: process.env.STABILITY_URL,
    stabilityApiKey: getApiKey(process.env.STABILITY_API_KEY),

    isAzure,
    azureUrl: process.env.AZURE_URL,
    azureApiKey: getApiKey(process.env.AZURE_API_KEY),
    azureApiVersion: process.env.AZURE_API_VERSION,

    isGoogle,
    googleApiKey: getApiKey(process.env.GOOGLE_API_KEY),
    googleUrl: process.env.GOOGLE_URL,

    isMoonshot,
    moonshotUrl: process.env.MOONSHOT_URL,
    moonshotApiKey: getApiKey(process.env.MOONSHOT_API_KEY),

    isDeepSeek,
    deepseekUrl: process.env.DEEPSEEK_URL,
    deepseekApiKey: getApiKey(process.env.DEEPSEEK_API_KEY),

    isXAI,
    xaiUrl: process.env.XAI_URL,
    xaiApiKey: getApiKey(process.env.XAI_API_KEY),

    cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    cloudflareKVNamespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
    cloudflareKVApiKey: getApiKey(process.env.CLOUDFLARE_KV_API_KEY),
    cloudflareKVTTL: process.env.CLOUDFLARE_KV_TTL,

    isAI302,
    ai302Url: process.env.AI302_URL,
    ai302ApiKey: getApiKey(process.env.AI302_API_KEY),

    gtmId: process.env.GTM_ID,
    gaId: process.env.GA_ID || DEFAULT_GA_ID,

    needCode: ACCESS_CODES.size > 0,
    code: process.env.CODE,
    codes: ACCESS_CODES,

    proxyUrl: process.env.PROXY_URL,
    isVercel: !!process.env.VERCEL,

    hideUserApiKey: !!process.env.HIDE_USER_API_KEY,
    disableGPT4,
    hideBalanceQuery: !process.env.ENABLE_BALANCE_QUERY,
    disableFastLink: !!process.env.DISABLE_FAST_LINK,
    customModels,
    defaultModel,
    visionModels,
    allowedWebDavEndpoints,
    enableMcp: process.env.ENABLE_MCP === "true",
  };
};
