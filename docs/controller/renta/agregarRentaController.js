document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formAgregarLocal");
    const cancelBtn = document.getElementById("cancelBtn");

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
        const nombreLocal = document.getElementById("nombreRntLocal");
        if (nombreLocal.value === "") {
            mostrarError(nombreLocal, "Debes seleccionar un local válido.");
        }

        const usuario = document.getElementById("usuarioRntLocal");
        if (usuario.value === "") {
            mostrarError(usuario, "Debes seleccionar un usuario válido.");
        }

        const fechaInicio = document.getElementById("fechaInicioRnt");
        if (fechaInicio.value.trim() === "") {
            mostrarError(fechaInicio, "La fecha de inicio es obligatoria.");
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio.value)) {
            mostrarError(fechaInicio, "Formato de fecha inválido (YYYY-MM-DD).");
        }

        const fechaFin = document.getElementById("fechaFinRnt");
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
            text: "¿Deseas agregar esta renta?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, agregar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Renta agregada",
                    text: "Se ha registrado correctamente.",
                }).then(() => {
                    form.submit();
                    window.location.href = '../../view/modulo-renta/actualizar-renta.html';
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
                window.location.href = '../../view/modulo-inicio/dashboard-inicio.html';
            }
        });
    });
});