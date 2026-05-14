const token =
    localStorage.getItem("token")

const usuario =
    JSON.parse(localStorage.getItem("usuario"))

if (!token || !usuario) {

    window.location.href =
    "../login/login.html"
}

if (usuario.role !== "admin") {

    toast("Acesso negado", "erro")

    window.location.href =
    "../dashboard/dashboard.html"
}

async function carregarProdutos() {

    const response = await fetch(
        "http://localhost:3000/produtos"
    )

    const produtos = await response.json()

    const tabela =
        document.getElementById("tabelaProdutos")

    tabela.innerHTML = ""

    produtos.forEach(produto => {

        tabela.innerHTML += `

        <tr>

            <td>
                <img src="${produto.imagem}">
            </td>

            <td>${produto.nome}</td>

            <td>
                ${Number(produto.preco || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })}
            </td>

            <td>

                <div class="acoes">

                    <button
                        class="editar"
                        onclick="abrirEditar(
                            '${produto._id}',
                            '${produto.nome}',
                            '${produto.preco}',
                            '${produto.imagem}'
                        )"
                    >
                        Editar
                    </button>

                    <button
                        class="excluir"
                        onclick="deletarProduto('${produto._id}')"
                    >
                        Excluir
                    </button>

                </div>

            </td>

        </tr>
        `
    })
}

function abrirModal() {

    document
        .getElementById("modal")
        .classList.remove("hidden")
}

let produtoEditando = null
let imagemAtual = ""

function abrirEditar(id, nome, preco, imagem) {

    produtoEditando = id

    imagemAtual = imagem

    document.getElementById("nome").value =
        nome

    document.getElementById("preco").value =
        preco

    document.getElementById("imagem").value = ""

    const preview =
        document.getElementById("previewImagem")

    preview.src = imagem

    preview.classList.remove("hidden")

    document
        .getElementById("modal")
        .classList.remove("hidden")
}

async function criarProduto() {

    const btn =
        document.getElementById("btnSalvar")

    btn.disabled = true

    btn.innerHTML = "Salvando..."

    try {

        const imagemInput =
            document.getElementById("imagem")

        const arquivo =
            imagemInput.files[0]

        const nome =
            document.getElementById("nome").value

        const preco =
            document.getElementById("preco").value

        const imagem = imagemAtual

        const token =
            localStorage.getItem("token")

        let imagemUrl = ""

        // Upload da imagem
        if (arquivo) {

            const formData = new FormData()

            formData.append("imagem", arquivo)

            const uploadResponse = await fetch(
                "http://localhost:3000/upload",
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: formData
                }
            )

            if (!uploadResponse.ok) {
                throw new Error("Erro no upload da imagem")
            }

            const uploadDados =
                await uploadResponse.json()

            imagemUrl = uploadDados.url
        }

        // EDITAR
        if (produtoEditando) {

            const response = await fetch(
                `http://localhost:3000/admin/produto/${produtoEditando}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        nome,
                        preco,
                        imagem: imagemUrl || imagem
                    })
                }
            )

            if (!response.ok) {
                throw new Error("Erro ao editar produto")
            }

        } else {

            // CRIAR
            const response = await fetch(
                "http://localhost:3000/admin/produto",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        nome,
                        preco,
                        imagem: imagemUrl || imagem
                    })
                }
            )

            if (!response.ok) {
                throw new Error("Erro ao criar produto")
            }
        }

        produtoEditando = null

        toast("Produto salvo com sucesso!")

        document.getElementById("nome").value = ""
        document.getElementById("preco").value = ""
        document.getElementById("imagem").value = ""

        document
            .getElementById("modal")
            .classList.add("hidden")

        location.reload()

    } catch (erro) {

        console.log(erro)

        toast("Erro ao salvar produto", "erro")

    } finally {

        btn.disabled = false

        btn.innerHTML = "Salvar"
    }
}

async function deletarProduto(id) {

    const token =
    localStorage.getItem("token")

    await fetch(
    `http://localhost:3000/admin/produto/${id}`,
    {

        method: "DELETE",

        headers: {
            Authorization: `Bearer ${token}`
        }
    } 
    )

    carregarProdutos()
}

const imagemInput =
    document.getElementById("imagem")

imagemInput.addEventListener(
    "change",

    function(event) {

        const arquivo =
            event.target.files[0]

        if (!arquivo) return

        const preview =
            document.getElementById(
                "previewImagem"
            )

        preview.src =
            URL.createObjectURL(arquivo)

        preview.classList.remove("hidden")
    }
)

async function carregarAnalytics() {

    const response = await fetch(
        "http://localhost:3000/admin/analytics",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    const dados = await response.json()

    document.getElementById("faturamento")
        .innerHTML =
        dados.faturamento.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        )

    document.getElementById("totalPedidos")
        .innerHTML =
        dados.totalPedidos

    document.getElementById("comissao")
        .innerHTML =
        dados.totalComissao.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        )

    document.getElementById("ticketMedio")
        .innerHTML =
        dados.ticketMedio.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        )

        const lista =
    document.getElementById(
        "listaTopProdutos"
    )

        lista.innerHTML = ""

        dados.topProdutos.forEach(produto => {

            lista.innerHTML += `

            <div class="produto-top">

                <strong>
                    ${produto.nome}
                </strong>

                <span>
                    ${produto.quantidade} vendas
                </span>

            </div>
            `
        })
}

window.onclick = function(event) {

    const modal =
        document.getElementById("modal")

    if (event.target === modal) {

        modal.classList.add("hidden")
    }
}

carregarAnalytics()
carregarProdutos()