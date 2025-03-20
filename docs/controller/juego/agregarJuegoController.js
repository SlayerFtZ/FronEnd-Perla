document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("formAgregarJuego").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener los valores de los campos
        let nombreJuego = document.getElementById("nombreJuego").value.trim();
        let descripcionJuego = document.getElementById("descripcionJuego").value.trim();
        let estadoUso = document.getElementById("estadoUso").value;

        // Validar que los campos no estén vacíos
        if (nombreJuego === "" || descripcionJuego === "" || estadoUso === "") {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Todos los campos son obligatorios.",
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "El juego ha sido agregado correctamente.",
        }).then(() => {
            // Aquí puedes enviar el formulario si es necesario
            document.getElementById("formAgregarJuego").reset();
        });
    });

    document.getElementById("cancelBtn").addEventListener("click", function () {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Se perderán los datos ingresados.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "No, seguir editando"
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById("formAgregarJuego").reset();
                Swal.fire({
                    icon: "success",
                    title: "Formulario limpiado",
                    text: "Se ha cancelado el registro.",
                    showConfirmButton: false
                });
                setTimeout(() => {
                    window.location.href = '../../view/modulo-inicio/dashboard-inicio.html';
                }, 2000);
            }
        });
    });
    
    
});
