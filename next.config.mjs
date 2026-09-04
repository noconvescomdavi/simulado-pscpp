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
    ];
  },

  async redirects() {
    return [
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