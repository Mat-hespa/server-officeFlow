const Recado = require('./recadoModel');

class RecadoService {
  async createRecado(data) {
    const novoRecado = new Recado({
      emailRemetente: data.emailRemetente,
      emailDestinatario: data.emailDestinatario,
      mensagem: data.mensagem,
      status: 'inicial',
      history: [{ status: 'inicial', updatedBy: data.emailRemetente }]
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

  // Novo método para atualizar status
  async updateRecadoStatus(recadoId, status, updatedBy) {
    const recado = await Recado.findById(recadoId);
    if (!recado) {
      throw new Error('Recado não encontrado.');
    }
    recado.status = status;
    recado.history.push({ status, updatedBy });
    return await recado.save();
  }

  // Novo método para encaminhar recado
  async forwardRecado(recadoId, recipient) {
    const recado = await Recado.findById(recadoId);
    if (!recado) {
      throw new Error('Recado não encontrado.');
    }
    const novoRecado = new Recado({
      ...recado._doc,
      emailDestinatario: recipient,
      status: 'encaminhado',
      history: [...recado.history, { status: 'encaminhado', updatedBy: recado.emailDestinatario }]
    });
    return await novoRecado.save();
  }
}

module.exports = new RecadoService();