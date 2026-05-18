const Evento = require("./models/Evento")

async function registrarEvento(dados) {
    await Evento.create(dados)
}

module.exports = registrarEvento