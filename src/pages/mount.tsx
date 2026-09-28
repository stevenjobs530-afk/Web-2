import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import "../legacy/globals.css";
import "../legacy/responsive-readability.css";

type Language = "en" | "zh";

/** Mounts a case-study page, honouring ?lang= the same way the main page does. */
export function mountPage(Page: ComponentType<{ initialLanguage: Language }>) {
  const initialLanguage: Language = new URLSearchParams(location.search).get("lang") === "zh" ? "zh" : "en";
  document.documentElement.lang = initialLanguage === "zh" ? "zh-CN" : "en";

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Page initialLanguage={initialLanguage} />
    </StrictMode>,
  );
}
