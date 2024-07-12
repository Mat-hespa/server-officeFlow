const Documento = require('./documentoModel');
const fs = require('fs'); // Importar o módulo 'fs' para manipulação de arquivos

const createDocumentoDBService = (documentoDetails, documentoFile) => {
    return new Promise((resolve, reject) => {
        // Extrair dados do documento
        const { titulo, descricao, destinatario } = documentoDetails;

        // Criar um novo documento com os dados recebidos
        const novoDocumento = new Documento({
            titulo,
            descricao,
            destinatario
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

            // Se o arquivo foi salvo com sucesso, salvar o documento no MongoDB
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
