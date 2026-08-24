import { createBrowserRouter, Navigate, useLocation, useParams } from "react-router-dom";

import { commonSlugs } from "@/src/content/site";
import { LocaleLayout } from "@/src/layout/LocaleLayout";
import { detectPreferredLocale } from "@/src/lib/locale";
import { HomePage } from "@/src/pages/HomePage";
import { PrivacyPage } from "@/src/pages/PrivacyPage";

const basename = import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL.replace(/\/$/, "");

function LocalizedHomeRedirect() {
  const params = useParams();
  const locale = params.locale ?? detectPreferredLocale();

  return <Navigate to={`/${locale}/`} replace />;
}

function PreferredLocaleRedirect() {
  const location = useLocation();
  const locale = detectPreferredLocale();

  return <Navigate to={`/${locale}/${location.search}${location.hash}`} replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PreferredLocaleRedirect />,
  },
  {
    path: "/:locale",
    element: <LocaleLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: commonSlugs.privacy,
        element: <PrivacyPage />,
      },
      {
        path: "*",
        element: <LocalizedHomeRedirect />,
      },
    ],
  },
  {
    path: "*",
    element: <PreferredLocaleRedirect />,
  },
], { basename });
