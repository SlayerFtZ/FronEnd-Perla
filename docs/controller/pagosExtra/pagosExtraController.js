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


    loadUsuarios();
    initForm();
});

// ------------------------------

async function loadUsuarios() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('https://laperlacentrocomercial.dyndns.org/api/usuarios', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        const select = document.getElementById('opcionesUsuario');
        data.forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario.idUsuario;
            option.textContent = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;
            select.appendChild(option);
        });

        select.addEventListener('change', () => {
            sessionStorage.setItem('selectedUserIdPagoExtra', select.value);
        });

    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
    }
}

// ------------------------------

function initForm() {
    const form = document.getElementById('formPagoExtra');
    const campos = {
        usuario: document.getElementById('opcionesUsuario'),
        fecha: document.getElementById('fechaExtra'),
        monto: document.getElementById('montoExtra'),
        nota: document.getElementById('notaextra')
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        Object.values(campos).forEach(campo => campo.classList.remove('is-invalid'));

        let hasErrors = false;

        if (campos.usuario.value === "") {
            campos.usuario.classList.add('is-invalid');
            hasErrors = true;
        }

        if (!campos.fecha.value) {
            campos.fecha.classList.add('is-invalid');
            hasErrors = true;
        }

        if (!campos.monto.value) {
            campos.monto.classList.add('is-invalid');
            hasErrors = true;
        }

        if (hasErrors) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('No se encontró el token de autenticación. Por favor, inicia sesión.');
            return;
        }

        const data = {
            idUsuario: sessionStorage.getItem('selectedUserIdPagoExtra'),
            fecha: campos.fecha.value,
            montoAportado: parseFloat(campos.monto.value),
            descripcion: campos.nota.value.trim()
        };

        fetch('https://laperlacentrocomercial.dyndns.org/api/pagos-extras/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) throw new Error('Error en el registro del pago');
            return response.json();
        })
        .then(result => {
            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Pago registrado con éxito.'
            });
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocurrió un error al registrar el pago.'
            });
        });
    });

    Object.values(campos).forEach(campo => {
        campo.addEventListener('input', () => campo.classList.remove('is-invalid'));
    });
}


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formPagoExtra');
    const btnCancelar = document.getElementById('btnCancelar');

    btnCancelar.addEventListener('click', function () {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se cancelará el registro actual.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, continuar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Limpiar el formulario
                form.reset();

                // Redirigir al dashboard
                window.location.href = '../../view/modulo-inicio/dashboard-inicio.html';
            }
        });
    });
});

// ------------------------------

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "../modulo-login/page-login.html";
});
