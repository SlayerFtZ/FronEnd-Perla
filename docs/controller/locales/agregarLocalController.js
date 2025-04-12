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
document.getElementById('formAgregarLocal').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener los valores de los campos
    const nombreLocal = document.getElementById('nombreLocal').value.trim();
    const precioMensual = document.getElementById('precioMensual').value.trim();
    const estatusRenta = document.getElementById('estatusRenta').value.trim();

    // Validación de campos
    if (!nombreLocal || !precioMensual || !estatusRenta) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Por favor, completa todos los campos.',
        });
    } else {
        // Obtenemos el token del localStorage
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        
        // Crear el objeto JSON con los datos del formulario
        const data = {
            idUsuario: parseInt(id),
            numeroLocal: nombreLocal, // No convertir a número, mantener como string
            precioMensual: parseFloat(precioMensual),
            estado: estatusRenta.toUpperCase().replace(" ", "_")  // Convierte el valor de estatusRenta a mayúsculas y reemplaza el espacio por guion bajo
        };

        // Hacer la solicitud POST al backend
        fetch('http://localhost:8081/api/locales/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(result => {
            Swal.fire({
                icon: 'success',
                title: '¡Formulario enviado!',
                text: 'El local se ha agregado correctamente.',
                timer: 3000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = '../modulo-local/consultar-local.html';
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Hubo un problema al registrar el local. Inténtalo nuevamente.',
            });
        });
    }
});
// Función para cerrar sesión

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();  // Limpia todo el localStorage
    sessionStorage.clear(); // Limpia todo el sessionStorage
    window.location.href = "../modulo-login/page-login.html"; // Redirige al login
});
