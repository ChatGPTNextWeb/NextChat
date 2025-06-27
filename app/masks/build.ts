import fs from "fs";
import path from "path";
import { VI_MASKS } from "./vi";
// import { TW_MASKS } from "./tw";
// import { EN_MASKS } from "./en";

import { type BuiltinMask } from "./typing";

const BUILTIN_MASKS: Record<string, BuiltinMask[]> = {
  vi: VI_MASKS,
  // tw: TW_MASKS,
  // en: EN_MASKS,
};

const dirname = path.dirname(__filename);

fs.writeFile(
  dirname + "/../../public/masks.json",
  JSON.stringify(BUILTIN_MASKS, null, 4),
  function (error) {
    if (error) {
      console.error("[Build] failed to build masks", error);
    }
  },
);
