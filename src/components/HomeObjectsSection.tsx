import type { ChangeEvent, DragEvent, FormEvent } from "react";
import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { pagePath } from "@/src/lib/locale";
import type { Locale } from "@/src/types";

type FormStatus = "idle" | "error" | "success";
type AudienceKind = "private" | "commercial" | "state";

interface AudienceItem {
  kind: AudienceKind;
  label: string;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface SectionCopy {
  ariaLabel: string;
  bridgeItems: AudienceItem[];
  title?: string;
  text: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneFieldLabel: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  filesLabel: string;
  filesButton: string;
  filesHint: string;
  filesDragHint: string;
  submitLabel: string;
  privacyPrefix: string;
  privacyLink: string;
  privacySuffix: string;
  errorNote: string;
  statusNote: string;
}

const content: Record<Locale, SectionCopy> = {
  ru: {
    ariaLabel: "Заявка",
    bridgeItems: [
      { kind: "private", label: "Квартиры и дома" },
      { kind: "commercial", label: "Магазины и офисы" },
      { kind: "state", label: "Рестораны и коммерция" },
    ],
    text: "Для связи оставьте заявку и прикрепите любые прилагающиеся файлы.",
    nameLabel: "Имя",
    namePlaceholder: "Ваше имя",
    phoneFieldLabel: "Телефон",
    phonePlaceholder: "+374",
    emailLabel: "Email",
    emailPlaceholder: "name@example.com",
    messageLabel: "Сообщение",
    messagePlaceholder: "Что за объект, что нужно сделать, есть ли срочность.",
    filesLabel: "Файлы",
    filesButton: "Прикрепить",
    filesHint: "Форматы: PDF, Word, Excel, PNG, JPG.",
    filesDragHint: "Перетащите файлы или выберите вручную.",
    submitLabel: "Отправить заявку",
    privacyPrefix: "Нажимая кнопку, вы соглашаетесь с",
    privacyLink: "Политикой конфиденциальности",
    privacySuffix: ".",
    errorNote: "Заполните имя, телефон, email, сообщение и подтвердите согласие с Политикой конфиденциальности.",
    statusNote:
      "Спасибо. Свяжемся в ближайшее время — обычно отвечаем в течение часа в рабочее время.",
  },
  hy: {
    ariaLabel: "Հայտ",
    bridgeItems: [
      { kind: "private", label: "Բնակարաններ և տներ" },
      { kind: "commercial", label: "Խանութներ և գրասենյակներ" },
      { kind: "state", label: "Ռեստորաններ և կոմերցիա" },
    ],
    text: "Կապի համար թողեք հայտ և կցեք ցանկացած համապատասխան ֆայլեր։",
    nameLabel: "Անուն",
    namePlaceholder: "Ձեր անունը",
    phoneFieldLabel: "Հեռախոս",
    phonePlaceholder: "+374",
    emailLabel: "Email",
    emailPlaceholder: "name@example.com",
    messageLabel: "Հաղորդագրություն",
    messagePlaceholder: "Ինչ օբյեկտ, ինչ պետք է անել, արդյոք շտապ է։",
    filesLabel: "Ֆայլեր",
    filesButton: "Կցել",
    filesHint: "Ֆորմատներ՝ PDF, Word, Excel, PNG, JPG։",
    filesDragHint: "Քաշեք ֆայլերը կամ ընտրեք ձեռքով։",
    submitLabel: "Ուղարկել հայտը",
    privacyPrefix: "Սեղմելով կոճակը՝ Դուք համաձայնում եք",
    privacyLink: "Գաղտնիության քաղաքականությանը",
    privacySuffix: ":",
    errorNote: "Լրացրեք անունը, հեռախոսը, email-ը, հաղորդագրությունը և հաստատեք համաձայնությունը Գաղտնիության քաղաքականության հետ:",
    statusNote:
      "Շնորհակալություն։ Շուտով կկապվենք Ձեզ հետ․ սովորաբար պատասխանում ենք մեկ ժամվա ընթացքում աշխատանքային ժամերին։",
  },
};

function AudienceIcon({ kind }: { kind: AudienceKind }) {
  if (kind === "private") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 19V10.7L12 4l8 6.7V19h-5.2v-5.5H9.2V19H4Zm1.8-1.8h1.6v-5.5h9.2v5.5h1.6v-5.6L12 6.3l-6.2 5.3v5.6Z" />
      </svg>
    );
  }

  if (kind === "commercial") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 19V8.8l4.5-3.6 4.2 3.2V19H4Zm10.2 0v-8.5l3.4-2.7 2.4 1.8V19h-5.8Zm-8.4-1.8h5.1V9.3L8.5 7.5 5.8 9.6v7.6Zm10.2 0h2.2v-6.6l-.6-.4-1.6 1.3v5.7Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 19V17.2H5.5V10.1H4.2V8.3L12 4.2l7.8 4.1v1.8h-1.3v7.1H21V19H3Zm4.3-1.8h1.8V10.1H7.3v7.1Zm3.6 0h1.8V10.1h-1.8v7.1Zm3.6 0h1.8V10.1h-1.8v7.1Zm-7.4-8.9h9.8L12 5.9 7.1 8.3Z" />
    </svg>
  );
}

function sanitizePhone(value: string) {
  return value.replace(/[^\d+\s()-]/g, "").slice(0, 24);
}

function applyFileLimit(files: File[] | FileList | null) {
  return Array.from(files ?? []).slice(0, 8).map((file) => file.name);
}

function hasValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value.trim());
}

export function HomeObjectsSection({ locale }: { locale: Locale }) {
  const c = content[locale];
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const messageId = useId();
  const fileId = useId();
  const privacyId = useId();
  const dragDepth = useRef(0);
  const [values, setValues] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [files, setFiles] = useState<string[]>([]);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [dragActive, setDragActive] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const resetStatus = () => {
    if (status !== "idle") {
      setStatus("idle");
    }
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

  const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current += 1;
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);

    if (dragDepth.current === 0) {
      setDragActive(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!dragActive) {
      setDragActive(true);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = 0;
    setDragActive(false);
    setFiles(applyFileLimit(event.dataTransfer.files));
    resetStatus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const phoneDigits = values.phone.replace(/\D/g, "");
    const isValid =
      values.name.trim().length >= 2 &&
      phoneDigits.length >= 7 &&
      hasValidEmail(values.email) &&
      values.message.trim().length >= 10 &&
      privacyAccepted;

    setStatus(isValid ? "success" : "error");
  };

  return (
    <section className="home-request-block" aria-label={c.ariaLabel}>
      <div className="home-request-block__inner">
        <div className="home-request-bridge">
          <div className="home-request-bridge__items">
            {c.bridgeItems.map((item) => (
              <div key={item.kind} className="home-request-bridge__item">
                <span className="home-request-bridge__icon">
                  <AudienceIcon kind={item.kind} />
                </span>
                <span className="home-request-bridge__text">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="home-request-block__panel">
          <div className="home-request-block__intro">
            <div className={`home-request-block__intro-main${c.title ? "" : " home-request-block__intro-main--compact"}`}>
              {c.title ? <h2 className="home-request-block__title">{c.title}</h2> : null}
              <p className="home-request-block__text">{c.text}</p>
            </div>
          </div>

          <form className="home-request-form" onSubmit={handleSubmit} noValidate>
            <div className="home-request-form__contact-row">
              <label className="home-request-form__field" htmlFor={nameId}>
                <span className="home-request-form__field-label">{c.nameLabel}</span>
                <input
                  id={nameId}
                  className="home-request-form__input"
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleFieldChange}
                  placeholder={c.namePlaceholder}
                  autoComplete="name"
                />
              </label>

              <label className="home-request-form__field" htmlFor={phoneId}>
                <span className="home-request-form__field-label">{c.phoneFieldLabel}</span>
                <input
                  id={phoneId}
                  className="home-request-form__input"
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleFieldChange}
                  placeholder={c.phonePlaceholder}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </label>

              <label className="home-request-form__field" htmlFor={emailId}>
                <span className="home-request-form__field-label">{c.emailLabel}</span>
                <input
                  id={emailId}
                  className="home-request-form__input"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleFieldChange}
                  placeholder={c.emailPlaceholder}
                  autoComplete="email"
                />
              </label>
            </div>

            <label className="home-request-form__field" htmlFor={messageId}>
              <span className="home-request-form__field-label">{c.messageLabel}</span>
              <textarea
                id={messageId}
                className="home-request-form__textarea"
                rows={7}
                name="message"
                value={values.message}
                onChange={handleFieldChange}
                placeholder={c.messagePlaceholder}
              />
            </label>

            <div className="home-request-form__bottom">
              <label
                className={`home-request-form__field home-request-form__field--files ${dragActive ? "is-drag-active" : ""}`.trim()}
                htmlFor={fileId}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <span className="home-request-form__field-label">{c.filesLabel}</span>
                <input
                  id={fileId}
                  className="home-request-form__file-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  onChange={handleFilesChange}
                />

                <span className="home-request-form__file-shell">
                  <span className="home-request-form__file-button">{c.filesButton}</span>
                  <span className="home-request-form__file-copy">
                    <span className="home-request-form__file-hint">{c.filesHint}</span>
                    <span className="home-request-form__file-drag">{c.filesDragHint}</span>
                  </span>
                </span>

                {files.length > 0 ? (
                  <span className="home-request-form__file-list" aria-live="polite">
                    {files.join(" · ")}
                  </span>
                ) : null}
              </label>

              <div className="home-request-form__actions">
                <button type="submit" className="home-request-form__submit">
                  {c.submitLabel}
                </button>
                <label className="home-request-form__consent" htmlFor={privacyId}>
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
                    {c.privacyPrefix} <Link to={pagePath(locale, "privacy")}>{c.privacyLink}</Link>
                    {c.privacySuffix}
                  </span>
                </label>

                {status === "error" ? (
                  <p className="home-request-form__note" role="status" aria-live="polite">
                    {c.errorNote}
                  </p>
                ) : null}

                {status === "success" ? (
                  <p className="home-request-form__note" role="status" aria-live="polite">
                    {c.statusNote}
                  </p>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
