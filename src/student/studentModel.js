var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var studentSchema = new Schema({
    nomeCompleto: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cargo: { // Adicione este campo
        type: String,
        required: true,
        default: 'user' // Valor padrão para novos usuários
    }
});
module.exports = mongoose.model('student', studentSchema);