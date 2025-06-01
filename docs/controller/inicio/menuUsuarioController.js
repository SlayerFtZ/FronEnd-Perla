document.addEventListener("DOMContentLoaded", function () {
    // Obtener datos del localStorage
    const token = localStorage.getItem("token");
    const id = getDecryptedUserId();
    const rol = localStorage.getItem("rol");
    const estado = localStorage.getItem("estado");

    // Validar existencia de datos y el estado del usuario
    if (!token || !id || !rol || !estado) {
        window.location.href = "../../view/modulo-login/page-login.html";
    } else if (estado.toLowerCase() === "inactivo") {
        // Si el estado es inactivo, limpiar almacenamiento y redirigir
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../../view/modulo-login/page-login.html";
    }
});





document.addEventListener("DOMContentLoaded", async function () {
    const id = getDecryptedUserId();
    const token = localStorage.getItem("token");

    if (!id || !token) {
        console.error("ID o token no válidos en localStorage.");
        return;
    }

    try {
        const response = await fetch(`https://laperlacentrocomercial.dyndns.org/api/usuarios/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener usuario: ${response.status}`);
        }

        const data = await response.json();
        console.log("Usuario encontrado:", data);

        // Actualiza los elementos del sidebar con los datos del usuario
        document.getElementById("user-name").textContent = `${data.nombre} ${data.apellidoPaterno}`;
        document.getElementById("user-role").textContent = data.rol;
        
        // Actualiza la imagen de perfil si existe
        if (data.fotoPerfilUrl) {
            document.getElementById("user-avatar").src = data.fotoPerfilUrl;
        }

    } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
    }

    // Evento para el botón de logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.clear();  // Limpia todo el localStorage
        sessionStorage.clear(); // Limpia todo el sessionStorage
        window.location.href = "../modulo-login/page-login.html"; // Redirige al login
    });
});
