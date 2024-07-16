const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const Documento = require('./documentoModel'); // Modelo do documento

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
    console.log('Arquivo recebido:', req.file); // Adicione este log
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

async function getDocumentosByRecipientControllerFn(req, res) {
  try {
    const { recipient } = req.params;
    const documentos = await getDocumentosByRecipientService(recipient);
    res.status(200).json({ documentos });
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    res.status(500).json({ message: error.message || 'Erro ao buscar documentos.' });
  }
}


module.exports = {
  upload,
  createDocumentoControllerFn,
  getDocumentosByRecipientControllerFn
};