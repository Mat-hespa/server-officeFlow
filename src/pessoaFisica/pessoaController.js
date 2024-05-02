const pessoaService = require('./pessoaService');

// Função para criar uma nova pessoa
const createPessoaControllerFn = async (req, res) => {
    try {
        const status = await pessoaService.createPessoaDBService(req.body);
        if (status) {
            res.send({ "status": true, "message": "Pessoa cadastrada com sucesso" });
        } else {
            res.send({ "status": false, "message": "Erro ao cadastrar pessoa" });
        }
    } catch (err) {
        console.error(err);
        res.send({ "status": false, "message": err.message });
    }
}

module.exports = { createPessoaControllerFn };
