
import { transfers } from '../model/transferModel.js';
import { getUser } from './userService.js';

export const transferService = {
  transfer({ remetente, destinatario, valor }) {
    const remetenteUser = getUser(remetente);
    const destinatarioUser = getUser(destinatario);

    if (!remetenteUser || !destinatarioUser) {
      return { error: 'Usuário remetente ou destinatário não encontrado.' };
    }
    if (remetenteUser.saldo < valor) {
      return { error: 'Saldo insuficiente.' };
    }
    if (!destinatarioUser.favorecido && valor >= 5000) {
      return { error: 'Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos.' };
    }
    remetenteUser.saldo -= valor;
    destinatarioUser.saldo += valor;
    const transfer = { remetente, destinatario, valor, data: new Date() };
    transfers.push(transfer);
    return { transfer };
  },
  getTransfers() {
    return transfers;
  }
};
