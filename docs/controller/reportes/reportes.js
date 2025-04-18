document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    // Configurar validación al enviar
    form.addEventListener('submit', function (e) {
        // Resetear validaciones previas
        document.querySelectorAll('.form-control').forEach(campo => {
            campo.classList.remove('is-invalid');
        });

        let hasErrors = false;

        // Validar tipo de reporte
        const tipoReporte = document.getElementById('reporteSeleccion');
        if (tipoReporte.value === "seleccion") {
            tipoReporte.classList.add('is-invalid');
            hasErrors = true;
        }

        // Validar estado
        const estadoReporte = document.getElementById('opcionesUsuariReporte');
        if (estadoReporte.value === "seleccion") {
            estadoReporte.classList.add('is-invalid');
            hasErrors = true;
        }

        // Validar fechas
        const inicioPeriodo = document.getElementById('periodoReporte');
        const finPeriodo = document.getElementById('periodoReporte2');

        if (!inicioPeriodo.value) {
            inicioPeriodo.classList.add('is-invalid');
            hasErrors = true;
        }

        if (!finPeriodo.value) {
            finPeriodo.classList.add('is-invalid');
            hasErrors = true;
        }

        // Validar que fecha fin no sea menor a fecha inicio
        if (inicioPeriodo.value && finPeriodo.value) {
            if (new Date(finPeriodo.value) < new Date(inicioPeriodo.value)) {
                finPeriodo.classList.add('is-invalid');
                hasErrors = true;
                // Opcional: Mostrar mensaje específico
                finPeriodo.nextElementSibling.textContent = "La fecha final no puede ser anterior a la inicial";
            }
        }

        // Prevenir envío si hay errores
        if (hasErrors) {
            e.preventDefault();
        }
    });

    // Limpiar validación al modificar campos
    document.querySelectorAll('#reporteSeleccion, #opcionesUsuariReporte, #periodoReporte, #periodoReporte2').forEach(campo => {
        campo.addEventListener('input', function () {
            this.classList.remove('is-invalid');
            // Limpiar mensaje de error si existe
            if (this.nextElementSibling && this.nextElementSibling.classList.contains('invalid-feedback')) {
                this.nextElementSibling.textContent = this.getAttribute('data-default-error') || '';
            }
        });
    });
});