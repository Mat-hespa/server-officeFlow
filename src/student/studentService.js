// studentService.js

const studentModel = require('./studentModel');
const key = '123456789trytryrtyr';
const encryptor = require('simple-encryptor')(key);

const createStudentDBService = (studentDetails) => {
    return new Promise((resolve, reject) => {
        const studentModelData = new studentModel({
            nomeCompleto: studentDetails.nomeCompleto,
            email: studentDetails.email,
            password: studentDetails.password,
            cargo: 'user' // Defina o cargo como 'user' por padrão
        });

        // Encrypt the password before saving
        const encrypted = encryptor.encrypt(studentDetails.password);
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

const loginuserDBService = (studentDetails) => {
    return new Promise((resolve, reject) => {
        studentModel.findOne({ email: studentDetails.email })
            .then(result => {
                if (result) {
                    const decrypted = encryptor.decrypt(result.password);
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

// const getCargoByEmail = (email) => {
//     return new Promise((resolve, reject) => {
//         studentModel.findOne({ email: email })
//             .then(result => {
//                 console.log(result)
//                 if (result) {
//                     resolve(result.cargo);
//                 } else {
//                     reject({ status: false, msg: "Student not found with given email" });
//                 }
//             })
//             .catch(error => {
//                 reject({ status: false, msg: "Error occurred while fetching student details" });
//             });
//     });
// }

const getCargoByEmail = (email) => {
    return studentModel.find({ email: email }).exec()
        .then(contas => {
            // console.log('Contas encontradas:', contas);
            return contas[0].cargo;
        })
        .catch(error => {
            console.error('Erro ao buscar contas:', error);
            throw new Error('Erro ao buscar contas');
        });
}

const getStudentByEmailDBService = (email) => {
    return studentModel.findOne({ email: email }).exec();
}

module.exports = { createStudentDBService, loginuserDBService, getCargoByEmail, getStudentByEmailDBService };
