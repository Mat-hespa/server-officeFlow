const documentoService = require('./documentoService');
const { Server } = require('socket.io');

// Importe o seu modelo de documento
const Documento = require('./documentoModel');

// Configuração do Socket.io no seu backend
let io;

function setupSocketIO(server) {
    const io = socketIO(server);

    io.use((socket, next) => {
        // Middleware CORS para Socket.io
        const origin = socket.handshake.headers.origin;
        if (origin === process.env.CORS_ORIGIN || origin === process.env.CORS_ORIGIN_ANDROID) {
            return next();
        }
        return next(new Error('Not allowed by CORS'));
    });

    io.on('connection', (socket) => {
        console.log('Novo cliente conectado');
        // Lógica para lidar com eventos de socket
    });
}

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
