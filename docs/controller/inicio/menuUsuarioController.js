document.addEventListener("DOMContentLoaded", async function () {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!id || !token) {
        console.error("ID o token no válidos en localStorage.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8081/api/usuarios/${id}`, {
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
});
