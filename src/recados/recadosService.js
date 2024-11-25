const Recado = require('./recadosModel');

class RecadoService {
  async createRecado(data) {
    // Ensure emailDestinatario is an array
    const emailDestinatario = Array.isArray(data.emailDestinatario) ? data.emailDestinatario : [data.emailDestinatario];

    const novoRecado = new Recado({
      emailRemetente: [data.emailRemetente],
      emailDestinatario: emailDestinatario,
      mensagem: data.mensagem,
      status: 'inicial',
      history: [{ status: 'inicial', updatedBy: data.emailRemetente }],
      readBy: emailDestinatario.map(email => ({ recipient: email, read: false })) // Inicializa o estado de leitura
    });

    if (!novoRecado.emailDestinatario.includes(novoRecado.emailRemetente[0])) {
      novoRecado.emailDestinatario.push(data.emailRemetente);
    }

    return await novoRecado.save();
  }

  async getRecadosByDestinatario(emailDestinatario) {
    return await Recado.find({ emailDestinatario: emailDestinatario }).sort({ createdAt: -1 });
  }

  async countUnreadRecados(emailDestinatario) {
    try {
      // Find documents matching the criteria
      const matchingRecados = await Recado.find({
        readBy: {
          $elemMatch: { recipient: emailDestinatario, read: false }
        }
      });
  
      // Log each matching document
      matchingRecados.forEach(recado => {
        ('Matching Recado:', JSON.stringify(recado, null, 2));
      });
  
      // Count the documents
      const unreadCount = matchingRecados.length;
  
      (`Unread count for ${emailDestinatario}: ${unreadCount}`);
      return unreadCount;
    } catch (error) {
      console.error('Error counting unread recados:', error);
      throw new Error('Erro ao contar recados não lidos.');
    }
  }

  async markAsRead(recadoId, recipientEmail) {
    return await Recado.findOneAndUpdate(
      { _id: recadoId, 'readBy.recipient': recipientEmail },
      { $set: { 'readBy.$.read': true } },
      { new: true }
    );
  }

  // Novo método para encaminhar recado
  async forwardRecado(recadoId, newRegistrant, newRecipient, comment) {
    const recado = await Recado.findById(recadoId);
    if (!recado) {
      throw new Error('Recado não encontrado.');
    }

    // Adicionar novos registrant e recipient ao array existente
    recado.emailRemetente.push(newRegistrant);
    recado.emailDestinatario.push(newRecipient);
    recado.status = 'encaminhado';
    recado.history.push({ status: 'encaminhado', updatedBy: newRegistrant, comment: comment });
    (recado.history)

    // Adiciona o novo destinatário na lista de leitura
    recado.readBy.push({ recipient: newRecipient, read: false });

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