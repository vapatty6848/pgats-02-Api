
### iniciando servidor
node server.js

### Rodando testes de Performace

### -  Antes add 2 users para fazer transferencia
    Swagger  `http://localhost:3000/api-docs`

  k6 run testApi.js

  #### Gerando relatorio CSV
  k6 run --out csv=test_results.csv testApi.js
