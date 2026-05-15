async function registrar() {

    const nome =
        document.getElementById("nome").value

    const email =
        document.getElementById("email").value

    const senha =
        document.getElementById("senha").value

    const codigo =
        document.getElementById("codigo").value

    const response = await fetch(
        "https://influencersmspn.onrender.com/registro",
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nome,
                email,
                senha,
                codigo
            })
        }
    )

    const dados = await response.json()

    if (dados.erro) {

        toast(dados.erro, "erro")

        return
    }

    toast("Conta criada!")

    window.location.href =
    "login.html"
}