const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const Chamado = require('./chamadoModel');

// Configurando o cliente S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

// Configurando o multer com multer-s3
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
  

// Função de criação de chamado
async function createChamadoControllerFn(req, res) {
  try {
    const { solicitante, titulo, ocorrencia, descricao, prioridade } = req.body;
    const anexosUrls = req.files.map(file => file.location);

    const novoChamado = new Chamado({
      solicitante,
      titulo,
      ocorrencia,
      descricao,
      prioridade,
      anexos: anexosUrls,
      history: [
        {
          status: 'aberto',
          updatedAt: Date.now(),
          updatedBy: solicitante,
          comment: descricao
        }
      ]
    });

    const chamadoSalvo = await novoChamado.save();
    res.status(201).json({ message: 'Chamado cadastrado com sucesso!', chamado: chamadoSalvo });
  } catch (error) {
    console.error('Erro ao cadastrar chamado:', error);
    res.status(500).json({ message: 'Erro ao cadastrar chamado.' });
  }
}

// Adicionar método para buscar chamados no controller
async function getAllChamadosControllerFn(req, res) {
    try {
      const chamados = await Chamado.find();
      res.status(200).json(chamados);
    } catch (error) {
      console.error('Erro ao buscar chamados:', error);
      res.status(500).json({ message: 'Erro ao buscar chamados.' });
    }
  }
  
  async function updateChamadoControllerFn(req, res) {
    try {
      const { status, comment } = req.body;
      const chamado = await Chamado.findById(req.params.id);
  
      if (!chamado) {
        return res.status(404).json({ message: 'Chamado não encontrado.' });
      }
  
      // Atualiza o status e adiciona um comentário no histórico
      chamado.status = status;
      chamado.history.push({
        status,
        updatedAt: Date.now(),
        updatedBy: req.body.updatedBy,  // Captura o usuário do corpo da requisição
        comment
      });
  
      const chamadoAtualizado = await chamado.save();
      res.status(200).json(chamadoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar o chamado:', error);
      res.status(500).json({ message: 'Erro ao atualizar o chamado.' });
    }
  }

module.exports = {
  upload,  // Certifique-se de que está exportando o 'upload' corretamente
  createChamadoControllerFn,
  updateChamadoControllerFn,
  getAllChamadosControllerFn,
};
