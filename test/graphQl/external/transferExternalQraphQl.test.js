//  Importa as bibliotecas necessárias para testar
const request = require('supertest');
const { expect, use } = require('chai');
const chaiExclude = require('chai-exclude');
use(chaiExclude);

// Início dos testes de transferência via GraphQL
describe('Teste de Transferencia GraphQL', () => {

    describe('POST /graphql ', () => {
// Antes de cada teste, faz login para obter o token de autenticação
        beforeEach(async () => {
            // Faz a mutation de login usando  fixture  loginUser  e pegar o token
            const loginUser = require('../fixture/requisicoes/login/userLogin.json');
            const respostaLogin = await request('http://localhost:4000')
                .post('/graphql')
                .send(loginUser);
         // Salva o token para usar nos próximos testes
            token = respostaLogin.body.data.loginUser.token;
        });


    beforeEach(() => {
        createTransfer = require('../fixture/requisicoes/transferencia/createTransfer.json');
    })

        it(' Quando  é uma Transferencia de sucesso entre duas contas', async () => {
            const respostaEsperada = require('../fixture/resposta/transferencias/validarQueEPossivelTransferirGranaEntreDuasContas.json');
            const resposta = await request('http://localhost:4000')
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send(createTransfer);

            expect(resposta.status).to.equal(200);
            // expect(resposta.body).to.eql(respostaEsperada)
            expect(resposta.body.data.createTransfer)
                .excluding('date')
                .to.deep.equal(respostaEsperada.data.createTransfer)

        });


        it('Quando a Transferencia não tem  saldo disponivel ', async () => {

            createTransfer.variables.value = 20000;
            const resposta = await request('http://localhost:4000')
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send(createTransfer);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.errors[0]).to.have.property('message', 'Saldo insuficiente')
        });


         // Testa se aparece erro quando o token de autenticação está inválido
        it('Quando a Transferencia  está como  Token de autenticação inválido', async () => {

            const token = '    '
            const resposta = await request('http://localhost:4000')
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send(createTransfer);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.errors[0]).to.have.property('message', 'Autenticação obrigatória')
        });
    });
});
