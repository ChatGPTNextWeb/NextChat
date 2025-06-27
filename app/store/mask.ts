import { BUILTIN_MASKS } from "../masks";
import { getLang, Lang } from "../locales";
import { DEFAULT_TOPIC, ChatMessage } from "./chat";
import { ModelConfig, useAppConfig } from "./config";
import { StoreKey } from "../constant";
import { nanoid } from "nanoid";
import { createPersistStore } from "../utils/store";

export type Mask = {
  id: string;
  createdAt: number;
  avatar: string;
  name: string;
  hideContext?: boolean;
  context: ChatMessage[];
  syncGlobalConfig?: boolean;
  modelConfig: ModelConfig;
  lang: Lang;
  builtin: boolean;
  plugin?: string[];
  enableArtifacts?: boolean;
  enableCodeFold?: boolean;
};

export const DEFAULT_MASK_STATE = {
  masks: {} as Record<string, Mask>,
  language: undefined as Lang | undefined,
};

export type MaskState = typeof DEFAULT_MASK_STATE & {
  language?: Lang | undefined;
};

export const DEFAULT_MASK_AVATAR = "gpt-bot";
export const createEmptyMask = () =>
  ({
    id: nanoid(),
    avatar: DEFAULT_MASK_AVATAR,
    name: DEFAULT_TOPIC,
    context: [],
    syncGlobalConfig: true, // use global config as default
    modelConfig: { ...useAppConfig.getState().modelConfig },
    lang: getLang(),
    builtin: false,
    createdAt: Date.now(),
    plugin: [],
  }) as Mask;

export const useMaskStore = createPersistStore(
  { ...DEFAULT_MASK_STATE },

  (set, get) => ({
    create(mask?: Partial<Mask>) {
      const masks = get().masks;
      const id = nanoid();
      masks[id] = {
        ...createEmptyMask(),
        ...mask,
        id,
        builtin: false,
      };

      set(() => ({ masks }));
      get().markUpdate();

      return masks[id];
    },
    // Hàm cập nhật một mask dựa trên id và một hàm updater
    updateMask(id: string, updater: (mask: Mask) => void) {
      const masks = get().masks; // Lấy danh sách các mask hiện tại
      const mask = masks[id]; // Lấy mask theo id
      if (!mask) return; // Nếu không tìm thấy thì thoát
      const updateMask = { ...mask }; // Tạo bản sao mask để cập nhật
      updater(updateMask); // Gọi hàm updater để chỉnh sửa mask
      masks[id] = updateMask; // Gán lại mask đã cập nhật vào danh sách
      set(() => ({ masks })); // Cập nhật lại state
      get().markUpdate(); // Đánh dấu đã cập nhật
    },
    // Hàm xóa một mask theo id
    delete(id: string) {
      const masks = get().masks; // Lấy danh sách các mask hiện tại
      delete masks[id]; // Xóa mask theo id
      set(() => ({ masks })); // Cập nhật lại state
      get().markUpdate(); // Đánh dấu đã cập nhật
    },

    // Hàm lấy một mask theo id (nếu không truyền id sẽ lấy id mặc định)
    get(id?: string) {
      return get().masks[id ?? 1145141919810];
    },

    // Hàm lấy tất cả các mask (bao gồm cả mask người dùng và mask mặc định)
    getAll() {
      // Lấy danh sách mask của người dùng, sắp xếp theo thời gian tạo mới nhất
      const userMasks = Object.values(get().masks).sort(
        (a, b) => b.createdAt - a.createdAt,
      );
      const config = useAppConfig.getState(); // Lấy config hiện tại

      // console.log(config)

      if (config.hideBuiltinMasks) return userMasks; // Nếu ẩn mask mặc định thì chỉ trả về mask người dùng

      console.log("[Build] builtin masks: ", BUILTIN_MASKS);

      // Tạo danh sách mask mặc định (BUILTIN_MASKS) với cấu hình model hiện tại
      const buildinMasks = BUILTIN_MASKS.map(
        (m) =>
          ({
            ...m,
            modelConfig: {
              ...config.modelConfig,
              ...m.modelConfig,
            },
          }) as Mask,
      );

      // Trả về danh sách mask người dùng + mask mặc định
      return userMasks.concat(buildinMasks);
    },
    search(text: string) {
      return Object.values(get().masks);
    },
    setLanguage(language: Lang | undefined) {
      set({
        language,
      });
    },
  }),
  {
    name: StoreKey.Mask,
    version: 3.1,

    migrate(state, version) {
      const newState = JSON.parse(JSON.stringify(state)) as MaskState;

      // migrate mask id to nanoid
      if (version < 3) {
        Object.values(newState.masks).forEach((m) => (m.id = nanoid()));
      }

      if (version < 3.1) {
        const updatedMasks: Record<string, Mask> = {};
        Object.values(newState.masks).forEach((m) => {
          updatedMasks[m.id] = m;
        });
        newState.masks = updatedMasks;
      }

      return newState as any;
    },
  },
);
