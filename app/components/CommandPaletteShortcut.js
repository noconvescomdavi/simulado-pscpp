"use client";
import {useEffect} from "react";
const editable=el=>el&&(["INPUT","TEXTAREA","SELECT"].includes(el.tagName)||el.isContentEditable);
export default function CommandPaletteShortcut(){useEffect(()=>{const onKey=e=>{if(editable(e.target))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();document.querySelector('form input[name="q"]')?.focus()}if(/^\d$/.test(e.key)){window.dispatchEvent(new CustomEvent("estibordo:answer-shortcut",{detail:Number(e.key)}))}};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[]);return null;}
