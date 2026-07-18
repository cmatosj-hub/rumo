# ADR 005 — Integração contínua

- **Status:** aceito e validado em execução remota
- **Data:** 2026-07-17
- **Escopo:** Fase 1 — Tarefa 8

## Contexto

A fundação precisa reproduzir qualidade, migrations e empacotamento Windows sem credenciais, publicação ou dependência de estado local.

## Decisão

Será utilizado GitHub Actions em `push` e `pull_request`, com permissões somente de leitura do conteúdo e cancelamento de execuções anteriores da mesma referência.

O job `quality`, em Ubuntu, fixa Node.js 22.16.0, usa cache npm baseado no lockfile e executa `npm ci`, geração Prisma, formatação, lint, typecheck, testes unitários, de contrato, integração e migrations, além do build.

O job `windows-package`, dependente de `quality`, executa temporariamente em `windows-2022`, repete instalação limpa e geração Prisma, valida build e migrations, gera o instalador x64, executa smoke test e valida o layout empacotado.

O pin do runner Windows é uma decisão temporária de infraestrutura da CI. O `windows-latest` passou a utilizar Visual Studio 2026, ainda não reconhecido pela cadeia de rebuild nativa usada pelo Electron Forge nesta versão. `windows-2022` preserva o build com Visual Studio 2022 sem desabilitar o rebuild de `better-sqlite3`. O retorno para `windows-latest` deverá ser reavaliado quando uma versão estável do Electron Forge incorporar uma cadeia de rebuild com suporte oficial ao Visual Studio 2026.

Actions oficiais são referenciadas por versões principais estáveis:

- `actions/checkout@v7`;
- `actions/setup-node@v7`;
- `actions/upload-artifact@v7`.

Somente `Setup.exe`, pacote NuGet e `RELEASES` são enviados como artefato interno, com retenção de 14 dias. Não há release, publicação npm, atualizador, secrets ou credenciais.

## Validação

A estrutura e os comandos do workflow foram verificados localmente por teste versionado. A execução real do workflow `Foundation CI` também foi concluída com sucesso no GitHub Actions, com os jobs `quality` e `windows-package` aprovados.

A execução remota validou instalação determinística com `npm ci`, geração do Prisma Client, formatação, lint, TypeScript, testes unitários, de contrato e integração, validação das migrations, testes do migration runner e de falha de migration, build de produção, empacotamento Windows x64, rebuild nativo de `better-sqlite3`, geração do instalador Squirrel, testes do pacote, validação do layout e upload dos artefatos.

## Consequências

- instalações da CI usam exclusivamente `npm ci`;
- o lockfile controla a reprodução das dependências;
- falhas em qualidade bloqueiam o pacote Windows;
- nenhum artefato contém banco, dados de usuário ou `node_modules` avulso;
- o build Windows e os artefatos internos são reproduzidos pela pipeline;
- o runner Windows deverá voltar a ser avaliado quando a cadeia oficial de rebuild suportar Visual Studio 2026.
