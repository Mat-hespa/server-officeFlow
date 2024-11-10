const recadoService = require('./recadosService');

class RecadoController {
  async createRecado(req, res) {
    try {
      const { emailRemetente, emailDestinatario, mensagem } = req.body;

      if (!emailRemetente || !emailDestinatario || !mensagem) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }

      const recado = await recadoService.createRecado(req.body);
      res.status(201).json(recado);
    } catch (error) {
      console.error('Error creating recado:', error);
      res.status(500).json({ message: 'Erro ao criar recado.' });
    }
  }

  async getRecadosByDestinatario(req, res) {
    try {
      const emailDestinatario = req.params.email;
      const recados = await recadoService.getRecadosByDestinatario(emailDestinatario);
      res.status(200).json({ recados });
    } catch (error) {
      console.error('Error getting recados:', error);
      res.status(500).json({ message: 'Erro ao buscar recados.' });
    }
  }

  async countUnreadRecados(req, res) {
    try {
      const emailDestinatario = req.params.email;
      console.log('emailDestinatario::::::::::::::', emailDestinatario);
      const unreadCount = await recadoService.countUnreadRecados(emailDestinatario);
      console.log('unreadCount:::::::::::::::::', unreadCount);
      res.status(200).json({ unreadCount });
    } catch (error) {
      console.error('Error counting unread recados:', error);
      res.status(500).json({ message: 'Erro ao contar recados não lidos.' });
    }
  }

  async markAsRead(req, res) {
    try {
      const recadoId = req.params.id;
      const recipientEmail = req.body.recipientEmail;

      if (!recipientEmail) {
        return res.status(400).json({ message: 'Email do destinatário é obrigatório.' });
      }

      const recado = await recadoService.markAsRead(recadoId, recipientEmail);
      res.status(200).json(recado);
    } catch (error) {
      console.error('Error marking recado as read:', error);
      res.status(500).json({ message: 'Erro ao marcar recado como lido.' });
    }
  }

  async updateRecadoStatus(req, res) {
    try {
      const { status, updatedBy } = req.body;

      if (!status || !updatedBy) {
        return res.status(400).json({ message: 'Status e usuário que atualizou são obrigatórios.' });
      }

      const recado = await recadoService.updateRecadoStatus(req.params.id, status, updatedBy);
      req.app.get('io').emit('recadoUpdated', recado);
      res.status(200).json(recado);
    } catch (error) {
      console.error('Error updating recado status:', error);
      res.status(500).json({ message: 'Erro ao atualizar status do recado.' });
    }
  }

  async forwardRecado(req, res) {
    try {
      const { recadoId, newRegistrant, newRecipient, comment } = req.body;
      console.log('RECADOOOOO: ' + comment)

      if (!recadoId || !newRegistrant || !newRecipient) {
        return res.status(400).json({ message: 'ID do recado, novo registrante e novo destinatário são obrigatórios.' });
      }

      const recado = await recadoService.forwardRecado(recadoId, newRegistrant, newRecipient, comment);
      res.status(200).json(recado);
    } catch (error) {
      console.error('Error forwarding recado:', error);
      res.status(500).json({ message: 'Erro ao encaminhar recado.' });
    }
  }
}

module.exports = new RecadoController();