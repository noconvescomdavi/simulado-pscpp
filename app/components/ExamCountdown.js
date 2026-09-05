"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2027-11-01T00:00:00-03:00").getTime();

function calculate() {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function two(value) {
  return String(value).padStart(2, "0");
}

export default function ExamCountdown() {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const update = () => setRemaining(calculate());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const value = remaining || { days: "—", hours: "—", minutes: "—", seconds: "—" };

  return (
    <div className="examCountdown">
      <div className="countdownHeading">
        <span>CONTAGEM REGRESSIVA PARA A PROVA</span>
        <small>Considerando 01/11/2027</small>
      </div>
      <div className="countdownGrid" aria-live="polite">
        <div><strong>{value.days}</strong><span>DIAS</span></div>
        <i>:</i>
        <div><strong>{remaining ? two(value.hours) : value.hours}</strong><span>HORAS</span></div>
        <i>:</i>
        <div><strong>{remaining ? two(value.minutes) : value.minutes}</strong><span>MIN</span></div>
        <i>:</i>
        <div><strong>{remaining ? two(value.seconds) : value.seconds}</strong><span>SEG</span></div>
      </div>
    </div>
  );
}
