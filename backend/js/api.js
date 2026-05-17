const API_URL =
    "https://influencersmspn.onrender.com"

async function apiFetch(endpoint, options = {}) {

    const token =
        localStorage.getItem("token")

    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    )

    // token inválido ou expirado
    if (response.status === 401) {

        localStorage.removeItem("token")

        window.location.href =
            "../login/login.html"

        return
    }

    return response
}