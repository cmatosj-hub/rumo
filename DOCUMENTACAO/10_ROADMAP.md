# ROADMAP DO PROJETO RUMO

## Objetivo

Este documento organiza a evolução do RUMO conforme as decisões vigentes registradas em `12_DECISOES.md`.

O roadmap define ordem de lançamento, dependências, entregas e critérios de saída.

O roadmap não substitui decisões, regras de negócio, requisitos, cálculos aprovados ou critérios de aceite.

---

# FASE 0 — SPRINT DE ESPECIFICAÇÃO

## Objetivo

Fechar as definições necessárias antes da criação do código.

## Entregas mínimas

- decisões críticas registradas;
- escopo do MVP fechado;
- regras de negócio corrigidas;
- cálculos iniciais especificados;
- requisitos numerados e com critérios de aceite;
- modelo inicial de dados;
- fluxos principais especificados;
- arquitetura atualizada;
- contratos internos iniciais;
- glossário atualizado;
- requisitos não funcionais mínimos definidos;
- matriz de rastreabilidade entre requisitos, regras, cálculos, entidades e testes.

## Decisões obrigatórias para conclusão da Fase 0

A Fase 0 somente poderá ser encerrada após existirem decisões aprovadas sobre:

- regime financeiro;
- diferença entre lançamento financeiro e movimento de conta;
- estados e transições;
- conta financeira padrão;
- contrapartida da retirada pessoal;
- receita individual e fechamento diário;
- cálculo de consumo;
- jornadas atravessando a meia-noite;
- jornadas sobrepostas;
- auditoria;
- cancelamento lógico;
- backup e restauração;
- segurança local;
- escopo por usuário;
- requisitos não funcionais mínimos.

As decisões deverão ser registradas em `12_DECISOES.md` antes da implementação afetada.

## Terminologia financeira obrigatória

A Fase 0 deverá padronizar oficialmente:

- receita operacional;
- despesa variável;
- despesa fixa;
- resultado operacional;
- lucro bruto;
- lucro líquido;
- fluxo de caixa.

Cada termo deverá estar vinculado a:

- definição;
- fórmula;
- dados de entrada;
- período;
- filtros;
- regra de arredondamento;
- tratamento de cancelamentos;
- tratamento de transferências;
- tratamento de retiradas;
- comportamento diante de dados ausentes;
- exemplos numéricos;
- critérios de aceite.

Até essa aprovação, o roadmap deverá utilizar preferencialmente o termo `resultado operacional`, evitando empregar `lucro líquido` de forma genérica.

## Modelo financeiro mínimo a ser aprovado

A especificação da Fase 0 deverá formalizar que:

- lançamento financeiro representa o fato financeiro;
- movimento de conta representa o efeito desse fato no saldo de uma conta;
- um lançamento poderá gerar um ou mais movimentos;
- saldos serão derivados exclusivamente dos movimentos válidos;
- transferências deverão gerar movimentos vinculados;
- detalhes especializados deverão se vincular ao lançamento correspondente;
- abastecimentos não poderão criar um segundo custo independente;
- manutenções não poderão criar um segundo custo independente;
- impostos, multas e documentos não poderão criar um segundo custo independente;
- cancelamento do fato financeiro deverá manter consistentes os movimentos relacionados;
- relatórios financeiros deverão consultar a fonte financeira canônica.

## Fluxos que deverão estar especificados

- onboarding progressivo;
- criação e edição do perfil local;
- criação da conta financeira padrão;
- cadastro e seleção de veículo ativo;
- abertura e fechamento de jornada;
- receita individual;
- fechamento diário;
- despesa;
- transferência;
- retirada pessoal;
- ajuste de saldo;
- cancelamento lógico;
- abastecimento;
- manutenção;
- documento ou obrigação do veículo;
- meta opcional;
- dashboard;
- relatório;
- criação de backup;
- restauração de backup.

## Requisitos não funcionais mínimos

A Fase 0 deverá estabelecer critérios mensuráveis para:

- versões e arquiteturas do Windows suportadas;
- tempo de inicialização;
- tempo de resposta das consultas principais;
- volume de dados utilizado nos testes;
- acessibilidade mínima;
- recuperação após falha;
- compatibilidade de migrations;
- integridade de backup;
- proteção de dados locais;
- política de logs;
- comportamento integralmente offline do MVP.

## Escopo por usuário

A Fase 0 deverá decidir se as entidades do MVP possuirão `user_id` desde a primeira migration.

O roadmap não determina essa escolha.

A decisão deverá considerar:

- perfil local único no MVP;
- futura possibilidade de múltiplos usuários;
- custo de uma migration transversal posterior;
- isolamento dos dados;
- compatibilidade com cloud e sincronização.

## Itens fora do escopo da Fase 0

- criação do scaffold;
- instalação de dependências;
- criação de código de produção;
- implementação do banco definitivo;
- implementação de telas;
- implementação das funcionalidades do MVP.

## Critério de conclusão

A Fase 0 estará concluída somente quando:

- todas as decisões obrigatórias desta fase estiverem aprovadas;
- nenhuma decisão crítica necessária para a fundação ou para a primeira entrega vertical permanecer indefinida;
- requisitos do MVP possuírem identificação, prioridade, versão e critérios de aceite;
- regras e cálculos necessários ao MVP estiverem consistentes com as decisões;
- modelo inicial de dados e contratos internos estiverem documentados;
- fluxos principais possuírem caminhos de sucesso, validação, erro e cancelamento;
- requisitos não funcionais mínimos estiverem mensuráveis;
- glossário e terminologia financeira estiverem atualizados;
- documentos afetados tiverem sido atualizados antes do início da implementação.

---

# FASE 1 — FUNDAÇÃO TÉCNICA

## Objetivo

Criar uma fundação desktop local-first para Windows, segura, modular, testável e compatível com o desenvolvimento incremental do MVP.

## Plataforma aprovada

- Electron;
- React;
- TypeScript;
- Vite;
- Node.js;
- Prisma;
- SQLite.

## Organização arquitetural

- monólito modular organizado por funcionalidades;
- separação entre domínio, aplicação, infraestrutura e apresentação;
- domínio sem dependência de React, Electron, Prisma ou bibliotecas de interface;
- casos de uso na camada de aplicação;
- persistência e integrações na infraestrutura;
- interface na camada de apresentação;
- módulos compartilhados limitados a responsabilidades realmente comuns;
- acesso entre módulos através de contratos definidos;
- nenhuma regra financeira implementada na interface;
- nenhum acesso direto da interface ao banco.

## Processos do Electron

- processo principal;
- preload;
- renderer;
- comunicação IPC controlada;
- inicialização e encerramento seguro do aplicativo;
- encerramento seguro das conexões com o banco;
- tratamento de segunda instância conforme requisito aprovado na Fase 0.

## Segurança obrigatória do Electron

- `nodeIntegration` desativado;
- `contextIsolation` ativado;
- sandbox do renderer;
- Content Security Policy;
- allowlist de canais IPC;
- API mínima exposta pelo preload;
- validação dos dados de entrada;
- validação das respostas retornadas ao renderer;
- proibição de canais IPC dinâmicos não autorizados;
- proibição de acesso direto do renderer ao Node.js;
- proibição de acesso direto do renderer ao Prisma;
- proibição de acesso direto do renderer ao SQLite;
- proibição de exposição genérica do sistema de arquivos ao renderer;
- logs sem dados sensíveis conforme política aprovada na Fase 0.

## Persistência

- configuração inicial do Prisma;
- configuração do SQLite;
- primeira migration;
- seed inicial definido pela especificação da Fase 0;
- foreign keys habilitadas;
- transações;
- infraestrutura de auditoria;
- infraestrutura de cancelamento lógico;
- localização segura do banco;
- controle de acesso ao arquivo local;
- compatibilidade com migrations futuras;
- migration controlada na inicialização;
- validação da versão do schema;
- comportamento seguro quando uma migration falhar;
- preservação do banco anterior quando uma migration não puder ser concluída;
- relatório compreensível do erro de migration.

## Aplicativo Windows utilizável

- empacotamento para Windows;
- instalador;
- definição da localização segura dos dados da aplicação;
- inclusão correta do Prisma Client;
- inclusão dos binários necessários ao funcionamento do Prisma;
- inclusão das migrations;
- build reproduzível;
- execução em instalação limpa do Windows suportado;
- abertura sem dependência de servidor externo;
- funcionamento offline.

A ferramenta específica de empacotamento somente será escolhida após avaliação e registro técnico.

## Qualidade e automação

- TypeScript estrito;
- lint;
- formatter;
- testes unitários;
- testes de integração;
- infraestrutura de testes de interface;
- infraestrutura para testes E2E;
- typecheck;
- build;
- pipeline de integração contínua;
- tratamento centralizado de erros;
- códigos de erro;
- resultados tipados;
- logs;
- correlação de operações.

A tecnologia específica de integração contínua somente será escolhida após avaliação e registro técnico.

## Utilidades fundamentais

- representação de dinheiro em centavos;
- formatação monetária;
- moeda fixa em Real brasileiro no MVP;
- armazenamento de timestamps técnicos em UTC;
- preservação da data operacional ou timezone efetivo do registro;
- conversão controlada para apresentação;
- geração de IDs;
- relógio injetável para testes;
- abstração de transações;
- validação de schemas;
- paginação;
- filtros;
- ordenação;
- tratamento padronizado de ausência de dados.

## Política monetária do MVP

O MVP será monomoeda em Real brasileiro.

A arquitetura poderá prever uma futura preferência de moeda, mas:

- o usuário não poderá trocar apenas o símbolo e reinterpretar valores históricos;
- valores existentes não poderão ser convertidos implicitamente;
- contas e lançamentos do MVP utilizarão Real brasileiro;
- conversão cambial fica fora do MVP;
- operação financeira em múltiplas moedas fica fora do MVP.

## Política temporal

O sistema deverá preservar a data operacional ou o timezone efetivo utilizado no registro.

Mudanças futuras na preferência de timezone não poderão reagrupar silenciosamente:

- jornadas;
- receitas;
- despesas;
- movimentos;
- metas;
- relatórios históricos.

A estratégia exata deverá seguir a decisão aprovada na Fase 0.

## Dependências

- Fase 0 concluída;
- arquitetura aprovada;
- modelo inicial de dados aprovado;
- contratos internos iniciais aprovados;
- políticas monetária e temporal aprovadas;
- requisitos não funcionais mínimos definidos;
- decisões de segurança local aprovadas.

## Itens fora do escopo

- funcionalidades completas do usuário final;
- patrimônio completo;
- investimentos;
- inteligência estatística;
- sincronização;
- aplicativo mobile;
- integrações bancárias;
- conversão cambial;
- abstrações de cloud sem uso no MVP.

## Critério de conclusão

A Fase 1 estará concluída somente quando:

- o aplicativo puder ser instalado e aberto em uma versão suportada do Windows;
- o renderer se comunicar com o processo principal através de IPC autorizado e validado;
- o renderer não possuir acesso direto ao Node.js, Prisma ou SQLite;
- o banco estiver localizado em diretório seguro definido pela aplicação;
- a primeira migration puder ser executada de forma reproduzível;
- uma falha simulada de migration preservar o banco anterior;
- Prisma Client e binários necessários estiverem presentes no aplicativo empacotado;
- lint, typecheck, testes e build forem executados com sucesso;
- o pipeline de integração contínua executar as verificações aprovadas;
- a estrutura modular permitir iniciar a primeira entrega vertical sem reorganização fundamental;
- os critérios mínimos de segurança do Electron estiverem verificados;
- a documentação da fundação estiver revisada.

## Estado de validação em 17/07/2026

Validado localmente:

- shell Electron seguro, offline e com instância única;
- IPC fundacional tipado e renderer sem Node.js, Prisma ou SQLite;
- Prisma, SQLite, foreign keys, transações e encerramento controlado;
- migration fundacional reproduzível, auditoria append-only, checksum, backup, rollback e recuperação;
- ativação controlada de banco e migrations antes da abertura da janela;
- package Windows x64 com Prisma Client, query compiler, módulo nativo desempacotado e migrations;
- geração do instalador interno Squirrel.Windows;
- lint, formatação, typecheck, testes, build, package, make e smoke test empacotado;
- documentação e ADRs da fundação.

Estruturalmente pronto, aguardando validação externa:

- primeira execução dos jobs `quality` e `windows-package` no GitHub Actions;
- ciclo manual de instalar, abrir e desinstalar em ambiente Windows descartável.

Não concluído e fora da liberação interna atual:

- assinatura digital;
- identidade visual aprovada;
- distribuição pública;
- publicação de release;
- atualização automática.

Nenhum módulo funcional do MVP foi iniciado. A Fase 1 está tecnicamente pronta para revisão final, mas a CI não deve ser declarada verde e o instalador não deve ser declarado validado em máquina limpa até as duas verificações externas acima.

---

# MVP 1.0 — NÚCLEO OPERACIONAL

## Objetivo

Entregar o núcleo operacional, financeiro e gerencial necessário para o motorista registrar sua rotina, acompanhar o resultado operacional e preservar seus dados localmente.

Todas as funcionalidades do MVP deverão funcionar integralmente offline.

## Regras para entregas verticais

- as entregas serão implementadas uma por vez;
- cada entrega deverá terminar funcional, testada e documentada;
- cada entrega somente dependerá dos módulos realmente necessários;
- a ordem apresentada é recomendada;
- dependências artificiais não deverão ser criadas;
- uma entrega poderá ser antecipada somente quando suas dependências reais estiverem concluídas;
- nenhuma entrega grande deverá ser implementada integralmente em uma única tarefa do Codex;
- entregas grandes deverão ser divididas nos marcos internos definidos neste roadmap;
- alteração do escopo aprovado exige nova decisão em `12_DECISOES.md`;
- funcionalidades futuras não poderão bloquear o uso das entregas concluídas.

## Critérios mínimos para toda entrega com interface

Toda interface deverá possuir:

- estado vazio;
- estado de carregamento;
- estado de erro;
- estado de sucesso quando houver confirmação de operação;
- confirmação antes de ações críticas;
- prevenção de ações destrutivas acidentais;
- mensagens compreensíveis para usuário leigo;
- navegação por teclado nas ações essenciais;
- foco visível;
- rótulos associados aos campos;
- ordem de navegação coerente;
- semântica adequada nos controles essenciais;
- tratamento de indisponibilidade de dados;
- testes dos estados principais da interface.

---

## 1. Perfil e preferências

### Objetivo

Permitir a configuração local mínima do usuário sem exigir funcionalidades pertencentes a versões futuras.

### Funcionalidades

- perfil local;
- nome e informações básicas definidas nos requisitos;
- onboarding progressivo;
- moeda do MVP fixada em Real brasileiro;
- timezone;
- tema;
- preferências básicas;
- edição das preferências;
- persistência local.

### Dependências

- Fase 1 concluída;
- modelo de perfil aprovado;
- política temporal aprovada;
- decisão sobre escopo por usuário aprovada.

### Itens fora do escopo

- autenticação remota;
- múltiplos usuários simultâneos, salvo decisão posterior;
- sincronização de perfil;
- conversão cambial;
- operação financeira em múltiplas moedas;
- investimentos;
- reserva de emergência obrigatória;
- contas adicionais obrigatórias no onboarding.

Metas obrigatórias não são apenas um item fora do escopo: são incompatíveis com as Decisões 009 e 027.

### Critério de conclusão

- o usuário consegue criar e editar o perfil local;
- timezone e tema são persistidos;
- o sistema utiliza Real brasileiro sem permitir reinterpretação de valores históricos;
- metas, investimentos, reserva e contas adicionais não bloqueiam o primeiro acesso;
- mudanças de timezone não alteram silenciosamente a data operacional já preservada;
- os critérios mínimos de interface são atendidos;
- testes e documentação da entrega estão concluídos.

---

## 2. Veículos

### Objetivo

Permitir o controle de múltiplos veículos e identificar qual veículo está ativo na operação.

### Funcionalidades

- cadastro;
- edição controlada;
- ativação;
- inativação;
- consulta;
- múltiplos veículos;
- apenas um veículo ativo por vez;
- histórico;
- leitura inicial de odômetro;
- histórico de odômetro;
- ajustes auditados de odômetro;
- cancelamento lógico definido pela regra aprovada.

### Dependências

- perfil local;
- auditoria;
- política de cancelamento;
- regras de veículo ativo;
- regras de odômetro;
- política temporal.

### Itens fora do escopo

- integração automática com FIPE;
- avaliação patrimonial completa;
- financiamento;
- depreciação;
- rastreamento GPS;
- sincronização entre dispositivos.

### Critério de conclusão

- múltiplos veículos podem ser cadastrados;
- somente um veículo permanece ativo;
- a troca de veículo ativo é consistente;
- odômetro atual pode ser derivado do histórico válido;
- ajustes preservam a auditoria;
- veículos inativados permanecem no histórico;
- os critérios mínimos de interface são atendidos;
- testes e documentação da entrega estão concluídos.

---

## 3. Contas e movimentos financeiros

### Objetivo

Criar a base financeira canônica e permitir a reconstrução dos saldos.

### Marco 3.1 — Contas e movimentos

- conta financeira padrão;
- contas adicionais;
- lançamento financeiro;
- movimento de conta;
- entradas;
- saídas;
- extrato;
- saldos derivados exclusivamente de movimentos válidos;
- filtros;
- histórico.

### Marco 3.2 — Transferências

- transferência entre contas;
- movimento de saída;
- movimento de entrada;
- vínculo entre movimentos;
- operação atômica;
- taxa registrada separadamente;
- cancelamento ou reversão consistente.

### Marco 3.3 — Retiradas

- retirada pessoal;
- contrapartida identificável;
- destino externo ou conta pessoal conforme decisão aprovada;
- exclusão da receita operacional;
- exclusão da despesa operacional;
- exclusão do resultado operacional;
- apresentação separada no fluxo financeiro.

### Marco 3.4 — Ajustes e cancelamentos

- ajuste de saldo;
- motivo obrigatório;
- movimento auditado;
- edição controlada;
- cancelamento lógico;
- preservação do histórico;
- reconstrução de saldo após ajuste ou cancelamento.

### Dependências

- perfil local;
- utilidades monetárias;
- política temporal;
- modelo financeiro aprovado na Fase 0;
- estados e transições aprovados;
- conta padrão definida;
- contrapartida da retirada definida;
- auditoria;
- transações.

### Itens fora do escopo

- integração bancária;
- importação automática de extratos;
- conciliação automática;
- contas de investimento completas;
- múltiplas moedas;
- patrimônio líquido completo;
- sincronização.

### Critério de conclusão

- lançamento e movimento possuem responsabilidades distintas;
- saldos podem ser reconstruídos exclusivamente a partir dos movimentos válidos;
- transferências são atômicas;
- transferências internas não alteram resultado operacional;
- retiradas possuem contrapartida identificável;
- retiradas não integram receita, despesa ou resultado operacional;
- ajustes são auditados;
- nenhum registro financeiro é fisicamente excluído;
- testes de integração ou E2E cobrem transferências, retiradas, ajustes, cancelamentos e reconstrução de saldos;
- os critérios mínimos de interface são atendidos;
- documentação da entrega está concluída.

---

## 4. Jornadas

### Objetivo

Registrar período de trabalho, veículo, horas e quilometragem operacional.

### Funcionalidades

- abertura;
- fechamento;
- vínculo obrigatório com veículo;
- KM inicial;
- KM final;
- horário inicial;
- horário final;
- pausas;
- duração;
- horas trabalhadas;
- quilômetros operacionais;
- jornada atravessando meia-noite;
- prevenção ou tratamento de sobreposição;
- jornada aberta;
- histórico;
- edição controlada;
- cancelamento lógico;
- auditoria;
- preservação da data operacional.

### Dependências

- veículos;
- histórico de odômetro;
- política temporal;
- decisão sobre jornada atravessando meia-noite;
- decisão sobre jornadas sobrepostas;
- estados e transições;
- auditoria.

### Itens fora do escopo

- GPS;
- registro automático de trajeto;
- integração com aplicativos de corrida;
- otimização de rota;
- previsão de demanda.

### Critério de conclusão

- uma jornada pode ser aberta e fechada;
- cada jornada possui veículo;
- KM e horários são validados;
- pausas produzem duração reproduzível;
- jornadas atravessando meia-noite seguem a decisão aprovada;
- sobreposições seguem a decisão aprovada;
- mudança de timezone não reagrupa silenciosamente a jornada;
- testes cobrem abertura, fechamento, sobreposição, cancelamento e meia-noite;
- os critérios mínimos de interface são atendidos;
- documentação da entrega está concluída.

---

## 5. Receitas e despesas

### Objetivo

Registrar fatos financeiros operacionais sem duplicidade.

### Funcionalidades

- lançamentos financeiros canônicos;
- receitas;
- despesas;
- categorias padrão;
- categorias personalizadas conforme requisito aprovado na Fase 0;
- classificação fixa;
- classificação variável;
- escopo da despesa;
- vínculo opcional com veículo;
- vínculo opcional com jornada;
- vínculo obrigatório com veículo somente quando a regra específica exigir;
- vínculo obrigatório com jornada somente quando a regra específica exigir;
- receita individual;
- fechamento diário;
- prevenção de sobreposição;
- origem da receita;
- data operacional;
- observações;
- filtros;
- consulta;
- edição controlada;
- cancelamento lógico;
- auditoria.

### Dependências

- contas e movimentos;
- categorias aprovadas;
- regime financeiro aprovado;
- regra de receita individual e fechamento diário aprovada;
- estados e transições;
- política temporal;
- auditoria.

Jornadas não são dependência obrigatória desta entrega.

### Itens fora do escopo

- integração automática com plataformas;
- importação automática;
- inteligência estatística;
- recomendações;
- patrimônio completo;
- tratamento tributário avançado;
- detalhamento especializado de corridas sem decisão específica.

### Critério de conclusão

- receitas e despesas geram os movimentos previstos pelo modelo aprovado;
- nenhum fato é contado duas vezes;
- fechamento diário não se sobrepõe silenciosamente a receitas individuais;
- vínculo com jornada é opcional, salvo regra específica;
- vínculo com veículo respeita o escopo da despesa;
- cancelamentos preservam histórico;
- testes de integração ou E2E cobrem receita individual, fechamento diário, sobreposição e cancelamento;
- os critérios mínimos de interface são atendidos;
- documentação da entrega está concluída.

---

## 6. Abastecimentos

### Objetivo

Registrar abastecimentos e seus dados operacionais sem duplicar o efeito financeiro.

### Funcionalidades

- litros;
- preço por litro;
- valor total;
- data operacional;
- veículo;
- odômetro;
- tanque cheio;
- posto opcional;
- observações;
- vínculo com lançamento financeiro;
- histórico;
- edição controlada;
- cancelamento lógico;
- consumo conforme regra aprovada;
- indicador indisponível quando faltarem dados.

### Dependências

- núcleo financeiro canônico;
- contas e movimentos;
- veículo;
- histórico de odômetro;
- regra de consumo aprovada na Fase 0;
- política de arredondamento;
- política temporal;
- auditoria;
- transações.

O módulo geral de receitas e despesas não é dependência obrigatória.

### Itens fora do escopo

- integração com postos;
- captura automática de nota fiscal;
- preços online;
- conversão cambial;
- recomendações estatísticas;
- indicadores de consumo ainda destinados ao backlog de versão posterior.

### Critério de conclusão

- abastecimento referencia um lançamento financeiro;
- nenhuma entidade de abastecimento gera um segundo valor independente;
- odômetro é validado;
- cálculo de consumo segue a fórmula aprovada;
- ausência de dados produz indicador indisponível;
- edição ou cancelamento mantém consistentes abastecimento, lançamento e movimentos;
- os critérios mínimos de interface são atendidos;
- testes e documentação da entrega estão concluídos.

---

## 7. Manutenções e documentos

### Objetivo

Controlar manutenção e obrigações do veículo com alertas determinísticos e efeito financeiro canônico.

### Marco 7.1 — Planos de manutenção

- componente;
- tipo de manutenção;
- intervalo por KM;
- intervalo por tempo;
- intervalo por ambos;
- tolerância definida pelos requisitos;
- ativação;
- inativação;
- próxima ocorrência.

### Marco 7.2 — Eventos de manutenção

- execução;
- data operacional;
- odômetro;
- fornecedor;
- observações;
- vínculo financeiro;
- histórico;
- edição controlada;
- cancelamento.

### Marco 7.3 — Documentos e obrigações

- seguro;
- IPVA;
- licenciamento;
- multas;
- validade;
- vencimento;
- vínculo com veículo;
- vínculo financeiro quando houver efeito em conta;
- histórico.

### Marco 7.4 — Alertas determinísticos

- alerta por KM;
- alerta por tempo;
- alerta por ambos;
- regra identificável;
- dados que originaram o alerta;
- severidade definida nos requisitos;
- leitura;
- resolução;
- dispensa quando permitida pela regra.

### Dependências

- veículos;
- histórico de odômetro;
- núcleo financeiro canônico;
- contas e movimentos;
- política temporal;
- regras determinísticas aprovadas;
- critérios de vencimento aprovados;
- auditoria.

### Itens fora do escopo

- manutenção preditiva;
- detecção estatística;
- consulta automática a órgãos;
- pagamento automático;
- integração com oficinas;
- integração com seguradoras;
- avaliação patrimonial.

### Critério de conclusão

Cada marco deverá possuir critério e testes próprios.

A entrega completa estará concluída quando:

- planos gerarem próximas ocorrências reproduzíveis;
- eventos com custo referenciarem um único lançamento;
- documentos e obrigações estiverem vinculados ao veículo;
- alertas informarem regra e dados de origem;
- todas as funções operarem offline;
- os critérios mínimos de interface forem atendidos;
- documentação da entrega estiver concluída.

---

## 8. Metas simples

### Objetivo

Permitir acompanhamento opcional de metas sem bloquear fluxos principais.

### Funcionalidades

- criação opcional;
- ativação;
- inativação;
- metas diárias;
- metas semanais;
- metas mensais;
- progresso;
- percentual concluído;
- valor restante;
- apresentação opcional no dashboard;
- histórico;
- edição;
- cancelamento conforme estado aprovado.

### Dependências

- dados financeiros ou operacionais exigidos pelo tipo de meta;
- fórmulas de metas aprovadas;
- política temporal;
- estados e transições.

Uma meta financeira não deverá depender de jornadas.

Uma meta operacional somente dependerá do dado operacional utilizado em sua fórmula.

### Itens incompatíveis com as decisões vigentes

- metas obrigatórias;
- bloqueio de fluxo por ausência de meta;
- onboarding condicionado à criação de meta.

### Itens fora do escopo

- meta patrimonial;
- projeção estatística;
- meta baseada em investimentos;
- recomendação automática;
- tipos destinados ao backlog de versão posterior.

### Critério de conclusão

- todos os demais módulos funcionam sem metas;
- metas ativas apresentam progresso conforme fórmula aprovada;
- metas inexistentes não produzem erro;
- período e timezone seguem a política aprovada;
- os critérios mínimos de interface são atendidos;
- testes e documentação da entrega estão concluídos.

---

## 9. Dashboard e relatórios básicos

### Objetivo

Apresentar indicadores e relatórios reproduzíveis a partir dos módulos disponíveis.

### Marco 9.1 — Serviço central de indicadores

- receita operacional;
- despesas;
- resultado operacional;
- horas;
- quilômetros;
- receita por KM;
- custo por KM;
- resultado por hora;
- tratamento de divisão por zero;
- tratamento de dados ausentes;
- fórmulas centralizadas;
- fórmulas testadas;
- identificação dos dados de origem.

### Marco 9.2 — Dashboard

- indicadores disponíveis;
- filtros por período;
- filtros por veículo;
- visão consolidada definida nos requisitos;
- explicação dos indicadores;
- alertas determinísticos disponíveis;
- metas existentes;
- estado parcial;
- estado indisponível.

O dashboard deverá funcionar com os módulos disponíveis.

Metas, abastecimentos e manutenções não são dependências obrigatórias do dashboard básico.

Indicadores dependentes de dados inexistentes deverão:

- aparecer como indisponíveis com motivo; ou
- não ser exibidos, conforme critério de interface aprovado.

### Marco 9.3 — Relatórios por período

- diário;
- semanal;
- mensal;
- anual;
- filtros;
- dados operacionais;
- dados financeiros do MVP;
- explicação dos totais.

Relatórios básicos serão consultas recalculadas sobre os dados válidos.

Snapshots não fazem parte dos relatórios básicos, salvo futura decisão registrada.

### Marco 9.4 — Comparativos

- comparação entre períodos equivalentes;
- comparação simples entre meses;
- comparação por veículo;
- indicação de dados incompletos;
- ausência de interpretação estatística no MVP.

### Dependências

Obrigatórias:

- serviço central de cálculos;
- política temporal;
- terminologia financeira aprovada;
- ao menos uma fonte financeira ou operacional concluída.

Condicionais:

- indicadores de jornada dependem de jornadas;
- indicadores de consumo dependem de abastecimentos;
- indicadores de manutenção dependem de manutenções;
- indicadores de metas dependem de metas cadastradas;
- alertas dependem do módulo que os produz.

### Itens fora do escopo

- patrimônio líquido;
- rentabilidade;
- previsões;
- recomendações;
- inteligência estatística;
- simulações;
- relatórios avançados.

### Critério de conclusão

Cada marco deverá possuir testes próprios.

A entrega completa estará concluída quando:

- números puderem ser reproduzidos;
- fórmulas aprovadas forem utilizadas;
- numerador e denominador usarem o mesmo período e escopo;
- transferências e retiradas não distorcerem o resultado operacional;
- relatórios forem recalculados sobre dados válidos;
- indicadores sem dados forem omitidos ou marcados como indisponíveis conforme critério aprovado;
- os critérios mínimos de interface forem atendidos;
- documentação da entrega estiver concluída.

---

## 10. Backup local básico

### Objetivo

Permitir criação manual e restauração integral segura dos dados locais.

## Definição de backup básico

Backup básico será:

- manual;
- local;
- versionado;
- integral;
- validado;
- acompanhado de restauração integral segura.

### Marco 10.1 — Criação segura

- criação manual;
- destino escolhido pelo usuário através de fronteira segura;
- formato versionado;
- versão do schema;
- validação de integridade;
- proteção contra sobrescrita acidental;
- relatório de sucesso ou erro;
- acesso ao sistema de arquivos apenas pelo processo autorizado.

### Marco 10.2 — Restauração segura

- seleção controlada do arquivo;
- validação antes da substituição;
- uso de arquivo ou banco temporário;
- verificação da versão;
- verificação de integridade;
- backup preventivo do banco atual;
- fechamento seguro das conexões;
- substituição atômica;
- rollback em caso de falha;
- preservação do banco ativo quando a validação falhar;
- relatório claro do resultado;
- reinicialização controlada quando exigida pela regra aprovada.

### Dependências

- schema do MVP estabilizado;
- migrations;
- política de backup e restauração aprovada;
- acesso seguro ao sistema de arquivos;
- IPC autorizado;
- tratamento de erros;
- política de compatibilidade;
- validação de integridade.

### Itens fora do escopo

- backup em nuvem;
- sincronização;
- automação;
- retenção de múltiplas versões;
- políticas avançadas de recuperação;
- recuperação seletiva;
- portabilidade entre plataformas não suportadas.

### Critério de conclusão

- backup manual válido pode ser criado;
- backup inválido não substitui o banco;
- restauração utiliza banco temporário;
- banco atual recebe backup preventivo;
- troca do banco é atômica;
- falha simulada executa rollback;
- dados restaurados reproduzem o estado suportado;
- testes de integração ou E2E cobrem backup e restauração;
- os critérios mínimos de interface são atendidos;
- documentação de recuperação está concluída.

---

# TESTES OBRIGATÓRIOS DO MVP

Além dos testes específicos de cada entrega, deverão existir testes de integração ou E2E para:

- transferências;
- retiradas;
- cancelamentos;
- fechamento diário;
- prevenção de sobreposição de receita;
- cálculo de saldos;
- reconstrução de saldos;
- migrations;
- falha de migration;
- criação de backup;
- restauração;
- falha durante restauração;
- rollback de restauração;
- alteração de timezone sem reagrupamento histórico silencioso.

Os cenários, dados de entrada e resultados esperados deverão estar ligados aos requisitos e critérios de aceite correspondentes.

---

# CRITÉRIO DE CONCLUSÃO DO MVP 1.0

O MVP estará concluído somente quando:

- as dez entregas verticais estiverem funcionais;
- os marcos internos obrigatórios estiverem concluídos;
- todas as funções do MVP operarem offline;
- dados financeiros não puderem ser fisicamente excluídos;
- saldos puderem ser reconstruídos;
- transferências forem atômicas;
- retiradas possuírem contrapartida identificável;
- não existir dupla contagem;
- jornadas preservarem data operacional;
- dashboard funcionar sem depender de módulos opcionais;
- relatórios básicos forem recalculáveis;
- backup e restauração segura estiverem validados;
- testes obrigatórios estiverem aprovados;
- lint, typecheck, testes e build estiverem aprovados;
- migrations forem testadas nos cenários definidos;
- requisitos de UX mínima estiverem atendidos;
- documentação estiver revisada.

---

# VERSÃO 1.5 — PATRIMÔNIO E PORTABILIDADE

## Objetivo

Expandir o núcleo operacional para gestão patrimonial completa e portabilidade controlada.

## Entregas

- ativos;
- passivos;
- patrimônio líquido;
- avaliações históricas de veículos;
- financiamentos;
- principal;
- juros;
- encargos;
- saldo devedor;
- reserva de emergência;
- investimentos;
- posições;
- aportes;
- resgates;
- rendimentos;
- taxas;
- movimentações de investimento;
- rentabilidade conforme método definido em decisão específica;
- exportação;
- importação;
- relatórios avançados;
- backup avançado.

## Regra de não duplicidade

Não poderá existir dupla contagem entre:

- contas;
- veículos;
- outros ativos;
- passivos;
- reserva de emergência;
- investimentos.

Veículos tratados como ativos deverão utilizar avaliação com data-base e origem.

Financiamento deverá ser representado como passivo separado do veículo.

Amortização de principal deverá reduzir o passivo conforme regra aprovada.

Reserva de emergência deverá ser classificação ou finalidade de recurso existente, conforme decisão aprovada, e não um valor duplicado.

## Relatórios avançados

Relatórios avançados compreenderão:

- patrimônio;
- ativos;
- passivos;
- investimentos;
- financiamentos;
- rentabilidade;
- análises patrimoniais detalhadas;
- exportações específicas;
- cruzamentos entre dados operacionais, financeiros e patrimoniais.

## Backup avançado

Backup avançado compreenderá:

- automação;
- retenção;
- múltiplas versões;
- políticas adicionais de recuperação;
- compatibilidade ampliada;
- recursos de portabilidade definidos nos requisitos da versão.

Backup em nuvem não será incluído sem decisão específica.

## Dependências

- MVP 1.0 concluído como lançamento;
- modelo de ativos e passivos aprovado;
- política de financiamento aprovada;
- reserva de emergência modelada;
- método de rentabilidade aprovado;
- formatos de exportação e importação aprovados;
- política de backup avançado aprovada.

## Critério de conclusão

- patrimônio pode ser reproduzido como ativos menos passivos;
- não existe dupla contagem patrimonial;
- financiamentos diferenciam principal, juros e encargos;
- reserva não duplica contas ou investimentos;
- importações inválidas não alteram dados ativos;
- exportações possuem formato documentado;
- relatórios avançados possuem critérios de aceite;
- backup avançado atende às políticas aprovadas.

---

# VERSÃO 2.0 — INTELIGÊNCIA FINANCEIRA

## Objetivo

Adicionar análises estatísticas, previsões e recomendações explicáveis sem misturar dados realizados com projeções.

## Entregas

- análises estatísticas;
- baselines;
- alertas de comportamento incomum;
- aumento de gastos;
- redução de resultado;
- aumento de consumo;
- queda de faturamento;
- previsão de fluxo de caixa;
- intervalos de incerteza;
- simulações;
- cenários;
- recomendações explicáveis;
- dados utilizados;
- premissas;
- critérios de confiança;
- limitações;
- dispensa de alertas;
- desativação de recomendações;
- separação entre realizados, projeções e simulações.

## Dependências de lançamento

- versão 1.5 concluída;
- histórico mínimo definido;
- fórmulas versionadas;
- critérios estatísticos aprovados;
- política de confiança aprovada;
- política de explicabilidade aprovada.

A ordem de lançamento não significa que análises operacionais dependam tecnicamente de investimentos.

## Regras

- alertas estatísticos não alteram dados;
- previsões não são valores realizados;
- simulações não integram saldos reais;
- recomendações informam premissas e limitações;
- histórico insuficiente produz resultado indisponível;
- alertas dispensados permanecem identificáveis conforme requisito aprovado.

## Critério de conclusão

- análises podem ser reproduzidas;
- previsões permanecem separadas dos dados realizados;
- recomendações possuem explicação;
- critérios de confiança são exibidos;
- o usuário pode dispensar alertas;
- recomendações podem ser desativadas;
- módulos anteriores funcionam sem inteligência estatística.

---

# VERSÃO 3.0 — CLOUD E MOBILE

## Objetivo

Permitir operação sincronizada, acesso remoto e integrações externas sem comprometer consistência, segurança ou funcionamento offline.

## Entregas

- autenticação remota;
- autorização;
- sessões;
- API versionada;
- sincronização;
- protocolo de sincronização;
- versões de registros;
- resolução de conflitos;
- tombstones;
- exclusões lógicas sincronizadas;
- operação offline com sincronização posterior;
- aplicativo mobile;
- integrações bancárias;
- importação automática de extratos;
- conciliação;
- criptografia em trânsito;
- proteção de credenciais;
- observabilidade;
- logs operacionais;
- métricas;
- recuperação de falhas;
- inteligência artificial.

## Dependências de lançamento

- versão 2.0 concluída;
- identidade remota aprovada;
- autorização definida;
- protocolo de sincronização aprovado;
- resolução de conflitos aprovada;
- segurança e privacidade aprovadas;
- API e versionamento definidos;
- requisitos de observabilidade definidos.

A ordem de lançamento não significa que cloud ou mobile dependam tecnicamente da inteligência financeira.

## Regras

- sincronização não será representada apenas por um campo de status;
- conflitos seguirão regras explícitas;
- tombstones preservarão exclusões lógicas;
- integrações bancárias utilizarão idempotência;
- importação automática evitará duplicidade;
- clientes respeitarão as mesmas regras de negócio;
- inteligência artificial não alterará dados financeiros sem ação explícita e validada;
- funções offline continuarão disponíveis sem conexão.

## Critério de conclusão

- operação offline pode ser sincronizada posteriormente;
- conflitos são identificados e resolvidos;
- exclusões lógicas são preservadas;
- API e clientes usam contratos versionados;
- autenticação e autorização atendem aos requisitos;
- observabilidade e recuperação estão operacionais;
- integrações evitam duplicidade.

---

# RASTREABILIDADE DE REQUISITOS AINDA SEM DESTINO NO MVP

Os itens abaixo não serão implementados automaticamente no MVP sem decisão ou critério de aceite específico.

| Item | Registro disponível no MVP | Versão proposta para funcionalidade especializada | Condição |
|---|---|---|---|
| Corridas opcionais | Não obrigatória | 1.5 | Exige decisão sobre entidade, vínculo com jornada e indicadores |
| Bônus | Pode ser registrado como receita comum | 1.5 para tratamento especializado | Exige decisão sobre categoria e vínculo com plataforma |
| Gorjetas | Pode ser registrada como receita comum | 1.5 para tratamento especializado | Exige decisão sobre categoria e relatórios |
| Promoções | Pode ser registrada como receita comum | 1.5 para tratamento especializado | Exige decisão sobre origem e prevenção de duplicidade |
| Parcelamentos | Não especializado | 1.5 | Exige decisão sobre competência, vencimento e movimentos |
| Autonomia | Não obrigatória | 1.5 | Exige capacidade do tanque e fórmula aprovada |
| Consumo urbano | Não especializado | 1.5 | Exige classificação de percurso e dados suficientes |
| Consumo rodoviário | Não especializado | 1.5 | Exige classificação de percurso e dados suficientes |
| Metas anuais | Não incluída nas metas simples | 1.5 | Exige regra de período e progresso |
| Metas patrimoniais | Não disponível | 1.5 | Depende de patrimônio completo |
| Metas de horas | Não incluída nas metas simples | 1.5 | Exige fórmula e integração com jornadas |

A atribuição proposta deverá ser validada antes da implementação da versão correspondente.

---

# ORDEM DE LANÇAMENTO E DEPENDÊNCIA TÉCNICA

A ordem oficial de lançamento e governança será:

1. MVP 1.0;
2. versão 1.5;
3. versão 2.0;
4. versão 3.0.

Essa ordem determina o planejamento de releases.

Ela não significa necessariamente que:

- cloud dependa tecnicamente de inteligência financeira;
- mobile dependa tecnicamente de recomendações;
- análises operacionais dependam tecnicamente de investimentos;
- sincronização dependa tecnicamente de patrimônio completo.

Componentes poderão ser preparados para evolução futura, mas funcionalidades de versões futuras não serão antecipadas sem alteração formal de escopo.

---

# REGRAS GERAIS DO ROADMAP

1. Nenhuma fase de implementação começa sem o critério de conclusão da fase anterior.

2. Funcionalidades podem considerar evolução futura em suas fronteiras e contratos, sem implementar complexidade prematura.

3. Cada módulo deverá ser entregue funcional, testado e documentado.

4. Alterações de escopo exigem nova decisão em `12_DECISOES.md`.

5. Nenhuma funcionalidade futura poderá bloquear o uso do MVP.

6. O roadmap não substitui decisões, regras de negócio, cálculos ou critérios de aceite.

7. Cada entrega deverá possuir testes definidos por requisitos e critérios de aceite identificáveis.

8. Nenhum dado financeiro poderá ser fisicamente excluído pela aplicação.

9. Toda alteração estrutural do banco utilizará migration.

10. Nenhuma interface acessará Prisma ou SQLite diretamente.

11. Todo fato com efeito em contas utilizará o modelo financeiro canônico aprovado.

12. Toda documentação afetada deverá ser atualizada antes da implementação e revisada novamente antes da conclusão da entrega.

13. Indicadores deverão ser explicáveis e informar indisponibilidade ou parcialidade.

14. Funcionalidades financeiras deverão preservar atomicidade, histórico e auditoria.

15. Entregas verticais serão implementadas uma por vez.

16. Nenhuma entrega grande será implementada integralmente em uma única tarefa do Codex.

17. Metas obrigatórias são incompatíveis com as decisões vigentes.

18. Termos financeiros somente serão utilizados conforme definições e fórmulas aprovadas.

19. Expressões como `quando aplicável`, `nível aprovado`, `testes proporcionais` ou `conforme necessário` somente poderão ser utilizadas quando acompanhadas da decisão, requisito ou critério que define sua aplicação.

---

# RESUMO DAS FASES

| Fase ou versão | Objetivo principal | Entregas centrais | Dependências | Critério de saída |
|---|---|---|---|---|
| Fase 0 | Fechar especificação | Decisões, regras, cálculos, requisitos, modelo, fluxos, contratos, terminologia e requisitos não funcionais | Decisões vigentes | Todas as decisões obrigatórias e especificações da fundação aprovadas |
| Fase 1 | Criar fundação desktop segura | Electron, React, TypeScript, Vite, Node.js, Prisma, SQLite, IPC seguro, empacotamento, instalador, migrations, CI e testes | Fase 0 | Aplicativo Windows instalável, seguro, testado e com banco acessado pela camada correta |
| MVP 1.0 | Entregar núcleo operacional | Perfil, veículos, finanças, jornadas, receitas, despesas, abastecimentos, manutenções, metas, dashboard, relatórios e backup | Fase 1 e dependências reais de cada vertical | Núcleo offline, auditável, sem dupla contagem e com restauração segura |
| Versão 1.5 | Entregar patrimônio e portabilidade | Ativos, passivos, patrimônio, financiamentos, reserva, investimentos, importação, exportação e backup avançado | MVP como ordem de lançamento | Patrimônio reproduzível sem duplicidade e portabilidade validada |
| Versão 2.0 | Entregar inteligência financeira | Estatísticas, anomalias, previsões, simulações e recomendações | Versão 1.5 como ordem de lançamento | Projeções separadas e recomendações explicáveis |
| Versão 3.0 | Entregar cloud e mobile | Identidade, API, sincronização, conflitos, tombstones, mobile, bancos, segurança, observabilidade e IA | Versão 2.0 como ordem de lançamento | Sincronização consistente, segura e auditável |
