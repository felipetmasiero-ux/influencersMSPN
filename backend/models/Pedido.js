const mongoose = require("mongoose")

const pedidoSchema = new mongoose.Schema({

    codigo: String,

    cliente: String,

    produtos: [
        {
            nome: String,
            preco: Number,
            quantidade: Number
        }
    ],

    total: Number,

    status: {
        type: String,
        default: "Aprovado"
    },

    data: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Pedido", pedidoSchema)