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

    // Función que valida los campos y envía el formulario
    const handleFormSubmit = () => {
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
            showSuccessMessage();
        } else {
            showErrorMessage();
        }
    };

    // Evento para el botón "Agregar"
    submitBtn.addEventListener('click', handleFormSubmit);

    // Evento para el botón "Cancelar"
    cancelBtn.addEventListener('click', showCancelMessage);
});