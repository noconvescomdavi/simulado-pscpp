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
          "/study-content/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://simulado-pscpp.vercel.app/sitemap.xml",
  };
}
