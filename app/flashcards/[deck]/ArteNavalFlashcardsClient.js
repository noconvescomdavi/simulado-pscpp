"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./arte-naval.module.css";

const ARTE_NAVAL_SLUG = "arte-naval-nomenclatura-navio";
const SESSION_SIZE = 20;

const GROUPS = [
  ["all", "Todos"],
  ["hull", "⚓ Casco e regiões"],
  ["structure", "▦ Estrutura"],
  ["decks", "▤ Conveses e superestrutura"],
  ["compartments", "▣ Compartimentos e tanques"],
  ["systems", "⚙ Equipamentos e sistemas"],
  ["unseen", "○ Não estudados"],
  ["mastered", "✓ Dominados"],
  ["difficult", "★ Difíceis"],
  ["wrong", "↻ Errados"],
];

const VISUAL_LABELS = {
  bow: "Proa e região de vante",
  stern: "Popa e região de ré",
  starboard: "Boreste",
  port: "Bombordo",
  midship: "Meia-nau",
  waterline: "Plano de flutuação",
  section: "Seção do casco",
  side: "Costado",
  plating: "Chapeamento",
  superstructure: "Superestrutura",
  structure: "Estrutura do casco",
  frame: "Estrutura transversal",
  bulkhead: "Antepara",
  deck: "Convés",
  compartment: "Compartimento",
  tank: "Tanque",
  shaft: "Linha de eixo",
  anchor: "Fundeio",
  opening: "Abertura no casco/superestrutura",
  hull: "Casco",
  ship: "Navio",
};

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
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function progressMap(rows) {
  return Object.fromEntries((rows || []).map((item) => [String(item.card_key), item]));
}

function emptyMetrics() {
  return { answered: 0, correct: 0, wrong: 0, difficult: 0, studied_cards: 0, accuracy: 0 };
}

function visualType(card) {
  return String(card?.visual?.type || "ship");
}

function navalGroup(card) {
  const type = visualType(card);
  if (["ship", "hull", "bow", "stern", "starboard", "port", "midship", "waterline", "side", "section"].includes(type)) return "hull";
  if (["structure", "frame", "bulkhead", "plating"].includes(type)) return "structure";
  if (["deck", "superstructure", "opening"].includes(type)) return "decks";
  if (["compartment", "tank"].includes(type)) return "compartments";
  if (["shaft", "anchor"].includes(type)) return "systems";
  return "hull";
}

function isMastered(item) {
  return Boolean(item?.last_answer_correct) && Number(item?.correct_count || 0) >= 2;
}

function termPt(card) {
  return String(card?.term_pt || card?.name || "—").split(" • ")[0].trim();
}

function termEn(card) {
  return String(card?.term_en || "—").trim();
}

function frontTitle(card) {
  return String(card?.front_title || termPt(card)).trim();
}

function cardSearchText(card) {
  return normalize([
    card?.code,
    card?.name,
    card?.term_pt,
    card?.term_en,
    card?.pt,
    card?.en,
    ...(Array.isArray(card?.tags) ? card.tags : []),
  ].join(" "));
}

function groupLabel(card) {
  const group = navalGroup(card);
  if (group === "structure") return "Estrutura naval";
  if (group === "decks") return "Conveses e superestrutura";
  if (group === "compartments") return "Compartimentos e tanques";
  if (group === "systems") return "Equipamentos e sistemas";
  return "Casco e nomenclatura";
}

function promptFor(card, direction) {
  if (direction === "pt-en") return `Qual é o termo técnico em inglês para “${termPt(card)}”?`;
  if (direction === "en-pt") return `Qual é o termo técnico em português para “${termEn(card)}”?`;
  return "Observe a imagem e relacione-a ao termo técnico apresentado.";
}

function choiceLabel(card, direction) {
  if (direction === "pt-en") return termEn(card);
  if (direction === "en-pt") return termPt(card);
  return `${termPt(card)} · ${termEn(card)}`;
}

function markerFor(type) {
  const map = {
    bow: [118, 190], stern: [487, 195], starboard: [370, 190], port: [230, 190],
    midship: [300, 190], waterline: [300, 222], section: [300, 225], side: [425, 194],
    plating: [405, 210], superstructure: [300, 116], structure: [300, 215], frame: [300, 210],
    bulkhead: [338, 165], deck: [300, 150], compartment: [300, 172], tank: [360, 215],
    shaft: [438, 227], anchor: [132, 235], opening: [250, 134], hull: [300, 205], ship: [300, 182],
  };
  return map[type] || map.ship;
}

const SHIP_HANDLING_VISUALS = {
  "AN1-147": {
    "image": "/flashcards/arte-naval/ship-handling/AN1-147.jpg",
    "page": 29,
    "caption": "Tipos de leme",
    "source_file": "AN-SH-0041_leme_p029.jpg"
  },
  "AN1-150": {
    "image": "/flashcards/arte-naval/ship-handling/AN1-150.jpg",
    "page": 32,
    "caption": "Geometria e esforços no leme",
    "source_file": "AN-SH-0049_leme-governo_p032.jpg"
  },
  "AN1-210": {
    "image": "/flashcards/arte-naval/ship-handling/AN1-210.jpg",
    "page": 32,
    "caption": "Geometria e atuação do leme",
    "source_file": "AN-SH-0049_leme-governo_p032.jpg"
  },
  "AN1-202": {
    "image": "/flashcards/arte-naval/ship-handling/AN1-202.jpg",
    "page": 17,
    "caption": "Convés de manobra de vante e aparelho de fundear",
    "source_file": "AN-SH-0011_ancora-amarra-molinete_p017.jpg"
  },
  "AN1-203": {
    "image": "/flashcards/arte-naval/ship-handling/AN1-203.jpg",
    "page": 17,
    "caption": "Amarra e aparelho de fundear",
    "source_file": "AN-SH-0011_ancora-amarra-molinete_p017.jpg"
  },
  "AN1-205": {
    "image": "/flashcards/arte-naval/ship-handling/AN1-205.jpg",
    "page": 17,
    "caption": "Equipamento do convés de manobra",
    "source_file": "AN-SH-0011_ancora-amarra-molinete_p017.jpg"
  },
  "AN1-206": {
    "image": "/flashcards/arte-naval/ship-handling/AN1-206.jpg",
    "page": 17,
    "caption": "Molinete e amarra",
    "source_file": "AN-SH-0011_ancora-amarra-molinete_p017.jpg"
  },
  "AN1-103": {
    "image": "/flashcards/arte-naval/ship-handling/AN1-103.jpg",
    "page": 17,
    "caption": "Aparelho de fundear / hawse pipe",
    "source_file": "AN-SH-0011_ancora-amarra-molinete_p017.jpg"
  }
};

function shipHandlingVisual(card) {
  return SHIP_HANDLING_VISUALS[String(card?.id || "")] || null;
}

function visualAsset(card) {
  const curated = shipHandlingVisual(card);
  if (curated?.image) return curated.image;
  const explicit = String(card?.visual?.image || card?.image || "").trim();
  if (explicit) return explicit;
  const id = String(card?.id || "").trim();
  return /^AN1-\d{3}$/.test(id) ? `/flashcards/arte-naval/${id}.svg` : "";
}

function cardNumber(card) {
  const id = String(card?.id || "");
  const modern = id.match(/AN1-(\d+)/);
  if (modern) return Number(modern[1]);
  const legacy = id.match(/AN(\d{3})[A-Z]?/i);
  return legacy ? Number(legacy[1]) : 0;
}

function bookFigureFor(card) {
  const n = cardNumber(card);
  const exact = {
    33:"1-6",38:"1-7",39:"1-7",40:"1-7",41:"1-7",42:"1-7",43:"1-12",
    95:"1-20",100:"1-22",101:"1-23",103:"1-25",105:"1-26",
    106:"1-11",107:"1-5",111:"1-9",113:"1-10",
    137:"1-21",139:"1-22",140:"1-24",145:"1-27",147:"1-31",
    148:"1-28",149:"1-29",151:"1-30",157:"1-32",158:"1-33",
    160:"1-34",161:"1-34",162:"1-35a",163:"1-35b",165:"1-36",
    170:"1-38",171:"1-39",176:"1-40",178:"1-41",179:"1-42",
    180:"1-43",181:"1-44",186:"1-45",187:"1-46",188:"1-47",
    190:"1-48",191:"1-49",192:"1-50",193:"1-51",194:"1-52",
    198:"1-53",204:"1-25",205:"1-54",210:"1-55",211:"1-56a",
    212:"1-56a",215:"1-56b",216:"1-56b",224:"1-57",228:"1-58",
    229:"1-59",232:"1-60",234:"1-61"
  };
  if (exact[n]) return exact[n];
  if (n <= 32) return "1-3";
  if (n <= 44) return "1-4b";
  if (n <= 77) return n <= 59 ? "1-13b" : (n <= 71 ? "1-14" : "1-16");
  if (n <= 96) return n <= 90 ? "1-17a" : (n <= 94 ? "1-18" : "1-19");
  if (n <= 105) return "1-21";
  if (n <= 116) return "1-11";
  if (n <= 136) return n <= 124 ? "1-17a" : "1-18";
  if (n <= 156) return "1-31";
  if (n <= 176) return "1-40";
  if (n <= 185) return "1-43";
  if (n <= 209) return "1-54";
  if (n <= 216) return "1-56a";
  return "1-61";
}

function referenceFamily(card) {
  const n = cardNumber(card);
  if (n <= 44) return "exterior";
  if (n <= 77) return "structure";
  if (n <= 136) return "compartments";
  if (n <= 156) return "appendages";
  if (n <= 176) return "deck";
  if (n <= 185) return "interior";
  if (n <= 209) return "fittings";
  if (n <= 216) return "rigging";
  return "equipment";
}

function NavalVisual({ card, reveal = false, compact = false, onZoom }) {
  const figure = bookFigureFor(card);
  const family = referenceFamily(card);
  const asset = visualAsset(card);
  if (asset) return <img className={`${styles.navalVisual} ${compact ? styles.compactVisual : ''}`} src={asset} alt={reveal ? `${termPt(card)}, ${termEn(card)}` : 'Referência visual do cartão'} onClick={onZoom} />;
  const type = visualType(card);
  const [mx, my] = markerFor(type);
  const showRibs = ["structure", "frame", "section", "bulkhead", "plating"].includes(type);
  const showDecks = ["deck", "superstructure", "compartment", "opening"].includes(type);
  const showWaterline = type === "waterline";
  const showAnchor = type === "anchor";
  const showShaft = type === "shaft";
  const showTank = type === "tank";
  const showOpening = type === "opening";
  const accessible = reveal ? `${termPt(card)}, ${termEn(card)}` : `Diagrama naval com área destacada. ${VISUAL_LABELS[type] || "Nomenclatura naval"}.`;

  return (
    <svg className={`${styles.navalVisual} ${compact ? styles.compactVisual : ""}`} viewBox="0 0 600 330" role="img" aria-label={accessible}>
      <defs>
        <linearGradient id={`sky-${card.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07131f" />
          <stop offset="0.65" stopColor="#0d3550" />
          <stop offset="1" stopColor="#176786" />
        </linearGradient>
        <linearGradient id={`steel-${card.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#edf3f6" />
          <stop offset="0.55" stopColor="#a9bac5" />
          <stop offset="0.56" stopColor="#667b88" />
          <stop offset="1" stopColor="#314754" />
        </linearGradient>
        <filter id={`glow-${card.id}`}>
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width="600" height="330" rx="26" fill={`url(#sky-${card.id})`} />
      <circle cx="492" cy="62" r="34" fill="#f5c98c" opacity=".68" />
      <path d="M0 240 Q78 224 150 241 T300 240 T450 240 T600 238 V330 H0Z" fill="#0a5776" />
      <path d="M0 266 Q90 250 180 267 T360 265 T540 267 T620 263" fill="none" stroke="#8bd8ee" strokeWidth="3" opacity=".26" />

      <g>
        <path d="M66 187 L119 151 H439 L532 190 L489 244 H144 Z" fill={`url(#steel-${card.id})`} stroke="#f6fbfd" strokeWidth="4" />
        <path d="M224 151 V109 H373 V151 M264 109 V82 H339 V109" fill="#c8d5dc" stroke="#f5fafc" strokeWidth="4" />
        <path d="M145 224 H489" stroke="#536b78" strokeWidth="3" opacity=".8" />
        <path d="M300 82 V52 M300 52 H349" stroke="#b8c7d0" strokeWidth="4" />
      </g>

      {showWaterline && <line x1="68" y1="219" x2="529" y2="219" stroke="#63c7f2" strokeWidth="8" strokeDasharray="17 9" />}
      {showRibs && (
        <g fill="none" stroke="#6e8593" strokeWidth="5">
          <path d="M174 208 Q300 286 426 208" />
          <path d="M215 224 Q300 268 385 224" />
          <path d="M258 235 V175 M300 244 V164 M342 235 V175" />
        </g>
      )}
      {showDecks && (
        <g fill="none" stroke="#68808f" strokeWidth="6">
          <path d="M188 177 H414" />
          <path d="M224 145 H376" />
          <path d="M256 115 H345" />
        </g>
      )}
      {showAnchor && (
        <g fill="none" stroke="#e7eef2" strokeWidth="8">
          <path d="M132 126 V211 M103 160 H161" />
          <path d="M81 206 Q132 258 183 206 M81 206 H99 M183 206 H165" />
        </g>
      )}
      {showShaft && (
        <g fill="none" stroke="#e5d05c" strokeWidth="7">
          <path d="M319 225 H474" />
          <circle cx="482" cy="225" r="21" />
          <path d="M482 204 V246 M461 225 H503" />
        </g>
      )}
      {showTank && <rect x="315" y="183" width="89" height="50" rx="7" fill="#59b9dc" opacity=".55" stroke="#bfeeff" strokeWidth="4" />}
      {showOpening && <rect x="234" y="119" width="34" height="28" rx="4" fill="#06111c" stroke="#e9f4f8" strokeWidth="4" />}

      {family === "structure" && (
        <g opacity=".65" fill="none" stroke="#d7eef8" strokeWidth="3">
          <path d="M135 233 Q300 302 465 233" />
          <path d="M170 220 Q300 270 430 220" />
          <path d="M220 200 V242 M260 186 V254 M300 178 V260 M340 186 V254 M380 200 V242" />
        </g>
      )}
      {family === "compartments" && (
        <g opacity=".48" fill="none" stroke="#d7eef8" strokeWidth="3">
          <rect x="175" y="128" width="250" height="112" rx="3" />
          <line x1="238" y1="128" x2="238" y2="240" />
          <line x1="300" y1="128" x2="300" y2="240" />
          <line x1="362" y1="128" x2="362" y2="240" />
          <line x1="175" y1="184" x2="425" y2="184" />
        </g>
      )}
      {family === "deck" && (
        <g opacity=".55" fill="none" stroke="#d7eef8" strokeWidth="3">
          <path d="M145 180 H455" />
          <path d="M165 205 H435" />
          <circle cx="210" cy="192" r="14" /><circle cx="390" cy="192" r="14" />
        </g>
      )}
      {family === "fittings" && (
        <g opacity=".6" fill="none" stroke="#d7eef8" strokeWidth="4">
          <circle cx="220" cy="190" r="22" /><circle cx="380" cy="190" r="22" />
          <path d="M220 212 V238 M380 212 V238" />
        </g>
      )}
      {family === "rigging" && (
        <g opacity=".6" fill="none" stroke="#d7eef8" strokeWidth="3">
          <path d="M300 58 V230 M300 92 L190 210 M300 92 L410 210 M300 130 H395" />
        </g>
      )}

      <g filter={`url(#glow-${card.id})`}>
        <circle cx={mx} cy={my} r="22" fill="#e33131" opacity=".28" />
        <circle cx={mx} cy={my} r="11" fill="#e33131" stroke="#fff" strokeWidth="4" />
      </g>
      <path d={`M${mx} ${my - 13} L${mx} ${Math.max(42, my - 70)}`} stroke="#ef4141" strokeWidth="4" strokeDasharray="7 5" />

      {!reveal && (
        <g>
          <rect x="168" y="270" width="264" height="41" rx="18" fill="rgba(2,9,15,.78)" stroke="rgba(255,255,255,.12)" />
          <text x="300" y="291" textAnchor="middle" fill="#f5f8fa" fontSize="14" fontWeight="800">REFERÊNCIA TÉCNICA · FIG. {figure}</text>
          <text x="300" y="306" textAnchor="middle" fill="#9fcbe0" fontSize="10" fontWeight="700">redesenho vetorial ESTIBORDO</text>
        </g>
      )}
      {reveal && (
        <g>
          <rect x="104" y="266" width="392" height="52" rx="15" fill="rgba(2,9,15,.86)" stroke="rgba(255,255,255,.14)" />
          <text x="300" y="289" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="900">{termPt(card)}</text>
          <text x="300" y="309" textAnchor="middle" fill="#a9d6ed" fontSize="12" fontWeight="800">{termEn(card)}</text>
        </g>
      )}
    </svg>
  );
}

export default function ArteNavalFlashcardsClient({ deck, initialState }) {
  const cards = Array.isArray(deck.cards) ? deck.cards : [];
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("visual");
  const [dark, setDark] = useState(false);
  const [order, setOrder] = useState(cards.map((card) => String(card.id)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState(() => progressMap(initialState?.progress));
  const [metrics, setMetrics] = useState(initialState?.metrics || emptyMetrics());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [examMode, setExamMode] = useState(false);
  const [examQueue, setExamQueue] = useState([]);
  const [examCardId, setExamCardId] = useState(null);
  const [examChoices, setExamChoices] = useState([]);
  const [examAnswered, setExamAnswered] = useState(false);
  const [examFeedback, setExamFeedback] = useState(null);
  const [examNumber, setExamNumber] = useState(0);
  const [examCorrect, setExamCorrect] = useState(0);
  const [examTotal, setExamTotal] = useState(0);
  const [imageZoom, setImageZoom] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const shownAt = useRef(Date.now());
  const sessionRef = useRef({ id: null, mode: null });
  const toastTimer = useRef(null);

  const cardsById = useMemo(() => Object.fromEntries(cards.map((card) => [String(card.id), card])), [cards]);
  const orderedCards = useMemo(() => order.map((id) => cardsById[id]).filter(Boolean), [order, cardsById]);

  const studiedCount = useMemo(() => Object.values(progress).filter((item) => item?.last_seen_at).length, [progress]);
  const masteredCount = useMemo(() => Object.values(progress).filter(isMastered).length, [progress]);
  const wrongCount = useMemo(() => Object.values(progress).filter((item) => item?.last_answer_correct === false).length, [progress]);
  const unseenCount = Math.max(0, cards.length - studiedCount);
  const coveragePercent = cards.length ? Math.round((studiedCount / cards.length) * 100) : 0;

  const filtered = useMemo(() => {
    const query = normalize(search);
    return orderedCards.filter((card) => {
      const item = progress[String(card.id)] || {};
      const group = navalGroup(card);
      const statusMatch =
        filter === "all" ||
        filter === group ||
        (filter === "unseen" && !item.last_seen_at) ||
        (filter === "mastered" && isMastered(item)) ||
        (filter === "difficult" && item.difficult === true) ||
        (filter === "wrong" && item.last_answer_correct === false);
      if (!statusMatch) return false;
      return !query || cardSearchText(card).includes(query);
    });
  }, [orderedCards, filter, search, progress]);

  const current = filtered[currentIndex] || null;
  const currentProgress = current ? progress[String(current.id)] || {} : {};
  const examCard = examCardId ? cardsById[examCardId] : null;
  const progressPercent = filtered.length ? Math.round(((currentIndex + 1) / filtered.length) * 100) : 0;

  useEffect(() => {
    try {
      const theme = localStorage.getItem("estibordo:arte-naval-flashcards:theme");
      const savedDirection = localStorage.getItem("estibordo:arte-naval-flashcards:direction");
      if (theme === "dark") setDark(true);
      if (["visual", "pt-en", "en-pt"].includes(savedDirection)) setDirection(savedDirection);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("estibordo:arte-naval-flashcards:theme", dark ? "dark" : "light");
      localStorage.setItem("estibordo:arte-naval-flashcards:direction", direction);
    } catch {}
  }, [dark, direction]);

  useEffect(() => {
    if (currentIndex >= filtered.length) setCurrentIndex(Math.max(0, filtered.length - 1));
  }, [filtered.length, currentIndex]);

  useEffect(() => {
    setFlipped(false);
    shownAt.current = Date.now();
  }, [currentIndex, filter, search, direction, examMode]);

  useEffect(() => {
    const handle = (event) => {
      if (examMode || ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
      if (event.key === "ArrowRight") moveCard(1);
      if (event.key === "ArrowLeft") moveCard(-1);
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setFlipped((value) => !value);
      }
      if (event.key === "1") gradeStudy(false);
      if (event.key === "2") void toggleDifficult();
      if (event.key === "3") gradeStudy(true);
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  });

  useEffect(() => {
    return () => {
      const currentSession = sessionRef.current;
      if (currentSession.id) {
        fetch(`/api/flashcards/${encodeURIComponent(deck.slug)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({ action: "session_finish", sessionId: currentSession.id, status: "abandoned" }),
        }).catch(() => {});
      }
    };
  }, [deck.slug]);

  function showToast(message) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(""), 2000);
  }

  async function api(body) {
    const response = await fetch(`/api/flashcards/${encodeURIComponent(deck.slug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Não foi possível salvar.");
    return data;
  }

  async function ensureSession(mode) {
    const active = sessionRef.current;
    if (active.id && active.mode === mode) return active.id;
    if (active.id) {
      await api({ action: "session_finish", sessionId: active.id, status: "completed" }).catch(() => {});
    }
    const data = await api({ action: "session_start", mode });
    sessionRef.current = { id: data.session.id, mode };
    return data.session.id;
  }

  function moveCard(delta) {
    if (!filtered.length) return;
    setCurrentIndex((index) => (index + delta + filtered.length) % filtered.length);
  }

  function updateLocalAnswer(cardId, correct) {
    setMetrics((old) => {
      const answered = Number(old.answered || 0) + 1;
      const nextCorrect = Number(old.correct || 0) + (correct ? 1 : 0);
      return {
        ...old,
        answered,
        correct: nextCorrect,
        wrong: Number(old.wrong || 0) + (correct ? 0 : 1),
        studied_cards: Number(old.studied_cards || 0) + (progress[cardId]?.last_seen_at ? 0 : 1),
        accuracy: Math.round((nextCorrect / answered) * 100),
      };
    });
    setProgress((old) => {
      const previous = old[cardId] || { correct_count: 0, wrong_count: 0, difficult: false };
      return {
        ...old,
        [cardId]: {
          ...previous,
          card_key: cardId,
          correct_count: Number(previous.correct_count || 0) + (correct ? 1 : 0),
          wrong_count: Number(previous.wrong_count || 0) + (correct ? 0 : 1),
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
    showToast(correct ? "✓ Registrado como dominado nesta revisão" : "↻ Salvo para revisão prioritária");
    void persistAnswer(card, correct, "study");
    if (filter === "wrong" && correct) {
      setCurrentIndex(0);
      return;
    }
    setTimeout(() => moveCard(1), 150);
  }

  async function toggleDifficult() {
    const card = filtered[currentIndex];
    if (!card) return;
    const id = String(card.id);
    const next = progress[id]?.difficult !== true;
    setProgress((old) => ({
      ...old,
      [id]: { ...(old[id] || { card_key: id, correct_count: 0, wrong_count: 0 }), difficult: next },
    }));
    setMetrics((old) => ({ ...old, difficult: Math.max(0, Number(old.difficult || 0) + (next ? 1 : -1)) }));
    showToast(next ? "★ Adicionado à revisão difícil" : "Removido dos difíceis");
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
    showToast("Baralho embaralhado");
  }

  function buildChoices(correctCard) {
    const sameGroup = filtered.filter((card) => String(card.id) !== String(correctCard.id) && navalGroup(card) === navalGroup(correctCard));
    const fallback = cards.filter((card) => String(card.id) !== String(correctCard.id));
    const pool = sameGroup.length >= 3 ? sameGroup : fallback;
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
      showToast("Nenhum cartão disponível neste filtro.");
      return;
    }
    const ids = filtered.map((card) => String(card.id));
    const priority = ids.filter((id) => progress[id]?.last_answer_correct === false || progress[id]?.difficult === true);
    const unseen = ids.filter((id) => !progress[id]?.last_seen_at && !priority.includes(id));
    const rest = ids.filter((id) => !priority.includes(id) && !unseen.includes(id));
    const selected = [...shuffle(priority), ...shuffle(unseen), ...shuffle(rest)].slice(0, Math.min(SESSION_SIZE, ids.length));
    const [first, ...remaining] = selected;
    setExamMode(true);
    setExamCorrect(0);
    setExamTotal(selected.length);
    loadExamCard(first, remaining, 1);
    void ensureSession("exam").catch(() => {});
  }

  async function finishExamSession() {
    const active = sessionRef.current;
    if (active.id && active.mode === "exam") {
      await api({ action: "session_finish", sessionId: active.id, status: "completed" }).catch(() => {});
      sessionRef.current = { id: null, mode: null };
    }
  }

  async function stopExam() {
    await finishExamSession();
    setExamMode(false);
    setExamCardId(null);
    setExamQueue([]);
    setExamFeedback(null);
  }

  function answerExam(chosenId) {
    if (examAnswered || !examCard) return;
    const correct = String(chosenId) === String(examCard.id);
    setExamAnswered(true);
    if (correct) setExamCorrect((value) => value + 1);
    setExamFeedback({
      correct,
      text: correct
        ? `Correto — ${termPt(examCard)} · ${termEn(examCard)}`
        : `Resposta correta: ${termPt(examCard)} · ${termEn(examCard)}`,
    });
    updateLocalAnswer(String(examCard.id), correct);
    void persistAnswer(examCard, correct, "exam");
  }

  function nextExamQuestion() {
    if (!examQueue.length) {
      setExamCardId(null);
      setExamChoices([]);
      void finishExamSession();
      return;
    }
    const [next, ...remaining] = examQueue;
    loadExamCard(next, remaining, examNumber + 1);
  }

  async function resetProgress() {
    if (!window.confirm("Apagar todo o progresso deste baralho de Arte Naval?")) return;
    try {
      setSaving(true);
      const data = await api({ action: "reset" });
      setMetrics(data.state?.metrics || emptyMetrics());
      setProgress(progressMap(data.state?.progress));
      setFilter("all");
      setCurrentIndex(0);
      setExamMode(false);
      sessionRef.current = { id: null, mode: null };
      showToast("Progresso de Arte Naval zerado");
    } catch (error) {
      showToast(error.message || "Não foi possível resetar.");
    } finally {
      setSaving(false);
    }
  }

  const frontTerm = current
    ? direction === "pt-en" ? termPt(current) : direction === "en-pt" ? termEn(current) : null
    : null;

  return (
    <main className={`${styles.page} ${dark ? styles.dark : ""}`}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <a className={styles.backLink} href="/flashcards">← Todos os flashcards</a>
          <span className={styles.eyebrow}>ARTE NAVAL · CAPÍTULO 1</span>
          <h1>Nomenclatura do Navio</h1>
          <p>{deck.description}</p>
          <div className={styles.heroBadges}>
            <span>{cards.length} cartões</span>
            <span>PT-BR ↔ English</span>
            <span>Progresso sincronizado</span>
          </div>
        </div>
        <div className={styles.heroProgress}>
          <div className={styles.ring} style={{ "--coverage": `${coveragePercent * 3.6}deg` }}>
            <div><strong>{coveragePercent}%</strong><span>cobertura</span></div>
          </div>
          <small>{studiedCount} de {cards.length} cartões estudados</small>
          <button type="button" onClick={() => setDark((value) => !value)}>{dark ? "☀ Tema claro" : "☾ Tema escuro"}</button>
        </div>
      </section>

      <section className={styles.featureStrip}>
        <div><b>◫</b><span>Biblioteca visual</span><small>Imagens e diagramas por termo</small></div>
        <div><b>EN</b><span>PT ↔ EN</span><small>Terminologia técnica bilíngue</small></div>
        <div><b>≡</b><span>Definições oficiais</span><small>Baseadas na bibliografia de Arte Naval</small></div>
        <div><b>★</b><span>Revisão inteligente</span><small>Favoritos, erros e progresso</small></div>
      </section>

      <section className={styles.metrics} aria-label="Métricas do baralho">
        <article><span>Estudados</span><strong>{studiedCount}</strong><small>{unseenCount} ainda inéditos</small></article>
        <article><span>Dominados</span><strong>{masteredCount}</strong><small>2+ acertos e último acerto correto</small></article>
        <article><span>Aproveitamento</span><strong>{metrics.answered ? `${metrics.accuracy}%` : "—"}</strong><small>{metrics.answered || 0} respostas registradas</small></article>
        <article><span>Revisar</span><strong>{wrongCount}</strong><small>{metrics.difficult || 0} marcados como difíceis</small></article>
      </section>

      <section className={styles.studySetup}>
        <div className={styles.setupHead}>
          <div><span>COMO VOCÊ QUER TREINAR?</span><strong>Alterne o sentido da memória ativa.</strong></div>
          <div className={styles.directionTabs}>
            <button type="button" className={direction === "visual" ? styles.active : ""} onClick={() => setDirection("visual")}>Visual → termo</button>
            <button type="button" className={direction === "pt-en" ? styles.active : ""} onClick={() => setDirection("pt-en")}>PT → EN</button>
            <button type="button" className={direction === "en-pt" ? styles.active : ""} onClick={() => setDirection("en-pt")}>EN → PT</button>
          </div>
        </div>

        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <span>⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => { setSearch(event.target.value); setCurrentIndex(0); }}
              placeholder="Buscar termo, tradução, definição ou código..."
              aria-label="Buscar flashcards de Arte Naval"
            />
            {search && <button type="button" onClick={() => setSearch("")} aria-label="Limpar busca">×</button>}
          </label>
          <div className={styles.filters}>
            {GROUPS.map(([key, label]) => (
              <button
                type="button"
                key={key}
                className={filter === key ? styles.active : ""}
                onClick={() => { setFilter(key); setCurrentIndex(0); }}
              >{label}</button>
            ))}
          </div>
          <div className={styles.quickActions}>
            <button type="button" className={styles.primary} onClick={() => (examMode ? void stopExam() : startExam())}>
              {examMode ? "✕ Encerrar desafio" : `🎯 Desafio de até ${SESSION_SIZE}`}
            </button>
            <button type="button" disabled={examMode || filtered.length < 2} onClick={shuffleCurrent}>🔀 Embaralhar</button>
            {wrongCount > 0 && !examMode && <button type="button" onClick={() => { setFilter("wrong"); setCurrentIndex(0); }}>↻ Revisar erros ({wrongCount})</button>}
            <span>{saving ? "Salvando..." : "✓ Progresso salvo"}</span>
          </div>
        </div>
      </section>

      <section className={styles.studyPanel}>
        <div className={styles.panelHead}>
          <div>
            <span>{examMode ? "DESAFIO ATIVO" : "ESTUDO ATIVO"}</span>
            <strong>{examMode ? `Sessão inteligente · ${examTotal} cartões` : `${filtered.length} cartões neste recorte`}</strong>
          </div>
          <div className={styles.panelCount}>
            {examMode ? (examCard ? `${examNumber} / ${examTotal}` : "Concluído") : (filtered.length ? `${currentIndex + 1} / ${filtered.length}` : "0 / 0")}
          </div>
        </div>

        {!examMode && <div className={styles.progressTrack}><i style={{ width: `${progressPercent}%` }} /></div>}

        {!examMode && !current && (
          <div className={styles.emptyState}><strong>Nenhum cartão neste recorte.</strong><p>Troque o filtro ou limpe a busca.</p></div>
        )}

        {!examMode && current && (
          <>
            <div className={styles.flashcardWrap}>
              <button type="button" className={`${styles.flashcard} ${flipped ? styles.flipped : ""} ${current?.effect==="glow"?styles.effectGlow:""} ${current?.effect==="float"?styles.effectFloat:""} ${current?.effect==="tilt"?styles.effectTilt:""} ${current?.transition==="fast"?styles.transitionFast:""} ${current?.transition==="soft"?styles.transitionSoft:""} ${current?.transition==="dramatic"?styles.transitionDramatic:""}`} onClick={() => setFlipped((value) => !value)} aria-label="Virar flashcard">
                <div className={styles.flashcardInner}>
                  <section className={`${styles.face} ${styles.front}`}>
                    <div className={styles.cardTopline}>
                      <span>{groupLabel(current)}</span>
                      <div>{currentProgress.difficult && <b>★ Difícil</b>}<small>{current.code}</small></div>
                    </div>
                    <div className={styles.termHero}>
                      <small>{direction === "visual" ? "ARTE NAVAL · TERMO TÉCNICO" : direction === "pt-en" ? "PORTUGUÊS → INGLÊS" : "INGLÊS → PORTUGUÊS"}</small>
                      <h2>{direction === "visual" ? frontTitle(current) : frontTerm}</h2>
                      {direction === "visual" && <h3>{termEn(current)}</h3>}
                    </div>
                    <div className={styles.visualStage}><NavalVisual card={current} onZoom={() => setImageZoom(true)} /></div>
                    <div className={styles.questionBlock}><p>{promptFor(current, direction)}</p></div>
                    <div className={styles.flipHint}>Toque para revelar <kbd>ESPAÇO</kbd></div>
                  </section>

                  <section className={`${styles.face} ${styles.back}`}>
                    <div className={styles.cardTopline}>
                      <span>RESPOSTA · ARTE NAVAL</span>
                      <small>{current.code}</small>
                    </div>
                    <div className={styles.answerGrid}>
                      <div className={styles.answerVisual}><NavalVisual card={current} reveal compact /></div>
                      <div className={styles.answerText}>
                        <small>TERMO TÉCNICO</small>
                        <h2>{termPt(current)}</h2>
                        <h3>{termEn(current)}</h3>
                        <div className={styles.definition}><span>DEFINIÇÃO</span><p>{current.pt}</p></div>
                        <div className={styles.learningCallout}>
                          <strong>Pontos para fixação</strong>
                          <ul>
                            <li>Associe o termo em português ao equivalente técnico em inglês.</li>
                            <li>Observe forma, posição e função do elemento na embarcação.</li>
                            <li>Use a definição da bibliografia como referência principal.</li>
                          </ul>
                        </div>
                        <div className={styles.sourceLine}>
                          <span>Fontes</span>
                          <strong>Definição: Arte Naval · Volume 1 · 8ª edição · Fig. {bookFigureFor(current)}</strong>
                          {shipHandlingVisual(current) && <small>Referência visual complementar: Hervé Baudu · Ship Handling · p. {shipHandlingVisual(current).page} · {shipHandlingVisual(current).caption}</small>}
                        </div>
                      </div>
                    </div>
                    <div className={styles.flipHint}>Toque para voltar <kbd>ESPAÇO</kbd></div>
                  </section>
                </div>
              </button>
            </div>

            <div className={styles.gradeRow}>
              <button type="button" className={styles.wrong} onClick={() => gradeStudy(false)}><span>1</span> Ainda não sei</button>
              <button type="button" className={`${styles.difficult} ${currentProgress.difficult ? styles.marked : ""}`} onClick={() => void toggleDifficult()}><span>2</span>{currentProgress.difficult ? "★ Difícil" : "☆ Marcar difícil"}</button>
              <button type="button" className={styles.correct} onClick={() => gradeStudy(true)}><span>3</span> Sei</button>
            </div>

            <div className={styles.navigation}>
              <button type="button" onClick={() => moveCard(-1)} disabled={filtered.length <= 1}>← Anterior</button>
              <div><kbd>←</kbd><kbd>→</kbd> navegar · <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> classificar</div>
              <button type="button" onClick={() => moveCard(1)} disabled={filtered.length <= 1}>Próximo →</button>
            </div>
            <div className={styles.cardTools}>
              <button type="button" onClick={() => setImageZoom(true)}>⌕ Ampliar imagem</button>
              <button type="button" onClick={() => setNoteOpen((v) => !v)}>✎ {noteOpen ? "Fechar anotação" : "Anotação rápida"}</button>
              <button type="button" onClick={() => void toggleDifficult()}>{currentProgress.difficult ? "★ Favoritado" : "☆ Favoritar"}</button>
            </div>
            {noteOpen && <textarea className={styles.noteBox} placeholder="Anote aqui uma associação, dúvida ou detalhe para revisar. A anotação é local desta sessão e não altera a bibliografia." />}
          </>
        )}

        {examMode && (
          <div className={styles.examArea}>
            {examCard ? (
              <article className={styles.examCard}>
                <div className={styles.cardTopline}><span>DESAFIO · {groupLabel(examCard)}</span><small>{examNumber} / {examTotal}</small></div>
                <div className={styles.examVisual}><NavalVisual card={examCard} /></div>
                <div className={styles.examPrompt}>
                  <small>{direction === "visual" ? "IDENTIFICAÇÃO" : "TRADUÇÃO TÉCNICA"}</small>
                  <h2>{promptFor(examCard, direction)}</h2>
                  <span>{examCard.code}</span>
                </div>
                <div className={styles.options}>
                  {examChoices.map((choice) => {
                    const id = String(choice.id);
                    const isCorrect = examAnswered && id === String(examCard.id);
                    const isChosenWrong = examAnswered && examFeedback?.chosenId === id && !isCorrect;
                    return (
                      <button
                        type="button"
                        key={id}
                        disabled={examAnswered}
                        className={`${isCorrect ? styles.correctOption : ""} ${isChosenWrong ? styles.wrongOption : ""}`}
                        onClick={() => {
                          setExamFeedback((old) => ({ ...(old || {}), chosenId: id }));
                          answerExam(id);
                        }}
                      >{choiceLabel(choice, direction)}</button>
                    );
                  })}
                </div>
                {examFeedback && <div className={`${styles.feedback} ${examFeedback.correct ? styles.feedbackCorrect : styles.feedbackWrong}`}>{examFeedback.text}</div>}
                {examAnswered && <button type="button" className={styles.primary} onClick={nextExamQuestion}>Próximo cartão →</button>}
              </article>
            ) : (
              <div className={styles.examComplete}>
                <span>DESAFIO CONCLUÍDO</span>
                <strong>{examCorrect} / {examTotal}</strong>
                <p>{examTotal ? `${Math.round((examCorrect / examTotal) * 100)}% de aproveitamento nesta sessão.` : "Sessão concluída."}</p>
                <div>
                  {wrongCount > 0 && <button type="button" onClick={() => { setFilter("wrong"); void stopExam(); }}>Revisar erros</button>}
                  <button type="button" className={styles.primary} onClick={() => void stopExam()}>Voltar ao estudo</button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className={styles.learningPanel}>
        <div>
          <span>REVISÃO INTELIGENTE</span>
          <h2>O baralho agora diferencia cobertura, domínio, erro recente e dificuldade.</h2>
          <p>Use “Não estudados” para avançar, “Errados” para recuperação ativa e “Dominados” para auditoria do conteúdo já consolidado.</p>
        </div>
        <div className={styles.learningNumbers}>
          <div><strong>{unseenCount}</strong><span>não estudados</span></div>
          <div><strong>{wrongCount}</strong><span>erros recentes</span></div>
          <div><strong>{masteredCount}</strong><span>dominados</span></div>
        </div>
        <button type="button" className={styles.reset} onClick={() => void resetProgress()}>Resetar progresso</button>
      </section>

      {imageZoom && current && (
        <div className={styles.zoomModal} role="dialog" aria-modal="true" onClick={() => setImageZoom(false)}>
          <button type="button" aria-label="Fechar" onClick={() => setImageZoom(false)}>×</button>
          <div onClick={(e) => e.stopPropagation()}><NavalVisual card={current} reveal /></div>
          <strong>{termPt(current)} · {termEn(current)}</strong>
        </div>
      )}
      {toast && <div className={styles.toast} role="status">{toast}</div>}
    </main>
  );
}

export { ARTE_NAVAL_SLUG };
