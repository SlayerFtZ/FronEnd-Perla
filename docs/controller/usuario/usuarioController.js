document.addEventListener("DOMContentLoaded", function () {
    // Verificar si el usuario tiene token, id y rol en el localStorage
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const rol = localStorage.getItem("rol");

    // Si no hay token, id o rol, redirigir al login
    if (!token || !id || !rol) {
        window.location.href = "../../view/modulo-login/page-login.html"; // Si no hay token, id o rol, redirigir al login
    }
});

// Función para mostrar el modal de imagen de perfil
document.addEventListener("DOMContentLoaded", function () {
    const profileImageInput = document.getElementById('profileImageInput');
    const previewImage = document.getElementById('profileImagePreview');
    const token = localStorage.getItem("token");

    profileImageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        const id = localStorage.getItem("id");

        if (!id) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.',
            });
            console.error("No se encontró el ID del usuario en localStorage.");
            return;
        }

        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Tipo de archivo no válido',
                    text: 'Por favor, selecciona una imagen válida (JPEG, PNG, GIF).',
                });
                console.warn("Tipo de archivo inválido:", file.type);
                return;
            }

            Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Quieres cambiar tu imagen de perfil?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, cambiar',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        previewImage.src = e.target.result;
                        previewImage.style.display = 'block';

                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("idUsuario", id);
                        formData.append("tipo", "FotoPerfil");

                        fetch(`http://localhost:8081/api/archivos/1/actualizar-con-archivo`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`
                                // NO pongas Content-Type aquí con FormData
                            },
                            body: formData
                        })
                        .then(async response => {
                            console.log("Código de estado HTTP:", response.status);

                            let data;
                            try {
                                data = await response.json();
                                console.log("Respuesta del servidor:", data);
                            } catch (jsonErr) {
                                console.error("No se pudo parsear JSON:", jsonErr);
                                throw new Error("Respuesta no válida del servidor.");
                            }

                            if (response.ok && data.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Imagen actualizada',
                                    text: 'Tu imagen de perfil ha sido cambiada con éxito.',
                                    timer: 2000,
                                    showConfirmButton: false
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: data.message || 'Hubo un problema al actualizar la imagen de perfil.',
                                });
                            }
                        })
                        .catch(error => {
                            console.error("Error al hacer la petición fetch:", error);

                            Swal.fire({
                                icon: 'error',
                                title: 'Error de conexión',
                                text: 'No se pudo conectar con el servidor. Verifica tu red o si el backend está activo.',
                            });
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    profileImageInput.value = '';
                    previewImage.style.display = 'none';
                    Swal.fire('Cancelado', 'No se ha cambiado la imagen de perfil.', 'error');
                }
            });
        } else {
            previewImage.style.display = 'none';
            Swal.fire({
                icon: 'warning',
                title: 'No se seleccionó imagen',
                text: 'Por favor selecciona una imagen de perfil.',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
});

// Manejo del perfil de salud
document.getElementById("updateHealthProfileForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const padecimientos = document.getElementById("healthConditions").value.trim();
    const descripcion = document.getElementById("healthDescription").value.trim();
    const categoria = document.getElementById("healthCategory").value;
    const userId = localStorage.getItem("id"); // Asegúrate de que esta variable se llame igual que en el objeto enviado
    const token = localStorage.getItem("token");
    if (!userId) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente."
        });
        return;
    }

    if (padecimientos === "" || descripcion === "" || categoria === "seleccion") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Todos los campos son obligatorios."
        });
        return;
    }

    Swal.fire({
        title: "¿Estás seguro de que deseas actualizar el perfil de salud?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Preparar los datos para enviar al API
            const healthProfileData = {
                userId: parseInt(userId),
                padecimientos: padecimientos,
                descripcion: descripcion,
                categoria: categoria
            };

            // Realizar la solicitud al API
            fetch(`http://localhost:8081/api/padecimientos/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(healthProfileData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: "¡Perfil de salud actualizado con éxito!",
                        icon: "success",
                        confirmButtonText: "Aceptar"
                    }).then(() => {
                        const modal = $('#updateHealthProfileModal');
                        modal.modal('hide');

                        // Recargar la página una vez que el modal se haya cerrado completamente
                        modal.on('hidden.bs.modal', function () {
                            location.reload();
                        });
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo un problema al actualizar el perfil de salud."
                    });
                }
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo conectar con el servidor."
                });
            });
        }
    });
});

document.getElementById("updateEmergencyContactForm").addEventListener("submit", function (event) {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    event.preventDefault();

    // Obtener los valores del formulario
    const nombre = document.getElementById("emergencyContactName").value.trim();
    const apellidoPaterno = document.getElementById("emergencyContactLastName").value.trim();
    const apellidoMaterno = document.getElementById("emergencyContactSecondLastName").value.trim();
    const numeroTelefonico = document.getElementById("emergencyContactPhone").value.trim();
    const parentesco = document.getElementById("emergencyContactRelationship").value;

    // Validaciones
    const regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    const regexTelefono = /^[0-9]{10}$/;

    document.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none');

    let isValid = true;

    if (!regexNombre.test(nombre) || nombre.length < 3) {
        displayError("nameError", "El nombre debe contener solo letras y al menos 3 caracteres.");
        isValid = false;
    }
    if (!regexNombre.test(apellidoPaterno) || apellidoPaterno.length < 3) {
        displayError("lastNameError", "El apellido paterno debe contener solo letras y al menos 3 caracteres.");
        isValid = false;
    }
    if (!regexNombre.test(apellidoMaterno) || apellidoMaterno.length < 3) {
        displayError("secondLastNameError", "El apellido materno debe contener solo letras y al menos 3 caracteres.");
        isValid = false;
    }
    if (!regexTelefono.test(numeroTelefonico)) {
        displayError("phoneError", "El número de teléfono debe contener 10 dígitos.");
        isValid = false;
    }
    if (!parentesco || parentesco === "seleccion") {
        displayError("relationshipError", "Debe seleccionar un parentesco válido.");
        isValid = false;
    }

    // Si todo es válido, continuar
    if (isValid) {
        Swal.fire({
            title: "¿Estás seguro de que deseas actualizar el contacto de emergencia?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                const id = localStorage.getItem("id");
                if (!id  || !token) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se pudo obtener la información del usuario, contacto o token."
                    });
                    return;
                }

                const data = {
                    usuario: { idUsuario: parseInt(id) },
                    nombre,
                    apellidoPaterno,
                    apellidoMaterno,
                    telefono: numeroTelefonico,
                    parentesco
                };

                fetch(`http://localhost:8081/api/contactos-emergencia/actualizar/usuario/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) throw new Error("Error al actualizar el contacto");
                    return response.json();
                })
                .then(data => {
                    Swal.fire({
                        icon: "success",
                        title: "Contacto actualizado",
                        text: "El contacto de emergencia se actualizó correctamente."
                    }).then(() => {
                        $('#updateEmergencyContactModal').modal('hide');
                        // Recargar la página después de cerrar el modal
                        location.reload();
                    });
                })
                .catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se pudo actualizar el contacto. Intenta de nuevo."
                    });
                    console.error(error);
                });
            }
        });
    }
});

// Botón para deshabilitar un usuario
document.getElementById("btn-despedir").addEventListener("click", function () {
    const id = sessionStorage.getItem("id"); // Obtener el ID del usuario desde sessionStorage

    if (!id) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente."
        });
        return;
    }

    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción despedirá al usuario y no se podrá revertir.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, despedir",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Preparar los datos para enviar al API
            const data = { id };

            fetch('/api/despedir-usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: "Despedido",
                        text: "El usuario ha sido despedido exitosamente.",
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al despedir al usuario.",
                        icon: "error"
                    });
                }
            })
            .catch(() => {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo conectar con el servidor.",
                    icon: "error"
                });
            });
        }
    });
});

//actualizar usuario
document.addEventListener("DOMContentLoaded", function () {
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

    function validateRadio(name, errorMessage) {
        const radios = document.getElementsByName(name);
        if (radios.length === 0) return false;

        let checked = Array.from(radios).some(radio => radio.checked);
        const container = radios[0].closest('.form-group');

        let errorSpan = container.querySelector(".error-message");
        if (errorSpan) {
            errorSpan.remove();
        }

        if (!checked) {
            errorSpan = document.createElement("span");
            errorSpan.classList.add("error-message");
            errorSpan.style.color = "red";
            errorSpan.innerText = errorMessage;
            container.appendChild(errorSpan);
            return false;
        }
        return true;
    }

    const form = document.querySelector("#formActualizarUsuario");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let valid = true;

        const regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
        const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const regexCurp = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9]{2}$/;
        const regexRfc = /^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$/;
        const regexTelefono = /^[0-9]{10}$/;
        const regexNss = /^[0-9]{11}$/;

        const fields = [
            { id: "actualizarNombre", regex: regexNombre, error: "Solo letras y espacios (3-100 caracteres)", minLength: 3, maxLength: 100 },
            { id: "actualizarApellidoPaterno", regex: regexNombre, error: "Solo letras y espacios (3-100 caracteres)", minLength: 3, maxLength: 100 },
            { id: "actualizarApellidoMaterno", regex: regexNombre, error: "Solo letras y espacios (3-100 caracteres)", minLength: 3, maxLength: 100 },
            { id: "actualizarCorreo", regex: regexCorreo, error: "Correo inválido (5-100 caracteres)", minLength: 5, maxLength: 100 },
            { id: "actualizarCurp", regex: regexCurp, error: "CURP inválido (18 caracteres)", minLength: 18, maxLength: 18 },
            { id: "actualizarRfc", regex: regexRfc, error: "RFC inválido (12-13 caracteres)", minLength: 12, maxLength: 13 },
            { id: "actualizarTelefono", regex: regexTelefono, error: "Teléfono inválido (10 dígitos)", minLength: 10, maxLength: 10 },
            { id: "actualizarNss", regex: regexNss, error: "NSS inválido (11 dígitos)", minLength: 11, maxLength: 11 }
        ];

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const value = input.value.trim();
            if (!field.regex.test(value) || value.length < field.minLength || value.length > field.maxLength) {
                showError(input, field.error);
                valid = false;
            } else {
                clearError(input);
            }
        });

        const fechaNacimiento = document.getElementById("actualizarFechaNacimiento");
        const fechaIngresada = new Date(fechaNacimiento.value);
        if (fechaIngresada >= new Date()) {
            showError(fechaNacimiento, "Fecha inválida, debe ser en el pasado");
            valid = false;
        } else {
            clearError(fechaNacimiento);
        }

        const direccion = document.getElementById("actualizarDireccion");
        if (direccion.value.trim() === "") {
            showError(direccion, "La dirección no puede estar vacía");
            valid = false;
        } else {
            clearError(direccion);
        }

        valid &= validateRadio("genero", "Debe seleccionar un género");
        valid &= validateRadio("rol", "Debe seleccionar un rol");
        valid &= validateRadio("estado", "Debe seleccionar un estado civil");

        if (valid) {
            Swal.fire({
                title: "¿Estás seguro de que deseas actualizar tu perfil?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, actualizar",
                cancelButtonText: "No, cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = sessionStorage.getItem("id"); // Obtener el ID del usuario desde sessionStorage

                    if (!id) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente."
                        });
                        return;
                    }

                    // Preparar los datos para enviar al API
                    const userData = {
                        id: id,
                        nombre: document.getElementById("actualizarNombre").value.trim(),
                        apellidoPaterno: document.getElementById("actualizarApellidoPaterno").value.trim(),
                        apellidoMaterno: document.getElementById("actualizarApellidoMaterno").value.trim(),
                        correo: document.getElementById("actualizarCorreo").value.trim(),
                        curp: document.getElementById("actualizarCurp").value.trim(),
                        rfc: document.getElementById("actualizarRfc").value.trim(),
                        telefono: document.getElementById("actualizarTelefono").value.trim(),
                        nss: document.getElementById("actualizarNss").value.trim(),
                        fechaNacimiento: document.getElementById("actualizarFechaNacimiento").value,
                        direccion: document.getElementById("actualizarDireccion").value.trim(),
                        genero: document.querySelector("input[name='genero']:checked").value,
                        rol: document.querySelector("input[name='rol']:checked").value,
                        estado: document.querySelector("input[name='estado']:checked").value
                    };

                    fetch('/api/actualizar-usuario', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire({
                                title: "Perfil actualizado correctamente!",
                                icon: "success",
                                confirmButtonText: "Cerrar",
                            }).then(() => {
                                const modal = document.querySelector("#modalActualizarUsuario");
                                if (modal) {
                                    modal.style.display = "none";
                                }
                            });
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: "Hubo un problema al actualizar el perfil.",
                                icon: "error",
                                confirmButtonText: "Aceptar",
                            });
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            title: "Error",
                            text: "No se pudo conectar con el servidor.",
                            icon: "error",
                            confirmButtonText: "Aceptar",
                        });
                    });
                }
            });
        } else {
            Swal.fire({
                title: "Hay errores en el formulario",
                text: "Por favor, corrige los campos marcados.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    });
});

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();  // Limpia todo el localStorage
    sessionStorage.clear(); // Limpia todo el sessionStorage
    window.location.href = "../modulo-login/page-login.html"; // Redirige al login
});
