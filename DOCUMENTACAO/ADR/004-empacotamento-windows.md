# ADR 004 — Empacotamento Windows

- **Status:** aceito para uso interno
- **Data:** 2026-07-17
- **Escopo:** Fase 1 — Tarefa 7

## Contexto

O RUMO precisa de pacote Windows x64 e instalador por usuário, mantendo Prisma, SQLite nativo e migrations disponíveis sem ferramentas globais. Não existe ícone, certificado ou identidade comercial aprovados.

## Decisão

O empacotamento continuará sob Electron Forge 7.11.2. O instalador será produzido por `@electron-forge/maker-squirrel` 7.11.2, com Squirrel.Windows, arquitetura x64 e instalação por usuário.

Identidade técnica:

- produto visível: `RUMO`;
- pacote interno: `rumo`;
- versão: `0.1.0`;
- descrição: controle financeiro e operacional pessoal;
- executável: `RUMO.exe`;
- identificador derivado pelo Squirrel: `com.squirrel.rumo.rumo`.

O campo técnico de autor exigido pelo formato NuGet usa `RUMO`, nome do próprio projeto. Ele não representa pessoa, empresa, editora ou assinatura digital.

Não serão configurados certificado, publicação, atualização automática, MSI ou recursos visuais improvisados. O ícone padrão do Electron permanece até existir recurso aprovado.

## Conteúdo do pacote

- o aplicativo permanece em ASAR;
- `better_sqlite3.node` é extraído para `app.asar.unpacked` pelo plugin de auto-unpack;
- Prisma Client e query compiler JavaScript são incorporados ao bundle do processo principal;
- migrations são copiadas para `resources/migrations`;
- Prisma CLI permanece somente no desenvolvimento e não integra o fluxo de runtime;
- dados operacionais ficam em `app.getPath("userData")/data/rumo.db`, nunca no diretório de instalação.

## Validação

O package, o make, o layout físico e o smoke test do executável são automatizados. O smoke test injeta um `userData` temporário, comprova inicialização, migration, Prisma, módulo nativo, IPC, isolamento do renderer e encerramento.

O instalador, o pacote NuGet e o manifesto `RELEASES` foram gerados localmente. Uma tentativa de redirecionar a instalação silenciosa para `LOCALAPPDATA` temporário não foi respeitada pelo bootstrapper Squirrel neste ambiente. A instalação de teste foi desinstalada e os resíduos foram removidos, mas o ciclo completo instalado não será automatizado enquanto não houver isolamento confiável.

Assim, instalação, abertura e desinstalação deverão ser verificadas manualmente em máquina ou usuário descartável antes de distribuição. O instalador é interno, não assinado e pode gerar alerta do Windows SmartScreen.

## Consequências

- o pacote Windows x64 é reproduzível por `npm run make -- --arch=x64`;
- artefatos permanecem em `out/`, ignorado pelo Git;
- não há atualização ou publicação automática;
- distribuição pública, assinatura e identidade visual continuam pendentes;
- o pacote não deve ser apresentado como instalador público de produção.
