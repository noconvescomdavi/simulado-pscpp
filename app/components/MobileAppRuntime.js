"use client";

import { useEffect } from "react";

const APP_HOST = "simulado-pscpp.vercel.app";

function getCapacitor() {
  if (typeof window === "undefined") return null;
  return window.Capacitor || null;
}

function getPlugin(name) {
  return getCapacitor()?.Plugins?.[name] || null;
}

function normalizeAppUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);

    if (url.protocol === "estibordo:") {
      const path = [url.host, url.pathname].filter(Boolean).join("/").replace(/\/+/g, "/");
      return "/" + path + url.search + url.hash;
    }

    if (url.hostname === APP_HOST) {
      return url.pathname + url.search + url.hash;
    }
  } catch {
    return null;
  }

  return null;
}

export default function MobileAppRuntime() {
  useEffect(() => {
    const capacitor = getCapacitor();
    if (!capacitor?.isNativePlatform?.()) return;

    document.documentElement.dataset.estibordoNative = "android";
    document.body.dataset.estibordoNative = "android";

    const App = getPlugin("App");
    const Network = getPlugin("Network");
    const Share = getPlugin("Share");
    const Haptics = getPlugin("Haptics");
    const StatusBar = getPlugin("StatusBar");
    const SplashScreen = getPlugin("SplashScreen");

    const cleanup = [];
    let mounted = true;

    const setOnlineState = (connected) => {
      document.documentElement.dataset.estibordoOnline = connected ? "true" : "false";
      window.dispatchEvent(new CustomEvent("estibordo:network", { detail: { connected } }));
    };

    const openDeepLink = (rawUrl) => {
      const destination = normalizeAppUrl(rawUrl);
      if (!destination) return;
      if (location.pathname + location.search + location.hash !== destination) {
        location.assign(destination);
      }
    };

    const registerListener = async (plugin, event, handler) => {
      if (!plugin?.addListener) return;
      try {
        const handle = await plugin.addListener(event, handler);
        if (handle?.remove) cleanup.push(() => handle.remove());
      } catch {}
    };

    window.EstibordoApp = {
      isNative: true,
      platform: capacitor.getPlatform?.() || "android",
      async share({ title = "ESTIBORDO", text = "", url = location.href } = {}) {
        if (Share?.share) return Share.share({ title, text, url, dialogTitle: "Compartilhar" });
        if (navigator.share) return navigator.share({ title, text, url });
      },
      async haptic(type = "light") {
        if (!Haptics) return;
        const map = { light: "LIGHT", medium: "MEDIUM", heavy: "HEAVY" };
        if (Haptics.impact) return Haptics.impact({ style: map[type] || "LIGHT" });
      },
      async minimize() {
        if (App?.minimizeApp) return App.minimizeApp();
      },
    };

    (async () => {
      try {
        if (StatusBar?.setBackgroundColor) {
          await StatusBar.setBackgroundColor({ color: "#07141f" });
        }
      } catch {}

      try {
        const status = await Network?.getStatus?.();
        if (mounted && status) setOnlineState(Boolean(status.connected));
      } catch {}

      await registerListener(Network, "networkStatusChange", (status) => {
        setOnlineState(Boolean(status?.connected));
      });

      await registerListener(App, "appUrlOpen", ({ url }) => openDeepLink(url));

      await registerListener(App, "backButton", ({ canGoBack }) => {
        if (canGoBack || history.length > 1) {
          history.back();
        } else if (App?.minimizeApp) {
          App.minimizeApp();
        }
      });

      try {
        await SplashScreen?.hide?.({ fadeOutDuration: 250 });
      } catch {}
    })();

    return () => {
      mounted = false;
      cleanup.forEach((remove) => {
        try { remove(); } catch {}
      });
      delete window.EstibordoApp;
      delete document.documentElement.dataset.estibordoNative;
      delete document.documentElement.dataset.estibordoOnline;
      delete document.body.dataset.estibordoNative;
    };
  }, []);

  return null;
}
