# CATÁLOGO DE CÁLCULOS DO RUMO — MVP 1.0

## Objetivo

Este documento define as fórmulas, fontes, períodos, filtros, critérios de disponibilidade, arredondamento e exemplos dos indicadores do MVP 1.0.

Em caso de conflito, prevalece a ordem documental definida na Decisão 032.

Este catálogo não representa contabilidade fiscal formal. Patrimônio completo, investimentos, previsões estatísticas, recomendações automáticas e inteligência financeira avançada permanecem fora do MVP.

---

# 1. Princípios dos cálculos

## 1.1 Fonte financeira canônica

O lançamento financeiro representa o fato econômico ou financeiro.

O movimento de conta representa seu efeito no saldo de uma conta.

Serão utilizadas as seguintes fontes:

- saldo e fluxo de caixa: exclusivamente movimentos de conta postados;
- resultado, receitas e despesas: lançamentos financeiros confirmados e economicamente vigentes;
- classificações e filtros: lançamento e seu detalhe especializado;
- KM e horas: jornadas válidas e revisões vigentes de odômetro;
- consumo: abastecimentos válidos vinculados ao lançamento financeiro;
- manutenção e documentos: entidades especializadas, sem duplicar seus lançamentos.

Detalhes de abastecimento, manutenção ou documento nunca produzirão um segundo valor financeiro.

## 1.2 Regime híbrido gerencial

O MVP separará:

- resultado operacional, reconhecido pela data operacional ou competência;
- fluxo de caixa, reconhecido pela postagem dos movimentos;
- saldo, reconstruído por todos os movimentos postados.

A data operacional e a postagem financeira poderão ser diferentes.

## 1.3 Valores monetários

Valores monetários canônicos serão inteiros em centavos.

Quantidades físicas e razões serão calculadas com inteiros escalados ou precisão decimal suficiente, sem ponto flutuante binário inadequado.

## 1.4 Data operacional e timezone

A data operacional será a data civil histórica atribuída ao fato.

O timezone efetivo preservado no registro será utilizado para interpretar instantes históricos. Alterar a preferência atual de timezone não reagrupará fatos anteriores.

## 1.5 Movimentos postados

Movimento postado é imutável e sempre participa do saldo.

Não existe movimento “cancelado” ou removido do saldo por mudança de estado do lançamento.

## 1.6 Lançamentos confirmados

Para indicadores econômicos, entra somente a versão economicamente vigente do fato:

- lançamento confirmado e não substituído;
- lançamento substituto confirmado em uma correção.

Não entram como novo fato econômico:

- lançamento cancelado;
- lançamento corrigido que já foi substituído;
- lançamento de reversão;
- movimentos de reversão considerados isoladamente.

## 1.7 Cancelamento, reversão e correção

Cancelamento invalida o fato de negócio, mas não apaga seus movimentos.

Quando o fato já produziu efeito financeiro, sua reversão cria movimentos opostos. O saldo considera original e reversão.

A correção material:

1. reverte o lançamento vigente anterior;
2. cria um lançamento substituto;
3. utiliza somente o substituto nos indicadores econômicos.

A reversão não é receita nem despesa.

## 1.8 Dados ausentes

Dado ausente não será convertido silenciosamente em zero.

O serviço de indicadores deverá retornar, no mínimo:

- valor, quando calculável;
- unidade;
- status;
- motivo do status;
- período e filtros;
- versão da fórmula.

## 1.9 Estados dos indicadores

- **Disponível:** cálculo completo com os dados exigidos.
- **Parcial:** há resultado calculável, mas parte conhecida do escopo não pôde ser incorporada.
- **Indisponível:** não há base suficiente ou o denominador é zero.
- **Não aplicável:** o indicador não faz sentido para o escopo solicitado.

## 1.10 Versionamento

Toda fórmula possuirá identificador e versão.

Mudanças capazes de alterar resultados exigirão nova versão, documentação e testes.

## 1.11 Arredondamento

Não haverá arredondamento intermediário, salvo regra expressa.

O arredondamento para exibição não alterará valores canônicos nem será reutilizado como entrada de outro cálculo.

---

# 2. Períodos

## 2.1 Dia

Um dia corresponde a uma data operacional civil:

```text
[data inicial, data inicial + 1 dia)
```

## 2.2 Semana

Recomenda-se que a semana comece na segunda-feira e termine imediatamente antes da segunda-feira seguinte.

Essa convenção é compatível com o uso brasileiro e evita semanas diferentes entre relatórios.

## 2.3 Mês

O mês corresponde a:

```text
[primeiro dia do mês, primeiro dia do mês seguinte)
```

## 2.4 Ano

O ano corresponde a:

```text
[1º de janeiro, 1º de janeiro do ano seguinte)
```

## 2.5 Intervalo personalizado

O usuário informará datas civis inicial e final inclusivas. Internamente, a consulta será normalizada para:

```text
[data inicial, dia seguinte à data final)
```

## 2.6 Limites

Intervalos serão fechados no início e abertos no fim. Isso evita dupla contagem nos limites entre períodos adjacentes.

## 2.7 Período econômico e financeiro

- receitas e despesas: data operacional ou competência aprovada;
- fluxo de caixa: timestamp de postagem;
- saldo em uma data: movimentos postados até o limite exclusivo solicitado;
- jornadas: data operacional, respeitada a futura decisão sobre meia-noite.

## 2.8 Jornadas atravessando meia-noite

A regra definitiva permanece pendente no Grupo B.

Até sua aprovação:

- a jornada não será dividida silenciosamente;
- jornadas encerradas permanecerão vinculadas à data operacional registrada;
- relatórios afetados serão marcados como parciais quando a classificação diária depender da decisão pendente;
- jornadas abertas não entrarão no total oficial de KM ou horas encerradas.

## 2.9 Períodos equivalentes

Para comparação:

- dia: dia civil anterior;
- semana: sete dias imediatamente anteriores;
- mês: mês civil anterior;
- ano: ano civil anterior;
- personalizado: intervalo anterior com a mesma quantidade de dias.

Filtros e versão da fórmula serão iguais nos dois períodos.

---

# 3. Saldo de conta

## 3.1 Fórmula oficial

```text
saldo =
soma dos créditos postados
-
soma dos débitos postados
```

## 3.2 Regras

Entram no saldo:

- movimentos originais;
- movimentos de abertura;
- transferências;
- retiradas;
- ajustes;
- taxas;
- movimentos de reversão.

O estado cancelado ou corrigido do lançamento não remove seus movimentos.

Um cancelamento com reversão resulta em efeito líquido zero porque o movimento original e o oposto continuam presentes.

## 3.3 Tipos

- **Saldo em uma data:** movimentos postados antes do limite final solicitado.
- **Saldo atual:** todos os movimentos postados até o instante da consulta.
- **Saldo consolidado:** soma dos saldos das contas incluídas no filtro.

Transferências internas alteram contas individuais, mas não o saldo consolidado. Taxas relacionadas alteram o consolidado porque são lançamentos separados.

Contas inativas permanecem nos saldos históricos. Sua inclusão no saldo atual consolidado deverá ser explícita no filtro.

---

# 4. Fluxo de caixa

## 4.1 Fórmulas

```text
entradas =
soma dos créditos postados no período
```

```text
saídas =
soma dos débitos postados no período
```

```text
fluxo líquido =
entradas - saídas
```

## 4.2 Visão por conta

A visão por conta apresenta todos os movimentos da conta, inclusive as pernas de transferências internas.

## 4.3 Visão consolidada

Na visão consolidada:

- as duas pernas de transferências entre contas incluídas serão neutralizadas;
- transferências não aumentarão entradas e saídas brutas consolidadas;
- taxas serão saídas externas;
- retiradas serão saídas externas identificadas separadamente;
- ajustes serão apresentados separadamente;
- reversões serão apresentadas no período em que foram postadas.

Se somente uma das contas da transferência estiver no filtro, o movimento será exibido na visão filtrada da conta, não como geração de receita ou despesa.

## 4.4 Retiradas

A retirada reduz o fluxo líquido total e o saldo, mas será apresentada em subtotal próprio. Não reduz o resultado operacional.

## 4.5 Exemplo

No período:

- receita creditada: R$ 420,00;
- combustível debitado: R$ 200,00;
- transferência interna: R$ 100,00;
- retirada: R$ 50,00;
- taxa: R$ 2,00.

Visão consolidada:

```text
Entradas externas: R$ 420,00
Saídas operacionais: R$ 202,00
Retiradas: R$ 50,00
Transferências internas: R$ 0,00
Fluxo líquido: R$ 168,00
```

A transferência não infla entradas ou saídas consolidadas.

---

# 5. Receita operacional

## 5.1 Composição

Entram lançamentos vigentes com:

- tipo receita;
- natureza operacional;
- data operacional dentro do período;
- cobertura válida.

Podem compor a receita:

- receitas individuais;
- fechamento diário;
- bônus;
- gorjetas;
- promoções;
- incentivos vinculados à atividade.

Receitas não operacionais não entram.

## 5.2 Exclusividade

Para a mesma cobertura, será usado:

- o total das receitas individuais; ou
- o fechamento diário.

Nunca os dois.

Componentes de bônus, gorjeta ou promoção contidos no fechamento não serão somados novamente.

## 5.3 Fórmula

```text
receita operacional =
soma dos lançamentos vigentes de receita operacional
no período e escopo
```

## 5.4 Cancelamento e correção

- receita cancelada: excluída do resultado;
- reversão: não é receita negativa;
- receita corrigida: somente o substituto vigente entra.

## 5.5 Filtros

Poderão ser aplicados:

- origem;
- veículo;
- jornada;
- período;
- conta, apenas como dimensão financeira.

Fechamento sem veículo entra na receita consolidada. Não entra em indicador específico de veículo e torna esse recorte parcial se houver receita não atribuída conhecida.

## 5.6 Exemplo

Em 13/07/2026:

- Uber: fechamento de R$ 300,00, incluindo R$ 20,00 de bônus;
- 99: fechamento de R$ 120,00.

```text
Receita operacional = 300 + 120 = R$ 420,00
```

O bônus não será somado novamente, portanto o resultado não será R$ 440,00.

---

# 6. Despesas operacionais variáveis

Entram lançamentos vigentes cuja classificação seja simultaneamente:

- tipo despesa;
- natureza operacional;
- comportamento variável;
- data operacional dentro do período;
- escopo compatível com os filtros.

Podem entrar, conforme classificação explícita:

- combustível;
- pedágio;
- estacionamento;
- lavagem;
- manutenção;
- alimentação operacional;
- taxas operacionais.

Não entram:

- despesas pessoais;
- retiradas;
- transferências;
- despesas patrimoniais;
- reversões;
- amortização de principal;
- fatos sem classificação suficiente.

Manutenção não é variável por categoria automaticamente. A classificação informada e validada será respeitada.

Alimentação somente entra quando sua natureza for operacional.

Multas e financiamentos não receberão classificação operacional definitiva antes das decisões do Grupo B. Enquanto pendentes, serão excluídos dos resultados operacionais e identificados como itens não classificados para esse cálculo.

---

# 7. Despesas operacionais fixas

## 7.1 Conceito

Despesa operacional fixa é custo operacional não diretamente proporcional ao volume diário de atividade.

Podem ser fixas:

- seguro;
- IPVA;
- licenciamento;
- impostos periódicos;
- manutenção contratual fixa;
- outras despesas recorrentes classificadas dessa forma.

## 7.2 Métodos possíveis

| Método | Vantagem | Limitação |
|---|---|---|
| Reconhecer integralmente na data operacional | Simples e auditável | Distorce o resultado do dia ou mês do pagamento |
| Apropriar mensalmente | Boa leitura gerencial mensal | Exige competência e regra para períodos menores |
| Ratear diariamente | Comparações diárias mais uniformes | Exige calendário, intervalo e tratamento de resíduos |
| Mostrar pago no caixa e apropriado no resultado | Separa liquidez e desempenho | Exige modelo explícito de apropriação |

## 7.3 Recomendação para o MVP

Recomenda-se o quarto método:

- o fluxo de caixa mostra o pagamento integral na data de postagem;
- o resultado reconhece o valor apropriado por competência;
- despesas mensais são apropriadas no mês de competência;
- despesas anuais são apropriadas em 12 parcelas mensais;
- para relatórios menores que um mês, a parcela mensal é rateada pelos dias civis do mês;
- eventuais resíduos de centavos são atribuídos determinística e cronologicamente às primeiras competências, sem alterar o total.

```text
despesa fixa apropriada no período =
soma das parcelas de competência que intersectam o período
```

Apropriação entre veículos não será presumida. Despesa de veículo pertence ao veículo informado. Despesa geral sem veículo entra apenas no consolidado até existir regra de alocação.

**Decisão necessária:** a política de competência e rateio deverá ser registrada em `12_DECISOES.md` antes da implementação do resultado operacional com despesas fixas.

---

# 8. Lucro bruto

```text
lucro bruto =
receita operacional
-
despesas operacionais variáveis
```

Numerador e subtraendo utilizarão o mesmo:

- usuário;
- período;
- veículo, quando filtrado;
- origem ou jornada, quando aplicável;
- versão de fórmula.

Não entram:

- despesas fixas;
- despesas pessoais;
- retiradas;
- transferências;
- despesas patrimoniais;
- multas sem decisão;
- principal de financiamento.

Cancelamentos são excluídos economicamente; reversões não são tratadas como receita ou despesa. Não haverá arredondamento antes da apresentação.

---

# 9. Resultado operacional

```text
resultado operacional =
receita operacional
-
despesas operacionais variáveis
-
despesas operacionais fixas apropriadas
```

Diferenças:

- **Lucro bruto:** não desconta despesas fixas.
- **Resultado operacional:** mede o desempenho da atividade após variáveis e fixas apropriadas.
- **Fluxo de caixa:** mede entradas e saídas postadas.
- **Saldo:** posição acumulada das contas.
- **Retirada pessoal:** uso dos recursos gerados; não é custo operacional.

Uma operação pode ter resultado positivo e fluxo de caixa negativo no mesmo período, por exemplo quando paga uma despesa anual integralmente, mas reconhece somente sua parcela mensal.

---

# 10. Lucro líquido gerencial

O indicador não deverá aparecer no dashboard inicial do MVP.

Ainda não há regras aprovadas suficientes para determinar de forma completa:

- receitas e despesas não operacionais;
- multas;
- juros e encargos;
- movimentações patrimoniais;
- financiamentos;
- demais componentes gerenciais.

Transferências, retiradas e movimentações patrimoniais não serão classificadas como receita ou despesa.

Até nova decisão, o dashboard utilizará “resultado operacional”, não “lucro líquido”.

---

# 11. Quilometragem operacional

```text
KM operacional =
soma do KM efetivo final
-
KM efetivo inicial
das jornadas válidas
```

Entram jornadas:

- encerradas;
- não canceladas;
- com revisões vigentes de odômetro;
- com KM final maior ou igual ao inicial;
- dentro do período e filtros.

Não entram jornadas abertas ou canceladas.

Jornada corrigida utiliza a revisão vigente. Troca de painel não causa regressão porque o cálculo usa KM efetivo contínuo.

A regra de jornadas sobrepostas permanece pendente. Se houver sobreposição histórica não resolvida, o indicador será parcial ou indisponível quando houver risco de dupla contagem.

Filtros por veículo incluem apenas jornadas daquele veículo.

---

# 12. Horas trabalhadas

```text
horas trabalhadas =
soma da duração das jornadas válidas
-
soma das pausas válidas
```

A unidade interna será milissegundo ou segundo inteiro. A apresentação será em horas e minutos; razões usarão horas decimais calculadas a partir da unidade interna, sem arredondamento prévio.

Entram apenas jornadas encerradas e não canceladas.

Pausa válida deve:

- possuir início e fim;
- estar contida na jornada;
- não se sobrepor a outra pausa.

Jornada com pausa incompleta não será considerada completa. Jornada aberta poderá ter prévia ao vivo separada, mas não integrará o total oficial.

Quando a soma de horas for zero, indicadores por hora serão indisponíveis.

A regra de meia-noite e sobreposição permanece pendente no Grupo B.

---

# 13. Receita por KM

```text
receita por KM =
receita operacional compatível
/
KM operacional
```

Receita e KM deverão compartilhar:

- usuário;
- período;
- veículo, quando filtrado;
- jornada, quando filtrada;
- demais dimensões capazes de alterar o escopo operacional.

Com KM zero, o indicador será indisponível, nunca R$ 0,00/KM.

No consolidado do período, receita sem jornada pode entrar porque a jornada é vínculo opcional. O indicador será identificado como parcial quando a ausência de vínculo impedir verificar a correspondência operacional.

Receita sem veículo:

- entra no consolidado;
- não entra em recorte específico de veículo;
- torna o recorte por veículo parcial se houver valor não atribuível conhecido.

---

# 14. Custo por KM

```text
custo por KM =
despesas operacionais consideradas
/
KM operacional compatível
```

Versões:

- **Custo variável por KM:** despesas operacionais variáveis ÷ KM.
- **Custo operacional total por KM:** variáveis + fixas apropriadas ÷ KM.
- **Combustível por KM:** combustível válido ÷ KM.
- **Manutenção por KM:** manutenção operacional válida ÷ KM.

Recomendação para o MVP:

- custo variável por KM: indicador principal;
- custo operacional total por KM: indicador principal após aprovação do rateio;
- combustível por KM: disponível quando o módulo de abastecimento existir;
- manutenção por KM: detalhamento opcional de relatório, não indicador obrigatório do dashboard inicial.

Despesa geral sem veículo entra no consolidado. Não será duplicada entre veículos. Em filtro de veículo, custos gerais não alocados serão excluídos e o indicador será marcado como parcial, com a descrição “não inclui despesas gerais sem veículo”.

---

# 15. Resultado por hora

```text
resultado por hora =
resultado operacional compatível
/
horas trabalhadas
```

Com horas iguais a zero, será indisponível.

No consolidado do período, receitas sem jornada e despesas fora de jornadas podem entrar no resultado, pois o indicador representa resultado total do período por hora trabalhada.

Com filtro de jornada, entram apenas fatos vinculados à jornada.

Com filtro de veículo:

- entram receitas e despesas atribuídas ao veículo;
- despesas gerais não alocadas ficam fora;
- receitas sem veículo ficam fora;
- o resultado será parcial quando existirem valores conhecidos não atribuíveis.

Dados incompletos de jornada tornam o indicador parcial ou indisponível conforme seja possível calcular um denominador confiável.

---

# 16. Consumo calculado

## 16.1 Fórmula

```text
consumo calculado =
KM efetivos percorridos
/
soma dos litros do ciclo
```

O ciclo começa em um abastecimento válido marcado como tanque cheio e termina no abastecimento cheio válido seguinte.

Não entram na soma os litros do primeiro tanque cheio. Entram:

- abastecimentos parciais posteriores;
- litros do tanque cheio final.

## 16.2 Exemplo

Primeiro tanque cheio:

- KM efetivo: 50.000;
- litros: 35,000 — não entram no ciclo seguinte.

Abastecimento parcial:

- KM efetivo: 50.250;
- litros: 20,000.

Segundo tanque cheio:

- KM efetivo: 50.600;
- litros: 30,000.

```text
Distância = 50.600 - 50.000 = 600 KM
Litros = 20 + 30 = 50 L
Consumo = 600 / 50 = 12,00 KM/L
```

## 16.3 Casos especiais

- primeiro tanque cheio sem marco anterior: inicia ciclo, mas não produz consumo;
- abastecimento parcial: acumula litros;
- segundo tanque cheio: encerra o ciclo;
- cancelamento: remove o abastecimento do ciclo econômico e recalcula os ciclos afetados;
- correção: usa a versão vigente e recalcula;
- troca de painel: usa KM efetivo;
- menos de dois marcos cheios: indicador indisponível;
- litros: armazenados em mililitros;
- arredondamento: somente na apresentação.

Se o cancelamento remover um marco cheio, os abastecimentos válidos serão reencadeados entre os marcos cheios válidos remanescentes.

---

# 17. Consumo informado

Consumo informado é o valor fornecido pelo computador de bordo ou digitado pelo usuário.

Deverá registrar:

- origem informada;
- unidade, inicialmente KM/L;
- período ou trecho ao qual se refere, quando conhecido;
- abastecimento relacionado, quando houver;
- precisão original preservada.

A interface deverá identificá-lo como “informado”, separadamente de “calculado pelo RUMO”.

É proibido:

- substituir silenciosamente o calculado pelo informado;
- calcular média silenciosa entre ambos;
- tratar divergência como correção automática.

---

# 18. Preço médio do combustível

Será utilizada média ponderada pelos litros:

```text
preço médio =
soma dos valores pagos
/
soma dos litros
```

Entram abastecimentos válidos do período e escopo. O valor pago vem do lançamento financeiro; os litros vêm do abastecimento.

Abastecimentos cancelados ou substituídos não entram. Com soma de litros zero, o indicador será indisponível.

A média simples dos preços unitários não será utilizada porque daria o mesmo peso a abastecimentos de volumes diferentes.

---

# 19. Custo de combustível por KM

```text
custo de combustível por KM =
despesas válidas de combustível
/
KM operacional do mesmo escopo
```

O período financeiro usa a data operacional das despesas. Isso é diferente do ciclo tanque cheio a tanque cheio, que usa dois marcos de abastecimento.

Compatibilidade:

- veículo: obrigatório e igual no numerador e denominador;
- período: igual;
- conta: pode filtrar pagamentos, mas não altera o veículo do denominador;
- jornada: somente será usada se os dois lados possuírem vínculo compatível.

Este indicador não deve ser apresentado como consumo. Consumo mede KM/L; custo de combustível por KM mede R$/KM.

---

# 20. Metas simples

O catálogo define apenas a matemática comum. Tipos, estados e transições continuam pendentes no Grupo B.

Podem existir metas:

- diárias;
- semanais;
- mensais;
- de receita;
- de resultado;
- operacionais simples.

```text
progresso percentual =
valor realizado
/
valor alvo
× 100
```

```text
valor restante =
máximo(0, valor alvo - valor realizado)
```

Regras:

- alvo deve ser maior que zero;
- meta excedida pode apresentar progresso acima de 100%;
- valor restante nunca será negativo;
- ausência de dados do realizado gera indicador indisponível, não zero;
- meta cancelada não produz progresso corrente;
- meta inativa não entra no dashboard;
- período e timezone seguem a data operacional histórica;
- registros cancelados não entram no realizado.

Nenhuma fórmula específica por tipo será congelada antes da decisão do Grupo B.

---

# 21. Alertas determinísticos

Exemplos de condições calculáveis:

```text
manutenção vencida por KM:
KM atual >= próximo KM previsto
```

```text
manutenção próxima por KM:
0 < próximo KM previsto - KM atual <= tolerância aprovada
```

```text
manutenção vencida por tempo:
data atual > vencimento
```

```text
documento próximo:
0 <= vencimento - data atual <= antecedência configurada
```

```text
documento vencido:
data atual > vencimento
```

Também poderão existir alertas para:

- jornada aberta por tempo excessivo, se aprovado;
- KM ou vencimento ausente;
- abastecimento sem litros, preço ou odômetro coerente;
- abastecimento cujo total diverge da tolerância aprovada.

Este documento não define estados, resolução, dispensa ou reabertura dos alertas.

---

# 22. Comparativos

```text
diferença absoluta =
valor atual - valor anterior
```

```text
variação percentual =
(valor atual - valor anterior)
/
valor absoluto do valor anterior
× 100
```

Regras:

- períodos devem ser equivalentes;
- filtros e versão da fórmula devem ser iguais;
- se anterior = 0 e atual = 0, variação percentual = 0%;
- se anterior = 0 e atual ≠ 0, a variação percentual é indisponível por base zero;
- não será exibido infinito;
- período atual ainda em andamento gera comparação parcial;
- se um dos lados for parcial, o comparativo também será parcial.

---

# 23. Indicadores indisponíveis e parciais

| Situação | Tratamento |
|---|---|
| Denominador zero | Indisponível |
| Jornada aberta | Excluída do total oficial; indicador parcial se estiver no escopo |
| KM ausente ou inválido | Indicadores por KM indisponíveis ou parciais |
| Receita sem veículo | Entra no consolidado; recorte por veículo parcial |
| Receita sem jornada | Entra no consolidado; recorte por jornada a exclui |
| Ciclo de abastecimento incompleto | Consumo calculado indisponível |
| Despesa sem classificação | Excluída do resultado classificado; resultado parcial |
| Registro cancelado | Excluído economicamente; movimentos permanecem no saldo |
| Registro corrigido | Usa somente o substituto vigente |
| Período em andamento | Parcial quando o indicador pressupõe período completo |

Diferenças:

- **Zero real:** há dados completos e o resultado matemático é zero.
- **Indisponível:** não é possível calcular com segurança.
- **Parcial:** existe valor útil, mas incompleto.
- **Não aplicável:** indicador não pertence ao contexto solicitado.

A interface não deverá representar indisponível como `0`, `R$ 0,00`, `0 KM/L` ou `0%`.

---

# 24. Arredondamento e apresentação

## 24.1 Método

Será utilizado arredondamento para o valor mais próximo, com empate afastando-se de zero.

Cálculos internos preservarão a razão exata ou precisão decimal suficiente.

## 24.2 Apresentação

| Grandeza | Apresentação padrão |
|---|---:|
| Dinheiro | 2 casas |
| KM | 1 casa, podendo omitir zero final |
| Horas | horas e minutos |
| KM/L | 2 casas |
| R$/KM | 2 casas |
| R$/hora | 2 casas |
| Percentual | 1 casa |
| Preço por litro | 3 casas |

Valores monetários já canônicos em centavos não serão recalculados a partir de valores formatados.

## 24.3 Tolerância de abastecimento

Recomendação:

```text
total esperado =
litros × preço por litro
```

Após conversão precisa para centavos, será aceita diferença máxima de R$ 0,01 em relação ao total pago.

Diferença maior não altera automaticamente o total canônico. O sistema deverá solicitar confirmação ou correção.

O total pago permanece autoritativo.

**Decisão necessária:** registrar a tolerância antes da implementação do módulo de abastecimentos.

---

# 25. Filtros e escopo

Todos os cálculos respeitarão o usuário proprietário.

Filtros possíveis:

- período;
- veículo;
- origem de receita;
- conta;
- categoria;
- jornada;
- natureza;
- comportamento;
- escopo.

Regras:

1. numerador e denominador devem usar períodos compatíveis;
2. filtro de veículo não pode incluir valor explicitamente pertencente a outro veículo;
3. valor sem veículo não será distribuído silenciosamente;
4. filtro de conta afeta saldo e fluxo diretamente, mas não redefine sozinho o escopo operacional;
5. natureza, comportamento, escopo e categoria são dimensões independentes;
6. filtros de jornada incluem somente fatos vinculados à jornada;
7. despesas gerais sem veículo entram no consolidado, não em cada veículo;
8. qualquer exclusão por ausência de vínculo relevante deverá produzir status parcial quando alterar a interpretação.

---

# 26. Versionamento das fórmulas

Cada fórmula deverá possuir:

- identificador estável, por exemplo `operational-result`;
- versão, por exemplo `1.0.0`;
- data de vigência;
- descrição;
- entradas;
- filtros;
- regra temporal;
- regra de arredondamento;
- tratamento de ausência;
- exemplos;
- testes automatizados.

Mudança de apresentação sem alteração matemática pode ser revisão documental. Mudança de resultado exige nova versão.

Projeções ou caches derivados deverão registrar a versão e ser reconstruíveis.

Relatórios básicos do MVP serão recalculados:

- usando uma única versão explicitamente selecionada para todo o relatório;
- usando a mesma versão nos dois períodos de um comparativo;
- exibindo a versão utilizada.

A versão vigente será o padrão para novas consultas. Versões anteriores deverão permanecer disponíveis para reprodução técnica de resultados históricos ou relatórios exportados que tenham registrado sua versão.

O sistema não misturará versões dentro de um mesmo comparativo.

---

# 27. Matriz de indicadores

| Indicador | Fórmula resumida | Fonte | Período | Filtros principais | Denominador | Sem dados | MVP | Dependências |
|---|---|---|---|---|---|---|---|---|
| Saldo | créditos − débitos | Movimentos | Até instante | usuário, conta | — | Zero real se sem movimentos | Sim | Financeiro |
| Fluxo líquido | entradas − saídas | Movimentos | Postagem | conta, período | — | Zero real | Sim | Financeiro |
| Receita operacional | soma das receitas vigentes | Lançamentos | Operacional | origem, veículo, jornada | — | Zero real | Sim | Receitas |
| Despesa variável | soma operacional variável | Lançamentos | Operacional | categoria, veículo | — | Zero ou parcial | Sim | Despesas |
| Despesa fixa apropriada | parcelas de competência | Lançamentos/apropriação | Competência | veículo, escopo | — | Zero ou parcial | Sim, após decisão | Rateio |
| Lucro bruto | receita − variável | Lançamentos | Operacional | mesmos filtros | — | Parcial conforme entradas | Sim | Receitas/despesas |
| Resultado operacional | receita − variável − fixa | Lançamentos | Operacional | mesmos filtros | — | Parcial | Sim | Rateio |
| KM operacional | Σ(KM final − inicial) | Jornadas/odômetro | Operacional | veículo | — | Zero ou parcial | Sim | Jornadas |
| Horas trabalhadas | duração − pausas | Jornadas | Operacional | veículo | — | Zero ou parcial | Sim | Jornadas |
| Receita/KM | receita ÷ KM | Receitas/jornadas | Operacional | veículo, jornada | KM | Indisponível | Sim | Receita e KM |
| Custo variável/KM | variável ÷ KM | Despesas/jornadas | Operacional | veículo | KM | Indisponível | Sim | Despesas e KM |
| Custo total/KM | custos totais ÷ KM | Despesas/jornadas | Operacional | veículo | KM | Indisponível | Sim, após rateio | Fixas e KM |
| Resultado/hora | resultado ÷ horas | Financeiro/jornadas | Operacional | veículo | Horas | Indisponível | Sim | Resultado e jornadas |
| Consumo calculado | KM do ciclo ÷ litros | Abastecimentos | Ciclo | veículo | Litros | Indisponível | Sim | Dois tanques cheios |
| Consumo informado | valor informado | Abastecimento | Informado | veículo | — | Indisponível | Sim | Dado manual |
| Preço médio | total ÷ litros | Abastecimentos | Operacional | veículo | Litros | Indisponível | Sim | Abastecimentos |
| Combustível/KM | custo combustível ÷ KM | Financeiro/jornadas | Operacional | veículo | KM | Indisponível | Sim | Abastecimentos/jornadas |
| Progresso de meta | realizado ÷ alvo | Meta + indicador | Meta | tipo, veículo | Alvo | Indisponível | Condicional | Grupo B |
| Comparativo | atual − anterior | Indicador base | Equivalente | mesmos filtros | Anterior | Base zero tratada | Sim | Indicador base |

Lucro líquido gerencial, patrimônio, rentabilidade, projeções, autonomia, consumo urbano e rodoviário não integram a matriz do MVP inicial.

---

# 28. Exemplos completos

## 28.1 Fechamento Uber e 99

- Uber: R$ 300,00;
- 99: R$ 120,00.

```text
Receita operacional = R$ 420,00
```

Receitas individuais conflitantes seriam bloqueadas.

## 28.2 Combustível

- total: R$ 200,00;
- litros: 40,000;
- veículo A;
- despesa variável operacional.

```text
Despesa variável de combustível = R$ 200,00
Preço do abastecimento = R$ 5,000/L
```

O detalhe de abastecimento não cria outra despesa.

## 28.3 Transferência

- Banco → Dinheiro;
- R$ 500,00.

```text
Banco: −R$ 500,00
Dinheiro: +R$ 500,00
Saldo consolidado: sem alteração
Receita e despesa: zero
```

## 28.4 Retirada

- Banco → Uso pessoal;
- R$ 150,00.

```text
Saldo bancário: −R$ 150,00
Fluxo líquido: −R$ 150,00
Resultado operacional: sem alteração
```

## 28.5 Cancelamento com reversão

Despesa original: R$ 80,00 de estacionamento.

- débito original: R$ 80,00;
- reversão: crédito de R$ 80,00.

```text
Efeito acumulado no saldo = R$ 0,00
Despesa operacional vigente = R$ 0,00
```

O estado cancelado não remove o débito original.

## 28.6 Jornada com pausa

- início: 08:00;
- fim: 18:00;
- pausa: 12:00–13:00;
- KM inicial: 50.000;
- KM final: 50.180.

```text
Duração total = 10 h
Pausa = 1 h
Horas trabalhadas = 9 h
KM operacional = 180 KM
```

## 28.7 Receita por KM

```text
Receita = R$ 420,00
KM = 180
Receita/KM = 420 / 180 = R$ 2,33/KM
```

O valor interno não é truncado em R$ 2,33 antes de outros cálculos.

## 28.8 Resultado por hora

- receita: R$ 420,00;
- despesas variáveis: R$ 200,00;
- fixas apropriadas: R$ 40,00;
- horas: 9.

```text
Resultado = 420 - 200 - 40 = R$ 180,00
Resultado/hora = 180 / 9 = R$ 20,00/h
```

## 28.9 Tanque cheio a tanque cheio

- primeiro cheio: 50.000 KM;
- parcial: 20 L;
- segundo cheio: 50.600 KM e 30 L.

```text
Consumo = 600 / 50 = 12,00 KM/L
```

## 28.10 Período sem dados

Sem lançamentos e sem jornadas:

- receita: R$ 0,00 — zero real;
- despesas: R$ 0,00 — zero real;
- saldo: conforme movimentos acumulados até a data;
- receita/KM: indisponível, pois KM = 0;
- resultado/hora: indisponível, pois horas = 0;
- consumo: indisponível.

## 28.11 Indicador parcial

No mês:

- receita atribuída ao veículo A: R$ 2.000,00;
- receita sem veículo: R$ 500,00;
- KM do veículo A: 1.000 KM.

No filtro do veículo A:

```text
Receita/KM calculada = 2.000 / 1.000 = R$ 2,00/KM
Status = parcial
Motivo = R$ 500,00 de receita do período sem veículo não foi alocada
```

## 28.12 Comparação com período anterior zero

Mês anterior: R$ 0,00.
Mês atual: R$ 1.000,00.

```text
Diferença absoluta = R$ 1.000,00
Variação percentual = indisponível
Motivo = período anterior com base zero
```

Não será exibido `∞%`.

---

# 29. Decisões necessárias

| Decisão | Recomendação | Classificação |
|---|---|---|
| Apropriação de despesas fixas | Caixa pelo pagamento e resultado por competência, com rateio mensal/diário | Bloqueia módulo financeiro |
| Tolerância entre litros, preço e total | R$ 0,01; divergência maior exige confirmação e não altera o total | Bloqueia módulo financeiro |
| Jornada atravessando meia-noite | Definir data operacional, divisão e duração máxima | Bloqueia dashboard |
| Jornadas sobrepostas e quantidade aberta | Definir bloqueio, exceções e tratamento histórico | Bloqueia dashboard |
| Fórmulas e estados específicos de metas | Aprovar antes do progresso por tipo | Bloqueia dashboard |
| Impacto de multas | Manter fora do resultado até decisão | Pode esperar |
| Principal, juros e encargos de financiamentos | Manter sem classificação definitiva no MVP | Pode esperar |
| Estados de alertas | Não bloqueiam a condição matemática, mas bloqueiam o módulo completo | Pode esperar |
| Permitir zero veículos ativos | Não bloqueia fórmulas consolidadas; afeta fluxos operacionais | Pode esperar |

Nenhuma dessas escolhas bloqueia a primeira migration fundacional descrita no modelo lógico. Algumas deverão ser resolvidas antes das migrations dos respectivos módulos verticais.

---

# 30. Critérios de aceite

Este catálogo somente poderá ser aprovado quando testes demonstrarem que:

- saldo é calculado exclusivamente por movimentos;
- cancelamento não neutraliza o mesmo efeito duas vezes;
- movimentos originais permanecem no saldo;
- transferências internas são neutralizadas no consolidado;
- retiradas não reduzem resultado operacional;
- receitas individuais e fechamentos não se sobrepõem;
- detalhes especializados não duplicam custos;
- numerador e denominador compartilham período e escopo compatíveis;
- divisão por zero retorna indisponível;
- consumo calculado e informado permanecem separados;
- arredondamento não altera dados canônicos;
- despesas gerais não são duplicadas entre veículos;
- correções usam somente o lançamento substituto no resultado;
- relatórios informam versão da fórmula;
- comparativos usam a mesma versão e filtros;
- zero real, indisponível, parcial e não aplicável são distinguíveis;
- cada fórmula possui exemplo e teste;
- nenhuma funcionalidade futura entra silenciosamente no MVP.

---

## Indicadores propostos para o MVP

- saldo por conta e consolidado;
- entradas, saídas e fluxo líquido;
- receita operacional;
- despesas operacionais variáveis;
- despesas fixas apropriadas, após decisão;
- lucro bruto;
- resultado operacional;
- KM operacional;
- horas trabalhadas;
- receita por KM;
- custo variável por KM;
- custo operacional total por KM, após decisão;
- resultado por hora;
- consumo calculado;
- consumo informado;
- preço médio ponderado do combustível;
- custo de combustível por KM;
- progresso de metas simples, após decisão do Grupo B;
- condições determinísticas de manutenção e documentos;
- comparativos entre períodos equivalentes.

Lucro líquido gerencial não é recomendado para o dashboard inicial.

## Decisões que bloqueiam a implementação

As decisões efetivamente bloqueadoras são:

1. competência e rateio de despesas fixas;
2. tolerância entre litros, preço e total;
3. jornadas atravessando meia-noite;
4. jornadas sobrepostas e quantidade de jornadas abertas;
5. fórmulas e estados dos tipos de metas.

Multas, financiamentos e estados detalhados de alertas não precisam bloquear o dashboard básico se forem explicitamente excluídos dos indicadores ainda não definidos.

## Pontos dependentes do Grupo B

- data operacional e eventual divisão de jornada na meia-noite;
- duração máxima e alerta de jornada aberta;
- sobreposição de jornadas;
- quantidade de jornadas abertas simultaneamente;
- impacto das multas no resultado;
- principal, juros e encargos de financiamentos;
- estados, ativação, alteração de alvo e conclusão de metas;
- estados, resolução, dispensa e reabertura de alertas;
- possibilidade de permanecer sem veículo ativo.

## Inconsistências encontradas em outros documentos

- `01_REQUISITOS.md` ainda solicita lucro líquido, ticket médio, receita por corrida, lucro por KM e custo por hora sem dados ou regras suficientes para todos esses indicadores.
- `03_FLUXOS.md` mantém metas e investimentos no primeiro acesso e atualiza patrimônio na rotina diária, contrariando o onboarding progressivo e o faseamento do patrimônio.
- O conteúdo anterior deste documento incluía patrimônio, investimentos, projeções, autonomia e consumos urbano/rodoviário, todos fora do escopo aprovado do MVP.
- `13_GLOSSARIO.md` define receita como “todo valor recebido”, sem separar receita operacional de não operacional, e define lucro de forma incompatível com a terminologia aprovada.
- `10_ROADMAP.md` exige decisões de meia-noite para concluir a Fase 0, mas essa decisão ainda permanece pendente.
- O roadmap inclui leitura, resolução e dispensa de alertas no MVP, enquanto suas regras detalhadas continuam pendentes.
- `14_PLANO_TECNICO_IMPLEMENTACAO.md` é uma análise anterior às Decisões 019–049 e ainda apresenta como abertas várias questões já resolvidas.
- O plano técnico menciona entidades e capacidades como corridas, parcelamentos e patrimônio que não pertencem necessariamente ao schema inicial aprovado.
- `05_DATABASE.md` permite distinguir data operacional e postagem, mas o agrupamento histórico do fluxo de caixa por timezone deverá ficar explícito na representação física para evitar reagrupamento após mudança de preferência.
