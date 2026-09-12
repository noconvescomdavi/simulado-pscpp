"use client";

import { useEffect, useRef } from "react";

export default function StudentMobileMenu({ children, className = "", summaryClassName = "", panelClassName = "" }) {
  const detailsRef = useRef(null);

  useEffect(() => {
    function closeOnOutsidePointer(event) {
      const details = detailsRef.current;
      if (!details?.open) return;
      if (!details.contains(event.target)) details.removeAttribute("open");
    }

    function closeOnEscape(event) {
      const details = detailsRef.current;
      if (event.key === "Escape" && details?.open) details.removeAttribute("open");
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <details ref={detailsRef} className={className}>
      <summary className={summaryClassName} aria-label="Abrir menu">☰</summary>
      <div className={panelClassName}>{children}</div>
    </details>
  );
}
