function displayImage(event) {
    const imagePreview = document.getElementById("imagePreview");
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        imagePreview.src = reader.result;
        imagePreview.style.display = "block";
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}
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

    function displayImage(event) {
        const imagePreview = document.getElementById("imagePreview");
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function () {
            imagePreview.src = reader.result;
            imagePreview.style.display = "block";
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const form = document.querySelector(".form-layout");
    const defaultImage = document.getElementById("imagePreview").src;

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
            { id: "nombre", regex: regexNombre, error: "Solo letras y espacios (3-100 caracteres)", minLength: 3, maxLength: 100 },
            { id: "apellidoPaterno", regex: regexNombre, error: "Solo letras y espacios (3-100 caracteres)", minLength: 3, maxLength: 100 },
            { id: "apellidoMaterno", regex: regexNombre, error: "Solo letras y espacios (3-100 caracteres)", minLength: 3, maxLength: 100 },
            { id: "correo", regex: regexCorreo, error: "Correo inválido (5-100 caracteres)", minLength: 5, maxLength: 100 },
            { id: "curp", regex: regexCurp, error: "CURP inválido (18 caracteres)", minLength: 18, maxLength: 18 },
            { id: "rfc", regex: regexRfc, error: "RFC inválido (12-13 caracteres)", minLength: 12, maxLength: 13 },
            { id: "numeroTelefonico", regex: regexTelefono, error: "Teléfono inválido (10 dígitos)", minLength: 10, maxLength: 10 },
            { id: "nssSeguro", regex: regexNss, error: "NSS inválido (11 dígitos)", minLength: 11, maxLength: 11 }
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

        const fechaNacimiento = document.getElementById("fechaNacimiento");
        const fechaIngresada = new Date(fechaNacimiento.value);
        if (fechaIngresada >= new Date()) {
            showError(fechaNacimiento, "Fecha inválida, debe ser en el pasado");
            valid = false;
        } else {
            clearError(fechaNacimiento);
        }

        const direccion = document.getElementById("direccion");
        if (direccion.value.trim() === "") {
            showError(direccion, "La dirección no puede estar vacía");
            valid = false;
        } else {
            clearError(direccion);
        }

        valid &= validateRadio("genero", "Debe seleccionar un género");
        valid &= validateRadio("rol", "Debe seleccionar un rol");
        valid &= validateRadio("estado", "Debe seleccionar un estado civil");

        const foto = document.getElementById("profilePhoto");
        if (foto.files.length === 0) {
            showError(foto, "Debe subir una imagen de perfil");
            valid = false;
        } else {
            const file = foto.files[0];
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!allowedTypes.includes(file.type)) {
                showError(foto, "Formato inválido, solo JPG o PNG");
                valid = false;
            } else {
                clearError(foto);
            }
        }

        if (valid) {
            Swal.fire({
                title: "Usuario agregado correctamente!",
                icon: "success",
                draggable: true
            }).then(() => {
                form.reset();
                const imagePreview = document.getElementById("imagePreview");
                imagePreview.src = defaultImage;
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Hay errores en el formulario. Por favor, corrígelos y vuelve a intentarlo.",
            });
        }
    });

    document.getElementById("profilePhoto").addEventListener("change", displayImage);
});