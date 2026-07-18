# ADR 005 — Integração contínua

- **Status:** aceito estruturalmente; execução remota pendente
- **Data:** 2026-07-17
- **Escopo:** Fase 1 — Tarefa 8

## Contexto

A fundação precisa reproduzir qualidade, migrations e empacotamento Windows sem credenciais, publicação ou dependência de estado local.

## Decisão

Será utilizado GitHub Actions em `push` e `pull_request`, com permissões somente de leitura do conteúdo e cancelamento de execuções anteriores da mesma referência.

O job `quality`, em Ubuntu, fixa Node.js 22.16.0, usa cache npm baseado no lockfile e executa `npm ci`, geração Prisma, formatação, lint, typecheck, testes unitários, de contrato, integração e migrations, além do build.

O job `windows-package`, dependente de `quality`, executa em `windows-latest`, repete instalação limpa e geração Prisma, valida build e migrations, gera o instalador x64, executa smoke test e valida o layout empacotado.

Actions oficiais são referenciadas por versões principais estáveis:

- `actions/checkout@v7`;
- `actions/setup-node@v7`;
- `actions/upload-artifact@v7`.

Somente `Setup.exe`, pacote NuGet e `RELEASES` são enviados como artefato interno, com retenção de 14 dias. Não há release, publicação npm, atualizador, secrets ou credenciais.

## Validação

A estrutura e os comandos do workflow são verificados localmente por teste versionado. A execução real não pode ser confirmada sem push; portanto, o pipeline está estruturalmente pronto, mas não será declarado verde antes da primeira execução no GitHub Actions.

## Consequências

- instalações da CI usam exclusivamente `npm ci`;
- o lockfile controla a reprodução das dependências;
- falhas em qualidade bloqueiam o pacote Windows;
- nenhum artefato contém banco, dados de usuário ou `node_modules` avulso;
- confirmação remota permanece como critério pendente após o primeiro push.
