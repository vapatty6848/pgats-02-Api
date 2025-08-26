
import * as chai from 'chai';
import request from 'supertest';
import sinon from 'sinon';
const { expect } = chai;
import app from '../../app.js';
import { transferService } from '../../service/transferService.js';

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
      expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado.');
    });

      it('Usando Mock:  Quando não informo os dados do remetente ou destinatário deve retornar um erro 400', async () => {
         // Mocar apenas a função transfer do Service
        const transferServiceMock = sinon.stub(transferService, 'transfer').returns({ error: 'Usuário remetente ou destinatário não encontrado.' });
        // transferServiceMock.throws(new Error('Usuário remetente ou destinatário não encontrado'));
        const resposta = await request(app)
        .post('/transfer')
        .send({
          remetente: "João",
          destinatario: "Maria",
          valor: 100
        });
        expect(resposta.status).to.equal(400);

       expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado.');

        // resete o mock
        sinon.restore();
      })
    it('Usando Mocks: Quando informo valores válidos eu tenho sucesso com 201 CREATED', async () => {
      const transferServiceMock = sinon.stub(transferService, 'transfer').returns({
        transfer: {
          remetente: "João",
          destinatario: "Maria",
          valor: 100,
          data: new Date().toISOString()
        }
      });
      const resposta = await request(app)
        .post('/transfer')
        .send({
          remetente: "João",
          destinatario: "Maria",
          valor: 100
        });
      expect(resposta.status).to.equal(201);
      expect(resposta.body).to.have.property('remetente', "João");
      expect(resposta.body).to.have.property('destinatario', "Maria");
      expect(resposta.body).to.have.property('valor', 100);
      expect(resposta.body).to.have.property('data');
      sinon.restore();
    });
  })
})
