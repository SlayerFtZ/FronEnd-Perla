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
});


document.addEventListener("DOMContentLoaded", function () {
    const profileImageInput = document.getElementById('profileImageInput');
    const previewImage = document.getElementById('profileImagePreview');
    const form = document.getElementById('updateProfilePicForm');
    let selectedFile = null;

    // Solo mostrar la vista previa cuando se selecciona un archivo
    profileImageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Tipo de archivo no válido',
                    text: 'Por favor, selecciona una imagen válida (JPEG, PNG, GIF).',
                });
                profileImageInput.value = '';
                previewImage.style.display = 'none';
                return;
            }

            selectedFile = file;

            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.style.display = 'none';
            selectedFile = null;
        }
    });

    // Enviar la imagen solo al hacer submit del formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");

        if (!userId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.',
            });
            return;
        }

        if (!selectedFile) {
            Swal.fire({
                icon: 'warning',
                title: 'No se seleccionó imagen',
                text: 'Por favor selecciona una imagen de perfil.',
            });
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
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("idUsuario", userId);
                formData.append("tipo", "FotoPerfil");
                fetch(`http://localhost:8081/api/archivos/${userId}/actualizar-con-archivo`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
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
                
                    if (response.ok /* && data.success */) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Imagen actualizada',
                            text: 'Tu imagen de perfil ha sido cambiada con éxito.',
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            location.reload(); // Recargar la página después de que termine el timer
                        });
                
                        // Puedes cerrar el modal manualmente si quieres
                        const modal = bootstrap.Modal.getInstance(document.getElementById('updateProfilePicModal'));
                        if (modal) modal.hide();
                
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
            } else {
                Swal.fire('Cancelado', 'No se ha cambiado la imagen de perfil.', 'info');
            }
        });
    });
});
document.getElementById("updateHealthProfileForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const padecimientos = document.getElementById("healthConditions").value.trim();
    const descripcion = document.getElementById("healthDescription").value.trim();
    const categoria = document.getElementById("healthCategory").value;
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!userId) {
        console.error("Error: No se pudo obtener el ID del usuario.");
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente."
        });
        return;
    }

    if (padecimientos === "" || descripcion === "" || categoria === "") {
        console.error("Error: Todos los campos son obligatorios.");
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

            const submitBtn = document.querySelector("#updateHealthProfileForm button[type='submit']");
            submitBtn.disabled = true;

            const healthProfileData = [
                {
                    nombrePadecimiento: padecimientos,
                    descripcion: descripcion,
                    categoria: categoria
                }
            ];

            fetch(`http://localhost:8081/api/padecimientos/usuario/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(healthProfileData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor.");
                }
                return response.json();
            })
            .then(data => {
                console.log("Respuesta del servidor:", data);

                // Si el backend devuelve un array, lo tomamos como éxito
                if (Array.isArray(data)) {
                    Swal.fire({
                        title: "¡Perfil de salud actualizado con éxito!",
                        icon: "success",
                        confirmButtonText: "Aceptar"
                    }).then(() => {
                        const modal = $('#updateHealthProfileModal');
                        modal.on('hidden.bs.modal', function () {
                            location.reload();
                        });
                        modal.modal('hide');
                    });
                } else {
                    console.error("Error del servidor:", data.message || "Hubo un problema al actualizar el perfil de salud.");
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: data.message || "Hubo un problema al actualizar el perfil de salud."
                    });
                }
            })
            .catch((error) => {
                console.error("Error de conexión:", error.message || "No se pudo conectar con el servidor.");
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.message || "No se pudo conectar con el servidor."
                });
            })
            .finally(() => {
                submitBtn.disabled = false;
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


let contrasenaReal = "";

function generarContrasena(longitud = 10) {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    contrasenaReal = Array.from({ length: longitud }, () => caracteres.charAt(Math.floor(Math.random() * caracteres.length))).join('');
    document.getElementById("contrasena").value = "*".repeat(contrasenaReal.length);
}

function obtenerContrasenaReal() {
    return contrasenaReal;
}

// Función para actualziar el perfil del usuario
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

        const genero = document.getElementById("actualizarGenero");
        if (!genero.value) {
            showError(genero, "Debe seleccionar un género");
            valid = false;
        } else {
            clearError(genero);
        }

        const rol = document.getElementById("actualizarRol");
        if (!rol.value) {
            showError(rol, "Debe seleccionar un rol");
            valid = false;
        } else {
            clearError(rol);
        }

        const estadoCivil = document.getElementById("actualizarEstadoCivil");
        if (!estadoCivil.value) {
            showError(estadoCivil, "Debe seleccionar un estado civil");
            valid = false;
        } else {
            clearError(estadoCivil);
        }

        if (valid) {
            Swal.fire({
                title: "¿Estás seguro de que deseas actualizar tu perfil?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, actualizar",
                cancelButtonText: "No, cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = localStorage.getItem("id"); // Obtener el ID del usuario desde sessionStorage

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
                        nombre: document.getElementById("actualizarNombre").value.trim(),
                        apellidoPaterno: document.getElementById("actualizarApellidoPaterno").value.trim(),
                        apellidoMaterno: document.getElementById("actualizarApellidoMaterno").value.trim(),
                        correo: document.getElementById("actualizarCorreo").value.trim(),
                        curp: document.getElementById("actualizarCurp").value.trim(),
                        rfc: document.getElementById("actualizarRfc").value.trim(),
                        telefono: document.getElementById("actualizarTelefono").value.trim(),
                        numeroSeguro: document.getElementById("actualizarNss").value.trim(),
                        fechaNacimiento: document.getElementById("actualizarFechaNacimiento").value,
                        direccion: document.getElementById("actualizarDireccion").value.trim(),
                        genero: document.getElementById("actualizarGenero").value,
                        rol: document.getElementById("actualizarRol").value,
                        estadoCivil: document.getElementById("actualizarEstadoCivil").value,
                        estado: "Activo",
                        contrasena: obtenerContrasenaReal()
                    };
                    const token = localStorage.getItem("token");
                    fetch(`http://localhost:8081/api/usuarios/actualizar/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(userData)
                    })
                    .then(async response => {
                        const data = await response.json();
                        if (response.ok) {
                            Swal.fire({
                                title: "Perfil actualizado correctamente!",
                                icon: "success",
                                confirmButtonText: "Cerrar",
                            }).then(() => {
                                location.reload(); // Recargar la página después de la actualización exitosa
                            });
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: data.message || "Hubo un problema al actualizar el perfil.",
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
