import type { ChangeEvent, FormEvent } from "react";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

import { submitContactRequest } from "@/src/lib/contactForm";
import { pagePath } from "@/src/lib/locale";
import type { Locale } from "@/src/types";

interface LeadFormProps {
  locale: Locale;
  urgent?: boolean;
  defaultServiceSlug?: string;
  variant?: "default" | "dark";
  attachmentsEnabled?: boolean;
}

interface LeadFormState {
  name: string;
  phone: string;
  email: string;
  task: string;
}

type LeadFormErrors = Partial<Record<keyof LeadFormState, string>>;
type LeadFormStatus = "idle" | "error" | "validated" | "submitting";

function createInitialState(): LeadFormState {
  return {
    name: "",
    phone: "",
    email: "",
    task: "",
  };
}

const leadFormCopy = {
  ru: {
    name: "Имя",
    phone: "Телефон",
    email: "Email",
    message: "Сообщение",
    namePlaceholder: "Ваше имя",
    phonePlaceholder: "+374",
    emailPlaceholder: "name@example.com",
    messagePlaceholder: "Коротко опишите задачу, объект и что именно нужно сделать.",
    filesLabel: "Файлы по объекту",
    filesButton: "Прикрепить файлы",
    filesHint: "Фото, схемы, чертежи, сметы, PDF, Word, Excel, PNG, JPG/JPEG.",
    submit: "Отправить заявку",
    hint: "Можно сразу отправить запрос и файлы по задаче.",
    success: "Заявка отправлена. Если вопрос срочный, лучше сразу позвонить.",
    submitting: "Отправляем заявку...",
    sendError: "Заявка не отправилась. Попробуйте ещё раз или свяжитесь с нами по телефону или WhatsApp.",
    fixErrors: "Заполните имя, телефон, email и сообщение, чтобы отправить обращение.",
    privacyPrefix: "Нажимая кнопку, вы соглашаетесь с",
    privacyLink: "Политикой конфиденциальности",
    privacySuffix: ".",
    invalidPrivacy: "Подтвердите согласие с Политикой конфиденциальности.",
    invalidName: "Укажите имя.",
    invalidPhone: "Укажите телефон.",
    invalidEmail: "Укажите корректный email.",
    invalidTask: "Коротко опишите задачу.",
  },
  hy: {
    name: "Անուն",
    phone: "Հեռախոս",
    email: "Email",
    message: "Հաղորդագրություն",
    namePlaceholder: "Ձեր անունը",
    phonePlaceholder: "+374",
    emailPlaceholder: "name@example.com",
    messagePlaceholder: "Կարճ նկարագրեք խնդիրը, օբյեկտը և ինչ պետք է անել։",
    filesLabel: "Օբյեկտի ֆայլեր",
    filesButton: "Կցել ֆայլեր",
    filesHint: "Լուսանկարներ, սխեմաներ, գծագրեր, նախահաշիվ, PDF, Word, Excel, PNG, JPG/JPEG։",
    submit: "Ուղարկել հայտը",
    hint: "Կարելի է անմիջապես ուղարկել հարցումը և առաջադրանքի ֆայլերը։",
    success: "Հայտն ուղարկված է: Եթե հարցը շտապ է, ավելի լավ է անմիջապես զանգահարել:",
    submitting: "Հայտն ուղարկվում է...",
    sendError: "Հայտը չի ուղարկվել։ Կրկնեք փորձը կամ կապ հաստատեք հեռախոսով կամ WhatsApp-ով:",
    fixErrors: "Լրացրեք անունը, հեռախոսը, email-ը և հաղորդագրությունը, որպեսզի դիմումն ուղարկվի։",
    privacyPrefix: "Սեղմելով կոճակը՝ Դուք համաձայնում եք",
    privacyLink: "Գաղտնիության քաղաքականությանը",
    privacySuffix: ":",
    invalidPrivacy: "Հաստատեք համաձայնությունը Գաղտնիության քաղաքականության հետ:",
    invalidName: "Նշեք անունը։",
    invalidPhone: "Նշեք հեռախոսահամարը։",
    invalidEmail: "Նշեք ճիշտ email։",
    invalidTask: "Կարճ նկարագրեք խնդիրը։",
  },
} as const;

function hasValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value.trim());
}

function validateForm(locale: Locale, values: LeadFormState): LeadFormErrors {
  const errors: LeadFormErrors = {};
  const phoneDigits = values.phone.replace(/\D/g, "");
  const copy = leadFormCopy[locale];

  if (values.name.trim().length < 2) {
    errors.name = copy.invalidName;
  }

  if (phoneDigits.length < 7) {
    errors.phone = copy.invalidPhone;
  }

  if (!hasValidEmail(values.email)) {
    errors.email = copy.invalidEmail;
  }

  if (values.task.trim().length < 10) {
    errors.task = copy.invalidTask;
  }

  return errors;
}

function sanitizePhoneInput(value: string) {
  return value.replace(/[^\d+\s()-]/g, "").slice(0, 24);
}

export function LeadForm({
  locale,
  urgent: _urgent = false,
  defaultServiceSlug: _defaultServiceSlug,
  variant = "default",
  attachmentsEnabled = false,
}: LeadFormProps) {
  const formId = useId();
  const privacyInputId = `${formId}-privacy`;
  const copy = leadFormCopy[locale];
  const [values, setValues] = useState<LeadFormState>(() => createInitialState());
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState("");

  const note =
    status === "validated"
      ? copy.success
      : status === "submitting"
        ? copy.submitting
        : status === "error"
          ? statusMessage || copy.fixErrors
          : copy.hint;

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const field = event.target.name as keyof LeadFormState;
    const value = field === "phone" ? sanitizePhoneInput(event.target.value) : event.target.value;

    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors[field];
        return nextErrors;
      });
    }

    if (status !== "idle") {
      setStatus("idle");
    }

    if (statusMessage) {
      setStatusMessage("");
    }

    if (privacyError) {
      setPrivacyError("");
    }
  };

  const handleAttachmentsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 8);
    setAttachmentFiles(files);
    setAttachmentNames(files.map((file) => file.name));

    if (status !== "idle") {
      setStatus("idle");
    }

    if (statusMessage) {
      setStatusMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(locale, values);
    setErrors(nextErrors);
    const hasPrivacyError = !privacyAccepted;
    setPrivacyError(hasPrivacyError ? copy.invalidPrivacy : "");

    if (Object.keys(nextErrors).length > 0 || hasPrivacyError) {
      setStatus("error");
      setStatusMessage(copy.fixErrors);
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const result = await submitContactRequest({
        locale,
        source: "lead-form",
        name: values.name,
        phone: values.phone,
        email: values.email,
        message: values.task,
        privacyAccepted,
        files: attachmentsEnabled ? attachmentFiles : [],
      });

      if (!result.ok) {
        setStatus("error");
        setStatusMessage(result.message || copy.sendError);
        return;
      }

      setValues(createInitialState());
      setAttachmentFiles([]);
      setAttachmentNames([]);
      setPrivacyAccepted(false);
      setPrivacyError("");
      setStatus("validated");
      setStatusMessage(result.message || copy.success);
    } catch {
      setStatus("error");
      setStatusMessage(copy.sendError);
    }
  };

  const fieldClassName = (field: keyof LeadFormState) => (errors[field] ? "is-invalid" : undefined);
  const fieldErrorId = (field: keyof LeadFormState) => `${formId}-${field}-error`;
  const fieldInputId = (field: keyof LeadFormState) => `${formId}-${field}`;
  const fieldDescribedBy = (field: keyof LeadFormState) => (errors[field] ? fieldErrorId(field) : undefined);
  const attachmentInputId = `${formId}-attachments`;

  return (
    <form className={`lead-form ${variant === "dark" ? "lead-form--dark" : ""}`.trim()} onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          <span>{copy.name}</span>
          <input
            id={fieldInputId("name")}
            type="text"
            name="name"
            value={values.name}
            onChange={handleFieldChange}
            placeholder={copy.namePlaceholder}
            className={fieldClassName("name")}
            autoComplete="name"
            minLength={2}
            required
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={fieldDescribedBy("name")}
          />
          {errors.name ? (
            <span id={fieldErrorId("name")} className="form-error">
              {errors.name}
            </span>
          ) : null}
        </label>
        <label>
          <span>{copy.phone}</span>
          <input
            id={fieldInputId("phone")}
            type="tel"
            name="phone"
            value={values.phone}
            onChange={handleFieldChange}
            placeholder={copy.phonePlaceholder}
            className={fieldClassName("phone")}
            inputMode="tel"
            autoComplete="tel"
            maxLength={24}
            required
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={fieldDescribedBy("phone")}
          />
          {errors.phone ? (
            <span id={fieldErrorId("phone")} className="form-error">
              {errors.phone}
            </span>
          ) : null}
        </label>
        <label>
          <span>{copy.email}</span>
          <input
            id={fieldInputId("email")}
            type="email"
            name="email"
            value={values.email}
            onChange={handleFieldChange}
            placeholder={copy.emailPlaceholder}
            className={fieldClassName("email")}
            autoComplete="email"
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={fieldDescribedBy("email")}
          />
          {errors.email ? (
            <span id={fieldErrorId("email")} className="form-error">
              {errors.email}
            </span>
          ) : null}
        </label>
        <label className="form-grid__wide">
          <span>{copy.message}</span>
          <textarea
            id={fieldInputId("task")}
            name="task"
            value={values.task}
            onChange={handleFieldChange}
            rows={5}
            className={fieldClassName("task")}
            minLength={10}
            maxLength={1000}
            required
            aria-invalid={errors.task ? true : undefined}
            aria-describedby={fieldDescribedBy("task")}
            placeholder={
              copy.messagePlaceholder
            }
          />
          {errors.task ? (
            <span id={fieldErrorId("task")} className="form-error">
              {errors.task}
            </span>
          ) : null}
        </label>
        {attachmentsEnabled ? (
          <label className="form-grid__wide form-upload" htmlFor={attachmentInputId}>
            <span>{copy.filesLabel}</span>
            <input
              id={attachmentInputId}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              className="form-upload__input"
              onChange={handleAttachmentsChange}
            />
            <span className="form-upload__control">
              <span className="form-upload__button">{copy.filesButton}</span>
              <span className="form-upload__hint">{copy.filesHint}</span>
            </span>
            {attachmentNames.length > 0 ? (
              <span className="form-upload__list" aria-live="polite">
                {attachmentNames.join(" · ")}
              </span>
            ) : null}
          </label>
        ) : null}
      </div>

      <div className="form-actions">
        <button type="submit" className="button button--primary" disabled={status === "submitting"}>
          {status === "submitting" ? copy.submitting : copy.submit}
        </button>
        <label className="form-consent" htmlFor={privacyInputId}>
          <input
            id={privacyInputId}
            type="checkbox"
            checked={privacyAccepted}
            onChange={(event) => {
              setPrivacyAccepted(event.target.checked);
              setPrivacyError("");
              if (status !== "idle") setStatus("idle");
            }}
            required
          />
          <span>
            {copy.privacyPrefix} <Link to={pagePath(locale, "privacy")}>{copy.privacyLink}</Link>
            {copy.privacySuffix}
          </span>
        </label>
        {privacyError ? (
          <span className="form-error" role="alert">
            {privacyError}
          </span>
        ) : null}
        <p
          className={`form-note ${status === "validated" ? "form-note--success" : status === "error" ? "form-note--error" : ""}`.trim()}
          role="status"
          aria-live="polite"
        >
          {note}
        </p>
      </div>
    </form>
  );
}
