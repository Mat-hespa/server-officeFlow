var studentService = require('./studentService');
const key = '123456789trytryrtyr';
const encryptor = require('simple-encryptor')(key);

var createStudentControllerFn = async (req, res) => 
{
    try
    {
    // (req.body);
    var status = await studentService.createStudentDBService(req.body);
    // (status);

    if (status) {
        res.send({ "status": true, "message": "Student created successfully" });
    } else {
        res.send({ "status": false, "message": "Error creating user" });
    }
}
catch(err)
{
    // (err);
}
}

var loginUserControllerFn = async (req, res) => {
    var result = null;
    try {
        result = await studentService.loginuserDBService(req.body);
        if (result.status) {
            res.send({ "status": true, "message": result.msg });
        } else {
            res.send({ "status": false, "message": result.msg });
        }

    } catch (error) {
        // (error);
        res.send({ "status": false, "message": error.msg });
    }
}

const getCargoControllerFn = async (req, res) => {
    try {
        const email = req.params.user;
        // (email)
        const cargo = await studentService.getCargoByEmail(email);
        res.send({ "status": true, "cargo": cargo });
    } catch (error) {
        // (error);
        res.status(500).send({ "status": false, "message": "Internal server error" });
    }
}

const getStudentByEmailControllerFn = async (req, res) => {
    try {
        const email = req.params.user;
        const student = await studentService.getStudentByEmailDBService(email);
        
        const decryptedPassword = encryptor.decrypt(student.password);
        (decryptedPassword)
        const passwordLength = decryptedPassword.length;
        (passwordLength)

        student.password = passwordLength


        res.send({ "status": true, "student": student});
    } catch (error) {
        console.error(error);
        res.status(500).send({ "status": false, "message": "Internal server error" });
    }
}

const changePasswordControllerFn = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Verificar se o usuário existe
        const student = await studentService.getStudentByEmailDBService(email);
        if (!student) {
            return res.status(404).send({ "status": false, "message": "Usuário não encontrado" });
        }

        // Atualizar a senha no banco de dados
        const encryptedNewPassword = encryptor.encrypt(newPassword);
        await studentService.updatePasswordByEmail(email, encryptedNewPassword);

        res.send({ "status": true, "message": "Senha atualizada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ "status": false, "message": "Erro interno do servidor" });
    }
}

module.exports = { createStudentControllerFn,loginUserControllerFn, getCargoControllerFn, getStudentByEmailControllerFn, changePasswordControllerFn };