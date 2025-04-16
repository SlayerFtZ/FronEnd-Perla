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
});


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("formAgregarReparacion").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener los valores de los campos
        let localinput = document.getElementById("local").value.trim();
        let descripcionOne = document.getElementById("descripcion").value.trim();
        let contratistaName = document.getElementById("contratista").value.trim();
        let costo = document.getElementById("costo").value.trim();

        // Validar que los campos no estén vacíos
        if (localinput === "" || descripcionOne === "" || contratistaName === "" || costo === "") {
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
            text: "La reparacion ha sido agregada correctamente.",
        }).then(() => {
            // Aquí puedes enviar el formulario si es necesario
            document.getElementById("agregar-reparacion").reset();
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
        // Evento para el botón de logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.clear();  // Limpia todo el localStorage
        sessionStorage.clear(); // Limpia todo el sessionStorage
        window.location.href = "../modulo-login/page-login.html"; // Redirige al login
    });
});