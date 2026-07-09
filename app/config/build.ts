import tauriConfig from "../../src-tauri/tauri.conf.json";
import { DEFAULT_INPUT_TEMPLATE } from "../constant";

export const getBuildConfig = () => {
  if (typeof process === "undefined") {
    throw Error(
      "[Server Config] you are importing a nodejs-only module outside of nodejs",
    );
  }

  const buildMode = process.env.BUILD_MODE ?? "standalone";
  const isApp = !!process.env.BUILD_APP;
  const version = "v" + tauriConfig.package.version;

  const commitInfo = (() => {
    try {
      const childProcess = require("child_process");
      const commitDate: string = childProcess
        .execSync('git log -1 --format="%at000" --date=unix')
        .toString()
        .trim();
      const commitHash: string = childProcess
        .execSync('git log --pretty=format:"%H" -n 1')
        .toString()
        .trim();

      return { commitDate, commitHash };
    } catch (e) {
      console.error("[Build Config] No git or not from git repo.");
      return {
        commitDate: "unknown",
        commitHash: "unknown",
      };
    }
  })();

  return {
    version,
    ...commitInfo,
    buildMode,
    isApp,
    template: process.env.DEFAULT_INPUT_TEMPLATE ?? DEFAULT_INPUT_TEMPLATE,

    needCode: !!process.env.CODE,
    hideUserApiKey: !!process.env.HIDE_USER_API_KEY,
    baseUrl: process.env.BASE_URL,
    openaiUrl: process.env.OPENAI_BASE_URL ?? process.env.BASE_URL,
    disableGPT4: !!process.env.DISABLE_GPT4,
    useCustomConfig: !!process.env.USE_CUSTOM_CONFIG,
    hideBalanceQuery: !process.env.ENABLE_BALANCE_QUERY,
    disableFastLink: !!process.env.DISABLE_FAST_LINK,
    defaultModel: process.env.DEFAULT_MODEL ?? "",
    enableMcp: process.env.ENABLE_MCP === "true",
  };
};

export type BuildConfig = ReturnType<typeof getBuildConfig>;
