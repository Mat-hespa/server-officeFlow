const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pessoaSchema = new Schema({
    nomeCompleto: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    rg: {
        type: String,
        required: true
    },
    ctps: {
        type: String
    },
    dataNascimento: {
        type: Date
    },
    nacionalidade: {
        type: String
    },
    estadoCivil: {
        type: String
    },
    tipoTelefone: {
        type: String
    },
    numeroTelefone: {
        type: String
    },
    descricaoTelefone: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    descricaoEmail: {
        type: String
    },
    cep: {
        type: String
    },
    cidade: {
        type: String
    },
    estado: {
        type: String
    },
    bairro: {
        type: String
    },
    logradouro: {
        type: String
    },
    numeroCasa: {
        type: String
    },
});

module.exports = mongoose.model('Pessoa', pessoaSchema);
