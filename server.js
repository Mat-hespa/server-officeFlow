const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./route/routes');

const app = express();
const PORT = 9992;

// Permitir requisições do http://localhost:4200
app.use(cors({
  origin: "http://localhost:4200"
}));

app.use(express.json());
app.use(routes);

mongoose.connect("mongodb://localhost:27017/abc", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('Error connecting to DB:', error);
});

db.once('open', () => {
    console.log('Successfully connected to DB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
