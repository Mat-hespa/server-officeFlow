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
            numeroCasa: pessoaDetails.numeroCasa,
            empresa: pessoaDetails.empresa,
            setorEmprego: pessoaDetails.setorEmprego,
            cargoEmprego: pessoaDetails.cargoEmprego,
        });

        console.log(pessoaModelData)

        pessoaModelData.save()
            .then(result => {
                resolve(true);
            })
            .catch(error => {
                reject(false);
            });
    });
}

const getAllPessoasDBService = () => {
    return pessoaModel.find({}).exec()
        .then(pessoas => pessoas.map(pessoa => pessoa.toObject()));
}

const getAllPessoasNamesDBService = () => {
    return pessoaModel.find({}, 'email').exec()
        .then(pessoasNames => pessoasNames.map(pessoa => ({ email: pessoa.email })));
}

const getPessoaByEmailDBService = (email) => {
    return pessoaModel.findOne({ email: email }).exec()
        .then(pessoa => {
            if (pessoa) {
                return pessoa.toObject();
            } else {
                return null; // Retorna null se a pessoa não for encontrada
            }
        });
}

const updatePessoaByEmailDBService = (email, newData) => {
    return pessoaModel.findOneAndUpdate({ email: email }, newData).exec();
  }

module.exports = { createPessoaDBService, getAllPessoasDBService, getAllPessoasNamesDBService, getPessoaByEmailDBService, updatePessoaByEmailDBService};
