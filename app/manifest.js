export default function manifest() {
  return {
    name: "ESTIBORDO | Plataforma de estudos PSCPP",
    short_name: "ESTIBORDO",
    description:
      "Plataforma de preparação para o PSCPP com questões, simulados, conteúdo e análise de desempenho.",
    start_url: "/area-do-aluno",
    scope: "/",
    display: "standalone",
    background_color: "#07141f",
    theme_color: "#07141f",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/estibordo/logos/estibordo-logo-header.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
