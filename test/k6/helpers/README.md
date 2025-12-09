
### iniciando servidor
node server.js

### Rodando testes de Performace

### -  Antes add 2 users para fazer transferencia
    Swagger  `http://localhost:3000/api-docs`

  k6 run testApi.js

  #### Gerando relatorio CSV
  k6 run --out csv=test_results.csv testApi.js
## Trabalho de Conclusão


Orientações: Desafio:
Implemente ao menos UM teste automatizado de performance com K6 para um dos seus projetos de API construídos no decorrer do curso. Esse projeto de testes de performance deve usar o K6 para exercitar a API.

Conceitos a serem empregados:
Thresholds
Checks
Helpers
Trends
Faker
Variável de Ambiente
Stages
Reaproveitamento de Resposta
Uso de Token de Autenticação
Data-Driven Testing
Groups

Entregáveis:
Repositório no Github com: 1)Arquitetura dos testes em test/k6 e 2) README.md explicando onde no código cada um dos conceitos foram aplicados
Relatório de Execução do Teste em HTML

Atenção:
Se o script estiver perfeito, mas o README não demonstrar onde os conceitos foram aplicados no código, você perderá pontos. Logo, apresente trechos do código no README juntamente com uma explicação de como o conceito e aplicou ali.

Entrega:
21 de dezembro de 2025 às 23:59:59 (Horário de Brasília)

Boa sorte a todos, vocês são demais!

Exemplo do README:
O código abaixo está armazenado no arquivo test/k6/checkout.test.js e demontra o uso do conceito de Groups e dentro dele faço uso de um Helper, uma função de login, que foi importada de um outro script javascript.

group('Login User', function () {
    token = login(email, password);
});
