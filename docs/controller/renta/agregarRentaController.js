document.addEventListener("DOMContentLoaded", function () {
    // Obtener datos del localStorage
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
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


    // Cargar opciones de locales
    fetch('http://localhost:8081/api/locales', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const selectLocal = document.getElementById('nombreRntLocal');
        const estatusInput = document.getElementById('estatusRenta');

        data.forEach(local => {
            const option = document.createElement('option');
            option.value = local.idLocal;
            option.textContent = local.numeroLocal;
            option.setAttribute('data-estado', local.estado);
            selectLocal.appendChild(option);
        });

        selectLocal.addEventListener('change', function () {
            const selectedOption = selectLocal.options[selectLocal.selectedIndex];
            const estado = selectedOption.getAttribute('data-estado');
            estatusInput.value = estado || '';
            sessionStorage.setItem('selectLocalid', selectLocal.value);
        });

        const storedId = sessionStorage.getItem('selectLocalid');
        if (storedId) {
            selectLocal.value = storedId;
        }

        window.localesData = data;
    })
    .catch(error => {
        console.error('Error al cargar locales:', error);
    });

    // Cargar usuarios
    async function loadUsuarios() {
        if (!token) return;
        try {
            const response = await fetch('http://localhost:8081/api/usuarios', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error en la solicitud');

            const data = await response.json();
            const select = document.getElementById('opcionesUsuario');
            data.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.idUsuario;
                option.textContent = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;
                select.appendChild(option);
            });

            select.addEventListener('change', () => {
                const selectedUserId = select.value;
                sessionStorage.setItem('selectedUserId', selectedUserId);

                const selectedUser = data.find(usuario => usuario.idUsuario == selectedUserId);
                if (selectedUser) {
                    const rolUsuario = selectedUser.rol || "Rol no disponible";
                    document.querySelector('.text-muted').textContent = `Rol: ${rolUsuario}`;
                }
            });

        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    }

    loadUsuarios();

    const form = document.getElementById("formAgregarRenta");
    const cancelBtn = document.getElementById("cancelBtn");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        let isValid = true;

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

        function limpiarErrores() {
            document.querySelectorAll(".error-message").forEach(el => el.remove());
        }

        limpiarErrores();

        const nombreLocal = document.getElementById("nombreRntLocal");
        const usuario = document.getElementById("opcionesUsuario");
        const fechaInicio = document.getElementById("fechaInicioRnt");
        const fechaFin = document.getElementById("fechaFinRnt");
        const estado = document.getElementById("estatusRenta");

        if (nombreLocal.value === "") {
            mostrarError(nombreLocal, "Debes seleccionar un local válido.");
        }

        if (usuario.value === "seleccion") {
            mostrarError(usuario, "Debes seleccionar un usuario válido.");
        }

        if (fechaInicio.value.trim() === "") {
            mostrarError(fechaInicio, "La fecha de inicio es obligatoria.");
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio.value)) {
            mostrarError(fechaInicio, "Formato de fecha inválido (YYYY-MM-DD).");
        }

        if (fechaFin.value.trim() === "") {
            mostrarError(fechaFin, "La fecha de fin es obligatoria.");
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaFin.value)) {
            mostrarError(fechaFin, "Formato de fecha inválido (YYYY-MM-DD).");
        } else if (fechaFin.value < fechaInicio.value) {
            mostrarError(fechaFin, "La fecha de fin no puede ser anterior a la fecha de inicio.");
        }

        if (!isValid) {
            Swal.fire({
                icon: "error",
                title: "Error en el formulario",
                text: "Por favor, corrige los campos marcados antes de enviar.",
            });
            return;
        }

        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas agregar esta renta?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, agregar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const estadoValor = estado.value;
        
                // Verifica el estado antes de hacer el fetch
                if (estadoValor.toLowerCase() === "ocupado") {
                    Swal.fire({
                        icon: "warning",
                        title: "Local ocupado",
                        text: "El local ya está en renta. No se puede registrar una nueva renta.",
                    });
                    return; // Cancela el proceso si el local está ocupado
                }

                try {
                    // Crear el objeto de datos para el POST
                    const data = {
                        idLocal: nombreLocal.value,
                        idUsuario: usuario.value,
                        // estado: (estadoValor === "Disponible" || estadoValor === "Reservado") ? "Disponible" : "En renta",
                        fechaInicio: fechaInicio.value,
                        fechaFin: fechaFin.value
                    };
        
                    // Hacer el fetch para registrar la renta
                    const response = await fetch("http://localhost:8081/api/rentas/registrar", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(data)
                    });
        
                    if (!response.ok) {
                        throw new Error("Error al agregar la renta. Por favor, inténtalo de nuevo.");
                    }
        
                    const resultData = await response.json();
        
                    // Mostrar mensaje de éxito
                    Swal.fire({
                        icon: "success",
                        title: "Renta agregada",
                        text: "Se ha registrado correctamente.",
                    }).then(() => {
                        form.reset();
                        window.location.href = '../../view/modulo-renta/actualizar-renta.html';
                    });
        
                } catch (error) {
                    // Manejo de errores
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: error.message,
                    });
                }
            }
        });
    });

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
                form.reset();
                window.location.href = '../../view/modulo-inicio/dashboard-inicio.html';
            }
        });
    });

    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../modulo-login/page-login.html";
    });
});
