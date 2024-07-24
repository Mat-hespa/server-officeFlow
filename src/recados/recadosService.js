const Recado = require('./recadosModel');

class RecadoService {
  async createRecado(data) {
    const novoRecado = new Recado({
      emailRemetente: [data.emailRemetente],
      emailDestinatario: [data.emailDestinatario],
      mensagem: data.mensagem,
      status: 'inicial',
      history: [{ status: 'inicial', updatedBy: data.emailRemetente }]
    });
    return await novoRecado.save();
  }

  async getRecadosByDestinatario(emailDestinatario) {
    return await Recado.find({ emailDestinatario: emailDestinatario }).sort({ createdAt: -1 });
  }

  async countUnreadRecados(emailDestinatario) {
    return await Recado.countDocuments({ emailDestinatario: emailDestinatario, read: false });
  }

  async markAsRead(recadoId) {
    return await Recado.findByIdAndUpdate(recadoId, { read: true }, { new: true });
  }

  // Novo método para encaminhar recado
  async forwardRecado(recadoId, newRegistrant, recipient) {
    const recado = await Recado.findById(recadoId);
    if (!recado) {
      throw new Error('Recado não encontrado.');
    }

    // Adicionar novos registrant e recipient ao array existente
    recado.emailRemetente.push(newRegistrant);
    recado.emailDestinatario.push(recipient);
    recado.status = 'encaminhado';
    recado.history.push({ status: 'encaminhado', updatedBy: newRegistrant });

    return await recado.save();
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
}

module.exports = new RecadoService();