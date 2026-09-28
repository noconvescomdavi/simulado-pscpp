# Catálogo leve de questões — 28/09/2026

As páginas de entrada de simulados, banco de questões e administração importavam o banco ativo completo (26 MB de JSON e um chunk servidor de aproximadamente 33 MB) para mostrar contagens, filtros e histórico. O trabalho editorial em si já tinha sido deslocado para o build; restava o custo de carregar os dados completos nessas páginas.

Agora o build produz três artefatos independentes a partir dos bancos ativos: resumo de contagens, filtros por obra/capítulo/módulo e índice mínimo de origem para o histórico dos cadernos. A emissão, resposta, correção e busca continuam usando o banco integral nas rotas que precisam ler questões. O histórico mantém os mesmos campos e a mesma ordem.

O resumo gerado mede aproximadamente 4 KB; os filtros, 600 KB; e o índice de escopo dos cadernos, 2 MB. O build confirmou que `/simulado`, `/simulado/[subject]`, `/simulado/manobrabilidade`, `/conteudos/banco-de-questoes` e `/admin/questoes` deixaram de carregar o chunk de 33 MB. O índice de 2 MB é carregado só pela página que lista o histórico dos cadernos.

O teste `validate:question-catalog` compara as contagens e os filtros com as funções originais e confere os índices das 10.873 questões de cadernos. `--check` detecta snapshots desatualizados pelo hash de fontes. `npm run validate` passou. A economia real de Fluid Active CPU ainda deve ser medida na nova Vercel com uso autenticado.
