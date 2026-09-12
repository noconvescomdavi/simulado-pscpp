"use client";

import { useEffect } from "react";
import { syncOfflineQueue } from "../../lib/offline-store";

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
        const warm=()=>registration.active?.postMessage({type:"CACHE_OFFLINE_PAGE",path:"/offline"});
        if(registration.active)warm();
        else navigator.serviceWorker.ready.then(warm).catch(()=>{});
      }).catch(() => {
        // O PWA continua funcional mesmo se o registro falhar.
      });
    }

    let syncing = false;
    const requestSync = async () => {
      if (syncing || !navigator.onLine) return;
      syncing = true;
      try { await syncOfflineQueue(); } catch {}
      finally { syncing = false; }
    };

    const onOnline = () => requestSync();
    const onServiceWorkerMessage = (event) => {
      if (event.data?.type === "ESTIBORDO_SYNC_REQUEST") requestSync();
    };

    window.addEventListener("online", onOnline);
    navigator.serviceWorker?.addEventListener("message", onServiceWorkerMessage);
    requestSync();

    const syncViewportHeight = () => {
      document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
    };

    syncViewportHeight();
    window.addEventListener("resize", syncViewportHeight);
    window.addEventListener("orientationchange", syncViewportHeight);

    return () => {
      window.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("orientationchange", syncViewportHeight);
      window.removeEventListener("online", onOnline);
      navigator.serviceWorker?.removeEventListener("message", onServiceWorkerMessage);
    };
  }, []);

  return null;
}
