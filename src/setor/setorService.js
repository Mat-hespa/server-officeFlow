var setorModel = require('./setorModel');

const createSetorDBService = (setorDetails) => {
    return new Promise(function myFn(resolve, reject) {
        var setorModelData = new setorModel({
            empresa: setorDetails.empresa,
            nomeSetor: setorDetails.nomeSetor,
            isSubSetor: setorDetails.isSubSetor,
            setorPai: setorDetails.setorPai,
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

const getSetorByNameDBService = (name) => {
    return setorModel.findOne({ nomeSetor: name }).exec()
        .then(pessoa => {
            if (pessoa) {
                console.log(pessoa)
                return pessoa.toObject();
            } else {
                return null; // Retorna null se a pessoa não for encontrada
            }
        });
}

const updateSetorByNameDBService = async (name, newData) => {
    // Verifica se o setor está sendo atualizado para não ser mais um subsetor
    const novoIsSubSetor = newData.isSubSetor;
    console.log('novoÉsubsetor, ', novoIsSubSetor)
    const wasSubsetor = await setorModel.findOne({ nomeSetor: name }).select('isSubSetor');
    console.log('wasSubsetor, ', wasSubsetor)
    const eraSubsetor = wasSubsetor.isSubSetor === 'sim';
    console.log('eraSubSetor, ', eraSubsetor)

    // Se o setor era um subsetor e agora não é mais, limpa o campo setorPai
    if (eraSubsetor && novoIsSubSetor === 'nao') {
        newData.setorPai = "";
    }
  
    // Atualiza os dados do setor no banco de dados
    return setorModel.findOneAndUpdate({ nomeSetor: name }, newData).exec();
}

const getSetoresTree = () => {
    return setorModel.find({}).exec()
        .then(setores => {
            const organizeSetoresInTree = (setores) => {
                let setorMap = new Map();

                // Inicializa cada setor no mapa
                setores.forEach(setor => {
                    setor.subSetores = [];
                    setorMap.set(setor.nomeSetor, setor);
                });

                // Constrói a árvore de setores
                let tree = [];
                setores.forEach(setor => {
                    if (setor.isSubSetor === 'sim' && setor.setorPai) {
                        setorMap.get(setor.setorPai).subSetores.push(setor);
                    } else {
                        tree.push(setor);
                    }
                });

                return tree;
            };

            const tree = organizeSetoresInTree(setores);
            const extractSetorNames = (setor) => ({
                nomeSetor: setor.nomeSetor,
                subSetores: setor.subSetores.map(extractSetorNames)
            });
            return tree.map(extractSetorNames);
        })
        .catch(error => {
            console.error('Erro ao buscar setores:', error);
            throw new Error('Erro ao buscar setores');
        });
}

module.exports = { createSetorDBService, getSetoresByEmpresa, getAllSetoresDBService, getSetorByNameDBService, updateSetorByNameDBService, getSetoresTree};

