document.getElementById("resetPasswordForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let newPassword = document.getElementById("newPassword").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();
    let token = document.getElementById("token").value.trim();

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

    // Mostrar mensaje de carga
    Swal.fire({
        title: "Actualizando contraseña...",
        text: "Por favor, espera mientras procesamos tu solicitud.",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const response = await fetch(`https://laperlacentrocomercial.dyndns.org/api/auth/reset-password?token=${encodeURIComponent(token)}&password=${encodeURIComponent(newPassword)}`, {
            method: "POST"
        });

        const data = await response.text();

        // Cerrar mensaje de carga
        Swal.close();

        if (response.ok && /exito|éxito|restablecida/i.test(data)) {
            Swal.fire({
                icon: "success",
                title: "Contraseña cambiada",
                text: "Tu contraseña ha sido actualizada correctamente.",
            }).then(() => {
                window.location.href = "../modulo-login/page-login.html";
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error al cambiar la contraseña",
                text: data || "Ha ocurrido un error inesperado.",
            });
        }
        
    } catch (error) {
        Swal.close();
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor.",
        });
    }
});
// Evento para el botón de cancelar
document.getElementById("cancelButton").addEventListener("click", function () {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Si cancelas, perderás los cambios realizados.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No, continuar"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "../../view/modulo-login/page-login.html";
        }
    });
});


 // Mostrar/ocultar la contraseña nueva
    document.getElementById('toggleNewPassword').addEventListener('click', function () {
    const passwordField = document.getElementById('newPassword');
    const icon = this;

    if (passwordField.type === 'password') {
        passwordField.type = 'text'; // Mostrar la contraseña
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash'); // Cambiar icono a ojo cerrado
    } else {
        passwordField.type = 'password'; // Ocultar la contraseña
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye'); // Cambiar icono a ojo abierto
    }
});

// Mostrar/ocultar la confirmación de contraseña
document.getElementById('toggleConfirmPassword').addEventListener('click', function () {
    const passwordField = document.getElementById('confirmPassword');
    const icon = this;

    if (passwordField.type === 'password') {
        passwordField.type = 'text'; // Mostrar la contraseña
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash'); // Cambiar icono a ojo cerrado
    } else {
        passwordField.type = 'password'; // Ocultar la contraseña
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye'); // Cambiar icono a ojo abierto
    }
});