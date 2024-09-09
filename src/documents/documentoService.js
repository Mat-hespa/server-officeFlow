const Documento = require('./documentoModel');

const createDocumentoDBService = (documentoDetails, documentoFile) => {
  return new Promise((resolve, reject) => {
    let { registrant, recipient, description } = documentoDetails;

    if (!documentoFile || !documentoFile.location) {
      reject(new Error('Arquivo inválido ou não enviado.'));
      return;
    }

    // Garantir que recipient seja um array
    recipient = typeof recipient === 'string' ? JSON.parse(recipient) : recipient;

    const novoDocumento = new Documento({
      registrant,
      recipient,
      description,
      fileUrl: documentoFile.location, // Caminho do arquivo no S3
      status: 'inicial',
      history: [{ status: 'inicial', updatedBy: registrant }],
      readBy: recipient.map(email => ({ recipient: email, read: false })) // Inicializa o estado de leitura
    });

    console.log(!novoDocumento.recipient.includes(registrant))
    console.log(!novoDocumento.recipient.includes(registrant[0]))

    // Adicionar o registrant ao array de recipient, se ainda não estiver presente
    if (!novoDocumento.recipient.includes(registrant[0])) {
      novoDocumento.recipient.push(registrant);
      // Também adiciona ao estado de leitura (readBy)
      novoDocumento.readBy.push({ recipient: registrant, read: false });
    }

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

const forwardDocument = (documentoId, newRegistrant, newRecipient, comment) => {
  return new Promise((resolve, reject) => {
    Documento.findById(documentoId)
      .then(documento => {
        if (!documento) {
          reject(new Error('Documento não encontrado.'));
          return;
        }

        // Adiciona novos registrantes e destinatários
        documento.registrant.push(newRegistrant);
        documento.recipient.push(newRecipient);
        documento.status = 'encaminhado';

        // Adiciona uma nova entrada no histórico com o comentário
        documento.history.push({ 
          status: 'encaminhado', 
          updatedBy: newRegistrant,
          comment: comment // Inclui o novo comentário
        });

        // Adiciona o novo destinatário na lista de leitura
        documento.readBy.push({ recipient: newRecipient, read: false });

        return documento.save();
      })
      .then(updatedDocumento => {
        resolve(updatedDocumento);
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

const countUnreadDocumentos = (req, res) => {
  const { recipient } = req.params;

  Documento.countDocuments({ 'readBy.recipient': recipient, 'readBy.read': false })
    .then(count => {
      res.json({ unreadCount: count });
    })
    .catch(error => {
      console.error('Erro ao contar documentos não lidos:', error);
      res.status(500).json({ error: error.message });
    });
};

const markAsRead = (documentoId, recipientEmail) => {
  return new Promise((resolve, reject) => {
    Documento.findOneAndUpdate(
      { _id: documentoId, 'readBy.recipient': recipientEmail },
      { $set: { 'readBy.$.read': true } },
      { new: true }
    )
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