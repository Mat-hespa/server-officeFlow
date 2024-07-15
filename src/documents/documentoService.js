const Documento = require('./documentoModel');

const createDocumentoDBService = (documentoDetails, documentoFile) => {
    return new Promise((resolve, reject) => {
        const { registrant, recipient, description } = documentoDetails;

        const novoDocumento = new Documento({
            registrant,
            recipient,
            description,
            documentFile: documentoFile.location // URL do arquivo no S3
        });

        novoDocumento.save()
            .then(() => {
                resolve(true);
            })
            .catch(error => {
                console.error('Erro ao cadastrar documento:', error);
                reject(error);
            });
    });
}

module.exports = { createDocumentoDBService };
