const Documento = require('./documentoModel');
const fs = require('fs');
const path = require('path');

const createDocumentoDBService = (documentoDetails, documentoFile) => {
    return new Promise((resolve, reject) => {
        const { registrant, recipient, description } = documentoDetails;

        // Salvar o arquivo no servidor
        const uploadDir = 'uploads';
        const nomeArquivo = `${Date.now()}-${documentoFile.originalname}`;
        const caminhoArquivo = path.join(uploadDir, nomeArquivo);

        fs.writeFile(caminhoArquivo, documentoFile.buffer, err => {
            if (err) {
                console.error('Erro ao salvar arquivo:', err);
                reject(false);
                return;
            }

            // Se o arquivo foi salvo com sucesso, salvar os dados no MongoDB
            const novoDocumento = new Documento({
                registrant,
                recipient,
                description,
                documentFile: caminhoArquivo // Salva o caminho do arquivo no MongoDB
            });

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
