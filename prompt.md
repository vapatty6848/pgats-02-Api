

# Objetivo
Criar um teste de performance com K6 para o fluxo completo: registrar usuário → fazer login → realizar checkout/transferência.

# Contexto
- K6 já está instalado
- Teste apenas para fluxo principal (happy path)
- Consulte a documentação da API (Swagger/OpenAPI) para identificar:
  - Endpoint de registro (ex: POST /users/register)
  - Endpoint de login (ex: POST /users/login)
  - Endpoint de checkout/transferência (ex: POST /transfers ou POST /checkout)
  - Como extrair o token JWT da resposta do login
- Performance: percentil 95 deve ser menor que 2 segundos
- Configuração: 10 usuários virtuais (VUs) com 15 segundos de duração

# Requisitos Técnicos

## Estrutura de Arquivos
- Salvar teste em: `test/k6/checkout.test.js`
- Criar pasta: `test/k6/helpers/` para funções reutilizáveis

## Helpers a Criar
1. **emailGenerator.js**: Gerar emails aleatórios únicos usando k6/x/faker com seed dinâmico
2. **getBaseURL.js**: Obter BASE_URL de variável de ambiente ou usar padrão (localhost:3000)
3. **loginHelper.js**: Função de login reutilizável que retorna o token

## Implementação do Teste

### Imports necessários

import http from 'k6/http';
import { check, group } from 'k6';
import { Trend } from 'k6/metrics';


### Options

export const options = {
    vus: 10,
    duration: '15s',
    thresholds: {
        'http_req_duration': ['p(95)<2000'],
        'transfer_duration': ['p(95)<2000'],
    },
};

### Métricas Customizadas
- Criar Trend para monitorar duração do endpoint de checkout/transferência

### Fluxo do Teste (usar groups)
1. **Group "Registro de Usuários"**:
   - Registrar 2 usuários (sender e recipient) com emails únicos
   - Check: status 201

2. **Group "Login dos Usuários"**:
   - Fazer login dos 2 usuários
   - Check: status 200
   - Extrair tokens

3. **Group "Checkout/Transferência"**:
   - Realizar operação de checkout/transferência
   - Usar token Bearer JWT no header Authorization
   - Adicionar timing ao Trend
   - Check: status 201 ou status de sucesso da API

## Checks Obrigatórios
- Verificar status code de sucesso em TODAS as requisições
- Verificar se token foi recebido no login

## Variáveis de Ambiente
- Suportar BASE_URL via linha de comando: `k6 run test.js -e BASE_URL=http://api.example.com`

## Após Implementação
1. Executar o teste
2. Verificar se p95 < 2000ms
3. Reportar checks que falharam
4. Confirmar 100% de sucesso

# Regras de Qualidade
- Código limpo e sem duplicação
- Funções helpers reutilizáveis em outros testes
- Nomes descritivos para checks
- Usar groups para organizar ações similares


Este prompt  pode ser  usado em um  projeto que precise de testes de performance K6 similares, apenas ajustando os endpoints específicos da API.
