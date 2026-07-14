# ARQUITETURA DO RUMO

## Objetivo

O projeto deverá possuir arquitetura modular.

Toda funcionalidade deverá possuir baixo acoplamento.

Toda funcionalidade deverá possuir alta reutilização.

---

# Princípios

- Código limpo
- SOLID
- DRY
- KISS
- Modularização
- Separação de responsabilidades

---

# Estrutura

src/

app/

components/

features/

services/

repositories/

database/

hooks/

utils/

types/

assets/

config/

tests/

---

# Components

Componentes reutilizáveis.

Nunca conter regras de negócio.

---

# Features

Cada funcionalidade deverá ser isolada.

Exemplo

financeiro/

operacional/

veiculos/

manutencao/

metas/

patrimonio/

relatorios/

configuracoes/

---

# Services

Toda regra financeira.

Toda regra operacional.

Toda regra patrimonial.

Toda inteligência do sistema.

---

# Repositories

Acesso ao banco.

Nunca realizar cálculos.

---

# Utils

Funções auxiliares.

Formatação.

Datas.

Moedas.

Conversões.

---

# Hooks

Hooks personalizados.

Nunca implementar regra financeira.

---

# Banco

SQLite.

Utilizar Prisma.

Toda alteração deverá utilizar Migration.

---

# Componentização

Toda tela deverá ser composta por componentes pequenos.

Evitar componentes acima de aproximadamente 300 linhas.

Evitar funções acima de aproximadamente 100 linhas.

---

# Performance

Evitar renderizações desnecessárias.

Utilizar Lazy Loading.

Utilizar Memoização quando necessário.

Priorizar desempenho.

---

# Escalabilidade

Toda arquitetura deverá permitir:

Múltiplos usuários.

Múltiplos veículos.

Sincronização.

Cloud.

Aplicativo Mobile.

Integrações futuras.

---

# Objetivo

A arquitetura deverá permitir que o projeto dobre de tamanho sem necessidade de reorganização estrutural.