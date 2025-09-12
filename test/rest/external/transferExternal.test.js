// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

// Testes
describe('Transfer', () => {
    describe('POST /transfers', () => {
        // Capturar o token antes de cada teste
        beforeEach(async () => {
            const respostaLogin = await request(process.env.BASE_URL_REST)
                .post('/users/login')
                .send({
                    username: 'julio',
                    password: '123456'
                });

               // console.log(respostaLogin.body)
            token = respostaLogin.body.token;
        });


             // Realizar transferencias
        it('Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "julio",
                    to: "isabelleee",
                    value: 100
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado')
        });

        it('Usando Mocks: Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "jose",
                    to: "isabelle",
                    value: 100
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');
        });

        it('Usando Mocks: Quando informo valores válidos eu tenho sucesso com 201 CREATED', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "julio",
                    to: "priscila",
                    value: 100
                });

            expect(resposta.status).to.equal(201);

            // Validação com um Fixture
            const respostaEsperada = require('../../rest/fixture/respostas/quandoInformoValoresValidosEuTenhoSucessoCom201Created.json')
            delete resposta.body.date;
            delete respostaEsperada.date;
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });
    });
});
