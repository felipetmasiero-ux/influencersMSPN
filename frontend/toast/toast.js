function toast(mensagem, tipo = "sucesso") {

    const toast = document.createElement("div")

    toast.classList.add("toast")

    if (tipo === "erro") {
        toast.classList.add("erro")
    }

    toast.innerText = mensagem

    document.body.appendChild(toast)

    setTimeout(() => {
        toast.classList.add("show")
    }, 100)

    setTimeout(() => {

        toast.classList.remove("show")

        setTimeout(() => {
            toast.remove()
        }, 300)

    }, 3000)
}