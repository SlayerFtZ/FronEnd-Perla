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
});
// Seleccionamos los elementos del formulario
const form = document.getElementById('formAgregarFotoEmpresa');
const profilePhoto = document.getElementById('Photo');  // Corregido ID de la imagen
const cancelBtn = document.getElementById('cancelBtn');
const previewImage = document.getElementById('previewImage');
const updateButton = document.getElementById('updateButton');
const companyLogo = document.getElementById('companyLogo');  // Logo de la empresa actual

// El token de autenticación que se incluirá en los headers
const token = localStorage.getItem("token");  // Reemplaza con tu token

// Previsualizar imagen seleccionada antes de enviar
profilePhoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    
    if (file) {
        // Verificar si el archivo es una imagen
        if (!file.type.startsWith('image/')) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor selecciona un archivo de imagen.'
            });
            return;
        }

        // Ocultamos la imagen actual del logo
        companyLogo.style.display = 'none';

        const reader = new FileReader();
        
        reader.onload = function(event) {
            // Mostrar la imagen seleccionada en el mismo lugar del logo
            previewImage.style.display = 'block';  // Mostrar la imagen de previsualización
            previewImage.src = event.target.result;
            updateButton.disabled = false;  // Habilitar el botón de actualización
        };
        
        reader.readAsDataURL(file);
    }
});

// Configuración de la solicitud POST
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitamos el envío por defecto del formulario

    // Verificamos si se ha seleccionado una imagen
    if (!profilePhoto.files[0]) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Por favor selecciona una imagen'
        });
        return;
    }

    // Confirmación antes de enviar la solicitud
    const confirmChange = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas cambiar la imagen de la empresa?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmChange.isConfirmed) {
        return;  // Si el usuario cancela, no hacemos la solicitud
    }

    const formData = new FormData();
    formData.append('file', profilePhoto.files[0]); // Agregamos la imagen al FormData

    try {
        // Hacemos la solicitud POST
        const response = await fetch('https://laperlacentrocomercial.dyndns.org/api/archivos/empresa/5', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}` // Autenticación con token
            },
            body: formData
        });

        // Verificamos la respuesta de la API
        if (response.ok) {
            const data = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Imagen actualizada correctamente'
            });
            console.log(data);
            
            // Actualizamos la imagen mostrada con la URL que regresa la API
            document.getElementById('companyLogo').src = data.url;  // Usamos la URL de la respuesta
            previewImage.style.display = 'none';  // Ocultamos la previsualización después de confirmar el cambio
        } else {
            const errorData = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al actualizar la imagen: ' + (errorData.message || 'Desconocido')
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al intentar actualizar la imagen'
        });
        console.error(error);
    }
});

// Función para cancelar la acción y limpiar el formulario
cancelBtn.addEventListener('click', async () => {
    const confirmCancel = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas cancelar los cambios y volver al inicio?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No'
    });

    if (confirmCancel.isConfirmed) {
        window.location.href = '../../view/modulo-inicio/dashboard-inicio.html';
    }
});


document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();  // Limpia todo el localStorage
    sessionStorage.clear(); // Limpia todo el sessionStorage
    window.location.href = "../modulo-login/page-login.html"; // Redirige al login
});
