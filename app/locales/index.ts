import cn from "./cn";
import en from "./en";
import vi from "./vi";
import { merge } from "../utils/merge";
import { safeLocalStorage } from "@/app/utils";

import type { LocaleType } from "./cn";
export type { LocaleType, PartialLocaleType } from "./cn";

const localStorage = safeLocalStorage();

const ALL_LANGS = {
  cn,
  en,
  vi,
};

export type Lang = keyof typeof ALL_LANGS;

export const AllLangs = Object.keys(ALL_LANGS) as Lang[];

export const ALL_LANG_OPTIONS: Record<Lang, string> = {
  vi: "Tiếng Việt",
  en: "English",
  cn: "简体中文",
};

const LANG_KEY = "lang";
const DEFAULT_LANG = "vi";

const fallbackLang = en;
const targetLang = ALL_LANGS[getLang()] as LocaleType;

// console.log("Current language:", targetLang);

// if target lang missing some fields, it will use fallback lang string
merge(fallbackLang, targetLang);

export default fallbackLang as LocaleType;

function getItem(key: string) {
  return localStorage.getItem(key);
}

function setItem(key: string, value: string) {
  localStorage.setItem(key, value);
}

function getLanguage() {
  try {
    const locale = new Intl.Locale(navigator.language).maximize();
    let region = locale?.region?.toLowerCase();

    region = "vn"; // Force to use Vietnam region for now

    // console.log("Detected locale:", locale.language, region);

    // 1. check region code in ALL_LANGS
    if (AllLangs.includes(region as Lang)) {
      return region as Lang;
    }
    // 2. check language code in ALL_LANGS
    if (AllLangs.includes(locale.language as Lang)) {
      return locale.language as Lang;
    }
    return DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function getLang(): Lang {
  const savedLang = getItem(LANG_KEY);

  if (AllLangs.includes((savedLang ?? "") as Lang)) {
    return savedLang as Lang;
  }

  // const lang = getLanguage();
  const lang = "vi"; // Force to use Vietnamese for now

  // console.log("Detected language:", lang);

  return lang;
}

export function changeLang(lang: Lang) {
  setItem(LANG_KEY, lang);
  location.reload();
}

export function getISOLang() {
  const isoLangString: Record<string, string> = {
    cn: "zh-Hans",
    tw: "zh-Hant",
  };

  const lang = getLang();
  return isoLangString[lang] ?? lang;
}

const DEFAULT_STT_LANG = "vi-VN";
export const STT_LANG_MAP: Record<Lang, string> = {
  cn: "zh-CN",
  en: "en-US",

  vi: "vi-VN",
};

export function getSTTLang(): string {
  try {
    return STT_LANG_MAP[getLang()];
  } catch {
    return DEFAULT_STT_LANG;
  }
}
