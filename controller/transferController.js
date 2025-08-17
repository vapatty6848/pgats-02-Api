
import * as transferService from '../service/transferService.js';

export function transfer(req, res) {
  const { remetente, destinatario, valor } = req.body;
  if (!remetente || !destinatario || typeof valor !== 'number') {
    return res.status(400).json({ error: 'Remetente, destinatário e valor são obrigatórios.' });
  }
  const result = transferService.transfer({ remetente, destinatario, valor });
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result.transfer);
}

export function getTransfers(req, res) {
  res.json(transferService.getTransfers());
}
