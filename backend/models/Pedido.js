const mongoose = require("mongoose")

const pedidoSchema = new mongoose.Schema({

    userId: String,

    codigo: String,

    cliente: String,

    produtos: Array,

    total: Number,

    status: String,

    influencer: {
    type: String,
    default: null
}

}, {

    timestamps: true
})

module.exports = mongoose.model("Pedido", pedidoSchema)