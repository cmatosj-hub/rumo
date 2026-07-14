# API DO PROJETO RUMO

## Objetivo

Este documento define como ocorre a comunicação entre a interface, os serviços e o banco de dados.

Mesmo utilizando SQLite localmente na primeira versão, toda comunicação deverá ocorrer através de uma camada de serviços (API interna).

Nenhuma tela poderá acessar diretamente o banco de dados.

---

# Arquitetura

Frontend

↓

Controllers

↓

Services

↓

Repositories

↓

Banco de Dados

---

# Fluxo obrigatório

Tela

↓

Validação

↓

Controller

↓

Service

↓

Repository

↓

SQLite

↓

Repository

↓

Service

↓

Controller

↓

Tela

---

# Controllers

Os Controllers são responsáveis por:

- Receber solicitações da interface.
- Validar parâmetros básicos.
- Chamar o Service correspondente.
- Retornar respostas padronizadas.

Nunca realizar cálculos.

Nunca acessar diretamente o banco.

Nunca implementar regras de negócio.

---

# Services

Os Services representam o cérebro do sistema.

Responsabilidades:

- Regras de negócio.
- Validação financeira.
- Cálculos.
- Atualizações patrimoniais.
- Atualização de metas.
- Geração de indicadores.

Toda lógica deverá ficar aqui.

---

# Repositories

Responsáveis exclusivamente pelo acesso ao banco.

Funções:

- Buscar registros.
- Inserir registros.
- Atualizar registros.
- Cancelar registros.

Nunca realizar cálculos.

Nunca implementar regras financeiras.

---

# Padrão das respostas

Todas as respostas deverão seguir o padrão:

Sucesso

{
  success: true,
  data: ...
}

Erro

{
  success: false,
  message: "...",
  error: ...
}

---

# Futuro

Toda a estrutura deverá permitir migração futura para:

- PostgreSQL
- API REST
- API Cloud
- Aplicativo Mobile

Sem necessidade de alterar as regras de negócio.