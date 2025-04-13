document.addEventListener('DOMContentLoaded', function () {
    const swalError = (title, text) => {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonColor: '#3085d6',
        });
    };

    const swalConfirm = (form) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Todos los datos ingresados se perderán",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, continuar'
        }).then((result) => {
            if (result.isConfirmed) {
                resetForm(form);
                Swal.fire(
                    'Cancelado',
                    'El formulario ha sido restablecido',
                    'success'
                );
            }
        });
    };

    const resetForm = (form) => {
        form.reset();
        
        form.querySelectorAll('.is-invalid').forEach(campo => {
            campo.classList.remove('is-invalid');
        });
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
            feedback.style.display = 'none';
        });
    };

    const validarCampo = (campo, nombreCampo) => {
        const valor = campo.value.trim();
        const feedback = campo.nextElementSibling;

        if (!valor) {
            campo.classList.add('is-invalid');
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.style.display = 'block';
            }
            return false;
        } else {
            campo.classList.remove('is-invalid');
            if (feedback) feedback.style.display = 'none';
            return true;
        }
    };

    const formAgregarIngreso = document.getElementById('formAgregarIngreso1');
    const btnAgregarRenta = document.getElementById('agegstr');
    const btnCancelarRenta = document.getElementById('cancelBtn');

    if (btnCancelarRenta && formAgregarIngreso) {
        btnCancelarRenta.addEventListener('click', function () {
            swalConfirm(formAgregarIngreso);
        });
    }

    if (btnAgregarRenta && formAgregarIngreso) {
        btnAgregarRenta.addEventListener('click', function (e) {
            e.preventDefault();
            let esValido = true;

            const campos = [
                { id: 'user1', nombre: 'Usuario' },
                { id: 'local1', nombre: 'Local' },
                { id: 'statusLocal1', nombre: 'Estatus del local' },
                { id: 'costMen', nombre: 'Costo mensual' }
            ];

            campos.forEach(({ id, nombre }) => {
                const campo = document.getElementById(id);
                if (!validarCampo(campo, nombre)) esValido = false;
            });

            if (!esValido) {
                
                return;
            }

            Swal.fire({
                icon: 'success',
                title: '¡Formulario válido!',
                text: '¿Agregar este ingreso general?',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Agregar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) formAgregarIngreso.submit();
            });
        });
    }

    const formAgregarJuego = document.getElementById('formAgregarLocal');
    const btnAgregarJuego = formAgregarJuego?.querySelector('button[type="submit"]');
    const btnCancelarJuego = formAgregarJuego?.querySelector('#cancelBtn');

    if (btnCancelarJuego && formAgregarJuego) {
        btnCancelarJuego.addEventListener('click', function () {
            swalConfirm(formAgregarJuego);
        });
    }

    if (formAgregarJuego) {
        formAgregarJuego.addEventListener('submit', function (e) {
            e.preventDefault();
            let esValido = true;

            const campos = [
                { id: 'actLocal', nombre: 'Número de máquina' },
                { id: 'fechaInicioRnt', nombre: 'Fecha de inicio' }
            ];

            campos.forEach(({ id, nombre }) => {
                const campo = document.getElementById(id);
                if (!validarCampo(campo, nombre)) esValido = false;
            });

            if (!esValido) {
                swalError('Campos incompletos', 'Completa los campos marcados en rojo.');
                return;
            }

            Swal.fire({
                icon: 'success',
                title: '¡Formulario válido!',
                text: '¿Agregar este ingreso de juego?',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Agregar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) formAgregarJuego.submit();
            });
        });
    }

    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', function () {
            this.classList.remove('is-invalid');
            const feedback = this.nextElementSibling;
            if (feedback) feedback.style.display = 'none';
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {

    const seleccionartipo = document.getElementById('selectPrincipal');
    const ingresoGral = document.getElementById('ingresoGral');
    const ingresoJuego = document.getElementById('ingresoJuego');

    ingresoGral.style.display = 'none';
    ingresoJuego.style.display = 'none';

    seleccionartipo.addEventListener('change', function () {
        const seleccion = seleccionartipo.value;

        if (seleccion === 'ingGral') {
            ingresoGral.style.display = 'block';
            ingresoJuego.style.display = 'none';
        } else if (seleccion === 'ingJue') {
            ingresoGral.style.display = 'none';
            ingresoJuego.style.display = 'block';
        }
        else {
            ingresoGral.style.display = 'none';
            ingresoJuego.style.display = 'none';
        }
    });

});


