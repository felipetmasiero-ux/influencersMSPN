const mongoose = require("mongoose")

const produtoSchema = new mongoose.Schema ({
    nome: String,
    preco: Number,
    imagem: String
})

module.exports = mongoose.model("Produto", produtoSchema)