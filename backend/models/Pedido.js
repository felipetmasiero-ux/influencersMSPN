const mongoose = require("mongoose")

const pedidoSchema = new mongoose.Schema({

    userId: String,

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
    }

},
{
    timestamps: true
})

module.exports = mongoose.model("Pedido", pedidoSchema)