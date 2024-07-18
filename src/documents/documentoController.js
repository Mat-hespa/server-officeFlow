const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const Documento = require('./documentoModel');
const documentoService = require('./documentoService');

// Configuração do AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Configuração do multer para upload para S3
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
      const filename = `${uuidv4()}.${ext}`;
      cb(null, filename);
    }
  })
});

// Controlador para criar um documento
async function createDocumentoControllerFn(req, res) {
  try {
    const { registrant, recipient, description } = req.body;
    const fileUrl = req.file.location;

    const novoDocumento = new Documento({
      registrant,
      recipient,
      description,
      fileUrl
    });

    const documentoSalvo = await novoDocumento.save();
    res.status(201).json({ message: 'Documento cadastrado com sucesso!', documento: documentoSalvo });
  } catch (error) {
    console.error('Erro ao cadastrar documento:', error);
    res.status(500).json({ message: 'Erro ao cadastrar documento.' });
  }
}

async function getDocumentosByRecipientControllerFn(req, res) {
  try {
    const { recipient } = req.params;
    const documentos = await documentoService.getDocumentosByRecipientService(recipient);
    res.status(200).json({ documentos });
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    res.status(500).json({ message: error.message || 'Erro ao buscar documentos.' });
  }
}

async function markAsRead(req, res) {
  try {
    const documentoId = req.params.id;
    const documento = await documentoService.markAsRead(documentoId);
    res.status(200).send(documento);
  } catch (error) {
    console.error('Erro ao marcar documento como lido:', error);
    res.status(500).json({ message: error.message || 'Erro ao marcar documento como lido.' });
  }
}

async function countUnreadDocumentos(req, res) {
  try {
    const recipientEmail = req.params.recipient;
    const unreadCount = await documentoService.countUnreadDocumentos(recipientEmail);
    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('Erro ao contar documentos não lidos:', error);
    res.status(500).json({ message: error.message || 'Erro ao contar documentos não lidos.' });
  }
}

module.exports = {
  upload,
  createDocumentoControllerFn,
  getDocumentosByRecipientControllerFn,
  markAsRead,
  countUnreadDocumentos
};