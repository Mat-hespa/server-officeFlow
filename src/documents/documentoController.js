const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const Documento = require('./documentoModel');
const documentoService = require('./documentoService');

// Configurando o cliente S3
const s3Client = new S3Client({
  region: `us-east-2`,
  credentials: {
    accessKeyId: 'AKIAU6GD2YTKYNGGHL3W',
    secretAccessKey: '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'
  }
});

// Configurando o multer com multer-s3
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'officeflow',
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


async function createDocumentoControllerFn(req, res) {
  try {
    const { registrant, recipient, description } = req.body;
    const fileUrl = req.file.location;

    const novoDocumento = new Documento({
      registrant,
      recipient,
      description,
      fileUrl, 
      history: [
        {
          status: 'inicial',
          updatedAt: Date.now(),
          updatedBy: registrant,
          comment: description
        }
      ],
      readBy: [
        {
          recipient: recipient,
          read: false
        }
      ]
    });

    novoDocumento.recipient.push(registrant)

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
    (documentos)
    res.status(200).json({ documentos });
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    res.status(500).json({ message: error.message || 'Erro ao buscar documentos.' });
  }
}

const markAsRead = (req, res) => {
  const documentoId = req.params.id;
  const recipientEmail = req.body.recipientEmail;

  if (!documentoId || !recipientEmail) {
    return res.status(400).json({ error: 'Documento ID e email do destinatário são obrigatórios.' });
  }

  Documento.findOneAndUpdate(
    { _id: documentoId, 'readBy.recipient': recipientEmail },
    { $set: { 'readBy.$.read': true } },
    { new: true }
  )
    .then(documento => {
      if (!documento) {
        return res.status(404).json({ error: 'Documento não encontrado.' });
      } else {
        return res.json(documento);
      }
    })
    .catch(error => {
      console.error('Erro ao marcar documento como lido:', error);
      return res.status(500).json({ error: error.message });
    });
};

async function countUnreadDocumentos(req, res) {
  try {
    const recipient = req.params.recipient;
    ('emailDestinatario::::::::::::::', recipient);
    const unreadCount = await documentoService.countUnreadDocumentos(recipient);
    ('unreadCount:::::::::::::::::', unreadCount);
    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('Error counting unread recados:', error);
    res.status(500).json({ message: 'Erro ao contar recados não lidos.' });
  }
}

async function updateDocumentStatusController(req, res) {
  try {
    const { status, updatedBy } = req.body;
    const documento = await documentoService.updateDocumentStatus(req.params.id, status, updatedBy);
    req.app.get('io').emit('documentUpdated', documento);
    res.status(200).json(documento);
  } catch (error) {
    console.error('Erro ao atualizar status do documento:', error);
    res.status(500).json({ message: error.message || 'Erro ao atualizar status do documento.' });
  }
}

async function forwardDocumentController(req, res) {
  try {
    const { documentId, newRegistrant, newRecipient, comment} = req.body;
    const documento = await documentoService.forwardDocument(documentId, newRegistrant, newRecipient, comment);
    res.status(200).json(documento);
  } catch (error) {
    console.error('Erro ao encaminhar documento:', error);
    res.status(500).json({ message: error.message || 'Erro ao encaminhar documento.' });
  }
}

module.exports = {
  upload,
  createDocumentoControllerFn,
  getDocumentosByRecipientControllerFn,
  markAsRead,
  countUnreadDocumentos,
  updateDocumentStatusController,
  forwardDocumentController
};