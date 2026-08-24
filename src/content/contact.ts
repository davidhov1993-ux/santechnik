const configuredPublicEmail = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim();

export const businessEmail = configuredPublicEmail ?? "";
export const hasBusinessEmail = businessEmail.length > 0;
