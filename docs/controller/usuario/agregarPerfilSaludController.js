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

    // Funciones de manejo de errores
    function showError(input, message) {
        let errorSpan = input.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains("error-message")) {
            errorSpan = document.createElement("span");
            errorSpan.classList.add("error-message");
            errorSpan.style.color = "red";
            input.parentNode.appendChild(errorSpan);
        }
        errorSpan.innerText = message;
    }

    function clearError(input) {
        let errorSpan = input.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains("error-message")) {
            errorSpan.remove();
        }
    }

    //funcion para mostrar la lista de usuarios
    async function loadUsuarios() {
        if (!token) return;
        try {
            const response = await fetch('https://laperlacentrocomercial.dyndns.org/api/usuarios', {
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
                sessionStorage.setItem('selectedUserId', selectedUserId); // Guardar en sessionStorage
    
                const selectedUser = data.find(usuario => usuario.idUsuario == selectedUserId);
                if (selectedUser) {
                    const rolUsuario = selectedUser.rol || "Rol no disponible";
                    document.querySelector('.text-muted').textContent = `Rol: ${rolUsuario}`;
    
                    // Actualizar la imagen del usuario seleccionado
                    const userImage = document.querySelector('.profile-img');
                    userImage.src = selectedUser.fotoPerfilUrl || "../../images/perfilUsuario.jpg"; // Imagen por defecto si no tiene foto
                }
            });
    
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    }
    
    loadUsuarios(); // Cargar usuarios al cargar la página
    

    // Obtener elementos
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const padecimientosInput = document.getElementById('padecimientos');
    const descripcionInput = document.getElementById('descripcion');
    const opcionesUsuarioSelect = document.getElementById('opcionesUsuario');
    const opcionesCategoriaSelect = document.getElementById('opcionesCategoria');

    // Función para limpiar el formulario
    const clearForm = () => {
        padecimientosInput.value = '';
        descripcionInput.value = '';
        opcionesUsuarioSelect.value = 'seleccion';
        opcionesCategoriaSelect.value = 'seleccion';
    };

    // Función para mostrar el mensaje de éxito
    const showSuccessMessage = () => {
        Swal.fire({
            icon: 'success',
            title: 'Formulario enviado!',
            text: 'Los datos han sido guardados correctamente.',
        }).then(() => {
            clearForm(); // Limpiar el formulario después de éxito
        });
    };

    // Función para mostrar el mensaje de error
    const showErrorMessage = () => {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Por favor, llena todos los campos correctamente.',
        });
    };

    // Función para mostrar el mensaje de cancelación
    const showCancelMessage = () => {
        Swal.fire({
            icon: 'info',
            title: 'Cancelado',
            text: 'El formulario no ha sido enviado.',
        }).then(() => {
            clearForm();
            sessionStorage.clear();
            window.location.href = '../modulo-inicio/dashboard-inicio.html'; // Redirige a dashboard.html después de mostrar el mensaje
        });
    };

    // Función que valida los campos y envía el formulario
    const handleFormSubmit = async () => {
        let valid = true;

        // Validar campos
        if (opcionesUsuarioSelect.value === 'seleccion') {
            showError(opcionesUsuarioSelect, 'Por favor, selecciona un usuario');
            valid = false;
        } else {
            clearError(opcionesUsuarioSelect);
        }

        if (padecimientosInput.value.trim() === '') {
            showError(padecimientosInput, 'Por favor, ingresa los padecimientos');
            valid = false;
        } else {
            clearError(padecimientosInput);
        }

        if (descripcionInput.value.trim() === '') {
            showError(descripcionInput, 'Por favor, ingresa una descripción');
            valid = false;
        } else {
            clearError(descripcionInput);
        }

        if (opcionesCategoriaSelect.value === 'seleccion') {
            showError(opcionesCategoriaSelect, 'Por favor, selecciona una categoría');
            valid = false;
        } else {
            clearError(opcionesCategoriaSelect);
        }

        if (valid) {
            const selectedUserId = sessionStorage.getItem('selectedUserId');
            const data = {
                nombrePadecimiento: padecimientosInput.value.trim(),
                descripcion: descripcionInput.value.trim(),
                categoria: opcionesCategoriaSelect.value,
                    "usuario": {
                        "idUsuario": selectedUserId, // Usar directamente el valor de selectedUserId
                    },
            };

            try {
                const response = await fetch(`https://laperlacentrocomercial.dyndns.org/api/padecimientos`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    showSuccessMessage();
                    sessionStorage.clear();
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al enviar',
                        text: errorData.message || 'Ocurrió un error al guardar los datos.',
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor. Por favor, intenta nuevamente.',
                });
            }
        } else {
            showErrorMessage();
        }
    };

    // Evento para el botón "Agregar"
    submitBtn.addEventListener('click', handleFormSubmit);

    // Evento para el botón "Cancelar"
    cancelBtn.addEventListener('click', showCancelMessage);

    // Evento de logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.clear();  // Limpia todo el localStorage
        sessionStorage.clear(); // Limpia todo el sessionStorage
        window.location.href = "../modulo-login/page-login.html"; // Redirige al login
    });
});
