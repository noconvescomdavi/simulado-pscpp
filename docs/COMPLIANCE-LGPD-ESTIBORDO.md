# Programa simplificado de privacidade e compliance — ESTIBORDO

Versão: 2026-09-08

> Documento interno. Não publicar dados pessoais do responsável neste arquivo. Revisar com advogado/contador quando houver formalização empresarial.

## 1. Papéis e governança
- Controlador: fornecedor que opera a ESTIBORDO (atualmente pessoa física; identificação cadastral pendente de preenchimento seguro).
- Canal de titulares: estibordopscpp@gmail.com.
- Encarregado: não designado neste momento; reavaliar enquadramento como agente de tratamento de pequeno porte e crescimento da operação.
- Revisão: sempre que houver novo fornecedor, nova categoria de dados, analytics/marketing, alteração relevante de IA, pagamento ou finalidade.

## 2. Registro simplificado das operações (ROPA)

| Operação | Dados | Finalidade | Base a validar/aplicar | Sistemas/terceiros | Retenção |
|---|---|---|---|---|---|
| Cadastro/autenticação | e-mail, hash de senha, IDs, eventos de login | criar e proteger conta | execução contratual; segurança/legítimo interesse quando cabível | aplicação/banco | enquanto conta ativa + períodos necessários a direitos/obrigações |
| Aceite jurídico | user_id, versões, data, ip_hash | prova do aceite e governança | execução contratual/exercício regular de direitos | banco | preservar enquanto necessário à prova da relação |
| Perfil/checkout | nome, CPF, telefone e perfil informado | contratação, pagamento, suporte | execução contratual; obrigações aplicáveis | banco/Mercado Pago | minimizar; observar obrigações fiscais/consumeristas e defesa de direitos |
| Pagamentos | IDs, valor, status, produto, timestamps | cobrar, liberar/revogar acesso, conciliar | execução contratual; obrigação legal; exercício de direitos | Mercado Pago/banco | conforme obrigações e prazos de defesa |
| Estudos | progresso, respostas, tentativas, tempo, planos, cadernos | entregar serviço e personalizar aprendizagem | execução contratual | banco | conta ativa; excluir/anonimizar no encerramento quando não houver exceção legal |
| Tutor IA | mensagens, histórico, tokens, modelo, fontes | prestar tutoria e manter histórico | execução contratual | OpenAI/banco | definir prazo operacional; excluir com conta quando não houver exceção |
| Segurança | IP em hash, user-agent em hash, rate limits, audit logs | prevenir fraude/abuso e investigar incidentes | legítimo interesse/obrigação/exercício de direitos conforme caso | banco/infraestrutura | prazo proporcional ao risco; documentar |
| Suporte/e-mail | e-mail e conteúdo da solicitação | suporte, verificação e comunicação | execução contratual/obrigação/exercício de direitos | provedor de e-mail | pelo período necessário ao atendimento e defesa de direitos |

## 3. Minimização
1. Não coletar endereço completo, redes sociais, WhatsApp ou data de nascimento apenas por conveniência. Cada campo deve ter finalidade documentada.
2. CPF deve ser solicitado somente quando necessário à contratação, antifraude, obrigação fiscal ou finalidade legítima documentada.
3. Não solicitar dados pessoais sensíveis no Tutor IA.
4. Nunca registrar senha, token de sessão, chave de API ou dado completo de cartão em logs.
5. Rever periodicamente campos opcionais do perfil.

## 4. Retenção e descarte
- Dados de estudo e conteúdo pessoal: apagar no fluxo de exclusão da conta, salvo obrigação/exceção documentada.
- Conta excluída: substituir e-mail por identificador não operacional e invalidar sessões.
- Pagamentos, acesso, consentimentos e evidências necessárias: conservar somente enquanto houver fundamento legal/necessidade de defesa; definir tabela de prazos com contador/advogado conforme natureza do documento.
- Incidentes de segurança com dados pessoais: manter registro pelo prazo regulamentar aplicável (mínimo de 5 anos conforme RCIS).
- Backups: documentar ciclo e expiração; exclusões devem alcançar backups no ciclo normal ou permanecer inacessíveis até expiração.
- Ao vencer o prazo: excluir ou anonimizar de forma efetiva.

## 5. Solicitações de titulares
Fluxo:
1. registrar data, identidade alegada, pedido e canal;
2. confirmar identidade de forma proporcional, sem coletar excesso;
3. classificar: confirmação/acesso, correção, exclusão, informação, oposição, consentimento, portabilidade ou decisão automatizada;
4. localizar dados e terceiros envolvidos;
5. responder dentro do prazo legal aplicável;
6. executar nos sistemas e, quando aplicável, comunicar operadores;
7. registrar conclusão sem conservar cópia excessiva dos dados fornecidos.

A aplicação já oferece exportação de dados e exclusão autenticada. Testar esses fluxos em cada release relevante.

## 6. Incidentes de segurança
1. conter o incidente e preservar evidências;
2. identificar sistemas, período, titulares, categorias/volume de dados e medidas de segurança;
3. avaliar risco ou dano relevante;
4. envolver responsável jurídico/privacidade;
5. quando obrigatório, comunicar ANPD e titulares no prazo regulamentar;
6. registrar o incidente, decisão, comunicações e remediação;
7. conservar o registro pelo prazo regulamentar;
8. realizar análise de causa raiz e prevenção de recorrência.

## 7. Fornecedores
Antes de ativar fornecedor que trate dados:
- mapear finalidade e categorias de dados;
- verificar papel (operador/controlador independente);
- revisar termos, segurança, suboperadores e localização do tratamento;
- avaliar transferência internacional;
- limitar credenciais e permissões;
- prever exclusão/devolução de dados ao encerrar a relação.

Fornecedores já identificados no código: Mercado Pago (pagamento) e OpenAI (Tutor IA). Infraestrutura, banco e e-mail devem ser confirmados pelas configurações reais de produção, sem registrar segredos neste documento.

## 8. Transferência internacional
Quando fornecedor tratar dados fora do Brasil, documentar país/fluxo e mecanismo jurídico aplicável segundo LGPD e regulamentação da ANPD. Não afirmar mecanismo específico na política pública sem confirmação contratual.

## 9. Cookies e tracking
- Cookie de sessão pscpp_session: necessário para autenticação.
- Não ativar analytics, pixel ou publicidade baseada em consentimento antes de atualizar inventário, política e mecanismo de preferências.
- Realizar varredura de cookies após novas integrações.

## 10. IA
- O Tutor envia a pergunta e histórico recente à API de IA e armazena mensagens no banco.
- store:false é usado na chamada atual, mas isso não substitui a revisão dos termos e práticas do fornecedor.
- Exibir aviso para não inserir dados sensíveis/confidenciais desnecessários.
- Manter possibilidade de exclusão do histórico via exclusão de conta e avaliar exclusão granular de conversas.
- Não utilizar conversas para finalidade nova (ex.: treinamento/marketing) sem análise jurídica prévia.

## 11. Privacy by design — checklist de release
- [ ] Nova coleta possui finalidade e base documentadas?
- [ ] É realmente necessária?
- [ ] Política pública precisa mudar?
- [ ] Novo terceiro recebe dados?
- [ ] Há transferência internacional?
- [ ] Retenção/exclusão estão definidas?
- [ ] Exportação do titular inclui a nova categoria quando aplicável?
- [ ] Exclusão de conta alcança a nova tabela?
- [ ] Logs evitam dados excessivos/segredos?
- [ ] Há controles de acesso e rate limit?
- [ ] Mudança exige novo aceite?

## 12. Pendências prioritárias
- Preencher identificação legal do fornecedor antes da abertura comercial definitiva.
- Formalizar CNPJ e endereço empresarial quando constituídos.
- Criar e-mails em domínio próprio.
- Confirmar fornecedores reais de hosting, Postgres e e-mail.
- Definir tabela jurídica/contábil de retenção.
- Revisar necessidade dos campos address_*, instagram, linkedin, whatsapp e birth_date.
- Criar exclusão granular de conversas do Tutor IA.
- Revisar propriedade intelectual/licenças de PDFs, imagens, GLBs, questões e bibliografia.
