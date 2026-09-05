# Bibliografia do Tutor IA

O Tutor usa o File Search da Responses API quando `OPENAI_TUTOR_VECTOR_STORE_ID` estiver configurado.

## Ingestão
1. Crie um Vector Store no projeto OpenAI usado pela ESTIBORDO.
2. Faça upload somente das publicações autorizadas/curadas da bibliografia vigente do PSCPP.
3. Anexe os arquivos ao Vector Store e aguarde o status `completed`.
4. Configure na Vercel:
   - `OPENAI_API_KEY`
   - `OPENAI_TUTOR_VECTOR_STORE_ID=vs_...`
5. Faça novo deploy.

Sem o Vector Store configurado, o Tutor continua funcionando, mas sem recuperação da bibliografia. Com ele configurado, a rota envia `file_search` com até 8 resultados relevantes por pergunta.

## Curadoria recomendada
Use nomes de arquivo inequívocos, com título, edição/ano e capítulo quando o PDF for parcial. Não misture apostilas não oficiais no mesmo Vector Store das fontes oficiais. Antes de substituir uma edição, remova a anterior para evitar conflito normativo.
