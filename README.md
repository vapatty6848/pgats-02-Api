#  Testes de Performance com K6 - API de Transferências

Este projeto contém testes de performance automatizados usando K6 para validar a API de transferências bancárias.

##  Índice

- [Arquitetura dos Testes](#arquitetura-dos-testes)
- [Conceitos Implementados](#conceitos-implementados)
- [Como Executar](#como-executar)
- [Relatórios](#relatórios)

---

##  Arquitetura dos Testes


test/k6/

├── checkout.test.js           # Teste principal de performance

├── userLogin.test.js          # Teste de login com data-driven

├── helpers/

│   ├── emailGenerator.js      # Gerador de emails com

│   ├── getBaseURL.js          # Helper para variável de ambiente

│   ├── loginHelper.js         # Helper reutilizável de login

│   └── README.md

├── reports/

│   ├── checkout-report.json   # Relatório em JSON

│   ├── checkout-report.html   # Relatório visual em HTML

│   └── generate-html.js       # Script gerador de HTML

└── data/
    └── data.login.test.json   # Dados para data-driven testing

---

## Conceitos Implementados

###  Thresholds

**Onde**: `test/k6/checkout.test.js` (linhas 11-15)


export const options = {
  stages: [

    { duration: "5s", target: 5 },

    { duration: "10s", target: 10

    { duration: "5s", target: 10 },

    { duration: "5s", target: 0 },
  ],
  thresholds: {

    http_req_duration: ["p(95)<2000"],

    transfer_duration: ["p(95)<2000"]
};

**Explicação**: Definido como critério de sucesso para o teste.
O teste passa apenas se 95% das requisições HTTP e transferências forem executadas em menos de 2 segundos.

---

###  Checks

**Onde**: `test/k6/checkout.test.js` (linhas 44, 56, 89)


check(senderRegisterResponse, {

  "Sender Register status is 201": (r) => r.status === 201,
});


check(response, {

  "Login status is 200": (r) => r.status === 200,
});


check(checkoutResponse, {

  "Checkout status is 201": (r) => r.status === 201,
});


**Explicação**: Validações que verificam se as respostas HTTP estão conforme esperado.
Similar a assertions em testes unitários, mas não interrompem a execução do teste.

---

### Helpers

**Onde**: `test/k6/helpers/loginHelper.js`


import http from "k6/http";
import { check } from "k6";

export function login(baseURL, username, password) {

  const loginPayload = JSON.stringify({

    username: username,

    password: password,
  });

  const params = {

    headers: {

      "Content-Type": "application/json",
    },
  };

  const response = http.post(`${baseURL}/users/login`, loginPayload, params);

  check(response, {

    "Login status is 200": (r) => r.status === 200,
  });

  if (response.status === 200)

    const body = JSON.parse(response.body);

    return body.token;
  }

  return null;
}


**Uso no teste**: `test/k6/checkout.test.js` (linha 64)


senderToken = login(baseURL, senderUsername, password);


**Explicação**: Função reutilizável que encapsula a lógica de login.
Pode ser usada em múltiplos testes, promovendo DRY (Don't Repeat Yourself).

---

###  Trends

**Onde**: `test/k6/checkout.test.js` (linhas 8, 85)


import { Trend } from "k6/metrics

const transferDuration = new Trend("transfer_duration");


const checkoutResponse = http.post(

  `${baseURL}/transfers`,

  checkoutPayload,

  params
);

transferDuration.add(checkoutResponse.timings.duration);


**Explicação**: Métrica customizada que rastreia a duração das transferências especificamente.
Permite análise detalhada de performance de endpoints críticos.

---

###  Faker

**Onde**: `test/k6/helpers/emailGenerator.js`


import { Faker } from "k6/x/faker";

export function generateRandomEmail() {
  const seed = Date.now() + Math.random() * 1000000;
  let faker = new Faker(seed);
  return faker.person.email();
}


**Uso no teste**: `test/k6/checkout.test.js` (linha 21)


const senderUsername = generateRandomEmail();
const recipientUsername = generateRandomEmail();


**Explicação**: Gera emails aleatórios únicos para cada iteração do teste usando a biblioteca Faker do K6. O seed dinâmico garante unicidade.

---

###  Variável de Ambiente

**Onde**: `test/k6/helpers/getBaseURL.js`


export function getBaseURL() {

  return __ENV.BASE_URL || "http://localhost:3000";

}




**Uso no teste**: `test/k6/checkout.test.js` (linha 20)

const baseURL = getBaseURL();



**Como executar com variável de ambiente**:

k6 run test/k6/checkout.test.js -e BASE_URL=https://api.production.com`

**Explicação**: Permite configurar a URL base da API via linha de comando, facilitando testes em diferentes ambientes (dev, staging, production).

---

###  Stages

**Onde**: `test/k6/checkout.test.js` (linhas 11-16)

export const options = {

  stages:

    { duration: "5s", target: 5 }, // Ramp-up: 0 → 5 VUs em 5s

    { duration: "10s", target: 10 }, // Carga: 5 → 10 VUs em 10s

    { duration: "5s", target: 10 }, // Sustentação: mantém 10 VUs por 5s

    { duration: "5s", target: 0 }, // Ramp-down: 10 → 0 VUs em 5s
  ],
  // ...
};


**Explicação**: Simula carga realista com aumento gradual (ramp-up), sustentação de carga, e diminuição gradual (ramp-down). Evita picos de carga artificial.

---

###  Reaproveitamento de Resposta

**Onde**: `test/k6/checkout.test.js` (linhas 62-65, 79)

let senderToken, recipientToken;

group("Login dos Usuários", function () {

  senderToken = login(baseURL, senderUsername, password);

  recipientToken = login(baseURL, recipientUsername, password);

});

// reutiliza o token
if (senderToken && recipientToken) {

  group("Checkout (Transferência)", function () {

    const params = {

      headers: {

        "Content-Type": "application/json",

        Authorization: `Bearer ${senderToken}`, // Token reutilizado aqui
      },
    };
    // ...
  });
}


**Explicação**: O token JWT obtido no login é armazenado e reutilizado na requisição de transferência.
Simula comportamento real onde o usuário se autentica uma vez e usa o token em múltiplas operações.

---

###  Uso de Token de Autenticação

**Onde**: `test/k6/checkout.test.js` (linha 79)


const params = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${senderToken}`,
  },
};

const checkoutResponse = http.post(
  `${baseURL}/transfers`,
  checkoutPayload,
  params
);

**Explicação**: Implementa autenticação JWT Bearer no header Authorization.
O token é extraído do login e usado para autorizar a operação de transferência.

---

###  Data-Driven Testing

**Onde**: `test/k6/userLogin.test.js` (linhas 6-7)


import { SharedArray } from "k6/data";

const dataUsers = new SharedArray("dataUsers", function () {

  return JSON.parse(open("../data/data.login.test.json"));
});

**Arquivo de dados**: `test/data/data.login.test.json`


[
  {
    "email": "john@example.com",

    "password": "password123"
  },

  {
    "email": "jane@example.com",

    "password": "password456"


  {
    "email": "bob@example.com",

    "password": "password789"
  }
]
```

**Uso no teste**: `test/k6/userLogin.test.js` (linha 37)

```
export default function () {

  const user = dataUsers[(__VU - 1) % dataUsers.length];

  const loginPayload = JSON.stringify({

    username: user.email,

    password: user.password,
  });
  // ...
}

**Explicação**: Carrega dados de teste de arquivo JSON externo.
Cada VU (Virtual User,  SharedArray/k6 ) usa um usuário diferente do array, permitindo testes parametrizados (reaproveitamento).

---

###  Groups

**Onde**: `test/k6/checkout.test.js` (linhas 27, 62, 71)


group('Registro de Usuários', function () {

    const senderRegisterResponse = http.post(...);

    check(senderRegisterResponse, {...});

    const recipientRegisterResponse = http.post(...);

    check(recipientRegisterResponse, {...});
});

group('Login dos Usuários', function () {

    senderToken = login(baseURL, senderUsername, password);

    recipientToken = login(baseURL, recipientUsername, password);

});

group('Checkout (Transferência)', function () {

    const checkoutResponse = http.post(...);

    transferDuration.add(checkoutResponse.timings.duration);

    check(checkoutResponse, {...});
});


**Explicação**: Organiza o teste em grupos lógicos. Melhora a legibilidade e
permite análise de métricas por grupo específico nos relatórios. Neste caso  os grupos de:
Registro do usuário, Login do usuário e o Checkout para a transferencia.

---

##  Como Executar

### Pré-requisitos

```bash
# Instalar K6


# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6


### Iniciar Servidor

```bash
node server.js
#  http://localhost:3000
```

### Executar Testes

**Teste completo de checkout (com stages)**:

```bash
k6 run test/k6/checkout.test.js
```

**Teste com ambiente customizado**:

```bash
k6 run test/k6/checkout.test.js -e BASE_URL=https://api.staging.com
```

**Teste de login data-driven**:

```bash
k6 run test/k6/userLogin.test.js
```

**Gerar relatório JSON**:

```bash
k6 run test/k6/checkout.test.js --out json=test/k6/reports/checkout-report.json
```

**Gerar relatório HTML**:

```bash
# Após gerar o JSON
node test/k6/reports/generate-html.js


E/OU

K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run test/k6/checkout.test.js
```

---

##  Relatórios 

### Localização

- **JSON**: `test/k6/reports/checkout-report.json`
- **HTML**: `test/k6/reports/checkout-report.html`
- **HTML**: `html-report.html`

### Visualizar Relatório HTML

```bash
# Abrir no navegador # Linux

xdg-open test/k6/reports/checkout-report.html
xdg-open html-report.html
```

### Métricas Principais

- **http_req_duration (p95)**: Tempo de resposta das requisições HTTP
- **transfer_duration (p95)**: Tempo específico das transferências
- **checks**: Taxa de sucesso das validações
- **http_req_failed**: Taxa de falhas nas requisições
- **iterations**: Número de iterações completas do teste

---

##  Resultados Esperados

✅ **Thresholds Passed**

- `http_req_duration` p95 < 2000ms
- `transfer_duration` p95 < 2000ms

✅ **Checks 100%**

- Sender Register status 201
- Recipient Register status 201
- Login status 200
- Checkout status 201

✅ **Performance**

- ~340 iterações em 25s
- 10 VUs máximo
- 0% de falhas

---

##  Notas

- O K6 provisiona automaticamente a extensão `k6/x/faker` na primeira execução
- Os emails são gerados com seed dinâmico para garantir unicidade
- O teste usa stages para simular carga realista
- Todos os conceitos solicitados foram implementados e documentados

---

##  Autor

Projeto desenvolvido como Trabalho de Conclusão da Disciplina  de Testes de Performance com K6.

**Data de Entrega**: 21 de dezembro de 2025

---

##  Referências

- [Documentação K6](https://k6.io/docs/)
- [K6 Faker Extension](https://github.com/szkiba/xk6-faker)
- [Best Practices K6](https://k6.io/docs/testing-guides/test-types/)

