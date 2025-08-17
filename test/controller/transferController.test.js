
import * as chai from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import app from '../../app.js';
const { expect } = chai;

describe('TransferController', () => {
  describe('POST /transfer', () => {
    it('Quando não informo os dados do remetente ou destinatário deve retornar um erro 400', async () => {
      const resposta = await request(app)
        .post('/transfer')
        .send({
          remetente: "João",
          destinatario: "Maria",
          valor: 100
        });
      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.have.property('error', 'Usuário remetente, destinatário não encontrado.');
    })
  })
})
