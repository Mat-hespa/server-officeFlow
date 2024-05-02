var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
    razaoSocial: {
        type: String,
        required: true
    },
    nomeFantasia: {
        type: String,
        required: true
    },
    cnpj: {
        type: String,
        required: true
    },
    inscricaoEstadual: {
        type: String
    },
    inscricaoMunicipal: {
        type: String
    },
    observacoes: {
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
        type: String
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

module.exports = mongoose.model('Company', companySchema);