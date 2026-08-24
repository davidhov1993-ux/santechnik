import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  createCookieConsentChoice,
  getGoogleConsentMode,
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
    eyebrow: "Consent Mode v2",
    title: "Настройки cookies",
    body:
      "Мы используем файлы cookie для корректной работы сайта и улучшения сервиса. Google Analytics включается только по вашему выбору.",
    policyLink: "Политика конфиденциальности",
    modeLabel: "Режим",
    advancedMode: "advanced",
    basicMode: "basic",
    acceptAll: "Принять все",
    rejectAll: "Только необходимые",
    customize: "Настроить",
    save: "Сохранить выбор",
    close: "Закрыть",
    modalTitle: "Центр управления cookies",
    modalText:
      "Вы можете включить аналитику, маркетинговые сигналы и персонализацию отдельно. Настройки сохраняются в браузере и доступны для изменения в любой момент.",
    alwaysOn: "Всегда включено",
    enabled: "Включено",
    disabled: "Выключено",
    categories: {
      necessary: {
        title: "Необходимые",
        text: "Запоминают ваш выбор cookies, поддерживают язык и базовую безопасность сайта.",
      },
      analytics: {
        title: "Google Analytics",
        text: "Помогают понять посещаемость, популярные страницы и качество интерфейса без ручного сбора персональных данных.",
      },
      marketing: {
        title: "Рекламные сигналы",
        text: "Разрешают `ad_storage`, `ad_user_data` и `ad_personalization` для будущей связки с Google Ads.",
      },
      preferences: {
        title: "Персонализация",
        text: "Разрешает хранение пользовательских предпочтений интерфейса, если такие функции будут добавлены.",
      },
    },
  },
  hy: {
    eyebrow: "Consent Mode v2",
    title: "Cookie կարգավորումներ",
    body:
      "Մենք օգտագործում ենք cookie ֆայլեր կայքի աշխատանքի բարելավման համար: Google Analytics-ը միանում է միայն Ձեր ընտրությամբ:",
    policyLink: "Գաղտնիության քաղաքականություն",
    modeLabel: "Ռեժիմ",
    advancedMode: "advanced",
    basicMode: "basic",
    acceptAll: "Ընդունել բոլորը",
    rejectAll: "Միայն պարտադիրները",
    customize: "Կարգավորել",
    save: "Պահպանել ընտրությունը",
    close: "Փակել",
    modalTitle: "Cookie կառավարման կենտրոն",
    modalText:
      "Կարող եք առանձին միացնել վերլուծությունը, գովազդային ազդանշանները և անհատականացումը։ Կարգավորումները պահվում են բրաուզերում և կարող են փոխվել ցանկացած պահի։",
    alwaysOn: "Միշտ միացված է",
    enabled: "Միացված է",
    disabled: "Անջատված է",
    categories: {
      necessary: {
        title: "Պարտադիր",
        text: "Հիշում են cookie ընտրությունը, պահպանում լեզուն և կայքի հիմնական անվտանգությունը։",
      },
      analytics: {
        title: "Google Analytics",
        text: "Օգնում են հասկանալ այցելությունները, կարևոր էջերը և ինտերֆեյսի որակը՝ առանց անձնական տվյալների ձեռքով հավաքման։",
      },
      marketing: {
        title: "Գովազդային ազդանշաններ",
        text: "Թույլ են տալիս `ad_storage`, `ad_user_data` և `ad_personalization`՝ Google Ads-ի հետ ապագա կապի համար։",
      },
      preferences: {
        title: "Անհատականացում",
        text: "Թույլ է տալիս պահել ինտերֆեյսի նախընտրությունները, եթե նման գործառույթներ ավելացվեն։",
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
  const consentMode = getGoogleConsentMode();
  const privacyPath = pagePath(locale, "privacy");

  const modeLabel = consentMode === "advanced" ? copy.advancedMode : copy.basicMode;

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
        <section className="cookie-consent" aria-label={copy.title}>
          <div className="cookie-consent__copy">
            <span className="cookie-consent__eyebrow">{copy.eyebrow}</span>
            <h2>{copy.title}</h2>
            <p>
              {copy.body} <Link to={privacyPath}>{copy.policyLink}</Link>
            </p>
            <span className="cookie-consent__mode">
              {copy.modeLabel}: {modeLabel}
            </span>
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
          <section className="cookie-consent__panel">
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
