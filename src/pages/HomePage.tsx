import { homeFaqSeoContent, homeSeoContent, hs } from "@/src/content/homeSeo";
import { HyDesktopHome } from "@/src/components/HyDesktopHome";
import { HyMobileHome } from "@/src/components/HyMobileHome";
import { RuDesktopHome } from "@/src/components/RuDesktopHome";
import { RuMobileHome } from "@/src/components/RuMobileHome";
import { Seo } from "@/src/components/Seo";
import {
  businessPhoneDisplay,
  businessPhoneMachine,
  businessWhatsappUrl,
} from "@/src/content/site";
import { usePageLocale } from "@/src/hooks/usePageLocale";
import {
  createFaqSchema,
  createHomePageSchema,
  createLocalBusinessSchema,
  createOrganizationSchema,
  createWebSiteSchema,
} from "@/src/lib/seo";

export function HomePage() {
  const locale = usePageLocale();

  const heroTitleArtwork = locale === "hy"
    ? {
        src: "/images/ABED11A4-D50A-4449-8F3C-399D085CACC0 13.44.03.png",
        width: 1535,
        height: 1024,
      }
    : {
        src: "/images/ABED11A4-D50A-4449-8F3C-399D085CACC0.png",
        width: 1536,
        height: 1024,
      };
  const socialDiscountCopy = locale === "ru"
    ? {
        aria: "Скидка 10 процентов пенсионерам",
        label: "СКИДКА 10%",
        text: "Пенсионерам",
      }
    : {
        aria: "10 տոկոս զեղչ թոշակառուների համար",
        label: "10% ԶԵՂՉ",
        text: "Թոշակառուներին",
      };
  const heroMarqueeTopItems = locale === "ru"
    ? [
        "САНТЕХНИК В ЕРЕВАНЕ",
        "УСЛУГИ САНТЕХНИКА",
        "ВЫЗОВ САНТЕХНИКА",
        "САНТЕХНИК НА ДОМ",
        "АВАРИЙНЫЙ САНТЕХНИК",
        "СРОЧНЫЙ ВЫЕЗД",
        "РЕМОНТ САНТЕХНИКИ",
        "УСТРАНЕНИЕ ЗАСОРОВ",
        "ПРОЧИСТКА КАНАЛИЗАЦИИ",
        "ПРОТЕЧКА ВОДЫ",
        "РЕМОНТ ПРОТЕЧЕК",
        "ЗАМЕНА ТРУБ",
        "МОНТАЖ ТРУБ",
        "СМЕСИТЕЛИ",
        "РЕМОНТ СМЕСИТЕЛЯ",
        "УНИТАЗЫ",
        "УСТАНОВКА УНИТАЗА",
        "РАКОВИНЫ",
        "УСТАНОВКА РАКОВИНЫ",
        "ДУШЕВЫЕ",
        "ДУШЕВАЯ КАБИНА",
        "БОЙЛЕРЫ",
        "РЕМОНТ БОЙЛЕРА",
        "СТИРАЛЬНЫЕ МАШИНЫ",
        "ПОДКЛЮЧЕНИЕ СТИРАЛЬНОЙ МАШИНЫ",
      ]
    : [
        "Կոյուղու մաքրում",
        "Խցանումների վերացում",
        "Ջրի արտահոսքի վերացում",
        "Խողովակների փոխարինում",
        "Խողովակների մոնտաժ",
        "Ծորակի տեղադրում",
        "Զուգարանակոնքի տեղադրում",
        "Բոյլերներ",
        "Սանտեխնիկ 24/7",
        "Սանտեխնիկի կանչ",
        "Սանտեխնիկական համալիր աշխատանքներ",
      ];
  const heroMarqueeBottomItems = locale === "ru"
    ? [
        "САНТЕХНИЧЕСКИЕ РАБОТЫ",
        "САНТЕХНИК НЕДОРОГО",
        "САНТЕХНИК 24/7",
        "МАСТЕР САНТЕХНИК",
        "САНТЕХНИК КЕНТРОН",
        "САНТЕХНИК АРАБКИР",
        "САНТЕХНИК ДАВТАШЕН",
        "САНТЕХНИК МАЛАТИЯ",
        "САНТЕХНИК НОР НОРК",
        "САНТЕХНИК ЭРЕБУНИ",
        "САНТЕХНИК АВАН",
        "САНТЕХНИК АЧАПНЯК",
        "ВОДОСНАБЖЕНИЕ",
        "КАНАЛИЗАЦИЯ",
        "РАЗВОДКА ВОДЫ",
        "ЗАМЕНА СТОЯКА",
        "ЗАМЕНА КРАНА",
        "УСТАНОВКА ФИЛЬТРА",
        "ФИЛЬТРЫ ДЛЯ ВОДЫ",
        "ГИБКАЯ ПОДВОДКА",
        "РЕМОНТ СЛИВА",
        "РЕМОНТ БАЧКА",
        "ЗАМЕНА СИФОНА",
        "ДИАГНОСТИКА ПО ФОТО",
      ]
    : heroMarqueeTopItems;
  const heroDesktopServiceTags = locale === "ru"
    ? [
        "Прочистка канализации",
        "Устранение засоров",
        "Протечка воды",
        "Замена труб",
        "Монтаж труб",
        "Установка смесителя",
        "Установка унитаза",
        "Бойлеры",
        "Сантехник круглосуточно",
        "Вызов сантехника",
      ]
    : [
        "Կոյուղու մաքրում",
        "Խցանումների վերացում",
        "Ջրի արտահոսքի վերացում",
        "Խողովակների փոխարինում",
        "Խողովակների մոնտաժ",
        "Ծորակի տեղադրում",
        "Զուգարանակոնքի տեղադրում",
        "Բոյլերներ",
        "Սանտեխնիկ 24/7",
        "Սանտեխնիկի կանչ",
        "Սանտեխնիկական համալիր աշխատանքներ",
      ];
  const heroBenefits = locale === "ru"
    ? [
        { icon: "call", text: "Оперативная связь и выезд" },
        { icon: "price", text: "Цена до начала работ" },
        { icon: "pin", text: "Работаем по всем районам Еревана" },
        { icon: "emergency", text: "Аварийные вызовы 24/7" },
      ]
    : [
        { icon: "call", text: "Մեկնում 30–60 րոպեում" },
        { icon: "price", text: "Գինը՝ նախապես" },
        { icon: "pin", text: "Ամբողջ Երևանում" },
        { icon: "emergency", text: "Սանտեխնիկ 24/7" },
      ];
  const heroFacts = locale === "ru"
    ? [
        { icon: "clock", iconSrc: "/icons/1.png", title: "Выезд", body: "30–60 минут" },
        { icon: "card", iconSrc: "/icons/3.png", title: "Без предоплаты", body: "оплата после работы" },
        { icon: "shield", iconSrc: "/icons/2.png", title: "Цена заранее", body: "до начала работ" },
        { icon: "pin", iconSrc: "/icons/4.png", title: "По всему Еревану", body: "все районы" },
      ]
    : [
        { icon: "clock", iconSrc: "/icons/1.png", title: "Մեկնում", body: "30–60 րոպեում" },
        { icon: "card", iconSrc: "/icons/3.png", title: "Առանց կանխավճարի", body: "վճարում՝ աշխատանքից հետո" },
        { icon: "shield", iconSrc: "/icons/2.png", title: "Գինը՝ նախապես", body: "մինչև աշխատանքների սկիզբը" },
        { icon: "pin", iconSrc: "/icons/4.png", title: "Ամբողջ Երևանում", body: "բոլոր վարչական շրջաններում" },
      ];
  const heroArtwork = locale === "hy"
    ? {
        src: "/images/hero-hy-cutout.png?v=20260811",
        width: 1654,
        height: 1834,
      }
    : {
        src: "/images/hero-ru-cutout.png?v=20260811",
        width: 865,
        height: 954,
      };
  const heroMobileLinks = locale === "ru"
    ? ["БОЙЛЕРЫ", "ФИЛЬТРЫ ДЛЯ ВОДЫ", "СТИРАЛЬНЫЕ МАШИНЫ", "КАНАЛИЗАЦИЯ", "СРОЧНЫЙ ВЫЕЗД"]
    : ["ԿՈՅՈՒՂՈՒ ՄԱՔՐՈՒՄ", "ԽՑԱՆՈՒՄՆԵՐԻ ՎԵՐԱՑՈՒՄ", "ԽՈՂՈՎԱԿՆԵՐԻ ՓՈԽԱՐԻՆՈՒՄ", "ԲՈՅԼԵՐՆԵՐ", "ՍԱՆՏԵԽՆԻԿ 24/7"];

  return (
    <>
      <Seo
        locale={locale}
        title={hs(locale, homeSeoContent.metaTitle)}
        description={hs(locale, homeSeoContent.metaDescription)}
        keywords={hs(locale, homeSeoContent.keywords)}
        path={`/${locale}/`}
        image={null}
        imageAlt={locale === "ru" ? "Сантехник в Ереване" : "Սանտեխնիկ Երևանում"}
        structuredData={[
          createOrganizationSchema(),
          createWebSiteSchema(locale),
          createLocalBusinessSchema(locale),
          createHomePageSchema(locale),
          createFaqSchema(locale, homeFaqSeoContent),
        ].filter((item): item is Record<string, unknown> => Boolean(item))}
      />

      <section className={`signal-hero signal-hero--home home-brand-hero home-brand-hero--${locale}`}>
        <h1 className="sr-only">
          {locale === "ru" ? "Сантехник в Ереване" : "Սանտեխնիկ Երևանում"}
        </h1>
        <div className="home-brand-hero__viewport">
          <div className="home-brand-hero__stage">
            <div className="home-brand-hero__screen">
              <div className="home-brand-hero__content">
                <div className="home-brand-hero__title" aria-hidden="true">
                  <img
                    className="home-brand-hero__title-art"
                    src={heroTitleArtwork.src}
                    width={heroTitleArtwork.width}
                    height={heroTitleArtwork.height}
                    alt=""
                  />
                </div>

                <ul className="home-brand-hero__benefits" aria-label={locale === "ru" ? "Преимущества" : "Առավելություններ"}>
                  {heroBenefits.map((benefit) => (
                    <li key={benefit.text} className={`home-brand-hero__benefit home-brand-hero__benefit--${benefit.icon}`}>
                      <span className="home-brand-hero__benefit-icon" aria-hidden="true" />
                      <span>{benefit.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="home-brand-hero__action-bar">
                  <a
                    href={`tel:${businessPhoneMachine}`}
                    className="home-brand-hero__cta home-brand-hero__cta--dark"
                    aria-label={businessPhoneDisplay}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M6.7 3.6 9 3.1c.8-.2 1.6.2 1.9 1l1 2.4c.3.7.1 1.4-.4 1.9l-1.2 1.2c.9 1.8 2.4 3.3 4.1 4.1l1.3-1.2c.5-.5 1.3-.6 1.9-.4l2.4 1c.8.3 1.2 1.1 1 1.9l-.5 2.3c-.2.8-.9 1.4-1.8 1.4C10.7 18.7 4.4 12.4 4.4 4.4c0-.8.6-1.6 1.3-1.8Z"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {locale === "ru" ? "ПОЗВОНИТЬ СЕЙЧАС" : "ԶԱՆԳԱՀԱՐԵԼ"}
                  </a>
                  <a
                    href={businessWhatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="home-brand-hero__cta home-brand-hero__cta--accent"
                  >
                    WHATSAPP
                  </a>
                </div>

                <div className="home-brand-hero__social-discount" aria-label={socialDiscountCopy.aria}>
                  <span className="home-brand-hero__social-discount-text">{socialDiscountCopy.text}</span>
                  <span className="home-brand-hero__social-discount-label">
                    <span>{socialDiscountCopy.label}</span>
                  </span>
                </div>
              </div>

              <div className="home-brand-hero__visual" aria-hidden="true">
                <div className="home-brand-hero__asset-frame">
                  <img
                    className="home-brand-hero__asset"
                    src={heroArtwork.src}
                    width={heroArtwork.width}
                    height={heroArtwork.height}
                    alt=""
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            <div className="home-brand-hero__fact-strip" aria-label={locale === "ru" ? "Условия работы" : "Աշխատանքի պայմաններ"}>
              {heroFacts.map((fact) => (
                <article key={fact.title} className="home-brand-hero__fact">
                  <img
                    className={`home-brand-hero__fact-icon home-brand-hero__fact-icon--${fact.icon}`}
                    src={fact.iconSrc}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                  />
                  <span className="home-brand-hero__fact-copy">
                    <strong>{fact.title}</strong>
                    <span>{fact.body}</span>
                  </span>
                </article>
              ))}
            </div>

            <nav className="home-brand-hero__mobile-links" aria-label={locale === "ru" ? "Популярные услуги" : "Հաճախ ընտրվող ծառայություններ"}>
              {heroMobileLinks.map((item) => (
                <a key={item} href="#uslugi">
                  {item}
                </a>
              ))}
            </nav>

            <div className="home-brand-hero__marquee home-brand-hero__marquee--mobile" aria-label={locale === "ru" ? "Направления" : "Ուղղություններ"}>
              <div className="home-brand-hero__marquee-track home-brand-hero__marquee-track--top">
                {[...heroMarqueeTopItems, ...heroMarqueeTopItems].map((item, index) => (
                  <span key={`${item}-${index}`} className="home-brand-hero__marquee-item">
                    {item}
                  </span>
                ))}
              </div>
              <div className="home-brand-hero__marquee-track home-brand-hero__marquee-track--bottom" aria-hidden="true">
                {[...heroMarqueeBottomItems, ...heroMarqueeBottomItems].map((item, index) => (
                  <span key={`${item}-reverse-${index}`} className="home-brand-hero__marquee-item">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="home-brand-hero__service-tags home-brand-hero__service-tags--desktop"
              aria-label={locale === "ru" ? "Популярные сантехнические услуги" : "Հաճախ ընտրվող սանտեխնիկական ծառայություններ"}
            >
              {heroDesktopServiceTags.map((item) => (
                <span key={item} className="home-brand-hero__service-tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {locale === "ru" ? (
        <>
          <div id="uslugi" className="ru-home-anchor" aria-hidden="true" />
          <RuDesktopHome />
          <RuMobileHome />
        </>
      ) : null}

      {locale === "hy" ? (
        <>
          <div id="uslugi" className="ru-home-anchor" aria-hidden="true" />
          <HyDesktopHome />
          <HyMobileHome />
        </>
      ) : null}

    </>
  );
}
