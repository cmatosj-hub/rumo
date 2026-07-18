# ADR 002 — Fronteiras do Electron e IPC fundacional

## Status

Aceito para as Tarefas 2 a 4 da Fase 1.

## Data

14/07/2026.

## Contexto

O RUMO precisa executar localmente com Electron sem permitir que a interface acesse Node.js, Electron, sistema de arquivos ou persistência.

A fundação também precisa comprovar a comunicação entre renderer e processo principal antes da implementação dos módulos do MVP.

## Decisão

O aplicativo será dividido em:

- `src/main`: bootstrap, janelas, segurança, IPC e futura composição de infraestrutura;
- `src/preload`: adaptador mínimo entre `contextBridge` e canais autorizados;
- `src/renderer`: apresentação React sem acesso privilegiado;
- `src/shared/contracts`: contratos serializáveis compartilhados nas fronteiras;
- `src/shared/domain`: portas e conceitos fundacionais sem frameworks;
- `src/shared/application`: contratos de orquestração;
- `src/shared/infrastructure`: implementações técnicas das portas fundacionais.

As dependências entre camadas serão:

```text
presentation → application → domain
infrastructure → application/domain
domain → nenhuma camada externa
main → application/infrastructure
preload → contracts
renderer → presentation/contracts
```

## Segurança da janela

Toda janela utilizará explicitamente:

- `nodeIntegration: false`;
- `contextIsolation: true`;
- `sandbox: true`;
- `webSecurity: true`;
- preload conhecido pelo processo principal;
- CSP restritiva;
- bloqueio de novas janelas;
- bloqueio de navegação fora do alvo local esperado;
- negação de permissões por padrão.

O aplicativo carregará somente:

- o servidor Vite local durante desenvolvimento; ou
- arquivos empacotados locais em produção.

## IPC

O único canal da fundação será:

```text
foundation:diagnostics:check
```

O preload exporá somente:

```text
window.rumo.diagnostics.check(request)
```

Não serão expostos:

- `ipcRenderer`;
- `send` genérico;
- `invoke` genérico;
- nomes de canal fornecidos pelo renderer;
- objetos Electron;
- APIs Node.js.

O preload validará o request antes do envio e a resposta antes de devolvê-la ao renderer.

O processo principal validará novamente:

- o canal registrado;
- o payload;
- o identificador do `webContents`;
- o frame principal;
- a URL local esperada.

## Contratos fundacionais

Foram definidos:

- resultado tipado;
- códigos de erro;
- `correlationId`;
- relógio injetável;
- gerador de identificadores UUIDv7;
- abstração transacional;
- contrato de logger sanitizado.

O contrato de logger não possui adaptador concreto nesta etapa. Isso evita introduzir dependência adicional antes da política de logs da infraestrutura.

## Instância e encerramento

O processo principal utilizará `requestSingleInstanceLock`.

Uma segunda inicialização apenas focará a janela existente.

No encerramento serão removidos os handlers IPC fundacionais. Recursos persistentes futuros deverão aderir ao mesmo ciclo antes de a aplicação finalizar.

## Consequências

- um comprometimento do renderer não recebe acesso direto ao sistema operacional;
- novas operações IPC exigirão método, canal, schema e teste explícitos;
- o diagnóstico não representa funcionalidade de negócio;
- nenhum módulo do MVP ou persistência foi antecipado.
