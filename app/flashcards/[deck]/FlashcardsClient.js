"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./deck.module.css";

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

function svg(content, viewBox = "0 0 100 100") {
  return `<svg class="${styles.signalSvg}" viewBox="${viewBox}" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="96" height="96" rx="1" fill="#fff" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
    ${content}
  </svg>`;
}

function stripes(colors, direction) {
  const n = colors.length;
  const chunks = colors
    .map((color, i) => {
      if (direction === "h") {
        const h = 92 / n;
        return `<rect x="4" y="${4 + i * h}" width="92" height="${h + 0.4}" fill="${color}"/>`;
      }
      const w = 92 / n;
      return `<rect x="${4 + i * w}" y="4" width="${w + 0.4}" height="92" fill="${color}"/>`;
    })
    .join("");
  return svg(chunks);
}

function checker(a, b) {
  return svg(`
    <rect x="4" y="4" width="46" height="46" fill="${a}"/>
    <rect x="50" y="4" width="46" height="46" fill="${b}"/>
    <rect x="4" y="50" width="46" height="46" fill="${b}"/>
    <rect x="50" y="50" width="46" height="46" fill="${a}"/>
  `);
}

function diagonalStripes() {
  return svg(`
    <defs><clipPath id="yclip"><rect x="4" y="4" width="92" height="92"/></clipPath></defs>
    <g clip-path="url(#yclip)" transform="rotate(-45 50 50)">
      <rect x="-30" y="-30" width="160" height="160" fill="#f4d21f"/>
      <rect x="-30" y="-30" width="160" height="14" fill="#d8222a"/>
      <rect x="-30" y="-2" width="160" height="14" fill="#d8222a"/>
      <rect x="-30" y="26" width="160" height="14" fill="#d8222a"/>
      <rect x="-30" y="54" width="160" height="14" fill="#d8222a"/>
      <rect x="-30" y="82" width="160" height="14" fill="#d8222a"/>
      <rect x="-30" y="110" width="160" height="14" fill="#d8222a"/>
    </g>
  `);
}

const FLAGS = {
  A: svg(`<polygon points="4,4 92,4 68,50 92,96 4,96" fill="#fff"/><polygon points="4,4 48,4 48,96 4,96" fill="#fff"/><polygon points="48,4 92,4 68,50 92,96 48,96" fill="#1769aa"/>`, "0 0 96 100"),
  B: svg(`<polygon points="4,4 92,4 68,50 92,96 4,96" fill="#d8222a"/>`, "0 0 96 100"),
  C: stripes(["#1769aa", "#fff", "#d8222a", "#fff", "#1769aa"], "h"),
  D: stripes(["#f4d21f", "#1769aa", "#f4d21f"], "h"),
  E: stripes(["#1769aa", "#d8222a"], "h"),
  F: svg(`<rect x="4" y="4" width="92" height="92" fill="#fff"/><polygon points="50,18 82,50 50,82 18,50" fill="#d8222a"/>`),
  G: stripes(["#f4d21f", "#1769aa", "#f4d21f", "#1769aa", "#f4d21f", "#1769aa"], "v"),
  H: stripes(["#fff", "#d8222a"], "v"),
  I: svg(`<rect x="4" y="4" width="92" height="92" fill="#f4d21f"/><circle cx="50" cy="50" r="25" fill="#111"/>`),
  J: stripes(["#1769aa", "#fff", "#1769aa"], "h"),
  K: stripes(["#f4d21f", "#1769aa"], "v"),
  L: svg(`<rect x="4" y="4" width="92" height="92" fill="#f4d21f"/><rect x="50" y="4" width="46" height="46" fill="#111"/><rect x="4" y="50" width="46" height="46" fill="#111"/>`),
  M: svg(`<rect x="4" y="4" width="92" height="92" fill="#1769aa"/><polygon points="4,4 16,4 96,84 96,96 84,96 4,16" fill="#fff"/><polygon points="84,4 96,4 96,16 16,96 4,96 4,84" fill="#fff"/>`),
  N: checker("#1769aa", "#fff"),
  O: svg(`<polygon points="4,4 96,4 4,96" fill="#f4d21f"/><polygon points="96,4 96,96 4,96" fill="#d8222a"/>`),
  P: svg(`<rect x="4" y="4" width="92" height="92" fill="#1769aa"/><rect x="27" y="27" width="46" height="46" fill="#fff"/>`),
  Q: svg(`<rect x="4" y="4" width="92" height="92" fill="#f4d21f"/>`),
  R: svg(`<rect x="4" y="4" width="92" height="92" fill="#d8222a"/><rect x="41" y="4" width="18" height="92" fill="#f4d21f"/><rect x="4" y="41" width="92" height="18" fill="#f4d21f"/>`),
  S: svg(`<rect x="4" y="4" width="92" height="92" fill="#fff"/><rect x="27" y="27" width="46" height="46" fill="#1769aa"/>`),
  T: stripes(["#d8222a", "#fff", "#1769aa"], "v"),
  U: svg(`<rect x="4" y="4" width="92" height="92" fill="#fff"/><rect x="4" y="4" width="46" height="46" fill="#d8222a"/><rect x="50" y="50" width="46" height="46" fill="#d8222a"/>`),
  V: svg(`<rect x="4" y="4" width="92" height="92" fill="#fff"/><polygon points="4,4 18,4 96,82 96,96 82,96 4,18" fill="#d8222a"/><polygon points="82,4 96,4 96,18 18,96 4,96 4,82" fill="#d8222a"/>`),
  W: svg(`<rect x="4" y="4" width="92" height="92" fill="#1769aa"/><rect x="20" y="20" width="60" height="60" fill="#fff"/><rect x="34" y="34" width="32" height="32" fill="#d8222a"/>`),
  X: svg(`<rect x="4" y="4" width="92" height="92" fill="#fff"/><rect x="41" y="4" width="18" height="92" fill="#1769aa"/><rect x="4" y="41" width="92" height="18" fill="#1769aa"/>`),
  Y: diagonalStripes(),
  Z: svg(`<rect x="4" y="4" width="92" height="92" fill="#f4d21f"/><polygon points="4,4 50,50 4,96" fill="#111"/><polygon points="96,4 50,50 96,96" fill="#d8222a"/><polygon points="4,96 50,50 96,96" fill="#1769aa"/>`),
};

function numeralPennantSvg(n) {
  const content = {
    "0": `<rect width="120" height="80" fill="#f4d21f"/><rect x="40" width="40" height="80" fill="#d8222a"/>`,
    "1": `<rect width="120" height="80" fill="#fff"/><circle cx="40" cy="40" r="17" fill="#d8222a"/>`,
    "2": `<rect width="120" height="80" fill="#1769aa"/><circle cx="40" cy="40" r="17" fill="#fff"/>`,
    "3": `<rect width="40" height="80" fill="#d8222a"/><rect x="40" width="40" height="80" fill="#fff"/><rect x="80" width="40" height="80" fill="#1769aa"/>`,
    "4": `<rect width="120" height="80" fill="#d8222a"/><rect x="25" width="11" height="80" fill="#fff"/><rect y="34" width="120" height="12" fill="#fff"/>`,
    "5": `<rect width="60" height="80" fill="#f4d21f"/><rect x="60" width="60" height="80" fill="#1769aa"/>`,
    "6": `<rect width="120" height="40" fill="#111"/><rect y="40" width="120" height="40" fill="#fff"/>`,
    "7": `<rect width="120" height="40" fill="#f4d21f"/><rect y="40" width="120" height="40" fill="#d8222a"/>`,
    "8": `<rect width="120" height="80" fill="#fff"/><rect x="25" width="11" height="80" fill="#d8222a"/><rect y="34" width="120" height="12" fill="#d8222a"/>`,
    "9": `<rect width="60" height="40" fill="#fff"/><rect x="60" width="60" height="40" fill="#111"/><rect y="40" width="60" height="40" fill="#d8222a"/><rect x="60" y="40" width="60" height="40" fill="#f4d21f"/>`,
  }[String(n)];

  if (!content) return "";

  return `<svg class="${styles.signalSvg}" viewBox="0 0 120 80" role="img" aria-label="Flâmula numeral ${n}" xmlns="http://www.w3.org/2000/svg">
    <defs><clipPath id="numeric-pennant-${n}"><polygon points="3,3 117,40 3,77"/></clipPath></defs>
    <polygon points="3,3 117,40 3,77" fill="#fff" stroke="rgba(0,0,0,.22)" stroke-width="2"/>
    <g clip-path="url(#numeric-pennant-${n})">${content}</g>
  </svg>`;
}

function numeralSvg(n) {
  const shape = {
    "0": `<rect x="4" y="4" width="92" height="30.7" fill="#f4d21f"/><rect x="4" y="34.7" width="92" height="30.6" fill="#d8222a"/><rect x="4" y="65.3" width="92" height="30.7" fill="#f4d21f"/>`,
    "1": `<rect x="4" y="4" width="92" height="92" fill="#fff"/><circle cx="50" cy="50" r="25" fill="#d8222a"/>`,
    "2": `<rect x="4" y="4" width="92" height="92" fill="#1769aa"/><circle cx="50" cy="50" r="25" fill="#fff"/>`,
    "3": `<rect x="4" y="4" width="92" height="30.7" fill="#d8222a"/><rect x="4" y="34.7" width="92" height="30.6" fill="#fff"/><rect x="4" y="65.3" width="92" height="30.7" fill="#1769aa"/>`,
    "4": `<rect x="4" y="4" width="92" height="92" fill="#d8222a"/><rect x="42" y="4" width="16" height="92" fill="#fff"/><rect x="4" y="42" width="92" height="16" fill="#fff"/>`,
    "5": `<rect x="4" y="4" width="92" height="46" fill="#f4d21f"/><rect x="4" y="50" width="92" height="46" fill="#1769aa"/>`,
    "6": `<rect x="4" y="4" width="92" height="46" fill="#111"/><rect x="4" y="50" width="92" height="46" fill="#fff"/>`,
    "7": `<rect x="4" y="4" width="92" height="46" fill="#f4d21f"/><rect x="4" y="50" width="92" height="46" fill="#d8222a"/>`,
    "8": `<rect x="4" y="4" width="92" height="92" fill="#fff"/><rect x="42" y="4" width="16" height="92" fill="#d8222a"/><rect x="4" y="42" width="92" height="16" fill="#d8222a"/>`,
    "9": `<rect x="4" y="4" width="46" height="46" fill="#fff"/><rect x="50" y="4" width="46" height="46" fill="#d8222a"/><rect x="4" y="50" width="46" height="46" fill="#111"/><rect x="50" y="50" width="46" height="46" fill="#f4d21f"/>`,
  }[String(n)];
  return shape ? svg(shape) : "";
}

function renderSignal(code) {
  const chars = String(code || "").replace(/\s/g, "").toUpperCase().split("");
  const flags = chars.filter((ch) => /[A-Z]/.test(ch));
  const numerals = chars.filter((ch) => /\d/.test(ch));
  if (flags.length === 1 && numerals.length === 0) return FLAGS[flags[0]] || "";
  if (flags.length === 0 && numerals.length === 1) return numeralPennantSvg(numerals[0]);
  const parts = [...flags.map((ch) => FLAGS[ch]), ...numerals.map(numeralSvg)].filter(Boolean);
  return `<div class="${styles.signalGroup}">${parts.join("")}</div>`;
}

function renderRipeamVisual(card) {
  const v=card?.visual;if(!v)return "";
  const C={red:"#e23b45",green:"#21b36b",white:"#fff",yellow:"#f4c542"};
  const wrap=(b)=>`<svg class="${styles.signalSvg}" viewBox="0 0 600 330" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="330" rx="24" fill="#061522"/>${b}</svg>`;
  const light=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="14" fill="${C[c]||c}" stroke="#02070b" stroke-width="4"/><circle cx="${x}" cy="${y}" r="25" fill="${C[c]||c}" opacity=".12"/>`;
  const ship=(x,y,a=0)=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0-52C18-35 22-5 18 30L0 52-18 30C-22-5-18-35 0-52Z" fill="#e9eef2" stroke="#597080" stroke-width="3"/><circle cx="-10" cy="0" r="6" fill="#e23b45"/><circle cx="10" cy="0" r="6" fill="#21b36b"/></g>`;
  if(v.type==="headon")return wrap(`${ship(300,75,180)}${ship(300,255)}<path d="M300 125Q365 150 400 110M300 205Q235 180 200 220" fill="none" stroke="#21b36b" stroke-width="7"/><text x="300" y="168" text-anchor="middle" fill="white" font-size="20" font-weight="800">AMBAS GUINAM PARA BORESTE</text>`);
  if(v.type==="crossing")return wrap(`${ship(120,210,90)}${ship(410,90,180)}<path d="M70 210H500M410 45V285" stroke="#9dd6f5" stroke-width="5" stroke-dasharray="12 10"/><circle cx="410" cy="210" r="24" fill="none" stroke="#e23b45" stroke-width="5"/><text x="300" y="300" text-anchor="middle" fill="white" font-size="18">QUEM AVISTA A OUTRA POR BORESTE MANOBRA</text>`);
  if(v.type==="overtaking")return wrap(`${ship(300,90)}${ship(240,245,-12)}<path d="M300 90L170 280M300 90L430 280" stroke="#f4c542" stroke-width="4" stroke-dasharray="10 8"/><text x="300" y="310" text-anchor="middle" fill="white" font-size="18">&gt; 22,5° PARA RÉ DO TRAVÉS</text>`);
  if(v.type==="tss")return wrap(`<rect x="35" y="60" width="530" height="70" rx="10" fill="#174b6b"/><rect x="35" y="200" width="530" height="70" rx="10" fill="#174b6b"/><path d="M60 95H540M540 235H60" stroke="#9dd6f5" stroke-width="6" stroke-dasharray="20 12"/><path d="M300 290V40" stroke="#f4c542" stroke-width="7" stroke-dasharray="12 9"/><text x="315" y="170" fill="white" font-size="20" font-weight="800">CRUZAR ≈ PERPENDICULAR AO FLUXO</text>`);
  if(v.type==="channel")return wrap(`<path d="M45 285C160 220 185 105 300 80S460 130 555 40" fill="none" stroke="#246c94" stroke-width="95"/><path d="M45 285C160 220 185 105 300 80S460 130 555 40" fill="none" stroke="#c7e5f5" stroke-width="4" stroke-dasharray="12 10"/>${ship(255,120,42)}<text x="300" y="315" text-anchor="middle" fill="white" font-size="18">MANTER-SE AO LIMITE DE BORESTE</text>`);
  if(v.type==="radar")return wrap(`<circle cx="300" cy="165" r="130" fill="#062b29" stroke="#2d8f76" stroke-width="3"/><circle cx="300" cy="165" r="85" fill="none" stroke="#2d8f76"/><circle cx="300" cy="165" r="42" fill="none" stroke="#2d8f76"/><path d="M300 35V295M170 165H430M300 165L390 75" stroke="#50e3a4" stroke-width="3"/><circle cx="390" cy="75" r="9" fill="#f4c542"/>`);
  if(v.type==="sector")return wrap(`${v.sector==="side"?'<path d="M300 165L165 55A155 155 0 0 0 155 210Z" fill="#e23b45" opacity=".45"/><path d="M300 165L435 55A155 155 0 0 1 445 210Z" fill="#21b36b" opacity=".45"/>':v.sector==="stern"?'<path d="M300 165L180 270A155 155 0 0 1 420 270Z" fill="white" opacity=".35"/>':'<path d="M300 165L170 55A155 155 0 1 1 430 55Z" fill="white" opacity=".35"/>'}${ship(300,165)}`);
  if(v.type==="lights"||v.type==="vessel"){let ls=v.lights||[];let body=v.type==="vessel"?'<path d="M120 260Q300 295 480 260L445 305H155Z" fill="#233a49"/><path d="M250 260V165M350 260V165" stroke="#7890a0" stroke-width="5"/>':'';if(v.kind==="mine")body+=light(300,70,"green")+light(220,140,"green")+light(380,140,"green");else body+=ls.map((c,i)=>light(300,65+i*48,c)).join("");return wrap(body);}
  if(v.type==="shapes"){const d=(q,y)=>q==="ball"?`<circle cx="300" cy="${y}" r="25" fill="#05090d"/>`:q==="diamond"?`<polygon points="300,${y-32} 334,${y} 300,${y+32} 266,${y}" fill="#05090d"/>`:q==="cylinder"?`<rect x="273" y="${y-35}" width="54" height="70" fill="#05090d"/>`:q==="coneUp"?`<polygon points="300,${y-34} 336,${y+30} 264,${y+30}" fill="#05090d"/>`:`<polygon points="264,${y-30} 336,${y-30} 300,${y+34}" fill="#05090d"/>`;let a=v.shapes||[];let st=165-(a.length-1)*48;return wrap(`<rect x="225" y="25" width="150" height="280" rx="20" fill="#eef2f4"/>${a.map((q,i)=>d(q,st+i*96)).join("")}`);}
  if(v.type==="sound"){let x=65;let b=(v.pattern||[]).map(q=>{let w=q==="long"?115:34,o=`<rect x="${x}" y="145" width="${w}" height="28" rx="14" fill="${q==="long"?"#f4c542":"#e9eef2"}"/>`;x+=w+20;return o}).join("");return wrap(`${b}<path d="M70 225Q100 190 130 225T190 225T250 225T310 225T370 225T430 225T490 225" fill="none" stroke="#3aa8df" stroke-width="5"/><text x="300" y="285" text-anchor="middle" fill="white" font-size="19">CURTO ≈ 1 s • LONGO = 4–6 s</text>`);}
  return "";
}

function renderRipeamFallback(card) {
  const code = String(card?.code || "RIPEAM");
  const name = String(card?.name || "");
  const category = String(card?.category || "rules");

  const icon =
    category === "lights" ? `
      <circle cx="230" cy="130" r="18" fill="#e23b45"/>
      <circle cx="300" cy="95" r="18" fill="#ffffff"/>
      <circle cx="370" cy="130" r="18" fill="#21b36b"/>
      <path d="M190 210 Q300 255 410 210 L385 252 H215Z" fill="#1c2f3e" stroke="#6d8494" stroke-width="3"/>`
    : category === "shapes" ? `
      <circle cx="300" cy="92" r="25" fill="#05090d"/>
      <polygon points="300,135 332,170 300,205 268,170" fill="#05090d"/>
      <circle cx="300" cy="248" r="25" fill="#05090d"/>`
    : category === "sounds" ? `
      <rect x="145" y="145" width="65" height="26" rx="13" fill="#eef4f7"/>
      <rect x="235" y="145" width="135" height="26" rx="13" fill="#f4c542"/>
      <rect x="395" y="145" width="65" height="26" rx="13" fill="#eef4f7"/>
      <path d="M120 220 Q150 185 180 220 T240 220 T300 220 T360 220 T420 220 T480 220" fill="none" stroke="#3aa8df" stroke-width="5"/>`
    : category === "traps" ? `
      <path d="M300 65 L455 250 H145Z" fill="#f4c542" stroke="#061522" stroke-width="5"/>
      <text x="300" y="205" text-anchor="middle" fill="#061522" font-size="92" font-weight="900">!</text>`
    : `
      <g transform="translate(205 175) rotate(90)">
        <path d="M0-52 C16-36 22-13 19 27 L0 50 -19 27 C-22-13-16-36 0-52Z" fill="#e9eef2" stroke="#081a2a" stroke-width="3"/>
        <circle cx="-10" cy="-3" r="6" fill="#e23b45"/>
        <circle cx="10" cy="-3" r="6" fill="#21b36b"/>
      </g>
      <g transform="translate(395 175) rotate(-90)">
        <path d="M0-52 C16-36 22-13 19 27 L0 50 -19 27 C-22-13-16-36 0-52Z" fill="#e9eef2" stroke="#081a2a" stroke-width="3"/>
        <circle cx="-10" cy="-3" r="6" fill="#e23b45"/>
        <circle cx="10" cy="-3" r="6" fill="#21b36b"/>
      </g>
      <path d="M240 175 H360" stroke="#9dd6f5" stroke-width="4" stroke-dasharray="10 8"/>`;

  return `<svg class="${styles.signalSvg}" viewBox="0 0 600 330" role="img" aria-label="${code} ${name}" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="330" rx="24" fill="#061522"/>
    <path d="M0 278 Q150 252 300 278 T600 278 V330 H0Z" fill="#0b2b40"/>
    ${icon}
    <rect x="165" y="274" width="270" height="36" rx="18" fill="#102a3f"/>
    <text x="300" y="298" text-anchor="middle" fill="#ffffff" font-size="18" font-weight="900">${code}</text>
  </svg>`;
}


/* RIPEAM_VISUAL_PRO_START */
function renderRipeamPro(card) {
  const v = card?.visual || {};
  const cat = String(card?.category || "rules");
  const id = String(card?.id || "");
  const code = String(card?.code || "RIPEAM");
  const title = String(card?.name || "");
  const defs = `<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#061522"/><stop offset=".58" stop-color="#123b59"/><stop offset="1" stop-color="#d38354"/></linearGradient>
  <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#164d6b"/><stop offset="1" stop-color="#03111d"/></linearGradient>
  <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#647786"/><stop offset=".45" stop-color="#263844"/><stop offset=".46" stop-color="#a43131"/><stop offset="1" stop-color="#3b1517"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-opacity=".5"/></filter>
  <filter id="blur"><feGaussianBlur stdDeviation="8"/></filter>
  <marker id="arrp" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#7fe0ff"/></marker>
  </defs>`;
  const ocean = `<rect width="800" height="450" fill="url(#sky)"/><circle cx="655" cy="90" r="44" fill="#ffd9a1" opacity=".78"/><path d="M0 235 Q120 215 240 236 T480 235 T800 232 V450 H0Z" fill="url(#sea)"/><g opacity=".18" stroke="#b9e7ff"><path d="M0 300q55-15 110 0t110 0t110 0t110 0t110 0t110 0t110 0"/><path d="M-40 350q55-15 110 0t110 0t110 0t110 0t110 0t110 0t110 0"/></g>`;
  const night = `<rect width="800" height="450" fill="#020912"/><circle cx="665" cy="75" r="34" fill="#dceaff" opacity=".75"/><g fill="#fff" opacity=".6"><circle cx="80" cy="60" r="2"/><circle cx="145" cy="90" r="2"/><circle cx="225" cy="45" r="2"/><circle cx="330" cy="78" r="2"/><circle cx="480" cy="42" r="2"/><circle cx="570" cy="110" r="2"/></g><path d="M0 245 Q150 225 300 245 T600 242 T800 245V450H0Z" fill="#041c2c"/>`;
  const label = `<g><rect x="24" y="22" width="340" height="42" rx="21" fill="#061522" opacity=".88"/><text x="42" y="49" fill="#eaf6ff" font-size="17" font-weight="800">${code} · ${title}</text></g>`;
  const ship=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})" filter="url(#shadow)"><path d="M-125 5L105 5L140 27Q80 58-100 47Q-126 33-125 5Z" fill="url(#hull)" stroke="#9fb1bd" stroke-width="2"/><path d="M-88 4v-42h70v42M-78-42v-27h47v27" fill="#d7dde0" stroke="#647786" stroke-width="2"/><rect x="-72" y="-61" width="8" height="7" fill="#14242e"/><rect x="-56" y="-61" width="8" height="7" fill="#14242e"/><path d="M-8 2v-76M-8-72h58M47-72v74" stroke="#8d9ca5" stroke-width="4"/><rect x="3" y="-32" width="28" height="29" fill="#6d7f89"/><rect x="35" y="-32" width="28" height="29" fill="#566b77"/><path d="M-125 49q80 20 170 5t95-27" fill="none" stroke="#d8f4ff" stroke-width="5" opacity=".45"/></g>`;
  const top=(x,y,a=0,s=1)=>`<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})" filter="url(#shadow)"><path d="M0-68C20-49 29-17 24 37L0 68-24 37C-29-17-20-49 0-68Z" fill="#cbd5db" stroke="#07141f" stroke-width="4"/><path d="M0-55V48" stroke="#6d7f89" stroke-width="3"/><circle cx="-14" cy="-7" r="7" fill="#e93e49"/><circle cx="14" cy="-7" r="7" fill="#27c477"/></g>`;
  const light=(x,y,c)=>{const C={red:"#ff3045",green:"#32ff8a",white:"#fff7d1",yellow:"#ffd83d"};return `<g><circle cx="${x}" cy="${y}" r="30" fill="${C[c]}" opacity=".15" filter="url(#blur)"/><circle cx="${x}" cy="${y}" r="9" fill="${C[c]}" stroke="#fff" stroke-opacity=".35"/><circle cx="${x-2}" cy="${y-2}" r="3" fill="#fff"/></g>`};
  const arrow=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}Q${(x1+x2)/2+25} ${(y1+y2)/2-20} ${x2} ${y2}" fill="none" stroke="#7fe0ff" stroke-width="7" stroke-dasharray="14 10" marker-end="url(#arrp)"/>`;
  const wrap=(body,bg=ocean)=>`<svg class="${styles.signalSvg}" viewBox="0 0 800 450" role="img" aria-label="${code} ${title}" xmlns="http://www.w3.org/2000/svg">${defs}${bg}${body}${label}</svg>`;

  if(v.type==="headon") return wrap(`${top(400,125,180,1.05)}${top(400,335,0,1.05)}${arrow(385,195,315,250)}${arrow(415,255,485,200)}<text x="400" y="420" text-anchor="middle" fill="#fff" font-size="19" font-weight="900">AMBAS GUINAM PARA BORESTE</text>`);
  if(v.type==="crossing") return wrap(`${top(220,285,90,1.05)}${top(535,125,180,1.05)}${arrow(275,285,490,285)}${arrow(535,185,535,335)}<circle cx="535" cy="285" r="34" fill="none" stroke="#ff4d5c" stroke-width="5"/><text x="400" y="410" text-anchor="middle" fill="#fff" font-size="18" font-weight="900">AVISTA POR BORESTE → MANTÉM-SE FORA DO CAMINHO</text>`);
  if(v.type==="overtaking") return wrap(`${top(430,155,0,1.15)}${top(325,330,-12,.92)}${arrow(325,280,365,175)}<path d="M430 155L235 365M430 155L625 365" stroke="#ffd34d" stroke-width="4" stroke-dasharray="12 9"/><text x="400" y="420" text-anchor="middle" fill="#fff" font-size="18" font-weight="900">MAIS DE 22,5° PARA RÉ DO TRAVÉS</text>`);
  if(v.type==="channel") return wrap(`<path d="M80 430C210 340 170 175 360 135C545 95 610 195 760 55" fill="none" stroke="#315f78" stroke-width="145"/><path d="M80 430C210 340 170 175 360 135C545 95 610 195 760 55" fill="none" stroke="#9bd8f5" stroke-width="4" stroke-dasharray="15 12"/>${top(330,175,42,.85)}<text x="400" y="415" text-anchor="middle" fill="#fff" font-size="19" font-weight="900">MANTER-SE PRÓXIMO AO LIMITE DE BORESTE</text>`);
  if(v.type==="tss") return wrap(`<path d="M50 125H750M750 305H50" stroke="#285873" stroke-width="105"/><path d="M65 125H735M735 305H65" stroke="#a7dff7" stroke-width="4" stroke-dasharray="18 13"/><path d="M400 390V45" stroke="#ffd34d" stroke-width="7" stroke-dasharray="13 10"/><text x="420" y="220" fill="#fff" font-size="20" font-weight="900">CRUZAR ≈ 90° AO FLUXO</text>`);
  if(v.type==="radar") return wrap(`<g transform="translate(400 235)"><circle r="165" fill="#052c28" stroke="#31b184" stroke-width="3"/><circle r="120" fill="none" stroke="#278067"/><circle r="75" fill="none" stroke="#278067"/><circle r="30" fill="none" stroke="#278067"/><path d="M-165 0H165M0-165V165" stroke="#278067"/><path d="M0 0L110-115" stroke="#5bffc2" stroke-width="4"/><circle cx="110" cy="-115" r="10" fill="#ffd34d"/></g>`,night);
  if(v.type==="sector"){let a=v.sector==="stern"?`<path d="M400 235L245 365A205 205 0 0 1 555 365Z" fill="#fff" opacity=".23"/>`:v.sector==="side"?`<path d="M400 235L225 85A215 215 0 0 0 195 270Z" fill="#ff3045" opacity=".28"/><path d="M400 235L575 85A215 215 0 0 1 605 270Z" fill="#32ff8a" opacity=".28"/>`:`<path d="M400 235L235 85A220 220 0 1 1 565 85Z" fill="#fff" opacity=".20"/>`;return wrap(`${a}${top(400,235,0,1)}<circle cx="400" cy="235" r="205" fill="none" stroke="#91b3c7" stroke-width="2"/>`,night);}
  if(v.type==="vessel"||v.type==="lights"){const ls=v.lights||["white"];const stack=ls.map((c,i)=>light(585,88+i*48,c)).join("");if(v.kind==="sail")return wrap(`<path d="M250 315L390 100L390 315Z" fill="#e7e0cf" stroke="#8796a0" stroke-width="3"/><path d="M390 100V330" stroke="#a9b4ba" stroke-width="5"/><path d="M185 330Q390 370 575 325L545 365H215Z" fill="url(#hull)"/>${stack}`,night);let ex=v.kind==="mine"?light(400,78,"green")+light(330,130,"green")+light(470,130,"green"):"";return wrap(`${ship(365,300,1.35)}${stack}${ex}`,night);}
  if(v.type==="shapes"){const sh=(q,y)=>q==="ball"?`<circle cx="400" cy="${y}" r="28" fill="#05080b"/>`:q==="diamond"?`<polygon points="400,${y-35} 435,${y} 400,${y+35} 365,${y}" fill="#05080b"/>`:q==="cylinder"?`<rect x="367" y="${y-42}" width="66" height="84" rx="4" fill="#05080b"/>`:q==="coneUp"?`<polygon points="400,${y-38} 442,${y+32} 358,${y+32}" fill="#05080b"/>`:`<polygon points="358,${y-32} 442,${y-32} 400,${y+38}" fill="#05080b"/>`;const a=v.shapes||[];const ys=a.length===1?[220]:a.length===2?[170,275]:[125,220,315];return wrap(`${ship(240,345,.85)}<rect x="330" y="78" width="140" height="300" rx="18" fill="#dfe8ec" opacity=".92"/>${a.map((q,i)=>sh(q,ys[i])).join("")}`);}
  if(v.type==="sound"){const a=v.pattern||[];let x=90;const bars=a.map(q=>{const w=q==="long"?125:42;const z=`<rect x="${x}" y="188" width="${w}" height="34" rx="17" fill="${q==="long"?"#ffd34d":"#f3f7fa"}"/>`;x+=w+24;return z}).join("");return wrap(`${ship(185,320,.8)}${bars}<path d="M75 275Q115 230 155 275T235 275T315 275T395 275T475 275T555 275T635 275" fill="none" stroke="#70d8ff" stroke-width="6"/><text x="400" y="405" text-anchor="middle" fill="#fff" font-size="18" font-weight="900">CURTO ≈ 1 s · LONGO = 4–6 s</text>`);}
  if(cat==="traps") return wrap(`${ship(290,315,1.05)}<path d="M610 105L720 305H500Z" fill="#ffd34d" stroke="#08131d" stroke-width="6"/><text x="610" y="260" text-anchor="middle" fill="#07131e" font-size="110" font-weight="900">!</text>`);
  if(id==="R05") return wrap(`${ship(300,315,1.05)}<g transform="translate(555 150)"><circle r="72" fill="#07131e" stroke="#bcecff" stroke-width="7"/><path d="M-55 0Q0-45 55 0Q0 45-55 0Z" fill="#d8f4ff"/><circle r="18" fill="#123b59"/></g>`);
  if(id==="R06") return wrap(`${ship(290,315,1.05)}<g transform="translate(610 165)"><circle r="82" fill="#07131e" stroke="#d6e8f2" stroke-width="7"/><path d="M0 0L45-45" stroke="#ff5c5c" stroke-width="9"/><circle r="8" fill="#fff"/></g>`);
  if(id==="R07") return wrap(`${top(260,275,25,.9)}${top(555,150,205,.9)}<path d="M260 275L555 150" stroke="#ff5964" stroke-width="5" stroke-dasharray="12 9"/><circle cx="400" cy="215" r="35" fill="none" stroke="#ffd34d" stroke-width="5"/>`);
  if(id==="R08"||id==="R16"||id==="R17") return wrap(`${top(300,300,0,1)}${top(510,115,180,.9)}${arrow(300,235,210,155)}`);
  if(id==="R12") return wrap(`<path d="M250 335L390 100L390 335Z" fill="#f1ead8"/><path d="M390 100V345" stroke="#c4ced4" stroke-width="5"/><path d="M160 345Q360 382 530 340L500 375H195Z" fill="url(#hull)"/><path d="M590 105q-55 20-95 60" fill="none" stroke="#bcecff" stroke-width="7" marker-end="url(#arrp)"/>`);
  if(id==="R18") return wrap(`${ship(205,315,.7)}<path d="M390 330L455 185L520 330Z" fill="#efe7d4"/><path d="M455 185V340" stroke="#aab8c0" stroke-width="4"/>${ship(620,325,.55)}`);
  return wrap(`${ship(350,315,1.25)}<g opacity=".7"><path d="M590 120l55 55-55 55-55-55Z" fill="#7fe0ff"/><circle cx="590" cy="175" r="18" fill="#061522"/></g>`);
}
/* RIPEAM_VISUAL_PRO_END */







/* RIPEAM_CINEMATIC_V2_START */

/* RIPEAM_PDF_IMAGES_START */
const RIPEAM_PDF_IMAGES = {
  "R23-PD": "/flashcards/ripeam/navigation-rules-pdf/rule23_power_over50.png",
  "R24-TOW3": "/flashcards/ripeam/navigation-rules-pdf/rule24_tow_over200.png",
  "R24-TOW2": "/flashcards/ripeam/navigation-rules-pdf/rule24_tow_short.png",
  "R25-SAIL": "/flashcards/ripeam/navigation-rules-pdf/rule25_sailing.png",
  "R26-TRAWL": "/flashcards/ripeam/navigation-rules-pdf/rule26_trawling_making_way.png",
  "R26-FISH": "/flashcards/ripeam/navigation-rules-pdf/rule26_fishing_making_way.png",
  "R27-NUC": "/flashcards/ripeam/navigation-rules-pdf/rule27_nuc_making_way.png",
  "R27-RAM": "/flashcards/ripeam/navigation-rules-pdf/rule27_ram_making_way.png",
  "R27-DREDGE-BLOCK": "/flashcards/ripeam/navigation-rules-pdf/rule27_dredging_obstructed.png",
  "R27-DREDGE-PASS": "/flashcards/ripeam/navigation-rules-pdf/rule27_dredging_safe_side.png",
  "R27-MINES": "/flashcards/ripeam/navigation-rules-pdf/rule27_mineclearance.png",
  "R28-CBD": "/flashcards/ripeam/navigation-rules-pdf/rule28_constrained_draught.png",
  "R29-PILOT": "/flashcards/ripeam/navigation-rules-pdf/rule29_pilot_making_way.png",
  "R30-ANCH": "/flashcards/ripeam/navigation-rules-pdf/rule30_anchor.png",
  "R30-AGROUND": "/flashcards/ripeam/navigation-rules-pdf/rule30_aground.png",
  "SH-BALL": "/flashcards/ripeam/navigation-rules-pdf/shape_ball_anchor.png",
  "SH-2BALL": "/flashcards/ripeam/navigation-rules-pdf/shape_two_balls_nuc.png",
  "SH-BDB": "/flashcards/ripeam/navigation-rules-pdf/shape_ball_diamond_ball_ram.png",
  "SH-CYL": "/flashcards/ripeam/navigation-rules-pdf/shape_cylinder_cbd.png",
  "SH-CONE-DOWN": "/flashcards/ripeam/navigation-rules-pdf/shape_cone_down_sail_motor.png",
  "SH-2CONE": "/flashcards/ripeam/navigation-rules-pdf/shape_two_cones_fishing.png",
  "SH-3BALL": "/flashcards/ripeam/navigation-rules-pdf/shape_three_balls_aground.png",
  "SH-DIAMOND": "/flashcards/ripeam/navigation-rules-pdf/shape_diamond_long_tow.png"
};

function renderRipeamPdfImage(card) {
  const src = RIPEAM_PDF_IMAGES[String(card?.id || "")];
  if (!src) return "";
  const alt = `${String(card?.code || "RIPEAM")} - ${String(card?.name || "")}`;
  return `<div style="width:100%;height:100%;min-height:260px;display:flex;align-items:center;justify-content:center;background:#cfcfcf;border-radius:20px;overflow:hidden;box-shadow:0 14px 34px rgba(0,0,0,.28)">
    <img src="${src}" alt="${alt}" loading="eager" decoding="async" style="width:100%;height:100%;max-height:430px;object-fit:contain;display:block;background:#cfcfcf" />
  </div>`;
}
/* RIPEAM_PDF_IMAGES_END */


function renderRipeamCinematic(card) {
  const pdfReference = renderRipeamPdfImage(card);
  if (pdfReference) return pdfReference;
  const v=card?.visual||{}, id=String(card?.id||""), code=String(card?.code||"RIPEAM"), title=String(card?.name||"");
  const defs=`<defs>
    <linearGradient id="csky" x2="0" y2="1"><stop stop-color="#071a2a"/><stop offset=".48" stop-color="#255b78"/><stop offset=".75" stop-color="#e19b68"/><stop offset="1" stop-color="#f3c38f"/></linearGradient>
    <linearGradient id="csea" x2="0" y2="1"><stop stop-color="#1d6988"/><stop offset="1" stop-color="#031521"/></linearGradient>
    <linearGradient id="steel" x2="0" y2="1"><stop stop-color="#dbe5e9"/><stop offset=".5" stop-color="#758996"/><stop offset=".51" stop-color="#273945"/><stop offset="1" stop-color="#101b23"/></linearGradient>
    <filter id="cshadow"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-opacity=".55"/></filter>
    <filter id="cglow"><feGaussianBlur stdDeviation="7"/></filter>
    <marker id="carr" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#6ce4ff"/></marker>
  </defs>`;
  const sea=`<rect width="900" height="506" fill="url(#csky)"/><circle cx="750" cy="92" r="47" fill="#ffdca7" opacity=".78"/><path d="M0 270Q120 246 240 270T480 266T720 271T900 263V506H0Z" fill="url(#csea)"/><g fill="none" stroke="#d5f4ff" opacity=".2"><path d="M0 325q70-18 140 0t140 0t140 0t140 0t140 0t140 0"/><path d="M-40 395q70-18 140 0t140 0t140 0t140 0t140 0t140 0"/></g>`;
  const night=`<rect width="900" height="506" fill="#010812"/><path d="M0 280Q150 255 300 280T600 275T900 280V506H0Z" fill="#031b2a"/><circle cx="755" cy="80" r="35" fill="#dcecff" opacity=".72"/><g fill="#fff" opacity=".65"><circle cx="90" cy="60" r="2"/><circle cx="175" cy="105" r="2"/><circle cx="275" cy="52" r="2"/><circle cx="390" cy="86" r="2"/><circle cx="540" cy="48" r="2"/><circle cx="650" cy="120" r="2"/></g>`;
  const hdr=`<g><rect x="28" y="25" width="430" height="45" rx="22" fill="#03111d" opacity=".9"/><text x="50" y="54" fill="#f4f9fc" font-size="18" font-weight="900">${code} · ${title}</text></g>`;
  const topShip=(x,y,a=0,s=1,cls="")=>`<g class="${cls}" transform="translate(${x} ${y}) rotate(${a}) scale(${s})" filter="url(#cshadow)"><path d="M0-82C23-62 34-23 29 45L0 82-29 45C-34-23-23-62 0-82Z" fill="url(#steel)" stroke="#d6e0e5" stroke-width="3"/><path d="M0-67V58" stroke="#526773" stroke-width="4"/><rect x="-20" y="-20" width="40" height="42" rx="4" fill="#b9c8cf"/><circle cx="-18" cy="10" r="7" fill="#ff3c50"/><circle cx="18" cy="10" r="7" fill="#31ef91"/><path d="M-30 62Q0 83 30 62" fill="none" stroke="#d9f5ff" stroke-width="6" opacity=".55"/></g>`;
  const sideShip=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})" filter="url(#cshadow)"><path d="M-155 8L130 8L165 35Q75 72-125 58Q-154 42-155 8Z" fill="url(#steel)" stroke="#a9bbc5" stroke-width="2"/><path d="M-110 7v-58h78V7M-96-49v-34h52v34" fill="#e2e8eb" stroke="#697e89" stroke-width="2"/><path d="M-8 5v-92M-8-88h80M68-88V5" stroke="#91a1aa" stroke-width="5"/><rect x="5" y="-38" width="40" height="43" fill="#536b78"/><rect x="51" y="-38" width="40" height="43" fill="#415965"/></g>`;
  const arrow=(x1,y1,x2,y2,cls="route")=>`<path class="${cls}" d="M${x1} ${y1}Q${(x1+x2)/2+30} ${(y1+y2)/2-25} ${x2} ${y2}" fill="none" stroke="#6ce4ff" stroke-width="8" stroke-dasharray="15 11" marker-end="url(#carr)"/>`;
  const light=(x,y,c)=>{let C={red:"#ff334b",green:"#29ff8a",white:"#fff5d2",yellow:"#ffd33f"}[c]||c;return `<g><circle cx="${x}" cy="${y}" r="31" fill="${C}" opacity=".17" filter="url(#cglow)"/><circle cx="${x}" cy="${y}" r="9" fill="${C}" stroke="#fff" stroke-opacity=".5"/></g>`};
  const wrap=(body,bg=sea,anim=false)=>`<svg class="${styles.signalSvg} ${anim?"ripeamMotion":""}" viewBox="0 0 900 506" role="img" aria-label="${code} ${title}" xmlns="http://www.w3.org/2000/svg">${defs}${bg}${body}${hdr}<style>
    .ripeamMotion .vesselA{animation:vesselA 7s ease-in-out infinite alternate}.ripeamMotion .vesselB{animation:vesselB 7s ease-in-out infinite alternate}.ripeamMotion .route{stroke-dashoffset:0;animation:dash 1.15s linear infinite}.ripeamMotion .pulse{transform-box:fill-box;transform-origin:center;animation:pulse 1.6s ease-in-out infinite}.ripeamMotion .wake{animation:wake 1.8s ease-in-out infinite}
    @keyframes dash{to{stroke-dashoffset:-52}}@keyframes pulse{50%{opacity:.35;transform:scale(1.14)}}@keyframes wake{50%{opacity:.18}}@keyframes vesselA{to{transform:translate(0px,-13px)}}@keyframes vesselB{to{transform:translate(0px,13px)}}@media(prefers-reduced-motion:reduce){.ripeamMotion *{animation:none!important}}
  </style></svg>`;

  if(v.type==="headon") return wrap(`${topShip(450,125,180,1.08,"vesselA")}${topShip(450,380,0,1.08,"vesselB")}${arrow(432,205,330,265)}${arrow(468,300,570,240)}<circle class="pulse" cx="450" cy="252" r="42" fill="none" stroke="#ff5968" stroke-width="5"/><text x="450" y="475" text-anchor="middle" fill="#fff" font-size="20" font-weight="900">RODA A RODA · AMBAS ALTERAM PARA BORESTE</text>`,sea,true);
  if(v.type==="crossing") return wrap(`${topShip(205,320,90,1.04,"vesselA")}${topShip(625,115,180,1.04,"vesselB")}${arrow(275,320,555,320)}${arrow(625,190,625,390)}<circle class="pulse" cx="625" cy="320" r="38" fill="none" stroke="#ff5363" stroke-width="5"/><text x="450" y="472" text-anchor="middle" fill="#fff" font-size="19" font-weight="900">RUMOS CRUZADOS · EMBARCAÇÃO COM A OUTRA POR BORESTE MANOBRA</text>`,sea,true);
  if(v.type==="overtaking") return wrap(`${topShip(480,135,0,1.12,"vesselA")}${topShip(330,390,-10,.95,"vesselB")}${arrow(330,315,405,175)}<path d="M480 135L245 440M480 135L715 440" stroke="#ffd34d" stroke-width="4" stroke-dasharray="13 10"/><text x="450" y="475" text-anchor="middle" fill="#fff" font-size="20" font-weight="900">ULTRAPASSAGEM · SETOR DE MAIS DE 22,5° PARA RÉ DO TRAVÉS</text>`,sea,true);
  if(v.type==="channel") return wrap(`<path d="M70 500C240 390 180 220 390 165C610 105 680 225 860 45" fill="none" stroke="#2a6684" stroke-width="170"/><path class="route" d="M70 500C240 390 180 220 390 165C610 105 680 225 860 45" fill="none" stroke="#bcecff" stroke-width="5" stroke-dasharray="17 13"/>${topShip(360,205,42,.92,"vesselA")}<text x="450" y="475" text-anchor="middle" fill="#fff" font-size="20" font-weight="900">CANAL ESTREITO · NAVEGAR JUNTO AO LIMITE EXTERIOR DE BORESTE</text>`,sea,true);
  if(v.type==="tss") return wrap(`<path d="M50 145H850M850 355H50" stroke="#245a77" stroke-width="125"/><path class="route" d="M70 145H830M830 355H70" stroke="#bcecff" stroke-width="6" stroke-dasharray="20 14"/><path d="M450 475V35" stroke="#ffd64d" stroke-width="8" stroke-dasharray="14 11"/><text x="475" y="260" fill="#fff" font-size="23" font-weight="900">≈ 90°</text>`,sea,true);
  if(v.type==="radar") return wrap(`<g transform="translate(450 265)"><circle r="185" fill="#052b29" stroke="#38c395" stroke-width="3"/><circle r="140" fill="none" stroke="#278067"/><circle r="95" fill="none" stroke="#278067"/><circle r="48" fill="none" stroke="#278067"/><path d="M-185 0H185M0-185V185" stroke="#278067"/><path class="route" d="M0 0L130-130" stroke="#60ffc8" stroke-width="4"/><circle class="pulse" cx="130" cy="-130" r="11" fill="#ffd34d"/></g>`,night,true);
  if(v.type==="sector"){let s=v.sector==="stern"?`<path d="M450 265L270 420A235 235 0 0 1 630 420Z" fill="#fff" opacity=".22"/>`:v.sector==="side"?`<path d="M450 265L250 80A245 245 0 0 0 220 305Z" fill="#ff334b" opacity=".28"/><path d="M450 265L650 80A245 245 0 0 1 680 305Z" fill="#29ff8a" opacity=".28"/>`:`<path d="M450 265L265 80A250 250 0 1 1 635 80Z" fill="#fff" opacity=".2"/>`;return wrap(`${s}${topShip(450,265,0,1.08)}`,night,false);}
  if(v.type==="vessel"||v.type==="lights"){let ls=v.lights||["white"], stack=ls.map((c,i)=>light(680,95+i*55,c)).join("");let ex=v.kind==="mine"?light(450,82,"green")+light(350,145,"green")+light(550,145,"green"):"";return wrap(`${sideShip(390,350,1.35)}${stack}${ex}`,night,false);}
  if(v.type==="sound"){let x=95;let bars=(v.pattern||[]).map(q=>{let w=q==="long"?140:46,z=`<rect x="${x}" y="205" width="${w}" height="36" rx="18" fill="${q==="long"?"#ffd34d":"#f5f8fa"}"/>`;x+=w+25;return z}).join("");return wrap(`${sideShip(215,385,.75)}${bars}<path class="route" d="M85 315Q125 270 165 315T245 315T325 315T405 315T485 315T565 315T645 315T725 315" fill="none" stroke="#70d8ff" stroke-width="6"/><text x="450" y="470" text-anchor="middle" fill="#fff" font-size="20" font-weight="900">CURTO ≈ 1 s · LONGO = 4–6 s</text>`,sea,true);}
  if(v.type==="shapes") return renderRipeamPro(card);
  if(id==="R05") return wrap(`${sideShip(330,365,1.05)}<g transform="translate(650 175)"><circle r="80" fill="#061522" stroke="#d2f2ff" stroke-width="7"/><path d="M-62 0Q0-50 62 0Q0 50-62 0Z" fill="#e4f6ff"/><circle r="20" fill="#15405a"/></g>`);
  if(id==="R06") return wrap(`${sideShip(330,365,1.05)}<g transform="translate(665 180)"><circle r="88" fill="#061522" stroke="#d2f2ff" stroke-width="7"/><path d="M0 0L48-52" stroke="#ff5261" stroke-width="10"/><circle r="9" fill="#fff"/></g>`);
  if(id==="R07") return wrap(`${topShip(270,335,30,.95)}${topShip(650,140,210,.95)}<path d="M270 335L650 140" stroke="#ff5261" stroke-width="5" stroke-dasharray="13 10"/><circle class="pulse" cx="460" cy="238" r="42" fill="none" stroke="#ffd34d" stroke-width="5"/>`,sea,true);
  if(id==="R08"||id==="R16"||id==="R17") return wrap(`${topShip(330,360,0,1.02,"vesselA")}${topShip(600,120,180,.95,"vesselB")}${arrow(330,275,220,180)}`,sea,true);
  if(id==="R12") return wrap(`<path d="M230 390L415 95L415 390Z" fill="#f3ead6" stroke="#98a8b1" stroke-width="3"/><path d="M415 95V405" stroke="#bdc8ce" stroke-width="6"/><path d="M125 400Q400 455 640 395L600 445H165Z" fill="url(#steel)"/><path class="route" d="M720 115Q650 135 590 205" fill="none" stroke="#bcecff" stroke-width="8" marker-end="url(#carr)"/>`,sea,true);
  if(id==="R18") return wrap(`${sideShip(190,385,.62)}<path d="M360 395L450 190L540 395Z" fill="#f1e8d5"/><path d="M450 190V410" stroke="#a9b7bf" stroke-width="5"/>${sideShip(715,390,.48)}`);
  if(String(card?.category)==="traps") return wrap(`${sideShip(310,380,.9)}<path d="M690 115L820 355H560Z" fill="#ffd34d" stroke="#08131d" stroke-width="7"/><text x="690" y="310" text-anchor="middle" fill="#07131e" font-size="130" font-weight="900">!</text>`);
  return wrap(`${sideShip(405,365,1.22)}<g opacity=".8"><circle cx="680" cy="175" r="80" fill="#082337" stroke="#7fe0ff" stroke-width="5"/><path d="M640 175H720M680 135V215" stroke="#7fe0ff" stroke-width="6"/></g>`);
}
/* RIPEAM_CINEMATIC_V2_END */


function renderCardVisual(card, deckSlug) {
  if (deckSlug === "ripeam") return renderRipeamCinematic(card);
  return renderSignal(card?.code);
}

function progressMap(rows) {
  return Object.fromEntries((rows || []).map((item) => [String(item.card_key), item]));
}

function emptyMetrics() {
  return { answered: 0, correct: 0, wrong: 0, difficult: 0, studied_cards: 0, accuracy: 0 };
}

export default function FlashcardsClient({ deck, initialState }) {
  const cards = Array.isArray(deck.cards) ? deck.cards : [];
  const [language, setLanguage] = useState("pt");
  const [dark, setDark] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(cards.map((card) => String(card.id)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState(() => progressMap(initialState?.progress));
  const [metrics, setMetrics] = useState(initialState?.metrics || emptyMetrics());
  const [examMode, setExamMode] = useState(false);
  const [examQueue, setExamQueue] = useState([]);
  const [examCardId, setExamCardId] = useState(null);
  const [examChoices, setExamChoices] = useState([]);
  const [examAnswered, setExamAnswered] = useState(false);
  const [examFeedback, setExamFeedback] = useState(null);
  const [examNumber, setExamNumber] = useState(0);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  const shownAt = useRef(Date.now());
  const sessionRef = useRef({ id: null, mode: null });
  const toastTimer = useRef(null);
  const cardsById = useMemo(
    () => Object.fromEntries(cards.map((card) => [String(card.id), card])),
    [cards]
  );

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("estibordo:flashcards:language");
      const savedTheme = localStorage.getItem("estibordo:flashcards:theme");
      if (savedLanguage === "en" || savedLanguage === "pt") setLanguage(savedLanguage);
      if (savedTheme === "dark") setDark(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("estibordo:flashcards:language", language);
      localStorage.setItem("estibordo:flashcards:theme", dark ? "dark" : "light");
    } catch {}
  }, [language, dark]);

  const orderedCards = useMemo(
    () => order.map((id) => cardsById[id]).filter(Boolean),
    [order, cardsById]
  );

  const filtered = useMemo(() => {
    const q = normalize(search);
    return orderedCards.filter((card) => {
      const item = progress[String(card.id)] || {};
      const tags = Array.isArray(card.tags) ? card.tags : [];
      const tagMatch =
        filter === "all" ||
        (filter === "flags" && (card.category === "flags" || card.category === "numerals")) ||
        (filter === "numerals" && card.category === "numerals") ||
        (filter === "combinations" && card.category === "combinations") ||
        (filter === "medical" && (card.category === "medical" || tags.includes("medical"))) ||
        (filter === "distress" && tags.includes("distress")) ||
        (filter === "difficult" && item.difficult === true) ||
        (filter === "wrong" && item.last_answer_correct === false) ||
        (filter === "rules" && card.category === "rules") ||
        (filter === "lights" && card.category === "lights") ||
        (filter === "shapes" && card.category === "shapes") ||
        (filter === "sounds" && card.category === "sounds") ||
        (filter === "traps" && card.category === "traps");

      if (!tagMatch) return false;
      if (!q) return true;

      return normalize([card.code, card.name, card.pt, card.en].join(" ")).includes(q);
    });
  }, [orderedCards, filter, search, progress]);

  useEffect(() => {
    if (currentIndex >= filtered.length) setCurrentIndex(Math.max(0, filtered.length - 1));
  }, [filtered.length, currentIndex]);

  useEffect(() => {
    setFlipped(false);
    shownAt.current = Date.now();
  }, [currentIndex, filter, search, examMode]);

  useEffect(() => {
    const handle = (event) => {
      if (examMode) return;
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (event.key === "ArrowRight") moveCard(1);
      if (event.key === "ArrowLeft") moveCard(-1);
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setFlipped((value) => !value);
      }
      if (event.key.toLowerCase() === "d") void toggleDifficult();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  });

  useEffect(() => {
    return () => {
      const current = sessionRef.current;
      if (current.id) {
        fetch(`/api/flashcards/${encodeURIComponent(deck.slug)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            action: "session_finish",
            sessionId: current.id,
            status: "abandoned",
          }),
        }).catch(() => {});
      }
    };
  }, [deck.slug]);

  function showToast(message) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(""), 1900);
  }

  async function api(body) {
    const response = await fetch(`/api/flashcards/${encodeURIComponent(deck.slug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Falha ao salvar.");
    return data;
  }

  async function ensureSession(mode) {
    const current = sessionRef.current;
    if (current.id && current.mode === mode) return current.id;

    if (current.id) {
      await api({
        action: "session_finish",
        sessionId: current.id,
        status: "completed",
      }).catch(() => {});
    }

    const data = await api({ action: "session_start", mode });
    const next = { id: data.session.id, mode };
    sessionRef.current = next;
    return next.id;
  }

  function currentMeaning(card) {
    return language === "pt" ? card.pt : card.en;
  }

  function categoryLabel(card) {
    if (card.category === "flags") return language === "pt" ? "Bandeira" : "Flag";
    if (card.category === "numerals") return language === "pt" ? "Flâmula numeral" : "Numeral pennant";
    if (card.category === "medical") return language === "pt" ? "Médico" : "Medical";
    if (card.category === "rules") return language === "pt" ? "Regra" : "Rule";
    if (card.category === "lights") return language === "pt" ? "Luzes" : "Lights";
    if (card.category === "shapes") return language === "pt" ? "Marcas diurnas" : "Day shapes";
    if (card.category === "sounds") return language === "pt" ? "Sinais sonoros" : "Sound signals";
    if (card.category === "traps") return language === "pt" ? "Pegadinha de prova" : "Exam trap";
    if ((card.tags || []).includes("distress")) return "Distress";
    return language === "pt" ? "Combinação" : "Combination";
  }

  function moveCard(delta) {
    if (!filtered.length) return;
    setCurrentIndex((index) => (index + delta + filtered.length) % filtered.length);
  }

  function updateLocalAnswer(cardId, correct) {
    setMetrics((old) => {
      const answered = old.answered + 1;
      const nextCorrect = old.correct + (correct ? 1 : 0);
      return {
        ...old,
        answered,
        correct: nextCorrect,
        wrong: old.wrong + (correct ? 0 : 1),
        studied_cards: old.studied_cards + (progress[cardId]?.last_seen_at ? 0 : 1),
        accuracy: Math.round((nextCorrect / answered) * 100),
      };
    });

    setProgress((old) => {
      const previous = old[cardId] || {
        correct_count: 0,
        wrong_count: 0,
        difficult: false,
      };
      return {
        ...old,
        [cardId]: {
          ...previous,
          card_key: cardId,
          correct_count: previous.correct_count + (correct ? 1 : 0),
          wrong_count: previous.wrong_count + (correct ? 0 : 1),
          last_answer_correct: correct,
          last_seen_at: new Date().toISOString(),
        },
      };
    });
  }

  async function persistAnswer(card, correct, mode) {
    try {
      setSaving(true);
      const sessionId = await ensureSession(mode);
      const data = await api({
        action: "answer",
        sessionId,
        cardKey: String(card.id),
        correct,
        responseTimeMs: Math.max(0, Date.now() - shownAt.current),
      });
      if (data.state) {
        setMetrics(data.state.metrics);
        setProgress(progressMap(data.state.progress));
      }
    } catch (error) {
      showToast(error.message || "Não foi possível salvar o progresso.");
    } finally {
      setSaving(false);
    }
  }

  function gradeStudy(correct) {
    const card = filtered[currentIndex];
    if (!card) return;
    updateLocalAnswer(String(card.id), correct);
    showToast(correct ? "✓ Acerto registrado" : "↻ Erro salvo para revisão");
    void persistAnswer(card, correct, "study");

    if (filter === "wrong" && correct) {
      setCurrentIndex(0);
      return;
    }

    setTimeout(() => moveCard(1), 140);
  }

  async function toggleDifficult() {
    const card = filtered[currentIndex];
    if (!card) return;
    const id = String(card.id);
    const next = !(progress[id]?.difficult === true);

    setProgress((old) => ({
      ...old,
      [id]: {
        ...(old[id] || { card_key: id, correct_count: 0, wrong_count: 0 }),
        difficult: next,
      },
    }));

    setMetrics((old) => ({
      ...old,
      difficult: Math.max(0, old.difficult + (next ? 1 : -1)),
    }));

    showToast(next ? "★ Cartão marcado como difícil" : "Cartão removido dos difíceis");

    try {
      const data = await api({ action: "difficulty", cardKey: id, difficult: next });
      if (data.state) {
        setMetrics(data.state.metrics);
        setProgress(progressMap(data.state.progress));
      }
    } catch (error) {
      showToast(error.message || "Não foi possível salvar.");
    }
  }

  function shuffleCurrent() {
    if (filtered.length < 2) return;
    const visibleIds = shuffle(filtered.map((card) => String(card.id)));
    const visibleSet = new Set(visibleIds);
    setOrder((old) => [...visibleIds, ...old.filter((id) => !visibleSet.has(id))]);
    setCurrentIndex(0);
    showToast("Cartões embaralhados");
  }

  function buildChoices(correctCard) {
    let pool = filtered.filter((card) => String(card.id) !== String(correctCard.id));
    if (pool.length < 3) pool = cards.filter((card) => String(card.id) !== String(correctCard.id));
    return shuffle([correctCard, ...shuffle(pool).slice(0, 3)]);
  }

  function loadExamCard(id, queue, number) {
    const card = cardsById[id];
    if (!card) {
      setExamCardId(null);
      return;
    }
    setExamCardId(id);
    setExamChoices(buildChoices(card));
    setExamQueue(queue);
    setExamAnswered(false);
    setExamFeedback(null);
    setExamNumber(number);
    shownAt.current = Date.now();
  }

  function startExam() {
    if (!filtered.length) {
      showToast("Nenhum cartão disponível para o modo prova.");
      return;
    }

    const visibleIds = filtered.map((card) => String(card.id));
    const wrongIds = visibleIds.filter((id) => progress[id]?.last_answer_correct === false);
    const rest = shuffle(visibleIds.filter((id) => !wrongIds.includes(id)));
    const queue = [...wrongIds, ...rest];
    const [first, ...remaining] = queue;

    setExamMode(true);
    loadExamCard(first, remaining, 1);
    void ensureSession("exam").catch(() => {});
  }

  async function stopExam() {
    const current = sessionRef.current;
    if (current.id && current.mode === "exam") {
      await api({
        action: "session_finish",
        sessionId: current.id,
        status: "completed",
      }).catch(() => {});
      sessionRef.current = { id: null, mode: null };
    }
    setExamMode(false);
    setExamCardId(null);
    setExamQueue([]);
    setExamFeedback(null);
  }

  function answerExam(chosenId) {
    if (examAnswered || !examCardId) return;
    const current = cardsById[examCardId];
    const correct = String(chosenId) === String(examCardId);

    setExamAnswered(true);
    setExamFeedback({
      correct,
      text: correct
        ? language === "pt"
          ? "Correto."
          : "Correct."
        : language === "pt"
          ? `Incorreto. Resposta: ${current.pt}`
          : `Incorrect. Answer: ${current.en}`,
    });

    updateLocalAnswer(String(current.id), correct);
    if (!correct) setExamQueue((queue) => [...queue, String(current.id)]);
    void persistAnswer(current, correct, "exam");
  }

  function nextExamQuestion() {
    if (!examQueue.length) {
      setExamCardId(null);
      setExamChoices([]);
      setExamFeedback({ correct: true, text: "Revisão concluída." });
      return;
    }
    const [next, ...rest] = examQueue;
    loadExamCard(next, rest, examNumber + 1);
  }

  async function resetProgress() {
    if (!window.confirm("Apagar todo o progresso deste baralho de flashcards?")) return;
    try {
      setSaving(true);
      await api({ action: "reset" });
      setProgress({});
      setMetrics(emptyMetrics());
      sessionRef.current = { id: null, mode: null };
      setFilter("all");
      setCurrentIndex(0);
      if (examMode) setExamMode(false);
      showToast("Progresso dos flashcards resetado");
    } catch (error) {
      showToast(error.message || "Não foi possível resetar.");
    } finally {
      setSaving(false);
    }
  }

  const current = filtered[currentIndex] || null;
  const currentProgress = current ? progress[String(current.id)] || {} : {};
  const examCard = examCardId ? cardsById[examCardId] : null;
  const progressPercent = filtered.length
    ? Math.round(((currentIndex + 1) / filtered.length) * 100)
    : 0;

  return (
    <main className={`${styles.page} ${dark ? styles.dark : ""}`}>
      <section className={styles.hero}>
        <div>
          <a className={styles.backLink} href="/flashcards">← Todos os flashcards</a>
          <span className={styles.eyebrow}>{deck.subjectLabel}</span>
          <h1>{deck.title}</h1>
          <p>{deck.description}</p>
        </div>

        <div className={styles.heroActions}>
          <button type="button" onClick={() => setDark((value) => !value)}>
            {dark ? "☀ Tema claro" : "☾ Tema escuro"}
          </button>
          <button
            type="button"
            onClick={() => setLanguage((value) => (value === "pt" ? "en" : "pt"))}
          >
            {language === "pt" ? "🇧🇷 PT-BR" : "🇬🇧 English"}
          </button>
        </div>
      </section>

      <section className={styles.statsGrid} aria-label="Métricas de flashcards">
        <article><span>Acertos</span><strong>{metrics.correct}</strong></article>
        <article><span>Erros</span><strong>{metrics.wrong}</strong></article>
        <article><span>Aproveitamento</span><strong>{metrics.answered ? `${metrics.accuracy}%` : "—"}</strong></article>
        <article><span>Difíceis</span><strong>{metrics.difficult}</strong></article>
      </section>

      <section className={styles.toolbar}>
        <label className={styles.searchBox}>
          <span>⌕</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentIndex(0);
            }}
            type="search"
            placeholder="Buscar código ou termo..."
            aria-label="Buscar flashcards"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="Limpar busca">×</button>
          )}
        </label>

        <div className={styles.filters}>
          {[
            ["all", "Todos"],
            ["flags", "🏳 Bandeiras"],
            ["numerals", "🔢 Numerais"],
            ...(deck.slug === "ripeam" ? [["rules","📖 Regras"],["lights","🚦 Luzes"],["shapes","◆ Marcas"],["sounds","🔊 Sinais sonoros"],["traps","🎯 Pegadinhas"]] : []),
            ["distress", "🚨 Distress"],
            ["combinations", "🔤 Combinações"],
            ["medical", "🩺 Médico"],
            ["difficult", "★ Difíceis"],
            ["wrong", "↻ Errados"],
          ].map(([key, label]) => (
            <button
              type="button"
              key={key}
              className={filter === key ? styles.activeFilter : ""}
              onClick={() => {
                setFilter(key);
                setCurrentIndex(0);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.modeRow}>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={() => (examMode ? void stopExam() : startExam())}
          >
            {examMode ? "✕ Encerrar modo prova" : "🎯 Iniciar modo prova"}
          </button>
          <button type="button" disabled={examMode} onClick={shuffleCurrent}>
            🔀 Embaralhar
          </button>
          <span className={styles.saving}>{saving ? "Salvando..." : "Progresso salvo na sua conta"}</span>
        </div>
      </section>

      <section className={styles.studyPanel}>
        <div className={styles.panelHead}>
          <div>
            <span className={styles.modeBadge}>{examMode ? "MODO PROVA" : "MODO ESTUDO"}</span>
            <strong>{examMode ? `${cards.length} cartões no baralho` : `${filtered.length} cartões`}</strong>
          </div>
          <span>{examMode ? `Questão ${Math.max(1, examNumber)}` : filtered.length ? `${currentIndex + 1} / ${filtered.length}` : "0 / 0"}</span>
        </div>

        {!examMode && (
          <div className={styles.progressTrack}>
            <i style={{ width: `${progressPercent}%` }} />
          </div>
        )}

        {!examMode && !current && (
          <div className={styles.emptyState}>
            <strong>Nenhum cartão encontrado</strong>
            <p>Tente outro código, termo ou filtro.</p>
          </div>
        )}

        {!examMode && current && (
          <>
            <div className={styles.flashcardWrap}>
              <button
                type="button"
                className={`${styles.flashcard} ${flipped ? styles.flipped : ""}`}
                onClick={() => setFlipped((value) => !value)}
                aria-label="Virar cartão"
              >
                <div className={styles.flashcardInner}>
                  <section className={`${styles.cardFace} ${styles.cardFront}`}>
                    <div className={styles.cardTopline}>
                      <span>{categoryLabel(current)}</span>
                      {currentProgress.difficult && <b>★ Difícil</b>}
                    </div>
                    <div
                      className={styles.flagStage}
                      dangerouslySetInnerHTML={{ __html: renderCardVisual(current, deck.slug) }}
                    />
                    <div className={styles.codeBlock}>
                      <small>CÓDIGO</small>
                      <strong>{current.code}</strong>
                      <span>{current.name || categoryLabel(current)}</span>
                    </div>
                    <p>Toque no cartão para ver o significado</p>
                  </section>

                  <section className={`${styles.cardFace} ${styles.cardBack}`}>
                    <div className={styles.cardTopline}>
                      <span>{categoryLabel(current)}</span>
                      <b>{language === "pt" ? "🇧🇷 PT-BR" : "🇬🇧 English"}</b>
                    </div>
                    <div className={styles.answerContent}>
                      <small>{current.name ? `${current.code} • ${current.name}` : current.code}</small>
                      <h2>{currentMeaning(current)}</h2>
                      {current.note && <p className={styles.note}>{current.note}</p>}
                    </div>
                    <p>Toque para voltar</p>
                  </section>
                </div>
              </button>
            </div>

            <div className={styles.answerActions}>
              <button type="button" className={styles.wrongButton} onClick={() => gradeStudy(false)}>✕ Errei</button>
              <button
                type="button"
                className={`${styles.difficultButton} ${currentProgress.difficult ? styles.marked : ""}`}
                onClick={() => void toggleDifficult()}
              >
                {currentProgress.difficult ? "★ Difícil" : "☆ Marcar difícil"}
              </button>
              <button type="button" className={styles.correctButton} onClick={() => gradeStudy(true)}>✓ Acertei</button>
            </div>

            <div className={styles.navigationRow}>
              <button type="button" onClick={() => moveCard(-1)} disabled={filtered.length <= 1}>← Anterior</button>
              <button type="button" onClick={() => moveCard(1)} disabled={filtered.length <= 1}>Próximo →</button>
            </div>
          </>
        )}

        {examMode && (
          <div className={styles.examArea}>
            {examCard ? (
              <article className={styles.examCard}>
                <div className={styles.cardTopline}>
                  <span>{categoryLabel(examCard)}</span>
                  <b>Questão {examNumber}</b>
                </div>
                <div
                  className={styles.examFlag}
                  dangerouslySetInnerHTML={{ __html: renderCardVisual(examCard, deck.slug) }}
                />
                <p>{language === "pt" ? "Qual é o significado deste sinal?" : "What is the meaning of this signal?"}</p>
                <h2>{examCard.code}</h2>
                {examCard.name && <h3>{examCard.name}</h3>}

                <div className={styles.options}>
                  {examChoices.map((choice) => {
                    const choiceId = String(choice.id);
                    const correctChoice = examAnswered && choiceId === String(examCard.id);
                    return (
                      <button
                        key={choiceId}
                        type="button"
                        disabled={examAnswered}
                        className={correctChoice ? styles.correctOption : ""}
                        onClick={() => answerExam(choiceId)}
                      >
                        {currentMeaning(choice)}
                      </button>
                    );
                  })}
                </div>

                {examFeedback && (
                  <div className={`${styles.examFeedback} ${examFeedback.correct ? styles.feedbackCorrect : styles.feedbackWrong}`}>
                    {examFeedback.text}
                  </div>
                )}

                {examAnswered && (
                  <button type="button" className={styles.primaryButton} onClick={nextExamQuestion}>
                    Próxima questão →
                  </button>
                )}
              </article>
            ) : (
              <div className={styles.examComplete}>
                <strong>✓ Revisão concluída</strong>
                <p>Os erros permanecem disponíveis no filtro “Errados” até serem acertados.</p>
                <button type="button" className={styles.primaryButton} onClick={() => void stopExam()}>Voltar ao estudo</button>
              </div>
            )}
          </div>
        )}
      </section>

      <section className={styles.footerPanel}>
        <div>
          <span>MÉTRICAS EXCLUSIVAS DE FLASHCARDS</span>
          <h2>Seu progresso fica salvo no banco de flashcards.</h2>
          <p>
            Acertos, erros, cartões difíceis e sessões são independentes das provas e simulados do PSCPP.
          </p>
        </div>
        <button type="button" onClick={() => void resetProgress()}>Resetar progresso deste baralho</button>
      </section>

      {toast && <div className={styles.toast} role="status">{toast}</div>}
    </main>
  );
}
