document.addEventListener("DOMContentLoaded", function () {
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

    // Validaciones del formulario
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const nombreInput = document.getElementById('nombre');
    const apellidoPaternoInput = document.getElementById('apellidoPaterno');
    const apellidoMaternoInput = document.getElementById('apellidoMaterno');
    const numeroTelefonicoInput = document.getElementById('numeroTelefonico');
    const parentescoSelect = document.getElementById('parentescoSelect');
    const usuarioSelect = document.getElementById('usuarioSelect');

    const clearForm = () => {
        nombreInput.value = '';
        apellidoPaternoInput.value = '';
        apellidoMaternoInput.value = '';
        numeroTelefonicoInput.value = '';
        parentescoSelect.value = 'seleccion';
        usuarioSelect.value = 'seleccion';
    };

    const showSuccessMessage = () => {
        Swal.fire({
            icon: 'success',
            title: 'Formulario enviado!',
            text: 'Los datos han sido guardados correctamente.',
        }).then(() => {
            clearForm();
        });
    };

    const showErrorMessage = () => {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Por favor, llena todos los campos.',
        });
    };

    const showCancelMessage = () => {
        Swal.fire({
            icon: 'info',
            title: 'Cancelado',
            text: 'El formulario no ha sido enviado.',
        }).then(() => {
            clearForm();
            window.location.href = '../modulo-inicio/dashboard-inicio.html'; // Redirige a dashboard.html después de mostrar el mensaje
        });
    };


    const handleFormSubmit = () => {
        let valid = true;

        // Validaciones de los campos
        const nombreRegex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
        if (!nombreRegex.test(nombreInput.value.trim())) {
            showError(nombreInput, 'El nombre solo debe contener letras y espacios');
            valid = false;
        } else {
            clearError(nombreInput);
        }

        const apellidoRegex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
        if (!apellidoRegex.test(apellidoPaternoInput.value.trim())) {
            showError(apellidoPaternoInput, 'El apellido paterno solo debe contener letras y espacios');
            valid = false;
        } else {
            clearError(apellidoPaternoInput);
        }

        if (!apellidoRegex.test(apellidoMaternoInput.value.trim())) {
            showError(apellidoMaternoInput, 'El apellido materno solo debe contener letras y espacios');
            valid = false;
        } else {
            clearError(apellidoMaternoInput);
        }

        const telefonoRegex = /^[0-9]{10}$/;
        if (!telefonoRegex.test(numeroTelefonicoInput.value.trim())) {
            showError(numeroTelefonicoInput, 'El número de teléfono debe contener 10 dígitos numéricos');
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

        if (usuarioSelect.value === 'seleccion') {
            showError(usuarioSelect, 'Por favor, selecciona un usuario');
            valid = false;
        } else {
            clearError(usuarioSelect);
        }

        if (valid) {
            showSuccessMessage();
        } else {
            showErrorMessage();
        }
    };

    // Eventos
    submitBtn.addEventListener('click', handleFormSubmit);
    cancelBtn.addEventListener('click', showCancelMessage);
});