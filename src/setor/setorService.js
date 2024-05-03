var setorModel = require('./setorModel');

const createSetorDBService = (setorDetails) => {
    return new Promise(function myFn(resolve, reject) {
        var setorModelData = new setorModel({
            empresa: setorDetails.empresa,
            nomeSetor: setorDetails.nomeSetor,
            descricao: setorDetails.descricao,
            responsavel: setorDetails.responsavel,
            contato: setorDetails.contato,
            status: setorDetails.status,
            tipoTelefoneResponsavel: setorDetails.tipoTelefoneResponsavel,
            numeroTelefoneResponsavel: setorDetails.numeroTelefoneResponsavel,
            descricaoTelefoneResponsavel: setorDetails.descricaoTelefoneResponsavel
        });

        setorModelData.save()
            .then(result => {
                resolve(true);
            })
            .catch(error => {
                reject(false);
            });
    });
}

const getSetoresByEmpresa = (nomeEmpresa) => {
    return setorModel.find({ empresa: nomeEmpresa }).exec()
        .then(setores => setores)
        .catch(error => {
            console.error('Erro ao buscar setores:', error);
            throw new Error('Erro ao buscar setores');
        });
}

const getAllSetoresDBService = () => {
    return setorModel.find({}).exec()
        .then(setores => setores.map(setor => setor.toObject()));
}

module.exports = { createSetorDBService, getSetoresByEmpresa, getAllSetoresDBService };

