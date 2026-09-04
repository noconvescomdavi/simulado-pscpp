# ESTIBORDO — Biblioteca automática pesquisável

## O que mudou nesta versão

Você NÃO precisa renomear os PDFs e NÃO precisa preencher `manifest.json` antes de importar.

Basta colocar os arquivos em:

`C:\simulado-pscpp\biblioteca-pdfs\`

O importador:
1. varre todos os `.pdf`;
2. calcula SHA-256;
3. lê metadados internos do PDF;
4. analisa as primeiras páginas;
5. tenta identificar título, autores, edição, editora, ano, ISBN e idioma;
6. conta as páginas;
7. gera/atualiza `manifest.json` automaticamente;
8. classifica os metadados como `auto_verified` ou `review`;
9. importa páginas e trechos para o PostgreSQL;
10. não duplica PDFs já conhecidos pelo SHA-256.

## Limite importante

Nenhum sistema consegue garantir 100% de precisão em todos os PDFs.

Alguns arquivos têm metadados ruins, por exemplo:
- Title: Microsoft Word - final.doc
- Author: Administrator

Nesses casos, o importador tenta extrair dados das primeiras páginas.
Se a confiança não for suficiente, marca:

`"metadata_status": "review"`

Você pode corrigir manualmente apenas esses casos no `manifest.json`.
Na próxima execução, seus campos preenchidos manualmente prevalecem sobre a detecção automática.

## Instalação Python

```powershell
cd C:\simulado-pscpp
py -m pip install pymupdf "psycopg[binary]" python-dotenv beautifulsoup4
```

## 1. Apenas identificar os PDFs

Antes de gravar no banco, você pode gerar só o manifesto:

```powershell
py scripts\import_library_auto.py --scan-only
```

Resultado:

```text
Encontrados 12 PDFs.
[1/12] Analisando livro01.pdf...
  [OK] Principles of Naval Architecture | en | 812 páginas

[2/12] Analisando scan_final.pdf...
  [REVISAR] Ship Manoeuvring Principles | en | 341 páginas

Manifesto salvo em:
C:\simulado-pscpp\biblioteca-pdfs\manifest.json
```

## 2. Importar para o PostgreSQL

Depois:

```powershell
py scripts\import_library_auto.py
```

## 3. Aplicar migration

Antes da primeira importação, execute no PostgreSQL:

`db/migrations/006_library_search.sql`

## 4. Conteúdo programático

Depois rode:

```powershell
py scripts\seed_syllabus_topics.py
```

Isso lê automaticamente os tópicos já existentes nas páginas HTML, como:

- 1.1 Resistência friccional
- 1.2 Resistência às ondas
- 2.5 Cavitação

e grava em `syllabus_topics`.

## 5. Como corrigir um documento detectado errado

Abra:

`C:\simulado-pscpp\biblioteca-pdfs\manifest.json`

Localize o arquivo:

```json
{
  "file": "arquivo_0023.pdf",
  "title": "Título correto",
  "authors": ["Autor correto"],
  "edition": "4th edition",
  "language": "en"
}
```

Salve e execute novamente:

```powershell
py scripts\import_library_auto.py
```

O importador preserva esses valores como `manual_override`.

## 6. PDFs escaneados

Esta versão NÃO faz OCR automaticamente.

Se o PDF for somente imagem, o sistema poderá identificar poucas informações ou nenhuma.
Nesse caso, transforme o PDF em um PDF pesquisável com OCR antes da importação.

## 7. PDFs e GitHub

Não versione os livros.

Adicione ao `.gitignore`:

```gitignore
biblioteca-pdfs/*.pdf
biblioteca-pdfs/manifest.json
```

## 8. Direitos autorais

Mantenha os PDFs privados. Na interface do aluno, prefira trechos curtos e referências bibliográficas, salvo quando houver autorização para disponibilizar a obra integral.
