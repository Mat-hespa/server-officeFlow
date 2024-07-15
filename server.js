const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./route/routes');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9992;

// Configurar AWS S3
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new aws.S3();

console.log('Bucket Name:', process.env.AWS_BUCKET_NAME); // Verifique se o nome do bucket está sendo carregado

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
});

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
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});