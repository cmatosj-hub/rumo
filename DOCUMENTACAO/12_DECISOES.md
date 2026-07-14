# DECISÕES DO PROJETO RUMO

## Objetivo

Este documento registra todas as decisões importantes tomadas durante o desenvolvimento do projeto.

Seu objetivo é preservar o contexto das decisões para que futuras alterações não desfaçam escolhas já aprovadas.

Sempre que uma decisão relevante for tomada, este documento deverá ser atualizado.

---

# DECISÃO 001

## Título

O RUMO será um ERP pessoal.

## Data

13/07/2026

## Motivo

Foi decidido que o projeto não será apenas um controle financeiro.

O sistema deverá atuar como um Sistema de Gestão Operacional e Patrimonial voltado para motoristas de aplicativo.

## Impacto

Toda nova funcionalidade deverá contribuir para auxiliar a tomada de decisões do usuário.

---

# DECISÃO 002

## Título

Documentação é soberana.

## Data

13/07/2026

## Motivo

Evitar que o projeto mude de direção conforme novas conversas com IA.

## Impacto

Sempre que existir conflito entre código e documentação, prevalece a documentação.

---

# DECISÃO 003

## Título

Nenhum dado financeiro poderá ser excluído.

## Data

13/07/2026

## Motivo

Garantir integridade histórica.

## Impacto

Exclusões serão realizadas através de cancelamento lógico.

---

# DECISÃO 004

## Título

Todas as regras de negócio ficarão em Services.

## Data

13/07/2026

## Motivo

Separar interface da lógica.

## Impacto

Nenhuma tela poderá conter cálculos financeiros.

---

# DECISÃO 005

## Título

O banco inicial será SQLite.

## Data

13/07/2026

## Motivo

Facilidade de instalação.

Maior velocidade.

Funcionamento offline.

## Impacto

Toda arquitetura deverá permitir migração futura para PostgreSQL.

---

# DECISÃO 006

## Título

Arquitetura Modular.

## Data

13/07/2026

## Motivo

Facilitar manutenção.

## Impacto

Cada módulo deverá ser independente.

---

# DECISÃO 007

## Título

O sistema deverá funcionar offline.

## Data

13/07/2026

## Motivo

Motoristas podem ficar sem internet.

## Impacto

Todas as funcionalidades principais deverão funcionar localmente.

---

# DECISÃO 008

## Título

Suporte a múltiplos veículos.

## Data

13/07/2026

## Motivo

Permitir crescimento do usuário.

## Impacto

Todas as tabelas relacionadas deverão considerar veículo como entidade principal.

---

# DECISÃO 009

## Título

Todas as metas serão opcionais.

## Data

13/07/2026

## Motivo

Cada motorista possui uma forma diferente de trabalhar.

## Impacto

Nenhuma funcionalidade dependerá obrigatoriamente de metas.

---

# DECISÃO 010

## Título

Separação entre Patrimônio e Fluxo de Caixa.

## Data

13/07/2026

## Motivo

Dinheiro disponível não representa patrimônio.

## Impacto

O sistema deverá controlar ambos de maneira independente.

---

# DECISÃO 011

## Título

Toda funcionalidade deverá ser escalável.

## Data

13/07/2026

## Motivo

Preparar futuras versões.

## Impacto

Sempre considerar:

- múltiplos usuários
- cloud
- aplicativo mobile
- integração bancária
- inteligência artificial

Mesmo que ainda não existam.

---

# DECISÃO 012

## Título

Código reutilizável.

## Data

13/07/2026

## Motivo

Evitar duplicações.

## Impacto

Sempre criar componentes reutilizáveis.

---

# DECISÃO 013

## Título

Todas as alterações importantes deverão ser documentadas.

## Data

13/07/2026

## Motivo

Preservar histórico do projeto.

## Impacto

Sempre atualizar a documentação antes da implementação.

---

# DECISÃO 014

## Título

Implementação por módulos.

## Data

13/07/2026

## Motivo

Reduzir regressões.

## Impacto

Nunca implementar diversas funcionalidades grandes simultaneamente.

---

# DECISÃO 015

## Título

O dashboard será o centro do sistema.

## Data

13/07/2026

## Motivo

O usuário deve obter rapidamente todas as informações essenciais.

## Impacto

Todas as funcionalidades deverão alimentar o dashboard automaticamente.

---

# DECISÃO 016

## Título

O sistema deverá explicar indicadores financeiros.

## Data

13/07/2026

## Motivo

Nem todo motorista possui conhecimento financeiro.

## Impacto

Indicadores importantes deverão possuir descrição e orientação para interpretação.

---

# DECISÃO 017

## Título

Inteligência financeira integrada.

## Data

13/07/2026

## Motivo

O sistema deve ajudar o usuário a tomar decisões.

## Impacto

Sempre que possível, o sistema deverá identificar padrões e gerar alertas e recomendações.

---

# DECISÃO 018

## Título

Experiência do usuário acima da complexidade.

## Data

13/07/2026

## Motivo

O usuário utilizará o sistema diariamente.

## Impacto

Sempre priorizar simplicidade, rapidez e facilidade de uso.

---

# Como registrar novas decisões

Sempre utilizar o seguinte modelo:

--------------------------------------------------

# DECISÃO XXX

## Título

...

## Data

...

## Motivo

...

## Impacto

...

--------------------------------------------------

Nunca alterar decisões antigas.

Caso uma decisão seja substituída, criar uma nova decisão informando qual foi revisada e por quê.

Este documento representa a memória permanente do projeto.