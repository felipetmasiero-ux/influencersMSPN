require("dotenv").config()

const express = require("express")
const cors = require("cors")
const app = express()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const {
    registroSchema,
    loginSchema
} = require("./validation/authValidation")



const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB conectado 🚀"))
.catch(err => console.error("Erro ao conectar:", err))

const Usuario = require("./models/Usuario")
const Pedido = require("./models/Pedido")
const Venda = require("./database")
const Produto = require("./models/Produto")
const Evento = require("./models/Evento")
const registrarEvento = require("./registrarEvento")

const multer = require("multer")
const cloudinary = require("./config/cloudinary")

const storage = multer.memoryStorage()

const upload = multer({
    storage
})

app.use(cors({
    origin: [
        "https://influencers-mspn.vercel.app",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    credentials: true
}))
app.use(express.json())

const Carrinho = require("./models/Carrinho")

let cupons = [
    {codigo:"FELIPE10", desconto: 10},
    {codigo:"ANA15", desconto:15},
    {codigo:"JOAO5", desconto:5},
    {codigo:"MARIA20", desconto:20},
    {codigo:"LUCAS10", desconto:10},
    {codigo:"CARLA25", desconto:25},
    {codigo:"PEDRO8", desconto:8},
]

const TAXA_COMISSAO = 0.1

function autenticar(req, res, next) {

    const authHeader =
        req.headers.authorization

    if (!authHeader) {

        return res.status(401).json({
            erro: "Token não enviado"
        })
    }

    const token =
        authHeader.split(" ")[1]

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.usuario = decoded

        next()

    } catch {

        return res.status(401).json({
            erro: "Token inválido"
        })
    }
}

function admin(req, res, next) {

    if (req.usuario.role !== "admin") {

        return res.status(403).json({
            erro: "Acesso negado"
        })
    }

    next()
}

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀")
})

app.get("/carrinho", autenticar, async (req, res) => {

    const userId = req.usuario.id

    let carrinho =
        await Carrinho.findOne({ userId })

    if (!carrinho) {

        carrinho =
            await Carrinho.create({
                userId,
                produtos: []
            })
    }

    res.json(carrinho.produtos)
})

app.post("/carrinho", autenticar, async (req, res) => {
    const userId = req.usuario.id

    let carrinho =
    await Carrinho.findOne({ userId })

    if (!carrinho) {

        carrinho =
            await Carrinho.create({
                userId,
                produtos: []
            })
    }

  const { id } = req.body


  const produto = await Produto.findById(id)

  if (!produto) {
    return res.status(400).json({ erro:"Produto inválido" })
  }

  let item = carrinho.produtos.find(p => p.id.toString() === id.toString())

  if (item) {
    item.quantidade++
  } else { carrinho.produtos.push({
    id: produto._id.toString(),
    nome: produto.nome,
    preco: Number(produto.preco),
    imagem: produto.imagem,
    quantidade: 1
    })
    }

    await registrarEvento({

    type: "ADD_TO_CART",

    influencer: null,

    productId: produto.id
    })

  await carrinho.save()

  res.json(carrinho.produtos)
})

app.patch("/carrinho/:id", autenticar, async (req, res) => {

    const userId = req.usuario.id

    const carrinho =
        await Carrinho.findOne({ userId })

    if (!carrinho) {
        return res.status(404).json({
            erro: "Carrinho não encontrado"
        })
    }

    const { id } = req.params
    const { acao } = req.body

    let item =
        carrinho.produtos.find(
            p => p.id.toString() === id.toString()
        )

    if (!item) {
        return res.status(400).json({
            erro: "Item não encontrado"
        })
    }

    if (acao === "aumentar") {
        item.quantidade++
    }

    if (acao === "diminuir") {
        item.quantidade--
    }

    carrinho.produtos =
        carrinho.produtos.filter(
            p => p.quantidade > 0
        )

    await carrinho.save()

    res.json(carrinho.produtos)
})

app.delete("/carrinho/:id", autenticar, async (req, res) => {

    const userId = req.usuario.id

    const carrinho =
        await Carrinho.findOne({ userId })

    if (!carrinho) {
        return res.status(404).json({
            erro: "Carrinho não encontrado"
        })
    }

    const { id } = req.params

    carrinho.produtos =
        carrinho.produtos.filter(
            p => p.id.toString() !== id.toString()
        )

    await carrinho.save()

    res.json(carrinho.produtos)
})

app.post("/cupom", async (req, res) => {
    const codigo = req.body.codigo?.trim().toUpperCase()
    const cupom = cupons.find(c => c.codigo === codigo)
    if (!cupom) {
        return res.status(404).json({ erro: "Cupom inválido"})
    }

    await registrarEvento({

    type: "APPLY_COUPON",

    influencer: cupom.codigo
    })

    res.json(cupom)
    })

// Função de cálculo compartilhada
function calcularResumo(carrinho, codigo) {
    let subtotal = carrinho.reduce((acc, item) => {
        const preco = Number(item.preco) || 0
        const quantidade = Number(item.quantidade) || 0
        return acc + (preco * quantidade)
    }, 0)    
    let desconto = 0
    let cupomAplicado = null

    if (codigo) {
        const cupom = cupons.find(c => c.codigo === codigo)
        if (cupom) {
            desconto = subtotal * (cupom.desconto / 100)
            cupomAplicado = cupom.codigo
        }
    }

    return {
        subtotal,
        desconto,
        totalFinal: subtotal - desconto,
        cupom: cupomAplicado
    }
}

// /resumo usa a função
app.post("/resumo", autenticar, async (req, res) => {

    const userId = req.usuario.id

    const carrinho =
        await Carrinho.findOne({ userId })

    const produtos =
        carrinho?.produtos || []

    const { codigo } = req.body

    res.json(
        calcularResumo(produtos, codigo)
    )
})

// /finalizar também usa a mesma função
app.post("/finalizar", autenticar, async (req, res) => {
    try {
        const usuario =
            await Usuario.findById(req.usuario.id)

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            })
        }
        const { codigo } = req.body

        const userId = req.usuario.id
        const carrinho =
             await Carrinho.findOne({ userId })

        const produtos =
            carrinho?.produtos || []

        if (produtos.length === 0) {
            return res.status(400).json({ erro: "Carrinho vazio" })
        }

        const resumo = calcularResumo(produtos, codigo)

    if (resumo.cupom) {
        let venda = await Venda.findOne({ codigo: resumo.cupom });

    if (!venda) {
        // Cria uma nova venda com valores zerados se o cupom for novo
        venda = new Venda({
            codigo: resumo.cupom,
            total: 0,
            pedidos: 0,
            comissao: 0
        });
    }

    // Garante que os valores são números antes de somar
    venda.total = (venda.total || 0) + resumo.totalFinal;

    venda.pedidos = (venda.pedidos || 0) + 1;

    // adiciona venda no histórico
    venda.historico.push({
    valor: resumo.totalFinal,
    data: new Date()
    })

    

    let comissaoCalculada = resumo.totalFinal * TAXA_COMISSAO;

    venda.comissao = (venda.comissao || 0) + comissaoCalculada;

    await venda.save();
    }

    const pedido = await Pedido.create({

    userId: req.usuario.id,

    codigo: resumo.cupom,

    cliente: usuario.email,

    produtos: produtos,

    total: resumo.totalFinal,

    status: "Aprovado"
})

    await registrarEvento({

        type: "PURCHASE",

        influencer: resumo.cupom || null,

        value: resumo.totalFinal,

        orderId: pedido._id
    })

    carrinho.produtos = []

    await carrinho.save()
    
    res.json({ mensagem: "Compra finalizada!", ...resumo })

    } catch (erro) {
        console.error("ERRO NO FINALIZAR:", erro)
        res.status(500).json({ erro: "Erro interno no servidor" })
    }

})

app.get("/vendas", async (req, res) => {
    const vendas = await Venda.find()
    res.json(vendas)
})

app.get(
    "/influencer",
    autenticar,
    async (req, res) => {

    const codigo = req.usuario.codigo

    const venda = await Venda.findOne({ codigo })

    if (!venda) {
        return res.status(404).json({
            codigo,
            total: 0,
            pedidos: 0,
            comissao: 0,
            ticketMedio: 0
        })
    }

    const ticketMedio =
        venda.pedidos > 0
            ? venda.total / venda.pedidos
            : 0

    res.json({
        ...venda.toObject(),
        ticketMedio
    })
})

app.get("/produtos", async (req, res) => {
    const produtos = await Produto.find()
    res.json(produtos)
})

app.get(
    "/grafico",
    autenticar,

    async (req, res) => {

        const codigo = req.usuario.codigo

    const venda = await Venda.findOne({ codigo })

    if (!venda) {
        return res.json([])
    }

    res.json(venda.historico)
})

app.get("/ranking", async (req, res) => {

    const ranking = await Venda.find()
        .sort({ total: -1 })

    res.json(ranking)
})

app.get(
    "/pedidos",
    autenticar,

    async (req, res) => {

    const pedidos =
        await Pedido.find({
            userId: req.usuario.id
        })

    res.json(pedidos)
})

app.post("/registro", async (req, res) => {

    const validacao =
    registroSchema.safeParse(req.body)

    if (!validacao.success) {

        return res.status(400).json({
            erro: validacao.error.errors[0].message
        })
    }

    const {
        nome,
        email,
        senha,
        codigo
    } = validacao.data

    const usuarioExiste =
        await Usuario.findOne({ email })

    if (usuarioExiste) {
        return res.status(400).json({
            erro: "Email já existe"
        })
    }

    const senhaHash =
        await bcrypt.hash(senha, 10)

    const usuario = await Usuario.create({

    nome,

    email,

    senha: senhaHash,

    codigo,

    role: "user"
})

    res.json({
        mensagem: "Usuário criado"
    })
})

app.post("/login", async (req, res) => {

    const validacao =
    loginSchema.safeParse(req.body)

    if (!validacao.success) {

        return res.status(400).json({
            erro: validacao.error.errors[0].message
        })
    }

    const {
        email,
        senha
    } = validacao.data

    const usuario =
        await Usuario.findOne({ email })

    if (!usuario) {
        return res.status(400).json({
            erro: "Usuário não encontrado"
        })
    }

    const senhaCorreta =
        await bcrypt.compare(
            senha,
            usuario.senha
        )

    if (!senhaCorreta) {
        return res.status(400).json({
            erro: "Senha incorreta"
        })
    }

    const token = jwt.sign({
    id: usuario._id,
    nome: usuario.nome,
    email: usuario.email,
    codigo: usuario.codigo,
    role: usuario.role
    },

process.env.JWT_SECRET,

{
    expiresIn: "7d"
}
)

    res.json({
        token,
        usuario
    })
})

app.post(
    "/admin/produto",
    autenticar,
    admin,

    async (req, res) => {
    const { nome, preco, imagem } = req.body

    const produto = await Produto.create({
        nome,
        preco,
        imagem
    })

    res.json(produto)
})

app.delete(
    "/admin/produto/:id",
    autenticar,
    admin,

    async (req, res) => {
    const { id } = req.params

    await Produto.findByIdAndDelete(id)

    res.json({
        mensagem: "Produto deletado"
    })
})

app.put(
    "/admin/produto/:id",
    autenticar,
    admin,

    async (req, res) => {

        const { id } = req.params

        const {
            nome,
            preco,
            imagem
        } = req.body

        const produto =
            await Produto.findByIdAndUpdate(

                id,

                {
                    nome,
                    preco,
                    imagem
                },

                { new: true }
            )

        res.json(produto)
})

app.get(
    "/admin/analytics",
    autenticar,
    admin,

    async (req, res) => {

        try {

            const vendas =
                await Venda.find()

            const pedidos =
                await Pedido.find()

            const produtosMap = {}

            pedidos.forEach(pedido => {

                if (!pedido.produtos) return

                pedido.produtos.forEach(produto => {

                    if (!produtosMap[produto.nome]) {
                        produtosMap[produto.nome] = 0
                    }

                    produtosMap[produto.nome] +=
                        produto.quantidade || 0
                })
            })

            const topProdutos =
            Object.entries(produtosMap)

            .map(([nome, quantidade]) => ({
                nome,
                quantidade
            }))

            .sort((a, b) =>
                b.quantidade - a.quantidade
            )

            .slice(0, 5)

            // FATURAMENTO
            const faturamento =
                vendas.reduce((acc, item) =>
                    acc + item.total, 0)

            // PEDIDOS
            const totalPedidos =
                vendas.reduce((acc, item) =>
                    acc + item.pedidos, 0)

            // COMISSÃO
            const totalComissao =
                vendas.reduce((acc, item) =>
                    acc + item.comissao, 0)

            // TICKET MÉDIO
            const ticketMedio =
                totalPedidos > 0
                    ? faturamento / totalPedidos
                    : 0

            const addToCart =
                await Evento.countDocuments({
                    type: "ADD_TO_CART"
                })

            const couponUses =
                await Evento.countDocuments({
                    type: "APPLY_COUPON"
                })

            const purchases =
                await Evento.countDocuments({
                    type: "PURCHASE"
                })
            
            const conversionRate =
                addToCart > 0

                ? ((purchases / addToCart) * 100)

                : 0

            res.json({

            faturamento,    

            totalPedidos,

            totalComissao,

            ticketMedio,

            topProdutos,

            addToCart,

            couponUses,

            purchases,

            conversionRate
                        })

        } catch (erro) {

            console.log(erro)

            res.status(500).json({
                erro: "Erro analytics"
            })
        }
})

app.post(
    "/upload",
    autenticar,
    admin,
    upload.single("imagem"),

    async (req, res) => {

        try {

            const b64 =
                Buffer.from(req.file.buffer)
                .toString("base64")

            const dataURI =
            "data:" +
            req.file.mimetype +
            ";base64," +
            b64

            const resultado =
                await cloudinary.uploader.upload(
                    dataURI,
                    {
                        folder: "maispano"
                    }
                )

            res.json({
                url: resultado.secure_url
            })

        } catch (erro) {

            console.log(erro)

            res.status(500).json({
                erro: "Erro upload"
            })
        }
})

const PORT =
    process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(
        `Servidor rodando na porta ${PORT}`
    )
})

