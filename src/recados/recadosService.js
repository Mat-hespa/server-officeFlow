// services/recadoService.js
const Recado = require('./recadosModel');

class RecadoService {
  async createRecado(data) {
    const novoRecado = new Recado({
      emailRemetente: data.emailRemetente,
      emailDestinatario: data.emailDestinatario,
      mensagem: data.mensagem
    });
    return await novoRecado.save();
  }

  async getRecadosByDestinatario(emailDestinatario) {
    return await Recado.find({ emailDestinatario }).sort({ createdAt: -1 });  // Ordena por createdAt em ordem decrescente
  }

  async countUnreadRecados(emailDestinatario) {
    return await Recado.countDocuments({ emailDestinatario, read: false });
  }

  async markAsRead(recadoId) {
    return await Recado.findByIdAndUpdate(recadoId, { read: true }, { new: true });
  }
}

module.exports = new RecadoService();