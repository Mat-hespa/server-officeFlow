const pessoaService = require('./pessoaService');
const Pessoa = require('./pessoaModel');

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

// Função para buscar todas as pessoas cadastradas
const getAllPessoasObjectControllerFn = async (req, res) => {
    try {
        const pessoas = await pessoaService.getAllPessoasDBService();
        // console.log(pessoas);
        res.send({ "status": true, "pessoas": pessoas });
    } catch (err) {
        // console.log(err);
        res.status(500).send({ "status": false, "message": err.message });
    }
}

const getAllPessoasNameObjectControllerFn = async (req, res) => {
    try {
        const pessoasNames = await pessoaService.getAllPessoasNamesDBService();
        // console.log(pessoasNames);
        res.send({ "status": true, "pessoasNames": pessoasNames });
    } catch (err) {
        // console.log(err);
        res.status(500).send({ "status": false, "message": err.message });
    }
}

// Função para buscar os detalhes de uma pessoa pelo email
const getPessoaByEmailControllerFn = async (req, res) => {
    try {
        const email = req.params.email;
        const pessoa = await pessoaService.getPessoaByEmailDBService(email);
        // console.log(pessoa);
        if (pessoa) {
            res.send({ "status": true, "pessoa": pessoa });
        } else {
            res.send({ "status": false, "message": "Pessoa não encontrada" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ "status": false, "message": err.message });
    }
}

// Função para editar uma pessoa existente pelo email
const updatePessoaByEmailControllerFn = async (req, res) => {
    try {
      const email = req.params.email; // Obtém o email da pessoa da URL
      const pessoaData = req.body; // Obtém os dados da pessoa do corpo da requisição
  
      // Encontra a pessoa pelo email e atualiza os campos correspondentes
      await pessoaService.updatePessoaByEmailDBService(email, pessoaData);
  
      res.send({ "status": true, "message": "Pessoa editada com sucesso" });
    } catch (err) {
    //   console.error(err);
      res.status(500).send({ "status": false, "message": err.message });
    }
  }

const getPessoasPorSetor = async (req, res) => {
    try {
      const { setorNome } = req.params;
      const pessoas = await Pessoa.find({ setorEmprego: setorNome });
      console.log(setorNome)
      console.log(pessoas)
  
      if (!pessoas) {
        return res.status(404).json({ message: 'Nenhuma pessoa encontrada para este setor' });
      }
  
      res.status(200).json({ status: true, pessoas });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Erro ao buscar pessoas', error });
    }
  };
  
module.exports = { createPessoaControllerFn, getAllPessoasObjectControllerFn, getAllPessoasNameObjectControllerFn, getPessoaByEmailControllerFn, updatePessoaByEmailControllerFn, getPessoasPorSetor };
