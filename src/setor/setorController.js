var setorService = require('./setorService');

var createSetorControllerFn = async (req, res) => {
    try {
        var status = await setorService.createSetorDBService(req.body);
        if (status) {
            res.send({ "status": true, "message": "Setor cadastrado com sucesso" });
        } else {
            res.send({ "status": false, "message": "Erro ao cadastrar setor" });
        }
    } catch (err) {
        console.log(err);
        res.send({ "status": false, "message": err.message });
    }
}

const getSetoresByEmpresaControllerFn = async (req, res) => {
    try {
        const nomeEmpresa = req.params.nomeEmpresa;
        const setores = await setorService.getSetoresByEmpresa(nomeEmpresa);
        console.log(setores)
        res.send({ "status": true, "setores": setores });
    } catch (err) {
        console.error(err);
        res.status(500).send({ "status": false, "message": err.message });
    }
}


module.exports = { createSetorControllerFn, getSetoresByEmpresaControllerFn };
