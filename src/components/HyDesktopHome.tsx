import type { ChangeEvent, FormEvent } from "react";
import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  businessPhoneDisplay,
  businessPhoneMachine,
} from "@/src/content/site";
import { submitContactRequest } from "@/src/lib/contactForm";
import { pagePath } from "@/src/lib/locale";

type FormStatus = "error" | "idle" | "submitting" | "success";

interface DesktopFormState {
  name: string;
  phone: string;
  message: string;
}

const services = [
  {
    number: "01",
    icon: "/icons/6.png",
    title: "Շտապ սանտեխնիկ 24/7",
    items: [
      "Ջրի արտահոսք և խողովակների վթարներ",
      "Կոյուղու խցանումներ",
      "Շտապ մեկնում Երևանի տարածքում",
    ],
  },
  {
    number: "02",
    icon: "/icons/7.png",
    title: "Ջրամատակարարում",
    items: [
      "Խողովակների մոնտաժ և փոխարինում",
      "Տաք և սառը ջրամատակարարում",
      "Ծորակներ, լվացարաններ, զուգարանակոնքեր",
    ],
  },
  {
    number: "03",
    icon: "/icons/8.png",
    title: "Կոյուղի",
    items: [
      "Կոյուղու մաքրում",
      "Ջրահեռացման կետերի տեղափոխում",
      "Խոհանոց, լոգասենյակ, սանհանգույց",
    ],
  },
  {
    number: "04",
    icon: "/icons/11.png",
    title: "Ջեռուցում",
    items: [
      "Ռադիատորներ և ջեռուցման խողովակներ",
      "Կաթսաներ, բոյլերներ, ջրատաքացուցիչներ",
      "Լվացքի և աման լվացող մեքենաներ",
    ],
  },
];

const visitFacts = [
  {
    icon: "/icons/3.png",
    title: "Գինը՝ նախապես",
    body: "Աշխատանքի արժեքը հայտնում ենք մինչև աշխատանքների սկիզբը։ Եթե անհրաժեշտ է նախնական զննում, այդ մասին տեղեկացնում ենք մինչև մեկնելը։",
  },
  {
    icon: "/icons/1.png",
    title: "Մեկնում",
    body: "Մեկնում ենք Երևանի տարածքում՝ ինչպես պլանային աշխատանքների, այնպես էլ շտապ կանչերի դեպքում։",
  },
  {
    icon: "/icons/6.png",
    title: "Անհրաժեշտ գործիքներով",
    body: "Խողովակների, սիֆոնների, ծորակների և բոյլերների աշխատանքների համար մեզ հետ բերում ենք անհրաժեշտ գործիքներն ու դետալները։",
  },
  {
    icon: "/icons/2.png",
    title: "Արդյունքի ստուգում",
    body: "Ստուգում ենք միացումների հերմետիկությունը, ջրահեռացումը, ջրի ճնշումը և տեղադրված սանտեխնիկայի աշխատանքը։",
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

export function HyDesktopHome() {
  const nameId = useId();
  const phoneId = useId();
  const messageId = useId();
  const filesId = useId();
  const privacyId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useState<DesktopFormState>({
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
        source: "hy-desktop-home",
        name: values.name,
        phone: values.phone,
        message: values.message,
        privacyAccepted,
        files,
        metadata: {
          layout: "desktop-hy",
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
    <div className="ru-desktop-home" aria-label="Սանտեխնիկի գլխավոր էջ Երևանում">
      <section id="uslugi-desktop" className="ru-desktop-home__section ru-desktop-home__section--workbench">
        <div className="ru-desktop-home__inner ru-desktop-home__workbench">
          <div className="ru-desktop-home__workbench-intro">
            <h2 className="ru-desktop-home__title">Սանտեխնիկական ծառայություններ Երևանում</h2>
          </div>

          <div className="ru-desktop-home__workbench-strip">
            <div className="ru-desktop-home__section-copy">
              <p className="ru-desktop-home__lead">
                Շտապ սանտեխնիկ 24/7, ջրամատակարարում, կոյուղի, ջեռուցում, խողովակների փոխարինում, ջրի արտահոսքերի և խցանումների վերացում, բոյլերների, սանտեխնիկայի և կենցաղային տեխնիկայի տեղադրում։
              </p>
            </div>
          </div>

          <div className="ru-desktop-home__service-grid">
            {services.map((service) => (
              <article key={service.title} className="ru-desktop-home__service">
                <div className="ru-desktop-home__service-head">
                  <img
                    className="ru-desktop-home__service-icon"
                    src={service.icon}
                    width="200"
                    height="200"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                  />
                  <h3>{service.title}</h3>
                </div>
                <ul className="ru-desktop-home__list">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ru-desktop-home__section ru-desktop-home__section--consult">
        <div className="ru-desktop-home__inner ru-desktop-home__consult-strip">
          <p className="ru-desktop-home__meta">Բնակարաններ · տներ · գրասենյակներ · խանութներ · սրճարաններ</p>
          <a className="ru-desktop-home__service-phone" href={`tel:${businessPhoneMachine}`}>
            <span>Անվճար խորհրդատվության համար զանգահարեք</span>
            <strong>{businessPhoneDisplay}</strong>
          </a>
        </div>
      </section>

      <section className="ru-desktop-home__section ru-desktop-home__section--visit">
        <div className="ru-desktop-home__inner ru-desktop-home__visit-inner">
          <div className="ru-desktop-home__section-head">
            <h2 className="ru-desktop-home__title">Աշխատանք՝ առանց անսպասելի ծախսերի</h2>
            <p className="ru-desktop-home__lead">
              Գինը նախապես համաձայնեցնում ենք, գալիս ենք անհրաժեշտ գործիքներով, կատարում ենք սանտեխնիկական աշխատանքները և ստուգում արդյունքը։
            </p>
          </div>

          <div className="ru-desktop-home__fact-grid">
            {visitFacts.map((fact) => (
              <article key={fact.title} className="ru-desktop-home__fact">
                <img
                  className="ru-desktop-home__fact-icon"
                  src={fact.icon}
                  width="200"
                  height="200"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                />
                <div className="ru-desktop-home__fact-copy">
                  <h3>{fact.title}</h3>
                  <p>{fact.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="ru-desktop-home__pricing-stack">
        <section className="ru-desktop-home__section ru-desktop-home__section--areas">
          <div className="ru-desktop-home__inner ru-desktop-home__areas-inner">
            <div className="ru-desktop-home__areas-copy">
              <p className="ru-desktop-home__eyebrow">Վարչական շրջաններ</p>
              <h2 className="ru-desktop-home__title">Աշխատում ենք ամբողջ Երևանում</h2>
              <p className="ru-desktop-home__lead">
                Շտապ և պլանային սանտեխնիկական աշխատանքներ Երևանի բոլոր վարչական շրջաններում։
              </p>
              <ul className="ru-desktop-home__district-grid">
                {districts.map((district) => (
                  <li key={district}>{district}</li>
                ))}
              </ul>
            </div>
            <figure className="ru-desktop-home__map-panel">
              <img
                className="ru-desktop-home__map-image"
                src="/images/download.png"
                width="1058"
                height="790"
                alt="Երևանի ստատիկ քարտեզ"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </section>

        <section className="ru-desktop-home__section ru-desktop-home__section--prices">
          <div className="ru-desktop-home__inner">
            <div className="ru-desktop-home__price-layout">
              <div className="ru-desktop-home__price-copy">
                <h2 className="ru-desktop-home__title">Մոտավոր գներ</h2>
              </div>
              <dl className="ru-desktop-home__price-grid">
                {prices.map(([label, value]) => (
                  <div key={label} className="ru-desktop-home__price">
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </div>

      <section className="ru-desktop-home__section ru-desktop-home__section--form">
        <div className="ru-desktop-home__inner ru-desktop-home__form-inner">
          <div className="ru-desktop-home__form-copy">
            <h2 className="ru-desktop-home__title">Կապվել սանտեխնիկի հետ</h2>
            <p className="ru-desktop-home__lead">
              Օբյեկտի լուսանկարները, տեսանյութը, հատակագիծը կամ փաստաթղթերը կարող եք կցել ստորև։
            </p>
          </div>

          <form className="ru-desktop-home__form" onSubmit={handleSubmit}>
            <label className="ru-desktop-home__field" htmlFor={nameId}>
              <span>Անուն</span>
              <input id={nameId} name="name" value={values.name} onChange={handleFieldChange} placeholder="Ձեր անունը" autoComplete="name" />
            </label>

            <label className="ru-desktop-home__field" htmlFor={phoneId}>
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

            <label className="ru-desktop-home__field ru-desktop-home__field--message" htmlFor={messageId}>
              <span>Հաղորդագրություն</span>
              <textarea
                id={messageId}
                name="message"
                value={values.message}
                onChange={handleFieldChange}
                placeholder="Նկարագրեք խնդիրը, նշեք՝ որտեղ է գտնվում օբյեկտը և որքանով է շտապ։"
                rows={4}
              />
            </label>

            <label className="ru-desktop-home__upload" htmlFor={filesId}>
              <span className="ru-desktop-home__upload-label">Ֆայլեր</span>
              <input
                id={filesId}
                ref={fileInputRef}
                className="ru-desktop-home__file-input"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.heic,.webp,.txt"
                onChange={handleFilesChange}
              />
              <span className="ru-desktop-home__upload-action">Կցել</span>
              <span className="ru-desktop-home__upload-hint">Լուսանկարներ կամ փաստաթղթեր · մինչև 3 ՄԲ</span>
              <span className="ru-desktop-home__upload-hint">Տեսանյութը ցանկալի է ուղարկել WhatsApp-ով։</span>

              {files.length > 0 ? (
                <span className="ru-desktop-home__file-list" aria-live="polite">
                  {files.map((file, index) => (
                    <span key={`${file.name}-${file.lastModified}-${index}`} className="ru-desktop-home__file-item">
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

            <label className="ru-desktop-home__consent" htmlFor={privacyId}>
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

            <button className="ru-desktop-home__submit" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Ուղարկվում է..." : "Ուղարկել"}
            </button>

            {status !== "idle" ? (
              <p className={`ru-desktop-home__status ru-desktop-home__status--${status}`} role="status" aria-live="polite">
                {status === "submitting" ? "Ուղարկվում է..." : statusMessage}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </div>
  );
}
