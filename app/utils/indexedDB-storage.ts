import { StateStorage } from "zustand/middleware";
import { get, set, del, clear, keys } from "idb-keyval";
import { safeLocalStorage } from "@/app/utils";
import { getStoragePrefix, isMainWindow } from "@/app/utils/window";

const localStorage = safeLocalStorage();

// Each app window gets its own storage namespace (see #4886) so that every
// window can hold an independent server configuration. The main window keeps
// the historical unprefixed keys, so existing data is preserved.
const storagePrefix = getStoragePrefix();

function prefixed(name: string): string {
  return storagePrefix + name;
}

class IndexedDBStorage implements StateStorage {
  public async getItem(name: string): Promise<string | null> {
    const key = prefixed(name);
    try {
      const value = (await get(key)) || localStorage.getItem(key);
      return value;
    } catch (error) {
      return localStorage.getItem(key);
    }
  }

  public async setItem(name: string, value: string): Promise<void> {
    const key = prefixed(name);
    try {
      const _value = JSON.parse(value);
      if (!_value?.state?._hasHydrated) {
        console.warn("skip setItem", name);
        return;
      }
      await set(key, value);
    } catch (error) {
      localStorage.setItem(key, value);
    }
  }

  public async removeItem(name: string): Promise<void> {
    const key = prefixed(name);
    try {
      await del(key);
    } catch (error) {
      localStorage.removeItem(key);
    }
  }

  public async clear(): Promise<void> {
    try {
      if (isMainWindow()) {
        // The main window owns the global namespace: a full reset also drops
        // the namespaced data of secondary windows.
        await clear();
      } else {
        // Secondary windows only drop their own namespace.
        const allKeys = await keys();
        await Promise.all(
          allKeys
            .filter(
              (key) => typeof key === "string" && key.startsWith(storagePrefix),
            )
            .map((key) => del(key)),
        );
      }
    } catch (error) {
      localStorage.clear();
    }
  }
}

export const indexedDBStorage = new IndexedDBStorage();
