const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const Documento = require('./documentoModel');
const documentoService = require('./documentoService');

const s3Client = new S3Client({
  // region: process.env.AWS_REGION,
  region: 'us-east-2',
  credentials: {
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessKeyId: 'AKIAU6GD2YTKYNGGHL3W',
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    secretAccessKey: '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'
  }
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    // bucket: process.env.AWS_BUCKET_NAME,
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
          status: 'encaminhado',
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

    console.log(novoDocumento)

    novoDocumento.recipient.push(registrant)

    console.log(novoDocumento)

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
    console.log(documentos)
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

const countUnreadDocumentos = (req, res) => {
  const { recipient } = req.params;

  if (!recipient) {
    return res.status(400).json({ error: 'Recipient email is required.' });
  }

  console.log(`Contando documentos não lidos para o destinatário: ${recipient}`);

  Documento.countDocuments({
    readBy: {
      $elemMatch: { recipient: recipient, read: false }
    }
  })
    .then(count => {
      console.log(`Documentos não lidos encontrados: ${count}`);
      res.json({ unreadCount: count });
    })
    .catch(error => {
      console.error('Erro ao contar documentos não lidos:', error);
      res.status(500).json({ error: error.message });
    });
};

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