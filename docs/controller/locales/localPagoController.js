// Espera a que el DOM esté listo

document.addEventListener('DOMContentLoaded', function () {

    // Obtener el formulario
    const formPago = document.getElementById('formPago');

    formPago.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevenir el envío del formulario por defecto

        // Obtener el valor del abono
        const montoAbono = document.getElementById('monto').value;

        // Validación del abono
        if (!montoAbono || montoAbono <= 0) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Por favor ingrese un monto válido para abonar.',
                confirmButtonText: 'Aceptar'
            });
        } else {
            // Validación si el monto ingresado es mayor que el adeudo
            const adeudo = 1800; // Monto del adeudo
            if (montoAbono > adeudo) {
                Swal.fire({
                    icon: 'warning',
                    title: '¡Atención!',
                    text: 'El monto ingresado excede el adeudo.',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                // Si todo está bien, muestra mensaje de éxito y cierra el modal
                Swal.fire({
                    icon: 'success',
                    title: 'Pago realizado',
                    text: 'El pago se ha realizado exitosamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    // Cierra el modal
                    $('#simularPagoModal').modal('hide');
                });
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Verificar si el usuario tiene token, id y rol en el localStorage
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const rol = localStorage.getItem("rol");

    // Si no hay token, id o rol, redirigir al login
    if (!token || !id || !rol) {
        window.location.href = "../../view/modulo-login/page-login.html"; // Si no hay token, id o rol, redirigir al login
    }
    });

    document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();  // Limpia todo el localStorage
    sessionStorage.clear(); // Limpia todo el sessionStorage
    window.location.href = "../modulo-login/page-login.html"; // Redirige al login
    });