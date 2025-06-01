document.addEventListener("DOMContentLoaded", function () {
    // Obtener datos del localStorage
    const token = localStorage.getItem("token");
    const id = getDecryptedUserId();
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

    // Evento para el formulario de agregar juego
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

        // Crear el objeto con los datos del formulario
        const data = {
            nombre: nombreJuego,
            descripcion: descripcionJuego,
            estado: estadoUso
        };

        // Enviar la solicitud POST a la API--
        const token = localStorage.getItem("token");
        fetch("https://laperlacentrocomercial.dyndns.org/api/maquinas-juegos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta de la API.");
            }
            return response.json();
        })
        .then(response => {
            console.log(response); // Para depuración
            if (response.idMaquina != null) {
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "La máquina de juego ha sido agregada correctamente.",
                }).then(() => {
                    document.getElementById("formAgregarJuego").reset();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message || "Hubo un error al agregar la máquina.",
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al enviar los datos. Intenta nuevamente.",
            });
            console.error("Error:", error);
        });
    });        

    // Evento para el botón de cancelar
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