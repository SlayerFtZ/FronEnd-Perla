// Función para mostrar la imagen previa al cargarla
function displayImage(event) {
    const imagePreview = document.getElementById("imagePreview");
    if (!imagePreview) return; // Verificar si el elemento existe

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

let contrasenaReal = "";

// Generar contraseña aleatoria
function generarContrasena(longitud = 10) {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    contrasenaReal = "";
    for (let i = 0; i < longitud; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        contrasenaReal += caracteres[randomIndex];
    }
    document.getElementById("contrasena").value = "*".repeat(contrasenaReal.length);
}

function obtenerContrasenaReal() {
    return contrasenaReal;
}

// Mostrar errores
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

// Borrar errores
function clearError(input) {
    let errorSpan = input.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains("error-message")) {
        errorSpan.remove();
    }
}

// Validar campos <select>
function validateSelect(id, errorMessage) {
    const select = document.getElementById(id);
    const value = select.value;

    const container = select.closest('.form-group');
    let errorSpan = container.querySelector(".error-message");
    if (errorSpan) {
        errorSpan.remove();
    }

    if (!value) {
        errorSpan = document.createElement("span");
        errorSpan.classList.add("error-message");
        errorSpan.style.color = "red";
        errorSpan.innerText = errorMessage;
        container.appendChild(errorSpan);
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const rol = localStorage.getItem("rol");

    if (!token || !id || !rol) {
        console.log("Token, ID o Rol no encontrados, redirigiendo...");
        window.location.href = "../../view/modulo-login/page-login.html";
    }

    const form = document.querySelector(".form-layout");
    const imagePreview = document.getElementById("imagePreview");
    const defaultImage = imagePreview?.src || "";

    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        let valid = true;
        console.log("Formulario enviado, comenzando validaciones...");

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
            console.log(`Validando campo: ${field.id}, valor: ${value}`);

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

        valid = validateSelect("genero", "Debe seleccionar un género") && valid;
        valid = validateSelect("rol", "Debe seleccionar un rol") && valid;
        valid = validateSelect("estadoCivil", "Debe seleccionar un estado civil") && valid;

        const fotoInput = document.getElementById("profilePhoto");
        if (fotoInput.files.length === 0) {
            showError(fotoInput, "Debe subir una imagen de perfil");
            valid = false;
        } else {
            const file = fotoInput.files[0];
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!allowedTypes.includes(file.type)) {
                showError(fotoInput, "Formato inválido, solo JPG o PNG");
                valid = false;
            } else {
                clearError(fotoInput);
            }
        }

        console.log(`Validaciones completadas, resultado: ${valid ? "Todo correcto" : "Error en validación"}`);

        if (valid) {
            const formData = new FormData();
            console.log("Enviando datos al servidor...");

            const usuario = {
                nombre: document.getElementById("nombre").value.trim(),
                apellidoPaterno: document.getElementById("apellidoPaterno").value.trim(),
                apellidoMaterno: document.getElementById("apellidoMaterno").value.trim(),
                correo: document.getElementById("correo").value.trim(),
                curp: document.getElementById("curp").value.trim(),
                rfc: document.getElementById("rfc").value.trim(),
                numeroTelefonico: document.getElementById("numeroTelefonico").value.trim(),
                nssSeguro: document.getElementById("nssSeguro").value.trim(),
                fechaNacimiento: document.getElementById("fechaNacimiento").value.trim(),
                direccion: document.getElementById("direccion").value.trim(),
                genero: document.getElementById("genero").value,
                rol: document.getElementById("rol").value,
                estadoCivil: document.getElementById("estadoCivil").value,
                estado: "Activo",
                contrasena: obtenerContrasenaReal()
            };

            formData.append("usuario", JSON.stringify(usuario));
            formData.append("file", fotoInput.files[0]);

            try {
                const response = await fetch("http://localhost:8081/api/usuarios/registrar-con-imagen", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Respuesta del servidor:", data);
                    if (data.fotoPerfilUrl) {
                        document.getElementById('fotoPerfil').src = data.fotoPerfilUrl;
                    }

                    Swal.fire({
                        title: "Usuario agregado correctamente!",
                        icon: "success",
                        draggable: true
                    }).then(() => {
                        form.reset();
                        if (imagePreview) imagePreview.src = defaultImage;
                    });
                } else {
                    console.error("Error al registrar el usuario", response);
                    Swal.fire({
                        icon: "error",
                        title: "Error al registrar",
                        text: "Ocurrió un error al registrar el usuario.",
                    });
                }
            } catch (error) {
                console.error("Error de conexión:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: "No se pudo conectar con el servidor.",
                });
            }
        }
    });

    // ✅ Fuera del form.submit
    document.getElementById("profilePhoto").addEventListener("change", displayImage);

    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("rol");
        window.location.href = "../../view/modulo-login/page-login.html";
    });
});
