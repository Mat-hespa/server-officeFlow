// companyService.js

const companyModel = require('./companyModel');

// Função para criar uma nova empresa no banco de dados
const createCompanyDBService = (companyDetails) => {
    return new Promise((resolve, reject) => {
        const companyModelData = new companyModel({
            razaoSocial: companyDetails.razaoSocial,
            nomeFantasia: companyDetails.nomeFantasia,
            cnpj: companyDetails.cnpj,
            inscricaoEstadual: companyDetails.inscricaoEstadual,
            inscricaoMunicipal: companyDetails.inscricaoMunicipal,
            observacoes: companyDetails.observacoes,
            tipoTelefone: companyDetails.tipoTelefone,
            numeroTelefone: companyDetails.numeroTelefone,
            descricaoTelefone: companyDetails.descricaoTelefone,
            email: companyDetails.email,
            descricaoEmail: companyDetails.descricaoEmail,
            cep: companyDetails.cep,
            cidade: companyDetails.cidade,
            estado: companyDetails.estado,
            bairro: companyDetails.bairro,
            logradouro: companyDetails.logradouro,
            numeroCasa: companyDetails.numeroCasa
        });

        companyModelData.save()
            .then(result => {
                resolve(true);
            })
            .catch(error => {
                reject(false);
            });
    });
}

// Função para buscar todas as empresas cadastradas no banco de dados
const getAllCompanyNamesDBService = () => {
    return companyModel.find({}, 'razaoSocial').exec()
        .then(companies => companies.map(company => ({ razaoSocial: company.razaoSocial })));
}

const getAllCompaniesDBService = () => {
    return companyModel.find({}).exec()
        .then(companies => companies.map(company => company.toObject()));
}

module.exports = { createCompanyDBService, getAllCompanyNamesDBService, getAllCompaniesDBService};
