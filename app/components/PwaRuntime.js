"use client";

import { useEffect } from "react";

// Offline mode was retired. This lightweight migration removes legacy service
// workers/caches/IndexedDB left by older releases so they cannot keep serving
// stale authenticated pages or generating background work.
export default function PwaRuntime() {
  useEffect(() => {
    const cleanup = async () => {
      try {
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
        }
      } catch {}

      try {
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(
            keys
              .filter((key) => key.startsWith("estibordo-"))
              .map((key) => caches.delete(key))
          );
        }
      } catch {}

      try {
        if ("indexedDB" in window) indexedDB.deleteDatabase("estibordo-offline");
      } catch {}
    };

    cleanup();
  }, []);

  return null;
}
