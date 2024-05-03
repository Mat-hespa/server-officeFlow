var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var studentSchema = new Schema({
    nomeCompleto: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('student', studentSchema);