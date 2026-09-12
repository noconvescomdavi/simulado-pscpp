"use client";

import { useEffect } from "react";

export default function PwaRuntime() {
  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    document.documentElement.classList.toggle("pwa-standalone", standalone);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).then((registration) => {
        // Verifica silenciosamente se existe uma versão mais nova do SW.
        registration.update().catch(() => {});
      }).catch(() => {
        // O PWA continua funcional mesmo se o registro falhar.
      });
    }

    const syncViewportHeight = () => {
      document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
    };

    syncViewportHeight();
    window.addEventListener("resize", syncViewportHeight);
    window.addEventListener("orientationchange", syncViewportHeight);

    return () => {
      window.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("orientationchange", syncViewportHeight);
    };
  }, []);

  return null;
}
