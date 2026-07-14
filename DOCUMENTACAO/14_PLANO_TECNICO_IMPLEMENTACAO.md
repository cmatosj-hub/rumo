# ANÁLISE DA DOCUMENTAÇÃO E PLANO TÉCNICO DE IMPLEMENTAÇÃO

## Status do documento

- Tipo: proposta técnica para validação.
- Base analisada: `00_PRODUCT.md` a `13_GLOSSARIO.md`, integralmente.
- Data da análise: 13/07/2026.
- Este documento não substitui decisões existentes.
- Os itens marcados como **decisão necessária** devem ser aprovados e registrados em `12_DECISOES.md` antes da implementação afetada.

---

# 1. Resumo executivo

O RUMO possui uma visão de produto coerente: ser um ERP pessoal, local-first, para gestão financeira, operacional e patrimonial de motoristas de aplicativo. Também existem bons princípios arquiteturais: modularidade, regras em Services, persistência isolada, auditoria e evolução futura para cloud e mobile.

Entretanto, a documentação ainda não constitui uma especificação implementável completa. Os documentos descrevem muitas capacidades, mas não definem com precisão:

- a plataforma de execução da versão local;
- os limites de escopo de cada versão;
- a fonte canônica dos lançamentos financeiros;
- as fórmulas e critérios de rateio;
- o modelo de jornadas e quilometragem;
- passivos, transferências e saldos patrimoniais;
- contratos de API, validações e códigos de erro;
- critérios de aceite e requisitos não funcionais.

Implementar diretamente a partir do material atual produziria interpretações diferentes para lucro, patrimônio, custo por quilômetro e saldos. A prioridade técnica deve ser fechar essas definições antes de construir telas.

---

# 2. Pontos fortes encontrados

1. O público, o problema e o propósito do produto estão claros.
2. A operação offline é uma decisão explícita.
3. A separação entre interface, regras e persistência está documentada.
4. O cancelamento lógico e a auditoria protegem a integridade histórica.
5. O suporte estrutural a usuários e veículos múltiplos reduz retrabalho futuro.
6. O roadmap apresenta uma direção incremental.
7. A documentação exige tipagem, testes, migrations e revisão de regressões.
8. O produto busca explicar indicadores, não apenas exibi-los.

---

# 3. Inconsistências e conflitos

## 3.1 Críticos — bloqueiam decisões de arquitetura ou resultados financeiros

| ID | Tema | Evidência documental | Problema | Correção proposta |
|---|---|---|---|---|
| INC-01 | Metas | `02_REGRAS_NEGOCIO.md` admite metas obrigatórias; Decisão 009 determina que todas são opcionais; `01_REQUISITOS.md` também as apresenta como opcionais | Uma implementação não consegue satisfazer as duas regras | Aplicar a Decisão 009 e remover “obrigatórias” das regras de negócio |
| INC-02 | Patrimônio no MVP | Produto, dashboard e fluxo diário tratam patrimônio como central; o primeiro acesso exige contas e investimentos; `10_ROADMAP.md` adia patrimônio, investimentos e reserva para 1.5 | O fluxo obrigatório depende de módulos fora do MVP | Tornar contas, metas e investimentos opcionais no onboarding do MVP; definir se o dashboard patrimonial entra em 1.0 ou 1.5 |
| INC-03 | Múltiplos veículos | Regra de negócio e Decisão 008 exigem suporte; roadmap coloca “múltiplos veículos completos” na 2.0 | Não está claro se o MVP aceita um ou vários veículos | Modelar `vehicle_id` desde o início; definir se a UI do MVP permite vários veículos ou apenas um ativo |
| INC-04 | Inteligência financeira | Regras exigem análise e alertas automáticos; requisitos exigem recomendações; roadmap adia inteligência e recomendações para 2.0 | Requisito atual conflita com faseamento | Limitar o MVP a alertas determinísticos operacionais; adiar detecção estatística e recomendações para 2.0 |
| INC-05 | Patrimônio líquido | Regras listam apenas ativos; glossário define patrimônio como ativos menos passivos | Não há como calcular patrimônio líquido sem passivos | Incluir passivos, saldos de financiamentos e dívidas no modelo patrimonial |
| INC-06 | Fonte financeira canônica | Despesa, abastecimento, manutenção, imposto e parcela aparecem como entidades independentes | O mesmo fato pode ser contado duas vezes | Criar um lançamento financeiro canônico e relacionar os detalhes especializados a ele em relação 1:1 |
| INC-07 | Plataforma local | Arquitetura exige SQLite + Prisma e interface offline, mas não define desktop, web local, PWA ou servidor | Prisma/SQLite precisam de runtime apropriado e não podem ser acessados diretamente por uma SPA no navegador | Registrar uma decisão de plataforma antes do scaffold do projeto |
| INC-08 | Atualização de saldos | Fluxos afirmam atualização automática do patrimônio, mas não existem ledger, transferências ou conciliação | Saldos bancários e caixa podem divergir silenciosamente | Adotar ledger de contas, transferências em duas pernas e transações atômicas |

## 3.2 Altos — causam cálculos incorretos ou dados incompletos

| ID | Tema | Problema | Correção proposta |
|---|---|---|---|
| INC-09 | Vínculo de despesas | “Toda despesa” deve possuir veículo, mas despesas pessoais, alimentação, impostos gerais e investimentos podem não pertencer a veículo | Tornar `vehicle_id` opcional e exigir um escopo: veículo, operação, pessoal ou patrimonial |
| INC-10 | Retirada pessoal | Requisito pede retirada, mas não define se ela reduz lucro | Modelar retirada como transferência do patrimônio empresarial/operacional para uso pessoal; não como despesa operacional |
| INC-11 | Reserva de emergência | Reserva pode ser conta bancária, investimento e item patrimonial ao mesmo tempo | Modelar reserva como finalidade/classificação de uma conta ou posição, evitando tripla contagem |
| INC-12 | Financiamento de veículo | Existe despesa “financiamentos”, mas não há principal, juros, saldo devedor ou passivo | Separar amortização de principal, juros e encargos; principal reduz passivo, juros afetam resultado |
| INC-13 | Jornada diária | KM inicial/final e horas são requisitos, mas não há entidade de operação/jornada no banco | Criar `operation_sessions`, com início/fim, odômetro, pausas e veículo |
| INC-14 | Quilometragem | `km_atual` no veículo é um valor mutável sem histórico | Criar leituras de odômetro imutáveis e derivar o KM atual da última leitura válida |
| INC-15 | Receita agregada | Receita individual e fechamento diário podem coexistir sem regra de conciliação | Definir modo por período/origem e impedir sobreposição ou marcar fechamento como consolidação dos itens |
| INC-16 | Lucro | Não há regime de competência/caixa, rateio de custos fixos, depreciação nem tratamento de parcelas | Especificar política contábil gerencial do produto e fórmulas versionadas |
| INC-17 | Consumo | Consumo médio, urbano, rodoviário e autonomia não possuem dados suficientes | Definir método de tanque cheio; incluir tipo de percurso e capacidade do tanque ou remover indicadores do MVP |
| INC-18 | Rentabilidade | Não há aportes, resgates, cotas, preços, impostos ou benchmark | Adiar o cálculo avançado ou criar modelo de posições e fluxos de investimento |
| INC-19 | Auditoria | “Histórico de alterações” não define ator, antes/depois, motivo ou correlação | Especificar log append-only com entidade, ID, ação, ator, timestamp, valores e correlação |
| INC-20 | Fechamento mensal | “Automático” não define fuso, atraso, reabertura ou imutabilidade | Tratar relatório como consulta; se houver fechamento, definir snapshot versionado e reprocessável |

## 3.3 Médios — reduzem testabilidade, segurança ou qualidade de uso

| ID | Tema | Problema | Correção proposta |
|---|---|---|---|
| INC-21 | API | O documento define camadas, não endpoints ou contratos; o exemplo não é JSON válido | Documentar casos de uso, DTOs, schemas, paginação, filtros e catálogo de erros |
| INC-22 | Estrutura modular | `features/`, `services/` e `repositories/` no topo podem dividir um mesmo módulo entre muitos diretórios | Preferir organização feature-first com domínio, aplicação, infraestrutura e UI por módulo |
| INC-23 | Entidades | `Relatórios` e `Patrimônio` aparecem como tabelas sem indicar se são projeções, snapshots ou dados fonte | Separar entidades transacionais, projeções derivadas e snapshots |
| INC-24 | Status | Todas as tabelas têm `status`, mas valores e transições não foram definidos | Usar enums por agregado e regras explícitas; tabelas imutáveis não devem receber status genérico |
| INC-25 | Erros e concorrência | Não há idempotência, transação, versionamento otimista ou prevenção de duplicidade | Incluir chaves idempotentes, constraints e operações transacionais nos casos críticos |
| INC-26 | Dinheiro e datas | Tipos, precisão, moeda, timezone e virada do dia não estão definidos | Armazenar dinheiro em centavos inteiros; timestamps em UTC; timezone e moeda como preferências do usuário |
| INC-27 | Segurança | Não existem requisitos para autenticação local, proteção de backup, dados sensíveis ou logs | Criar baseline de segurança e privacidade antes de backup/importação/cloud |
| INC-28 | Backup/importação | Telas incluem backup, exportação e importação; roadmap menciona apenas exportação na 1.5 | Versionar o formato de backup e definir claramente a versão de cada capacidade |
| INC-29 | FIPE | Valor FIPE pressupõe fonte externa, mas o produto deve funcionar offline | Permitir valor manual com data/fonte; integração automática será um adaptador opcional |
| INC-30 | UX | Não há estados vazios, loading, erro, acessibilidade, atalhos ou critérios responsivos | Criar especificação de UX e design system mínimo |
| INC-31 | Requisitos | Requisitos não possuem IDs, prioridade, versão ou critérios de aceite | Transformar a lista em requisitos rastreáveis e testáveis |
| INC-32 | Roadmap | Fases não possuem dependências, critérios de entrada/saída ou definição de pronto | Converter o roadmap em entregas verticais com aceite verificável |
| INC-33 | Glossário | Termos essenciais não estão definidos | Incluir lançamento, transferência, jornada, custo fixo/variável, saldo, ativo, passivo, cancelamento e fechamento |
| INC-34 | Hierarquia documental | Não há regra de precedência entre decisão, regra, requisito e roadmap | Definir precedência: decisões vigentes > regras de negócio > requisitos aprovados > arquitetura > roadmap |

---

# 4. Lacunas de cálculo

Antes da implementação, cada indicador precisa de uma ficha contendo: nome, finalidade, fórmula, entradas, filtros, período, arredondamento, dados ausentes e exemplos.

## 4.1 Baseline proposto

- **Receita operacional:** soma de lançamentos de receita operacional confirmados e não cancelados no período.
- **Despesa variável:** soma de despesas confirmadas classificadas como variáveis no período.
- **Despesa fixa apropriada:** parcela de despesas fixas atribuída ao período pela política de rateio aprovada.
- **Lucro bruto:** receita operacional menos despesas variáveis.
- **Lucro líquido operacional:** receita operacional menos despesas variáveis, despesas fixas apropriadas e demais custos operacionais definidos.
- **Quilômetros operacionais:** soma de `km_final - km_inicial` das jornadas válidas.
- **Horas trabalhadas:** duração das jornadas válidas menos pausas; jornadas sobrepostas devem ser impedidas por veículo.
- **Receita por KM:** receita operacional dividida pelos quilômetros operacionais associados ao mesmo escopo.
- **Custo por KM:** custos operacionais apropriados divididos pelos quilômetros operacionais do mesmo escopo.
- **Lucro por hora:** lucro líquido operacional dividido pelas horas trabalhadas do mesmo escopo.
- **Patrimônio líquido:** ativos avaliados na data menos passivos na mesma data.
- **Fluxo de caixa:** entradas menos saídas de caixa; transferências internas são excluídas do consolidado.

## 4.2 Regras obrigatórias para todos os indicadores

1. Não dividir por zero; retornar indicador indisponível com motivo.
2. Excluir registros cancelados, mantendo-os na auditoria.
3. Informar quando o resultado for parcial por ausência de corridas, horas ou KM.
4. Aplicar o mesmo período, timezone, usuário e veículo ao numerador e denominador.
5. Arredondar somente na apresentação; cálculos internos preservam precisão.
6. Versionar fórmulas quando uma regra mudar, para relatórios históricos continuarem explicáveis.
7. Não tratar transferências, aportes, resgates ou amortização de principal como receita/despesa operacional.

## 4.3 Decisões de cálculo ainda necessárias

- regime de caixa, competência ou híbrido;
- rateio de despesas fixas entre períodos e veículos;
- inclusão de depreciação e custo de oportunidade;
- método de consumo de combustível;
- tratamento de jornadas atravessando meia-noite;
- atribuição de receita agregada a jornadas e veículos;
- retorno de investimentos: simples, TWR, MWR/XIRR ou combinação;
- projeção de metas e quantidade mínima de histórico;
- critérios para anomalias e comparação com média.

---

# 5. Melhorias recomendadas na documentação

## Prioridade P0 — antes de criar o projeto

1. Registrar decisões para plataforma, escopo do MVP, política financeira e múltiplos veículos.
2. Resolver INC-01 a INC-08 nos documentos de origem.
3. Reescrever requisitos com IDs (`RF`, `RNF`), prioridade, versão e critérios de aceite.
4. Criar um dicionário de dados com cardinalidade, constraints, tipos e ownership.
5. Criar catálogo de cálculos com exemplos numéricos e casos-limite.
6. Definir requisitos não funcionais mensuráveis.

## Prioridade P1 — antes do primeiro módulo funcional

1. Especificar casos de uso e contratos da camada de aplicação.
2. Definir máquina de estados de lançamentos e jornadas.
3. Definir taxonomia de categorias e possibilidade de categorias personalizadas.
4. Definir estratégia de backup, restauração e migrations.
5. Criar matriz de rastreabilidade: requisito → regra → caso de uso → tabela → teste.
6. Criar ADRs para decisões técnicas; preservar `12_DECISOES.md` para decisões de produto/projeto.

## Prioridade P2 — antes da distribuição

1. Especificar acessibilidade, responsividade e design system.
2. Documentar privacidade, retenção, exportação e proteção de dados.
3. Definir telemetria somente mediante consentimento; o sistema principal deve funcionar sem ela.
4. Criar manual de recuperação de banco e diagnóstico.
5. Documentar compatibilidade de sistema operacional e política de atualização.

---

# 6. Decisões recomendadas

Estas recomendações ainda não são decisões oficiais.

## 6.1 Plataforma

Recomendação: aplicação desktop local-first com React, TypeScript, Vite, Electron, Node.js, Prisma e SQLite.

Justificativa:

- atende SQLite + Prisma sem criar um servidor externo;
- funciona offline;
- permite empacotamento e backup do banco;
- mantém domínio e casos de uso em TypeScript reutilizáveis;
- reduz a distância para uma futura API cloud.

Alternativas como Tauri ou aplicação web com servidor local são possíveis, mas exigem rever o adaptador Prisma/runtime. **Decisão necessária.**

## 6.2 Organização arquitetural

Recomendação: monólito modular, feature-first, com dependências apontando para o domínio.

```text
src/
  modules/
    finance/
      domain/
      application/
      infrastructure/
      presentation/
    operations/
    vehicles/
    maintenance/
    goals/
    patrimony/
    reports/
  shared/
    domain/
    application/
    infrastructure/
    presentation/
  app/
  database/
  tests/
```

Regras de dependência:

1. `domain` não depende de framework, Prisma ou UI.
2. `application` orquestra casos de uso e transações.
3. `infrastructure` implementa portas de persistência, relógio, IDs, backup e integrações.
4. `presentation` valida DTOs de entrada e apresenta resultados.
5. Módulos não acessam tabelas de outros módulos diretamente; usam casos de uso ou contratos explícitos.

## 6.3 Contrato interno

O nome “API interna” deve representar casos de uso, não obrigatoriamente HTTP. Recomenda-se:

- DTOs validados na fronteira;
- resultado tipado com `code`, `message`, `details` e `correlationId`;
- schemas compartilhados apenas na fronteira;
- paginação e filtros padronizados;
- transações controladas pela camada de aplicação;
- handlers IPC finos caso Electron seja aprovado;
- adaptação futura dos mesmos casos de uso para REST.

---

# 7. Modelo de domínio proposto

## 7.1 Identidade e configuração

- `users`: perfil proprietário e preferências.
- `user_settings`: moeda, locale, timezone, tema e notificações.

Mesmo que o MVP tenha apenas um usuário local, todas as raízes agregadas devem possuir `user_id` quando aplicável.

## 7.2 Operação

- `operation_sessions`: início, fim, veículo, KM inicial/final, pausas e status.
- `rides`: corrida opcional associada à jornada, plataforma, valor e distância.
- `odometer_readings`: histórico imutável da quilometragem e origem da leitura.

## 7.3 Financeiro

- `financial_entries`: lançamento canônico de receita, despesa, ajuste ou retirada.
- `categories`: categorias padrão e personalizadas, natureza e variabilidade.
- `accounts`: caixa, conta bancária, carteira ou conta de investimento.
- `account_postings`: movimentos que alteram saldos.
- `transfers`: ligação atômica entre saída e entrada de contas diferentes.
- `installment_plans` e `installments`: parcelamentos e ocorrências.

Abastecimento, manutenção, imposto e documento podem referenciar um `financial_entry_id`; não devem gerar um segundo valor independente.

## 7.4 Veículos e manutenção

- `vehicles`: dados cadastrais, status e identificação.
- `vehicle_valuations`: valores históricos, fonte e data-base.
- `fuelings`: litros, preço, total, odômetro, tanque cheio e posto.
- `maintenance_plans`: componente, intervalo de KM/tempo e tolerância.
- `maintenance_events`: execução, odômetro, data, fornecedor e custo vinculado.
- `vehicle_documents`: seguro, IPVA, licenciamento, multa, validade e status.

## 7.5 Patrimônio

- `assets`: ativos não representados diretamente por contas ou veículos.
- `liabilities`: dívidas, financiamentos e saldo devedor.
- `investment_positions`: posição por produto.
- `investment_transactions`: aporte, resgate, rendimento e taxas.
- `valuation_snapshots`: avaliações históricas reproduzíveis.

`patrimônio` deve ser uma projeção calculada ou snapshot, não uma entrada manual duplicada.

## 7.6 Metas, alertas e auditoria

- `goals`: tipo, alvo, período, escopo e status; sempre opcionais.
- `alerts`: regra, severidade, contexto, leitura e resolução.
- `audit_logs`: append-only, com ator, ação, entidade, valores anterior/novo e correlação.

## 7.7 Constraints mínimas

- valores monetários armazenados em centavos inteiros e não negativos onde aplicável;
- placa única por usuário enquanto ativa;
- KM final maior ou igual ao inicial;
- odômetro não regressivo, salvo ajuste auditado;
- jornada final posterior ao início;
- lançamento cancelado não pode ser editado silenciosamente;
- transferência deve balancear origem e destino na mesma transação;
- vínculos 1:1 entre detalhe especializado e lançamento financeiro quando houver custo;
- índices por `user_id`, `vehicle_id`, data, status e categoria conforme consultas;
- foreign keys habilitadas no SQLite.

---

# 8. Plano técnico de implementação

Cada fase abaixo deve terminar utilizável, testada e documentada. As estimativas devem ser feitas apenas após as decisões P0 e o detalhamento dos critérios de aceite.

## Fase 0 — Especificação executável e decisões

Entregas:

1. Resolver os oito conflitos críticos.
2. Aprovar plataforma e stack.
3. Aprovar escopo do MVP e matriz de versões.
4. Definir política contábil gerencial e catálogo inicial de cálculos.
5. Criar requisitos numerados e critérios de aceite.
6. Criar diagrama de domínio e dicionário de dados.
7. Criar ADRs de plataforma, módulos, ledger e auditoria.

Critério de saída: nenhum item crítico sem decisão; cada funcionalidade do MVP possui regra, dados, caso de uso e aceite rastreáveis.

## Fase 1 — Fundação técnica

Entregas:

1. Scaffold do runtime aprovado, TypeScript estrito e estrutura modular.
2. Qualidade automatizada: formatter, lint, typecheck, testes e build.
3. Prisma + SQLite, migrations e seed de categorias.
4. IDs, relógio, dinheiro, datas, resultado tipado e validação.
5. Tratamento global de erros e logs sem dados sensíveis.
6. Auditoria append-only.
7. Pipeline local/CI com verificação de banco vazio e migração de banco existente.

Critério de saída: build reproduzível; primeira migration aplicável e reversão operacional documentada; testes executados automaticamente.

## Fase 2 — Onboarding e veículos

Entregas:

1. Perfil local e preferências.
2. Cadastro, edição, ativação e inativação de veículos.
3. Leituras de odômetro e histórico.
4. Seleção de veículo ativo sem impedir veículos adicionais no modelo.
5. Onboarding progressivo; contas, metas e investimentos não bloqueiam o dashboard.

Critério de saída: usuário consegue entrar no sistema, cadastrar veículo e consultar histórico; regras de placa e odômetro são validadas e auditadas.

## Fase 3 — Operação e ledger financeiro

Entregas:

1. Contas, categorias e lançamentos financeiros.
2. Receitas individuais e fechamento diário sem duplicidade.
3. Despesas, escopo e classificação fixa/variável.
4. Transferências, retiradas e parcelamentos conforme regras aprovadas.
5. Jornadas com KM, horários, pausas e veículo.
6. Cancelamento lógico e correções auditadas.
7. Consultas com filtros e paginação.

Critério de saída: um dia completo pode ser registrado; saldo, receita, despesa, horas e KM são reconciliáveis; nenhuma exclusão física ocorre pela aplicação.

## Fase 4 — Abastecimento e manutenção

Entregas:

1. Abastecimento vinculado a lançamento financeiro e odômetro.
2. Cálculo de consumo segundo método aprovado.
3. Planos de manutenção por KM, tempo ou ambos.
4. Eventos de manutenção vinculados a custo.
5. Seguro, IPVA, licenciamento e multas com vencimentos.
6. Alertas determinísticos locais.

Critério de saída: custos não são duplicados; próximos vencimentos são reproduzíveis; alertas funcionam offline.

## Fase 5 — Dashboard, metas e relatórios básicos

Entregas:

1. Serviço central de indicadores com fórmulas versionadas.
2. Dashboard com período e veículo explícitos.
3. Explicação, origem e estado parcial/indisponível de cada indicador.
4. Metas opcionais financeiras e operacionais.
5. Relatórios diário, semanal, mensal, anual e comparativo.
6. Estados vazios, erro, loading e acessibilidade básica.

Critério de saída: todos os números do dashboard podem ser reproduzidos a partir dos lançamentos; exemplos do catálogo de cálculos passam como testes.

## Fase 6 — Patrimônio, investimentos e portabilidade (versão 1.5)

Entregas:

1. Ativos, passivos, avaliações e patrimônio líquido.
2. Reserva como finalidade de contas/posições.
3. Investimentos e rentabilidade no nível aprovado.
4. Exportação em formato aberto.
5. Backup e restauração versionados, íntegros e testados.
6. Importação somente com validação, prévia e relatório de conflitos.

Critério de saída: patrimônio não contém dupla contagem; backup restaurado reproduz saldos e auditoria; exportação é documentada.

## Fase 7 — Inteligência financeira (versão 2.0)

Entregas:

1. Baselines estatísticos configuráveis.
2. Alertas de variação de gasto, lucro, consumo e faturamento.
3. Previsão de caixa com intervalo de incerteza.
4. Simulações separadas de dados realizados.
5. Recomendações explicáveis, com premissas e caráter informativo.

Critério de saída: toda recomendação informa dados usados, regra/modelo, confiança e limitações; falsos positivos podem ser dispensados pelo usuário.

## Fase 8 — Cloud e mobile (versão 3.0)

Entregas condicionadas a projeto específico de sincronização:

1. identidade remota e autorização;
2. protocolo de sync, tombstones e resolução de conflitos;
3. criptografia em trânsito e proteção de credenciais;
4. API versionada;
5. observabilidade e recuperação;
6. clientes mobile reutilizando contratos do domínio/aplicação quando possível.

Não implementar sincronização apenas adicionando campos `synced`; ela exige modelo próprio de consistência.

---

# 9. Estratégia de testes

## 9.1 Pirâmide

- **Unitários:** entidades, value objects, fórmulas e políticas de rateio.
- **Integração:** repositories reais com SQLite temporário, migrations e transações.
- **Contrato:** DTOs, handlers internos e catálogo de erros.
- **Componente:** formulários, validações e estados de interface.
- **E2E:** onboarding, jornada diária, cancelamento, fechamento, backup e restauração.

## 9.2 Casos obrigatórios

1. períodos sem receita, KM, horas ou corridas;
2. jornada atravessando meia-noite e mudança de timezone;
3. lançamentos retroativos e cancelados;
4. transferência entre contas sem alterar o caixa consolidado;
5. despesa parcelada e financiamento com principal/juros;
6. múltiplos veículos e custo sem veículo;
7. abastecimento parcial versus tanque cheio;
8. migration sobre banco com dados;
9. falha no meio de operação financeira com rollback integral;
10. restauração de backup de versão anterior suportada.

## 9.3 Portões de qualidade

Uma entrega somente está pronta quando:

- critérios de aceite estão automatizados quando viável;
- lint, typecheck, testes e build passam sem warnings relevantes;
- migrations foram testadas em banco vazio e com fixture da versão anterior;
- não há acesso direto da UI ao banco;
- cálculo novo possui exemplo documentado e teste;
- alteração de regra possui decisão/documentação correspondente;
- auditoria, cancelamento e backup foram avaliados quando aplicáveis.

---

# 10. Requisitos não funcionais a definir

Os valores precisam ser aprovados, mas as categorias são obrigatórias:

- sistemas operacionais suportados;
- tempo máximo de inicialização e resposta das consultas principais;
- volume de anos, jornadas e lançamentos usado em testes de desempenho;
- tamanho e frequência de backup;
- RPO/RTO de recuperação local;
- política de compatibilidade e migrations;
- disponibilidade integral offline das funções do MVP;
- WCAG/alvo de acessibilidade;
- locale, moeda e timezone suportados;
- proteção de banco, backup e dados sensíveis;
- política de atualização e assinatura do aplicativo;
- política de logs e privacidade.

---

# 11. Riscos principais e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| Fórmulas ambíguas | Indicadores perdem credibilidade | Catálogo versionado, exemplos e testes antes da UI |
| Dupla contagem | Lucro e patrimônio incorretos | Ledger canônico e vínculos 1:1 |
| Escopo excessivo do MVP | Atraso e módulos incompletos | Entregas verticais e critérios de saída |
| Escolha tardia da plataforma | Reestruturação do projeto | ADR de runtime na Fase 0 |
| Banco local corrompido/perdido | Perda grave de dados | Transações, backup versionado, restore testado e verificação de integridade |
| Abstração prematura para cloud | Complexidade sem benefício | Portas estáveis apenas nas fronteiras reais; monólito modular |
| Recomendações financeiras opacas | Risco de confiança e produto | Premissas explícitas, caráter informativo e opção de desativar |
| Crescimento do schema sem rastreabilidade | Migrations frágeis | Dicionário de dados, ADR e testes de upgrade |

---

# 12. Ordem recomendada para corrigir os documentos atuais

1. `12_DECISOES.md`: registrar novas decisões aprovadas, sem editar as antigas.
2. `10_ROADMAP.md`: alinhar MVP, 1.5 e 2.0 às decisões.
3. `02_REGRAS_NEGOCIO.md`: corrigir metas, despesas, ledger, lucro e patrimônio.
4. `06_CALCULOS.md`: incluir fórmulas, escopo, filtros e casos-limite.
5. `01_REQUISITOS.md`: numerar, priorizar, versionar e adicionar aceite.
6. `05_DATABASE.md`: substituir a lista de entidades por modelo detalhado.
7. `03_FLUXOS.md`: tornar onboarding opcional/progressivo e tratar erros/exceções.
8. `07_API.md`: especificar casos de uso, DTOs e erros.
9. `08_ARCHITECTURE.md`: registrar runtime e dependências entre camadas.
10. `04_TELAS.md`: alinhar telas ao roadmap e especificar estados de UX.
11. `13_GLOSSARIO.md`: completar termos e corrigir definições financeiras.
12. `09_DEVELOPER.md` e `11_MASTER_PROMPT.md`: atualizar somente após as fontes normativas, reduzindo duplicação.

---

# 13. Próximo marco recomendado

O próximo marco não deve ser a implementação de telas. Deve ser um **Sprint 0 de especificação**, concluído quando:

1. as decisões críticas estiverem registradas;
2. o MVP possuir escopo fechado;
3. seis fluxos verticais estiverem especificados: onboarding, jornada, receita, despesa, abastecimento e cancelamento;
4. lucro, custo/KM, receita/KM, lucro/hora e fluxo de caixa tiverem fórmulas aprovadas;
5. o modelo inicial de dados e os contratos dos casos de uso estiverem revisados;
6. os critérios de aceite permitirem iniciar a Fase 1 sem suposições.

Somente depois desse marco o scaffold técnico deve ser criado.
