const Documento = require('./documentoModel');
const fs = require('fs');
const path = require('path');

const createDocumentoDBService = (documentoDetails, documentoFile) => {
    return new Promise((resolve, reject) => {
        console.log('Documento recebido para cadastro:', documentoDetails);
        console.log('Arquivo recebido para cadastro:', documentoFile);

        const { registrant, recipient, description } = documentoDetails;

        const novoDocumento = new Documento({
            registrant,
            recipient,
            description
        });

        // Salvar o arquivo no servidor (ou no seu armazenamento escolhido)
        // Supondo que 'documentoFile' seja o arquivo enviado no FormData
        const nomeArquivo = `${Date.now()}-${documentoFile.name}`;
        const caminhoArquivo = `uploads/${nomeArquivo}`; // Defina o caminho onde o arquivo será salvo

        // Salvar o arquivo localmente (exemplo simples)
        fs.writeFile(caminhoArquivo, documentoFile.data, err => {
            if (err) {
                console.error('Erro ao salvar arquivo:', err);
                reject(false);
                return;
            }

            console.log('Arquivo salvo com sucesso:', caminhoArquivo);

            // Se o arquivo foi salvo com sucesso, salvar o documento no MongoDB
            novoDocumento.documentFile = caminhoArquivo; // Adicionando o caminho do arquivo ao documento

            novoDocumento.save()
                .then(result => {
                    console.log('Documento cadastrado com sucesso:', result);
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
