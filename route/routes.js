var express = require('express');
var studentController = require('../src/student/studentController');
var companyController = require('../src/company/companyController');
var setorController = require('../src/setor/setorController')
var pessoaController = require('../src/pessoaFisica/pessoaController')
const router = express.Router();

// PARTE DE PESSOAS FISICAS
router.route('/pessoa/create').post(pessoaController.createPessoaControllerFn);

// PARTE DAS EMPRESAS
router.route('/company/create').post(companyController.createCompanyControllerFn);
router.route('/companies').get(companyController.getAllCompaniesControllerFn);

// PARTE DO SETOR
router.route('/setor/create').post(setorController.createSetorControllerFn);
router.route('/setor/:nomeEmpresa').get(setorController.getSetoresByEmpresaControllerFn)

// PARTE DO LOGIN
router.route('/student/login').post(studentController.loginUserControllerFn);
router.route('/student/create').post(studentController.createStudentControllerFn);
module.exports = router;