import {
  businessPhoneMachine,
  businessWhatsappUrl,
} from "@/src/content/site";
import type { Locale } from "@/src/types";

interface SummaryBlock {
  title: string;
  items: string[];
}

interface SectionCopy {
  sectionLabel: string;
  kicker: string;
  heading: string;
  intro: string;
  blocks: SummaryBlock[];
  ctaTitle: string;
  ctaText: string;
  phoneLabel: string;
  whatsappLabel: string;
}

const content: Record<Locale, SectionCopy> = {
  ru: {
    sectionLabel: "Сантехнические услуги в Ереване",
    kicker: "Услуги",
    heading: "Сантехнические услуги в Ереване",
    intro: "",
    blocks: [
      {
        title: "Аварийные ситуации",
        items: [
          "течёт труба или соединение",
          "прорвало гибкий шланг",
          "вода не уходит",
          "засорился унитаз или раковина",
          "нужен срочный выезд",
        ],
      },
      {
        title: "Монтаж водопровода и канализации",
        items: [
          "новая разводка и замена старых труб",
          "водоснабжение кухни и ванной",
          "монтаж канализационных труб",
          "квартиры, дома, офисы, магазины",
          "подготовка коммуникаций под ремонт",
        ],
      },
      {
        title: "Установка и замена сантехники",
        items: [
          "смесители, раковины и мойки",
          "унитазы и инсталляции",
          "ванны и душевые системы",
          "бойлеры и фильтры для воды",
          "подключение стиральных и посудомоечных машин",
        ],
      },
    ],
    ctaTitle: "Нужна помощь сейчас?",
    ctaText: "Приезжаем быстро. Решаем проблему сразу.",
    phoneLabel: "Позвонить",
    whatsappLabel: "WhatsApp",
  },
  hy: {
    sectionLabel: "Սանտեխնիկական ծառայություններ Երևանում",
    kicker: "Ինչ ենք նորոգում",
    heading: "Սանտեխնիկական ծառայություններ Երևանում",
    intro:
      "Ծառայությունները բաժանել ենք պարզ սցենարների՝ վթար, կոմունիկացիաներ, տեխնիկայի և սանտեխնիկայի տեղադրում։ Այդպես էջը հեշտ է կարդալ, իսկ հայտը արագ դառնում է կոնկրետ աշխատանք։",
    blocks: [
      {
        title: "Սանտեխնիկի շտապ կանչ 24/7",
        items: [
          "հոսում է խողովակը կամ միացումը",
          "ճկուն խողովակն է վնասվել",
          "ջուրը չի հեռանում",
          "խցանվել է զուգարանակոնքը կամ լվացարանը",
          "պետք է շտապ այց",
        ],
      },
      {
        title: "Ջրամատակարարման և կոյուղու մոնտաժ",
        items: [
          "նոր անցկացում և հին խողովակների փոխարինում",
          "խոհանոցի և լոգարանի ջրամատակարարում",
          "կոյուղու խողովակների մոնտաժ",
          "բնակարաններ, տներ, գրասենյակներ, խանութներ",
          "կոմունիկացիաների պատրաստում վերանորոգման համար",
        ],
      },
      {
        title: "Սանտեխնիկայի տեղադրում և փոխարինում",
        items: [
          "ծորակներ, լվացարաններ և խոհանոցային լվացարաններ",
          "զուգարանակոնքեր և ինստալյացիաներ",
          "լոգարաններ և ցնցուղային համակարգեր",
          "ջրատաքացուցիչներ և ջրի ֆիլտրեր",
          "լվացքի և աման լվացող մեքենաների միացում",
        ],
      },
    ],
    ctaTitle: "Օգնություն պե՞տք է հիմա",
    ctaText: "Արագ գալիս ենք և տեղում լուծում խնդիրը:",
    phoneLabel: "Զանգահարել",
    whatsappLabel: "WhatsApp",
  },
};

export function HomeServiceWall({ locale }: { locale: Locale }) {
  const c = content[locale];
  const phoneHref = `tel:${businessPhoneMachine}`;

  return (
    <section aria-label={c.sectionLabel} className={`home-service-wall home-service-wall--${locale}`}>
      <HomeServiceScopeCopy
        copy={c}
        locale={locale}
      />

      <div className="home-service-urgent" aria-label={c.ctaTitle}>
        <div className="home-service-urgent__copy">
          <h2 className="home-service-urgent__title">{c.ctaTitle}</h2>
          <p className="home-service-urgent__text">{c.ctaText}</p>
        </div>

        <div className="home-service-urgent__actions">
          <a href={phoneHref} className="home-service-urgent__button home-service-urgent__button--light">
            {c.phoneLabel}
          </a>
          <a
            href={businessWhatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="home-service-urgent__button home-service-urgent__button--dark"
          >
            {c.whatsappLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

function HomeServiceScopeCopy({
  copy,
  locale,
}: {
  copy: SectionCopy;
  locale: Locale;
}) {
  return (
    <div
      id="uslugi"
      className={`home-service-scope home-service-scope--${locale}`}
      aria-label={copy.sectionLabel}
    >
      <div className="home-service-scope__topline">
        <p className="home-service-scope__eyebrow">{copy.kicker}</p>
        <div className="home-service-scope__heading-copy">
          <h2 className="home-service-scope__section-title">{copy.heading}</h2>
          {copy.intro ? <p className="home-service-scope__intro">{copy.intro}</p> : null}
        </div>
      </div>

      <div id="raboty" className="home-service-scope__grid">
        {copy.blocks.map((block, index) => (
          <section key={block.title} className={`home-service-scope__block home-service-scope__block--${index + 1}`}>
            <div className="home-service-scope__block-head">
              <span className="home-service-scope__block-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="home-service-scope__icon" aria-hidden="true" />
              <h3 className="home-service-scope__block-title">{block.title}</h3>
            </div>

            <ul className="home-service-scope__list">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
