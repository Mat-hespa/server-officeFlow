const Chamado = require('./chamadoModel');

const createChamadoDBService = (chamadoDetails, anexos) => {
  return new Promise((resolve, reject) => {
    const { solicitante, titulo, ocorrencia, descricao, prioridade } = chamadoDetails;

    const novoChamado = new Chamado({
      solicitante,
      titulo,
      ocorrencia,
      descricao,
      prioridade,
      anexos, 
      status: 'aberto',
      history: [{ status: 'aberto', updatedBy: solicitante }]
    });

    novoChamado.save()
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

module.exports = {
  createChamadoDBService
};