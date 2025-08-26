import  { expect } from 'chai';
import request from 'supertest';
import { transferService } from '../../service/transferService.js';



describe('Transfer ', () => {
  describe('POST /transfer', () => {
    it('Usando HTTP:Quando não informo os dados do remetente ou destinatário deve retornar um erro 400', async () => {
      const resposta = await request( 'http://localhost:3000' )
        .post('/transfer')
        .send({
          remetente: "João",
          destinatario: "Maria",
          valor: 100
          });

          expect(resposta.status).to.equal(400);
          expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado.');
        });
    });
  });
