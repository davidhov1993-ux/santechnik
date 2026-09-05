import type { ChangeEvent, FormEvent } from "react";
import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { businessPhoneDisplay, businessPhoneMachine } from "@/src/content/site";
import { submitContactRequest } from "@/src/lib/contactForm";
import { pagePath } from "@/src/lib/locale";

type FormStatus = "error" | "idle" | "submitting" | "success";

interface MobileFormState {
  name: string;
  phone: string;
  message: string;
}

const services = [
  {
    number: "01",
    icon: "/icons/6.png",
    title: "ՇՏԱՊ ՍԱՆՏԵԽՆԻԿ 24/7",
    items: [
      "Սանտեխնիկի կանչ / Սանտեխնիկ Երևան",
      "Ջրի արտահոսքի վերացում (կաթոցներ)",
      "Սանտեխնիկի շտապ օգնություն 24/7",
    ],
  },
  {
    number: "02",
    icon: "/icons/7.png",
    title: "ՋՐԱՄԱՏԱԿԱՐԱՐՈՒՄ",
    items: [
      "Խողովակների մոնտաժ / Ջրի գծեր",
      "Ծորակների (սմեսիտել), լվացարանների տեղադրում",
      "Զուգարանակոնքի (ունիտազ) տեղադրում, նորոգում",
    ],
  },
  {
    number: "03",
    icon: "/icons/8.png",
    title: "ԿՈՅՈՒՂԻ",
    items: [
      "Կոյուղու խցանումների բացում (տրուբա մաքրել)",
      "Կոյուղու մաքրում / Խողովակների մաքրում",
      "Ջրահեռացման համակարգերի անցկացում",
    ],
  },
  {
    number: "04",
    icon: "/icons/11.png",
    title: "ՋԵՌՈՒՑՈՒՄ",
    items: [
      "Ջեռուցման համակարգերի մոնտաժ, ռադիատորներ",
      "Կոտելների (կաթսա), բաքսի (Baxi), բոյլերների տեղադրում",
      "Լվացքի մեքենայի և աման լվացողի միացում",
    ],
  },
];

const visitFacts = [
  {
    icon: "/icons/3.png",
    title: "Գինը՝ նախապես",
    body: "Աշխատանքի արժեքը կիմանաք նախքան գործը սկսելը։ Ոչ մի թաքնված ծախս։ Եթե անհրաժեշտ է տեղում զննել խնդիրը, այդ մասին կզգուշացնենք նախքան դուրս գալը։",
  },
  {
    icon: "/icons/1.png",
    title: "Շտապ մեկնում",
    body: "Գալիս ենք Երևանի ցանկացած թաղամաս՝ թե՛ պլանային գործերով, թե՛ շտապ վթարների դեպքում։ Մշտապես կապի մեջ ենք։",
  },
  {
    icon: "/icons/6.png",
    title: "Որակի փորձարկում",
    body: "Չենք հեռանում, քանի դեռ անձամբ չենք համոզվել, որ ամեն ինչ հերմետիկ է, ջուրը ճիշտ է հեռանում, ճնշումը լավն է, իսկ սանտեխնիկան աշխատում է անթերի։",
  },
  {
    icon: "/icons/2.png",
    title: "Ամեն ինչ մեզ հետ է",
    body: "Ծորակների, սիֆոնների, խողովակների կամ բոյլերի նորոգման համար բոլոր պրոֆեսիոնալ գործիքներն ու անհրաժեշտ պահեստամասերը բերում ենք մեզ հետ։ Ձեզանից ոչինչ չի պահանջվում։",
  },
];

const prices = [
  ["Սանտեխնիկի մեկնում Երևանում", "10 000 ֏"],
  ["Սանտեխնիկական մանր վերանորոգում", "10 000 ֏"],
  ["Սանտեխնիկայի տեղադրում և փոխարինում", "5 000 ֏-ից"],
  ["Լոգախցիկի մոնտաժ", "20 000 ֏-ից"],
  ["Ջրամատակարարման և կոյուղու անցկացում", "15 000 ֏-ից / կետ"],
  ["Վթարային կանչ 24/7", "20 000 ֏"],
];

const districts = [
  "Կենտրոն",
  "Արաբկիր",
  "Նոր Նորք",
  "Մալաթիա-Սեբաստիա",
  "Աջափնյակ",
  "Շենգավիթ",
  "Քանաքեռ-Զեյթուն",
  "Էրեբունի",
  "Նորք-Մարաշ",
  "Ավան",
  "Դավթաշեն",
  "Նուբարաշեն",
];

function sanitizePhone(value: string) {
  return value.replace(/[^\d+\s()-]/g, "").slice(0, 24);
}

function applyFileLimit(files: FileList | null) {
  return Array.from(files ?? []).slice(0, 8);
}

export function HyMobileHome() {
  const nameId = useId();
  const phoneId = useId();
  const messageId = useId();
  const filesId = useId();
  const privacyId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useState<MobileFormState>({
    name: "",
    phone: "",
    message: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const resetStatus = () => {
    if (status !== "idle") setStatus("idle");
    if (statusMessage) setStatusMessage("");
  };

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: name === "phone" ? sanitizePhone(value) : value,
    }));
    resetStatus();
  };

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFiles(applyFileLimit(event.target.files));
    resetStatus();
  };

  const handleFileRemove = (indexToRemove: number) => {
    setFiles((current) => current.filter((_, index) => index !== indexToRemove));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    resetStatus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const phoneDigits = values.phone.replace(/\D/g, "");

    if (
      values.name.trim().length < 2 ||
      phoneDigits.length < 7 ||
      values.message.trim().length < 5 ||
      !privacyAccepted
    ) {
      setStatus("error");
      setStatusMessage("Լրացրեք անունը, հեռախոսը, կարճ նկարագրեք խնդիրը և հաստատեք համաձայնությունը Գաղտնիության քաղաքականությանը։");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const result = await submitContactRequest({
        locale: "hy",
        source: "hy-canonical-home",
        name: values.name,
        phone: values.phone,
        message: values.message,
        privacyAccepted,
        files,
        metadata: {
          layout: "canonical-hy",
        },
      });

      if (!result.ok) {
        throw new Error(result.message ?? "Request failed");
      }

      setStatus("success");
      setStatusMessage(result.message ?? "Հաղորդագրությունն ուղարկվել է։ Եթե հարցը շտապ է, ավելի լավ է անմիջապես զանգահարել։");
      setValues({
        name: "",
        phone: "",
        message: "",
      });
      setFiles([]);
      setPrivacyAccepted(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setStatus("error");
      setStatusMessage("Հաղորդագրությունը չուղարկվեց։ Փորձեք կրկին կամ կապվեք հեռախոսով կամ WhatsApp-ով։");
    }
  };

  return (
    <div className="ru-mobile-home" aria-label="Սանտեխնիկի գլխավոր էջ Երևանում">
      <section id="uslugi-mobile" className="ru-mobile-home__section ru-mobile-home__section--turnkey-services">
        <div className="ru-mobile-home__turnkey-heading">
          <h2 className="ru-mobile-home__title">Սանտեխնիկական ծառայություններ Երևանում / Սանտեխնիկ Երևան</h2>
        </div>

        <p className="ru-mobile-home__service-intro">
          Շտապ սանտեխնիկ 24/7, ջրամատակարարում, կոյուղի, ջեռուցում, խողովակների փոխարինում, ջրի արտահոսքերի և խցանումների վերացում, բոյլերների, սանտեխնիկայի և կենցաղային տեխնիկայի տեղադրում։
        </p>
        <p className="ru-mobile-home__meta">Բնակարաններ · տներ · գրասենյակներ · խանութներ · սրճարաններ</p>

        <a className="ru-mobile-home__service-phone" href={`tel:${businessPhoneMachine}`}>
          <span>Անվճար խորհրդատվության համար զանգահարեք</span>
          <strong>{businessPhoneDisplay}</strong>
        </a>

        <div className="ru-mobile-home__service-list" aria-label="Հիմնական սանտեխնիկական աշխատանքներ">
          {services.map((service) => (
            <article key={service.number} className="ru-mobile-home__service">
              <div className="ru-mobile-home__service-head">
                <img className="ru-mobile-home__service-icon" src={service.icon} alt="" aria-hidden="true" loading="lazy" />
                <span>{service.number}</span>
                <h3>{service.title}</h3>
              </div>
              <ul className="ru-mobile-home__line-list">
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="ru-mobile-home__section ru-mobile-home__section--visit">
        <div className="ru-mobile-home__visit-head">
          <img className="ru-mobile-home__visit-icon" src="/icons/3.png" alt="" aria-hidden="true" loading="lazy" />
          <h2 className="ru-mobile-home__visit-title">Աշխատանք՝ առանց անսպասելի ծախսերի</h2>
        </div>
        <p className="ru-mobile-home__visit-intro">
          Գինը նախապես համաձայնեցնում ենք, գալիս ենք անհրաժեշտ գործիքներով, կատարում ենք սանտեխնիկական աշխատանքները և ստուգում արդյունքը։
        </p>
        <div className="ru-mobile-home__visit-grid">
          {visitFacts.map((fact) => (
            <article key={fact.title} className="ru-mobile-home__visit-card">
              <img className="ru-mobile-home__visit-card-icon" src={fact.icon} alt="" aria-hidden="true" loading="lazy" />
              <h3>{fact.title}</h3>
              <p>{fact.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ru-mobile-home__section ru-mobile-home__section--prices">
        <img className="ru-mobile-home__section-icon" src="/icons/3.png" alt="" aria-hidden="true" loading="lazy" />
        <p className="ru-mobile-home__eyebrow">Մոտավոր գներ</p>
        <dl className="ru-mobile-home__price-list">
          {prices.map(([label, value]) => (
            <div key={label} className="ru-mobile-home__price-row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="ru-mobile-home__discount-note">
          <strong>10% ԶԵՂՉ</strong>
          <span>Թոշակառուներին</span>
        </p>
      </section>

      <section className="ru-mobile-home__section ru-mobile-home__section--areas">
        <img className="ru-mobile-home__section-icon" src="/icons/4.png" alt="" aria-hidden="true" loading="lazy" />
        <p className="ru-mobile-home__eyebrow">Վարչական շրջաններ</p>
        <h2 className="ru-mobile-home__title">Աշխատում ենք ամբողջ Երևանում</h2>
        <p className="ru-mobile-home__text">
          Շտապ և պլանային սանտեխնիկական աշխատանքներ Երևանի բոլոր վարչական շրջաններում։
        </p>
        <ul className="ru-mobile-home__districts">
          {districts.map((district) => (
            <li key={district}>{district}</li>
          ))}
        </ul>
      </section>

      <section className="ru-mobile-home__section ru-mobile-home__section--form">
        <h2 className="ru-mobile-home__title">Կապվել սանտեխնիկի հետ</h2>
        <p className="ru-mobile-home__text">
          Օբյեկտի լուսանկարները, տեսանյութը, հատակագիծը կամ փաստաթղթերը կարող եք կցել ստորև։
        </p>

        <form className="ru-mobile-home__form" onSubmit={handleSubmit}>
          <label className="ru-mobile-home__field" htmlFor={nameId}>
            <span>Անուն</span>
            <input id={nameId} name="name" value={values.name} onChange={handleFieldChange} placeholder="Ձեր անունը" autoComplete="name" />
          </label>

          <label className="ru-mobile-home__field" htmlFor={phoneId}>
            <span>Հեռախոս</span>
            <input
              id={phoneId}
              name="phone"
              type="tel"
              value={values.phone}
              onChange={handleFieldChange}
              placeholder="+374"
              autoComplete="tel"
              inputMode="tel"
            />
          </label>

          <label className="ru-mobile-home__field" htmlFor={messageId}>
            <span>Հաղորդագրություն</span>
            <textarea
              id={messageId}
              name="message"
              value={values.message}
              onChange={handleFieldChange}
              placeholder="Նկարագրեք խնդիրը, նշեք՝ որտեղ է գտնվում օբյեկտը և որքանով է շտապ։"
              rows={5}
            />
          </label>

          <label className="ru-mobile-home__upload" htmlFor={filesId}>
            <span className="ru-mobile-home__upload-label">Ֆայլեր</span>
            <input
              id={filesId}
              ref={fileInputRef}
              className="ru-mobile-home__file-input"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.heic,.webp,.txt"
              onChange={handleFilesChange}
            />
            <span className="ru-mobile-home__upload-button">Կցել</span>
            <span className="ru-mobile-home__upload-hint">Լուսանկարներ կամ փաստաթղթեր · մինչև 3 ՄԲ</span>
            <span className="ru-mobile-home__upload-hint">Տեսանյութը ցանկալի է ուղարկել WhatsApp-ով։</span>

            {files.length > 0 ? (
              <span className="ru-mobile-home__file-list" aria-live="polite">
                {files.map((file, index) => (
                  <span key={`${file.name}-${file.lastModified}-${index}`} className="ru-mobile-home__file-item">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      aria-label={`Հեռացնել ֆայլը ${file.name}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleFileRemove(index);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </span>
            ) : null}
          </label>

          <label className="ru-mobile-home__consent" htmlFor={privacyId}>
            <input
              id={privacyId}
              type="checkbox"
              checked={privacyAccepted}
              onChange={(event) => {
                setPrivacyAccepted(event.target.checked);
                resetStatus();
              }}
              required
            />
            <span>
              Համաձայն եմ <Link to={pagePath("hy", "privacy")}>Գաղտնիության քաղաքականությանը</Link>։
            </span>
          </label>

          <button className="ru-mobile-home__submit" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Ուղարկվում է..." : "Ուղարկել"}
          </button>

          {status !== "idle" ? (
            <p className={`ru-mobile-home__status ru-mobile-home__status--${status}`} role="status" aria-live="polite">
              {status === "submitting" ? "Ուղարկվում է..." : statusMessage}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
