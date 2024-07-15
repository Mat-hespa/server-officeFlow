const Documento = require('./documentoModel');
const fs = require('fs');

const createDocumentoDBService = (documentoDetails, documentoFile) => {
    return new Promise((resolve, reject) => {
        const { registrant, recipient, description } = documentoDetails;

        const novoDocumento = new Documento({
            registrant,
            recipient,
            description,
            documentFile: documentoFile.path // Armazenar o caminho do arquivo
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
