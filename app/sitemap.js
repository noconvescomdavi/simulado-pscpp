const baseUrl = "https://simulado-pscpp.vercel.app";

const publicPaths = [
  "/",
  "/plataforma",
  "/produtos/simulados",
  "/produtos/banco-de-questoes",
  "/produtos/flashcards-mapas-mentais",
  "/sobre-nos",
  "/sobre-a-praticagem/o-que-faz-um-pratico",
  "/sobre-a-praticagem/como-se-tornar-um-pratico",
  "/comprar",
];

export default function sitemap() {
  const now = new Date();
  return publicPaths.map((path) => ({
    url: baseUrl + path,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
