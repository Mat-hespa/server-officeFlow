var companyService = require('./companyService');

var createCompanyControllerFn = async (req, res) => {
    try {
        var status = await companyService.createCompanyDBService(req.body);
        if (status) {
            res.send({ "status": true, "message": "Company created successfully" });
        } else {
            res.send({ "status": false, "message": "Error creating company" });
        }
    } catch (err) {
        console.log(err);
        res.send({ "status": false, "message": err.message });
    }
}

// Função para buscar todas as empresas cadastradas
const getAllCompaniesControllerFn = async (req, res) => {
    try {
        const companies = await companyService.getAllCompanyNamesDBService();
        console.log(companies);
        res.send({ "status": true, "companies": companies });
    } catch (err) {
        console.log(err);
        res.status(500).send({ "status": false, "message": err.message });
    }
}

// Função para buscar todas as empresas cadastradas
const getAllCompaniesObjectControllerFn = async (req, res) => {
    try {
        const companies = await companyService.getAllCompaniesDBService();
        console.log(companies);
        res.send({ "status": true, "companies": companies });
    } catch (err) {
        console.log(err);
        res.status(500).send({ "status": false, "message": err.message });
    }
}

module.exports = { createCompanyControllerFn, getAllCompaniesControllerFn, getAllCompaniesObjectControllerFn}
