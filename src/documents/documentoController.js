const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Documento = require('./documentoModel'); // Modelo do documento

// Configuração do AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Configuração do multer para upload para S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read', // Permissão de leitura pública
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const ext = file.originalname.split('.').pop(); // Extensão do arquivo
      const filename = `${uuidv4()}.${ext}`; // Nome único do arquivo
      cb(null, filename);
    }
  })
});

// Controlador para criar um documento
async function createDocumentoControllerFn(req, res) {
  try {
    const { registrant, recipient, description } = req.body;
    const fileUrl = req.file.location; // URL do arquivo no S3

    // Cria o documento no MongoDB
    const novoDocumento = new Documento({
      registrant,
      recipient,
      description,
      fileUrl
    });

    // Salva o documento no MongoDB
    const documentoSalvo = await novoDocumento.save();

    res.status(201).json({ message: 'Documento cadastrado com sucesso!', documento: documentoSalvo });
  } catch (error) {
    console.error('Erro ao cadastrar documento:', error);
    res.status(500).json({ message: 'Erro ao cadastrar documento.' });
  }
}

module.exports = {
  upload,
  createDocumentoControllerFn
};
