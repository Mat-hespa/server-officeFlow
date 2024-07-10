const Documento = require('./documentoModel');

const createDocumentoDBService = (documentoDetails) => {
    return new Promise((resolve, reject) => {
        const novoDocumento = new Documento({
            titulo: documentoDetails.titulo,
            descricao: documentoDetails.descricao,
            destinatario: documentoDetails.destinatario
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
}

module.exports = { createDocumentoDBService };
