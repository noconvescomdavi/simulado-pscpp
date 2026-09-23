"use client";

import { useEffect } from "react";

// Server-rendered authenticated pages are intentionally NOT prefetched here.
// Warming them in the service worker executes their DB/learning-plan work even
// when the student never opens the page, multiplying Fluid Active CPU.
// Static assets are already cached by sw.js; pages are cached after real visits.
export default function RouteCacheRuntime(){
  useEffect(()=>{
    if(!("serviceWorker" in navigator)) return;
    // Keep this runtime as a compatibility no-op. Existing page-cache entries
    // continue to work, but no background SSR navigation is generated.
  },[]);
  return null;
}
