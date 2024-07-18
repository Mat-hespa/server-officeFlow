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

  // Outros métodos de serviço, se necessário
}

module.exports = new RecadoService();