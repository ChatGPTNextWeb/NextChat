import { create } from "zustand"; // Thư viện quản lý state cho React
import { combine, persist, createJSONStorage } from "zustand/middleware"; // Các middleware hỗ trợ zustand
import { Updater } from "../typing"; // Kiểu Updater tự định nghĩa
import { deepClone } from "./clone"; // Hàm deepClone để sao chép sâu object
import { indexedDBStorage } from "@/app/utils/indexedDB-storage"; // Lưu trữ dữ liệu bằng IndexedDB

// Lấy kiểu tham số thứ hai của một hàm
type SecondParam<T> = T extends (
  _f: infer _F,
  _s: infer S,
  ...args: infer _U
) => any
  ? S
  : never;

// Định nghĩa các thuộc tính và phương thức bổ sung cho store
type MakeUpdater<T> = {
  lastUpdateTime: number; // Thời gian cập nhật cuối cùng
  _hasHydrated: boolean; // Đánh dấu đã hydrate (khôi phục dữ liệu từ storage)

  markUpdate: () => void; // Đánh dấu cập nhật (cập nhật lastUpdateTime)
  update: Updater<T>; // Hàm cập nhật state bằng một updater
  setHasHydrated: (state: boolean) => void; // Đặt trạng thái hydrate
};

// Kiểu hàm set state cho store
type SetStoreState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean | undefined,
) => void;

// Hàm tạo store có persist (lưu trữ lâu dài) với các phương thức bổ sung
export function createPersistStore<T extends object, M>(
  state: T, // State mặc định ban đầu
  methods: (
    set: SetStoreState<T & MakeUpdater<T>>,
    get: () => T & MakeUpdater<T>,
  ) => M, // Các phương thức thao tác với store
  persistOptions: SecondParam<typeof persist<T & M & MakeUpdater<T>>>, // Tùy chọn lưu trữ
) {
  // Thiết lập storage sử dụng IndexedDB
  persistOptions.storage = createJSONStorage(() => indexedDBStorage);

  // Lưu lại hàm onRehydrateStorage cũ (nếu có)
  const oldOonRehydrateStorage = persistOptions?.onRehydrateStorage;

  // Gán lại hàm onRehydrateStorage để đánh dấu đã hydrate khi khôi phục dữ liệu
  persistOptions.onRehydrateStorage = (state) => {
    oldOonRehydrateStorage?.(state);
    return () => state.setHasHydrated(true);
  };

  // Tạo store với zustand, kết hợp các middleware và phương thức bổ sung
  return create(
    persist(
      combine(
        {
          ...state,
          lastUpdateTime: 0, // Khởi tạo thời gian cập nhật cuối là 0
          _hasHydrated: false, // Chưa hydrate
        },
        (set, get) => {
          return {
            ...methods(set, get as any), // Thêm các phương thức custom

            // Đánh dấu cập nhật (cập nhật lastUpdateTime)
            markUpdate() {
              set({ lastUpdateTime: Date.now() } as Partial<
                T & M & MakeUpdater<T>
              >);
            },
            // Hàm cập nhật state bằng một updater, đồng thời cập nhật lastUpdateTime
            update(updater) {
              const state = deepClone(get());
              updater(state);
              set({
                ...state,
                lastUpdateTime: Date.now(),
              });
            },
            // Đặt trạng thái hydrate
            setHasHydrated: (state: boolean) => {
              set({ _hasHydrated: state } as Partial<T & M & MakeUpdater<T>>);
            },
          } as M & MakeUpdater<T>;
        },
      ),
      persistOptions as any,
    ),
  );
}
