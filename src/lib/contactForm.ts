import type { Locale } from "@/src/types";

interface ContactRequestPayload {
  locale: Locale;
  source: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  privacyAccepted: boolean;
  socialDiscountRequested?: boolean;
  files?: File[];
  metadata?: Record<string, string>;
}

interface ContactRequestResult {
  ok: boolean;
  message?: string;
}

export async function submitContactRequest(payload: ContactRequestPayload): Promise<ContactRequestResult> {
  const formData = new FormData();

  formData.set("locale", payload.locale);
  formData.set("source", payload.source);
  formData.set("name", payload.name.trim());
  formData.set("phone", payload.phone.trim());
  formData.set("email", payload.email?.trim() ?? "");
  formData.set("message", payload.message.trim());
  formData.set("privacyAccepted", payload.privacyAccepted ? "1" : "0");
  formData.set("socialDiscountRequested", payload.socialDiscountRequested ? "1" : "0");
  formData.set("website", "");

  for (const [key, value] of Object.entries(payload.metadata ?? {})) {
    formData.set(key, value);
  }

  for (const file of payload.files ?? []) {
    formData.append("files", file);
  }

  const response = await fetch("/api/contact", {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  let data: { ok?: boolean; message?: string } | null = null;

  try {
    data = (await response.json()) as { ok?: boolean; message?: string };
  } catch {
    data = null;
  }

  if (!response.ok || !data?.ok) {
    return {
      ok: false,
      message: data?.message,
    };
  }

  return {
    ok: true,
    message: data.message,
  };
}
