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
npm run build
npm run typecheck
npm run format
npm run format:check
npm run lint
npm run test
npm run test:coverage
npm run test:contract
npm run test:e2e
npm run package
npm run make
npm run verify
```

`verify` executa formatação, lint, typecheck, testes unitários, testes de contrato e build.

Testes E2E e empacotamento permanecem comandos explícitos porque iniciam processos e geram artefatos próprios.

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
