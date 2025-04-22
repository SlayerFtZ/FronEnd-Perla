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

    const searchBtn = document.querySelector(".app-search__button");
    const searchInput = document.querySelector(".app-search__input");
    const resultTable = document.querySelector("tbody");
    const filtroBusqueda = document.getElementById("opcionesBuscarReparacion");

    searchBtn.addEventListener("click", function (e) {
        e.preventDefault();

        const textoBusqueda = searchInput.value.trim();
        const filtro = filtroBusqueda.value;

        if (textoBusqueda === "" || filtro === "seleccion") {
            Swal.fire({
                icon: 'warning',
                title: 'Búsqueda inválida',
                text: 'Selecciona un filtro y haz tu busqueda.',
            });
            return;
        }

        let url = "";

        switch (filtro) {
            case "contratista":
                url = `http://localhost:8081/api/reparaciones/buscar/contratista/${encodeURIComponent(textoBusqueda)}`;
                break;
            case "fecha":
                const partes = textoBusqueda.split("/");
                if (partes.length === 3) {
                    const [dia, mes, anio] = partes;
                    if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
                        const fechaFormateada = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
                        url = `http://localhost:8081/api/reparaciones/buscar/fecha/${encodeURIComponent(fechaFormateada)}`;
                        break;
                    }
                }
                url = `http://localhost:8081/api/reparaciones/buscar/fecha/${encodeURIComponent(textoBusqueda)}`;
                break;
            default:
                Swal.fire({
                    icon: 'warning',
                    title: 'Opción no válida',
                    text: 'Por favor, selecciona un filtro de busqueda.',
                });
                return;
        }

        fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
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
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No se encontraron reparaciones con el filtro seleccionado.',
                });
                return;
            }

            // Mostrar alerta de éxito si hay datos
            Swal.fire({
                icon: 'success',
                title: 'Reparaciones encontradas',
                text: `Se encontraron ${data.length} reparaciones.`,
            });

            data.forEach(reparacion => {
                const row = `
                    <tr>
                        <td><img src="../../images/perfilUsuario.jpg" width="25" class="me-2"> ${reparacion.contratista}</td>
                        <td><img src="../../images/perfilUsuario.jpg" width="25" class="me-2"> ${reparacion.nombreUsuario}</td>
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al buscar reparaciones. Por favor, inténtalo de nuevo más tarde.',
            });
            resultTable.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Ocurrió un error al buscar</td></tr>`;
        });
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../modulo-login/page-login.html";
    });
});
