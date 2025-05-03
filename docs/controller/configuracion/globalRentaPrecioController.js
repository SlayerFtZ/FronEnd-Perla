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

document.getElementById('formAgregarGloabalRenta').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas actualizar el precio?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            console.log("Formulario enviado"); // Para verificar si el evento se dispara

            const nuevoPrecio = document.getElementById('globalRentaPrecio').value;
            console.log("Nuevo Precio:", nuevoPrecio); // Verificar si el precio se obtiene correctamente

            if (!nuevoPrecio || isNaN(nuevoPrecio) || parseFloat(nuevoPrecio) <= 1) {
                console.log("El precio es inválido, está vacío o es menor o igual a 1");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor ingrese un precio válido mayor a 1.'
                });
                return;
            }

            const token = localStorage.getItem("token"); 
            
            // Verificar que el token esté presente
            if (!token) {
                console.log("Token no encontrado");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró el token de autenticación.'
                });
                return;
            }

            fetch(`http://localhost:8081/api/locales/precio-mensual?nuevoPrecio=${encodeURIComponent(nuevoPrecio)}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    console.error(`HTTP Error: ${response.status} ${response.statusText}`);
                    throw new Error('Error al actualizar el precio');
                }
                return response.text(); // Usar .text() si la respuesta no es JSON
            })
            .then(data => {
                console.log("Respuesta del servidor:", data); // Verificar la respuesta del servidor

                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: data  // Mostrar el mensaje real del backend
                });

                // Limpiar el campo de entrada después de la actualización
                document.getElementById('globalRentaPrecio').value = '';

                // Actualizar el precio en la etiqueta, si existe
                const precioLabel = document.getElementById('precioActual');
                if (precioLabel) {
                    precioLabel.textContent = nuevoPrecio;
                }

            })
            .catch(error => {
                console.error('Fetch Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error: ' + error.message
                });
            });
        }
    });
});


document.getElementById('cancelBtn').addEventListener('click', function() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas cancelar y salir?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, Cancelar',
        cancelButtonText: 'No, permanecer'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '../../view/modulo-inicio/dashboard-inicio.html';
        }
    });
});




document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();  // Limpia todo el localStorage
    sessionStorage.clear(); // Limpia todo el sessionStorage
    window.location.href = "../modulo-login/page-login.html"; // Redirige al login
});
