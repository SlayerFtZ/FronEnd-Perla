 // Esperamos a que el documento esté listo
 document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formAgregarReparacion');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Cancelar la acción del formulario (limpiar o volver al estado anterior)
    cancelBtn.addEventListener('click', function() {
        form.reset(); // Reseteamos el formulario
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenimos el envío del formulario

        // Obtenemos los valores de los campos del formulario
        const descripcion = document.getElementById('descripcionReparacion').value;
        const contratista = document.getElementById('contratista').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const costoReparacion = document.getElementById('costoReparacion').value;

        // Validación de los campos
        if (!descripcion || !contratista || !fechaFin || !costoReparacion) {
            // Si algún campo está vacío, mostramos un mensaje de error
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Todos los campos son obligatorios.',
                confirmButtonText: 'Aceptar'
            });
        } else {
            // Si todo está completo, mostramos una confirmación
            Swal.fire({
                icon: 'success',
                title: '¡Reparación agregada!',
                text: 'La reparación se ha agregado correctamente.',
                confirmButtonText: 'Aceptar'
            }).then((result) => {
                if (result.isConfirmed) {
                    form.reset(); // Limpiar formulario si el usuario confirma
                }
            });
        }
    });
});