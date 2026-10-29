# Fontes e estado de acesso

Baseline: `012b562b0eb6f7fec78773b339e4a53b3643e791`, obtido de `main`.
O PR #115 está encerrado e mergeado; merge commit
`8a421ec413f19f03b336e1e94ea876f40864f80e`. Não reutilizado como aprovação
editorial para esta nova auditoria.

O ZIP recebido contém Prompt-Mestre, quatro provas, análise PDF, planilha,
nota de auditoria, leia-me e manifesto. Dez entradas do manifesto tiveram
tamanho e SHA-256 conferidos, todas coincidentes (`INTEGRIDADE_DOSSIE.json`).
A versão TXT do Prompt-Mestre é cópia do MD.

## Drive

Pasta raiz: https://drive.google.com/drive/folders/1o-LB5dP9-8e68GMjadc2jV4eGQnEPn8R

Inventário recursivo: nove pastas visitadas, 167 entradas com IDs distintos,
sendo 159 arquivos e oito subpastas. Não foram retornadas outras subpastas.
Listagem solicitada com limite 1.000; maior pasta retornou 51 entradas.
Metadados completos: `FONTES_DRIVE.json`. Listagem não comprova identidade de
conteúdo entre cópias, edição correta ou leitura integral de cada livro.

Documentos prioritários acessados como texto:

- BIBLIOGRAFIA - FINAL.pdf, ID `1tILRG_As7Zkt0uf6MNBWUur8EyzyUq_Q`;
- Conteudo Programatico - FINAL.pdf, ID `1iQYcejhBTkrkOr78DzCCP2xXzSUSz9iu`;
- PROMPTS DO BANCO DE QUESTÕES.md, ID `1scaU_vAqOfk_s5G9oy59-R3ymrgIBdLk`.

Bibliografia e programa identificam Anexos 2-B e 2-A. O próprio programa
informa que o edital específico definirá o conteúdo do respectivo certame.
Ainda é necessário verificar proveniência, revisão oficial e edital-alvo.
O prompt histórico de geração é auxiliar e não substitui fonte primária.

## Primeira obra primária disponibilizada

Arte Naval, Maurílio Magalhães Fonseca, volume 2, 8ª edição, Rio de Janeiro,
Serviço de Documentação da Marinha, 2019. Edição/volume/ano constam dos
elementos iniciais do PDF e da ficha catalográfica.

Drive ID: `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.
SHA-256 do PDF: `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`.
Capítulo 9, art. 9.1, página impressa 657, página PDF 18: definições de poleame.
Conferência bibliográfica inicial de três itens registrada separadamente;
não configura aprovação editorial integral. Cópia completa do livro não é
publicada no repositório.

A bibliografia fornecida menciona v.1 junto aos capítulos 9 a 12, mas o corpo
do volume 2 começa no capítulo 9. Registrar a divergência em vez de corrigir
referências por suposição. Demais obras e vigência normativa ainda pendentes.

## Avanço de proveniência e segundo exemplar primário

A página oficial da DPC confirma a revisão dos Anexos 2-A e 2-B e fornece os
links de programa e bibliografia. Os PDFs oficiais retornaram 502/timeout/503;
não foi provada identidade binária com os arquivos do Drive. Evidência e
limitações em `PROVENIENCIA_OFICIAL_ANEXOS.json`; edital-alvo ainda não confirmado.

Arte Naval, volume 1, 8ª edição revista e ampliada, SDM, Rio de Janeiro, 2019:
título/ficha e arts. 8.2, 8.7, 8.18 conferidos em texto e páginas renderizadas.
Drive ID `1LjlDejVyooU3QLJzF0COvAEnOgMDNC9N`, 39.831.575 bytes,
SHA-256 `792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20`.
Fonte da correção de ANV-0005, descrita em `REVISAO_ANV_0005.md`, sem aprovação
de release. Não publicada cópia integral do livro.


## Observação do lote 032 — sumário e corpo do exemplar de Arte Naval v.2

No PDF SHA256 6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1,
o sumário PDF 11 anuncia artigos de governo 11.11–11.13; o corpo p.776/PDF 137
inicia mastreação 11.11 e p.779/PDF 140 traz 11.13 Aparelho fixo. As imagens
confirmam a divergência nos pontos observados; causa e reconciliação com
outro exemplar/edição ainda pendentes. ANV-0142/0840 não foram aprovadas,
reescritas nem contadas como conferências primárias. Busca no texto extraído
não equivale a prova de ausência em todas as imagens ou demais obras.
Ver BUSCA_FONTE_PROPULSORES_032.json e REVISAO_ARTE_NAVAL_LOTE_032.md.
A existência de título no sumário não comprova presença/conteúdo do artigo.
O arquivo continua marcado como apenas parcialmente conferido, sem inferir
errata oficial, defeito geral de toda edição ou invalidade de cada página
anteriormente lida. Registros existentes continuam sujeitos à rechecagem e
aos gates. Nenhum livro/imagem integral foi publicado.


## Lote034 — içadores mecânicos de prático

Fontes oficiais IMO obtidas em22/10/2026: A.1045(27), seção4 p.4/PDF5 e
dispositivo operativo3 p.1/PDF2; A.1108(29), anexo p.2/PDF3; MSC.572(110),
dispositivos operativos2/3 PDF2 e futura V/23.10 p.3/PDF4. Texto/imagens
conferidos nos localizadores declarados; hashes/URLs/limites em
EVIDENCIA_NORMATIVA_034.json. A emenda2015 altera5.1/5.2, não a seção4.
MSC.572 prevê2028-01-01 condicionado à aceitação; não foi antecipada.
A checagem de passagens não certifica toda vigência normativa/edital. Não se
afirmou identidade binária dos PDFs oficiais com as cópias Drive. Dois checks
parciais de questões, sem aprovação final; sem publicar PDFs integrais.


## Lote035 — sumário/corpo de Grampos

No mesmo exemplar de Arte Naval v.2, SHA2566afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1,
o sumárioPDF10 anuncia9.35 Grampos, enquanto corpo pp.692–693/PDF53–54 traz
9.32 e figuras9-40/9-41. Texto/imagens conferidos; corrigidos locators de0148/0846
para corpo9.32, com source.numbering_note. Sem inferir errata oficial ou invalidar
o exemplar inteiro; cobertura/reconciliação global pendentes. Nenhum modelo
renumerado e nenhuma conferência/aprovação adicional para variantes não revistas.
