const pessoaModel = require('./pessoaModel');

// Função para criar uma nova pessoa no banco de dados
const createPessoaDBService = (pessoaDetails) => {
    return new Promise((resolve, reject) => {
        const pessoaModelData = new pessoaModel({
            nomeCompleto: pessoaDetails.nomeCompleto,
            cpf: pessoaDetails.cpf,
            rg: pessoaDetails.rg,
            ctps: pessoaDetails.ctps,
            dataNascimento: pessoaDetails.dataNascimento,
            nacionalidade: pessoaDetails.nacionalidade,
            estadoCivil: pessoaDetails.estadoCivil,
            tipoTelefone: pessoaDetails.tipoTelefone,
            numeroTelefone: pessoaDetails.numeroTelefone,
            descricaoTelefone: pessoaDetails.descricaoTelefone,
            email: pessoaDetails.email,
            descricaoEmail: pessoaDetails.descricaoEmail,
            cep: pessoaDetails.cep,
            cidade: pessoaDetails.cidade,
            estado: pessoaDetails.estado,
            bairro: pessoaDetails.bairro,
            logradouro: pessoaDetails.logradouro,
            numeroCasa: pessoaDetails.numeroCasa
        });

        pessoaModelData.save()
            .then(result => {
                resolve(true);
            })
            .catch(error => {
                reject(false);
            });
    });
}

module.exports = { createPessoaDBService };
