document.getElementById("resetPasswordForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let newPassword = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword.length < 8) {
        Swal.fire({
            icon: "error",
            title: "Contraseña demasiado corta",
            text: "La contraseña debe tener al menos 8 caracteres.",
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

    Swal.fire({
        icon: "success",
        title: "Contraseña cambiada",
        text: "Tu contraseña ha sido cambiada exitosamente.",
        confirmButtonText: "Ir a Login"
    }).then(() => {
        window.location.href = "../modulo-login/page-login.html"; // Redirigir a la página de login
    });
});

// Evento para el botón de cancelar
document.getElementById("cancelButton").addEventListener("click", function () {
    window.location.href = "page-login.html"; // Redirigir a la página de login
});