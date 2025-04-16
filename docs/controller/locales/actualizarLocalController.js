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


    // Cargar opciones de locales
    fetch('http://localhost:8081/api/locales', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const selectLocal = document.getElementById('nombreActLocal');
        data.forEach(local => {
            const option = document.createElement('option');
            option.value = local.idLocal;
            option.textContent = local.numeroLocal;
            selectLocal.appendChild(option);
        });

        // Restaurar selección previa
        const storedId = sessionStorage.getItem('selectLocalid');
        if (storedId) {
            selectLocal.value = storedId;
        }

        // Guardar nueva selección
        selectLocal.addEventListener('change', function () {
            sessionStorage.setItem('selectLocalid', selectLocal.value);
        });

        // Guardar todos los locales para validación de duplicado
        window.localesData = data;
    })
    .catch(error => {
        console.error('Error al cargar locales:', error);
    });

    // Validar solo números para el precio
    document.getElementById('precioActMensual').addEventListener('input', function (event) {
        let valor = event.target.value;
        valor = valor.replace(/[^0-9.]/g, '');
        event.target.value = valor;
    });

    // Enviar formulario
    document.getElementById('formActLocal').addEventListener('submit', function (event) {
        event.preventDefault();

        const idLocal = sessionStorage.getItem('selectLocalid');
        const nuevoNumeroLocal = document.getElementById('actLocal').value.trim();
        const precioActMensual = document.getElementById('precioActMensual').value.trim();
        const estatusActRenta = document.getElementById('estatusActRenta').value.trim();
        const idUsuario = localStorage.getItem('id');

        if (!idLocal || !nuevoNumeroLocal || !precioActMensual || !estatusActRenta || !idUsuario) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Por favor, completa todos los campos.',
            });
            return;
        }

        // Validar duplicado de numeroLocal
        const existe = window.localesData.some(local => 
            local.numeroLocal === nuevoNumeroLocal && local.idLocal !== parseInt(idLocal)
        );

        if (existe) {
            Swal.fire({
                icon: 'error',
                title: 'Número duplicado',
                text: 'Ya existe un local con ese identificador. Ingresa uno diferente.',
            });
            return;
        }

        const datosActualizados = {
            numeroLocal: nuevoNumeroLocal,
            precioMensual: parseFloat(precioActMensual),
            estado: estatusActRenta.toUpperCase().replace(/ /g, '_'),
            idUsuario: parseInt(idUsuario)
        };

        fetch(`http://localhost:8081/api/locales/modificar/${idLocal}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosActualizados)
        })
        .then(response => {
            if (response.ok) return response.json();
            throw new Error('Error al actualizar el local');
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'El local se ha actualizado correctamente.',
                timer: 3000
            }).then(() => {
                window.location.href = '../modulo-local/consultar-local.html';
            });
        })
        .catch(error => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'No se pudo actualizar el local. Intenta nuevamente.',
            });
        });
    });

    // Botón cancelar
    document.getElementById('cancelBtn').addEventListener('click', function () {
        window.location.href = '../modulo-inicio/dashboard-inicio.html';
    });
});


    document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();  // Limpia todo el localStorage
    sessionStorage.clear(); // Limpia todo el sessionStorage
    window.location.href = "../modulo-login/page-login.html"; // Redirige al login
    });