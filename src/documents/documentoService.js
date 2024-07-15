const Documento = require('./documentoModel');

const createDocumentoDBService = (documentoDetails, documentoFile) => {
  return new Promise((resolve, reject) => {
    const { registrant, recipient, description } = documentoDetails;

    if (!documentoFile || !documentoFile.location) {
      reject(new Error('Arquivo inválido ou não enviado.'));
      return;
    }

    const novoDocumento = new Documento({
      registrant,
      recipient,
      description,
      documentFile: documentoFile.location // Caminho do arquivo no S3
    });

    novoDocumento.save()
      .then(result => {
        resolve(true);
      })
      .catch(error => {
        console.error('Erro ao cadastrar documento:', error);
        reject(error);
      });
  });
}

module.exports = { createDocumentoDBService };
