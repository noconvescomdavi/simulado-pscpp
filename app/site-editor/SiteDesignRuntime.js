'use client';

import { useEffect } from 'react';
import design from '../../data/site/editor-design.json';

const SAFE_STYLE_KEYS = new Set([
  'fontSize','fontWeight','fontFamily','textAlign','letterSpacing','lineHeight',
  'color','backgroundColor','backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat',
  'width','height','minWidth','maxWidth','minHeight','maxHeight',
  'paddingTop','paddingRight','paddingBottom','paddingLeft',
  'marginTop','marginRight','marginBottom','marginLeft',
  'borderRadius','borderWidth','borderStyle','borderColor',
  'display','flexDirection','justifyContent','alignItems','alignContent','flexWrap','gap','rowGap','columnGap',
  'gridTemplateColumns','gridTemplateRows','gridAutoFlow','order',
  'position','top','right','bottom','left','zIndex','opacity','overflow','objectFit','objectPosition'
]);

function safeUrl(value) {
  const v = String(value || '').trim();
  if (!v) return '';
  if (/^(javascript|data|vbscript):/i.test(v)) return '';
  return v;
}

function applyRecord(record) {
  if (!record || typeof record !== 'object') return;

  for (const [selector, config] of Object.entries(record)) {
    if (!selector || !config || typeof config !== 'object') continue;
    let nodes = [];
    try { nodes = Array.from(document.querySelectorAll(selector)); } catch { continue; }

    for (const node of nodes) {
      if (config.hidden === true) {
        node.style.setProperty('display', 'none', 'important');
      } else if (config.hidden === false && config.style?.display) {
        node.style.display = String(config.style.display);
      }

      for (const [key, value] of Object.entries(config.style || {})) {
        if (!SAFE_STYLE_KEYS.has(key)) continue;
        if (value === null || value === undefined || value === '') {
          node.style[key] = '';
          continue;
        }
        node.style[key] = String(value);
      }

      const attrs = config.attrs || {};
      for (const name of ['src','href','alt','title']) {
        if (!(name in attrs)) continue;
        const next = name === 'src' || name === 'href' ? safeUrl(attrs[name]) : String(attrs[name] ?? '');
        if (next) node.setAttribute(name, next);
        else node.removeAttribute(name);
      }

      if ('text' in attrs && node.children.length === 0) {
        const nextText = String(attrs.text ?? '');
        if (node.textContent !== nextText) node.textContent = nextText;
      }
    }
  }
}

function applyFavicon(url) {
  const safe = safeUrl(url);
  if (!safe) return;
  let link = document.querySelector('link[data-estibordo-runtime-favicon]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.dataset.estibordoRuntimeFavicon = 'true';
    document.head.appendChild(link);
  }
  link.href = safe;
}

export default function SiteDesignRuntime() {
  useEffect(() => {
    const run = () => {
      if (window.location.pathname.startsWith('/admin/editor')) return;
      applyRecord(design?.global?.elements || {});
      applyRecord(design?.pages?.[window.location.pathname]?.elements || {});
      applyFavicon(design?.global?.favicon);
    };

    run();
    const observer = new MutationObserver(() => {
      window.clearTimeout(window.__estibordoDesignTimer);
      window.__estibordoDesignTimer = window.setTimeout(run, 60);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
