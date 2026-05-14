// Variáveis com os itens necessários retirados do HTML
let codigoInput = document.getElementById("codigo-digitado")
let divCodigo = document.getElementById("codigo")
let cupomAtivo = JSON.parse(localStorage.getItem("cupom")) || null

const params = new URLSearchParams(window.location.search)
const ref = params.get("ref")

const userId = localStorage.getItem("userId") || crypto.randomUUID()
localStorage.setItem("userId", userId)

if (ref) {
    codigoInput.value = ref
    aplicarCupom()
}

carregarProdutos()

async function enviar(produtoId, elemento) {

    document.querySelectorAll(".produto").forEach(p => {
        p.classList.remove("selecionado")
    })

    elemento.classList.add("selecionado")

    const container = document.getElementById("produtos")

    container.innerHTML = `
    <div class="skeleton"></div>
    <div class="skeleton"></div>
    <div class="skeleton"></div>
    `

    await fetch("https://influencersmspn.onrender.com/carrinho", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-id": userId
        },
        body: JSON.stringify({ id: produtoId })
    })

    await carregarProdutos()

    atualizarCarrinho()
}

function removerCupom() {

    codigoInput.value = ""
    codigoInput.focus()

    cupomAtivo = null

    atualizarCarrinho()

    localStorage.removeItem("cupom")

    const mensagem =
        document.getElementById("mensagem-cupom")

    mensagem.innerHTML = ""
    mensagem.className = ""
}

async function aplicarCupom() {
    let codigoAplicado = codigoInput.value.trim().toUpperCase()
    let mensagem = document.getElementById("mensagem-cupom")

    const btn =
    document.getElementById("btnCupom")

    btn.disabled = true

    btn.innerHTML = "Aplicando..."

    if (cupomAtivo) {
        mensagem.innerHTML = `Cupom ${cupomAtivo.codigo} já está aplicado`
        mensagem.className = "erro"
        return
    }

    // pergunta pro backend se o cupom existe
    const response =await fetch("https://influencersmspn.onrender.com/cupom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: codigoAplicado })
    })

    if (!response.ok) {
        mensagem.innerHTML = "<p><strong>Código Inválido. Tente novamente!</strong></p>"
        mensagem.classList.remove("sucesso")
        mensagem.classList.add("erro")
    } else {
        const cupom = await response.json()
        mensagem.innerHTML = `Cupom ${cupom.codigo} aplicado!`
        mensagem.classList.remove("erro")
        mensagem.classList.add("sucesso")
        cupomAtivo = cupom
        atualizarCarrinho()
    }

    codigoInput.value = ""
    codigoInput.focus()

    btn.disabled = false

    btn.innerHTML = "Aplicar"
}

// Função responsável por atualizar o carrinho toda vez que o usuário adicionar um produto
async function atualizarCarrinho() {
    const responseCarrinho = await fetch("https://influencersmspn.onrender.com/carrinho", {
        headers: { 
        "Content-Type": "application/json",
        "x-user-id": userId 
}    })

    const carrinho = await responseCarrinho.json()
    let listaCarrinho = document.getElementById("lista-carrinho")
    let totalCarrinho = document.getElementById("total-carrinho")
    let resumoCarrinho = document.getElementById("resumo-carrinho")

    listaCarrinho.innerHTML = ""
    totalCarrinho.innerHTML = "R$ 0,00"

    if (carrinho.length === 0) {
    totalCarrinho.innerHTML = "R$ 0,00"
    resumoCarrinho.innerHTML = ""
    return
}

    carrinho.forEach(produto => {
        listaCarrinho.innerHTML += `
        <li class="item-carrinho">

            <div class="item-info">
                <strong>${produto.nome}</strong>

                <span>
                    R$ ${produto.preco.toFixed(2)} ×
                    ${produto.quantidade}
                </span>
            </div>

            <div class="acoes-carrinho">

                <button class="btn-qtd"
                    onclick="diminuirQuantidade('${produto.id}')">
                    −
                </button>

                <button class="btn-qtd"
                    onclick="aumentarQuantidade('${produto.id}')">
                    +
                </button>

                <button class="btn-remover"
                    onclick="removerItem('${produto.id}')">
                    ✕
                </button>

            </div>

        </li>
        `
    })

    try {
        const response = await fetch("https://influencersmspn.onrender.com/resumo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                 "x-user-id": userId
            }, 
            body: JSON.stringify({
                codigo: cupomAtivo?.codigo
            })
        })

        console.log("response.ok:", response.ok)

        if (!response.ok) {
    const erro = await response.json()
    console.warn("Erro:", erro)
    return
}
        
        const dados = await response.json()
        console.log("dados recebidos:", dados)

        totalCarrinho.innerHTML = `<h3><strong>R$ ${dados.totalFinal.toFixed(2).replace(".", ",")}</strong></h3>`

        resumoCarrinho.innerHTML = `
            Subtotal: R$ ${dados.subtotal.toFixed(2).replace(".", ",")} <br>
            Desconto: R$ ${dados.desconto.toFixed(2).replace(".", ",")} <br>
            Total: R$ ${dados.totalFinal.toFixed(2).replace(".", ",")}`


    } catch (erro) {
        console.error("Erro ao conectar com o backend:", erro)
        totalCarrinho.innerHTML = `<p style="color:red">Erro: ${erro.message}</p>`
    }
}

// Função que remove o item do carrinho
async function removerItem(id) {
   await fetch(`https://influencersmspn.onrender.com/carrinho/${id}`, {
    method: "DELETE",
    headers: { 
                "Content-Type": "application/json",        
                "x-user-id": userId },
})
    atualizarCarrinho()
}

// Função que aumenta a quantidade do item no carrinho quando o botao + é clicado
 async function aumentarQuantidade(id) {
    await fetch(`https://influencersmspn.onrender.com/carrinho/${id}`, {
    method: "PATCH",
    headers: {  
                "Content-Type": "application/json",
                "x-user-id": userId },
    body: JSON.stringify({ acao: "aumentar" })
})
    atualizarCarrinho()
}

// Função que diminui a quantidade do item no carrinho quando o botao - é clicado
 async function diminuirQuantidade(id) {
   await fetch(`https://influencersmspn.onrender.com/carrinho/${id}`, {
    method: "PATCH",
    headers: {  
                "Content-Type": "application/json",
                "x-user-id": userId },
    body: JSON.stringify({ acao: "diminuir" })
})
    atualizarCarrinho()
}

async function finalizarCompra() {

    const btn =
    document.getElementById("btnFinalizar")

    btn.disabled = true

    btn.innerHTML = "Finalizando..."

    try {
        const response = await fetch("https://influencersmspn.onrender.com/finalizar", {
            method: "POST",
            headers: { 
                        "Content-Type": "application/json",
                         "x-user-id": userId  },
            body: JSON.stringify({
                codigo: cupomAtivo?.codigo
            })
        })

        // se deu erro no backend
        if (!response.ok) {
            const erro = await response.json()
            toast("Erro: " + erro.erro, "erro")
            return
        }

        // pega os dados da resposta
        const dados = await response.json()

        // mostra o total final
        toast(
        `Compra finalizada • Total: ${Number(dados.totalFinal || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        )}`
        )

        // limpa cupom
        cupomAtivo = null
        localStorage.removeItem("cupom")

        // limpa input
        codigoInput.value = ""

        // limpa mensagem visual
        const mensagem = document.getElementById("mensagem-cupom")
        mensagem.innerHTML = ""
        mensagem.className = ""

        atualizarCarrinho()

    } catch (erro) {
        console.error("Erro:", erro)
        toast("Erro ao finalizar compra", "erro")
    }

    finally {

    btn.disabled = false

    btn.innerHTML = "Finalizar Compra"
    }
}

async function carregarProdutos() {
    const response = await fetch("https://influencersmspn.onrender.com/produtos")
    const produtos = await response.json()

    const container = document.getElementById("produtos")
    container.innerHTML = ""

    produtos.forEach(p => {
    container.innerHTML += `
        <div class="produto">

            <img src="${p.imagem}">

            <div class="produto-info">

                <h2>${p.nome}</h2>

                <p>
                    ${p.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </p>

                <button onclick="enviar('${p._id}', this.parentElement.parentElement)">
                    Adicionar ao carrinho
                </button>

            </div>

        </div>
        `
})
}