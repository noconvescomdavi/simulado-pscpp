const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },

  // Permite que o próprio ESTIBORDO seja aberto dentro
  // do iframe do Editor Visual.
  // Continua bloqueando sites externos.
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },

  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },

  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
  {
    key: "Origin-Agent-Cluster",
    value: "?1",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
];

const nextConfig = {
  poweredByHeader: false,

  outputFileTracingIncludes: {
    "/study-content/**": [
      "./protected-content/study-content/**/*",
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
      {
        source: "/api/auth/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
      {
        source: "/api/site-editor/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/tutor-ia",
        destination: "/contramestre",
        permanent: true,
      },
      {
        source: "/conteúdos",
        destination: "/conteudos",
        permanent: true,
      },
      {
        source: "/admin/métricas",
        destination: "/admin/metricas",
        permanent: true,
      },
      {
        source: "/ripeam",
        destination:
          "/study-content/simulado/navegacao-aguas-restritas/ripeam/",
        permanent: false,
      },

      {
        source: "/cis",
        destination: "/flashcards/cis",
        permanent: false,
      },

      {
        source: "/study-content/flashcards/flashcard-cis/:path*",
        destination: "/flashcards/cis",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;