import {NextResponse} from "next/server";

const strictCsp=[
  "default-src \'self\'",
  "script-src \'self\' \'unsafe-inline\' https:",
  "style-src \'self\' \'unsafe-inline\' https:",
  "img-src \'self\' data: blob: https:",
  "font-src \'self\' data: https:",
  "connect-src \'self\' https: wss:",
  "media-src \'self\' blob: https:",
  "worker-src \'self\' blob:",
  "child-src \'self\' blob:",
  "frame-src \'self\' blob: https:",
  "frame-ancestors \'self\'",
  "object-src \'none\'",
  "base-uri \'self\'",
  "form-action \'self\'",
  "upgrade-insecure-requests"
].join("; ");

const threeCsp=[
  "default-src \'self\'",
  "script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https:",
  "style-src \'self\' \'unsafe-inline\' https:",
  "img-src \'self\' data: blob: https:",
  "font-src \'self\' data: https:",
  "connect-src \'self\' https: wss:",
  "media-src \'self\' blob: https:",
  "worker-src \'self\' blob:",
  "child-src \'self\' blob:",
  "frame-src \'self\' blob: https:",
  "frame-ancestors \'self\'",
  "object-src \'none\'",
  "base-uri \'self\'",
  "form-action \'self\'",
  "upgrade-insecure-requests"
].join("; ");

function needsThreeRuntime(pathname){
  return pathname==="/flashcards/ripeam/3d" || pathname.startsWith("/flashcards/ripeam/3d/") || pathname==="/admin/laboratorio-3d" || pathname.startsWith("/admin/laboratorio-3d/");
}

export function middleware(request){
  const response=NextResponse.next();
  response.headers.set("Content-Security-Policy",needsThreeRuntime(request.nextUrl.pathname)?threeCsp:strictCsp);
  return response;
}

export const config={matcher:["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|pwa-icon|pwa-splash).*)"]};
