const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  registrant: [String], // Array de registrantes
  recipient: [String], // Array de destinatários
  description: String,
  fileUrl: String,
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

module.exports = mongoose.model('Document', documentSchema);