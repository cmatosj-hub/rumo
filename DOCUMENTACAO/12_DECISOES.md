# DECISÕES DO PROJETO RUMO

## Objetivo

Este documento registra todas as decisões importantes tomadas durante o desenvolvimento do projeto.

Seu objetivo é preservar o contexto das decisões para que futuras alterações não desfaçam escolhas já aprovadas.

Sempre que uma decisão relevante for tomada, este documento deverá ser atualizado.

---

# DECISÃO 001

## Título

O RUMO será um ERP pessoal.

## Data

13/07/2026

## Motivo

Foi decidido que o projeto não será apenas um controle financeiro.

O sistema deverá atuar como um Sistema de Gestão Operacional e Patrimonial voltado para motoristas de aplicativo.

## Impacto

Toda nova funcionalidade deverá contribuir para auxiliar a tomada de decisões do usuário.

---

# DECISÃO 002

## Título

Documentação é soberana.

## Data

13/07/2026

## Motivo

Evitar que o projeto mude de direção conforme novas conversas com IA.

## Impacto

Sempre que existir conflito entre código e documentação, prevalece a documentação.

---

# DECISÃO 003

## Título

Nenhum dado financeiro poderá ser excluído.

## Data

13/07/2026

## Motivo

Garantir integridade histórica.

## Impacto

Exclusões serão realizadas através de cancelamento lógico.

---

# DECISÃO 004

## Título

Todas as regras de negócio ficarão em Services.

## Data

13/07/2026

## Motivo

Separar interface da lógica.

## Impacto

Nenhuma tela poderá conter cálculos financeiros.

---

# DECISÃO 005

## Título

O banco inicial será SQLite.

## Data

13/07/2026

## Motivo

Facilidade de instalação.

Maior velocidade.

Funcionamento offline.

## Impacto

Toda arquitetura deverá permitir migração futura para PostgreSQL.

---

# DECISÃO 006

## Título

Arquitetura Modular.

## Data

13/07/2026

## Motivo

Facilitar manutenção.

## Impacto

Cada módulo deverá ser independente.

---

# DECISÃO 007

## Título

O sistema deverá funcionar offline.

## Data

13/07/2026

## Motivo

Motoristas podem ficar sem internet.

## Impacto

Todas as funcionalidades principais deverão funcionar localmente.

---

# DECISÃO 008

## Título

Suporte a múltiplos veículos.

## Data

13/07/2026

## Motivo

Permitir crescimento do usuário.

## Impacto

Todas as tabelas relacionadas deverão considerar veículo como entidade principal.

---

# DECISÃO 009

## Título

Todas as metas serão opcionais.

## Data

13/07/2026

## Motivo

Cada motorista possui uma forma diferente de trabalhar.

## Impacto

Nenhuma funcionalidade dependerá obrigatoriamente de metas.

---

# DECISÃO 010

## Título

Separação entre Patrimônio e Fluxo de Caixa.

## Data

13/07/2026

## Motivo

Dinheiro disponível não representa patrimônio.

## Impacto

O sistema deverá controlar ambos de maneira independente.

---

# DECISÃO 011

## Título

Toda funcionalidade deverá ser escalável.

## Data

13/07/2026

## Motivo

Preparar futuras versões.

## Impacto

Sempre considerar:

- múltiplos usuários
- cloud
- aplicativo mobile
- integração bancária
- inteligência artificial

Mesmo que ainda não existam.

---

# DECISÃO 012

## Título

Código reutilizável.

## Data

13/07/2026

## Motivo

Evitar duplicações.

## Impacto

Sempre criar componentes reutilizáveis.

---

# DECISÃO 013

## Título

Todas as alterações importantes deverão ser documentadas.

## Data

13/07/2026

## Motivo

Preservar histórico do projeto.

## Impacto

Sempre atualizar a documentação antes da implementação.

---

# DECISÃO 014

## Título

Implementação por módulos.

## Data

13/07/2026

## Motivo

Reduzir regressões.

## Impacto

Nunca implementar diversas funcionalidades grandes simultaneamente.

---

# DECISÃO 015

## Título

O dashboard será o centro do sistema.

## Data

13/07/2026

## Motivo

O usuário deve obter rapidamente todas as informações essenciais.

## Impacto

Todas as funcionalidades deverão alimentar o dashboard automaticamente.

---

# DECISÃO 016

## Título

O sistema deverá explicar indicadores financeiros.

## Data

13/07/2026

## Motivo

Nem todo motorista possui conhecimento financeiro.

## Impacto

Indicadores importantes deverão possuir descrição e orientação para interpretação.

---

# DECISÃO 017

## Título

Inteligência financeira integrada.

## Data

13/07/2026

## Motivo

O sistema deve ajudar o usuário a tomar decisões.

## Impacto

Sempre que possível, o sistema deverá identificar padrões e gerar alertas e recomendações.

---

# DECISÃO 018

## Título

Experiência do usuário acima da complexidade.

## Data

13/07/2026

## Motivo

O usuário utilizará o sistema diariamente.

## Impacto

Sempre priorizar simplicidade, rapidez e facilidade de uso.

---

# Como registrar novas decisões

Sempre utilizar o seguinte modelo:

--------------------------------------------------

# DECISÃO XXX

## Título

...

## Data

...

## Motivo

...

## Impacto

...

--------------------------------------------------

Nunca alterar decisões antigas.

Caso uma decisão seja substituída, criar uma nova decisão informando qual foi revisada e por quê.

Este documento representa a memória permanente do projeto.

# DECISÃO 019

## Título

Plataforma desktop local-first para a primeira versão.

## Data

13/07/2026

## Motivo

O RUMO precisa funcionar integralmente offline nas funcionalidades do MVP e utilizar SQLite localmente.

Também é necessário definir uma plataforma compatível com a interface gráfica, Prisma, SQLite e os serviços locais da aplicação.

## Impacto

A primeira versão do RUMO será um aplicativo desktop local-first para Windows.

A stack aprovada será:

- Electron;
- React;
- TypeScript;
- Vite;
- Node.js;
- Prisma;
- SQLite.

As funcionalidades pertencentes ao MVP deverão funcionar integralmente offline.

O processo de interface do Electron não poderá acessar diretamente recursos privilegiados do Node.js, Prisma ou SQLite.

Esta decisão complementa as Decisões 005 e 007.

# DECISÃO 020

## Título

Escopo do MVP 1.0.

## Data

13/07/2026

## Motivo

O escopo atual está distribuído entre requisitos, fluxos, telas e roadmap, gerando dúvidas sobre quais funcionalidades devem estar disponíveis na primeira versão.

É necessário estabelecer uma fronteira objetiva para o MVP e impedir que módulos avançados atrasem a entrega da fundação operacional.

## Impacto

O MVP 1.0 deverá conter:

- fundação técnica;
- perfil local;
- preferências básicas;
- cadastro de veículos;
- seleção de veículo ativo;
- jornadas de trabalho;
- receitas;
- despesas;
- contas financeiras básicas;
- transferências entre contas;
- retiradas pessoais;
- abastecimentos;
- manutenções;
- metas opcionais simples;
- dashboard básico;
- relatórios básicos;
- alertas determinísticos;
- auditoria;
- cancelamento lógico;
- backup local básico.

Não fazem parte do MVP 1.0:

- investimentos completos;
- rentabilidade avançada;
- patrimônio completo;
- previsões financeiras;
- inteligência estatística;
- recomendações automáticas;
- sincronização em nuvem;
- aplicativo mobile;
- integrações bancárias.

Funcionalidades fora do MVP poderão ser consideradas na arquitetura, mas não deverão aumentar desnecessariamente a complexidade da primeira versão.

O roadmap e as telas deverão ser atualizados para refletir este escopo.

# DECISÃO 021

## Título

Suporte a múltiplos veículos desde o início.

## Data

13/07/2026

## Motivo

O sistema precisa preservar o histórico de cada veículo e evitar uma futura reestruturação do modelo de dados.

Ao mesmo tempo, a operação diária precisa identificar claramente qual veículo está sendo utilizado.

## Impacto

O modelo de dados deverá suportar múltiplos veículos desde o início.

No MVP, o usuário poderá cadastrar múltiplos veículos, mas somente um veículo será considerado ativo por vez.

Cada jornada de trabalho deverá estar obrigatoriamente vinculada a um veículo.

Despesas poderão possuir veículo opcional, conforme seu escopo.

Despesas específicas de veículo, como abastecimento, manutenção, multa, seguro, IPVA e licenciamento, deverão possuir o vínculo correspondente quando aplicável.

Esta decisão detalha a Decisão 008 e substitui a interpretação de que toda despesa, independentemente de sua natureza, precisa estar vinculada a um veículo.

# DECISÃO 022

## Título

Lançamento financeiro canônico.

## Data

13/07/2026

## Motivo

Abastecimentos, manutenções, impostos, multas e documentos podem representar fatos financeiros e, simultaneamente, possuir informações especializadas.

Armazenar custos independentes em diferentes entidades pode provocar dupla contagem em saldos, relatórios e indicadores.

## Impacto

Todo valor que afete contas financeiras deverá ser representado por um lançamento ou movimento financeiro canônico.

Abastecimentos, manutenções, impostos, multas e documentos poderão possuir dados especializados, mas não poderão armazenar um segundo custo independente que provoque dupla contagem.

Quando um registro especializado possuir efeito financeiro, ele deverá estar vinculado ao lançamento ou movimento canônico correspondente.

Indicadores, saldos e relatórios financeiros deverão utilizar a fonte financeira canônica.

A criação, alteração ou cancelamento do fato especializado e de seu efeito financeiro deverá preservar consistência transacional e auditoria.

# DECISÃO 023

## Título

Saldos derivados dos movimentos financeiros.

## Data

13/07/2026

## Motivo

Um saldo editável sem correspondência com o histórico de movimentos pode gerar divergências, impedir auditoria e comprometer relatórios financeiros.

## Impacto

O saldo de cada conta deverá ser derivado dos movimentos financeiros registrados.

O sistema não deverá depender exclusivamente de um campo de saldo editável manualmente.

Caso exista um campo de saldo persistido por motivo de desempenho, ele será uma projeção reconstruível e não a fonte primária da informação.

Ajustes de saldo deverão ser registrados como movimentos financeiros auditados, com data, valor, motivo e identificação da operação.

Nenhuma correção de saldo poderá apagar ou modificar silenciosamente o histórico financeiro.

# DECISÃO 024

## Título

Transferências atômicas entre contas.

## Data

13/07/2026

## Motivo

Uma transferência altera duas contas, mas não representa geração de receita ou ocorrência de despesa para o conjunto financeiro do usuário.

Registrar apenas um dos lados da operação pode causar inconsistência de saldos.

## Impacto

Transferências entre contas deverão possuir uma saída e uma entrada vinculadas na mesma operação atômica.

A operação deverá ser concluída integralmente ou revertida integralmente em caso de erro.

Transferências internas não serão consideradas receita nem despesa operacional.

O valor consolidado das contas não deverá ser alterado por uma transferência interna, desconsiderando eventuais taxas explicitamente registradas.

O cancelamento ou correção de uma transferência deverá preservar os dois movimentos vinculados e a auditoria da operação.

# DECISÃO 025

## Título

Tratamento da retirada pessoal.

## Data

13/07/2026

## Motivo

A retirada pessoal reduz os recursos disponíveis para a operação, mas não representa um custo necessário para produzir a receita operacional.

Classificá-la como despesa operacional distorceria o cálculo de lucro da atividade.

## Impacto

Retirada pessoal será uma transferência de recursos operacionais para uso pessoal.

A retirada pessoal não será classificada como despesa operacional e não reduzirá o resultado operacional.

Ela deverá reduzir o saldo da conta de origem e permanecer identificável nos relatórios de movimentação financeira.

O sistema deverá diferenciar claramente lucro operacional, fluxo de caixa e valor retirado para uso pessoal.

# DECISÃO 026

## Título

Definição e faseamento do patrimônio líquido.

## Data

13/07/2026

## Motivo

A documentação define patrimônio como a soma de ativos menos passivos, mas as regras atuais descrevem principalmente ativos.

Além disso, o patrimônio completo exige entidades e cálculos que não são necessários para validar o núcleo operacional do MVP.

## Impacto

Patrimônio líquido será calculado como:

ativos menos passivos.

O patrimônio completo será implementado na versão 1.5.

O MVP poderá mostrar apenas informações financeiras e operacionais compatíveis com os dados existentes.

O MVP não deverá apresentar como patrimônio líquido um valor que considere apenas contas financeiras ou apenas ativos.

Ativos, passivos, financiamentos, avaliações de veículos e posições de investimento deverão ser incorporados ao cálculo completo na versão correspondente.

Esta decisão detalha a separação entre patrimônio e fluxo de caixa estabelecida pela Decisão 010.

# DECISÃO 027

## Título

Todas as metas são opcionais.

## Data

13/07/2026

## Motivo

Cada motorista possui objetivos e formas de trabalho diferentes.

Exigir metas impediria o uso dos fluxos principais por usuários que desejam apenas registrar e acompanhar sua operação.

## Impacto

Todas as metas serão opcionais.

Nenhum fluxo principal ou onboarding poderá exigir a criação de uma meta.

A ausência de metas não poderá impedir o cadastro de jornadas, receitas, despesas, veículos, abastecimentos ou manutenções.

Indicadores relacionados a metas deverão ser exibidos somente quando existir uma meta aplicável e ativa.

Esta decisão reafirma a Decisão 009 e substitui a possibilidade de metas obrigatórias descrita nas regras de negócio anteriores.

# DECISÃO 028

## Título

Onboarding progressivo.

## Data

13/07/2026

## Motivo

O fluxo de primeiro acesso atualmente exige contas, metas e investimentos antes de permitir o acesso ao dashboard.

Parte dessas funcionalidades é opcional ou pertence a versões posteriores, tornando o primeiro uso excessivamente longo e incompatível com o MVP.

## Impacto

O onboarding obrigatório do MVP deverá exigir apenas as informações mínimas para utilização do sistema.

Cadastro de metas, investimentos, reserva de emergência e contas adicionais será opcional e poderá ser realizado posteriormente.

Funcionalidades que não pertencem ao MVP não poderão bloquear o primeiro acesso.

O sistema deverá permitir que o usuário complete configurações opcionais de forma progressiva.

A conta financeira mínima necessária para os fluxos do MVP deverá ser criada ou configurada conforme regra específica a ser documentada.

# DECISÃO 029

## Título

Faseamento da inteligência financeira.

## Data

13/07/2026

## Motivo

Alertas baseados em regras explícitas podem ser implementados e testados com pouco histórico.

Detecção estatística, previsões e recomendações automáticas exigem dados suficientes, critérios de confiança e tratamento de incerteza.

## Impacto

No MVP serão implementados somente alertas determinísticos, baseados em regras explícitas.

Detecção estatística de anomalias, previsões financeiras e recomendações automáticas serão implementadas somente na versão 2.0.

Todo alerta determinístico deverá possuir regra identificável, dados de origem e condição objetiva de disparo.

Esta decisão revisa o impacto temporal da Decisão 017.

A inteligência financeira continua sendo parte da visão do produto, mas suas capacidades estatísticas e preditivas não fazem parte do MVP.

# DECISÃO 030

## Título

Política de armazenamento de valores monetários.

## Data

13/07/2026

## Motivo

Valores monetários armazenados como números de ponto flutuante podem sofrer erros de precisão e produzir divergências em saldos e relatórios.

## Impacto

Valores monetários deverão ser armazenados como números inteiros em centavos.

O arredondamento deverá ocorrer apenas na apresentação, salvo regra financeira explicitamente documentada.

Cálculos intermediários deverão preservar a precisão necessária para a regra correspondente.

A moeda inicial será o Real brasileiro.

A preferência de moeda deverá existir na arquitetura para permitir evolução futura, sem exigir suporte completo a múltiplas moedas no MVP.

Valores monetários deverão ser representados por tipos e utilidades centralizados, não por cálculos dispersos na interface.

# DECISÃO 031

## Título

Política de datas, horários e timezone.

## Data

13/07/2026

## Motivo

Jornadas, lançamentos e relatórios dependem de uma interpretação consistente de datas, horários e virada do dia.

Armazenar horários sem timezone pode produzir agrupamentos incorretos e dificultar futuras sincronizações.

## Impacto

Timestamps técnicos deverão ser armazenados em UTC.

O sistema deverá utilizar o timezone configurado pelo usuário para exibição, agrupamento diário e relatórios.

A configuração inicial padrão será `America/Sao_Paulo`.

Datas civis que não representam um instante, como determinados vencimentos, poderão ser armazenadas como datas locais conforme sua natureza.

Conversões de timezone deverão ser centralizadas e não poderão ser realizadas diretamente pelas telas.

Jornadas que atravessam a meia-noite deverão ser tratadas conforme regra operacional específica a ser documentada.

# DECISÃO 032

## Título

Ordem de precedência documental.

## Data

13/07/2026

## Motivo

A afirmação de que a documentação é soberana não resolve conflitos entre dois documentos oficiais.

É necessário estabelecer qual fonte prevalece quando decisões, regras, requisitos, arquitetura, fluxos ou roadmap apresentarem determinações diferentes.

## Impacto

Em caso de conflito, deverá ser utilizada esta ordem de precedência:

1. decisões vigentes registradas em `12_DECISOES.md`;
2. regras de negócio aprovadas;
3. requisitos aprovados;
4. cálculos aprovados;
5. arquitetura;
6. fluxos e telas;
7. roadmap;
8. documentos orientativos e prompts.

Uma decisão antiga não deverá ser apagada.

Caso uma decisão seja substituída, deverá ser criada uma nova decisão indicando expressamente a decisão revisada.

Documentos de menor precedência deverão ser atualizados para refletir as decisões vigentes, evitando a manutenção intencional de contradições.

Esta decisão complementa as Decisões 002 e 013.

# DECISÃO 033

## Título

Organização como monólito modular por funcionalidades.

## Data

13/07/2026

## Motivo

A organização separada apenas por tipos técnicos pode espalhar uma funcionalidade entre muitos diretórios e aumentar o acoplamento.

O projeto precisa preservar limites claros entre módulos sem introduzir a complexidade operacional de serviços distribuídos.

## Impacto

O projeto será um monólito modular organizado por funcionalidades.

Cada módulo deverá possuir separação entre:

- domínio;
- aplicação;
- infraestrutura;
- apresentação.

O domínio não poderá depender de React, Electron, Prisma ou bibliotecas de interface.

A camada de aplicação deverá orquestrar os casos de uso.

A infraestrutura deverá implementar persistência, integrações e mecanismos específicos da plataforma.

A apresentação deverá tratar interação com o usuário e adaptação dos dados para a interface.

Esta decisão detalha a arquitetura modular da Decisão 006.

A Decisão 004 deverá ser interpretada como proibição de regras de negócio na interface ou nos repositories. As regras deverão permanecer no domínio ou nos serviços de aplicação apropriados.

# DECISÃO 034

## Título

Significado e fronteira da API interna.

## Data

13/07/2026

## Motivo

Na primeira versão desktop, a aplicação não precisa expor obrigatoriamente endpoints HTTP para separar interface, regras de negócio e persistência.

Entretanto, é necessário manter uma fronteira controlada entre o processo de interface e os recursos locais privilegiados.

## Impacto

A expressão API interna representará casos de uso da aplicação e não obrigatoriamente endpoints HTTP.

No Electron, a interface deverá acessar os casos de uso através de uma fronteira controlada, como handlers IPC.

A interface nunca poderá acessar Prisma ou SQLite diretamente.

Os handlers IPC deverão validar as entradas, chamar os casos de uso e retornar respostas padronizadas.

Regras de negócio, cálculos e transações não deverão ser implementados nos handlers IPC.

O acesso a Node.js, sistema de arquivos e banco de dados deverá permanecer fora do processo de renderização.

A arquitetura deverá permitir que os mesmos casos de uso sejam adaptados futuramente para uma API HTTP ou cloud.
