import { getClientConfig } from "../config/client";
import { ServiceProvider } from "../constant";
import Locale from "../locales";
import { useAccessStore, useChatStore } from "../store";
import { getModelProvider } from "../utils/model";
import { showConfirm } from "./ui-lib";

export async function applyFastConnection(text: string) {
  let payload: { key?: unknown; url?: unknown } | null;
  try {
    payload = JSON.parse(text);
  } catch {
    return;
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return;
  }
  const key = typeof payload.key === "string" ? payload.key : "";
  const url = typeof payload.url === "string" ? payload.url : "";
  if (!key && !url) return;

  const clientConfig = getClientConfig();
  const chatStore = useChatStore.getState();
  const session = chatStore.currentSession();
  const configFetch = useAccessStore.getState().fetch();
  if (configFetch && !(await configFetch)) return;
  const current = useAccessStore.getState();
  if (current.disableFastLink || current.hideUserApiKey) return;

  const pilotLink =
    !!configFetch &&
    !clientConfig?.isApp &&
    Object.keys(payload).length === 1 &&
    /^sk-[A-Za-z0-9_-]{20,128}$/.test(key);
  const replacesExisting = current.pilotApiKey && current.pilotApiKey !== key;
  if (
    (!pilotLink || replacesExisting) &&
    !(await showConfirm(Locale.URLCommand.Settings))
  )
    return;

  if (pilotLink) {
    current.update((access) => (access.pilotApiKey = key));
    if (current.defaultModel && session.messages.length === 0) {
      const [model] = getModelProvider(current.defaultModel);
      chatStore.updateTargetSession(session, (target) => {
        target.mask.modelConfig.model = model;
        target.mask.modelConfig.providerName = ServiceProvider.OpenAI;
      });
    }
    return;
  }
  current.update((access) => {
    access.pilotApiKey = "";
    if (key) access.openaiApiKey = key;
    if (url) access.openaiUrl = url;
    access.useCustomConfig = true;
  });
}
