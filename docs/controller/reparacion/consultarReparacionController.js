document.addEventListener("DOMContentLoaded", function () {
    // Validación de sesión
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const rol = localStorage.getItem("rol");

    if (!token || !id || !rol) {
        window.location.href = "../../view/modulo-login/page-login.html";
        return;
    }

    // Elementos del DOM
    const searchBtn = document.querySelector(".app-search__button");
    const searchInput = document.querySelector(".app-search__input");
    const resultTable = document.querySelector("tbody"); // asegúrate que este tbody es el correcto
    const filtroBusqueda = document.getElementById("opcionesBuscarReparacion");

    searchBtn.addEventListener("click", function (e) {
        e.preventDefault();

        const textoBusqueda = searchInput.value.trim();
        const filtro = filtroBusqueda.value;

        if (textoBusqueda === "" || filtro === "seleccion") {
            alert("Selecciona un tipo de búsqueda y escribe un término.");
            return;
        }

        let url = "";

        switch (filtro) {
            case "contratista":
                url = `http://localhost:8081/api/reparaciones/buscar/contratista/${encodeURIComponent(textoBusqueda)}`;
                break;
            case "fecha":
                // Validar y convertir la fecha si está en formato dd/mm/yyyy
                const partes = textoBusqueda.split("/");
                if (partes.length === 3) {
                    const [dia, mes, anio] = partes;
                    if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
                        const fechaFormateada = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
                        url = `http://localhost:8081/api/reparaciones/buscar/fecha/${encodeURIComponent(fechaFormateada)}`;
                        break;
                    }
                }

                // Si ya viene con el formato yyyy-mm-dd o algo inesperado, usar como está
                url = `http://localhost:8081/api/reparaciones/buscar/fecha/${encodeURIComponent(textoBusqueda)}`;
                break;
            default:
                alert("Opción de búsqueda no válida.");
                return;
        }

        fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Aquí se envía el token JWT
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            resultTable.innerHTML = "";

            if (data.length === 0) {
                resultTable.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron resultados</td></tr>`;
                return;
            }

            data.forEach(reparacion => {
                const row = `
                    <tr>
                        <td><img src="../../images/perfilUsuario.jpg" width="25" class="me-2"> ${reparacion.contratista}</td>
                        <td><img src="../../images/perfilUsuario.jpg" width="25" class="me-2"> ${reparacion.nombreUsuario} </td>
                        <td>${reparacion.descripcion}</td>
                        <td>${reparacion.fecha}</td>
                        <td>${reparacion.fechaFinalizacion}</td>
                        <td>$${parseFloat(reparacion.costo).toFixed(2)}</td>
                    </tr>
                `;
                resultTable.innerHTML += row;
            });
        })
        .catch(error => {
            console.error("Error al buscar reparaciones:", error);
            resultTable.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Ocurrió un error al buscar</td></tr>`;
        });
    });

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "../modulo-login/page-login.html";
        });
    }
});
