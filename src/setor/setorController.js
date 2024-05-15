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
        // console.log(err);
        res.send({ "status": false, "message": err.message });
    }
}

const getSetoresByEmpresaControllerFn = async (req, res) => {
    try {
        const nomeEmpresa = req.params.nomeEmpresa;
        const setores = await setorService.getSetoresByEmpresa(nomeEmpresa);
        // console.log(setores)
        res.send({ "status": true, "setores": setores });
    } catch (err) {
        // console.error(err);
        res.status(500).send({ "status": false, "message": err.message });
    }
}

// Função para buscar todas as empresas cadastradas
const getAllSetoresObjectControllerFn = async (req, res) => {
    try {
        const setores = await setorService.getAllSetoresDBService();
        // console.log(setores);
        res.send({ "status": true, "setores": setores });
    } catch (err) {
        // console.log(err);
        res.status(500).send({ "status": false, "message": err.message });
    }
}

// Função para buscar os detalhes de uma pessoa pelo email
const getSetorByNameControllerFn = async (req, res) => {
    try {
        const nomeSetor = req.params.nomeSetor;
        const setor = await setorService.getSetorByNameDBService(nomeSetor);
        // console.log(setor);
        if (setor) {
            res.send({ "status": true, "setor": setor });
        } else {
            res.send({ "status": false, "message": "Pessoa não encontrada" });
        }
    } catch (err) {
        // console.error(err);
        res.status(500).send({ "status": false, "message": err.message });
    }
}

// Função para editar uma pessoa existente pelo email
const updateSetorByNameControllerFn = async (req, res) => {
    try {
      const nomeSetor = req.params.nomeSetor; // Obtém o email da pessoa da URL
      const setorData = req.body; // Obtém os dados da pessoa do corpo da requisição

      console.log(nomeSetor)
      console.log(setorData)
  
      // Encontra a pessoa pelo email e atualiza os campos correspondentes
      await setorService.updateSetorByNameDBService(nomeSetor, setorData);
  
      res.send({ "status": true, "message": "Setor editado com sucesso" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ "status": false, "message": err.message });
    }
  }

  const getSetoresTreeControllerFn = async (req, res) => {
    try {
        const setoresTree = await setorService.getSetoresTree();
        res.send({ "status": true, "setores": setoresTree });
    } catch (err) {
        console.error(err);
        res.status(500).send({ "status": false, "message": err.message });
    }
}


module.exports = { createSetorControllerFn, getSetoresByEmpresaControllerFn, getAllSetoresObjectControllerFn, getSetorByNameControllerFn, updateSetorByNameControllerFn, getSetoresTreeControllerFn };
