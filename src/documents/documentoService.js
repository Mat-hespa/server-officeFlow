const Documento = require('./documentoModel');
const fs = require('fs');

const createDocumentoDBService = (documentoDetails, documentoFile) => {
  return new Promise((resolve, reject) => {
    const { registrant, recipient, description } = documentoDetails;

    const novoDocumento = new Documento({
      titulo: 'Título Padrão', // Defina um título padrão ou remova se não for necessário
      descricao: description,
      destinatario: recipient,
      dataCadastro: new Date()
    });

    const nomeArquivo = `${Date.now()}-${documentoFile.name}`;
    const caminhoArquivo = `uploads/${nomeArquivo}`;

    fs.writeFile(caminhoArquivo, documentoFile.data, err => {
      if (err) {
        console.error('Erro ao salvar arquivo:', err);
        reject(false);
        return;
      }

      novoDocumento.save()
        .then(result => {
          resolve(true);
        })
        .catch(error => {
          console.error('Erro ao cadastrar documento:', error);
          reject(false);
        });
    });
  });
}

module.exports = { createDocumentoDBService };
