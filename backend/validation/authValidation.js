const { z } = require("zod")

const registroSchema = z.object({

    nome: z
        .string()
        .min(3, "Nome muito curto"),

    email: z
        .string()
        .email("Email inválido"),

    senha: z
        .string()
        .min(6, "Senha muito curta"),

    codigo: z
        .string()
        .optional()
})

const loginSchema = z.object({

    email: z
        .string()
        .email("Email inválido"),

    senha: z
        .string()
        .min(6, "Senha muito curta")
})

module.exports = {
    registroSchema,
    loginSchema
}