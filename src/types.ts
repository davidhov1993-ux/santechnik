export type Locale = "ru" | "hy";

export type StaticPageKey = "privacy";

export type LocalizedText = Record<Locale, string>;

export interface StaticPagePanel {
  title: LocalizedText;
  description: LocalizedText;
}

export interface StaticPageContent {
  title: LocalizedText;
  description: LocalizedText;
  intro: LocalizedText;
  panels: StaticPagePanel[];
}
