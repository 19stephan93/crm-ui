import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./components/common/theme-provider.tsx";
import { RecoilRoot } from "recoil";

import { RouterProvider } from "react-router-dom";
import "@/index.css";

import { Toaster } from "@/components/ui/toaster.tsx";
import { LanguageProvider } from "@/i18n/language-context.tsx";

import { router } from "./routes/routes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
    <RecoilRoot>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster />
      </LanguageProvider>
    </RecoilRoot>
  </ThemeProvider>
  // </React.StrictMode>
);
