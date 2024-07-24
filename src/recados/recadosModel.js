const mongoose = require('mongoose');

const recadoSchema = new mongoose.Schema({
  emailRemetente: [String], // Array de remetentes
  emailDestinatario: [String], // Array de destinatários
  mensagem: String,
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  status: { type: String, default: 'inicial' },
  history: [
    {
      status: String,
      updatedAt: { type: Date, default: Date.now },
      updatedBy: String // Email ou ID do usuário que fez a atualização
    }
  ]
});

module.exports = mongoose.model('Recado', recadoSchema);