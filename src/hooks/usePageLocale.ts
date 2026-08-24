import { useParams } from "react-router-dom";

import { normalizeLocale } from "@/src/lib/locale";

export function usePageLocale() {
  const params = useParams();
  return normalizeLocale(params.locale);
}
