import type { LocalizedText, ServiceSlug } from "@/src/types";

export interface ServiceMediaEntry {
  image: string;
  alt: LocalizedText;
  badge: LocalizedText;
  signal: LocalizedText;
}

export const sceneAssetLibrary = {
  fallback: "/icon-512.png",
} as const;

export const serviceMedia: Partial<Record<ServiceSlug, ServiceMediaEntry>> = {};

export function getServiceMedia(slug?: string): ServiceMediaEntry {
  return serviceMedia[slug as ServiceSlug] ?? {
    image: sceneAssetLibrary.fallback,
    alt: {
      ru: "Сантехнические услуги в Ереване",
      hy: "Սանտեխնիկական ծառայություններ Երևանում",
    },
    badge: { ru: "Сантехник", hy: "Սանտեխնիկ" },
    signal: { ru: "Вода / канализация / ремонт", hy: "Ջուր / կոյուղի / վերանորոգում" },
  };
}
