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


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formActLocal");
    const cancelBtn = document.querySelector("[data-bs-dismiss='modal']");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío si hay errores
        let isValid = true;

        // Función para mostrar error debajo del campo
        function mostrarError(input, mensaje) {
            let errorDiv = input.nextElementSibling;
            if (!errorDiv || !errorDiv.classList.contains("error-message")) {
                errorDiv = document.createElement("div");
                errorDiv.classList.add("error-message");
                errorDiv.style.color = "red";
                errorDiv.style.fontSize = "14px";
                input.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = mensaje;
            isValid = false;
        }

        // Función para limpiar errores previos
        function limpiarErrores() {
            document.querySelectorAll(".error-message").forEach(el => el.remove());
        }

        limpiarErrores(); // Borra los mensajes de error antes de validar

        // Validaciones
        const nombreLocal = document.getElementById("actRntLocal");
        if (nombreLocal.value === "") {
            mostrarError(nombreLocal, "Debes seleccionar un local válido.");
        }

        const usuario = document.getElementById("usuarioActRntLocal");
        if (usuario.value === "") {
            mostrarError(usuario, "Debes seleccionar un usuario válido.");
        }

        const fechaInicio = document.getElementById("fechaActInicioRnt");
        if (fechaInicio.value.trim() === "") {
            mostrarError(fechaInicio, "La fecha de inicio es obligatoria.");
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio.value)) {
            mostrarError(fechaInicio, "Formato de fecha inválido (YYYY-MM-DD).");
        }

        const fechaFin = document.getElementById("fechaActFinRnt");
        if (fechaFin.value.trim() === "") {
            mostrarError(fechaFin, "La fecha de fin es obligatoria.");
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaFin.value)) {
            mostrarError(fechaFin, "Formato de fecha inválido (YYYY-MM-DD).");
        }

        // Si hay errores, mostramos una alerta de error
        if (!isValid) {
            Swal.fire({
                icon: "error",
                title: "Error en el formulario",
                text: "Por favor, corrige los campos marcados antes de enviar.",
            });
            return;
        }

        // Confirmación con SweetAlert antes de enviar
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas actualizar esta renta?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, actualizar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Preparar datos para enviar al API
                const data = {
                    local: nombreLocal.value,
                    usuario: usuario.value,
                    fechaInicio: fechaInicio.value,
                    fechaFin: fechaFin.value
                };

                // Enviar datos al API
                fetch("https://api.example.com/rentas/actualizar", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al actualizar la renta");
                    }
                    return response.json();
                })
                .then(result => {
                    Swal.fire({
                        icon: "success",
                        title: "Renta actualizada",
                        text: "Se ha registrado correctamente.",
                    }).then(() => {
                        window.location.href = '../../view/modulo-renta/actualizar-renta.html';
                    });
                })
                .catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se pudo actualizar la renta. Inténtalo nuevamente.",
                    });
                    console.error("Error:", error);
                });
            }
        });
    });

    // Confirmación para el botón cancelar
    cancelBtn.addEventListener("click", function () {
        Swal.fire({
            title: "¿Cancelar?",
            text: "¿Estás seguro de cancelar la operación?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "Volver"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    title: "Operación cancelada",
                    text: "No se realizó ningún cambio.",
                });
                form.reset(); // Limpia el formulario si se confirma la cancelación
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Verificar si el usuario tiene token, id y rol en el localStorage
    const token = localStorage.getItem("token");
    const id = getDecryptedUserId();
    const rol = localStorage.getItem("rol");

    // Si no hay token, id o rol, redirigir al login
    if (!token || !id || !rol) {
        window.location.href = "../../view/modulo-login/page-login.html"; // Si no hay token, id o rol, redirigir al login
    }
    });

    document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();  // Limpia todo el localStorage
    sessionStorage.clear(); // Limpia todo el sessionStorage
    window.location.href = "../modulo-login/page-login.html"; // Redirige al login
    });