"use client";

import { useEffect } from "react";
import { syncOfflineQueue } from "../../lib/offline-store";

const SAFARI_RECOVERY_VERSION = "2026-09-13-1";

function isIosSafariBrowser() {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
  const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const native = Boolean(window.Capacitor?.isNativePlatform?.());
  return isIOS && isSafari && !standalone && !native;
}

export default function PwaRuntime() {
  useEffect(() => {
    let disposed = false;

    (async () => {
      // Safari/iOS deve chegar ao conteúdo sem limpeza/reload síncrono de SW/cache.
      // A antiga recuperação executava getRegistrations + caches.keys e podia
      // recarregar a página antes da hidratação, produzindo uma tela branca longa.
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

      document.documentElement.classList.toggle("pwa-standalone", standalone);

      const allowServiceWorker =
        !isIosSafariBrowser() ||
        standalone ||
        Boolean(window.Capacitor?.isNativePlatform?.());

      if (allowServiceWorker && "serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).then((registration) => {
          registration.update().catch(() => {});
          const warm=()=>registration.active?.postMessage({type:"CACHE_OFFLINE_PAGE",path:"/offline"});
          if(registration.active)warm();
          else navigator.serviceWorker.ready.then(warm).catch(()=>{});
        }).catch(() => {});
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
      // OfflineSyncRuntime é o único dono da sincronização periódica.
      // Evita duas leituras/escritas concorrentes no IndexedDB durante o startup.

      const syncViewportHeight = () => {
        document.documentElement.style.setProperty("--app-height", window.innerHeight + "px");
      };

      syncViewportHeight();
      const syncVisualViewport=()=>{const vv=window.visualViewport;if(!vv)return;document.documentElement.style.setProperty("--visual-viewport-height",vv.height+"px");document.documentElement.style.setProperty("--keyboard-inset",Math.max(0,window.innerHeight-vv.height-vv.offsetTop)+"px")};
      syncVisualViewport();
      window.visualViewport?.addEventListener("resize",syncVisualViewport);
      window.visualViewport?.addEventListener("scroll",syncVisualViewport);
      window.addEventListener("resize", syncViewportHeight);
      window.addEventListener("orientationchange", syncViewportHeight);

      window.__estibordoPwaCleanup = () => {
        window.visualViewport?.removeEventListener("resize",syncVisualViewport);
        window.visualViewport?.removeEventListener("scroll",syncVisualViewport);
        window.removeEventListener("resize", syncViewportHeight);
        window.removeEventListener("orientationchange", syncViewportHeight);
        window.removeEventListener("online", onOnline);
        navigator.serviceWorker?.removeEventListener("message", onServiceWorkerMessage);
      };
    })();

    return () => {
      disposed = true;
      window.__estibordoPwaCleanup?.();
      delete window.__estibordoPwaCleanup;
    };
  }, []);

  return null;
}
