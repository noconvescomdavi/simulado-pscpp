export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/area-do-aluno",
          "/perfil",
          "/minhas-assinaturas",
          "/simulado",
          "/conteudos",
          "/flashcards",
          "/plano-de-estudos",
          "/hoje",
          "/treino-adaptativo",
          "/revisao-inteligente",
          "/analise-de-fraquezas",
          "/mapas-mentais",
          "/minha-trajetoria",
          "/ranking",
          "/contramestre",
          "/suporte",
          "/pesquisar",
          "/study-content/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://simulado-pscpp.vercel.app/sitemap.xml",
  };
}
