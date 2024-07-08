var studentService = require('./studentService');
const key = '123456789trytryrtyr';
const encryptor = require('simple-encryptor')(key);

var createStudentControllerFn = async (req, res) => 
{
    try
    {
    // console.log(req.body);
    var status = await studentService.createStudentDBService(req.body);
    // console.log(status);

    if (status) {
        res.send({ "status": true, "message": "Student created successfully" });
    } else {
        res.send({ "status": false, "message": "Error creating user" });
    }
}
catch(err)
{
    // console.log(err);
}
}

var loginUserControllerFn = async (req, res) => {
    var result = null;
    try {
        result = await studentService.loginuserDBService(req.body);
        if (result.status) {
            const token = generateToken(req.body.email); // Função para gerar o token JWT
            res.send({ "status": true, "message": token });
        } else {
            res.send({ "status": false, "message": result.msg });
        }

    } catch (error) {
        // console.log(error);
        res.send({ "status": false, "message": error.msg });
    }
}

function generateToken(email) {
    // Aqui você deve implementar a lógica para gerar o token JWT usando uma biblioteca como jsonwebtoken
    // Exemplo simples:
    const jwt = require('jsonwebtoken');
    const secret = 'seu-segredo-secreto'; // Substitua por uma chave segura
    return jwt.sign({ email }, secret, { expiresIn: '1h' }); // Expira em 1 hora, ajuste conforme necessário
}


const getCargoControllerFn = async (req, res) => {
    try {
        const email = req.params.user;
        // console.log(email)
        const cargo = await studentService.getCargoByEmail(email);
        res.send({ "status": true, "cargo": cargo });
    } catch (error) {
        // console.log(error);
        res.status(500).send({ "status": false, "message": "Internal server error" });
    }
}

const getStudentByEmailControllerFn = async (req, res) => {
    try {
        const email = req.params.user;
        const student = await studentService.getStudentByEmailDBService(email);
        
        const decryptedPassword = encryptor.decrypt(student.password);
        console.log(decryptedPassword)
        const passwordLength = decryptedPassword.length;
        console.log(passwordLength)

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