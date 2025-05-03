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

document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("opcionesBuscarIngreso");
    const contenedorBusqueda = document.getElementById("contenedor-busqueda");
    const btnBuscar = document.querySelector(".app-search__button");
    const tbody = document.querySelector("tbody");
    const token = localStorage.getItem("token");
    const urlBase = "http://localhost:8081/api/ingresos-juegos";

    // Actualizar campos según opción seleccionada
    select.addEventListener("change", () => {
        const opcion = select.value;

        if (opcion === "fecha") {
            contenedorBusqueda.innerHTML = `
                <div class="row mt-3">
                    <div class="col">
                        <label for="fechaInicio">Fecha inicio:</label>
                        <input type="date" id="fechaInicio" class="form-control" />
                    </div>
                    <div class="col">
                        <label for="fechaFin">Fecha fin:</label>
                        <input type="date" id="fechaFin" class="form-control" />
                    </div>
                </div>
            `;
        } else if (opcion === "todos") {
            contenedorBusqueda.innerHTML = "";
        } else if (opcion !== "nMaquina") {
            contenedorBusqueda.innerHTML = `
                <input type="text" id="inputBusqueda" class="form-control mt-3" placeholder="Buscar..." />
            `;
        } else {
            contenedorBusqueda.innerHTML = "";
        }
    });

    // Renderizar la tabla
    function renderIngresos(data) {
        tbody.innerHTML = "";

        data.content.forEach((ingreso) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${ingreso.idIngreso}</td>
                <td><img src="${ingreso.imagenUsuario || "../../images/perfilUsuario.jpg"}" width="50" class="me-2">${ingreso.nombreUsuario}</td>
                <td>${ingreso.nombreMaquina || "N/A"}</td>
                <td>${ingreso.fecha}</td>
                <td>$${ingreso.totalIngresos.toLocaleString()}</td> 
                <td>
                    <button class="btn btn-warning btn-sm btn-abrir-modal"
                        data-id="${ingreso.idIngreso}"
                        data-juego-id="${ingreso.idMaquina || ""}" 
                        data-juego-nombre="${ingreso.nombreMaquina || ""}"
                        data-monto="${ingreso.totalIngresos}"
                        data-fecha="${ingreso.fecha}"
                        data-bs-toggle="modal"
                        data-bs-target="#modalActualizarIngreso">
                        Actualizar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Buscar ingresos según opción seleccionada
    btnBuscar.addEventListener("click", async (e) => {
        e.preventDefault();
        const opcion = select.value;
        let url = "";

        if (opcion === "todos") {
            url = `${urlBase}?numeroPagina=0&tamanoPagina=10`;
        } else if (opcion === "nMaquina") {
            const inputBusqueda = document.querySelector(".app-search__input");
            if (!inputBusqueda || !inputBusqueda.value.trim()) {
                Swal.fire("Error", "Ingresa el nombre de la máquina.", "error");
                return;
            }
            url = `${urlBase}/buscar/maquina?nombre=${encodeURIComponent(inputBusqueda.value.trim())}&numeroPagina=0&tamanoPagina=10`;
        } else if (opcion === "fecha") {
            const fechaInicioInput = document.getElementById("fechaInicio");
            const fechaFinInput = document.getElementById("fechaFin");

            if (!fechaInicioInput.value || !fechaFinInput.value) {
                Swal.fire("Error", "Selecciona ambas fechas.", "error");
                return;
            }

            url = `${urlBase}/periodo?fechaInicio=${fechaInicioInput.value}&fechaFin=${fechaFinInput.value}&numeroPagina=0&tamanoPagina=10`;
        } else {
            const input = document.getElementById("inputBusqueda");
            if (!input || !input.value.trim()) {
                Swal.fire("Error", "Ingresa un valor de búsqueda.", "error");
                return;
            }
            url = `${urlBase}/buscar?query=${encodeURIComponent(input.value.trim())}&numeroPagina=0&tamanoPagina=10`;
        }

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Error en la petición");
            const data = await response.json();
            renderIngresos(data);
            Swal.fire("Éxito", "Datos cargados correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire(
                "Error",
                `Hubo un problema al cargar los datos: ${error.message}`,
                "error"
            );
        }
    });

    // Abrir Modal y cargar datos
    tbody.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("btn-abrir-modal")) {
            const boton = e.target;

            const idIngreso = boton.getAttribute("data-id");
            const totalIngresos = boton.getAttribute("data-monto");
            const fecha = boton.getAttribute("data-fecha");
            const idMaquina = boton.getAttribute('data-juego-id');
            const nombreMaquina = boton.getAttribute('data-juego-nombre');

            document.getElementById('idIngresoActualizar').value = idIngreso;
            document.getElementById('montoActualizar').value = totalIngresos;
            document.getElementById('fechaActualizar').value = fecha;
            document.getElementById('juegoSeleccionado').value = nombreMaquina;
            document.getElementById('juegoSeleccionado').setAttribute('data-id-maquina', idMaquina);
        }
    });

    // Actualizar ingreso
    document.getElementById("btnActualizar").addEventListener("click", async (event) => {
        event.preventDefault(); // Evitar que el formulario se envíe y recargue la página

        const idIngreso = document.getElementById("idIngresoActualizar").value;
        const monto = document.getElementById("montoActualizar").value;
        const fecha = document.getElementById("fechaActualizar").value;
        const idJuego = document.getElementById('juegoSeleccionado').getAttribute('data-id-maquina');
        const idUsuario = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8081/api/ingresos-juegos/actualizar/${idIngreso}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    totalIngresos: monto,
                    fecha: fecha,
                    idMaquina: idJuego,
                    idUsuario: idUsuario,
                }),
            });

            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    try {
                        Swal.fire("Éxito", "Ingreso actualizado correctamente.", "success").then(() => {
                            // Cerrar el modal
                            const modal = bootstrap.Modal.getInstance(document.getElementById('modalActualizarIngreso'));
                            modal.hide();

                            // Recargar la tabla
                            btnBuscar.click(); // Simula un click para recargar los datos
                        });
                    } catch (swalError) {
                        console.error("Error al mostrar Swal:", swalError);
                    }
                    console.log("Respuesta:", data);
                } else {
                    Swal.fire("Éxito", "Ingreso actualizado.", "success").then(() => {
                        // Cerrar el modal
                        const modal = bootstrap.Modal.getInstance(document.getElementById('modalActualizarIngreso'));
                        modal.hide();

                        // Recargar la tabla
                        btnBuscar.click(); // Simula un click para recargar los datos
                    });
                    console.log("Actualización sin JSON");
                }
            } else {
                const errorData = await response.json();
                try {
                    Swal.fire("Error", errorData.message || "Error desconocido", "error");
                } catch (swalError) {
                    console.error("Error al mostrar Swal:", swalError);
                }
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            try {
                Swal.fire("Error", "Error de red o del servidor", "error");
            } catch (swalError) {
                console.error("Error al mostrar Swal:", swalError);
            }
        }
    });
});


document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.clear(); // Limpia todo el localStorage
  sessionStorage.clear(); // Limpia todo el sessionStorage
  window.location.href = "../modulo-login/page-login.html"; // Redirige al login
});
