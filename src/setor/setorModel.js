var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var setorSchema = new Schema({
    empresa: {
        type: String,
        required: true
    },
    nomeSetor: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    responsavel: {
        type: String
    },
    contato: {
        type: String
    },
    status: {
        type: String
    },
    tipoTelefoneResponsavel: {
        type: String
    },
    numeroTelefoneResponsavel: {
        type: String
    },
    descricaoTelefoneResponsavel: {
        type: String
    }
});

module.exports = mongoose.model('Setor', setorSchema);
