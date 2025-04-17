document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formPagoExtra');
    const campos = {
        usuario: document.getElementById('userExtra'),
        fecha: document.getElementById('fechaExtra'),
        monto: document.getElementById('montoExtra'),
        nota: document.getElementById('notaextra')
    };

    // Validar al enviar el formulario
    form.addEventListener('submit', function (e) {
        // Resetear todas las validaciones visuales primero
        Object.values(campos).forEach(campo => {
            campo.classList.remove('is-invalid');
        });

        let hasErrors = false;

        // Validar select de usuario
        if (campos.usuario.value === "") {
            campos.usuario.classList.add('is-invalid');
            hasErrors = true;
        }

        // Validar campo de fecha
        if (!campos.fecha.value) {
            campos.fecha.classList.add('is-invalid');
            hasErrors = true;
        }

        // Validar monto (solo si está vacío)
        if (!campos.monto.value) {
            campos.monto.classList.add('is-invalid');
            hasErrors = true;
        }
        // Validar notas (solo si está vacío y es requerido)
        // if(!campos.nota.value.trim()) {
        //     campos.nota.classList.add('is-invalid');
        //     hasErrors = true;
        // }
        
        // Prevenir envío si hay errores
        if (hasErrors) {
            e.preventDefault();
        }
    });

    Object.values(campos).forEach(campo => {
        campo.addEventListener('input', function () {
            // Solo removemos la clase de error cuando el usuario empieza a escribir
            this.classList.remove('is-invalid');
        });
    });
});