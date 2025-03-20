document.getElementById('formActLocal').addEventListener('submit', function (event) {
    // Evita que el formulario se envíe si los campos están vacíos
    event.preventDefault();

    // Obtener los valores de los campos
    const actLocal = document.getElementById('actLocal').value.trim();
    const nombreActLocal = document.getElementById('nombreActLocal').value.trim();
    const precioActMensual = document.getElementById('precioActMensual').value.trim();
    const estatusActRenta = document.getElementById('estatusActRenta').value.trim();

    // Validación de campos
    if (!actLocal || !nombreActLocal || !precioActMensual || !estatusActRenta) {
        // Mostrar alerta si algún campo está vacío
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Por favor, completa todos los campos.',
        });
    } else {
        // Si todo está completo, muestra una alerta de éxito
        Swal.fire({
            icon: 'success',
            title: '¡Formulario enviado!',
            text: 'El local se ha actualizado correctamente.',
            timer: 3000, // Tiempo de espera en milisegundos (3 segundos)

        }).then(() => {
            // Redirigir a la página de consulta de local
            window.location.href = '../modulo-local/consultar-local.html';
        });
    }
});

// Función para cancelar el formulario
document.getElementById('cancelBtn').addEventListener('click', function () {
    // Redirigir a la página de dashboard
    window.location.href = '../modulo-inicio/dashboard-inicio.html';
});

// Función para validar el campo de "Precio mensual" (solo números)
document.getElementById('precioActMensual').addEventListener('input', function (event) {
    let valor = event.target.value;

    // Eliminar cualquier carácter que no sea un número o punto
    valor = valor.replace(/[^0-9.]/g, '');

    // Actualizar el campo con el valor limpio
    event.target.value = valor;
});