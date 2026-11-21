import { NextResponse } from "next/server";

import { getServerSideConfig } from "../../config/server";
import { accountEnabled } from "../account/session";
import { usesAccountRelay } from "../account/new-api";

const serverConfig = getServerSideConfig();

// Danger! Do not hard code any secret value here!
// 警告！不要在这里写入任何敏感信息！
const DANGER_CONFIG = {
  needCode: serverConfig.needCode,
  hideUserApiKey: serverConfig.hideUserApiKey,
  disableGPT4: serverConfig.disableGPT4,
  hideBalanceQuery: serverConfig.hideBalanceQuery,
  disableFastLink: serverConfig.disableFastLink,
  customModels: serverConfig.customModels,
  defaultModel: serverConfig.defaultModel,
  visionModels: serverConfig.visionModels,
};

declare global {
  type DangerConfig = typeof DANGER_CONFIG & { accountEnabled: boolean };
}

async function handle() {
  return NextResponse.json({
    ...DANGER_CONFIG,
    accountEnabled: accountEnabled() && usesAccountRelay(serverConfig.baseUrl),
  });
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
