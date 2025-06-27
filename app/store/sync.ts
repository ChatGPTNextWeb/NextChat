// Import các hàm và hằng số cần thiết từ các module khác
import { getClientConfig } from "../config/client";
import {
  ApiPath,
  STORAGE_KEY,
  StoreKey,
  UPSTASH_APIKEY,
  UPSTASH_ENDPOINT,
} from "../constant";
import { createPersistStore } from "../utils/store";
import {
  AppState,
  getLocalAppState,
  GetStoreState,
  mergeAppState,
  setLocalAppState,
} from "../utils/sync";
import { downloadAs, readFromFile } from "../utils";
import { showToast } from "../components/ui-lib";
import Locale from "../locales";
import { createSyncClient, ProviderType } from "../utils/cloud";

// Định nghĩa interface cho cấu hình WebDav
export interface WebDavConfig {
  server: string;
  username: string;
  password: string;
}

// Kiểm tra xem ứng dụng đang chạy ở chế độ app hay không
const isApp = !!getClientConfig()?.isApp;

// Định nghĩa kiểu dữ liệu cho SyncStore dựa trên useSyncStore
export type SyncStore = GetStoreState<typeof useSyncStore>;

// Trạng thái mặc định cho việc đồng bộ
const DEFAULT_SYNC_STATE = {
  provider: ProviderType.UpStash as ProviderType, // Nhà cung cấp mặc định là UpStash
  useProxy: true, // Sử dụng proxy mặc định
  proxyUrl: ApiPath.Cors as string, // Đường dẫn proxy mặc định

  // Cấu hình WebDav mặc định
  webdav: {
    endpoint: "",
    username: "",
    password: "",
  },

  // Cấu hình Upstash, username sẽ lấy từ STORAGE_KEY
  upstash: {
    endpoint: UPSTASH_ENDPOINT,
    username: STORAGE_KEY,
    apiKey: UPSTASH_APIKEY,
  },

  lastSyncTime: 0, // Thời gian đồng bộ lần cuối
  lastProvider: "", // Nhà cung cấp đồng bộ lần cuối
};

// Tạo store đồng bộ với các hàm thao tác
export const useSyncStore = createPersistStore(
  DEFAULT_SYNC_STATE,
  (set, get) => ({
    // Kiểm tra xem đã cấu hình đầy đủ để đồng bộ cloud chưa
    cloudSync() {
      const config = get()[get().provider];
      return Object.values(config).every((c) => c.toString().length > 0);
    },

    // Đánh dấu thời gian đồng bộ gần nhất
    markSyncTime() {
      set({ lastSyncTime: Date.now(), lastProvider: get().provider });
    },

    // Xuất dữ liệu ứng dụng ra file JSON
    export() {
      const state = getLocalAppState();
      const datePart = isApp
        ? `${new Date().toLocaleDateString().replace(/\//g, "_")} ${new Date()
            .toLocaleTimeString()
            .replace(/:/g, "_")}`
        : new Date().toLocaleString();

      const fileName = `Backup-${datePart}.json`;
      downloadAs(JSON.stringify(state), fileName);
    },

    // Nhập dữ liệu ứng dụng từ file JSON
    async import() {
      const rawContent = await readFromFile();

      try {
        const remoteState = JSON.parse(rawContent) as AppState;
        const localState = getLocalAppState();
        mergeAppState(localState, remoteState);
        setLocalAppState(localState);
        location.reload();
      } catch (e) {
        console.error("[Import]", e);
        showToast(Locale.Settings.Sync.ImportFailed);
      }
    },

    // Lấy client đồng bộ dựa vào provider hiện tại
    getClient() {
      const provider = get().provider;
      const client = createSyncClient(provider, get());
      return client;
    },

    // Hàm đồng bộ dữ liệu giữa local và cloud
    async sync() {
      const localState = getLocalAppState();
      const provider = get().provider;
      const config = get()[provider];
      const client = this.getClient();

      try {
        const remoteState = await client.get(config.username);
        if (!remoteState || remoteState === "") {
          // Nếu cloud chưa có dữ liệu thì đẩy dữ liệu local lên cloud
          await client.set(config.username, JSON.stringify(localState));
          console.log(
            "[Sync] Remote state is empty, using local state instead.",
          );
          return;
        } else {
          // Nếu cloud đã có dữ liệu thì merge với local
          const parsedRemoteState = JSON.parse(
            await client.get(config.username),
          ) as AppState;
          mergeAppState(localState, parsedRemoteState);
          setLocalAppState(localState);

          console.log("[Sync] Merged remote state with local state");
          console.log("Dong bo thanh cong", provider, config.username);
        }
      } catch (e) {
        console.log("[Sync] failed to get remote state", e);
        throw e;
      }

      // Đẩy dữ liệu đã merge lên cloud
      await client.set(config.username, JSON.stringify(localState));

      this.markSyncTime();
    },

    // Kiểm tra trạng thái kết nối cloud
    async check() {
      const client = this.getClient();
      return await client.check();
    },
  }),
  {
    name: StoreKey.Sync, // Tên store trong localStorage
    version: 1.2, // Phiên bản store

    // Hàm migrate để chuyển đổi dữ liệu khi nâng cấp version
    migrate(persistedState, version) {
      const newState = persistedState as typeof DEFAULT_SYNC_STATE;

      if (version < 1.1) {
        newState.upstash.username = STORAGE_KEY;
      }

      if (version < 1.2) {
        if (
          (persistedState as typeof DEFAULT_SYNC_STATE).proxyUrl ===
          "/api/cors/"
        ) {
          newState.proxyUrl = "";
        }
      }

      return newState as any;
    },
  },
);
