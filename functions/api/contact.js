import { connect } from "cloudflare:sockets";

const MAX_FILES = 8;
const MAX_TOTAL_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_FIELD_LENGTH = 160;
const DEFAULT_SMTP_EHLO_DOMAIN = "santechnik-yerevan.am";
const GMAIL_SMTP_HOST = "smtp.gmail.com";
const GMAIL_SMTP_PORT = 587;

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "text/plain",
]);

const allowedExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png", ".webp", ".heic", ".txt"];

const copy = {
  ru: {
    invalidMethod: "Метод не поддерживается.",
    invalidOrigin: "Недопустимый источник запроса.",
    invalidForm: "Не удалось обработать форму.",
    invalidRequired: "Заполните имя, телефон, сообщение и подтвердите согласие с Политикой конфиденциальности.",
    invalidEmail: "Проверьте email или оставьте это поле пустым.",
    invalidFiles: "Файлы не прошли проверку. Оставьте документы и фото, а видео лучше отправьте в WhatsApp.",
    tooManyFiles: "Слишком много файлов. Оставьте не больше 8 вложений.",
    filesTooLarge: "Файлы слишком тяжёлые. Общий размер вложений должен быть до 3 МБ.",
    serverError: "Заявка не отправилась. Попробуйте ещё раз или свяжитесь с нами по телефону или WhatsApp.",
    success: "Заявка отправлена. Если вопрос срочный, лучше сразу позвонить.",
    subject: "Новая заявка с сайта",
    heading: "Новая заявка с сайта",
  },
  hy: {
    invalidMethod: "Մեթոդը չի աջակցվում։",
    invalidOrigin: "Հարցման աղբյուրը թույլատրելի չէ։",
    invalidForm: "Չհաջողվեց մշակել հայտը։",
    invalidRequired: "Լրացրեք անունը, հեռախոսահամարը, հաղորդագրությունը և հաստատեք համաձայնությունը Գաղտնիության քաղաքականության հետ:",
    invalidEmail: "Ստուգեք էլ. փոստի հասցեն կամ թողեք այս դաշտը դատարկ:",
    invalidFiles: "Ֆայլերը չեն անցել ստուգումը։ Փաստաթղթերն ու լուսանկարները թողեք, իսկ տեսանյութը լավ է ուղարկել WhatsApp-ով:",
    tooManyFiles: "Չափազանց շատ ֆայլեր են կցված։ Թողեք առավելագույնը 8 կցորդ։",
    filesTooLarge: "Ֆայլերը չափազանց մեծ են։ Կցորդների ընդհանուր ծավալը պետք է լինի մինչև 3 ՄԲ։",
    serverError: "Հայտը չի ուղարկվել։ Կրկնեք փորձը կամ կապ հաստատեք հեռախոսով կամ WhatsApp-ով:",
    success: "Հայտն ուղարկված է: Եթե հարցը շտապ է, ավելի լավ է անմիջապես զանգահարել:",
    subject: "Կայքից նոր հայտ",
    heading: "Կայքից նոր հայտ",
  },
};

export async function onRequestPost(context) {
  const { request, env } = context;
  let locale = getLocaleFromRequest(request);
  let strings = copy[locale];

  if (!isAllowedOrigin(request)) {
    return json({ ok: false, message: strings.invalidOrigin }, 403);
  }

  let formData;

  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, message: strings.invalidForm }, 400);
  }

  if (normalizeString(formData.get("website"))) {
    return json({ ok: true, message: strings.success }, 200);
  }

  const values = {
    locale: normalizeString(formData.get("locale")) === "hy" ? "hy" : "ru",
    source: normalizeString(formData.get("source")) || "site-form",
    name: normalizeString(formData.get("name")),
    phone: normalizeString(formData.get("phone")),
    email: normalizeString(formData.get("email")),
    message: normalizeString(formData.get("message")),
    privacyAccepted: normalizeString(formData.get("privacyAccepted")) === "1",
    socialDiscountRequested: normalizeString(formData.get("socialDiscountRequested")) === "1",
  };

  locale = values.locale;
  strings = copy[locale];

  if (!isValidSubmission(values)) {
    return json({ ok: false, message: strings.invalidRequired }, 400);
  }

  if (values.email && !hasValidEmail(values.email)) {
    return json({ ok: false, message: strings.invalidEmail }, 400);
  }

  const files = formData.getAll("files").filter((entry) => entry instanceof File && entry.size > 0);

  if (files.length > MAX_FILES) {
    return json({ ok: false, message: strings.tooManyFiles }, 400);
  }

  const attachmentsResult = await buildAttachments(files);
  if (!attachmentsResult.ok) {
    return json({ ok: false, message: attachmentsResult.reason === "size" ? strings.filesTooLarge : strings.invalidFiles }, 400);
  }

  const smtpUser = normalizeString(env.GMAIL_SMTP_USER);
  const smtpPassword = normalizeAppPassword(env.GMAIL_APP_PASSWORD);
  const notificationTo = normalizeString(env.CONTACT_NOTIFICATION_TO) || smtpUser;
  const smtpEhloDomain = normalizeString(env.SMTP_EHLO_DOMAIN) || DEFAULT_SMTP_EHLO_DOMAIN;
  const missingEnv = getMissingEnv({
    GMAIL_SMTP_USER: smtpUser,
    GMAIL_APP_PASSWORD: smtpPassword,
  });

  if (missingEnv.length > 0) {
    console.error("Contact form Gmail SMTP configuration is incomplete.", { missingEnv });
    return json({ ok: false, message: strings.serverError }, 500);
  }

  const smtpConfig = {
    host: GMAIL_SMTP_HOST,
    port: GMAIL_SMTP_PORT,
    user: smtpUser,
    password: smtpPassword,
    ehloDomain: smtpEhloDomain,
  };

  const requestUrl = new URL(request.url);
  const submittedAt = new Date().toISOString();
  const subjectBase = getSubjectBase(locale, values.source, strings);
  const heading = getHeading(locale, values.source, strings);
  const subject = `${subjectBase}: ${values.name}`;
  const summary = locale === "ru"
    ? [
        ["Источник", values.source],
        ["Язык", locale],
        ["Имя", values.name],
        ["Телефон", values.phone],
        ["Email", values.email || "—"],
        ["Скидка 10%", values.socialDiscountRequested ? "Да" : "Нет"],
        ["Дата", submittedAt],
        ["URL", requestUrl.origin],
        ["IP", normalizeString(request.headers.get("cf-connecting-ip")) || "—"],
        ["User-Agent", normalizeString(request.headers.get("user-agent")) || "—"],
      ]
    : [
        ["Աղբյուր", values.source],
        ["Լեզու", locale],
        ["Անուն", values.name],
        ["Հեռախոս", values.phone],
        ["Email", values.email || "—"],
        ["10% զեղչ", values.socialDiscountRequested ? "Այո" : "Ոչ"],
        ["Ամսաթիվ", submittedAt],
        ["URL", requestUrl.origin],
        ["IP", normalizeString(request.headers.get("cf-connecting-ip")) || "—"],
        ["User-Agent", normalizeString(request.headers.get("user-agent")) || "—"],
      ];

  const htmlRows = summary
    .map(([label, value]) => `<tr><td style="padding:6px 10px;font-weight:600;border:1px solid #d9d9d9;">${escapeHtml(label)}</td><td style="padding:6px 10px;border:1px solid #d9d9d9;">${escapeHtml(value)}</td></tr>`)
    .join("");

  const textRows = summary.map(([label, value]) => `${label}: ${value}`).join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5;">
      <h1 style="margin:0 0 16px;font-size:20px;">${escapeHtml(heading)}</h1>
      <table style="border-collapse:collapse;width:100%;margin:0 0 20px;">${htmlRows}</table>
      <h2 style="margin:0 0 10px;font-size:16px;">${locale === "ru" ? "Сообщение" : "Հաղորդագրություն"}</h2>
      <div style="padding:12px 14px;border:1px solid #d9d9d9;background:#fafafa;white-space:pre-wrap;">${escapeHtml(values.message)}</div>
    </div>
  `;

  const text = `${heading}\n\n${textRows}\n\n${locale === "ru" ? "Сообщение" : "Հաղորդագրություն"}:\n${values.message}`;

  const notificationMessage = {
    to: notificationTo,
    fromName: locale === "ru" ? "Сантехник" : "Սանտեխնիկ",
    replyTo: values.email || undefined,
    subject,
    html,
    text,
    attachments: attachmentsResult.attachments,
  };

  const notificationResult = await sendSmtpEmail({
    smtpConfig,
    message: notificationMessage,
    purpose: "company-notification",
  });

  if (!notificationResult.ok) {
    return json({ ok: false, message: strings.serverError }, 502);
  }

  if (values.email) {
    const confirmationResult = await sendSmtpEmail({
      smtpConfig,
      message: createConfirmationMessage({
        locale,
        values,
        notificationTo,
      }),
      purpose: "applicant-confirmation",
    });

    if (!confirmationResult.ok) {
      console.error("Applicant confirmation failed after company notification.");
    }
  }

  return json({ ok: true, message: strings.success }, 200);
}

export async function onRequestOptions(context) {
  if (!isAllowedOrigin(context.request)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders(context.request),
  });
}

function getLocaleFromRequest(request) {
  const url = new URL(request.url);
  const locale = normalizeString(url.searchParams.get("locale"));
  return locale === "hy" ? "hy" : "ru";
}

function getSubjectBase(locale, source, strings) {
  if (source === "partner-application") {
    return locale === "ru" ? "Заявка на сотрудничество" : "Գործակցության հայտ";
  }

  return strings.subject;
}

function getHeading(locale, source, strings) {
  if (source === "partner-application") {
    return locale === "ru" ? "Заявка на сотрудничество" : "Գործակցության հայտ";
  }

  return strings.heading;
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeAppPassword(value) {
  return normalizeString(value).replace(/\s+/g, "");
}

function getMissingEnv(values) {
  return Object.entries(values)
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

function hasValidEmail(value) {
  return /\S+@\S+\.\S+/.test(value.trim());
}

function isValidSubmission(values) {
  const phoneDigits = values.phone.replace(/\D/g, "");

  return (
    values.name.length >= 2 &&
    values.name.length <= MAX_FIELD_LENGTH &&
    phoneDigits.length >= 7 &&
    values.message.length >= 8 &&
    values.message.length <= MAX_MESSAGE_LENGTH &&
    values.privacyAccepted
  );
}

function isAllowedOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function buildAttachments(files) {
  if (files.length === 0) {
    return { ok: true, attachments: [] };
  }

  let totalBytes = 0;
  const attachments = [];

  for (const file of files) {
    totalBytes += file.size;

    if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
      return { ok: false, reason: "size" };
    }

    if (!isAllowedFile(file)) {
      return { ok: false, reason: "type" };
    }

    const buffer = await file.arrayBuffer();
    attachments.push({
      filename: file.name,
      type: file.type || "application/octet-stream",
      content: arrayBufferToBase64(buffer),
      disposition: "attachment",
    });
  }

  return { ok: true, attachments };
}

function isAllowedFile(file) {
  const fileName = file.name.toLowerCase();
  const hasAllowedExtension = allowedExtensions.some((extension) => fileName.endsWith(extension));

  if (!hasAllowedExtension) {
    return false;
  }

  if (!file.type) {
    return true;
  }

  return allowedMimeTypes.has(file.type);
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

async function sendSmtpEmail({ smtpConfig, message, purpose }) {
  let session = null;

  try {
    const recipients = normalizeEmailList(message.to);

    if (recipients.length === 0) {
      throw new Error("No valid SMTP recipients.");
    }

    session = await createSmtpSession(smtpConfig);
    const rawMessage = buildMimeMessage({
      fromAddress: smtpConfig.user,
      fromName: message.fromName || "Santekhnic Yerevan",
      to: recipients,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
      attachments: message.attachments ?? [],
    });

    await session.command(`MAIL FROM:<${smtpConfig.user}>`, [250]);

    for (const recipient of recipients) {
      await session.command(`RCPT TO:<${recipient}>`, [250, 251]);
    }

    await session.command("DATA", [354]);
    await session.writeData(`${dotStuff(rawMessage)}\r\n.\r\n`);
    await session.readResponse([250]);
    await session.command("QUIT", [221], { tolerateFailure: true });
    await session.close();

    console.log("SMTP email sent.", {
      purpose,
      recipients: recipients.length,
      attachments: Array.isArray(message.attachments) ? message.attachments.length : 0,
    });

    return { ok: true };
  } catch (error) {
    console.error("SMTP email failed.", {
      purpose,
      message: sanitizeErrorMessage(error),
    });

    if (session) {
      await session.close().catch(() => undefined);
    }

    return { ok: false };
  }
}

async function createSmtpSession(config) {
  const useImplicitTls = config.port === 465;
  const ehloDomain = normalizeString(config.ehloDomain) || DEFAULT_SMTP_EHLO_DOMAIN;
  let socket = connect(
    { hostname: config.host, port: config.port },
    {
      secureTransport: useImplicitTls ? "on" : "starttls",
      allowHalfOpen: true,
    },
  );

  await socket.opened;
  let io = createSmtpIo(socket);

  await io.readResponse([220]);
  await io.command(`EHLO ${ehloDomain}`, [250]);

  if (!useImplicitTls) {
    await io.command("STARTTLS", [220]);
    io.release();
    socket = socket.startTls();
    await socket.opened;
    io = createSmtpIo(socket);
    await io.command(`EHLO ${ehloDomain}`, [250]);
  }

  try {
    await io.command(`AUTH PLAIN ${base64EncodeUtf8(`\u0000${config.user}\u0000${config.password}`)}`, [235]);
  } catch (error) {
    console.warn("SMTP AUTH PLAIN failed; retrying with AUTH LOGIN.", {
      message: sanitizeErrorMessage(error),
    });

    await io.command("AUTH LOGIN", [334]);
    await io.writeData(`${base64EncodeUtf8(config.user)}\r\n`);
    await io.readResponse([334]);
    await io.writeData(`${base64EncodeUtf8(config.password)}\r\n`);
    await io.readResponse([235]);
  }

  return io;
}

function createSmtpIo(socket) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = socket.readable.getReader();
  const writer = socket.writable.getWriter();
  let buffer = "";

  async function readLine() {
    while (!buffer.includes("\n")) {
      const { value, done } = await reader.read();

      if (done) {
        throw new Error("SMTP connection closed before response.");
      }

      buffer += decoder.decode(value, { stream: true });
    }

    const lineEnd = buffer.indexOf("\n");
    const line = buffer.slice(0, lineEnd).replace(/\r$/, "");
    buffer = buffer.slice(lineEnd + 1);
    return line;
  }

  async function readResponse(expectedCodes) {
    const lines = [];
    let code = null;

    while (true) {
      const line = await readLine();
      lines.push(line);

      const match = line.match(/^(\d{3})([\s-])(.*)$/);

      if (!match) {
        continue;
      }

      code = Number(match[1]);

      if (match[2] === " ") {
        break;
      }
    }

    if (!expectedCodes.includes(code)) {
      throw new Error(`SMTP ${code ?? "unknown"}: ${lines.join(" | ")}`);
    }

    return { code, lines };
  }

  async function writeData(data) {
    await writer.write(encoder.encode(data));
  }

  async function command(value, expectedCodes, options = {}) {
    await writeData(`${value}\r\n`);

    try {
      return await readResponse(expectedCodes);
    } catch (error) {
      if (options.tolerateFailure) {
        return null;
      }

      throw error;
    }
  }

  function release() {
    try {
      writer.releaseLock();
    } catch {
      // The lock can already be released after STARTTLS or a failed close.
    }

    try {
      reader.releaseLock();
    } catch {
      // The lock can already be released after STARTTLS or a failed close.
    }
  }

  async function close() {
    release();
    await socket.close().catch(() => undefined);
  }

  return {
    command,
    readResponse,
    writeData,
    release,
    close,
  };
}

function buildMimeMessage({ fromAddress, fromName, to, replyTo, subject, text, html, attachments }) {
  const mixedBoundary = createMimeBoundary("mixed");
  const alternativeBoundary = createMimeBoundary("alt");
  const headers = [
    `From: ${formatEmailAddress(fromAddress, fromName)}`,
    `To: ${to.map((recipient) => formatEmailAddress(recipient)).join(", ")}`,
    replyTo && hasValidEmail(replyTo) ? `Reply-To: ${formatEmailAddress(replyTo)}` : "",
    `Subject: ${encodeMimeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${createMessageId(fromAddress)}>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`,
  ].filter(Boolean);

  const parts = [
    headers.join("\r\n"),
    "",
    `--${mixedBoundary}`,
    `Content-Type: multipart/alternative; boundary="${alternativeBoundary}"`,
    "",
    `--${alternativeBoundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(base64EncodeUtf8(text)),
    `--${alternativeBoundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(base64EncodeUtf8(html)),
    `--${alternativeBoundary}--`,
  ];

  for (const attachment of attachments) {
    const filename = sanitizeFilename(attachment.filename);
    const encodedFilename = encodeURIComponent(attachment.filename || "attachment");

    parts.push(
      `--${mixedBoundary}`,
      `Content-Type: ${sanitizeHeaderValue(attachment.type || "application/octet-stream")}; name="${filename}"`,
      `Content-Disposition: attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
      "Content-Transfer-Encoding: base64",
      "",
      wrapBase64(attachment.content),
    );
  }

  parts.push(`--${mixedBoundary}--`, "");

  return parts.join("\r\n");
}

function createConfirmationMessage({ locale, values, notificationTo }) {
  const isPartnerApplication = values.source === "partner-application";
  const subject = locale === "ru"
    ? isPartnerApplication
      ? "Мы получили заявку на сотрудничество | Сантехник"
      : "Мы получили вашу заявку | Сантехник"
    : isPartnerApplication
      ? "Ստացել ենք գործակցության հայտը | Սանտեխնիկ"
      : "Ստացել ենք ձեր հայտը | Սանտեխնիկ";

  const title = locale === "ru"
    ? isPartnerApplication
      ? "Заявка на сотрудничество получена"
      : "Заявка получена"
    : isPartnerApplication
      ? "Գործակցության հայտը ստացվել է"
      : "Հայտը ստացվել է";

  const body = locale === "ru"
    ? isPartnerApplication
      ? "Спасибо. Мы получили вашу заявку на сотрудничество. Если ваш опыт соответствует текущим задачам, мы свяжемся с вами по указанному номеру."
      : "Спасибо. Мы получили вашу заявку. Если вопрос срочный, лучше сразу позвонить по номеру, указанному на сайте."
    : isPartnerApplication
      ? "Շնորհակալություն։ Մենք ստացել ենք ձեր գործակցության հայտը։ Եթե ձեր փորձը համապատասխանի ընթացիկ խնդիրներին, կկապվենք նշված հեռախոսահամարով։"
      : "Շնորհակալություն։ Մենք ստացել ենք ձեր հայտը։ Եթե հարցը շտապ է, ավելի լավ է անմիջապես զանգահարել կայքում նշված համարով։";

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5;">
      <h1 style="margin:0 0 16px;font-size:20px;">${escapeHtml(title)}</h1>
      <p style="margin:0 0 12px;">${escapeHtml(locale === "ru" ? `Здравствуйте, ${values.name}.` : `Բարեւ, ${values.name}։`)}</p>
      <p style="margin:0;">${escapeHtml(body)}</p>
    </div>
  `;

  const text = `${title}\n\n${locale === "ru" ? `Здравствуйте, ${values.name}.` : `Բարեւ, ${values.name}։`}\n\n${body}`;

  return {
    to: values.email,
    fromName: locale === "ru" ? "Сантехник" : "Սանտեխնիկ",
    replyTo: notificationTo,
    subject,
    html,
    text,
  };
}

function normalizeEmailList(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeString).filter(hasValidEmail);
  }

  return normalizeString(value)
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(hasValidEmail);
}

function createMimeBoundary(prefix) {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "")}`;
}

function createMessageId(fromAddress) {
  const domain = fromAddress.includes("@") ? fromAddress.split("@").pop() : DEFAULT_SMTP_EHLO_DOMAIN;
  return `${Date.now()}.${crypto.randomUUID()}@${domain}`;
}

function formatEmailAddress(address, name = "") {
  const cleanAddress = sanitizeHeaderValue(address);

  if (!name) {
    return `<${cleanAddress}>`;
  }

  return `${encodeMimeHeader(name)} <${cleanAddress}>`;
}

function encodeMimeHeader(value) {
  const cleanValue = sanitizeHeaderValue(value);

  if (/^[\x20-\x7E]*$/.test(cleanValue)) {
    return cleanValue;
  }

  return `=?UTF-8?B?${base64EncodeUtf8(cleanValue)}?=`;
}

function sanitizeHeaderValue(value) {
  return normalizeString(value).replace(/[\r\n]+/g, " ").trim();
}

function sanitizeFilename(value) {
  const fallback = normalizeString(value) || "attachment";
  return fallback
    .replace(/[\r\n"\\]+/g, "_")
    .replace(/[^\x20-\x7E]/g, "_")
    .slice(0, 140);
}

function base64EncodeUtf8(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function wrapBase64(value) {
  return value.match(/.{1,76}/g)?.join("\r\n") ?? "";
}

function dotStuff(message) {
  return message
    .replace(/\r?\n/g, "\r\n")
    .split("\r\n")
    .map((line) => (line.startsWith(".") ? `.${line}` : line))
    .join("\r\n");
}

function sanitizeErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.slice(0, 400);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function corsHeaders(request) {
  const origin = request.headers.get("origin");
  const requestOrigin = origin && isAllowedOrigin(request) ? origin : new URL(request.url).origin;

  return {
    "Access-Control-Allow-Origin": requestOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    Vary: "Origin",
    "Cache-Control": "no-store",
  };
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}
