const documentoService = require('./documentoService');
const { Server } = require('socket.io');

// Importe o seu modelo de documento
const Documento = require('./documentoModel');

// Configuração do Socket.io no seu backend
let io;

const setupSocketIO = (server) => {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Cliente conectado ao Socket.io');

        socket.on('disconnect', () => {
            console.log('Cliente desconectado do Socket.io');
        });
    });
};

const createDocumentoControllerFn = async (req, res) => {
    try {
        const status = await documentoService.createDocumentoDBService(req.body);
        if (status) {
            const { destinatario } = req.body;

            // Emitir evento para o destinatário via Socket.io
            io.emit(`notificacao:${destinatario}`, { message: 'Novo documento cadastrado!' });

            res.send({ "status": true, "message": "Documento cadastrado com sucesso" });
        } else {
            res.send({ "status": false, "message": "Erro ao cadastrar documento" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ "status": false, "message": err.message });
    }
};

module.exports = { createDocumentoControllerFn, setupSocketIO };
