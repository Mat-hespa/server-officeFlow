const Documento = require('./documentoModel');

const createDocumentoDBService = (documentoDetails, documentoFile) => {
  return new Promise((resolve, reject) => {
    const { registrant, recipient, description } = documentoDetails;

    if (!documentoFile || !documentoFile.location) {
      reject(new Error('Arquivo inválido ou não enviado.'));
      return;
    }

    const novoDocumento = new Documento({
      registrant,
      recipient,
      description,
      fileUrl: documentoFile.location, // Caminho do arquivo no S3
      read: false,
      status: 'inicial',
      history: [{ status: 'inicial', updatedBy: registrant }]
    });

    novoDocumento.save()
      .then(result => {
        resolve(true);
      })
      .catch(error => {
        console.error('Erro ao cadastrar documento:', error);
        reject(error);
      });
  });
};

const updateDocumentStatus = (documentoId, status, updatedBy) => {
  return new Promise((resolve, reject) => {
    Documento.findById(documentoId)
      .then(documento => {
        if (!documento) {
          reject(new Error('Documento não encontrado.'));
          return;
        }
        documento.status = status;
        documento.history.push({ status, updatedBy });
        return documento.save();
      })
      .then(updatedDocumento => {
        resolve(updatedDocumento);
      })
      .catch(error => {
        console.error('Erro ao atualizar status do documento:', error);
        reject(error);
      });
  });
};

const forwardDocument = (documentoId, recipient) => {
  return new Promise((resolve, reject) => {
    Documento.findById(documentoId)
      .then(documento => {
        if (!documento) {
          reject(new Error('Documento não encontrado.'));
          return;
        }
        const novoDocumento = new Documento({
          ...documento._doc,
          recipient,
          status: 'encaminhado',
          history: [...documento.history, { status: 'encaminhado', updatedBy: documento.recipient }]
        });
        return novoDocumento.save();
      })
      .then(novoDocumento => {
        resolve(novoDocumento);
      })
      .catch(error => {
        console.error('Erro ao encaminhar documento:', error);
        reject(error);
      });
  });
};

const getDocumentosByRecipientService = (recipientEmail) => {
  return new Promise((resolve, reject) => {
    Documento.find({ recipient: recipientEmail })
      .then(documentos => {
        if (documentos.length === 0) {
          resolve([]);
        } else {
          resolve(documentos);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar documentos:', error);
        reject(error);
      });
  });
};

const countUnreadDocumentos = (recipientEmail) => {
  return new Promise((resolve, reject) => {
    if (!recipientEmail) {
      reject(new Error('Recipient email is required.'));
      return;
    }

    Documento.countDocuments({ recipient: recipientEmail, read: false })
      .then(count => {
        resolve(count);
      })
      .catch(error => {
        console.error('Erro ao contar documentos não lidos:', error);
        reject(error);
      });
  });
};

const markAsRead = (documentoId) => {
  return new Promise((resolve, reject) => {
    Documento.findByIdAndUpdate(documentoId, { read: true }, { new: true })
      .then(documento => {
        if (!documento) {
          reject(new Error('Documento não encontrado.'));
        } else {
          resolve(documento);
        }
      })
      .catch(error => {
        console.error('Erro ao marcar documento como lido:', error);
        reject(error);
      });
  });
};

module.exports = {
  createDocumentoDBService,
  getDocumentosByRecipientService,
  countUnreadDocumentos,
  markAsRead,
  updateDocumentStatus,
  forwardDocument
};