import {
  brandName,
  businessPhoneMachine,
  businessWhatsappUrl,
  siteUrl,
  t,
} from "@/src/content/site";
import { absoluteUrl, localePath } from "@/src/lib/locale";
import type { Locale } from "@/src/types";

type Schema = Record<string, unknown>;

interface BreadcrumbItem {
  name: string;
  path?: string;
}

const organizationId = `${siteUrl}#organization`;
const localBusinessId = `${siteUrl}#plumber`;
const webSiteId = `${siteUrl}#website`;

const serviceArea = {
  "@type": "City",
  name: "Yerevan",
  containedInPlace: {
    "@type": "Country",
    name: "Armenia",
  },
};

const yerevanGeo = {
  "@type": "GeoCoordinates",
  latitude: "40.1792",
  longitude: "44.5152",
};

const mainServices = {
  ru: [
    "Срочный вызов сантехника 24/7",
    "Устранение засоров",
    "Устранение протечек",
    "Замена труб",
    "Монтаж водопровода",
    "Монтаж канализации",
    "Установка смесителей",
    "Установка унитазов и раковин",
    "Подключение бойлеров и фильтров",
  ],
  hy: [
    "Սանտեխնիկի շտապ կանչ 24/7",
    "Խցանումների վերացում",
    "Արտահոսքերի վերացում",
    "Խողովակների փոխարինում",
    "Ջրամատակարարման մոնտաժ",
    "Կոյուղու մոնտաժ",
    "Ծորակների տեղադրում",
    "Զուգարանակոնքերի և լվացարանների տեղադրում",
    "Ջրատաքացուցիչների և ֆիլտրերի միացում",
  ],
} satisfies Record<Locale, string[]>;

const offerCatalog = {
  ru: [
    ["Выезд и диагностика", "10000", "AMD"],
    ["Срочный вызов сантехника 24/7", "20000", "AMD"],
    ["Устранение засора", "15000", "AMD"],
    ["Устранение протечки", "10000", "AMD"],
    ["Замена смесителя", "10000", "AMD"],
  ],
  hy: [
    ["Այց և ախտորոշում", "10000", "AMD"],
    ["Սանտեխնիկի շտապ կանչ 24/7", "20000", "AMD"],
    ["Խցանման վերացում", "15000", "AMD"],
    ["Արտահոսքի վերացում", "10000", "AMD"],
    ["Ծորակի փոխարինում", "10000", "AMD"],
  ],
} satisfies Record<Locale, Array<[string, string, string]>>;

function languageCode(locale: Locale) {
  return locale === "ru" ? "ru-AM" : "hy-AM";
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path ? absoluteUrl(item.path) : undefined,
    })),
  };
}

export function createOrganizationSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: brandName.ru,
    alternateName: [brandName.hy, "Santekhnic Yerevan"],
    url: siteUrl,
    telephone: businessPhoneMachine,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: businessPhoneMachine,
        contactType: "customer service",
        areaServed: "AM",
        availableLanguage: ["ru", "hy"],
      },
    ],
    areaServed: serviceArea,
  };
}

export function createLocalBusinessSchema(locale: Locale): Schema {
  const homePath = localePath(locale);

  return {
    "@context": "https://schema.org",
    "@type": "Plumber",
    "@id": localBusinessId,
    name: "Santekhnic Yerevan",
    alternateName: [t(locale, brandName), locale === "ru" ? "Сантехник в Ереване" : "Սանտեխնիկ Երևանում"],
    description:
      locale === "ru"
        ? "Сантехнические услуги в Ереване: срочный вызов 24/7, устранение засоров и протечек, замена труб, установка сантехники, бойлеров и фильтров."
        : "Սանտեխնիկական ծառայություններ Երևանում՝ շտապ կանչ 24/7, խցանումների և արտահոսքերի վերացում, խողովակների փոխարինում, սանտեխնիկայի տեղադրում:",
    url: siteUrl,
    image: absoluteUrl("/icon-512.png"),
    telephone: businessPhoneMachine,
    priceRange: "AMD",
    currenciesAccepted: "AMD",
    paymentAccepted: "Cash, Bank Transfer",
    areaServed: serviceArea,
    address: {
      "@type": "PostalAddress",
      addressLocality: locale === "ru" ? "Ереван" : "Երևան",
      addressCountry: "AM",
    },
    geo: yerevanGeo,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    availableLanguage: ["ru", "hy"],
    knowsLanguage: ["ru", "hy"],
    makesOffer: offerCatalog[locale].map(([name, price, currency]) => ({
      "@type": "Offer",
      name,
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      areaServed: serviceArea,
      url: absoluteUrl(homePath),
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "ru" ? "Услуги сантехника в Ереване" : "Սանտեխնիկի ծառայություններ Երևանում",
      itemListElement: mainServices[locale].map((name) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name,
          areaServed: serviceArea,
          provider: {
            "@id": localBusinessId,
          },
        },
      })),
    },
    potentialAction: [
      {
        "@type": "ContactAction",
        name: locale === "ru" ? "Позвонить сантехнику" : "Զանգահարել սանտեխնիկին",
        target: `tel:${businessPhoneMachine}`,
      },
      {
        "@type": "CommunicateAction",
        name: "WhatsApp",
        target: businessWhatsappUrl,
      },
    ],
  };
}

export function createWebSiteSchema(locale: Locale): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": webSiteId,
    name: t(locale, brandName),
    alternateName: locale === "ru" ? "Сантехник в Ереване" : "Սանտեխնիկ Երևանում",
    url: siteUrl,
    inLanguage: languageCode(locale),
    publisher: {
      "@id": organizationId,
    },
  };
}

export function createHomePageSchema(locale: Locale): Schema {
  const homePath = localePath(locale);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(homePath)}#webpage`,
    url: absoluteUrl(homePath),
    name: locale === "ru" ? "Услуги сантехника в Ереване" : "Սանտեխնիկի ծառայություններ Երևանում",
    description:
      locale === "ru"
        ? "Сантехник в Ереване: срочный вызов 24/7, устранение засоров и протечек, замена труб, установка сантехники."
        : "Սանտեխնիկ Երևանում՝ շտապ կանչ 24/7, խցանումների և արտահոսքերի վերացում, խողովակների փոխարինում, սանտեխնիկայի տեղադրում:",
    inLanguage: languageCode(locale),
    isPartOf: {
      "@id": webSiteId,
    },
    about: {
      "@id": localBusinessId,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon-512.png"),
    },
  };
}
