const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentoSchema = new Schema({
    registrant: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    documentFile: {
        type: String, // Vamos armazenar o caminho do arquivo no MongoDB
        required: true
    },
});

module.exports = mongoose.model('Documento', documentoSchema);
