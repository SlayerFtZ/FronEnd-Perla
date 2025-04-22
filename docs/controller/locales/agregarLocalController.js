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

document.getElementById('cancelBtn').addEventListener('click', () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se cancelará el registro y serás redirigido al panel principal.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, volver',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Cancelado',
                text: 'Has sido redirigido al dashboard.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = '../../view/modulo-inicio/dashboard-inicio.html';
            });
        }
    });
});


// Función para cerrar sesión

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();  // Limpia todo el localStorage
    sessionStorage.clear(); // Limpia todo el sessionStorage
    window.location.href = "../modulo-login/page-login.html"; // Redirige al login
});
