import type {
  Locale,
  LocalizedText,
  StaticPageContent,
  StaticPageKey,
} from "@/src/types";

export const supportedLocales: Locale[] = ["ru", "hy"];

export const fallbackSiteUrl = "https://santekhnic-yerevan.am";
const configuredSiteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
export const siteUrl = configuredSiteUrl ? configuredSiteUrl.replace(/\/$/, "") : fallbackSiteUrl;

export const businessPhoneDisplay = "+374 99 586 469";
export const businessPhoneMachine = "+37499586469";
export const businessWhatsappUrl = "https://wa.me/37499586469";

export const defaultLocale: Locale = "ru";

export const brandName: LocalizedText = {
  ru: "Сантехник",
  hy: "Սանտեխնիկ",
};

export const localeNames: Record<Locale, string> = {
  ru: "РУССКИЙ",
  hy: "ՀԱՅԵՐԵՆ",
};

export const commonSlugs = {
  privacy: "politika-konfidentsialnosti",
} as const;

export const staticPages: Record<StaticPageKey, StaticPageContent> = {
  privacy: {
    title: {
      ru: "Политика конфиденциальности и использования файлов cookie",
      hy: "Գաղտնիության քաղաքականություն և Cookie ֆայլերի օգտագործման կանոններ",
    },
    description: {
      ru: "Как сайт Сантехник собирает, обрабатывает и защищает личные данные и использует cookies.",
      hy: "Ինչպես է Սանտեխնիկ կայքը հավաքում, մշակում և պաշտպանում անձնական տվյալները և օգտագործում cookie ֆայլերը։",
    },
    intro: {
      ru: "Политика действует с 17 мая 2026 года и описывает обработку данных на сайте услуг сантехника в Армении.",
      hy: "Քաղաքականությունն ուժի մեջ է 2026 թվականի մայիսի 17-ից և նկարագրում է տվյալների մշակումը սանտեխնիկի ծառայությունների կայքում։",
    },
    panels: [
      {
        title: { ru: "Личные данные", hy: "Անձնական տվյալներ" },
        description: {
          ru: "Имя, телефон, адрес при необходимости, сообщение заявки и технические данные.",
          hy: "Անուն, հեռախոսահամար, անհրաժեշտության դեպքում հասցե, հայտի հաղորդագրություն և տեխնիկական տվյալներ։",
        },
      },
      {
        title: { ru: "Заявки", hy: "Հայտեր" },
        description: {
          ru: "Данные заявки используются для связи с вами, уточнения задачи и подготовки мастера к выезду.",
          hy: "Հայտի տվյալներն օգտագործվում են Ձեզ հետ կապվելու, խնդիրը ճշտելու և վարպետի այցը պատրաստելու համար։",
        },
      },
      {
        title: { ru: "Cookies", hy: "Cookie ֆայլեր" },
        description: {
          ru: "Необходимые cookies и аналитика Google Analytics только согласно выбранному согласию.",
          hy: "Պարտադիր cookie ֆայլեր և Google Analytics վերլուծություն՝ միայն Ձեր ընտրած համաձայնության համաձայն։",
        },
      },
      {
        title: { ru: "Права пользователя", hy: "Օգտատիրոջ իրավունքներ" },
        description: {
          ru: "Можно запросить данные, исправление, отзыв согласия и удаление данных.",
          hy: "Կարող եք պահանջել տվյալներ, ուղղում, համաձայնության հետկանչում և տվյալների ջնջում։",
        },
      },
    ],
  },
};

export function t(locale: Locale, value: LocalizedText) {
  return value[locale];
}
