const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const documentoService = require('./documentoService');

// Configurar AWS S3
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
});

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
