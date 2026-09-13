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

async function recoverSafariServiceWorker() {
  if (!isIosSafariBrowser() || !("serviceWorker" in navigator)) return false;

  const key = "estibordo:safari-sw-recovery";
  const alreadyRecovered = sessionStorage.getItem(key) === SAFARI_RECOVERY_VERSION;
  const registrations = await navigator.serviceWorker.getRegistrations().catch(() => []);
  const controlled = Boolean(navigator.serviceWorker.controller);

  if (!registrations.length && !controlled) return false;

  await Promise.all(registrations.map((registration) => registration.unregister().catch(() => false)));

  if ("caches" in window) {
    const names = await caches.keys().catch(() => []);
    await Promise.all(
      names
        .filter((name) =>
          name.startsWith("estibordo-shell-") ||
          name.startsWith("estibordo-pages-")
        )
        .map((name) => caches.delete(name).catch(() => false))
    );
  }

  if (controlled && !alreadyRecovered) {
    sessionStorage.setItem(key, SAFARI_RECOVERY_VERSION);
    const url = new URL(window.location.href);
    url.searchParams.set("_safari_recover", SAFARI_RECOVERY_VERSION);
    window.location.replace(url.toString());
    return true;
  }

  return false;
}

export default function PwaRuntime() {
  useEffect(() => {
    let disposed = false;

    (async () => {
      try {
        const reloading = await recoverSafariServiceWorker();
        if (reloading || disposed) return;
      } catch {}

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
      requestSync();

      const syncViewportHeight = () => {
        document.documentElement.style.setProperty("--app-height", window.innerHeight + "px");
      };

      syncViewportHeight();
      window.addEventListener("resize", syncViewportHeight);
      window.addEventListener("orientationchange", syncViewportHeight);

      window.__estibordoPwaCleanup = () => {
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
