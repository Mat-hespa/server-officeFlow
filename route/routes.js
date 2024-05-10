var express = require('express');
var studentController = require('../src/student/studentController');
var companyController = require('../src/company/companyController');
var setorController = require('../src/setor/setorController')
var pessoaController = require('../src/pessoaFisica/pessoaController')
const router = express.Router();

// PARTE DE PESSOAS FISICAS
router.route('/pessoa/create').post(pessoaController.createPessoaControllerFn);
router.route('/pessoas').get(pessoaController.getAllPessoasObjectControllerFn);
router.route('/namePessoas').get(pessoaController.getAllPessoasNameObjectControllerFn);
router.route('/pessoa/:email').get(pessoaController.getPessoaByEmailControllerFn);
router.route('/pessoa/:email/update').put(pessoaController.updatePessoaByEmailControllerFn);


// PARTE DAS EMPRESAS
router.route('/company/create').post(companyController.createCompanyControllerFn);
router.route('/companies').get(companyController.getAllCompaniesControllerFn); //por nome
router.route('/companiesObject').get(companyController.getAllCompaniesObjectControllerFn); // objeto inteiro de cada empresa


// PARTE DO SETOR
router.route('/setor/create').post(setorController.createSetorControllerFn);
router.route('/setor/:nomeEmpresa').get(setorController.getSetoresByEmpresaControllerFn)
router.route('/setores').get(setorController.getAllSetoresObjectControllerFn); // objeto inteiro de cada setor
router.route('/setores/:nomeSetor').get(setorController.getSetorByNameControllerFn);
router.route('/setor/:nomeSetor/update').put(setorController.updateSetorByNameControllerFn);



// PARTE DO LOGIN
router.route('/student/login').post(studentController.loginUserControllerFn);
router.route('/student/create').post(studentController.createStudentControllerFn);
router.route('/student/:user/cargo').get(studentController.getCargoControllerFn)
module.exports = router;