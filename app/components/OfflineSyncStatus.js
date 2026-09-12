"use client";

import { useEffect, useState } from "react";
import { getOfflineStatus, onOfflineChange, syncOfflineQueue } from "../../lib/offline-store";

export default function OfflineSyncStatus() {
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);

  async function refresh() {
    setOnline(typeof navigator === "undefined" ? true : navigator.onLine);
    try {
      const status = await getOfflineStatus();
      setPending(Number(status?.pending || 0));
    } catch {}
  }

  async function syncNow() {
    if (!navigator.onLine || syncing) return;
    setSyncing(true);
    try {
      await syncOfflineQueue();
      await refresh();
    } catch {}
    finally { setSyncing(false); }
  }

  useEffect(() => {
    refresh();
    const onOnline = () => { setOnline(true); syncNow(); };
    const onOffline = () => setOnline(false);
    const off = onOfflineChange(refresh);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    const timer = setInterval(() => {
      if (navigator.onLine && pending > 0) syncNow();
    }, 30000);
    return () => {
      off();
      clearInterval(timer);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [pending]);

  let label = "Sincronizado";
  if (syncing) label = "Sincronizando…";
  else if (!online && pending > 0) label = "Offline · " + pending + " pendência" + (pending === 1 ? "" : "s");
  else if (!online) label = "Offline";
  else if (pending > 0) label = pending + " pendência" + (pending === 1 ? "" : "s");

  return (
    <a href="/offline" title="Central Offline" style={{display:"inline-flex",alignItems:"center",gap:7,fontSize:12,textDecoration:"none",opacity:.9}}>
      <i style={{width:8,height:8,borderRadius:999,display:"inline-block",background:online?"#46d17d":"#f3b33d"}} />
      <span>{label}</span>
    </a>
  );
}
