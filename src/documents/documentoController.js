const documentoService = require('./documentoService');
const multer = require('multer');

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const createDocumentoControllerFn = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('Arquivo inválido ou não enviado.');
        }

        const documentoFile = req.file;
        const documentoDetails = req.body;

        const status = await documentoService.createDocumentoDBService(documentoDetails, documentoFile);
        
        if (status) {
            res.send({ status: true, message: "Documento cadastrado com sucesso" });
        } else {
            res.send({ status: false, message: "Erro ao cadastrar documento" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: false, message: err.message });
    }
}

module.exports = { createDocumentoControllerFn, upload };
