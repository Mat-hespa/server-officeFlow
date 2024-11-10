const mongoose = require('mongoose');

const recadoSchema = new mongoose.Schema({
  emailRemetente: [String], // Array de remetentes
  emailDestinatario: [String], // Array de destinatários
  mensagem: String,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'inicial' },
  history: [
    {
      status: String,
      updatedAt: { type: Date, default: Date.now },
      updatedBy: String, // Email ou ID do usuário que fez a atualização
      comment: String // New field for comments or modified descriptions
    }
  ],
  readBy: [
    {
      recipient: String,
      read: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model('Recado', recadoSchema);