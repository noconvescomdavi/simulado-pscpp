"use client";
import {useEffect} from "react";
export default function RecaptchaWidget(){
 const siteKey=process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
 useEffect(()=>{
  if(!siteKey||document.querySelector('script[data-estibordo-recaptcha]'))return;
  const s=document.createElement("script");
  s.src="https://www.google.com/recaptcha/api.js";
  s.async=true;s.defer=true;s.dataset.estibordoRecaptcha="1";
  document.head.appendChild(s);
 },[siteKey]);
 if(!siteKey)return <div className="securityNote">reCAPTCHA será ativado quando a chave do site estiver configurada.</div>;
 return <div className="turnstileWrap"><div className="g-recaptcha" data-sitekey={siteKey}/></div>;
}