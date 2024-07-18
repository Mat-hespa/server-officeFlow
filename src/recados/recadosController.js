// controllers/recadoController.js
const recadoService = require('./recadosService');

class RecadoController {
  async createRecado(req, res) {
    try {
      const recado = await recadoService.createRecado(req.body);
      res.status(201).send(recado);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getRecadosByDestinatario(req, res) {
    try {
      const emailDestinatario = req.params.email;
      const recados = await recadoService.getRecadosByDestinatario(emailDestinatario);
      res.status(200).send({ recados });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async countUnreadRecados(req, res) {
    try {
      const emailDestinatario = req.params.email;
      const unreadCount = await recadoService.countUnreadRecados(emailDestinatario);
      res.status(200).send({ unreadCount });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async markAsRead(req, res) {
    try {
      const recadoId = req.params.id;
      const recado = await recadoService.markAsRead(recadoId);
      res.status(200).send(recado);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

module.exports = new RecadoController();