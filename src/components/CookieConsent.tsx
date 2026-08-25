import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  createCookieConsentChoice,
  getSavedCookieConsent,
  initGoogleAnalytics,
  saveCookieConsent,
  trackPageView,
  updateGoogleConsent,
  type CookieConsentChoice,
} from "@/src/lib/analytics";
import { pagePath } from "@/src/lib/locale";
import type { Locale } from "@/src/types";

interface CookieConsentProps {
  locale: Locale;
}

type ConsentDraft = Pick<CookieConsentChoice, "analytics" | "marketing" | "preferences">;

const defaultDraft: ConsentDraft = {
  analytics: false,
  marketing: false,
  preferences: false,
};

const cookieCopy = {
  ru: {
    eyebrow: "Файлы cookie",
    title: "Мы используем файлы cookie",
    body:
      "Вы можете принять все cookie, настроить их или оставить только необходимые. При отказе от необязательных cookie технические данные посещения могут обрабатываться для работы и безопасности сайта.",
    policyLink: "Политика конфиденциальности",
    acceptAll: "Принять все",
    rejectAll: "Только необходимые",
    customize: "Настроить",
    save: "Сохранить",
    close: "Закрыть",
    modalTitle: "Настройки cookie",
    modalText:
      "Выберите, какие cookie можно использовать. Необходимые cookie включены всегда. Cookie-баннер не отключает технические данные запроса: IP-адрес, время, страницу, браузер, устройство и источник перехода.",
    alwaysOn: "Всегда включены",
    enabled: "Да",
    disabled: "Нет",
    categories: {
      necessary: {
        title: "Необходимые",
        text: "Нужны для базовой работы сайта и не отключаются.",
      },
      analytics: {
        title: "Аналитика",
        text: "Помогают понять, какие страницы посещают чаще и как улучшить сайт.",
      },
      marketing: {
        title: "Реклама",
        text: "Нужны для измерения эффективности рекламы, если она подключена.",
      },
      preferences: {
        title: "Персонализация",
        text: "Сохраняют выбранные настройки интерфейса.",
      },
    },
  },
  hy: {
    eyebrow: "Cookie ֆայլեր",
    title: "Cookie ֆայլեր",
    body:
      "Կայքը օգտագործում է cookie ֆայլեր։ Կարող եք ընդունել բոլորը, կարգավորել կամ թողնել միայն պարտադիրները։ Տեխնիկական տվյալները կարող են մշակվել կայքի աշխատանքի և անվտանգության համար:",
    policyLink: "Գաղտնիության քաղաքականություն",
    acceptAll: "Ընդունել բոլորը",
    rejectAll: "Միայն պարտադիր",
    customize: "Կարգավորել",
    save: "Պահպանել",
    close: "Փակել",
    modalTitle: "Cookie կարգավորումներ",
    modalText:
      "Ընտրեք, թե որ cookie ֆայլերը կարող են օգտագործվել։ Պարտադիրները միշտ միացված են։ Cookie բանները չի անջատում հարցման տեխնիկական տվյալները՝ IP հասցե, ժամը, էջը, բրաուզերը, սարքը և անցման աղբյուրը։",
    alwaysOn: "Միշտ միացված է",
    enabled: "Այո",
    disabled: "Ոչ",
    categories: {
      necessary: {
        title: "Պարտադիր",
        text: "Անհրաժեշտ են կայքի հիմնական աշխատանքի համար և չեն անջատվում։",
      },
      analytics: {
        title: "Վերլուծություն",
        text: "Օգնում են հասկանալ, թե որ էջերն են ավելի հաճախ այցելվում և ինչպես բարելավել կայքը։",
      },
      marketing: {
        title: "Գովազդ",
        text: "Անհրաժեշտ են գովազդի արդյունավետությունը չափելու համար, եթե գովազդը միացված է։",
      },
      preferences: {
        title: "Անհատականացում",
        text: "Պահպանում են ինտերֆեյսի ընտրված կարգավորումները։",
      },
    },
  },
} as const;

export function CookieConsent({ locale }: CookieConsentProps) {
  const copy = cookieCopy[locale];
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  const [savedChoice, setSavedChoice] = useState<CookieConsentChoice | null>(null);
  const [panel, setPanel] = useState<"hidden" | "banner" | "settings">("hidden");
  const [draft, setDraft] = useState<ConsentDraft>(defaultDraft);
  const privacyPath = pagePath(locale, "privacy");

  const categories = useMemo(
    () => [
      {
        id: "necessary" as const,
        title: copy.categories.necessary.title,
        text: copy.categories.necessary.text,
        enabled: true,
        locked: true,
      },
      {
        id: "analytics" as const,
        title: copy.categories.analytics.title,
        text: copy.categories.analytics.text,
        enabled: draft.analytics,
        locked: false,
      },
      {
        id: "marketing" as const,
        title: copy.categories.marketing.title,
        text: copy.categories.marketing.text,
        enabled: draft.marketing,
        locked: false,
      },
      {
        id: "preferences" as const,
        title: copy.categories.preferences.title,
        text: copy.categories.preferences.text,
        enabled: draft.preferences,
        locked: false,
      },
    ],
    [copy, draft],
  );

  useEffect(() => {
    const storedChoice = getSavedCookieConsent();
    initGoogleAnalytics(storedChoice);
    setSavedChoice(storedChoice);
    setDraft(storedChoice ? toDraft(storedChoice) : defaultDraft);
    setPanel(storedChoice ? "hidden" : "banner");
    setIsReady(true);
  }, []);

  useEffect(() => {
    const openSettings = () => setPanel("settings");

    window.addEventListener("santekhnic:open-cookie-settings", openSettings);
    return () => window.removeEventListener("santekhnic:open-cookie-settings", openSettings);
  }, []);

  useEffect(() => {
    if (!isReady) return undefined;

    const pagePath = `${location.pathname}${location.search}`;
    const timeout = window.setTimeout(() => trackPageView(pagePath), 0);
    return () => window.clearTimeout(timeout);
  }, [isReady, location.pathname, location.search]);

  const applyChoice = (choiceDraft: ConsentDraft) => {
    const nextChoice = createCookieConsentChoice(choiceDraft);
    saveCookieConsent(nextChoice);
    updateGoogleConsent(nextChoice);
    setSavedChoice(nextChoice);
    setDraft(toDraft(nextChoice));
    setPanel("hidden");

    if (nextChoice.analytics || nextChoice.marketing) {
      window.setTimeout(() => trackPageView(`${location.pathname}${location.search}`), 0);
    }
  };

  const toggleDraft = (key: keyof ConsentDraft) => {
    setDraft((current) => ({ ...current, [key]: !current[key] }));
  };

  if (!isReady) return null;

  return (
    <>
      {panel === "banner" ? (
        <section className={`cookie-consent cookie-consent--${locale}`} aria-label={copy.title}>
          <div className="cookie-consent__copy">
            <h2>{copy.title}</h2>
            <p>
              {copy.body} <Link to={privacyPath}>{copy.policyLink}</Link>
            </p>
          </div>
          <div className="cookie-consent__actions">
            <button className="cookie-consent__button cookie-consent__button--primary" type="button" onClick={() => applyChoice({ analytics: true, marketing: true, preferences: true })}>
              {copy.acceptAll}
            </button>
            <button className="cookie-consent__button" type="button" onClick={() => setPanel("settings")}>
              {copy.customize}
            </button>
            <button className="cookie-consent__link-button" type="button" onClick={() => applyChoice(defaultDraft)}>
              {copy.rejectAll}
            </button>
          </div>
        </section>
      ) : null}

      {panel === "settings" ? (
        <div className="cookie-consent__overlay" role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title">
          <section className={`cookie-consent__panel cookie-consent__panel--${locale}`}>
            <div className="cookie-consent__panel-head">
              <div>
                <span className="cookie-consent__eyebrow">{copy.eyebrow}</span>
                <h2 id="cookie-consent-title">{copy.modalTitle}</h2>
              </div>
              {savedChoice ? (
                <button className="cookie-consent__close" type="button" aria-label={copy.close} onClick={() => setPanel("hidden")}>
                  ×
                </button>
              ) : null}
            </div>
            <p className="cookie-consent__panel-text">
              {copy.modalText} <Link to={privacyPath}>{copy.policyLink}</Link>
            </p>
            <div className="cookie-consent__category-list">
              {categories.map((category) => (
                <div className="cookie-consent__category" key={category.id}>
                  <div className="cookie-consent__category-copy">
                    <h3>{category.title}</h3>
                    <p>{category.text}</p>
                  </div>
                  {category.id === "necessary" ? (
                    <span className="cookie-consent__locked">{copy.alwaysOn}</span>
                  ) : (
                    <button
                      className={`cookie-consent__switch ${category.enabled ? "is-on" : ""}`}
                      type="button"
                      role="switch"
                      aria-checked={category.enabled}
                      onClick={() => toggleDraft(category.id)}
                    >
                      <span>{category.enabled ? copy.enabled : copy.disabled}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="cookie-consent__panel-actions">
              <button className="cookie-consent__button cookie-consent__button--primary" type="button" onClick={() => applyChoice(draft)}>
                {copy.save}
              </button>
              <button className="cookie-consent__button" type="button" onClick={() => applyChoice({ analytics: true, marketing: true, preferences: true })}>
                {copy.acceptAll}
              </button>
              <button className="cookie-consent__link-button" type="button" onClick={() => applyChoice(defaultDraft)}>
                {copy.rejectAll}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function toDraft(choice: CookieConsentChoice): ConsentDraft {
  return {
    analytics: choice.analytics,
    marketing: choice.marketing,
    preferences: choice.preferences,
  };
}
