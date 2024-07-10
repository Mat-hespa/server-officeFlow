const documentoService = require('./documentoService');

const createDocumentoControllerFn = async (req, res) => {
    try {
        const status = await documentoService.createDocumentoDBService(req.body);
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
