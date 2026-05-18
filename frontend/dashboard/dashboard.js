const token =
    localStorage.getItem("token")

const usuario =
    JSON.parse(localStorage.getItem("usuario"))

if (!token || !usuario) {

    window.location.href =
    "../login/login.html"
}

async function carregarDashboard() {

    const response = await fetch(
   "https://influencersmspn.onrender.com/influencer",
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
)

    if (response.status === 401) {

    logout()

    return
}

    const dados = await response.json()

    let crescimento = 18

    document.getElementById("crescimento").innerHTML =
    `+${crescimento}%`

   document.getElementById("codigoInfluencer").innerHTML =
    `Código: ${dados.codigo}`

    document.getElementById("comissao").innerHTML =
    dados.comissao.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    document.getElementById("pedidos").innerHTML =
        dados.pedidos

    document.getElementById("total").innerHTML =
        dados.total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

    const ticketMedio =
    dados.pedidos > 0
        ? dados.total / dados.pedidos
        : 0

document.getElementById("ticketMedio").innerHTML =
    ticketMedio.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    criarGrafico(dados)

    await carregarGrafico()

    await carregarPedidos()

    await carregarRanking()
}

function criarGrafico(dados) {

    const ctx = document.getElementById("grafico")

    new Chart(ctx, {

    type: "doughnut",

    cutout: "75%",

    data: {
        labels: ["Vendas", "Comissão"],

        datasets: [{
            data: [
                dados.total,
                dados.comissao
            ],

            backgroundColor: [
                "#8b5cf6",
                "#22c55e"
            ],

            borderWidth: 0
        }]
    },

    options: {

        maintainAspectRatio: false,
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "white"
                }
            }
        }
    }
})
}

async function carregarGrafico() {

    const response = await fetch(
        "https://influencersmspn.onrender.com/grafico",
        {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
)

    if (response.status === 401) {

    logout()

    return
}

    const historico = await response.json()

    const labels = historico.map(item =>
        new Date(item.data).toLocaleDateString("pt-BR")
    )

    const valores = historico.map(item => item.valor)

    const ctx = document.getElementById("grafico2")

    new Chart(ctx, {

        type: "line",

        data: {

            labels,

            datasets: [{
                label: "Vendas",
                data: valores,
                tension: 0.4,

                borderColor: "#8b5cf6",
                backgroundColor: "rgba(139,92,246,0.2)",

                 fill: true,

                 pointBackgroundColor: "#8b5cf6"
            }]
        },

        options: {
            maintainAspectRatio: false,
            responsive: true,
            maintainAspectRatio: false
}
    })
}

async function carregarRanking() {

    const response = await fetch(
       "https://influencersmspn.onrender.com/ranking"
    )

    const ranking = await response.json()

    const tbody =
        document.getElementById("rankingBody")

    tbody.innerHTML = ""

    ranking.forEach((item, index) => {

        tbody.innerHTML += `

        <tr>

            <td>#${index + 1}</td>

            <td>${item.codigo}</td>

            <td>
                ${item.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })}
            </td>

            <td>${item.pedidos}</td>

            <td>
                ${item.comissao.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })}
            </td>

        </tr>
        `
    })
}

async function carregarPedidos() {

    const response = await fetch(
    "https://influencersmspn.onrender.com/pedidos",
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
)

    if (response.status === 401) {

    logout()

    return
}

    const pedidos = await response.json()

    const tabela =
        document.getElementById("tabelaPedidos")

    tabela.innerHTML = ""

   pedidos.forEach(pedido => {

    const produtos = pedido.produtos
        ? pedido.produtos.map(p => p.nome).join(", ")
        : "Sem produtos"

    tabela.innerHTML += `
    
    <tr>

        <td>${pedido.cliente}</td>

        <td>${produtos}</td>

        <td>
            ${pedido.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })}
        </td>

        <td>
            <span class="status aprovado">
                ${pedido.status}
            </span>
        </td>

        <td>
            ${new Date(pedido.createdAt)
                .toLocaleDateString("pt-BR")}
        </td>

    </tr>
    `
})
}

function logout() {

    localStorage.removeItem("token")

    localStorage.removeItem("usuario")

    window.location.href = "../login/login.html"
}

carregarDashboard()