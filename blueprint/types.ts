export type Locale = "ru" | "hy";

export type ServiceSlug =
  | "elektromontazh"
  | "220v"
  | "380v"
  | "elektroshchity-i-avtomatika"
  | "osveshchenie"
  | "slabotochnye-sistemy"
  | "videonablyudenie"
  | "elektrozamki-i-kontrol-dostupa"
  | "umnyi-dom-i-umnaya-tekhnika"
  | "teplyi-pol"
  | "avariinyi-elektrik"
  | "slozhnye-proekty-pod-klyuch";

export type ServiceGroup =
  | "power"
  | "automation"
  | "security"
  | "comfort"
  | "emergency";

export interface SceneNode {
  id: string;
  label: string;
  shortLabel: string;
  axis: "left" | "right" | "top" | "bottom";
  priority: number;
  accent: "blue" | "amber" | "white";
}

export interface SeoCluster {
  primary: string[];
  secondary: string[];
  problem: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CTAConfig {
  primary: string;
  secondary?: string;
}

export interface ServiceEntry {
  slug: ServiceSlug;
  group: ServiceGroup;
  title: string;
  shortTitle: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  serviceSummary: string;
  serviceBullets: string[];
  problemCases: string[];
  objectTypes: string[];
  includedWorks: string[];
  faq: FaqItem[];
  cta: CTAConfig;
  sceneNode: SceneNode;
  seoCluster: SeoCluster;
}

export interface SitePage {
  slug: string;
  title: string;
  navLabel: string;
}

export interface CompanyProfile {
  brandName: string;
  city: string;
  serviceArea: string;
  experienceYears: number;
  emergencyArrivalWindow: string;
  workingHours: string;
  dayOff: string;
  brandIdea: string;
}
