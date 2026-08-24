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
    title: "Аварийный сантехник 24/7",
    items: [
      "Протечки и прорывы труб",
      "Засоры канализации",
      "Срочный выезд по Еревану",
    ],
  },
  {
    number: "02",
    icon: "/icons/7.png",
    title: "Водопровод",
    items: [
      "Монтаж и замена труб",
      "Горячая и холодная вода",
      "Смесители, раковины, унитазы",
    ],
  },
  {
    number: "03",
    icon: "/icons/8.png",
    title: "Канализация",
    items: [
      "Прочистка канализации",
      "Перенос сливов",
      "Кухня, ванная, санузел",
    ],
  },
  {
    number: "04",
    icon: "/icons/11.png",
    title: "Отопление",
    items: [
      "Радиаторы и трубы отопления",
      "Котлы, бойлеры, водонагреватели",
      "Стиральные и посудомоечные машины",
    ],
  },
];

const visitFacts = [
  {
    icon: "/icons/3.png",
    title: "Цена заранее",
    body: "Называем стоимость до начала работ. Если нужен осмотр — предупреждаем до выезда.",
  },
  {
    icon: "/icons/1.png",
    title: "Выезд",
    body: "Приезжаем по Еревану на плановые работы и срочные заявки.",
  },
  {
    icon: "/icons/6.png",
    title: "Инструмент с собой",
    body: "Для труб, сифонов, смесителей и бойлеров берём нужные детали и инструмент.",
  },
  {
    icon: "/icons/2.png",
    title: "Проверка результата",
    body: "Проверяем герметичность, слив, напор воды и работу установленной сантехники.",
  },
];

const prices = [
  ["Выезд сантехника по Еревану", "10 000 ֏"],
  ["Мелкий сантехнический ремонт", "10 000 ֏"],
  ["Установка и замена сантехники", "от 5 000 ֏"],
  ["Монтаж душевой кабины", "от 20 000 ֏"],
  ["Разводка воды и канализации", "от 15 000 ֏ за точку"],
  ["Аварийный вызов 24/7", "20 000 ֏"],
];

const districts = [
  "Кентрон",
  "Арабкир",
  "Нор-Норк",
  "Малатия-Себастия",
  "Ачапняк",
  "Шенгавит",
  "Канакер-Зейтун",
  "Эребуни",
  "Норк-Мараш",
  "Аван",
  "Давташен",
  "Нубарашен",
];

function sanitizePhone(value: string) {
  return value.replace(/[^\d+\s()-]/g, "").slice(0, 24);
}

function applyFileLimit(files: FileList | null) {
  return Array.from(files ?? []).slice(0, 8);
}

export function RuDesktopHome() {
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
      setStatusMessage("Оставьте имя, телефон, коротко опишите задачу и подтвердите согласие с Политикой конфиденциальности.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const result = await submitContactRequest({
        locale: "ru",
        source: "ru-desktop-home",
        name: values.name,
        phone: values.phone,
        message: values.message,
        privacyAccepted,
        files,
        metadata: {
          layout: "desktop-ru",
        },
      });

      if (!result.ok) {
        throw new Error(result.message ?? "Request failed");
      }

      setStatus("success");
      setStatusMessage(result.message ?? "Сообщение отправлено. Если вопрос срочный, лучше сразу позвонить.");
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
      setStatusMessage("Сообщение не отправилось. Попробуйте ещё раз или свяжитесь по телефону или WhatsApp.");
    }
  };

  return (
    <div className="ru-desktop-home" aria-label="Русская главная страница сантехника">
      <section id="uslugi-desktop" className="ru-desktop-home__section ru-desktop-home__section--workbench">
        <div className="ru-desktop-home__inner ru-desktop-home__workbench">
          <div className="ru-desktop-home__workbench-intro">
            <h2 className="ru-desktop-home__title">Сантехнические работы под ключ</h2>
          </div>

          <div className="ru-desktop-home__workbench-strip">
            <div className="ru-desktop-home__section-copy">
              <p className="ru-desktop-home__lead">
                Сантехнические услуги в Ереване: аварийный сантехник круглосуточно, водопровод, канализация, отопление, замена труб, устранение протечек и засоров, установка бойлеров, сантехники и бытовой техники.
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
          <p className="ru-desktop-home__meta">Квартиры · дома · офисы · магазины · кафе</p>
          <a className="ru-desktop-home__service-phone" href={`tel:${businessPhoneMachine}`}>
            <span>Для бесплатной консультации звоните</span>
            <strong>{businessPhoneDisplay}</strong>
          </a>
        </div>
      </section>

      <section className="ru-desktop-home__section ru-desktop-home__section--visit">
        <div className="ru-desktop-home__inner ru-desktop-home__visit-inner">
          <div className="ru-desktop-home__section-head">
            <h2 className="ru-desktop-home__title">Работа без лишних сюрпризов</h2>
            <p className="ru-desktop-home__lead">
              Заранее обсуждаем цену, приезжаем с инструментом, выполняем сантехнические работы и проверяем результат.
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
              <p className="ru-desktop-home__eyebrow">Районы</p>
              <h2 className="ru-desktop-home__title">Работаем по всему Еревану</h2>
              <p className="ru-desktop-home__lead">
                Срочные и плановые сантехнические работы во всех административных районах.
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
                alt="Статичная карта Еревана"
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
                <h2 className="ru-desktop-home__title">Ориентировочные цены</h2>
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
            <h2 className="ru-desktop-home__title">Связаться с сантехником</h2>
            <p className="ru-desktop-home__lead">
              Фото, видео, план или документы по объекту можно приложить ниже.
            </p>
          </div>

          <form className="ru-desktop-home__form" onSubmit={handleSubmit}>
            <label className="ru-desktop-home__field" htmlFor={nameId}>
              <span>Имя</span>
              <input id={nameId} name="name" value={values.name} onChange={handleFieldChange} placeholder="Ваше имя" autoComplete="name" />
            </label>

            <label className="ru-desktop-home__field" htmlFor={phoneId}>
              <span>Телефон</span>
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
              <span>Сообщение</span>
              <textarea
                id={messageId}
                name="message"
                value={values.message}
                onChange={handleFieldChange}
                placeholder="Что случилось, где находится объект, насколько срочно."
                rows={4}
              />
            </label>

            <label className="ru-desktop-home__upload" htmlFor={filesId}>
              <span className="ru-desktop-home__upload-label">Файлы</span>
              <input
                id={filesId}
                ref={fileInputRef}
                className="ru-desktop-home__file-input"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.heic,.webp,.txt"
                onChange={handleFilesChange}
              />
              <span className="ru-desktop-home__upload-action">Прикрепить</span>
              <span className="ru-desktop-home__upload-hint">Фото или документы · до 3 МБ</span>
              <span className="ru-desktop-home__upload-hint">Видео лучше отправить в WhatsApp.</span>

              {files.length > 0 ? (
                <span className="ru-desktop-home__file-list" aria-live="polite">
                  {files.map((file, index) => (
                    <span key={`${file.name}-${file.lastModified}-${index}`} className="ru-desktop-home__file-item">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        aria-label={`Удалить файл ${file.name}`}
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
                Согласен с <Link to={pagePath("ru", "privacy")}>Политикой конфиденциальности</Link>.
              </span>
            </label>

            <button className="ru-desktop-home__submit" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Отправляем..." : "Отправить"}
            </button>

            {status !== "idle" ? (
              <p className={`ru-desktop-home__status ru-desktop-home__status--${status}`} role="status" aria-live="polite">
                {status === "submitting" ? "Отправляем..." : statusMessage}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </div>
  );
}
