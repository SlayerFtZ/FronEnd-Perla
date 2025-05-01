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
// Cargar nombre completo del usuario en el input
const id = localStorage.getItem('id');
const token = localStorage.getItem('token');
fetch(`http://localhost:8081/api/usuarios/${id}`, {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + token
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('No se pudo obtener la información del usuario');
    }
    return response.json();
})
.then(data => {
    const nombreCompleto = `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`;
    document.getElementById('usuarioEgreso').value = nombreCompleto;
})
.catch(error => {
    console.error('Error al cargar el usuario:', error);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el nombre del usuario.'
    });
});

document.getElementById('success').addEventListener('click', function (e) {
    e.preventDefault();

    // Obtener los datos del formulario
    const descripcion = document.getElementById('descripcionEgreso').value;
    const fechaPago = document.getElementById('fechaEgreso').value;
    const monto = parseFloat(document.getElementById('costMen').value);

    // Validación básica
    if (!descripcion || !fechaPago || isNaN(monto)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, llena todos los campos correctamente.'
        });
        return;
    }

    // Obtener ID del usuario y token del localStorage
    const idUsuario = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    if (!idUsuario || !token) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario no autenticado.'
        });
        return;
    }

    // Crear objeto de datos
    const datos = {
        descripcion: descripcion,
        fechaPago: fechaPago,
        monto: monto,
        idUsuario: parseInt(idUsuario)
    };

    // Enviar la solicitud POST
    fetch('http://localhost:8081/api/pagos/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: '¡Egreso agregado correctamente!'
        });
        // Limpiar el formulario si deseas
        document.getElementById('formAgregarEgresoGeneral').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al agregar el egreso.'
        });
    });
});

// Botón cancelar con confirmación usando SweetAlert
document.getElementById('cancelBtn').addEventListener('click', () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se perderán los datos ingresados.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, continuar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "../../view/modulo-inicio/dashboard-inicio.html";
        }
    });
});

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();  // Limpia todo el localStorage
    sessionStorage.clear(); // Limpia todo el sessionStorage
    window.location.href = "../modulo-login/page-login.html"; // Redirige al login
});
