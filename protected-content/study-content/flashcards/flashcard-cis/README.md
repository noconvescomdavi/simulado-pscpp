# Flashcards CIS

Aplicação web estática para estudo do **Código Internacional de Sinais (CIS / ICS)**, organizada para publicação direta no GitHub + Vercel.

## Estrutura

```text
flashcards-cis/
│
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
└── README.md
```

## Recursos

- Busca por código ou termo (`NC`, `AN`, `ZL`, "médico", etc.)
- Filtros: Bandeiras, Distress, Combinações, Médico, Difíceis e Errados
- Modo prova com 4 alternativas
- Percentual de acertos
- Registro de acertos e erros
- Repetição automática de cartões errados no modo prova
- Marcação de cartões difíceis
- Revisão dedicada de erros
- Interface responsiva para celular
- Modo claro/escuro
- Bandeiras vetoriais em SVG, sem arquivos de imagem externos
- Alternância PT-BR / English
- Progresso persistido com `localStorage`
- Botão de áudio reservado para implementação futura

## Fonte do conteúdo

O conjunto de estudo foi estruturado a partir do material CIS fornecido para o projeto.

Observações editoriais:
- Quando o material-base apresenta apenas um idioma em determinados exemplos, a interface pode conter **tradução de estudo** para permitir alternância PT-BR/English.
- A bandeira **J** mantém a divergência PT/EN existente no material-base e a interface exibe uma observação ao aluno, em vez de substituir silenciosamente o conteúdo.
- Este projeto é uma ferramenta de estudo e não substitui a publicação oficial aplicável ao processo seletivo.

## Executar localmente

Basta abrir `index.html` no navegador.

Para um teste mais próximo de produção, também é possível servir a pasta com qualquer servidor HTTP local.

Exemplo com Python:

```bash
python -m http.server 8000
```

Depois abra:

```text
http://localhost:8000
```

## Publicar no Vercel

Como o projeto é estático:

- Framework Preset: `Other`
- Root Directory: `./`
- Build Command: deixar em branco
- Output Directory: deixar em branco
- Install Command: deixar em branco

Conectando o repositório GitHub ao Vercel, novos `git push` na branch de produção geram novos deployments automaticamente.

## Atualizar o GitHub

```bash
git add .
git commit -m "Versão final dos flashcards CIS"
git push
```

## Persistência

Os dados de estudo ficam no navegador usando a chave:

```text
cisFlashcards:v2
```

São salvos:
- idioma;
- tema;
- estatísticas gerais;
- estatísticas por cartão;
- cartões difíceis;
- cartões errados pendentes de revisão.

O botão **Resetar progresso** apaga esses dados do dispositivo atual.

## Próxima evolução sugerida

O botão de áudio já está reservado na interface. Em uma versão futura, a pronúncia pode ser implementada com arquivos de áudio próprios ou Web Speech API, dependendo da necessidade de consistência e suporte entre navegadores.
