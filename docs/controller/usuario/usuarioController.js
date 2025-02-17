

document.addEventListener("DOMContentLoaded", function () {
    const profileImageInput = document.getElementById('profileImageInput');
    const previewImage = document.getElementById('profileImagePreview');

    profileImageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            // Confirmar con SweetAlert antes de cambiar la imagen
            Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Quieres cambiar tu imagen de perfil?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, cambiar',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Si el usuario confirma, se muestra la imagen seleccionada
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        previewImage.src = e.target.result;
                        previewImage.style.display = 'block';

                        // Alerta de éxito
                        Swal.fire({
                            icon: 'success',
                            title: 'Imagen actualizada',
                            text: 'Tu imagen de perfil ha sido cambiada con éxito.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    // Si el usuario cancela, restablece el campo y oculta la vista previa
                    profileImageInput.value = ''; // Desmarcar archivo
                    previewImage.style.display = 'none'; // Ocultar imagen previa
                    Swal.fire('Cancelado', 'No se ha cambiado la imagen de perfil.', 'error');
                }
            });
        } else {
            // Si no se selecciona ningún archivo, mostrar alerta
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


    // Manejo del perfil de salud
    document.getElementById("updateHealthProfileForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const padecimientos = document.getElementById("healthConditions").value.trim();
        const descripcion = document.getElementById("healthDescription").value.trim();
        const categoria = document.getElementById("healthCategory").value;

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
                // Aquí realizarías la actualización del perfil de salud
                // Después de la actualización, mostrar el mensaje de éxito
                Swal.fire({
                    title: "¡Perfil de salud actualizado con éxito!",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    // Cerrar el modal después de mostrar el mensaje de éxito
                    $('#updateHealthProfileModal').modal('hide');
                });
            }
        });
    });


    // Manejo del contacto de emergencia
    document.getElementById("updateEmergencyContactForm").addEventListener("submit", function (event) {
        event.preventDefault();

        // Obtener los valores de los campos
        const nombre = document.getElementById("emergencyContactName").value.trim();
        const apellidoPaterno = document.getElementById("emergencyContactLastName").value.trim();
        const apellidoMaterno = document.getElementById("emergencyContactSecondLastName").value.trim();
        const numeroTelefonico = document.getElementById("emergencyContactPhone").value.trim();
        const parentesco = document.getElementById("emergencyContactRelationship").value;

        // Expresiones regulares para validación
        const regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
        const regexTelefono = /^[0-9]{10}$/;

        // Limpiar mensajes de error previos
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach((msg) => msg.style.display = 'none');

        let isValid = true;

        // Validar cada campo
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
        if (parentesco === "seleccion") {
            displayError("relationshipError", "Debe seleccionar un parentesco válido.");
            isValid = false;
        }

        // Si la validación es correcta, mostrar la confirmación
        if (isValid) {
            Swal.fire({
                title: "¿Estás seguro de que deseas actualizar el contacto de emergencia?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí",
                cancelButtonText: "No"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Familiar agregado correctamente!",
                        icon: "success",
                        confirmButtonText: "Aceptar"
                    }).then(() => {
                        $('#updateEmergencyContactModal').modal('hide');
                    });
                }
            });
        }
    });

    // Función para mostrar un mensaje de error debajo del campo
    function displayError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
});

// boton para desahibilitar un usuario 
document.getElementById("btn-despedir").addEventListener("click", function () {
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
            fetch('/api/despedir-usuario', { method: 'POST' }) // Cambia la URL por la de tu backend
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
//actualziar usuario
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
                    // Si el usuario confirma, enviamos el formulario
                    Swal.fire({
                        title: "Perfil actualizado correctamente!",
                        icon: "success",

                        confirmButtonText: "Cerrar",
                    }).then(() => {
                        // Aquí escondemos el modal y enviamos el formulario
                        const modal = document.querySelector("#modalActualizarUsuario");
                        if (modal) {
                            modal.style.display = "none";
                        }

                        // Ahora podemos enviar el formulario
                        event.target.submit(); // Esto envía el formulario
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

