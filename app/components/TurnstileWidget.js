"use client";
import {useEffect} from "react";
export default function TurnstileWidget(){
 const siteKey=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
 useEffect(()=>{if(!siteKey||document.querySelector('script[data-estibordo-turnstile]'))return;const s=document.createElement("script");s.src="https://challenges.cloudflare.com/turnstile/v0/api.js";s.async=true;s.defer=true;s.dataset.estibordoTurnstile="1";document.head.appendChild(s)},[siteKey]);
 if(!siteKey)return <div className="securityNote">Proteção anti-bot será ativada quando a chave Turnstile estiver configurada.</div>;
 return <div className="turnstileWrap"><div className="cf-turnstile" data-sitekey={siteKey} data-theme="light"/></div>;
}