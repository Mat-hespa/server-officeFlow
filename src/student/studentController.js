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
            res.send({ "status": true, "message": result.msg });
        } else {
            res.send({ "status": false, "message": result.msg });
        }

    } catch (error) {
        // console.log(error);
        res.send({ "status": false, "message": error.msg });
    }
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

module.exports = { createStudentControllerFn,loginUserControllerFn, getCargoControllerFn, getStudentByEmailControllerFn};