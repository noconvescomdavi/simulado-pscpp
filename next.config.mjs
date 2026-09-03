const nextConfig = {
  poweredByHeader: false,

  /*
   * O conteúdo protegido não fica em /public.
   * Esta regra garante que os arquivos sejam incluídos
   * nas funções server-side da Vercel.
   */
  outputFileTracingIncludes: {
    "/study-content/**": [
      "./protected-content/study-content/**/*",
    ],
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
        destination:
          "/study-content/flashcards/flashcard-cis/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
