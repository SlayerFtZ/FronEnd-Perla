document.getElementById("resetPasswordForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let newPassword = document.getElementById("newPassword").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();
    let token = new URLSearchParams(window.location.search).get("token"); // Obtiene el token de la URL

    if (!token) {
        Swal.fire({
            icon: "error",
            title: "Token no encontrado",
            text: "No se encontró un token válido. Solicita un nuevo enlace de recuperación.",
        });
        return;
    }

    if (newPassword.length < 10) {
        Swal.fire({
            icon: "error",
            title: "Contraseña demasiado corta",
            text: "La contraseña debe tener al menos 10 caracteres.",
        });
        return;
    }

    if (newPassword !== confirmPassword) {
        Swal.fire({
            icon: "error",
            title: "Las contraseñas no coinciden",
            text: "Por favor, asegúrate de que ambas contraseñas sean iguales.",
        });
        return;
    }

    try {
        const response = await fetch("https://tuapi.com/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Contraseña cambiada",
                text: "Tu contraseña ha sido actualizada correctamente.",
                confirmButtonText: "Ir a Login"
            }).then(() => {
                window.location.href = "../modulo-login/page-login.html";
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data.message || "No se pudo restablecer la contraseña.",
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor.",
        });
    }
});

// Evento para el botón de cancelar
document.getElementById("cancelButton").addEventListener("click", function () {
    window.location.href = "page-login.html";
});
