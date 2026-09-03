"use client";

import { useEffect } from "react";

export default function PaymentStatusPoller() {
  useEffect(() => {
    let stopped = false;
    let attempts = 0;
    const check = async () => {
      attempts += 1;
      try {
        const response = await fetch("/api/access", { cache: "no-store", credentials: "same-origin" });
        const payload = await response.json().catch(() => ({}));
        if (!stopped && payload.active) location.reload();
      } catch {
        // A página permanece utilizável; uma nova tentativa ocorrerá no próximo intervalo.
      }
      if (attempts >= 40) window.clearInterval(timer);
    };
    const timer = window.setInterval(check, 3000);
    check();
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, []);

  return <p>Verificando a confirmação do Mercado Pago automaticamente…</p>;
}
