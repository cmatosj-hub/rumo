# Módulos do RUMO

Este diretório receberá os módulos funcionais apenas nas entregas verticais do roadmap.

Cada módulo deverá organizar suas responsabilidades em:

```text
module/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

As dependências permitidas são:

```text
presentation → application → domain
infrastructure → application/domain
domain → nenhuma camada externa
```

Nenhum módulo funcional foi criado durante a fundação.
