export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1290" height="2796" viewBox="0 0 1290 2796">
    <rect width="1290" height="2796" fill="#07141f"/>
    <image href="https://simulado-pscpp.vercel.app/pwa-icon" x="465" y="1218" width="360" height="360" preserveAspectRatio="xMidYMid meet"/>
    <text x="645" y="1640" text-anchor="middle" fill="#ffffff" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="74" font-weight="700" letter-spacing="6">ESTIBORDO</text>
    <text x="645" y="1715" text-anchor="middle" fill="#b8c6d3" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="34">Plataforma de estudos PSCPP</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
