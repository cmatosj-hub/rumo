# REGRAS DE NEGÓCIO DO RUMO — MVP 1.0

## Objetivo

Este documento define as regras de negócio do MVP 1.0 do RUMO.

As regras aqui descritas devem ser interpretadas conforme a ordem de precedência documental estabelecida em `12_DECISOES.md`.

O RUMO é um ERP pessoal para gestão operacional e financeira de motoristas de aplicativo.

O MVP não representa sistema de contabilidade fiscal formal.

---

# 1. Princípios gerais

## 1.1 Funcionamento local

O MVP será um aplicativo desktop local-first para Windows.

Todas as funcionalidades do MVP deverão funcionar integralmente offline.

Não haverá autenticação remota, sincronização em nuvem, integração bancária ou aplicativo mobile no MVP.

## 1.2 Escopo por usuário

O MVP será monousuário na interface.

Será criado um perfil local proprietário dos dados.

As entidades relevantes deverão possuir vínculo com o usuário proprietário desde a primeira versão.

Todos os casos de uso deverão operar em contexto explícito de usuário.

Consultas e alterações deverão respeitar o proprietário dos dados.

A existência desse vínculo não implica suporte a múltiplos usuários ativos, autenticação remota ou sincronização no MVP.

## 1.3 Validação

Dados recebidos da interface nunca serão considerados confiáveis.

Toda operação deverá validar:

- usuário proprietário;
- estado atual do registro;
- transição solicitada;
- valores monetários;
- datas;
- contas;
- veículo;
- jornada;
- vínculos relacionados;
- duplicidades conhecidas;
- regras específicas do agregado.

Uma operação inválida não poderá produzir efeitos parciais.

Erros deverão ser apresentados de forma compreensível para o usuário.

## 1.4 Atomicidade

Operações compostas deverão ser atômicas.

Deverão ser concluídas integralmente ou revertidas integralmente:

- criação de lançamento e seus movimentos;
- transferências;
- retiradas;
- ajustes de saldo;
- correções financeiras;
- cancelamentos com reversão;
- criação de detalhe especializado e lançamento relacionado;
- troca de veículo ativo;
- restauração de backup.

## 1.5 Valores monetários

Valores monetários serão armazenados como números inteiros em centavos.

O MVP será monomoeda em Real brasileiro.

Alterações de preferência não poderão reinterpretar valores históricos.

Conversão cambial e movimentação financeira em múltiplas moedas não fazem parte do MVP.

O arredondamento ocorrerá somente no ponto definido pelo catálogo de cálculos.

## 1.6 Datas e horários

Timestamps técnicos serão armazenados em UTC.

O timezone efetivo utilizado no registro será preservado quando relevante.

A data operacional será preservada separadamente do timestamp técnico.

Alterações futuras no timezone do usuário não poderão modificar a data operacional histórica.

Agrupamentos diários utilizarão a data operacional.

Datas civis de vencimento poderão ser armazenadas sem horário quando não representarem um instante específico.

Conversões temporais relacionadas a regras de negócio serão centralizadas e não serão realizadas diretamente pela interface.

---

# 2. Integridade histórica

## 2.1 Proibição de exclusão física

Dados financeiros não poderão ser fisicamente excluídos pelos fluxos normais da aplicação.

Essa proibição inclui:

- lançamentos financeiros;
- movimentos de conta;
- transferências;
- retiradas;
- ajustes de saldo;
- reversões;
- abastecimentos com efeito financeiro;
- manutenções com efeito financeiro;
- documentos e obrigações com efeito financeiro;
- eventos de auditoria.

## 2.2 Preservação do histórico

Registros confirmados não poderão ser modificados silenciosamente.

Correções deverão preservar:

- valor anterior;
- valor posterior;
- motivo;
- ator;
- data e hora;
- operação relacionada.

Registros cancelados permanecerão consultáveis no histórico.

## 2.3 Estados

Cada agregado possuirá estados próprios.

Não existirá um status genérico com o mesmo significado para todas as entidades.

Os estados e transições específicos deverão ser definidos antes da implementação de cada agregado.

Registros cancelados não poderão voltar diretamente ao estado confirmado.

Quando for necessário recriar um fato cancelado, será criado um novo registro.

Estados derivados exclusivamente de datas, como `vencido`, `a vencer` e `em dia`, serão calculados e não persistidos como estados definitivos.

---

# 3. Regime financeiro

## 3.1 Modelo híbrido gerencial

O MVP utilizará regime híbrido gerencial.

Esse modelo separará:

- resultado operacional;
- fluxo de caixa;
- saldo das contas.

O modelo não representa contabilidade fiscal formal.

## 3.2 Resultado operacional

O resultado operacional será apurado pela data operacional ou competência do fato.

Receitas de aplicativos serão reconhecidas na data em que o trabalho ocorreu.

Despesas serão reconhecidas conforme as regras de competência, apropriação e rateio definidas no catálogo de cálculos.

## 3.3 Fluxo de caixa

O fluxo de caixa será apurado pelos movimentos de conta efetivamente postados.

Transferências internas serão neutralizadas na visão consolidada.

Retiradas pessoais serão apresentadas separadamente.

## 3.4 Saldo

O saldo será reconstruído exclusivamente a partir dos movimentos válidos da conta.

O sistema não dependerá de um campo de saldo editável manualmente.

## 3.5 Conta de aplicativo

Valores ainda mantidos por Uber, 99 ou outro aplicativo poderão ser representados em uma conta financeira do respectivo aplicativo.

O fechamento diário poderá creditar essa conta.

O repasse posterior para banco, carteira digital ou dinheiro físico será uma transferência interna.

---

# 4. Terminologia financeira

O catálogo formal de cálculos será mantido em `06_CALCULOS.md`.

Os termos oficiais iniciais são:

- receita operacional;
- despesa operacional variável;
- despesa operacional fixa;
- lucro bruto;
- resultado operacional;
- lucro líquido gerencial;
- fluxo de caixa;
- saldo.

## 4.1 Receita operacional

Valor gerado pela atividade de motorista conforme o regime financeiro aprovado.

## 4.2 Despesa operacional variável

Custo operacional cuja ocorrência ou valor varia com a atividade, conforme classificação aprovada.

## 4.3 Despesa operacional fixa

Custo operacional não diretamente proporcional ao volume diário da atividade.

## 4.4 Lucro bruto

Receita operacional menos despesas operacionais variáveis reconhecidas no mesmo escopo e período.

## 4.5 Resultado operacional

Considerará:

- receita operacional;
- despesas operacionais variáveis;
- despesas operacionais fixas;
- outros componentes operacionais expressamente definidos no catálogo de cálculos.

## 4.6 Lucro líquido gerencial

Considerará o resultado operacional e os componentes não operacionais definidos no catálogo de cálculos.

Não serão classificados como receita ou despesa:

- transferências internas;
- retiradas pessoais;
- movimentações patrimoniais;
- reversões.

## 4.7 Fluxo de caixa

Entradas menos saídas efetivamente postadas no período.

Na visão consolidada, transferências internas serão neutralizadas.

## 4.8 Saldo

Créditos menos débitos válidos de uma conta, incluindo:

- movimento de abertura;
- movimentos financeiros;
- ajustes;
- reversões.

As fórmulas completas, filtros, períodos, rateios, arredondamentos, tratamento de dados ausentes e exemplos serão definidos em `06_CALCULOS.md` antes da implementação dos indicadores.

---

# 5. Modelo financeiro canônico

## 5.1 Lançamento financeiro

Lançamento financeiro representa o fato econômico ou financeiro.

Exemplos:

- receita operacional;
- despesa;
- ajuste;
- transferência;
- retirada;
- taxa;
- reversão.

## 5.2 Movimento de conta

Movimento de conta representa o efeito de um lançamento sobre o saldo de uma conta.

Um movimento deverá possuir uma direção financeira:

- crédito;
- débito.

O valor do movimento será positivo. A direção determinará seu efeito no saldo.

## 5.3 Relação entre lançamento e movimento

Um lançamento poderá produzir um ou mais movimentos.

Exemplos:

- receita recebida: um crédito;
- despesa paga: um débito;
- transferência interna: um débito e um crédito;
- retirada pessoal: um débito na origem e uma contrapartida externa identificável;
- reversão: movimento oposto ao efeito original.

## 5.4 Detalhes especializados

Abastecimentos, manutenções, impostos, multas, documentos e outros detalhes especializados deverão referenciar o lançamento correspondente.

Um detalhe especializado não poderá produzir um segundo custo independente utilizado em:

- saldo;
- resultado;
- fluxo de caixa;
- dashboard;
- relatório;
- meta.

## 5.5 Consistência

Lançamento, movimentos e detalhes especializados relacionados deverão ser:

- criados;
- confirmados;
- corrigidos;
- cancelados

de forma transacionalmente consistente.

---

# 6. Contas financeiras

## 6.1 Tipos iniciais

O MVP poderá possuir:

- dinheiro físico;
- conta bancária;
- carteira digital;
- conta de aplicativo.

## 6.2 Conta principal

O onboarding financeiro incluirá a criação guiada de uma conta principal.

O usuário deverá:

1. escolher o tipo;
2. confirmar o nome;
3. informar opcionalmente o saldo inicial.

O sistema poderá sugerir o nome `Conta principal`.

Nenhuma conta financeira fictícia será criada silenciosamente.

## 6.3 Conta padrão

A conta principal será inicialmente utilizada como conta padrão.

O usuário poderá alterar a conta padrão posteriormente.

Conta inativa não poderá permanecer como padrão.

Contas adicionais serão opcionais.

## 6.4 Saldo inicial

Saldo inicial diferente de zero gerará movimento auditado de abertura.

O saldo não será gravado ou alterado diretamente sem movimento correspondente.

## 6.5 Contas inativas

Uma conta inativa:

- não receberá novos lançamentos;
- permanecerá nos históricos;
- permanecerá nos relatórios de períodos anteriores;
- não poderá ser conta padrão.

A inativação de conta com saldo diferente de zero exigirá confirmação.

## 6.6 Ajuste de saldo

Ajuste de saldo será um lançamento próprio.

Deverá registrar:

- conta;
- saldo derivado anterior;
- saldo informado;
- diferença;
- motivo;
- ator;
- data operacional.

O sistema criará movimento somente pela diferença.

---

# 7. Transferências

Transferência interna moverá recursos entre duas contas do usuário.

Deverá possuir:

- conta de origem;
- conta de destino;
- valor;
- data operacional;
- movimentos vinculados;
- identificador de correlação.

A origem e o destino deverão ser diferentes.

A transferência produzirá:

- débito na origem;
- crédito no destino.

Os dois movimentos serão criados na mesma operação atômica.

Transferência interna:

- não será receita;
- não será despesa;
- não alterará o resultado operacional;
- não alterará o saldo consolidado, desconsiderando taxas.

Taxa de transferência será uma despesa separada e vinculada à transferência.

Cancelamento de transferência deverá neutralizar as duas pernas.

---

# 8. Retiradas pessoais

Retirada pessoal representa a saída de recursos operacionais para uso pessoal.

## 8.1 Contrapartida

A contrapartida do MVP será um destino externo denominado `Uso pessoal`.

Esse destino:

- não possuirá saldo interno;
- não será uma conta financeira operacional;
- identificará a finalidade da saída.

## 8.2 Efeitos

A retirada:

- reduzirá o saldo da conta de origem;
- não será receita;
- não será despesa operacional;
- não integrará o resultado operacional;
- será apresentada separadamente no fluxo financeiro;
- será apresentada separadamente nos relatórios.

A futura criação de contas pessoais internas exigirá nova decisão.

---

# 9. Receitas

## 9.1 Receita operacional

Serão receitas operacionais os valores gerados pela atividade de motorista.

Poderão incluir:

- corridas;
- fechamento diário;
- bônus;
- gorjetas;
- promoções;
- incentivos ligados à operação.

## 9.2 Receita não operacional

Receita não operacional será valor recebido que não decorra da atividade principal.

Receitas não operacionais não serão misturadas ao resultado operacional.

O tratamento detalhado de receitas não operacionais será definido no catálogo de cálculos antes da implementação correspondente.

## 9.3 Origem

A receita deverá possuir origem identificável.

As origens iniciais poderão incluir:

- Uber;
- 99;
- InDrive;
- particular;
- outro aplicativo;
- outra origem cadastrada.

A lista de origens deverá permitir evolução sem depender de alteração estrutural.

## 9.4 Bônus, gorjetas e promoções

Bônus, gorjetas e promoções poderão ser:

- componentes do fechamento diário;
- categorias de receita operacional;
- valores individualizados dentro do fechamento.

Quando individualizados, deverão compor o total confirmado sem serem somados novamente em relatórios.

## 9.5 Vínculos

Receita poderá possuir vínculo opcional com:

- jornada;
- veículo.

O vínculo somente será obrigatório quando regra específica futura determinar.

---

# 10. Receita individual e fechamento diário

## 10.1 Fluxo recomendado

O fechamento diário será o fluxo recomendado para registro de receitas operacionais.

O registro de receitas individuais continuará opcional.

## 10.2 Cobertura

A cobertura considerará, no mínimo:

- proprietário;
- origem;
- data operacional.

O veículo poderá participar da cobertura quando informado.

Fechamento consolidado sem veículo cobrirá toda a origem na data operacional sem divisão por veículo.

## 10.3 Exclusividade

Para a mesma cobertura, o usuário utilizará:

- receita individual; ou
- fechamento diário.

Não será permitido misturar:

- fechamento consolidado sem veículo;
- receitas individuais da mesma cobertura;
- fechamentos separados por veículo da mesma cobertura.

## 10.4 Prevenção de sobreposição

Antes de confirmar uma receita, o sistema verificará conflitos.

Não haverá consolidação automática silenciosa.

Para mudar o modo de registro, o usuário deverá corrigir ou cancelar os registros conflitantes.

## 10.5 Conta de destino

A receita deverá indicar a conta financeira correspondente.

Exemplos:

- conta Uber;
- conta 99;
- banco;
- carteira digital;
- dinheiro físico.

## 10.6 Correção

Mudança de:

- valor;
- origem;
- conta;
- data operacional;
- veículo;
- cobertura

será correção material e exigirá motivo e auditoria.

---

# 11. Despesas

## 11.1 Classificação multidimensional

Toda despesa será classificada por dimensões independentes:

- natureza;
- comportamento;
- escopo;
- categoria.

A categoria não determinará sozinha a natureza, o comportamento ou o escopo.

## 11.2 Natureza

A natureza poderá ser:

- operacional;
- pessoal;
- patrimonial.

### Operacional

Relacionada à atividade de motorista e considerada no resultado conforme o catálogo de cálculos.

### Pessoal

Relacionada ao uso pessoal e excluída do resultado operacional.

### Patrimonial

Relacionada à aquisição, melhoria, financiamento ou movimentação de patrimônio.

O tratamento patrimonial completo pertence à versão 1.5.

## 11.3 Comportamento

O comportamento poderá ser:

- fixo;
- variável.

A apropriação e o rateio serão definidos em `06_CALCULOS.md`.

## 11.4 Escopo

O escopo poderá ser:

- veículo;
- jornada;
- operação geral;
- pessoal;
- patrimonial.

## 11.5 Categorias

As categorias poderão incluir:

- combustível;
- alimentação;
- pedágio;
- estacionamento;
- lavagem;
- manutenção;
- seguro;
- IPVA;
- licenciamento;
- impostos;
- multas;
- financiamentos;
- taxas bancárias;
- outras.

## 11.6 Categorias com veículo obrigatório

Exigirão veículo:

- combustível;
- abastecimento;
- manutenção de veículo;
- seguro de veículo;
- IPVA;
- licenciamento;
- multa vinculada a veículo;
- lavagem de veículo específico;
- financiamento vinculado a veículo, quando esse registro existir.

## 11.7 Categorias com veículo opcional

Permitirão veículo opcional:

- alimentação;
- pedágio;
- estacionamento;
- impostos gerais;
- taxas bancárias;
- despesas pessoais;
- despesas administrativas;
- outras despesas sem vínculo obrigatório.

Pedágio e estacionamento operacionais poderão possuir vínculo com jornada e veículo sem tornar a jornada obrigatória.

## 11.8 Despesas pessoais

Despesas pessoais:

- reduzem o saldo da conta;
- não integram o resultado operacional;
- serão apresentadas separadamente.

Alimentação poderá ser operacional ou pessoal conforme sua natureza informada.

## 11.9 Despesas patrimoniais

Despesas patrimoniais poderão afetar o fluxo financeiro do MVP.

Não serão classificadas automaticamente como despesas operacionais.

O tratamento completo de ativos, passivos e patrimônio líquido pertence à versão 1.5.

## 11.10 Pendências específicas

O impacto de multas no resultado operacional permanece pendente.

A separação entre principal, juros e encargos de financiamentos permanece pendente.

Esses itens não poderão ser implementados com classificação financeira definitiva antes das decisões correspondentes.

---

# 12. Veículos

## 12.1 Múltiplos veículos

O usuário poderá cadastrar múltiplos veículos.

No máximo um veículo será considerado ativo por vez.

Cada veículo manterá seu próprio histórico.

## 12.2 Veículo ativo

Ativar um veículo deverá inativar o anteriormente ativo na mesma operação.

Alterar o veículo ativo não modificará:

- jornadas históricas;
- despesas históricas;
- abastecimentos históricos;
- manutenções históricas.

## 12.3 Ausência de veículo ativo

A possibilidade de o sistema permanecer temporariamente sem veículo ativo ainda depende de decisão do Grupo B.

Até essa decisão:

- nenhuma regra deverá presumir silenciosamente que sempre existe veículo ativo;
- a abertura de jornada exigirá seleção válida de veículo;
- abastecimento e manutenção exigirão veículo explícito.

## 12.4 Inativação

Veículo inativo:

- não será selecionado automaticamente para novos registros;
- permanecerá disponível nos históricos;
- não perderá seus vínculos anteriores.

A regra de inativação do único veículo ativo será concluída após a decisão pendente.

---

# 13. Odômetro

## 13.1 Histórico

Leituras de odômetro serão append-only.

O KM atual será derivado da última leitura válida.

Registros históricos não serão reescritos.

## 13.2 Regressão

Leitura regressiva será bloqueada no fluxo normal.

Ajuste exigirá:

- motivo;
- ator;
- data operacional;
- auditoria.

## 13.3 Troca de painel

Troca, substituição ou reinicialização do painel será representada por evento específico.

O evento deverá registrar:

- veículo;
- leitura final anterior;
- nova leitura exibida;
- data operacional;
- motivo;
- ator.

## 13.4 Quilometragem efetiva

O sistema manterá continuidade através de quilometragem efetiva monotônica.

Jornadas, abastecimentos e manutenções deverão permitir relacionar a leitura exibida à quilometragem efetiva.

Correção ou cancelamento de leitura recalculará os dados derivados afetados sem remover o histórico.

---

# 14. Jornadas

## 14.1 Regras gerais

Cada jornada deverá possuir:

- usuário;
- veículo;
- instante inicial;
- instante final quando encerrada;
- data operacional;
- KM inicial;
- KM final quando encerrada;
- pausas;
- estado;
- histórico de alterações.

Cada jornada será obrigatoriamente vinculada a um veículo.

## 14.2 Abertura

A abertura exigirá:

- veículo válido;
- instante inicial;
- data operacional;
- KM inicial válido.

## 14.3 Fechamento

O fechamento exigirá:

- instante final posterior ao inicial;
- KM final válido;
- pausas válidas;
- validação cronológica;
- validação do odômetro.

## 14.4 Pausas

As pausas deverão:

- possuir início e fim;
- estar contidas no período da jornada;
- não se sobrepor.

Horas trabalhadas serão calculadas pela duração da jornada menos pausas válidas.

## 14.5 Receitas e despesas

O vínculo de receita ou despesa com jornada será opcional, salvo regra específica futura.

## 14.6 Correção

Depois de encerrada, alteração de:

- horários;
- pausas;
- veículo;
- KM;
- data operacional

exigirá motivo e auditoria.

## 14.7 Cancelamento

Jornada cancelada não integrará:

- horas trabalhadas;
- quilômetros operacionais;
- indicadores de jornada.

O cancelamento da jornada não cancelará automaticamente receitas ou despesas vinculadas.

O sistema deverá informar a existência de registros relacionados antes de cancelar.

## 14.8 Pendências

Permanecem pendentes no Grupo B:

- regra de jornada atravessando a meia-noite;
- regra de jornadas sobrepostas;
- quantidade permitida de jornadas abertas simultaneamente.

Essas regras deverão ser decididas antes da implementação do módulo de jornadas.

---

# 15. Abastecimentos

## 15.1 Dados obrigatórios

Abastecimento deverá possuir:

- usuário;
- veículo;
- conta;
- lançamento financeiro;
- data operacional;
- valor total;
- litros;
- preço por litro;
- odômetro;
- indicação de tanque cheio ou parcial.

Poderá possuir:

- consumo informado pelo computador de bordo;
- posto;
- observações.

## 15.2 Efeito financeiro

O abastecimento referenciará um lançamento financeiro.

O valor utilizado em saldos e relatórios será o valor do lançamento.

O abastecimento não produzirá segundo custo independente.

## 15.3 Validação

- Litros deverão ser maiores que zero.
- Valor total deverá ser maior que zero quando houver pagamento.
- Odômetro não poderá regredir sem ajuste.
- Conta e veículo deverão pertencer ao usuário.
- Total, litros e preço deverão respeitar a tolerância aprovada.
- O total financeiro não será alterado automaticamente para coincidir com o produto entre litros e preço.

## 15.4 Precisão

- Total pago: centavos inteiros.
- Litros: precisão mínima de três casas decimais.
- Preço por litro: precisão mínima de três casas decimais.
- Total pago: valor financeiro autoritativo.

A representação física será definida em `05_DATABASE.md`, preservando essas precisões sem ponto flutuante inadequado.

---

# 16. Consumo

## 16.1 Método oficial

O consumo calculado oficial utilizará o método tanque cheio a tanque cheio.

```text
Consumo =
quilômetros efetivos percorridos desde o tanque cheio anterior
/
soma dos litros abastecidos desde o tanque cheio anterior
```

A soma incluirá:

- abastecimentos parciais intermediários;
- abastecimento cheio final.

## 16.2 Dados insuficientes

Sem dois marcos válidos de tanque cheio, o consumo calculado será indisponível.

O sistema não produzirá estimativa silenciosa.

## 16.3 Computador de bordo

O consumo informado pelo computador de bordo será armazenado separadamente.

A interface identificará a origem como:

- calculado pelo RUMO; ou
- informado pelo usuário.

Os dois valores não serão combinados nem substituirão um ao outro silenciosamente.

## 16.4 Correção e cancelamento

Correção ou cancelamento de abastecimento recalculará os ciclos afetados.

Abastecimento cancelado não integrará o consumo.

---

# 17. Manutenções

## 17.1 Planos

Planos de manutenção poderão utilizar:

- intervalo por KM;
- intervalo por tempo;
- ambos.

O plano deverá identificar:

- veículo;
- componente ou serviço;
- base inicial;
- intervalo;
- estado.

## 17.2 Eventos

Evento de manutenção deverá identificar:

- veículo;
- data operacional;
- odômetro;
- descrição;
- plano relacionado, quando existir;
- fornecedor, quando informado;
- lançamento financeiro, quando houver custo;
- observações.

## 17.3 Custo

O custo será obtido exclusivamente do lançamento vinculado.

O evento de manutenção não terá segundo custo independente utilizado nos totais.

## 17.4 Próximo vencimento

Evento confirmado poderá atualizar a base do próximo vencimento do plano.

Somente plano ativo produzirá próximos vencimentos.

## 17.5 Cancelamento

Cancelar evento de manutenção deverá:

- preservar o histórico;
- tratar o lançamento financeiro relacionado;
- recalcular o próximo vencimento;
- registrar motivo e auditoria.

---

# 18. Documentos e obrigações

O MVP controlará:

- seguro;
- IPVA;
- licenciamento;
- multas.

Documento ou obrigação deverá identificar:

- usuário;
- veículo;
- tipo;
- referência;
- data de vencimento;
- valor quando conhecido;
- situação de negócio;
- lançamento de quitação quando houver;
- observações.

Condições como `vencido`, `a vencer` e `em dia` serão calculadas a partir das datas.

Quando houver pagamento:

- deverá existir lançamento financeiro correspondente;
- o documento não poderá produzir segundo custo independente.

Cancelamento deverá preservar o histórico e tratar lançamentos relacionados.

O impacto de multas no resultado operacional permanece pendente.

---

# 19. Alertas determinísticos

O MVP terá somente alertas determinísticos.

Cada alerta deverá possuir:

- regra identificável;
- entidade de origem;
- usuário;
- veículo quando relacionado;
- dado atual;
- limite ou condição;
- instante de geração;
- mensagem compreensível;
- ação sugerida quando definida.

Alertas poderão ser gerados por:

- vencimento de documento;
- KM de manutenção;
- tempo de manutenção;
- combinação de KM e tempo.

Alertas não alterarão dados automaticamente.

A leitura de um alerta não significará resolução da condição.

Os estados detalhados, regras de resolução, dispensa e reabertura permanecem pendentes no Grupo B.

Essas regras deverão ser decididas antes da implementação do módulo de alertas.

---

# 20. Metas

## 20.1 Regra principal

Todas as metas serão opcionais.

Nenhum fluxo principal ou onboarding dependerá da existência de meta.

Metas obrigatórias são incompatíveis com as decisões vigentes.

## 20.2 Escopo do MVP

O MVP poderá possuir metas simples:

- diárias;
- semanais;
- mensais;
- financeiras;
- operacionais.

## 20.3 Comportamento sem meta

Sem metas:

- dashboard funcionará normalmente;
- jornadas continuarão disponíveis;
- receitas e despesas continuarão disponíveis;
- abastecimentos e manutenções continuarão disponíveis;
- nenhuma mensagem de erro será gerada.

## 20.4 Dados cancelados

Registros cancelados não integrarão progresso de meta.

Transferências e retiradas não serão contabilizadas como receita operacional.

## 20.5 Pendências

Permanecem pendentes no Grupo B:

- estados detalhados das metas;
- fórmulas de progresso;
- regras de ativação e inativação;
- tratamento de alteração do alvo;
- comportamento de conclusão;
- critérios para metas financeiras e operacionais.

Essas regras deverão ser decididas antes da implementação do módulo de metas.

---

# 21. Auditoria

## 21.1 Modelo append-only

A auditoria utilizará log append-only.

Eventos de auditoria não poderão ser editados ou apagados pelos fluxos normais.

## 21.2 Conteúdo mínimo

Cada evento deverá registrar:

- entidade;
- identificador;
- ação;
- ator;
- timestamp UTC;
- valores anteriores;
- valores posteriores;
- motivo quando exigido;
- `correlationId`;
- origem.

Poderá registrar também:

- data operacional;
- metadados técnicos necessários para explicar a ação.

## 21.3 Atores

O ator poderá ser:

- usuário local;
- sistema;
- migration;
- processo de restauração;
- integração futura.

## 21.4 Origens

A origem poderá ser:

- interface;
- caso de uso;
- sistema;
- migration;
- restauração;
- integração futura.

## 21.5 Motivo obrigatório

Sempre exigirão motivo:

- cancelamento financeiro;
- reversão;
- ajuste de saldo;
- correção material de valor;
- mudança de conta em registro confirmado;
- mudança de data financeira ou operacional confirmada;
- correção de jornada encerrada;
- ajuste de odômetro;
- troca de painel;
- cancelamento de abastecimento;
- cancelamento de manutenção;
- restauração de backup.

## 21.6 Correlação

Eventos pertencentes à mesma operação deverão compartilhar o mesmo `correlationId`.

## 21.7 Logs técnicos

Logs técnicos e auditoria terão finalidades distintas.

A rotação de logs técnicos não removerá eventos de auditoria.

---

# 22. Correção

## 22.1 Correção descritiva

Campos que não alterem:

- saldo;
- resultado;
- classificação;
- período;
- conta;
- vínculo financeiro

poderão ser corrigidos com auditoria, sem reversão financeira.

## 22.2 Correção material

Mudança de:

- valor;
- conta;
- direção;
- data financeira;
- data operacional;
- natureza;
- comportamento;
- escopo;
- categoria com efeito em cálculo

será uma correção material.

Correção material deverá:

1. registrar o estado anterior;
2. exigir motivo;
3. neutralizar o efeito anterior;
4. aplicar o efeito corrigido;
5. manter o vínculo entre as operações;
6. preservar a auditoria.

---

# 23. Cancelamento

Cancelamento invalida o fato sem apagá-lo.

Registro cancelado:

- permanece no histórico;
- não volta diretamente ao estado confirmado;
- não integra indicadores de negócio;
- não integra metas;
- não pode receber novas alterações comuns.

Se o registro tiver efeito financeiro postado, o cancelamento deverá gerar reversão.

Cancelar um detalhe especializado deverá manter consistente seu lançamento relacionado.

---

# 24. Reversão

Reversão neutraliza efeito financeiro previamente postado.

A reversão:

- cria movimento oposto;
- preserva o movimento original;
- referencia a origem;
- possui auditoria;
- não é nova receita;
- não é nova despesa;
- não é transferência independente.

O saldo será reconstruído considerando o movimento original e o movimento de reversão.

---

# 25. Segurança local

O renderer não terá acesso direto:

- ao Node.js;
- ao Prisma;
- ao SQLite;
- ao sistema de arquivos de forma genérica.

O banco será armazenado no diretório de dados do usuário da aplicação.

Logs técnicos não armazenarão desnecessariamente:

- saldos completos;
- valores financeiros detalhados;
- placas;
- nomes de contas;
- conteúdo integral de registros;
- credenciais;
- segredos.

Backups serão tratados como dados sensíveis.

Nenhuma senha, token ou segredo será armazenado em texto puro.

O arquivo SQLite não terá criptografia própria no primeiro MVP.

O risco residual é a leitura dos dados por pessoa com acesso ao perfil do Windows ou aos arquivos de backup.

Proteções compensatórias:

- armazenamento no diretório do usuário;
- funcionamento offline;
- ausência de envio automático;
- acesso ao banco somente pelas camadas autorizadas;
- logs minimizados;
- alerta sobre sensibilidade dos backups.

Proteção por senha ou criptografia adicional será analisada separadamente antes de distribuição ampla ou suporte multiusuário.

---

# 26. Requisitos não funcionais

## 26.1 Compatibilidade

Alvo inicial:

- Windows 10 versão 22H2 x64;
- Windows 11 x64.

ARM64 e versões anteriores ficam fora do suporte inicial.

A compatibilidade com Windows 10 será reavaliada antes da distribuição.

## 26.2 Desempenho

Em equipamento com processador de quatro núcleos, 8 GB de RAM e SSD:

- inicialização fria: até 5 segundos no percentil 95;
- consultas comuns: até 500 milissegundos no percentil 95;
- relatórios anuais básicos: até 2 segundos no percentil 95.

## 26.3 Volume mínimo de teste

- 5 anos de dados;
- 50.000 lançamentos;
- 100.000 movimentos;
- 5.000 jornadas;
- 10 veículos;
- 10.000 registros especializados;
- 250.000 eventos de auditoria.

## 26.4 Falha de migration

Falha de migration deverá:

- preservar o banco anterior;
- impedir continuação com schema parcial;
- apresentar erro compreensível;
- permitir nova tentativa ou restauração;
- não provocar perda silenciosa.

## 26.5 Acessibilidade mínima

- ações essenciais por teclado;
- foco visível;
- rótulos associados aos campos;
- mensagens compreensíveis;
- contraste mínimo de 4,5:1 para texto comum;
- ausência de dependência exclusiva de cor.

## 26.6 Logs técnicos

Retenção inicial máxima:

- 30 dias; ou
- 20 MB;

prevalecendo o primeiro limite atingido.

Logs poderão conter:

- timestamp;
- severidade;
- módulo;
- código de erro;
- `correlationId`;
- mensagem sanitizada.

---

# 27. Exemplos práticos

## 27.1 Fechamento diário da Uber e 99

Data operacional: 13/07/2026.

- Uber: R$ 300,00.
- 99: R$ 120,00.

Lançamentos:

- receita operacional Uber: R$ 300,00;
- receita operacional 99: R$ 120,00.

Movimentos:

- crédito de R$ 300,00 na conta Uber;
- crédito de R$ 120,00 na conta 99.

Resultado operacional antes das despesas:

```text
R$ 420,00
```

Se existirem receitas individuais conflitantes, o fechamento correspondente será bloqueado.

## 27.2 Despesa de combustível e abastecimento

- Total pago: R$ 200,00.
- Conta: Banco principal.
- Veículo: Veículo A.
- Litros: 40,000.
- Preço por litro: R$ 5,000.
- Odômetro: 50.000 KM.
- Tanque cheio: sim.

Registros:

- lançamento de despesa de R$ 200,00;
- movimento de débito de R$ 200,00;
- abastecimento vinculado ao lançamento.

O abastecimento não cria uma segunda despesa.

## 27.3 Transferência

- Banco → Dinheiro físico.
- Valor: R$ 500,00.

Movimentos:

- débito bancário de R$ 500,00;
- crédito em dinheiro físico de R$ 500,00.

Efeitos:

- saldo consolidado: sem alteração;
- receita: zero;
- despesa: zero;
- resultado operacional: zero.

## 27.4 Retirada pessoal

- Origem: Banco.
- Destino externo: Uso pessoal.
- Valor: R$ 150,00.

Efeitos:

- saldo bancário: −R$ 150,00;
- resultado operacional: sem alteração;
- relatório de retiradas: R$ 150,00.

## 27.5 Cancelamento de despesa

Despesa original:

- estacionamento;
- R$ 80,00;
- débito bancário de R$ 80,00.

Cancelamento:

- lançamento original permanece;
- lançamento é marcado como cancelado;
- movimento original permanece;
- reversão credita R$ 80,00;
- despesa deixa de integrar o resultado;
- auditoria registra motivo e ator.

## 27.6 Ajuste de saldo

- Saldo derivado: R$ 970,00.
- Saldo conferido: R$ 1.000,00.
- Diferença: R$ 30,00.

O sistema cria:

- lançamento de ajuste;
- crédito de R$ 30,00;
- motivo;
- auditoria.

O saldo não é editado diretamente.

## 27.7 Troca de veículo ativo

Situação:

- Veículo A ativo.
- Veículo B inativo.

Ao ativar B, a mesma operação:

- inativa A;
- ativa B;
- preserva os históricos;
- registra auditoria.

A regra diante de jornada aberta permanece pendente no Grupo B.

## 27.8 Troca de painel

- Leitura anterior: 180.000 KM.
- Novo painel: 0 KM.

O sistema registra evento de troca e preserva:

- leitura anterior;
- nova leitura;
- data operacional;
- motivo;
- continuidade da quilometragem efetiva.

## 27.9 Consumo tanque cheio

Primeiro tanque cheio:

- odômetro efetivo: 50.000 KM.

Abastecimento parcial:

- 20,000 litros.

Segundo tanque cheio:

- odômetro efetivo: 50.600 KM;
- 30,000 litros.

Cálculo:

```text
600 KM / 50 litros = 12 KM/L
```

## 27.10 Manutenção com custo

- Troca de óleo.
- Veículo A.
- Odômetro: 50.500 KM.
- Valor: R$ 600,00.
- Conta: Banco.

Registros:

- evento de manutenção;
- lançamento de despesa;
- débito de R$ 600,00;
- vínculo entre evento e lançamento.

O evento não cria outro custo independente.

---

# 28. Regras pendentes do Grupo B

As regras abaixo ainda não estão aprovadas.

Elas não deverão ser implementadas definitivamente antes de novas decisões em `12_DECISOES.md`.

## 28.1 Jornadas atravessando a meia-noite

Ainda será definido:

- data operacional utilizada;
- possibilidade de divisão;
- duração máxima;
- alertas e confirmações.

## 28.2 Jornadas sobrepostas

Ainda será definido:

- se serão bloqueadas;
- se haverá exceções;
- quantidade permitida de jornadas abertas;
- tratamento de conflitos históricos.

## 28.3 Ausência de veículo ativo

Ainda será definido se o sistema poderá permanecer temporariamente sem veículo ativo e quais fluxos ficarão disponíveis.

## 28.4 Multas

Ainda será definido:

- impacto no resultado operacional;
- classificação gerencial;
- tratamento em relatórios.

O vínculo com veículo já é obrigatório.

## 28.5 Financiamentos

Ainda será definido:

- principal;
- juros;
- encargos;
- saldo devedor;
- impacto no resultado;
- integração com patrimônio na versão 1.5.

## 28.6 Alertas

Ainda serão definidos:

- estados;
- transições;
- resolução;
- dispensa;
- reabertura;
- motivo obrigatório por severidade.

## 28.7 Metas

Ainda serão definidos:

- estados detalhados;
- fórmulas de progresso;
- ativação;
- inativação;
- conclusão;
- alteração de alvo;
- tipos financeiros e operacionais.

## 28.8 Backup e restauração

O baseline já exige:

- versão;
- integridade;
- arquivo temporário;
- backup preventivo;
- substituição atômica.

Ainda serão definidos:

- formato;
- compatibilidade entre versões;
- política detalhada de rollback;
- fluxo de recuperação;
- mensagens e confirmações;
- retenção do backup preventivo.
