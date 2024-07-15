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
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Documento', documentoSchema);
