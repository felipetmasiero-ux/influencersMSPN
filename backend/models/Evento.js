const mongoose = require("mongoose")

const eventoSchema = new mongoose.Schema({
    type: String,

    influencer: {
        type: String,
        default: null
    },

    productId: {
        type: String,
        default: null
    },

    orderId: {
        type: String,
        default: null
    },

    value: {
        type: Number,
        default: 0
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports =
    mongoose.model("Evento", eventoSchema)