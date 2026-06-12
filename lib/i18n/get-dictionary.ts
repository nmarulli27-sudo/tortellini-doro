import type { Locale } from "./config";
import type it from "./it.json";

export type Dictionary = typeof it;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  it: () => import("./it.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default as Dictionary),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
