# API de Transferências e Usuários

Esta API permite realizar operações de registro, login, consulta de usuários e transferências de valores entre usuários. O banco de dados é em memória, ideal para aprendizado de testes e automação de APIs.

## Instalação

1. Clone o repositório ou copie os arquivos para seu ambiente.
2. Instale as dependências:
   ```zsh
   npm install express swagger-ui-express
   ```

## Execução

Para iniciar o servidor:

```zsh
node server.js
```

A API estará disponível em `http://localhost:3000`.

## Endpoints

- `POST /register`: Registra um novo usuário. Campos obrigatórios: `username`, `password`. Opcional: `favorecido` (boolean).
- `POST /login`: Realiza login. Campos obrigatórios: `username`, `password`.
- `GET /users`: Lista todos os usuários.
- `POST /transfer`: Realiza transferência entre usuários. Campos obrigatórios: `remetente`, `destinatario`, `valor`.
- `GET /transfers`: Lista todas as transferências.
- `GET /api-docs`: Documentação Swagger interativa.

## Regras de Negócio

- Não é permitido registrar usuários duplicados.
- Login exige usuário e senha.
- Transferências para destinatários não favorecidos só podem ser feitas se o valor for menor que R$ 5.000,00.
- Cada usuário inicia com saldo de R$ 10.000,00.

## Testes

Para testar a API com Supertest, importe o arquivo `app.js` em seus testes.

## Documentação

Acesse `/api-docs` para visualizar e testar os endpoints via Swagger.

---

API criada para fins educacionais e de automação de testes.
