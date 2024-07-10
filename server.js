const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./route/routes');
const { setupSocketIO } = require('./documentoController'); // Importe o método de setupSocketIO

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9992;

// Permitir requisições do frontend
app.use(cors({
    origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN_ANDROID]
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
    
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    // Configurar o Socket.io
    setupSocketIO(server);
});
