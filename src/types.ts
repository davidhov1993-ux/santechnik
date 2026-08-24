export type Locale = "ru" | "hy";

export type ServiceGroup = "water" | "sewer" | "fixtures" | "appliances" | "emergency";

export type AccentTone = "blue" | "amber" | "steel";

export type ServiceSlug =
  | "srochnyi-vyzov-santekhnika"
  | "ustranenie-zasorov"
  | "ustranenie-protechek"
  | "montazh-vodoprovoda"
  | "montazh-kanalizatsii"
  | "ustanovka-santekhniki"
  | "boilery-i-filtry"
  | "podklyuchenie-tekhniki";

export type StaticPageKey = "privacy";

export type LocalizedText = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export interface LocalizedFaqItem {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface ServiceEntry {
  slug: ServiceSlug;
  group: ServiceGroup;
  accent: AccentTone;
  shortLabel: LocalizedText;
  title: LocalizedText;
  tagline: LocalizedText;
  summary: LocalizedText;
  bullets: LocalizedList;
  problems: LocalizedList;
  included: LocalizedList;
  objects: LocalizedList;
  faq: LocalizedFaqItem[];
}

export interface GenericPanel {
  title: LocalizedText;
  description: LocalizedText;
}

export interface StaticPageContent {
  title: LocalizedText;
  description: LocalizedText;
  intro: LocalizedText;
  panels: GenericPanel[];
}
