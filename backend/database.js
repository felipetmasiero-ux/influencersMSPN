const mongoose = require("mongoose")

const vendaSchema = new mongoose.Schema({

    codigo: String,

    total: {
        type: Number,
        default: 0
    },

    pedidos: {
        type: Number,
        default: 0
    },

    comissao: {
        type: Number,
        default: 0
    },

    historico: [
        {
            valor: Number,

            data: {
                type: Date,
                default: Date.now
            }
        }
    ],

    pedidosDetalhados: [
        {
            produto: String,
            valor: Number,
            quantidade: Number,

            data: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

const Venda = mongoose.models.Venda || mongoose.model("Venda", vendaSchema)

module.exports = Venda