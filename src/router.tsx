import { createBrowserRouter, Navigate, useParams } from "react-router-dom";

import { commonSlugs } from "@/src/content/site";
import { LocaleLayout } from "@/src/layout/LocaleLayout";
import { localePath, normalizeLocale } from "@/src/lib/locale";
import { HomePage } from "@/src/pages/HomePage";
import { PrivacyPage } from "@/src/pages/PrivacyPage";

const basename = import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL.replace(/\/$/, "");

function LocalizedHomeRedirect() {
  const params = useParams();
  const locale = normalizeLocale(params.locale);

  return <Navigate to={localePath(locale)} replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
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
    ],
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
    element: <Navigate to="/" replace />,
  },
], { basename });
