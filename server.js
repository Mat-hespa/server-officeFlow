// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./route/routes');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 9992;

// Middleware para adicionar o io ao req
app.use((req, res, next) => {
  req.app.set('io', io);
  next();
});

// Permitir requisições do frontend
app.use(cors({
  origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN_ANDROID, process.env.CORS_ORIGIN_WEB]
}));

app.use(express.json());
app.use(routes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error connecting to DB:', error);
});

db.once('open', () => {
  console.log('Successfully connected to DB');
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Exemplo de evento de conexão socket.io
io.on('connection', (socket) => {
    console.log('Novo cliente conectado');
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
});



