const mongoose = require("mongoose");

const documentoSchema = new mongoose.Schema(
  {
    registrant: { 
        type: String, 
        required: true 
    },
    recipient: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    fileUrl: { 
        type: String, 
        required: true 
    },
    read: { 
        type: Boolean, 
        default: false 
    },
  },
  { timestamps: true }
);

const Documento = mongoose.model("Documento", documentoSchema);

module.exports = Documento;