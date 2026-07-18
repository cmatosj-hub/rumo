# GUIA DO DESENVOLVEDOR

Este documento define como trabalhar no projeto RUMO.

A documentação é soberana conforme a ordem de precedência da Decisão 032.

---

# 1. Antes de iniciar uma tarefa

Ler os documentos aplicáveis, incluindo no mínimo:

- `00_PRODUCT.md`;
- `01_REQUISITOS.md`;
- `02_REGRAS_NEGOCIO.md`;
- `05_DATABASE.md` quando houver persistência;
- `06_CALCULOS.md` quando houver indicadores;
- `08_ARCHITECTURE.md`;
- `10_ROADMAP.md`;
- `12_DECISOES.md`;
- ADRs relacionados.

Inspecionar também:

- estado atual do Git;
- dependências instaladas;
- testes existentes;
- limites da tarefa aprovada.

---

# 2. Processo obrigatório

1. Ler a documentação.
2. Confirmar o escopo.
3. Explicar a estratégia.
4. Informar arquivos afetados.
5. Implementar em passos pequenos.
6. Revisar segurança, tipos e fronteiras.
7. Executar os testes proporcionais.
8. Executar `npm run verify` quando aplicável.
9. Informar alterações, verificações e limitações.

Não avançar para a tarefa seguinte sem aprovação quando o trabalho estiver dividido em marcos.

---

# 3. Comandos da fundação

```text
npm run start
npm run native:node
npm run build
npm run typecheck
npm run format
npm run format:check
npm run lint
npm run test
npm run test:coverage
npm run test:contract
npm run test:e2e
npm run test:packaged
npm run package
npm run make
npm run verify
```

`verify` executa formatação, lint, typecheck, testes unitários, testes de contrato e build.

Testes E2E e empacotamento permanecem comandos explícitos porque iniciam processos e geram artefatos próprios.

`better-sqlite3` usa ABI 127 nos testes executados diretamente pelo Node 22 e ABI 148 no Electron 43. `native:node` restaura o primeiro; os scripts de migration e integração que precisam dele executam esse passo automaticamente. Electron Forge usa `@electron/rebuild` 4.2.0 e força o rebuild para ABI 148 antes de `start`, `package` e `make`. Assim, os comandos são seguros independentemente da ordem em que foram executados.

`test:packaged` exige um package Windows x64 já gerado. `make -- --arch=x64` gera o instalador Squirrel interno em `out/make/squirrel.windows/x64`.

Na CI sempre utilizar `npm ci`. O workflow executa qualidade em Ubuntu e empacotamento em Windows somente depois da aprovação do primeiro job.

O workflow `Foundation CI` foi executado com sucesso no GitHub Actions. Os jobs `quality` e `windows-package` validaram remotamente qualidade, testes, migrations, build de produção, rebuild nativo, pacote Windows x64, instalador Squirrel, smoke test, layout empacotado e upload dos artefatos. O job Windows permanece temporariamente em `windows-2022` até que uma versão estável do Electron Forge incorpore suporte oficial ao Visual Studio 2026 em sua cadeia de rebuild.

O instalador não é assinado e não está liberado para distribuição pública. A instalação deve ser validada manualmente em ambiente descartável devido à ausência de isolamento confiável do `LOCALAPPDATA` pelo bootstrapper Squirrel no teste automatizado atual.

A fundação técnica está validada localmente e na CI, e a primeira feature vertical ainda não foi iniciada. Permanecem pendentes a instalação manual do `Setup.exe` em uma máquina Windows limpa, a primeira abertura do aplicativo instalado, a criação e persistência do banco nesse ambiente, o fechamento e a reabertura, a desinstalação, a assinatura digital, o ícone e branding definitivos e o eventual retorno do runner para `windows-latest`.

---

# 10. Banco na inicialização

O bootstrap normal cria ou abre `app.getPath("userData")/data/rumo.db`, aplica migrations e conecta o Prisma antes de abrir a janela. O processo principal registra `APPLICATION_INITIALIZATION_SUCCEEDED` somente depois de concluir o bootstrap. Em falhas, registra etapa, nome, mensagem, cadeia de causas e stack no terminal ou log técnico, sem enviar esses detalhes ao renderer; o aplicativo empacotado mostra apenas uma mensagem controlada ao usuário.

Nunca execute `prisma db push`. O aplicativo instalado usa o runner versionado e as migrations de `resources/migrations`; Prisma CLI não é dependência de runtime.

`RUMO_E2E_USER_DATA_PATH` e `RUMO_STARTUP_SIGNAL_PATH` são reservados a testes e devem sempre apontar para caminhos temporários removidos ao final. O teste E2E aguarda o sinal explícito de sucesso; apenas encontrar um processo ou uma janela não é suficiente.

## 10.1 Fechamento diário operacional

A migration `20260718010000_daily_closings` adiciona o primeiro agregado funcional. Valores monetários são persistidos em centavos, odômetros em metros, duração trabalhada em segundos e data operacional como `YYYY-MM-DD` sem conversão UTC.

O renderer usa exclusivamente `window.rumo.dailyClosings.create` e `window.rumo.dailyClosings.list`. O preload e o processo principal validam novamente todos os payloads. A segunda criação para o mesmo proprietário e data é bloqueada; não existe atualização silenciosa.

O primeiro salvamento cria de forma preguiçosa o proprietário local técnico quando ainda não existe. Isso mantém o ownership exigido pelo modelo sem implementar login ou uma interface de usuários nesta entrega. A criação do fechamento e seu evento append-only de auditoria são atômicos e compartilham o `correlationId`. O agregado ainda não produz lançamento ou movimento financeiro: essa integração pertence às entregas canônicas de contas, receitas e despesas e deverá impedir dupla contagem dos registros existentes.

---

# 4. Regras arquiteturais

- domínio não depende de frameworks ou infraestrutura;
- aplicação orquestra casos de uso e transações;
- infraestrutura implementa portas;
- apresentação não contém regras de negócio;
- renderer não importa Electron, Node.js, main ou infraestrutura;
- preload importa apenas Electron e contratos autorizados;
- IPC utiliza um método e um canal explícitos por operação;
- telas nunca acessam banco diretamente;
- módulos não acessam internals de outros módulos.

---

# 5. Nunca fazer

- criar dependência não aprovada;
- duplicar regra de negócio;
- misturar interface com cálculos;
- expor `ipcRenderer` ao renderer;
- criar método IPC genérico;
- acessar Node.js, Prisma ou SQLite pela interface;
- alterar dado histórico silenciosamente;
- ignorar erro de TypeScript;
- reduzir configuração de segurança para fazer teste passar;
- executar `npm audit fix --force`;
- deixar código morto, TODO esquecido ou comentário sem finalidade;
- ampliar o escopo sem aprovação.

---

# 6. Sempre fazer

- utilizar tipagem forte;
- validar dados nas fronteiras;
- retornar erros compreensíveis e tipados;
- preservar `correlationId` nas operações relacionadas;
- usar nomes claros;
- escrever testes para contratos e regras;
- manter logs sanitizados;
- documentar decisões importantes;
- preservar os dados e documentos fora do escopo.

---

# 7. Portões de qualidade

Antes de concluir uma tarefa:

- formatação aprovada;
- lint sem warnings;
- typecheck aprovado;
- testes aplicáveis aprovados;
- build aprovado;
- imports e fronteiras válidos;
- ausência de código morto;
- segurança não reduzida;
- documentação revisada;
- `git diff --check` sem erros.

Empacotamento e E2E deverão ser executados quando a tarefa afetar Electron, preload, IPC, build ou distribuição.

---

# 8. Atualização da documentação

Verificar documentação sempre que a tarefa:

- criar ou alterar funcionalidade;
- alterar regra, cálculo ou fluxo;
- modificar arquitetura;
- modificar banco ou migration;
- adicionar dependência relevante;
- alterar segurança, IPC, build ou empacotamento.

Decisões técnicas duradouras deverão ser registradas em ADR.

---

# 9. Regra final

Quando uma dúvida puder alterar regra, dado, arquitetura ou escopo:

1. não assumir;
2. registrar a dúvida;
3. apresentar alternativas;
4. aguardar aprovação antes de implementar a escolha.
