# ARQUITETURA DO RUMO

## Objetivo

O RUMO utiliza um monólito modular por funcionalidades, conforme a Decisão 033.

A arquitetura deve preservar baixo acoplamento, regras testáveis e separação entre interface, aplicação, domínio e infraestrutura.

---

# 1. Plataforma

A plataforma aprovada para o MVP é:

- Electron;
- React;
- TypeScript;
- Vite;
- Node.js;
- Prisma;
- SQLite.

O aplicativo será desktop local-first e funcionará integralmente offline nas funcionalidades do MVP.

Prisma e SQLite somente serão introduzidos nas tarefas específicas de persistência.

---

# 2. Processos do Electron

## 2.1 Processo principal

Responsável por:

- ciclo de vida da aplicação;
- criação de janelas;
- políticas de segurança;
- handlers IPC;
- composição de casos de uso e infraestrutura;
- acesso futuro ao banco e ao sistema de arquivos por fronteiras autorizadas.

## 2.2 Preload

Responsável somente por expor uma API mínima e tipada através de `contextBridge`.

O preload não expõe:

- `ipcRenderer`;
- métodos genéricos `send` ou `invoke`;
- canais arbitrários;
- Node.js;
- sistema de arquivos;
- Prisma ou SQLite.

## 2.3 Renderer

Responsável pela apresentação React.

O renderer utiliza somente a API tipada exposta pelo preload e não acessa recursos privilegiados.

---

# 3. Segurança

Toda janela deverá utilizar:

- `nodeIntegration: false`;
- `contextIsolation: true`;
- `sandbox: true`;
- `webSecurity: true`;
- Content Security Policy;
- bloqueio de navegação não autorizada;
- bloqueio de novas janelas;
- permissões negadas por padrão.

Toda chamada IPC deverá possuir:

- canal em allowlist;
- método específico no preload;
- payload e resposta validados;
- validação do sender, frame principal e URL esperada;
- retorno serializável e tipado.

---

# 4. Organização por módulo

```text
src/
├── main/
├── preload/
├── renderer/
├── modules/
│   └── <module>/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
└── shared/
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── contracts/
```

Não existirão diretórios globais de `services` ou `repositories` contendo regras de diferentes módulos.

---

# 5. Regras de dependência

```text
presentation → application → domain
infrastructure → application/domain
domain → nenhuma camada externa
main → application/infrastructure
preload → contracts
renderer → presentation/contracts
```

## 5.1 Domínio

- não depende de React, Electron, Prisma, Vite ou bibliotecas de interface;
- contém regras, tipos e portas de domínio;
- não acessa infraestrutura.

## 5.2 Aplicação

- orquestra casos de uso;
- controla fronteiras transacionais;
- depende do domínio e de contratos abstratos;
- não depende da apresentação.

## 5.3 Infraestrutura

- implementa persistência, IDs, relógio, logs e integrações locais;
- não contém regras de negócio pertencentes ao domínio;
- somente é composta pelo processo principal.

## 5.4 Apresentação

- adapta interação e resultados para o usuário;
- não implementa regras financeiras ou operacionais;
- não acessa banco ou repositories diretamente.

---

# 6. Compartilhamento

`shared` será limitado a responsabilidades realmente transversais.

Uma abstração não será movida para `shared` apenas porque pode ser reutilizada no futuro.

Contratos que atravessam o IPC deverão ser serializáveis, versionáveis e validados nas duas extremidades.

---

# 7. Persistência

O banco será SQLite através do Prisma.

Toda alteração estrutural utilizará migration versionada.

A interface nunca acessará Prisma ou SQLite diretamente.

A estratégia física e o schema serão definidos somente nas Tarefas 5 e 6 da Fase 1.

---

# 8. Qualidade

A fundação utiliza:

- TypeScript estrito;
- ESLint;
- Prettier;
- Vitest;
- Testing Library;
- Playwright;
- build e empacotamento verificáveis.

As fronteiras arquiteturais deverão ser protegidas por configuração estática e testes.

---

# 9. Evolução

A arquitetura deverá permitir evolução para múltiplos usuários, cloud, mobile e integrações sem implementar antecipadamente essas funcionalidades.

Funcionalidades futuras não poderão introduzir complexidade sem uso no MVP.

As decisões detalhadas da fundação estão registradas em:

- `ADR/001-toolchain-e-runtime.md`;
- `ADR/002-fronteiras-electron-e-ipc.md`;
- `ADR/003-prisma-sqlite-e-representacao-fisica.md`;
- `ADR/004-empacotamento-windows.md`;
- `ADR/005-integracao-continua.md`.

---

# 10. Inicialização persistente

Após o Electron estar pronto, o processo principal:

1. resolve `app.getPath("userData")/data/rumo.db`;
2. descobre migrations no projeto em desenvolvimento ou em `resources/migrations` no pacote;
3. valida ordem e checksums;
4. aplica migrations pendentes com transação, backup e verificação de integridade;
5. abre o Prisma Client com foreign keys ativas;
6. somente então cria a janela principal;
7. desconecta o cliente durante o encerramento.

Falha de migration ou conexão bloqueia a abertura da aplicação e produz somente código sanitizado no processo principal. A inicialização não cria usuário, preferência ou qualquer dado fictício.

Testes E2E podem substituir o diretório por `RUMO_E2E_USER_DATA_PATH`; essa variável não é usada pelo fluxo funcional.

---

# 11. Distribuição e CI

O Windows x64 é empacotado pelo Electron Forge e instalado por Squirrel.Windows. O instalador é interno, por usuário, sem assinatura, publicação ou atualização automática. Migrations acompanham o pacote e o módulo `better-sqlite3` permanece fora do ASAR.

GitHub Actions separa qualidade do empacotamento Windows. O segundo job somente executa após o primeiro e publica artefatos internos com retenção limitada. A fundação está validada localmente, e os dois jobs foram executados com sucesso no ambiente remoto, reproduzindo o build Windows e gerando os artefatos da pipeline. O job de empacotamento permanece temporariamente em `windows-2022` pela compatibilidade da cadeia de rebuild nativa com Visual Studio 2022; essa decisão de infraestrutura deverá ser reavaliada quando o Electron Forge incorporar suporte oficial ao Visual Studio 2026.
