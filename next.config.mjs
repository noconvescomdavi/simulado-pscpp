const strictCsp = "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; media-src 'self' blob: https:; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'self' blob: https:; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests";
const threeCsp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' blob: data: https: wss:; media-src 'self' blob: https:; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'self' blob: https:; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests";

const securityHeaders = [
  { key: "Content-Security-Policy", value: strictCsp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Origin-Agent-Cluster", value: "?1" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig = {
  poweredByHeader: false,

  // Keep large data/content files out of the Cloudflare Worker server bundle.\n  // They are runtime/static resources and must not be traced into handler.mjs.\n  outputFileTracingExcludes: {\n    "/*": [\n      "./scripts/**/*",\n      "./reports/**/*",\n      "./audit/**/*",\n      "./backups/**/*",\n      "./docs/**/*",\n      "./public/**/*",\n      "./protected-content/**/*"\n    ],\n    "/study-content/**": [\n      "./scripts/**/*",\n      "./reports/**/*",\n      "./audit/**/*",\n      "./backups/**/*",\n      "./docs/**/*",\n      "./public/**/*"\n    ]\n  },

  outputFileTracingIncludes: {
    "/study-content/**": [
      "./protected-content/study-content/**/*",
    ],
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/flashcards/ripeam/3d/:path*", headers: [{ key: "Content-Security-Policy", value: threeCsp }] },
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/auth/:path*", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
      { source: "/api/account/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }] },
      { source: "/perfil/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/area-do-aluno/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/site-editor/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }] },
      { source: "/models/ripeam/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
      { source: "/_next/static/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/estibordo/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
      { source: "/manifest.webmanifest", headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }] },
      { source: "/pwa-icon", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
    ];
  },

  async redirects() {
    return [
      { source: "/tutor-ia", destination: "/contramestre", permanent: true },
      { source: "/conteúdos", destination: "/conteudos", permanent: true },
      { source: "/admin/métricas", destination: "/admin/metricas", permanent: true },
      { source: "/ripeam", destination: "/study-content/simulado/navegacao-aguas-restritas/ripeam/", permanent: false },
      { source: "/cis", destination: "/flashcards/cis", permanent: false },
      { source: "/study-content/flashcards/flashcard-cis/:path*", destination: "/flashcards/cis", permanent: false },
    ];
  },
};

export default nextConfig;
