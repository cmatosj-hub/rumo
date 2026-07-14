# MODELO LÓGICO DE DADOS DO RUMO — MVP 1.0

## Objetivo

Este documento define o modelo lógico de dados do MVP 1.0 do RUMO.

Ele descreve entidades, agregados, relacionamentos, cardinalidades, ownership, integridade histórica, constraints, índices, dados derivados, transações e estratégia de evolução.

Este documento não define nomes físicos definitivos de modelos, tabelas ou campos do Prisma.

Nenhum schema físico, migration ou banco deverá ser criado antes da aprovação deste modelo e das decisões técnicas classificadas como bloqueadoras.

Em caso de conflito, prevalece a ordem documental estabelecida em `12_DECISOES.md`.

---

# 1. Princípios do modelo

## 1.1 Tecnologia

O banco do MVP utilizará:

- SQLite;
- Prisma;
- migrations versionadas e obrigatórias;
- foreign keys habilitadas em todas as conexões;
- transações para operações compostas;
- constraints de banco sempre que a regra puder ser garantida localmente;
- casos de uso para invariantes que envolvam múltiplos registros ou agregados.

Nenhuma alteração estrutural será aplicada manualmente em bancos de uso real.

## 1.2 Identificadores

Todas as entidades persistidas possuirão identificadores:

- gerados pela aplicação;
- estáveis;
- globalmente únicos;
- independentes de sequência local do SQLite;
- imutáveis durante toda a vida do registro.

A estratégia aprovada será UUID versão 7, ou representação tecnicamente equivalente que preserve:

- unicidade global;
- geração offline;
- ordenação temporal aproximada;
- compatibilidade com importação e sincronização futuras.

O SQLite não será responsável por gerar a identidade principal das entidades de domínio.

A representação física definitiva será documentada antes do `schema.prisma`.

## 1.3 Ownership obrigatório

Toda entidade pertencente ao usuário possuirá `user_id`.

Para toda relação entre entidades do usuário, a integridade deverá garantir simultaneamente:

- identidade da entidade relacionada;
- identidade do proprietário.

Conceitualmente, as relações utilizarão foreign keys compostas:

```text
(user_id, entidade_id)
→
(user_id, id)
```

Cada entidade referenciada deverá possuir chave candidata única correspondente a:

```text
(user_id, id)
```

Essa regra será obrigatória para:

- contas;
- veículos;
- lançamentos;
- movimentos;
- jornadas;
- leituras de odômetro;
- receitas;
- abastecimentos;
- manutenções;
- documentos;
- metas;
- alertas;
- demais entidades pertencentes ao usuário.

Índices ou filtros da aplicação não substituirão a integridade de ownership.

Entidades globais de sistema poderão não possuir `user_id`.

## 1.4 Valores monetários

Valores monetários serão armazenados como números inteiros em centavos.

Não será utilizado ponto flutuante para valores financeiros.

O MVP será monomoeda em Real brasileiro.

## 1.5 Datas e horários

Serão representados separadamente:

- timestamp técnico em UTC;
- instante efetivo do fato;
- data operacional;
- data civil de vencimento;
- timezone efetivo, quando necessário.

A mudança do timezone atual não poderá reagrupar dados históricos.

## 1.6 Integridade histórica

O modelo utilizará:

- auditoria append-only;
- movimentos financeiros imutáveis;
- cancelamento lógico;
- reversões;
- correções por substituição;
- histórico append-only de odômetro;
- proibição de exclusão física de dados financeiros e históricos.

## 1.7 Fonte financeira canônica

O lançamento financeiro representará o fato econômico ou financeiro.

O movimento de conta representará o efeito desse fato sobre uma conta.

Detalhes especializados não armazenarão um segundo valor autoritativo para saldo, resultado ou fluxo de caixa.

## 1.8 Política de exclusão

Foreign keys de entidades históricas utilizarão uniformemente:

- `RESTRICT`; ou
- `NO ACTION`.

Não serão utilizados:

- `CASCADE`;
- `SET NULL`;
- exclusão automática de dependentes

em dados financeiros, auditoria, odômetro, jornadas confirmadas, abastecimentos, manutenções ou documentos históricos.

A desassociação de conta padrão ou veículo ativo ocorrerá por caso de uso explícito antes da inativação, nunca como consequência automática de exclusão.

## 1.9 Dados derivados

Saldos, indicadores, condições temporais e outros valores reconstruíveis não serão fontes primárias persistidas.

Caches e projeções somente poderão existir quando forem:

- versionados;
- reconstruíveis;
- invalidáveis;
- não editáveis pelo usuário.

---

# 2. Agregados e classificação das entidades

## 2.1 Raízes de agregado

| Raiz | Responsabilidade |
|---|---|
| Usuário | Limite de ownership dos dados |
| Conta financeira | Ciclo de vida da conta |
| Veículo | Cadastro e disponibilidade do veículo |
| Evento de odômetro | Posição histórica de uma medição no veículo |
| Lançamento financeiro | Autoridade do fato financeiro e de seu ciclo econômico |
| Dia de cobertura de receita | Exclusividade entre cobertura consolidada e por veículo |
| Cobertura de receita | Exclusividade entre receitas individuais e fechamento diário |
| Jornada | Período de trabalho, veículo, pausas e KM |
| Plano de manutenção | Programação de manutenção |
| Evento de manutenção | Manutenção realizada, inclusive sem custo |
| Documento ou obrigação | Seguro, IPVA, licenciamento ou multa |
| Meta | Objetivo opcional |
| Alerta | Ocorrência determinística |

## 2.2 Especializações dependentes do lançamento

Não serão raízes financeiras independentes:

- transferência;
- retirada pessoal;
- ajuste de saldo;
- abastecimento confirmado;
- receita individual;
- fechamento diário;
- vínculo financeiro de manutenção;
- vínculo financeiro de documento.

Essas entidades serão especializações ou detalhes dependentes 1:1 do lançamento financeiro.

O lançamento será a única autoridade sobre:

- confirmação financeira;
- cancelamento financeiro;
- correção financeira;
- reversão;
- estado econômico.

## 2.3 Entidades dependentes

- configurações do usuário;
- movimento de conta;
- especialização financeira;
- detalhe de transferência;
- detalhe de retirada;
- detalhe de ajuste;
- receita individual;
- fechamento diário;
- componente de fechamento;
- abastecimento;
- revisão de leitura de odômetro;
- evento de troca de painel;
- pausa de jornada;
- vínculo financeiro de manutenção;
- vínculo financeiro de documento.

## 2.4 Dados de referência

- tipos de conta;
- categorias financeiras;
- origens de receita;
- tipos de documento;
- componentes de manutenção;
- moeda;
- destino externo `Uso pessoal`.

## 2.5 Logs e históricos

- auditoria;
- movimentos financeiros;
- reversões;
- eventos e revisões de odômetro;
- trocas de painel;
- registros cancelados;
- cadeias de correção.

## 2.6 Projeções derivadas

- saldo;
- KM atual;
- próximo vencimento;
- condição temporal de documento;
- consumo;
- progresso de meta;
- resultado operacional;
- fluxo de caixa;
- indicadores do dashboard.

---

# 3. Usuário e configurações

## 3.1 Usuário

Representa o perfil local proprietário dos dados.

O MVP terá somente um perfil local ativo na interface, mas o modelo não dependerá dessa limitação para garantir ownership.

## 3.2 Configurações

As configurações pertencerão ao usuário e poderão conter:

- moeda;
- timezone;
- tema;
- locale;
- preferências básicas;
- referência à conta padrão;
- referência ao veículo ativo.

As referências à conta padrão e ao veículo ativo utilizarão ownership composto.

## 3.3 Conta padrão

A conta padrão será uma referência única nas configurações.

Ela poderá ficar ausente durante onboarding incompleto.

Após a conclusão do onboarding financeiro, deverá apontar para conta disponível do mesmo usuário.

Uma conta deverá ser removida da posição de padrão antes de ser inativada.

## 3.4 Veículo ativo

O veículo ativo será uma referência única nas configurações.

A referência será anulável para manter compatibilidade com a decisão pendente sobre permitir zero veículos ativos.

Ela somente poderá apontar para veículo disponível do mesmo usuário.

---

# 4. Veículos e odômetro

## 4.1 Veículo

Um usuário poderá possuir vários veículos.

Cada veículo pertencerá a exatamente um usuário.

O estado cadastral do veículo será independente da referência que identifica o veículo atualmente selecionado para operação.

A inativação não removerá históricos.

## 4.2 Evento de odômetro

Cada medição ocupará uma posição lógica estável no histórico do veículo.

O evento registrará:

- usuário;
- veículo;
- instante efetivo da medição em UTC;
- data operacional;
- timezone efetivo;
- identificador global;
- tipo do evento;
- timestamp de criação.

A ordenação determinística será:

```text
instante efetivo da medição
+
identificador global do evento
```

O identificador será utilizado como desempate estável quando dois eventos possuírem o mesmo instante efetivo.

A ordem de criação no banco não será utilizada como única fonte de ordenação.

## 4.3 Revisões de leitura

Os valores da medição serão registrados em revisões append-only vinculadas ao evento de odômetro.

Cada revisão registrará:

- evento de odômetro;
- número sequencial da revisão;
- leitura exibida;
- quilometragem efetiva;
- tipo da revisão;
- revisão substituída;
- motivo;
- ator;
- timestamp UTC.

A revisão inicial terá número 1.

Uma correção criará nova revisão e nunca atualizará a revisão anterior.

Somente a revisão vigente de um evento poderá ser substituída.

A combinação abaixo será única:

```text
evento de odômetro + número da revisão
```

Uma revisão poderá ser substituída por no máximo uma nova revisão.

## 4.4 Reconstrução do histórico

Para cada evento, será considerada a última revisão válida de sua cadeia.

Os eventos serão ordenados por:

1. instante efetivo;
2. identificador global.

A quilometragem efetiva das revisões vigentes deverá ser monotônica nessa ordem.

Essa invariância dependerá de transação e caso de uso, porque envolve comparação entre registros diferentes.

## 4.5 Troca de painel

A troca de painel será entidade tipada e não utilizará relação polimórfica.

Ela referenciará explicitamente:

- usuário;
- veículo;
- evento da última leitura anterior;
- evento da primeira leitura do novo painel;
- leitura final anterior;
- nova leitura exibida;
- quilometragem efetiva de continuidade;
- data operacional;
- motivo;
- ator.

## 4.6 Relações com outros módulos

A relação será sempre da entidade de negócio para o evento de odômetro:

- jornada referencia evento inicial e evento final;
- abastecimento referencia seu evento de odômetro;
- manutenção referencia seu evento de odômetro.

O evento de odômetro não possuirá uma foreign key polimórfica apontando para jornada, abastecimento ou manutenção.

---

# 5. Contas financeiras

## 5.1 Conta

Tipos iniciais:

- dinheiro físico;
- conta bancária;
- carteira digital;
- conta de aplicativo.

Cada conta possuirá:

- usuário;
- nome;
- tipo;
- origem de receita associada, quando aplicável;
- estado cadastral;
- timestamps técnicos.

## 5.2 Saldo

O saldo será calculado exclusivamente pela soma de movimentos postados:

```text
créditos postados
-
débitos postados
```

O estado econômico posterior do lançamento não removerá movimentos já postados desse cálculo.

Cancelamentos e correções neutralizarão efeitos exclusivamente através de movimentos de reversão.

## 5.3 Movimento de abertura

Saldo inicial diferente de zero produzirá:

- lançamento de abertura;
- exatamente um movimento;
- auditoria.

Movimento de abertura será tipo de lançamento, não entidade independente.

## 5.4 Destino externo

`Uso pessoal` será referência interna sem saldo.

Não será conta financeira.

---

# 6. Lançamento financeiro

## 6.1 Responsabilidade

O lançamento será a raiz de agregado do fato financeiro.

Ele deverá registrar:

- usuário;
- identificador global;
- tipo do lançamento;
- especialização financeira;
- valor do fato em centavos;
- moeda;
- descrição;
- data operacional;
- competência, quando aplicável;
- timezone efetivo;
- categoria;
- origem financeira;
- natureza;
- comportamento;
- escopo;
- veículo opcional;
- jornada opcional;
- estado econômico;
- timestamps técnicos.

## 6.2 Estado econômico

O estado econômico pertence ao lançamento e não aos movimentos.

Conceitualmente, deverá distinguir:

- rascunho;
- confirmado;
- cancelado;
- corrigido.

Os nomes físicos e transições definitivas serão formalizados antes do módulo financeiro.

Um lançamento rascunho não possuirá movimentos postados.

A confirmação criará todos os movimentos obrigatórios na mesma transação.

## 6.3 Movimentos não possuem validade mutável

Movimento postado será imutável.

Não haverá:

- estado `cancelado` no movimento;
- campo `válido` editável;
- remoção do movimento do saldo;
- alteração de conta, direção, valor ou lançamento.

Um movimento postado sempre integrará o saldo.

Sua neutralização ocorrerá somente por movimento de reversão.

## 6.4 Especialização única

O lançamento possuirá um único discriminador de especialização.

Exemplos:

- nenhuma especialização;
- transferência;
- retirada;
- ajuste;
- receita individual;
- fechamento diário;
- abastecimento;
- manutenção;
- documento.

A especialização será representada por registro dependente 1:0..1 com a mesma identidade lógica do lançamento.

A combinação abaixo será única:

```text
user_id + lançamento_id + tipo_de_especialização
```

A tabela de cada detalhe possuirá uma constante conceitual de tipo e foreign key composta para o lançamento e seu discriminador.

Isso impedirá que o mesmo lançamento seja simultaneamente:

- abastecimento e manutenção;
- transferência e retirada;
- receita individual e fechamento;
- qualquer outra combinação incompatível.

## 6.5 Lançamento sem especialização

Receitas e despesas genéricas poderão não possuir especialização.

Taxa de transferência será despesa comum vinculada à transferência, e não parte dos dois movimentos da transferência.

---

# 7. Matriz de invariantes financeiras

| Tipo de lançamento | Quantidade de movimentos | Direção | Contas | Regra de valor |
|---|---:|---|---|---|
| Receita | Exatamente 1 | Crédito | Uma conta | Movimento igual ao valor do lançamento |
| Despesa | Exatamente 1 | Débito | Uma conta | Movimento igual ao valor do lançamento |
| Abertura positiva | Exatamente 1 | Crédito | Conta aberta | Movimento igual ao valor do lançamento |
| Abertura negativa | Exatamente 1 | Débito | Conta aberta | Movimento igual ao valor absoluto |
| Retirada pessoal | Exatamente 1 | Débito | Conta de origem | Movimento igual ao valor do lançamento |
| Ajuste positivo | Exatamente 1 | Crédito | Conta ajustada | Movimento igual à diferença |
| Ajuste negativo | Exatamente 1 | Débito | Conta ajustada | Movimento igual ao valor absoluto da diferença |
| Transferência | Exatamente 2 | Um débito e um crédito | Contas diferentes | Ambos iguais ao valor do lançamento |
| Reversão | Exatamente a mesma quantidade do original | Oposta a cada movimento original | Mesmas contas originais | Igual a cada movimento original |
| Taxa | Exatamente 1 | Débito | Conta pagadora | Movimento igual ao valor da taxa |

Regras adicionais:

- todo movimento terá valor estritamente positivo;
- direção representará o sinal;
- transferência será balanceada antes do commit;
- taxa não integrará o lançamento da transferência;
- reversão referenciará cada movimento original;
- um movimento original poderá ser revertido uma única vez;
- lançamento confirmado somente existirá após todos os movimentos exigidos terem sido postados;
- nenhuma confirmação parcial será permitida.

---

# 8. Movimentos de conta

Cada movimento registrará:

- usuário;
- identificador global;
- lançamento;
- conta;
- direção;
- valor positivo em centavos;
- timestamp de postagem em UTC;
- `correlationId`;
- movimento original, quando for reversão;
- timestamps técnicos imutáveis.

O movimento não possuirá data operacional própria.

A data operacional será obtida do lançamento.

Constraints diretas:

- conta obrigatória;
- lançamento obrigatório;
- valor maior que zero;
- direção obrigatória;
- ownership composto;
- foreign keys com `RESTRICT/NO ACTION`;
- movimento original obrigatório em reversão;
- conta da reversão igual à conta original;
- valor da reversão igual ao original;
- direção oposta ao original.

Invariantes entre múltiplos movimentos serão garantidas pelo caso de uso dentro da transação.

---

# 9. Transferências, retiradas e ajustes

## 9.1 Transferência

Transferência será detalhe 1:1 de um lançamento do tipo transferência.

Deverá registrar:

- lançamento;
- conta de origem;
- conta de destino;
- movimento de débito;
- movimento de crédito;
- lançamento de taxa opcional.

Constraints:

- origem e destino diferentes;
- exatamente dois movimentos;
- mesmo usuário em todas as relações;
- débito na origem;
- crédito no destino;
- valores iguais;
- valor igual ao lançamento;
- movimentos criados na mesma transação;
- taxa em lançamento separado de despesa.

## 9.2 Retirada pessoal

Retirada será detalhe 1:1 de lançamento do tipo retirada.

Deverá registrar:

- lançamento;
- conta de origem;
- destino externo `Uso pessoal`;
- movimento de débito.

Não possuirá estado financeiro próprio.

## 9.3 Ajuste de saldo

Ajuste será detalhe 1:1 de lançamento do tipo ajuste.

Deverá registrar:

- lançamento;
- conta;
- saldo derivado anterior;
- saldo informado;
- diferença;
- motivo;
- movimento resultante.

O saldo não será alterado diretamente.

---

# 10. Reversão e correção

## 10.1 Reversão

Reversão e correção utilizarão relações diferentes.

Um lançamento de reversão possuirá:

- `reverses_entry_id`;
- vínculo com o lançamento original;
- movimentos opostos aos movimentos originais;
- `correlationId`;
- motivo.

A relação de reversão será única por lançamento original enquanto vigente.

Cada movimento de reversão referenciará exatamente um movimento original.

## 10.2 Cancelamento

Cancelamento financeiro executará:

1. validar lançamento confirmado;
2. criar lançamento de reversão;
3. criar movimentos opostos;
4. marcar o estado econômico do original como cancelado;
5. registrar auditoria;
6. concluir tudo na mesma transação.

O lançamento original permanecerá no histórico.

Seus movimentos continuarão integrando o saldo e serão neutralizados pelos movimentos de reversão.

## 10.3 Correção

Correção material executará:

1. identificar o lançamento vigente;
2. criar reversão do lançamento vigente;
3. criar novo lançamento substituto;
4. criar os movimentos do substituto;
5. registrar `corrects_entry_id` no substituto;
6. marcar o lançamento anterior como corrigido;
7. compartilhar o mesmo `correlationId`;
8. registrar auditoria;
9. concluir tudo atomicamente.

## 10.4 Cadeia de correção

A relação `corrects_entry_id` apontará para o lançamento imediatamente substituído.

Regras:

- um lançamento poderá ser corrigido por no máximo um substituto direto;
- um substituto poderá corrigir exatamente um lançamento;
- ciclos serão proibidos;
- nova correção atuará sobre o último lançamento vigente;
- reversão e correção não utilizarão a mesma relação;
- lançamento cancelado não poderá receber correção;
- lançamento corrigido não voltará a confirmado.

---

# 11. Receitas e cobertura diária

## 11.1 Dia de cobertura

Será criada uma raiz lógica de dia de cobertura identificada por:

- usuário;
- origem da receita;
- data operacional.

A combinação será única:

```text
user_id + origem_id + data_operacional
```

O dia de cobertura registrará o escopo escolhido:

- consolidado;
- por veículo.

Uma vez confirmado o primeiro registro, o escopo não poderá ser alterado sem cancelamento ou correção dos registros existentes.

## 11.2 Cobertura normalizada

Cada cobertura pertencerá a um dia de cobertura.

A chave normalizada será obrigatória e nunca nula:

```text
ALL
```

para cobertura consolidada; ou:

```text
VEHICLE:<identificador global do veículo>
```

para cobertura por veículo.

A combinação será única:

```text
dia_de_cobertura_id + chave_normalizada
```

Checks conceituais:

- chave `ALL` exige escopo consolidado e veículo ausente;
- chave `VEHICLE:<id>` exige escopo por veículo e veículo correspondente;
- ownership do veículo deve coincidir com o dia de cobertura.

## 11.3 Modo da cobertura

Cada cobertura possuirá exatamente um modo:

- receitas individuais;
- fechamento diário.

O modo não poderá ser alterado depois da confirmação de qualquer lançamento.

## 11.4 Receita individual

Receita individual será especialização 1:1 de lançamento de receita.

Várias receitas individuais poderão pertencer à mesma cobertura em modo individual.

## 11.5 Fechamento diário

Fechamento diário será especialização 1:1 de um lançamento de receita.

Uma cobertura em modo fechamento possuirá exatamente um fechamento vigente.

Bônus, gorjetas e promoções serão componentes dependentes do fechamento e não produzirão novos lançamentos automaticamente.

## 11.6 Sequência transacional

A criação ou confirmação seguirá obrigatoriamente:

1. iniciar transação de escrita;
2. localizar ou criar o dia de cobertura pela chave única;
3. validar ou definir o escopo do dia;
4. construir a chave normalizada;
5. localizar ou criar a cobertura;
6. validar que o modo solicitado coincide com o modo existente;
7. verificar registros confirmados ou em confirmação;
8. criar o lançamento em estado de confirmação;
9. criar sua especialização financeira;
10. criar o movimento de crédito;
11. registrar componentes, quando houver;
12. registrar auditoria;
13. confirmar lançamento;
14. realizar commit.

Em caso de conflito de unicidade, a operação relerá o dia e a cobertura dentro da transação e retornará conflito de negócio.

Nenhuma verificação exclusiva da interface será considerada suficiente.

---

# 12. Jornadas

A jornada pertencerá a um usuário e a um veículo.

Registrará:

- identificador global;
- usuário;
- veículo;
- data operacional;
- início UTC;
- fim UTC;
- timezone efetivo;
- evento de odômetro inicial;
- evento de odômetro final;
- estado próprio;
- motivo de correção ou cancelamento;
- timestamps técnicos.

Pausas serão dependentes da jornada.

O modelo permanecerá compatível com decisões futuras sobre:

- meia-noite;
- sobreposição;
- quantidade de jornadas abertas.

A jornada não será apontada por relação polimórfica no odômetro. Ela referenciará explicitamente os eventos de odômetro.

---

# 13. Abastecimentos e consumo

## 13.1 Abastecimento confirmado

Todo abastecimento confirmado no MVP deverá possuir obrigatoriamente:

- usuário;
- veículo;
- lançamento financeiro do tipo despesa;
- especialização financeira exclusiva de abastecimento;
- exatamente um movimento de débito;
- conta obtida pelo movimento;
- evento de odômetro;
- data operacional;
- volume;
- preço unitário;
- tanque cheio ou parcial.

Não será permitido abastecimento confirmado sem lançamento e movimento.

Se futuramente forem necessários abastecimentos gratuitos, bonificados ou sem pagamento, isso exigirá nova regra de negócio.

## 13.2 Valor financeiro

O total pago será exclusivamente o valor do lançamento financeiro.

O abastecimento não armazenará segundo total financeiro autoritativo.

## 13.3 Volume e preço

Litros serão representados como quantidade inteira de mililitros.

Preço por litro será representado como quantidade inteira de milésimos de Real por litro.

Não será usado ponto flutuante.

## 13.4 Consumo

O consumo oficial será calculado a partir dos abastecimentos válidos e confirmados.

O ciclo não será fonte primária persistida.

Uma projeção reconstruível poderá existir futuramente.

Correção ou cancelamento financeiro do abastecimento deverá invalidar o abastecimento para o cálculo de consumo, preservando todo o histórico.

---

# 14. Manutenções

## 14.1 Plano

O plano registrará:

- usuário;
- veículo;
- componente;
- intervalo por KM;
- intervalo por tempo;
- tolerâncias;
- base inicial;
- estado próprio.

## 14.2 Evento

O evento de manutenção será raiz própria porque poderá existir sem custo financeiro.

Registrará:

- usuário;
- veículo;
- plano opcional;
- componente;
- data operacional;
- evento de odômetro;
- fornecedor;
- descrição;
- observações;
- estado próprio.

## 14.3 Vínculo financeiro

Quando houver custo, será criado um lançamento de despesa e uma especialização financeira de manutenção.

Essa especialização:

- compartilhará a identidade financeira do lançamento;
- referenciará exatamente um evento de manutenção;
- será única para o evento;
- impedirá o lançamento de possuir outra especialização incompatível.

O custo será obtido exclusivamente do lançamento.

---

# 15. Documentos e obrigações

Documento ou obrigação representará:

- seguro;
- IPVA;
- licenciamento;
- multa.

Registrará:

- usuário;
- veículo;
- tipo;
- referência;
- exercício ou período;
- vencimento;
- valor nominal ou previsto, quando conhecido;
- estado de negócio;
- observações;
- timestamps técnicos.

## 15.1 Valor nominal

O valor nominal:

- representa a obrigação conhecida ou prevista;
- não altera saldo;
- não representa pagamento;
- não será usado como movimento financeiro;
- poderá diferir do valor efetivamente quitado.

## 15.2 Valor pago

Todo pagamento será representado exclusivamente por:

- lançamento financeiro;
- movimento de débito;
- especialização financeira de documento;
- vínculo explícito com o documento.

O valor efetivamente pago será obtido do lançamento.

No MVP, o modelo poderá limitar a uma quitação financeira por obrigação conforme regra aprovada. Pagamentos parciais futuros exigirão evolução do modelo.

O impacto de multas no resultado operacional permanecerá pendente.

---

# 16. Metas

Metas serão opcionais.

O modelo deverá suportar:

- diárias;
- semanais;
- mensais;
- financeiras;
- operacionais;
- unidade;
- valor-alvo;
- início;
- fim;
- veículo opcional;
- estado conceitual.

O progresso será derivado.

Enums e fórmulas pendentes não serão congelados antes da decisão do Grupo B.

---

# 17. Alertas

Alertas determinísticos registrarão:

- usuário;
- regra;
- tipo de origem;
- identificador lógico da origem;
- veículo opcional;
- severidade;
- mensagem;
- contexto;
- instante;
- condição observada;
- limite;
- estado conceitual.

A origem genérica do alerta não será apresentada como foreign key garantida pelo SQLite.

A consistência dessa referência será responsabilidade do caso de uso até que vínculos tipados sejam definidos para cada origem aprovada.

Os estados detalhados continuarão provisórios.

---

# 18. Auditoria

O log append-only registrará:

- usuário proprietário, quando aplicável;
- entidade;
- identificador da entidade;
- ação;
- ator;
- timestamp UTC;
- data operacional, quando aplicável;
- valores anteriores;
- valores posteriores;
- motivo;
- `correlationId`;
- origem;
- versão técnica.

Valores anteriores e posteriores serão documentos JSON versionados.

A referência textual à entidade auditada não será tratada como foreign key polimórfica.

A auditoria deverá sobreviver ao ciclo de vida da entidade correspondente.

Não haverá operação comum de edição ou exclusão da auditoria.

A auditoria não produzirá auditoria sobre si própria.

---

# 19. Estados e enums

## 19.1 Conceitos aprovados

- crédito e débito;
- receita;
- despesa;
- transferência;
- retirada;
- ajuste;
- abertura;
- reversão;
- operacional, pessoal e patrimonial;
- fixo e variável;
- consolidado e por veículo;
- individual e fechamento;
- tanque cheio e parcial.

## 19.2 Estados econômicos e contábeis

O lançamento terá estado econômico próprio.

Movimento postado não terá estado econômico e não será cancelado.

A existência de movimento de reversão será um fato adicional, não uma alteração do movimento original.

## 19.3 Estados provisórios

Continuarão provisórios:

- jornadas;
- contas;
- veículos;
- metas;
- alertas;
- planos;
- eventos de manutenção;
- documentos.

## 19.4 Condições derivadas

Não serão estados persistidos:

- vencido;
- a vencer;
- em dia;
- saldo positivo ou negativo;
- meta concluída por cálculo;
- manutenção atrasada;
- consumo disponível.

---

# 20. Cardinalidades

| Entidade A | Relação | Entidade B | Cardinalidade | Exclusão |
|---|---|---|---|---|
| Usuário | possui | Configuração | 1:1 | `RESTRICT` |
| Usuário | possui | Conta | 1:N | `RESTRICT` |
| Configuração | referencia | Conta padrão | 0..1:1 | `RESTRICT` |
| Usuário | possui | Veículo | 1:N | `RESTRICT` |
| Configuração | referencia | Veículo ativo | 0..1:1 | `RESTRICT` |
| Veículo | possui | Evento de odômetro | 1:N | `RESTRICT` |
| Evento de odômetro | possui | Revisão | 1:N | `RESTRICT` |
| Revisão | substitui | Revisão anterior | 0..1:1 | `RESTRICT` |
| Troca de painel | referencia | Dois eventos de odômetro | 1:2 | `RESTRICT` |
| Usuário | possui | Lançamento | 1:N | `RESTRICT` |
| Lançamento confirmado | produz | Movimento | Conforme matriz | `RESTRICT` |
| Lançamento | possui | Especialização | 1:0..1 | `RESTRICT` |
| Transferência | referencia | Movimentos | 1:2 | `RESTRICT` |
| Lançamento de reversão | reverte | Lançamento original | N:1, único vigente | `RESTRICT` |
| Movimento de reversão | reverte | Movimento original | 1:1 | `RESTRICT` |
| Lançamento substituto | corrige | Lançamento anterior | 0..1:1 | `RESTRICT` |
| Dia de cobertura | possui | Cobertura | 1:N | `RESTRICT` |
| Cobertura individual | possui | Receita individual | 1:N | `RESTRICT` |
| Cobertura de fechamento | possui | Fechamento | 1:1 | `RESTRICT` |
| Jornada | referencia | Veículo | N:1 | `RESTRICT` |
| Jornada | possui | Pausa | 1:N | `RESTRICT` |
| Abastecimento | compartilha identidade com | Lançamento | 1:1 | `RESTRICT` |
| Manutenção com custo | referencia | Lançamento | 0..1:1 | `RESTRICT` |
| Documento quitado | referencia | Lançamento | 0..1:1 no MVP | `RESTRICT` |
| Meta | pertence | Usuário | N:1 | `RESTRICT` |
| Auditoria | identifica logicamente | Entidade | N:1 lógico | Sem foreign key |

---

# 21. Constraints

## 21.1 Garantidas pelo SQLite

- `NOT NULL`;
- valores positivos;
- foreign keys;
- ownership composto;
- unicidade;
- um detalhe de especialização por lançamento;
- um lançamento por detalhe especializado;
- revisão única por número;
- uma substituição direta por revisão;
- uma correção direta por lançamento;
- uma reversão vigente por lançamento;
- chave única de dia de cobertura;
- chave normalizada única por cobertura;
- origem e destino diferentes;
- relações com `RESTRICT/NO ACTION`.

## 21.2 Garantidas por transação e caso de uso

- quantidade de movimentos por tipo;
- soma e balanceamento de movimentos;
- confirmação completa;
- cobertura consolidada versus por veículo;
- sequência de criação de receita;
- monotonicidade da quilometragem efetiva;
- cadeia acíclica de correções;
- criação de todas as reversões;
- troca de veículo ativo;
- consistência entre detalhe especializado e lançamento;
- cancelamento conjunto;
- auditoria obrigatória.

SQLite não utilizará `CHECK` com subconsultas para invariantes entre linhas ou tabelas.

---

# 22. Índices

Índices principais:

- usuário e data operacional do lançamento;
- usuário, estado econômico e data operacional;
- conta, postagem e identificador do movimento;
- lançamento nos movimentos;
- `correlationId`;
- veículo, instante efetivo e identificador do evento de odômetro;
- evento de odômetro e número da revisão;
- revisão substituída;
- origem, data e usuário no dia de cobertura;
- dia de cobertura e chave normalizada;
- jornada e período;
- documento e vencimento;
- plano, veículo e estado;
- meta, usuário e período;
- alerta, usuário e estado;
- auditoria por entidade;
- auditoria por `correlationId`.

Toda foreign key de alta utilização deverá possuir índice compatível.

A lista final será validada contra consultas e testes de volume.

---

# 23. Dados derivados

Serão derivados:

- saldo;
- KM atual;
- leitura vigente de cada evento;
- vencido ou a vencer;
- progresso de meta;
- resultado operacional;
- fluxo de caixa;
- indicadores;
- próximo vencimento;
- consumo;
- horas trabalhadas;
- quilômetros operacionais.

Projeções não poderão ser editadas nem substituir dados canônicos.

---

# 24. Transações obrigatórias

Exigirão transação:

- confirmação de lançamento e movimentos;
- transferência;
- retirada;
- ajuste;
- abertura;
- cancelamento e reversão;
- correção, reversão e substituição;
- criação do dia e cobertura de receita;
- receita individual;
- fechamento diário;
- troca de veículo ativo;
- criação de evento e revisão de odômetro;
- correção de odômetro;
- troca de painel;
- abastecimento e lançamento;
- manutenção e lançamento;
- quitação de documento;
- auditoria obrigatória;
- restauração;
- migration, quando tecnicamente suportado.

---

# 25. Estratégia de migrations

## 25.1 Primeira migration

A primeira migration deverá conter somente entidades fundacionais aprovadas:

- metadados técnicos;
- usuário;
- configurações;
- dados de referência indispensáveis;
- auditoria;
- infraestrutura necessária a ownership e identificadores.

As entidades dos módulos verticais serão adicionadas conforme o roadmap.

## 25.2 Identificadores

A infraestrutura de UUID versão 7 ou equivalente deverá estar definida antes da primeira migration.

Não será utilizado autoincremento como identidade de domínio.

## 25.3 Seeds

Seeds serão:

- determinísticos;
- idempotentes;
- versionados;
- restritos a referências internas.

Não criarão conta, veículo, meta, saldo ou lançamento fictício.

## 25.4 Falha

Falha de migration deverá:

- preservar o banco anterior;
- impedir uso parcial;
- produzir diagnóstico compreensível;
- permitir restauração;
- não remover dados históricos.

---

# 26. Modelo textual

```text
Usuário
├── Configurações
│   ├── Conta padrão
│   └── Veículo ativo
├── Contas
│   └── Movimentos imutáveis
├── Veículos
│   ├── Eventos de odômetro
│   │   └── Revisões append-only
│   ├── Trocas de painel
│   ├── Jornadas
│   │   └── Pausas
│   ├── Planos de manutenção
│   ├── Eventos de manutenção
│   └── Documentos
├── Lançamentos financeiros
│   ├── Movimentos
│   ├── Reversão → lançamento original
│   ├── Correção → lançamento substituído
│   └── Especialização exclusiva
│       ├── Transferência
│       ├── Retirada
│       ├── Ajuste
│       ├── Receita individual
│       ├── Fechamento
│       ├── Abastecimento
│       ├── Manutenção financeira
│       └── Documento financeiro
├── Dias de cobertura de receita
│   └── Coberturas normalizadas
│       ├── Receitas individuais
│       └── Fechamento diário
├── Metas
├── Alertas
└── Auditoria
```

---

# 27. Dicionário lógico resumido

## 27.1 Campos comuns

| Campo | Tipo lógico | Obrigatório | Regra |
|---|---|---:|---|
| ID | UUID global | Sim | Gerado pela aplicação e imutável |
| `user_id` | UUID global | Em entidades do usuário | Participa das relações compostas |
| Criado em | Instante UTC | Sim | Imutável |
| Atualizado em | Instante UTC | Quando mutável | Não substitui auditoria |
| Data operacional | Data civil | Conforme entidade | Separada de timestamp |
| Timezone efetivo | IANA timezone | Quando necessário | Preserva interpretação histórica |
| Motivo | Texto | Quando exigido | Cancelamento, correção ou ajuste |

## 27.2 Lançamento e movimento

| Campo | Entidade | Tipo | Regra |
|---|---|---|---|
| Tipo | Lançamento | Enum conceitual | Determina matriz de movimentos |
| Especialização | Lançamento | Discriminador | No máximo uma |
| Valor | Lançamento | Centavos | Valor do fato |
| Estado econômico | Lançamento | Estado próprio | Não controla validade de movimento |
| `reverses_entry_id` | Reversão | UUID | Relação exclusiva de reversão |
| `corrects_entry_id` | Substituto | UUID | Relação exclusiva de correção |
| Conta | Movimento | UUID | Ownership composto |
| Direção | Movimento | Crédito/débito | Representa o sinal |
| Valor | Movimento | Centavos positivos | Nunca negativo ou zero |
| Postagem | Movimento | Instante UTC | Sem data operacional duplicada |
| Movimento original | Reversão | UUID | Obrigatório |

## 27.3 Odômetro

| Campo | Entidade | Tipo | Regra |
|---|---|---|---|
| Instante efetivo | Evento | UTC | Primeira chave de ordenação |
| ID global | Evento | UUID | Desempate determinístico |
| Número da revisão | Revisão | Inteiro positivo | Único por evento |
| Leitura exibida | Revisão | Inteiro escalado | Não negativa |
| KM efetivo | Revisão | Inteiro escalado | Monotônico |
| Revisão substituída | Revisão | UUID | Uma substituição direta |
| Motivo | Revisão | Texto | Obrigatório em correção |

## 27.4 Cobertura de receita

| Campo | Entidade | Tipo | Regra |
|---|---|---|---|
| Origem | Dia de cobertura | UUID | Parte da chave única |
| Data operacional | Dia de cobertura | Data | Parte da chave única |
| Escopo do dia | Dia de cobertura | Enum | Consolidado ou por veículo |
| Chave normalizada | Cobertura | Texto controlado | Nunca nula |
| Veículo | Cobertura | UUID opcional | Coerente com a chave |
| Modo | Cobertura | Enum | Individual ou fechamento |

## 27.5 Especializações financeiras

| Especialização | Campos próprios essenciais |
|---|---|
| Transferência | origem, destino, débito, crédito, taxa opcional |
| Retirada | origem, destino externo, débito |
| Ajuste | conta, saldo anterior, saldo informado, diferença |
| Receita individual | cobertura |
| Fechamento | cobertura e componentes |
| Abastecimento | veículo, evento de odômetro, volume, preço, tanque |
| Manutenção financeira | evento de manutenção |
| Documento financeiro | documento ou obrigação |

---

# 28. Entidades futuras e decisões pendentes

## 28.1 Entidades futuras

Não pertencem ao schema inicial:

- ativos;
- passivos;
- avaliações patrimoniais;
- financiamentos completos;
- investimentos;
- posições;
- reserva;
- previsões;
- simulações;
- identidade remota;
- sincronização;
- conflitos;
- tombstones;
- integrações bancárias.

## 28.2 Bloqueiam a primeira migration

- aprovação deste modelo lógico;
- confirmação da representação física do UUID global;
- representação física de datas UTC e datas civis;
- representação física do JSON de auditoria;
- estratégia Prisma para foreign keys compostas de ownership;
- proteção técnica append-only da auditoria;
- processo de migration e restauração.

## 28.3 Bloqueiam módulos

- regras de jornadas atravessando meia-noite;
- jornadas sobrepostas;
- quantidade de jornadas abertas;
- permitir ou não zero veículos ativos;
- impacto operacional de multas;
- estados detalhados de alertas;
- estados e fórmulas de metas;
- tolerância entre litros, preço e total;
- competência e rateios do catálogo de cálculos.

---

# 29. Critérios de aceite

O modelo somente poderá ser aprovado quando:

- lançamentos e movimentos seguirem a matriz de invariantes;
- movimentos postados forem imutáveis;
- cancelamentos neutralizarem efeitos somente por reversão;
- estado econômico não for utilizado para apagar movimentos do saldo;
- cada lançamento possuir no máximo uma especialização;
- transferências possuírem exatamente dois movimentos balanceados;
- taxas forem lançamentos separados;
- ownership for protegido em todas as relações relevantes;
- cobertura de receita possuir chave normalizada não nula;
- a confirmação de receita for transacional;
- abastecimento confirmado sempre possuir lançamento e movimento;
- odômetro possuir ordem determinística;
- correções de odômetro forem append-only;
- relações polimórficas não forem apresentadas como foreign keys;
- reversão e correção utilizarem relações distintas;
- exclusões históricas utilizarem `RESTRICT/NO ACTION`;
- valor nominal de obrigação não for confundido com pagamento;
- identificadores forem globais e gerados pela aplicação;
- entidades futuras permanecerem fora do MVP.
