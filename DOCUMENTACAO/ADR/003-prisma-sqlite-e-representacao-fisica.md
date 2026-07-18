# ADR 003 — Prisma, SQLite e representação física

- **Status:** aceito
- **Data:** 2026-07-17
- **Escopo:** Fase 1 — Tarefa 5

## Contexto

O RUMO é uma aplicação Electron local-first. A persistência precisa operar exclusivamente no processo principal, manter o arquivo SQLite fora do pacote da aplicação e permitir migrations controladas sem depender de ferramentas globais no computador do usuário.

O spike desta tarefa usa Prisma ORM 7.8.0, `@prisma/client` 7.8.0, `@prisma/adapter-better-sqlite3` 7.8.0 e `better-sqlite3` 12.11.1. No Prisma 7, o query compiler em JavaScript é o padrão e o cliente exige um driver adapter; não há query engine binário Rust para configurar ou distribuir nesta combinação.

## Decisão

### Representação física

1. Identificadores UUID v7 serão armazenados como `TEXT`.
2. Timestamps serão normalizados em UTC e armazenados como texto ISO 8601, usando o formato padrão do adapter para projetos novos. A aplicação não persistirá horários locais ambíguos.
3. Datas civis sem horário serão armazenadas como `TEXT` no formato `YYYY-MM-DD` e validadas na fronteira da aplicação.
4. Timezones serão armazenados como identificadores IANA, por exemplo `America/Sao_Paulo`.
5. Documentos de auditoria serão JSON textual versionado, contendo versão explícita do documento e validação antes da persistência.
6. O ownership será representado por `user_id`; quando os modelos existirem, relações e chaves compostas impedirão associações entre owners diferentes.
7. A auditoria será append-only. A proteção será implementada futuramente por triggers SQLite e repositórios com operações restritas.

### Localização e acesso

- Produção: `app.getPath("userData")/data/rumo.db`.
- Desenvolvimento: o mesmo resolvedor, com `userData` fornecido pelo Electron, salvo quando um caminho temporário for injetado explicitamente.
- Testes: diretório temporário exclusivo, sempre injetado e removido pelo teste.
- Prisma, SQLite e filesystem permanecem inacessíveis ao renderer.
- O preload não expõe operações de banco nem caminhos do filesystem.
- Importar módulos de infraestrutura não cria diretórios nem arquivos. A abertura acontece somente por chamada explícita.

### Prisma e adapter

- `provider = "prisma-client"`, com saída explícita em `src/generated/prisma`, `engineType = "client"`, runtime Node.js e `moduleFormat = "cjs"`.
- CommonJS é fixado porque o processo principal é empacotado nesse formato. A inferência ESM gera `import.meta.url`, incompatível com o bundle CommonJS do main.
- `provider = "sqlite"` no datasource do schema.
- A URL usada apenas por comandos estáticos do Prisma fica em `prisma.config.ts` e aponta para um local temporário ignorado; `format`, `validate` e `generate` não abrem nem criam esse arquivo.
- O cliente de runtime recebe `PrismaBetterSqlite3` com URL injetada e timestamp ISO 8601 padrão.
- `PRAGMA foreign_keys = ON` é aplicado imediatamente após a abertura e validado.
- O encerramento controlado chama `$disconnect()`.
- O módulo nativo é desempacotado do ASAR por `@electron-forge/plugin-auto-unpack-natives` 7.11.2.
- Electron Forge força explicitamente o rebuild de `better-sqlite3` para o ABI do Electron em `start`, `package` e `make`, restrito a esse módulo. O projeto fixa `@electron/rebuild` 4.2.0, cuja cadeia `node-gyp` possui suporte ao Visual Studio 2026. Testes que carregam SQLite diretamente no Node restauram antes o binário para o ABI do Node; qualquer entrada Electron refaz o ABI 148, sem depender da ordem dos comandos.
- O filtro de cópia do packager preserva `node_modules` para que o prune mantenha apenas dependências de produção e o auto-unpack encontre o binário nativo. O filtro padrão do plugin Vite, que copia somente `.vite`, não atende módulos externalizados.

Não será usado `prisma db push`. Esta tarefa não cria migration. Migrations de runtime futuras serão executadas por código empacotado e não dependerão de `npx`, Prisma CLI global ou rede.

## Tratamento de falhas

Detalhes internos, caminhos absolutos, SQL e dados não serão enviados ao renderer nem registrados. A infraestrutura converte falhas em erro estruturado com código estável e mensagem sanitizada; a causa original fica restrita ao processo principal.

## Consequências

- `better-sqlite3` é um módulo nativo e precisa ser reconstruído para o ABI do Electron durante o empacotamento.
- O schema da Tarefa 5 não contém entidades do domínio. A primeira migration pertence exclusivamente à Tarefa 6.
- Constraints de datas civis, JSON versionado, ownership e auditoria serão materializadas quando os respectivos modelos forem aprovados.
- O Prisma CLI permanece dependência de desenvolvimento e nunca será requisito de runtime.

## Evidências do spike

A decisão será considerada validada quando os testes desta tarefa comprovarem abertura e fechamento explícitos, foreign keys habilitadas, commit e rollback transacionais, carregamento do Prisma Client e do módulo nativo no pacote Windows e ausência de banco criado por import, geração, build ou empacotamento.
