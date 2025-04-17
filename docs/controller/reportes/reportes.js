document.addEventListener('DOMContentLoaded', function () {
    const formReporte = document.querySelector('form');

    // Desactivar validación HTML5 nativa
    formReporte.setAttribute('novalidate', true);

    // Validar al enviar el formulario
    formReporte.addEventListener('submit', function (e) {
        // Resetear todas las validaciones visuales primero
        document.querySelectorAll('.form-control').forEach(campo => {
            campo.classList.remove('is-invalid');
        });

        // Validar campos
        let isValid = true;

        // Validar selects
        const tipoReporte = document.getElementById('reporteSeleccion');
        const estadoReporte = document.getElementById('opcionesUsuariReporte');

        if (tipoReporte.value === "seleccion") {
            tipoReporte.classList.add('is-invalid');
            isValid = false;
        }

        if (estadoReporte.value === "seleccion") {
            estadoReporte.classList.add('is-invalid');
            isValid = false;
        }

        // Validar campo de fecha
        const periodoReporte = document.getElementById('periodoReporte');
        if (!periodoReporte.value) {
            periodoReporte.classList.add('is-invalid');
            isValid = false;
        }

        // Prevenir envío si no es válido
        if (!isValid) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // Limpiar validación al modificar campos
    const camposValidar = [
        'reporteSeleccion',
        'opcionesUsuariReporte',
        'periodoReporte'
    ];

    camposValidar.forEach(id => {
        const campo = document.getElementById(id);
        campo.addEventListener('input', function () {
            // Solo removemos la clase de error, no añadimos la de éxito
            this.classList.remove('is-invalid');
        });
    });
});