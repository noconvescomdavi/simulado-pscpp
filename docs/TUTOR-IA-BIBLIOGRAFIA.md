# Bibliografia do CONTRAMESTRE

O CONTRAMESTRE usa o File Search da Responses API para consultar a bibliografia oficial/curada do PSCPP antes de responder.

## Configuração
A única credencial externa obrigatória é:

- `OPENAI_API_KEY` na Vercel.

O Vector Store não precisa ser criado manualmente. O painel:

`Administração → Contramestre`

cria o acervo automaticamente no primeiro upload e salva o `vector_store_id` no Neon.

## Ingestão
1. Acesse Administração → Contramestre.
2. Envie até 10 PDFs por lote, com máximo de 50 MB por arquivo.
3. A plataforma envia cada PDF para a OpenAI com purpose `user_data`.
4. O arquivo é anexado ao Vector Store do CONTRAMESTRE.
5. O CONTRAMESTRE passa a usar `file_search` com até 8 resultados relevantes por pergunta.
6. Quando houver resultados recuperados, as fontes aparecem abaixo da resposta do aluno.

## Curadoria recomendada
Use apenas publicações autorizadas e vigentes. Prefira nomes de arquivo inequívocos com título, edição/ano e capítulo quando o PDF for parcial. Não misture apostilas não oficiais no mesmo acervo das fontes oficiais. Antes de substituir uma edição, remova a anterior para evitar conflito normativo.

## Fallback
`OPENAI_TUTOR_VECTOR_STORE_ID` continua aceito como override opcional. Se não estiver configurado, o ID salvo no Neon pelo painel Admin será usado.
