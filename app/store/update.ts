import {
  FETCH_COMMIT_URL,
  FETCH_TAG_URL,
  ModelProvider,
  StoreKey,
} from "../constant";
import { getClientConfig } from "../config/client";
import { createPersistStore } from "../utils/store";
import { clientUpdate } from "../utils";
import ChatGptIcon from "../icons/chatgpt.png";
import Locale from "../locales";
import { ClientApi } from "../client/api";

const ONE_MINUTE = 60 * 1000;
const isApp = !!getClientConfig()?.isApp;

function formatVersionDate(t: string) {
  const d = new Date(+t);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();

  return [
    year.toString(),
    month.toString().padStart(2, "0"),
    day.toString().padStart(2, "0"),
  ].join("");
}

type VersionType = "date" | "tag";

async function getVersion(type: VersionType) {
  if (type === "date") {
    const data = (await (await fetch(FETCH_COMMIT_URL)).json()) as {
      commit: {
        author: { name: string; date: string };
      };
      sha: string;
    }[];
    const remoteCommitTime = data[0].commit.author.date;
    const remoteId = new Date(remoteCommitTime).getTime().toString();
    return remoteId;
  } else if (type === "tag") {
    const data = (await (await fetch(FETCH_TAG_URL)).json()) as {
      commit: { sha: string; url: string };
      name: string;
    }[];
    return data.at(0)?.name;
  }
}

export const useUpdateStore = createPersistStore(
  {
    versionType: "tag" as VersionType,
    lastUpdate: 0,
    version: "unknown",
    remoteVersion: "",
    used: 0,
    subscription: 0,

    lastUpdateUsage: 0,
  },
  (set, get) => ({
    formatVersion(version: string) {
      if (get().versionType === "date") {
        version = formatVersionDate(version);
      }
      return version;
    },

    async getLatestVersion(force = false) {
      const versionType = get().versionType;
      let version =
        versionType === "date"
          ? getClientConfig()?.commitDate
          : getClientConfig()?.version;

      set(() => ({ version }));

      const shouldCheck = Date.now() - get().lastUpdate > 2 * 60 * ONE_MINUTE;
      if (!force && !shouldCheck) return;

      set(() => ({
        lastUpdate: Date.now(),
      }));

      try {
        const remoteId = await getVersion(versionType);
        set(() => ({
          remoteVersion: remoteId,
        }));
        if (window.__TAURI__?.notification && isApp) {
          // Check if notification permission is granted
          await window.__TAURI__?.notification
            .isPermissionGranted()
            .then((granted) => {
              if (!granted) {
                return;
              } else {
                // Request permission to show notifications
                window.__TAURI__?.notification
                  .requestPermission()
                  .then((permission) => {
                    if (permission === "granted") {
                      if (version === remoteId) {
                        // Show a notification using Tauri
                        window.__TAURI__?.notification.sendNotification({
                          title: "NextChat",
                          body: `${Locale.Settings.Update.IsLatest}`,
                          icon: `${ChatGptIcon.src}`,
                          sound: "Default",
                        });
                      } else {
                        const updateMessage =
                          Locale.Settings.Update.FoundUpdate(`${remoteId}`);
                        // Show a notification for the new version using Tauri
                        window.__TAURI__?.notification.sendNotification({
                          title: "NextChat",
                          body: updateMessage,
                          icon: `${ChatGptIcon.src}`,
                          sound: "Default",
                        });
                        clientUpdate();
                      }
                    }
                  });
              }
            });
        }
        console.log("[Got Upstream] ", remoteId);
      } catch (error) {
        console.error("[Fetch Upstream Commit Id]", error);
      }
    },

    async updateUsage(force = false) {
      // only support openai for now
      const overOneMinute = Date.now() - get().lastUpdateUsage >= ONE_MINUTE;
      if (!overOneMinute && !force) return;

      set(() => ({
        lastUpdateUsage: Date.now(),
      }));

      try {
        const api = new ClientApi(ModelProvider.GPT);
        const usage = await api.llm.usage();

        if (usage) {
          set(() => ({
            used: usage.used,
            subscription: usage.total,
          }));
        }
      } catch (e) {
        console.error((e as Error).message);
      }
    },
  }),
  {
    name: StoreKey.Update,
    version: 1,
  },
);
