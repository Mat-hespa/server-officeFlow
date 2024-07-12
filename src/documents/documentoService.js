const Documento = require('./documentoModel');
const fs = require('fs');

const createDocumentoDBService = (documentoDetails, documentoFile) => {
  return new Promise((resolve, reject) => {
    const { registrant, recipient, description } = documentoDetails;

    if (!documentoFile || !documentoFile.name) {
      reject(new Error('Arquivo inválido ou não enviado.'));
      return;
    }

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
        reject(err);
        return;
      }

      novoDocumento.save()
        .then(result => {
          resolve(true);
        })
        .catch(error => {
          console.error('Erro ao cadastrar documento:', error);
          reject(error);
        });
    });
  });
}

module.exports = { createDocumentoDBService };
