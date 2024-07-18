const mongoose = require("mongoose");

const recadoSchema = new mongoose.Schema({
  emailRemetente: {
     type: String, 
     required: true 
    },
  emailDestinatario: {
     type: String, 
     required: true 
    },
  mensagem: { 
     type: String, 
     required: true 
    },
  read: { 
     type: Boolean, 
     default: false 
    },
});

const Recado = mongoose.model("Recado", recadoSchema);

module.exports = Recado;
