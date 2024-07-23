var express = require('express');
var studentController = require('../src/student/studentController');
var companyController = require('../src/company/companyController');
var setorController = require('../src/setor/setorController')
var pessoaController = require('../src/pessoaFisica/pessoaController')
var documentController = require('../src/documents/documentoController')
var recadosController = require('../src/recados/recadosController')
const { upload } = require('../src/documents/documentoController');

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
router.route('/setore/tree').get(setorController.getSetoresTreeControllerFn);


// PARTE DO LOGIN
router.route('/student/login').post(studentController.loginUserControllerFn);
router.route('/student/create').post(studentController.createStudentControllerFn);
router.route('/student/:user/cargo').get(studentController.getCargoControllerFn)
router.route('/student/:user/').get(studentController.getStudentByEmailControllerFn)
router.route('/student/change-password').post(studentController.changePasswordControllerFn);


// PARTE DOS DOCUMENTOS
router.route('/api/documentos').post(documentController.upload.single('documentFile'), documentController.createDocumentoControllerFn);
router.route('/documentos/:recipient').get(documentController.getDocumentosByRecipientControllerFn);
router.patch('/documentos/:id/read', documentController.markAsRead);
router.get('/documentos/:recipient/unread', documentController.countUnreadDocumentos); // Rota para contar documentos não lidos
router.patch('/documentos/:id/status', documentController.updateDocumentStatusController);



// PARTE DOS RECADOS
router.post('/recados', (req, res) => recadosController.createRecado(req, res));
router.get('/recados/:email', (req, res) => recadosController.getRecadosByDestinatario(req, res));
router.get('/recados/:email/unread-count', (req, res) => recadosController.countUnreadRecados(req, res));
router.patch('/recados/:id/read', (req, res) => recadosController.markAsRead(req, res));  // Nova rota
router.patch('/recados/:id/status', (req, res) => recadosController.updateRecadoStatus(req, res));  // Nova rota

module.exports = router;
