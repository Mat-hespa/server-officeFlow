const mongoose = require('mongoose');

const chamadoSchema = new mongoose.Schema({
  solicitante: String,
  titulo: String,
  ocorrencia: String,
  descricao: String,
  prioridade: String,
  anexos: [String], // URLs dos anexos no S3
  status: { type: String, default: 'aberto' },
  history: [
    {
      status: String,
      updatedAt: { type: Date, default: Date.now },
      updatedBy: String,
      comment: String
    }
  ]
});

module.exports = mongoose.model('Chamado', chamadoSchema);