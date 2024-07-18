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

  // Outros métodos de controlador, se necessáriox
}

module.exports = new RecadoController();