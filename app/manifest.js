export default function manifest() {
  return {
    id: "/",
    name: "ESTIBORDO | Plataforma de estudos PSCPP",
    short_name: "ESTIBORDO",
    description: "Plataforma de estudos para preparação ao PSCPP.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#07141f",
    theme_color: "#07141f",
    lang: "pt-BR",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/pwa-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/pwa-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    shortcuts: [
      {
        name: "Área do aluno",
        short_name: "Aluno",
        url: "/area-do-aluno"
      },
      {
        name: "Simulados",
        short_name: "Simulados",
        url: "/simulado"
      },
      {
        name: "Plano de estudos",
        short_name: "Plano",
        url: "/plano-de-estudos"
      }
    ]
  };
}
