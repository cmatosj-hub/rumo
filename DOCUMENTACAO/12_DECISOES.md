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

# DECISÃO 035

## Título

Regime financeiro híbrido gerencial no MVP.

## Data

13/07/2026

## Motivo

O RUMO precisa demonstrar tanto o desempenho operacional do motorista quanto a movimentação efetiva de recursos.

O regime de caixa isolado concentraria receitas no momento do repasse bancário, mesmo quando o trabalho ocorreu em outro dia.

O regime de competência completo aumentaria a complexidade do MVP e aproximaria o sistema de uma contabilidade fiscal formal, que não é seu objetivo.

## Impacto

O MVP utilizará um modelo híbrido gerencial.

O resultado operacional será apurado pela data operacional ou competência do fato.

O fluxo de caixa será apurado pelos movimentos de conta efetivamente postados.

O saldo de cada conta será reconstruído exclusivamente a partir dos movimentos válidos dessa conta.

Receitas de aplicativos serão reconhecidas na data em que o trabalho ocorreu.

Quando a receita permanecer sob custódia do aplicativo, o fechamento diário poderá creditar uma conta financeira correspondente ao aplicativo.

O posterior repasse da conta do aplicativo para uma conta bancária será uma transferência interna.

Transferências internas não serão consideradas receita nem despesa operacional.

A data operacional e a data de postagem financeira poderão ser diferentes.

O modelo híbrido gerencial não representa contabilidade fiscal formal e não substitui obrigações contábeis ou tributárias do usuário.

As regras de competência, apropriação e rateio deverão ser especificadas em `06_CALCULOS.md` antes da implementação dos indicadores correspondentes.

# DECISÃO 036

## Título

Separação entre lançamento financeiro e movimento de conta.

## Data

13/07/2026

## Motivo

Um fato financeiro e seu efeito sobre uma conta representam conceitos diferentes.

Misturar esses conceitos impediria transferências com múltiplos movimentos, dificultaria reversões e aumentaria o risco de dupla contagem.

## Impacto

Lançamento financeiro representará o fato econômico ou financeiro.

Movimento de conta representará o efeito de um lançamento sobre o saldo de uma conta.

Um lançamento poderá produzir um ou mais movimentos de conta.

Receitas normalmente produzirão movimentos de crédito.

Despesas normalmente produzirão movimentos de débito.

Transferências internas produzirão, na mesma operação atômica, um movimento de débito na conta de origem e um movimento de crédito na conta de destino.

O saldo de cada conta será reconstruído exclusivamente a partir dos movimentos válidos.

Saldo inicial diferente de zero será representado por movimento de abertura auditado.

Ajustes de saldo serão representados por lançamentos e movimentos próprios, nunca pela edição direta de um campo de saldo.

Abastecimentos, manutenções, impostos, multas, documentos e outros detalhes especializados deverão referenciar o lançamento financeiro correspondente.

Detalhes especializados não poderão produzir um segundo custo independente utilizado em saldos, indicadores ou relatórios.

Lançamentos, movimentos e detalhes especializados relacionados deverão ser criados, corrigidos e cancelados de maneira transacionalmente consistente.

# DECISÃO 037

## Título

Estados próprios, correção auditada, cancelamento lógico e reversão financeira.

## Data

13/07/2026

## Motivo

Entidades diferentes possuem ciclos de vida diferentes.

Utilizar um status genérico para todas as tabelas produziria transições ambíguas e dificultaria a proteção de dados financeiros confirmados.

Correções e cancelamentos também precisam preservar os efeitos históricos sem corromper saldos.

## Impacto

Cada agregado possuirá estados próprios definidos em suas regras e no modelo de dados.

Não haverá um status genérico com o mesmo significado para todas as tabelas.

Os enums específicos serão formalizados antes da implementação de cada agregado.

Registros confirmados não poderão ser modificados silenciosamente.

Registros cancelados não poderão voltar diretamente ao estado confirmado.

Quando for necessário recriar um fato cancelado, deverá ser criado um novo registro com nova identidade e vínculo auditável quando pertinente.

Estados derivados exclusivamente de datas, como `vencido`, `a vencer` ou `em dia`, não serão persistidos como estados definitivos. Eles serão calculados a partir das datas válidas.

Cancelamento invalidará o fato de negócio sem apagá-lo.

Efeitos financeiros já postados serão neutralizados por movimentos de reversão.

Movimentos originais permanecerão preservados.

Reversões serão vinculadas aos movimentos ou lançamentos de origem.

Correções materiais de valor, conta ou data financeira exigirão motivo e auditoria.

Correções financeiras deverão neutralizar o efeito anterior e aplicar o efeito corrigido.

Campos meramente descritivos poderão seguir fluxo de edição auditada sem reversão financeira, desde que não alterem saldos, resultado, período ou classificação.

Exclusão física de dados financeiros continuará proibida.

Cancelamentos, correções e reversões relacionados a dados especializados deverão manter consistentes o lançamento, os movimentos e o registro especializado.

# DECISÃO 038

## Título

Criação guiada da conta financeira padrão.

## Data

13/07/2026

## Motivo

Os fluxos financeiros do MVP exigem pelo menos uma conta, mas criar silenciosamente uma conta fictícia poderia produzir saldos e relatórios sem correspondência com a realidade do usuário.

## Impacto

O onboarding financeiro incluirá a criação guiada de uma conta principal.

O usuário escolherá o tipo da conta e confirmará seu nome.

Os tipos iniciais poderão incluir:

- dinheiro físico;
- conta bancária;
- carteira digital;
- conta de aplicativo.

O sistema poderá sugerir o nome `Conta principal`, mas não confirmará a conta sem ação explícita do usuário.

Nenhuma conta financeira fictícia será criada silenciosamente.

O saldo inicial será opcional.

Saldo inicial diferente de zero produzirá um movimento auditado de abertura.

A conta principal será inicialmente utilizada como conta padrão para novos lançamentos.

O usuário poderá alterar a conta padrão posteriormente.

Uma conta inativa não poderá permanecer como conta padrão.

Contas adicionais serão opcionais e não bloquearão o onboarding.

# DECISÃO 039

## Título

Destino externo para retirada pessoal no MVP.

## Data

13/07/2026

## Motivo

Retirada pessoal reduz os recursos disponíveis para a operação, mas não representa custo necessário para produzir receita.

Uma contrapartida identificável é necessária para explicar a saída sem criar artificialmente uma conta pessoal com saldo interno.

## Impacto

A contrapartida da retirada pessoal no MVP será um destino externo identificado como `Uso pessoal`.

O destino externo não possuirá saldo financeiro interno.

A retirada pessoal deverá indicar a conta operacional de origem.

A retirada não será classificada como receita.

A retirada não será classificada como despesa operacional.

A retirada não integrará o resultado operacional.

A retirada reduzirá o saldo da conta de origem por meio de movimento de débito.

A retirada aparecerá separadamente no fluxo financeiro e nos relatórios.

O destino externo permitirá futura evolução para contas pessoais completas sem exigir que o MVP controle patrimônio pessoal detalhado.

A futura substituição do destino externo por conta pessoal interna exigirá nova decisão.

# DECISÃO 040

## Título

Exclusividade entre receita individual e fechamento diário.

## Data

13/07/2026

## Motivo

O usuário poderá preferir registrar apenas o total diário de cada aplicativo.

Permitir simultaneamente receitas individuais e fechamento diário para a mesma cobertura provocaria dupla contagem.

## Impacto

O fechamento diário será o fluxo recomendado de registro de receitas operacionais.

O registro de receita individual continuará opcional.

Para uma mesma cobertura, o usuário utilizará receita individual ou fechamento diário.

A cobertura considerará, no mínimo:

- proprietário;
- origem da receita;
- data operacional.

O veículo poderá participar da cobertura quando informado.

Quando o usuário optar por fechamento consolidado sem veículo, esse fechamento cobrirá a origem e a data operacional sem divisão por veículo.

Não será permitido misturar, para a mesma cobertura, fechamento consolidado e receitas individuais ou fechamentos por veículo.

Não haverá consolidação automática silenciosa.

Para trocar o modo de registro, o usuário deverá cancelar ou corrigir os registros conflitantes por fluxo auditado.

O sistema deverá verificar conflitos antes da confirmação.

Bônus, gorjetas e promoções poderão ser registrados como componentes da receita operacional, desde que não sejam somados novamente fora do total confirmado.

A regra completa de cobertura, unicidade e critérios de aceite deverá ser documentada antes da implementação do módulo de receitas.

# DECISÃO 041

## Título

Terminologia financeira padronizada e catálogo formal de cálculos.

## Data

13/07/2026

## Motivo

Termos como lucro, resultado, receita e fluxo de caixa aparecem com significados incompletos ou sobrepostos.

Sem definições formais, diferentes módulos poderiam apresentar números incompatíveis.

## Impacto

O projeto manterá um catálogo formal de cálculos em `06_CALCULOS.md`.

A terminologia inicial será:

- receita operacional;
- despesa operacional variável;
- despesa operacional fixa;
- resultado operacional;
- lucro bruto;
- lucro líquido gerencial;
- fluxo de caixa;
- saldo.

Receita operacional representará valores gerados pela atividade de motorista conforme o regime financeiro aprovado.

Despesa operacional variável representará custo operacional cuja ocorrência ou valor varia com a atividade, conforme classificação aprovada.

Despesa operacional fixa representará custo operacional não diretamente proporcional ao volume diário de atividade, conforme classificação aprovada.

Lucro bruto será calculado a partir da receita operacional menos as despesas operacionais variáveis reconhecidas no mesmo escopo.

Resultado operacional considerará receita operacional, despesas operacionais variáveis, despesas operacionais fixas e outros componentes operacionais expressamente aprovados.

Lucro líquido gerencial considerará o resultado operacional e os componentes não operacionais que o catálogo determinar, sem incluir transferências internas, retiradas pessoais ou movimentações patrimoniais como receita ou despesa.

Fluxo de caixa representará entradas e saídas efetivamente postadas, com transferências internas neutralizadas na visão consolidada.

Saldo representará créditos menos débitos válidos de uma conta, incluindo movimentos de abertura, ajustes e reversões.

As fórmulas completas, rateios, filtros, períodos, arredondamentos, tratamento de dados ausentes e exemplos serão definidos em `06_CALCULOS.md`.

Nenhum indicador será implementado antes da aprovação de sua fórmula e critérios de aceite.

# DECISÃO 042

## Título

Timestamps em UTC, timezone efetivo e data operacional histórica.

## Data

13/07/2026

## Motivo

Timestamps técnicos, datas operacionais e datas civis possuem significados diferentes.

Utilizar somente o timezone atual do usuário poderia reagrupar silenciosamente lançamentos e relatórios históricos.

## Impacto

Timestamps técnicos serão armazenados em UTC.

O timezone efetivo utilizado no registro será preservado quando for relevante para interpretação histórica.

A data operacional será persistida separadamente do timestamp técnico.

Alterações futuras no timezone configurado pelo usuário não modificarão a data operacional histórica.

Agrupamentos diários utilizarão a data operacional aprovada.

Datas civis de vencimento poderão ser armazenadas sem horário quando não representarem um instante específico.

Conversões para apresentação ocorrerão em utilidades centralizadas.

A interface não realizará conversões temporais que alterem regras de negócio.

A regra específica para jornadas atravessando a meia-noite permanecerá pendente até a decisão correspondente ao módulo de jornadas.

# DECISÃO 043

## Título

Escopo por usuário desde a primeira versão.

## Data

13/07/2026

## Motivo

Embora o MVP seja local e monousuário, o projeto prevê futura sincronização, cloud e múltiplos usuários.

Adicionar ownership apenas posteriormente exigiria migration transversal em praticamente todas as entidades.

## Impacto

As entidades relevantes do MVP possuirão `user_id` desde a primeira migration.

Será criado um perfil local proprietário dos dados.

Todos os casos de uso operarão em contexto explícito de usuário.

Consultas e alterações deverão filtrar o proprietário correspondente.

Entidades compartilhadas exclusivamente pelo sistema poderão ser dispensadas de `user_id` quando isso for definido no modelo de dados.

O MVP continuará permitindo apenas um usuário local ativo na aplicação.

A presença de `user_id` não implicará autenticação remota, múltiplas sessões ou interface multiusuário no MVP.

A decisão prepara isolamento futuro sem implementar sincronização ou cloud antecipadamente.

Constraints e índices relevantes deverão considerar `user_id`.

# DECISÃO 044

## Título

Auditoria append-only obrigatória.

## Data

13/07/2026

## Motivo

A integridade histórica exige registrar alterações relevantes sem permitir que o próprio fluxo auditado modifique ou apague sua evidência.

## Impacto

A auditoria utilizará log append-only.

Cada evento de auditoria conterá, no mínimo:

- entidade;
- identificador da entidade;
- ação;
- ator;
- timestamp UTC;
- valores anteriores;
- valores posteriores;
- motivo quando exigido;
- `correlationId`;
- origem da alteração.

A auditoria poderá registrar também data operacional e metadados técnicos necessários para explicar o evento.

As origens poderão incluir:

- interface;
- caso de uso;
- sistema;
- migration;
- restauração;
- integração futura.

Logs de auditoria não poderão ser editados ou apagados pelos fluxos normais da aplicação.

Cancelamentos, reversões, ajustes de saldo e correções financeiras materiais sempre exigirão motivo.

Correções de jornadas encerradas, ajustes de odômetro, troca de painel e restauração de backup também exigirão motivo.

O ator poderá ser identificado como usuário local, sistema, migration ou processo de restauração.

Eventos pertencentes à mesma operação compartilharão o mesmo `correlationId`.

Logs técnicos da aplicação e logs de auditoria possuirão finalidades e políticas de retenção diferentes.

# DECISÃO 045

## Título

Histórico append-only de odômetro e continuidade após troca de painel.

## Data

13/07/2026

## Motivo

Armazenar apenas o KM atual do veículo apagaria o histórico necessário para jornadas, consumo e manutenção.

Troca ou reinicialização do painel também pode produzir regressão legítima na leitura exibida.

## Impacto

Leituras de odômetro serão append-only.

O KM atual será derivado da última leitura válida.

O fluxo normal bloqueará leituras regressivas.

Ajustes de odômetro exigirão motivo e auditoria.

Registros históricos não serão reescritos.

Troca, substituição ou reinicialização do painel será tratada por evento específico.

O evento de troca registrará, no mínimo:

- veículo;
- leitura final anterior;
- nova leitura exibida;
- data operacional;
- motivo;
- ator.

O sistema manterá uma quilometragem efetiva monotônica para preservar continuidade histórica.

Jornadas, abastecimentos e manutenções deverão registrar a leitura exibida e a referência necessária para obter a quilometragem efetiva.

Cancelamento ou correção de leitura deverá recalcular os dados derivados afetados sem remover o histórico.

# DECISÃO 046

## Título

Método oficial de consumo e precisão dos dados de abastecimento.

## Data

13/07/2026

## Motivo

O consumo não pode ser calculado corretamente a partir de abastecimentos arbitrários sem conhecer o nível comparável do tanque.

Litros e preço por litro também exigem precisão superior à de valores monetários comuns.

## Impacto

O consumo calculado oficial do MVP utilizará o método tanque cheio a tanque cheio.

O cálculo utilizará:

- quilômetros efetivos percorridos desde o tanque cheio anterior;
- soma dos litros abastecidos desde esse tanque cheio, incluindo abastecimentos parciais e o abastecimento cheio final.

Abastecimentos parciais serão acumulados até o próximo abastecimento marcado como tanque cheio.

Sem dois marcos válidos de tanque cheio, o consumo calculado será apresentado como indisponível.

O consumo informado manualmente pelo computador de bordo será armazenado separadamente.

Consumo calculado e consumo informado nunca serão combinados ou substituídos silenciosamente.

A interface identificará claramente a origem do indicador.

O total pago será armazenado em centavos inteiros e será o valor financeiro autoritativo.

Conceitualmente, recomenda-se representar litros como quantidade inteira de mililitros, permitindo três casas decimais sem ponto flutuante.

Conceitualmente, recomenda-se representar o preço por litro como taxa inteira em milésimos de Real por litro, ou representação decimal equivalente que preserve pelo menos três casas decimais.

A representação física definitiva será documentada em `05_DATABASE.md`.

Divergências entre litros, preço unitário e total pago seguirão tolerância definida em `01_REQUISITOS.md` e `06_CALCULOS.md`.

O sistema não alterará automaticamente o total financeiro pago para forçar igualdade com o produto entre litros e preço unitário.

Correção ou cancelamento de abastecimento recalculará os ciclos de consumo afetados.

# DECISÃO 047

## Título

Taxonomia multidimensional e escopo das despesas.

## Data

13/07/2026

## Motivo

Uma única categoria não é suficiente para determinar se uma despesa é operacional, pessoal, patrimonial, fixa, variável ou vinculada a um veículo.

Associar toda despesa obrigatoriamente a veículo também excluiria despesas gerais e pessoais.

## Impacto

Toda despesa será classificada por dimensões independentes.

As dimensões obrigatórias serão:

- natureza;
- comportamento;
- escopo;
- categoria.

A natureza poderá ser:

- operacional;
- pessoal;
- patrimonial.

O comportamento poderá ser:

- fixo;
- variável.

O escopo poderá ser:

- veículo;
- jornada;
- operação geral;
- pessoal;
- patrimonial.

A categoria identificará o tipo, como combustível, alimentação, pedágio, estacionamento, lavagem, manutenção, seguro, IPVA, licenciamento, impostos, multas, financiamentos ou outras.

A categoria não determinará sozinha a natureza, o comportamento ou o escopo.

No MVP, exigirão veículo:

- combustível;
- abastecimento;
- manutenção de veículo;
- seguro de veículo;
- IPVA;
- licenciamento;
- multa vinculada a veículo;
- lavagem de veículo específico;
- financiamento vinculado a veículo, quando esse registro existir.

Permitirão veículo opcional:

- alimentação;
- pedágio;
- estacionamento;
- impostos gerais;
- taxas bancárias;
- despesas pessoais;
- despesas administrativas;
- outras despesas sem vínculo obrigatório definido.

Pedágio e estacionamento operacionais deverão permitir vínculo com veículo e jornada, sem tornar a jornada obrigatória.

As regras completas de impacto de multas no resultado e de separação entre principal, juros e encargos de financiamentos permanecerão pendentes no Grupo B.

# DECISÃO 048

## Título

Baseline de segurança local do MVP.

## Data

13/07/2026

## Motivo

O MVP será um aplicativo desktop local e monousuário, mas armazenará dados financeiros e operacionais sensíveis.

É necessário estabelecer proteções mínimas sem introduzir antecipadamente autenticação remota ou infraestrutura cloud.

## Impacto

O MVP será local e monousuário.

Não haverá autenticação remota no MVP.

O renderer do Electron não terá acesso direto ao Node.js, Prisma ou SQLite.

O banco será armazenado no diretório seguro de dados da aplicação para o usuário do Windows.

O acesso ao sistema de arquivos ocorrerá somente através de fronteiras autorizadas.

Logs técnicos não armazenarão desnecessariamente:

- saldos completos;
- valores financeiros detalhados;
- placas;
- nomes de contas;
- conteúdo integral de registros;
- credenciais;
- segredos.

Backups serão tratados como dados sensíveis.

Nenhuma senha, token ou segredo será armazenado em texto puro.

A primeira versão do MVP não utilizará criptografia própria do arquivo SQLite.

Essa escolha evita gerenciamento inseguro de chaves e complexidade prematura, mas mantém o risco de leitura dos dados por alguém que obtenha acesso ao perfil do Windows ou aos arquivos de backup.

Como proteções compensatórias:

- o banco ficará no diretório do usuário;
- a aplicação não exporá acesso direto ao banco;
- backups exigirão ação explícita;
- a interface alertará que backups contêm dados sensíveis;
- arquivos não serão enviados para serviços externos;
- logs serão minimizados e sanitizados;
- o funcionamento permanecerá offline.

Proteção adicional por senha, criptografia do banco ou integração com mecanismos seguros do sistema operacional será analisada separadamente antes de distribuição ampla ou suporte multiusuário.

# DECISÃO 049

## Título

Requisitos não funcionais mínimos do MVP.

## Data

13/07/2026

## Motivo

Critérios apenas qualitativos, como desempenho elevado ou boa acessibilidade, não permitem verificar se a fundação e o MVP estão concluídos.

Os valores precisam ser realistas para um aplicativo pessoal local.

## Impacto

O alvo inicial de compatibilidade será:

- Windows 10 versão 22H2 em arquitetura x64;
- Windows 11 em arquitetura x64.

ARM64 e versões anteriores do Windows ficarão fora do suporte inicial.

A compatibilidade com Windows 10 será reavaliada antes da distribuição, independentemente do ciclo de suporte do fornecedor do sistema operacional.

Em equipamento de referência com processador de quatro núcleos, 8 GB de RAM e SSD:

- inicialização fria deverá ocorrer em até 5 segundos no percentil 95;
- consultas comuns deverão responder em até 500 milissegundos no percentil 95;
- relatórios anuais básicos deverão responder em até 2 segundos no percentil 95.

Os testes mínimos de volume utilizarão, pelo menos:

- 5 anos de dados;
- 50.000 lançamentos financeiros;
- 100.000 movimentos de conta;
- 5.000 jornadas;
- 10 veículos;
- 10.000 registros especializados entre abastecimentos, manutenções e documentos;
- 250.000 eventos de auditoria.

Todas as funcionalidades do MVP operarão sem conexão com a internet.

Falha de migration deverá:

- preservar o banco anterior;
- impedir continuação com schema parcialmente atualizado;
- apresentar erro compreensível;
- permitir nova tentativa ou restauração;
- não causar perda silenciosa de dados.

Backup válido deverá conter identificação de versão, verificação de integridade e dados suficientes para restauração integral.

Restauração deverá utilizar arquivo temporário, backup preventivo e substituição atômica.

Acessibilidade mínima incluirá:

- operação das ações essenciais por teclado;
- foco visível;
- rótulos associados aos campos;
- mensagens de erro compreensíveis;
- contraste mínimo de 4,5:1 para texto comum;
- ausência de dependência exclusiva de cor para comunicar estado.

Logs técnicos locais terão retenção inicial máxima de 30 dias ou 20 MB, prevalecendo o limite atingido primeiro.

Logs técnicos poderão conter:

- timestamp;
- severidade;
- módulo;
- código de erro;
- `correlationId`;
- mensagem sanitizada.

Logs técnicos não substituirão a auditoria.

A auditoria seguirá retenção histórica e não será removida pela rotação de logs técnicos.

Os valores de desempenho, volume, compatibilidade e retenção são metas iniciais do MVP e poderão ser revisados por nova decisão, com justificativa e testes correspondentes.

---

# DECISÃO 050

## Título

Preferências de metas e dashboard operacional da primeira vertical.

## Data

18/07/2026

## Motivo

O fechamento diário precisa oferecer acompanhamento semanal útil antes da implantação do modelo financeiro canônico completo, sem antecipar o agregado genérico de metas nem tornar metas obrigatórias.

## Impacto

`UserSettings` armazenará, como preferências opcionais do usuário local, meta semanal, meta mensal e mínimo líquido desejado por hora, todos em centavos inteiros positivos quando informados, além do dia inicial da semana entre 1 (segunda-feira) e 7 (domingo).

O dashboard será uma projeção operacional explicável dos registros de `DailyClosing`. Ele não substituirá contas, lançamentos financeiros, receitas individuais ou relatórios canônicos futuros.

Para o período semanal configurado:

- resultado líquido é a soma dos resultados líquidos dos fechamentos;
- dias trabalhados e quantidade de fechamentos correspondem à quantidade de fechamentos no período;
- média diária é o resultado líquido dividido pelos dias trabalhados e fica indisponível quando não houver fechamento;
- líquido por hora é o resultado líquido multiplicado por 3.600 e dividido pelos segundos trabalhados, ficando indisponível com duração zero;
- progresso da meta é `resultado líquido / meta × 100`;
- valor restante é `máximo(0, meta - resultado líquido)`;
- excedente é `máximo(0, resultado líquido - meta)`;
- comparação usa a semana civil imediatamente anterior e calcula a variação sobre o módulo do resultado anterior; se a base anterior for zero, retorna zero somente quando o resultado atual também for zero e, nos demais casos, fica indisponível.

Todos os cálculos permanecerão no domínio. A interface apenas apresentará valores calculados, indicará indisponibilidade e identificará a origem operacional dos indicadores.

Esta decisão não cria histórico ou estados de meta, rateio, orçamento, edição ou exclusão de fechamento, calendário, gráfico nem qualquer área financeira futura.
