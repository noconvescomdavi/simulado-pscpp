# Rascunho — Segurança de dados da Google Play

> Este arquivo é um guia operacional. Antes do envio final, confirme os fornecedores/SDKs ativos em produção e responda a Play Console de acordo com o comportamento real.

## Visão geral

- Criptografia em trânsito: **Sim** — a plataforma e o shell Android usam HTTPS.
- Exclusão de conta: **Sim** — disponível no perfil autenticado e por recurso web público.
- URL de exclusão: `https://simulado-pscpp.vercel.app/excluir-conta`.
- Política de privacidade: `https://simulado-pscpp.vercel.app/politica-de-privacidade`.

## Categorias que a plataforma pode coletar

### Informações pessoais

- endereço de e-mail;
- nome completo;
- telefone;
- CPF quando necessário ao checkout/contratação;
- estado/UF e WhatsApp quando fornecidos opcionalmente.

Finalidades possíveis: gerenciamento de conta, autenticação, suporte, prevenção de fraude e contratação.

### Informações financeiras / compras

A ESTIBORDO não armazena dados completos do cartão. Pode armazenar:

- identificador da transação;
- provedor;
- valor;
- moeda;
- status;
- datas de aprovação/criação;
- código do produto.

Finalidades: liberar acesso, suporte, prevenção de fraude, reembolso e obrigações legais.

### Atividade no app

Pode incluir:

- progresso de estudo;
- questões respondidas;
- respostas selecionadas;
- acertos/erros;
- tempo de resposta;
- resultados de simulados;
- cadernos e conteúdo de estudo;
- histórico de uso do tutor de IA quando utilizado.

Finalidades: funcionalidade do produto, personalização do aprendizado, analytics internos e suporte.

### Conteúdo gerado pelo usuário

Quando o aluno utiliza tutor/IA ou ferramentas de entrada de conteúdo, o texto enviado pode ser armazenado e/ou enviado ao provedor tecnológico necessário para gerar a resposta.

### Informações técnicas e segurança

A plataforma pode tratar informações técnicas necessárias para autenticação, rate limiting, auditoria e prevenção de abuso. Alguns registros usam hashes de IP/User-Agent em vez do valor bruto.

## Compartilhamento

Confirmar na Play Console a definição vigente de "compartilhamento". Fornecedores que atuam estritamente como prestadores de serviço podem receber dados para executar funções da plataforma, como:

- hospedagem;
- banco de dados;
- pagamento;
- autenticação;
- e-mail;
- inteligência artificial.

Não classificar automaticamente todo processamento por fornecedor como "compartilhamento" sem validar a definição da Play.

## Retenção e exclusão

Ao excluir a conta:

- dados diretamente identificáveis e dados de aprendizagem são removidos quando aplicável;
- o e-mail da conta é substituído por identificador não utilizável;
- acesso é revogado;
- sessões são invalidadas;
- alguns registros financeiros, consentimentos, antifraude e segurança podem ser mantidos quando existir obrigação legal ou necessidade legítima documentada.

## Checklist antes de enviar

1. Confirmar analytics/telemetria ativos.
2. Confirmar provedor de e-mail.
3. Confirmar banco/hospedagem em produção.
4. Confirmar integração de IA ativa e dados enviados.
5. Confirmar Mercado Pago e dados retornados pelo provedor.
6. Confirmar se Firebase/FCM estará ativo na versão submetida.
7. Se FCM estiver ativo, revisar coleta associada ao SDK.
8. Conferir se algum SDK coleta identificadores de dispositivo automaticamente.
9. Alinhar as respostas da Play Console com a Política de Privacidade publicada.
