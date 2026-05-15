async function login() {

    const btn =
        document.getElementById("btnLogin")

    btn.disabled = true

    btn.innerHTML = "Entrando..."

    try {

        const email =
            document.getElementById("email").value

        const senha =
            document.getElementById("senha").value

        const response = await fetch(
            "https://influencersmspn.onrender.com/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    senha
                })
            }
        )

        if (!response.ok) {

            const erro =
                await response.json()

            toast(erro.erro, "erro")

            return
        }

        const dados =
            await response.json()

        localStorage.setItem(
            "token",
            dados.token
        )

        localStorage.setItem(
            "usuario",
            JSON.stringify(dados.usuario)
        )

        toast("Login realizado!")

        setTimeout(() => {

            if (dados.usuario.role === "admin") {

                window.location.href =
                    "../admin/admin.html"

            } else {

                window.location.href =
                    "../dashboard/dashboard.html"
            }

        }, 1200)

    } catch {

        toast(
            "Erro ao conectar no servidor",
            "erro"
        )

    } finally {

        btn.disabled = false

        btn.innerHTML = "Entrar"
    }
}