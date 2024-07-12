const documentoService = require('./documentoService');

const createDocumentoControllerFn = async (req, res) => {
  try {
    console.log('Documento recebido para cadastro:', req.body);

    // Verificando se o arquivo foi enviado corretamente
    if (!req.files || !req.files.documentFile) {
      throw new Error('Arquivo inválido ou não enviado.');
    }

    const documentoFile = req.files.documentFile;
    const documentoDetails = req.body;

    const status = await documentoService.createDocumentoDBService(documentoDetails, documentoFile);
    
    if (status) {
      res.send({ "status": true, "message": "Documento cadastrado com sucesso" });
    } else {
      res.send({ "status": false, "message": "Erro ao cadastrar documento" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ "status": false, "message": err.message });
  }
}

module.exports = { createDocumentoControllerFn };
