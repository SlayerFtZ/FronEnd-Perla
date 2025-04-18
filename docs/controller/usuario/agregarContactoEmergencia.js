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

    // Cargar usuarios en el select
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
            const select = document.getElementById('usuarioSelect');
            select.innerHTML = '<option value="seleccion">Selecciona un usuario</option>';
            
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
    
                    // Actualizar la imagen de perfil
                    const userImage = document.querySelector('.profile-img-emergencia');
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
    const nombreInput = document.getElementById('nombre');
    const apellidoPaternoInput = document.getElementById('apellidoPaterno');
    const apellidoMaternoInput = document.getElementById('apellidoMaterno');
    const numeroTelefonicoInput = document.getElementById('telefono');
    const parentescoSelect = document.getElementById('parentescoSelect');
    const usuarioSelect = document.getElementById('usuarioSelect');

    // Función para limpiar el formulario
    const clearForm = () => {
        nombreInput.value = '';
        apellidoPaternoInput.value = '';
        apellidoMaternoInput.value = '';
        numeroTelefonicoInput.value = '';
        usuarioSelect.value = 'seleccion';
        parentescoSelect.value = 'seleccion';
    };

    // Función para mostrar mensajes con SweetAlert2
    const showAlert = (icon, title, text, callback = null) => {
        Swal.fire({ icon, title, text }).then(() => {
            if (callback) callback();
        });
    };

    // Función para validar y enviar el formulario
    const handleFormSubmit = async () => {
        let valid = true;

        // Validación de campos
        if (usuarioSelect.value === 'seleccion') {
            showError(usuarioSelect, 'Por favor, selecciona un usuario');
            valid = false;
        } else {
            clearError(usuarioSelect);
        }

        if (nombreInput.value.trim() === '') {
            showError(nombreInput, 'Por favor, ingresa el nombre');
            valid = false;
        } else {
            clearError(nombreInput);
        }

        if (apellidoPaternoInput.value.trim() === '') {
            showError(apellidoPaternoInput, 'Por favor, ingresa el apellido paterno');
            valid = false;
        } else {
            clearError(apellidoPaternoInput);
        }

        if (apellidoMaternoInput.value.trim() === '') {
            showError(apellidoMaternoInput, 'Por favor, ingresa el apellido materno');
            valid = false;
        } else {
            clearError(apellidoMaternoInput);
        }

        if (numeroTelefonicoInput.value.trim() === '') {
            showError(numeroTelefonicoInput, 'Por favor, ingresa el número telefónico');
            valid = false;
        } else {
            clearError(numeroTelefonicoInput);
        }

        if (parentescoSelect.value === 'seleccion') {
            showError(parentescoSelect, 'Por favor, selecciona un parentesco');
            valid = false;
        } else {
            clearError(parentescoSelect);
        }

        if (valid) {
            const selectedUserId = sessionStorage.getItem('selectedUserId');
            const data = {
                "usuario": {
                    "idUsuario": selectedUserId, // Usar directamente el valor de selectedUserId
                },
                nombre: nombreInput.value.trim(),
                apellidoPaterno: apellidoPaternoInput.value.trim(),
                apellidoMaterno: apellidoMaternoInput.value.trim(),
                telefono: numeroTelefonicoInput.value.trim(),
                parentesco: parentescoSelect.value
            };
            

            try {
                const response = await fetch('http://localhost:8081/api/contactos-emergencia', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    showAlert('success', 'Registro exitoso', 'Los datos han sido guardados correctamente.', clearForm);
                } else {
                    const errorData = await response.json();
                    showAlert('error', 'Error al enviar', errorData.message || 'Ocurrió un error al guardar los datos.');
                }
            } catch (error) {
                showAlert('error', 'Error de conexión', 'No se pudo conectar con el servidor. Inténtalo nuevamente.');
            }
        } else {
            showAlert('error', 'Error', 'Por favor, llena todos los campos correctamente.');
        }
    };

    // Evento para el botón "Agregar"
    submitBtn.addEventListener('click', handleFormSubmit);

    // Evento para el botón "Cancelar"
    cancelBtn.addEventListener('click', () => {
        showAlert('info', 'Cancelado', 'El formulario no ha sido enviado.', () => {
            clearForm();
            window.location.href = '../modulo-inicio/dashboard-inicio.html';
        });
    });

    // Evento de logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../modulo-login/page-login.html";
    });
});
