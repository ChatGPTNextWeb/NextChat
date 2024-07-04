import { Mask } from "../store/mask";
import { CN_MASKS } from "./cn";
import { TW_MASKS } from "./tw";
import { EN_MASKS } from "./en";

import { type BuiltinMask } from "./typing";
export { type BuiltinMask } from "./typing";

export const BUILTIN_MASK_ID = 100000;

export const BUILTIN_MASK_STORE = {
  buildinId: BUILTIN_MASK_ID,
  masks: {} as Record<string, BuiltinMask>,
  get(id?: string) {
    if (!id) return undefined;
    return this.masks[id] as Mask | undefined;
  },
  add(m: BuiltinMask) {
    const mask = { ...m, id: this.buildinId++, builtin: true };
    this.masks[mask.id] = mask;
    return mask;
  },
};

export const BUILTIN_MASKS: BuiltinMask[] = [];

if (typeof window != "undefined") {
  // run in browser skip in next server
  fetch("/masks.json")
    .then((res) => res.json())
    .catch((error) => {
      console.error("[Fetch] failed to fetch masks", error);
      return { cn: [], tw: [], en: [] };
    })
    .then((masks) => {
      const { cn = [], tw = [], en = [] } = masks;
      return [...cn, ...tw, ...en].map((m) => {
        BUILTIN_MASKS.push(BUILTIN_MASK_STORE.add(m));
      });
    });
}
