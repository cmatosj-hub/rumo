# GUIA DO DESENVOLVEDOR

Este documento define como qualquer desenvolvedor deverá trabalhar no projeto RUMO.

A documentação é soberana.

Caso exista conflito entre código e documentação, prevalece a documentação.

---

# Antes de iniciar qualquer tarefa

Ler:

00_PRODUCT.md

01_REQUISITOS.md

02_REGRAS_NEGOCIO.md

05_DATABASE.md

08_ARCHITECTURE.md

10_ROADMAP.md

Somente depois iniciar o desenvolvimento.

---

# Processo obrigatório

1 Ler documentação.

2 Entender a tarefa.

3 Explicar a estratégia.

4 Informar arquivos alterados.

5 Implementar.

6 Revisar.

7 Testar.

8 Informar alterações realizadas.

---

# Nunca fazer

Nunca criar gambiarra.

Nunca duplicar código.

Nunca remover funcionalidades.

Nunca alterar regras de negócio.

Nunca misturar interface com cálculos.

Nunca acessar banco diretamente pelas telas.

Nunca criar dependências desnecessárias.

Nunca criar funções gigantes.

Nunca criar componentes gigantes.

Nunca ignorar erros de TypeScript.

Nunca deixar TODOs esquecidos.

Nunca deixar código comentado sem motivo.

---

# Sempre fazer

Criar componentes reutilizáveis.

Utilizar tipagem forte.

Documentar decisões importantes.

Utilizar nomes claros.

Priorizar simplicidade.

Criar código legível.

Validar entradas.

Tratar erros.

Manter organização.

Pensar na escalabilidade.

---

# Qualidade

Antes de finalizar qualquer módulo verificar:

Compila.

Sem warnings.

Sem erros.

Sem imports quebrados.

Sem código morto.

Sem duplicações.

Sem regressões.

---

# Atualização da documentação

Sempre que:

Criar funcionalidade.

Alterar regra.

Modificar arquitetura.

Modificar banco.

Modificar fluxo.

Modificar cálculos.

Verificar se algum documento precisa ser atualizado.

Caso precise, informar quais arquivos devem ser alterados.

---

# Filosofia

O objetivo não é apenas fazer funcionar.

O objetivo é construir um software que possa evoluir durante muitos anos.

Cada decisão deverá considerar:

Facilidade de manutenção.

Escalabilidade.

Desempenho.

Legibilidade.

Experiência do usuário.

Reutilização.

Organização.

---

# Regra Final

Sempre que houver dúvida:

Não assumir.

Não inventar.

Perguntar.

Aguardar resposta antes de implementar.