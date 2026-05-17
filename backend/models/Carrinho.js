const mongoose = require("mongoose")

const CarrinhoSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true
    },

    produtos: [
        {
            id: String,

            nome: String,

            preco: Number,

            imagem: String,

            quantidade: Number
        }
    ]

})

module.exports =
    mongoose.model("Carrinho", CarrinhoSchema)