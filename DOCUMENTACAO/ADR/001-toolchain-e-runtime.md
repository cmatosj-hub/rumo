# ADR 001 — Toolchain e runtime da fundação

## Status

Aceito para a Tarefa 1 da Fase 1.

## Data

14/07/2026.

## Contexto

O RUMO será um aplicativo desktop local-first para Windows, conforme as Decisões 019 e 048.

A fundação precisa combinar Electron, React, Vite e TypeScript, preservar a separação entre os processos principal, preload e renderer e manter versões reproduzíveis.

O repositório já contém a documentação aprovada. Por isso, não será utilizado um gerador que possa substituir ou reorganizar arquivos existentes.

## Decisão

O projeto utilizará npm e scaffold manual.

As versões da Tarefa 1 serão:

| Componente | Versão |
|---|---:|
| Node.js | 22.16.0 |
| npm | 10.9.2 |
| Electron | 43.1.0 |
| Electron Forge CLI | 7.11.2 |
| Electron Forge Vite Plugin | 7.11.2 |
| Vite | 8.1.4 |
| Plugin React para Vite | 6.0.3 |
| React | 19.2.7 |
| React DOM | 19.2.7 |
| TypeScript | 6.0.3 |
| Tipos do Node.js | 24.13.3 |
| Tipos do React | 19.2.17 |
| Tipos do React DOM | 19.2.3 |

Todas as dependências diretas utilizarão versões exatas no `package.json` e no `package-lock.json`.

## Compatibilidade verificada

- Electron 43.1.0 exige Node.js 22.12.0 ou superior.
- Vite 8.1.4 exige Node.js 20.19.0 ou superior, ou Node.js 22.12.0 ou superior.
- `@vitejs/plugin-react` 6.0.3 exige Vite 8.
- React DOM 19.2.7 exige React 19.2.7 dentro da mesma linha compatível.
- Electron 43.1.0 declara tipos do Node.js na linha 24.9.0 ou superior.
- Electron Forge CLI e plugin Vite utilizarão a mesma versão 7.11.2.
- Node.js 22.16.0, já disponível no ambiente de desenvolvimento, satisfaz Electron e Vite.

## Escolha do TypeScript

O registro npm já oferece TypeScript 7.0.2.

Para a fundação foi escolhida a versão 6.0.3, última correção disponível da major anterior, porque:

- não há requisito do RUMO que dependa da major 7;
- a major 6 atende a tipagem estrita necessária;
- a escolha reduz o risco de incompatibilidades iniciais com ferramentas que ainda estejam adaptando suas configurações à major 7.

A atualização para TypeScript 7 poderá ser avaliada em tarefa própria, com typecheck, testes e build completos.

## Auditoria das dependências

Após a instalação, `npm audit` informou 22 ocorrências transitivas na cadeia de desenvolvimento:

- 3 de severidade baixa;
- 19 de severidade alta;
- nenhuma de severidade crítica.

As ocorrências altas são propagadas principalmente pela cadeia do Electron Forge, incluindo `@electron/rebuild`, `@electron/node-gyp`, `tar` e utilitários de prompts.

O npm não oferece correção compatível para a versão estável atual do Forge. A versão 7.11.2 já era a versão estável mais recente consultada no registro durante esta tarefa.

Não será utilizado `npm audit fix`, `--force`, override transitivo ou versão alpha para ocultar o relatório.

A auditoria limitada às dependências de execução, por meio de `npm audit --omit=dev`, retornou zero vulnerabilidades conhecidas.

O risco residual fica restrito neste momento ao tooling de desenvolvimento e empacotamento e deverá ser reavaliado antes da Tarefa 7 e em toda atualização do Forge.

## Electron Forge e Vite

Electron Forge será responsável pelos ciclos `start`, `package` e `make`.

O plugin Vite do Electron Forge ainda é classificado por seus mantenedores como experimental. Para reduzir esse risco:

- sua versão será exata;
- Forge CLI e plugin terão a mesma versão;
- atualizações dependerão de revisão das notas de versão;
- a Tarefa 2 validará desenvolvimento e build;
- a Tarefa 7 validará o pacote e o instalador Windows.

## Scripts previstos

O manifesto reserva os scripts:

- `start`;
- `build`;
- `typecheck`;
- `package`;
- `make`.

Na Tarefa 1 somente `typecheck` será validado integralmente.

Os scripts `start`, `build`, `package` e `make` referenciam entradas que serão criadas na Tarefa 2. Eles não serão executados nem mascarados com implementações provisórias nesta tarefa.

## Consequências

- o projeto terá instalação reproduzível por meio de `npm ci`;
- o lockfile será obrigatório;
- atualizações de dependências serão explícitas;
- a pasta `DOCUMENTACAO` permanecerá preservada;
- nenhum módulo funcional, banco, schema Prisma ou migration será criado nesta tarefa.
