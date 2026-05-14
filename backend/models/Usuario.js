const mongoose = require("mongoose")

const usuarioSchema = new mongoose.Schema({

    nome: String,

    email: String,

    senha: String,

    codigo: String,

    role: {
        type: String,
        default: "influencer"
    }
})

module.exports =
    mongoose.model("Usuario", usuarioSchema)