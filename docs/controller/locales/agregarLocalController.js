document.getElementById('formAgregarLocal').addEventListener('submit', function (event) {
    // Evita que el formulario se envíe si los campos están vacíos
    event.preventDefault();

    // Obtener los valores de los campos
    const nombreLocal = document.getElementById('nombreLocal').value.trim();
    const precioMensual = document.getElementById('precioMensual').value.trim();
    const estatusRenta = document.getElementById('estatusRenta').value.trim();

    // Validación de campos
    if (!nombreLocal || !precioMensual || !estatusRenta) {
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
            text: 'El local se ha agregado correctamente.',
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
document.getElementById('precioMensual').addEventListener('input', function (event) {
    let valor = event.target.value;

    // Eliminar cualquier carácter que no sea un número o punto
    valor = valor.replace(/[^0-9.]/g, '');

    // Actualizar el campo con el valor limpio
    event.target.value = valor;
});