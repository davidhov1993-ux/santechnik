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

export function RuMobileHome() {
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
      setStatusMessage("Оставьте имя, телефон, коротко опишите задачу и подтвердите согласие с Политикой конфиденциальности.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const result = await submitContactRequest({
        locale: "ru",
        source: "ru-canonical-home",
        name: values.name,
        phone: values.phone,
        message: values.message,
        privacyAccepted,
        files,
        metadata: {
          layout: "canonical-ru",
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
    <div className="ru-mobile-home" aria-label="Главная страница сантехника в Ереване">
      <section id="uslugi-mobile" className="ru-mobile-home__section ru-mobile-home__section--turnkey-services">
        <div className="ru-mobile-home__turnkey-heading">
          <h2 className="ru-mobile-home__title">Сантехнические работы под ключ</h2>
        </div>

        <p className="ru-mobile-home__service-intro">
          Сантехнические услуги в Ереване: аварийный сантехник круглосуточно, водопровод, канализация, отопление, замена труб, устранение протечек и засоров, установка бойлеров, сантехники и бытовой техники.
        </p>
        <p className="ru-mobile-home__meta">Квартиры · дома · офисы · магазины · кафе</p>

        <a className="ru-mobile-home__service-phone" href={`tel:${businessPhoneMachine}`}>
          <span>Для бесплатной консультации звоните</span>
          <strong>{businessPhoneDisplay}</strong>
        </a>

        <div className="ru-mobile-home__service-list" aria-label="Основные сантехнические работы">
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
          <h2 className="ru-mobile-home__visit-title">Выезд сантехника без лишних сюрпризов</h2>
        </div>
        <p className="ru-mobile-home__visit-intro">
          Заранее обсуждаем цену, приезжаем с инструментом, выполняем сантехнические работы и проверяем результат.
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
        <p className="ru-mobile-home__eyebrow">Ориентировочные цены</p>
        <dl className="ru-mobile-home__price-list">
          {prices.map(([label, value]) => (
            <div key={label} className="ru-mobile-home__price-row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="ru-mobile-home__discount-note">
          <img className="ru-mobile-home__discount-icon" src="/icons/05.png" alt="" aria-hidden="true" loading="lazy" />
          <strong>Скидка 10%</strong>
          <span>Пенсионерам — на стоимость работы, без материалов.</span>
        </p>
      </section>

      <section className="ru-mobile-home__section ru-mobile-home__section--areas">
        <img className="ru-mobile-home__section-icon" src="/icons/4.png" alt="" aria-hidden="true" loading="lazy" />
        <p className="ru-mobile-home__eyebrow">Районы</p>
        <h2 className="ru-mobile-home__title">Работаем по всему Еревану</h2>
        <p className="ru-mobile-home__text">
          Срочные и плановые сантехнические работы во всех административных районах.
        </p>
        <ul className="ru-mobile-home__districts">
          {districts.map((district) => (
            <li key={district}>{district}</li>
          ))}
        </ul>
      </section>

      <section className="ru-mobile-home__section ru-mobile-home__section--form">
        <h2 className="ru-mobile-home__title">Связаться с сантехником</h2>
        <p className="ru-mobile-home__text">
          Фото, видео, план или документы по объекту можно приложить ниже.
        </p>

        <form className="ru-mobile-home__form" onSubmit={handleSubmit}>
          <label className="ru-mobile-home__field" htmlFor={nameId}>
            <span>Имя</span>
            <input id={nameId} name="name" value={values.name} onChange={handleFieldChange} placeholder="Ваше имя" autoComplete="name" />
          </label>

          <label className="ru-mobile-home__field" htmlFor={phoneId}>
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

          <label className="ru-mobile-home__field" htmlFor={messageId}>
            <span>Сообщение</span>
            <textarea
              id={messageId}
              name="message"
              value={values.message}
              onChange={handleFieldChange}
              placeholder="Что случилось, где находится объект, насколько срочно."
              rows={5}
            />
          </label>

          <label className="ru-mobile-home__upload" htmlFor={filesId}>
            <span className="ru-mobile-home__upload-label">Файлы</span>
            <input
              id={filesId}
              ref={fileInputRef}
              className="ru-mobile-home__file-input"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.heic,.webp,.txt"
              onChange={handleFilesChange}
            />
            <span className="ru-mobile-home__upload-button">Прикрепить</span>
            <span className="ru-mobile-home__upload-hint">Фото или документы · до 3 МБ</span>
            <span className="ru-mobile-home__upload-hint">Видео лучше отправить в WhatsApp.</span>

            {files.length > 0 ? (
              <span className="ru-mobile-home__file-list" aria-live="polite">
                {files.map((file, index) => (
                  <span key={`${file.name}-${file.lastModified}-${index}`} className="ru-mobile-home__file-item">
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
              Согласен с <Link to={pagePath("ru", "privacy")}>Политикой конфиденциальности</Link>.
            </span>
          </label>

          <button className="ru-mobile-home__submit" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Отправляем..." : "Отправить"}
          </button>

          {status !== "idle" ? (
            <p className={`ru-mobile-home__status ru-mobile-home__status--${status}`} role="status" aria-live="polite">
              {status === "submitting" ? "Отправляем..." : statusMessage}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
