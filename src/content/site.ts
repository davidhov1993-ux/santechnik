import type {
  GenericPanel,
  Locale,
  LocalizedText,
  ServiceEntry,
  ServiceGroup,
  ServiceSlug,
  StaticPageContent,
  StaticPageKey,
} from "@/src/types";

export const supportedLocales: Locale[] = ["hy", "ru"];

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

export const uiCopy = {
  discussProject: { ru: "Обсудить задачу", hy: "Քննարկել առաջադրանքը" },
  emergencyHelp: { ru: "Аварийный выезд", hy: "Արտակարգ այց" },
  getConsultation: { ru: "Получить консультацию", hy: "Ստանալ խորհրդատվություն" },
  viewAllServices: { ru: "Все услуги", hy: "Բոլոր ծառայությունները" },
  worksFor: { ru: "Подходит для", hy: "Հարմար է" },
  whatIncluded: { ru: "Что входит", hy: "Ինչ է ներառված" },
  whenNeeded: { ru: "Когда это нужно", hy: "Երբ է պետք" },
  relatedServices: { ru: "Связанные услуги", hy: "Կապված ծառայություններ" },
  leaveRequest: { ru: "Оставить заявку", hy: "Թողնել հայտ" },
  urgentRequest: { ru: "Срочная заявка", hy: "Շտապ հայտ" },
  send: { ru: "Отправить", hy: "Ուղարկել" },
  name: { ru: "Имя", hy: "Անուն" },
  phone: { ru: "Телефон", hy: "Հեռախոս" },
  objectType: { ru: "Тип объекта", hy: "Օբյեկտի տեսակ" },
  service: { ru: "Услуга", hy: "Ծառայություն" },
  task: { ru: "Опишите задачу", hy: "Նկարագրեք խնդիրը" },
  urgency: { ru: "Срочность", hy: "Շտապություն" },
  normal: { ru: "Плановая", hy: "Պլանային" },
  urgent: { ru: "Срочная", hy: "Շտապ" },
  requestCallback: { ru: "Перезвоните мне", hy: "Զանգահարեք ինձ" },
  switchLanguage: { ru: "Сменить язык", hy: "Փոխել լեզուն" },
  formHint: {
    ru: "Заполните форму — перезвоним и уточним детали.",
    hy: "Լրացրեք ձևը՝ կզանգահարենք և կճշտենք մանրամասները։",
  },
  formSuccess: {
    ru: "Спасибо, заявка принята. Свяжемся с вами в ближайшее время.",
    hy: "Շնորհակալություն, հայտն ընդունված է։ Շուտով կկապվենք Ձեզ հետ։",
  },
  fixErrors: {
    ru: "Проверьте обязательные поля.",
    hy: "Ստուգեք պարտադիր դաշտերը։",
  },
  invalidName: {
    ru: "Укажите имя.",
    hy: "Նշեք անունը։",
  },
  invalidPhone: {
    ru: "Укажите телефон.",
    hy: "Նշեք հեռախոսահամարը։",
  },
  invalidObjectType: {
    ru: "Выберите тип объекта.",
    hy: "Ընտրեք օբյեկտի տեսակը։",
  },
  invalidService: {
    ru: "Выберите услугу.",
    hy: "Ընտրեք ծառայությունը։",
  },
  invalidTask: {
    ru: "Опишите задачу.",
    hy: "Նկարագրեք խնդիրը։",
  },
};

export const serviceGroups = [
  {
    id: "water",
    title: { ru: "Водопровод", hy: "Ջրամատակարարում" },
    description: {
      ru: "Разводка воды, замена труб и подключение точек.",
      hy: "Ջրի անցկացում, խողովակների փոխարինում և կետերի միացում։",
    },
  },
  {
    id: "sewer",
    title: { ru: "Канализация", hy: "Կոյուղի" },
    description: {
      ru: "Канализационные трубы, сливы и устранение засоров.",
      hy: "Կոյուղու խողովակներ, ջրահեռացում և խցանումների վերացում։",
    },
  },
  {
    id: "fixtures",
    title: { ru: "Сантехника", hy: "Սանտեխնիկա" },
    description: {
      ru: "Смесители, раковины, унитазы, душевые и бойлеры.",
      hy: "Ծորակներ, լվացարաններ, զուգարանակոնքեր, ցնցուղներ և ջրատաքացուցիչներ։",
    },
  },
  {
    id: "appliances",
    title: { ru: "Техника", hy: "Տեխնիկա" },
    description: {
      ru: "Подключение стиральных и посудомоечных машин.",
      hy: "Լվացքի և աման լվացող մեքենաների միացում։",
    },
  },
  {
    id: "emergency",
    title: { ru: "Срочный выезд", hy: "Շտապ այց" },
    description: {
      ru: "Срочная диагностика протечек, засоров и аварий по Еревану.",
      hy: "Արտահոսքերի, խցանումների և վթարների շտապ ախտորոշում Երևանում։",
    },
  },
] as const satisfies ReadonlyArray<{
  id: ServiceGroup;
  title: LocalizedText;
  description: LocalizedText;
}>;

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

export const services: ServiceEntry[] = [];

export const servicePublicSlugs: Partial<Record<ServiceSlug, LocalizedText>> = {};

const serviceSlugAliases: Record<string, ServiceSlug> = Object.entries(servicePublicSlugs).reduce(
  (aliases, [serviceSlug, localizedSlugs]) => {
    aliases[serviceSlug] = serviceSlug as ServiceSlug;
    Object.values(localizedSlugs).forEach((localizedSlug) => {
      aliases[localizedSlug] = serviceSlug as ServiceSlug;
    });
    return aliases;
  },
  {} as Record<string, ServiceSlug>,
);

export function t(locale: Locale, value: LocalizedText) {
  return value[locale];
}

export function isServiceSlug(value?: string): value is ServiceSlug {
  return services.some((service) => service.slug === value);
}

export function getService(slug?: string) {
  const resolvedSlug = slug ? serviceSlugAliases[slug] ?? slug : undefined;
  return services.find((service) => service.slug === resolvedSlug);
}

export function getPublicServiceSlug(locale: Locale, slug: string) {
  return servicePublicSlugs[slug as ServiceSlug]?.[locale] ?? slug;
}

export function getServicesByGroup(group: ServiceGroup) {
  return services.filter((service) => service.group === group);
}

export function getRelatedServices(slug: ServiceSlug, group: ServiceGroup, limit = 3) {
  const sameGroup = services.filter((service) => service.group === group && service.slug !== slug);
  const fallback = services.filter((service) => service.slug !== slug && service.group !== group);
  return [...sameGroup, ...fallback].slice(0, limit);
}

// kept to satisfy GenericPanel re-exports for any consumers (none currently expected)
export type { GenericPanel };
