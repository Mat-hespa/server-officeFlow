const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentoSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String
    },
    destinatario: {
        type: String,
        required: true
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Documento', documentoSchema);
