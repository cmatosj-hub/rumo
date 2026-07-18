# ADR 006 — Dashboard e preferências operacionais

## Status

Aceito em 18/07/2026.

## Contexto

A primeira vertical precisa apresentar indicadores e metas opcionais sem mover regras para o renderer, expor o banco pela interface ou antecipar o agregado financeiro completo de metas.

## Decisão

As preferências operacionais serão campos opcionais de `UserSettings`, persistidos por migration aditiva e acessados por dois canais IPC específicos. O módulo `dashboard` conterá serviços puros de domínio que projetam indicadores e filtros sobre os contratos de `DailyClosing` e `OperationalSettings`.

O dashboard será explicitamente descrito como projeção dos fechamentos operacionais. Ele não será tratado como fonte financeira canônica.

## Consequências

- o renderer não acessa Prisma, SQLite ou Node.js;
- metas permanecem opcionais e não bloqueiam o dashboard;
- cálculos e comparação semanal são testáveis sem Electron;
- atualizações de fechamento ou preferências recompõem imediatamente a projeção em memória;
- uma futura vertical financeira poderá substituir a fonte dos indicadores sem reutilizar `UserSettings` como agregado genérico de metas.
