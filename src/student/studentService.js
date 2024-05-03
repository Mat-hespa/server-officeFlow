var studentModel = require('./studentModel');
var key = '123456789trytryrtyr';
var encryptor = require('simple-encryptor')(key);

module.exports.createStudentDBService = (studentDetails) => {
    return new Promise(function myFn(resolve, reject) {
        var studentModelData = new studentModel({
            nomeCompleto: studentDetails.nomeCompleto,
            email: studentDetails.email,
            password: studentDetails.password
        });

        // Encrypt the password before saving
        var encrypted = encryptor.encrypt(studentDetails.password);
        studentModelData.password = encrypted;

        studentModelData.save()
            .then(result => {
                resolve(true);
            })
            .catch(error => {
                reject(false);
            });
    });
}
module.exports.loginuserDBService = (studentDetails) => {
    return new Promise(function myFn(resolve, reject) {
        studentModel.findOne({ email: studentDetails.email })
            .then(result => {
                if (result) {
                    var decrypted = encryptor.decrypt(result.password);
                    if (decrypted == studentDetails.password) {
                        resolve({ status: true, msg: "Student Validated Successfully" });
                    } else {
                        reject({ status: false, msg: "Student Validation failed" });
                    }
                } else {
                    reject({ status: false, msg: "Student not found with given email" });
                }
            })
            .catch(error => {
                reject({ status: false, msg: "Error occurred while fetching student details" });
            });
    });
}
