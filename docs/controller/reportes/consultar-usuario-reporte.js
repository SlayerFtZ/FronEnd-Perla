let idReporteActual = null;

document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("opcionesBuscarLocal");
    const contenedorBusqueda = document.getElementById("contenedor-busqueda");
    const tablaReporte = document.getElementById("tablaReporte");
    const inputBusqueda = document.getElementById("searchLocal");
    const token = localStorage.getItem("token");

    
    const setAlert = (message, type = "error") => {
        Swal.fire({
            icon: type,
            title: type === "success" ? "Éxito" : "Aviso",
            text: message,
            confirmButtonText: "Aceptar"
        });
    };

    const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    };

    let fechaInicioInput, fechaFinInput;

    select.addEventListener("change", () => {
        const opcion = select.value;
        console.log("Opción seleccionada:", opcion);  // Verifica la opción seleccionada
        contenedorBusqueda.innerHTML = "";
    
        if (opcion === "periodo") {
            // Crear un contenedor de fila
            const row = document.createElement("div");
            row.className = "row mt-3";  // Usamos la clase 'row' de Bootstrap para el layout en fila
    
            // Crear la primera columna con el input para la fecha de inicio
            const colFechaInicio = document.createElement("div");
            colFechaInicio.className = "col";  // Clase 'col' para que ocupe el 50% de la fila
    
            const labelFechaInicio = document.createElement("label");
            labelFechaInicio.setAttribute("for", "fechaInicio");
            labelFechaInicio.textContent = "Fecha inicio:";
    
            fechaInicioInput = document.createElement("input");
            fechaInicioInput.type = "date";
            fechaInicioInput.className = "form-control";  // Clase de Bootstrap para el estilo
            fechaInicioInput.id = "fechaInicio";
    
            colFechaInicio.appendChild(labelFechaInicio);
            colFechaInicio.appendChild(fechaInicioInput);
    
            // Crear la segunda columna con el input para la fecha de fin
            const colFechaFin = document.createElement("div");
            colFechaFin.className = "col";  // Clase 'col' para que ocupe el 50% de la fila
    
            const labelFechaFin = document.createElement("label");
            labelFechaFin.setAttribute("for", "fechaFin");
            labelFechaFin.textContent = "Fecha fin:";
    
            fechaFinInput = document.createElement("input");
            fechaFinInput.type = "date";
            fechaFinInput.className = "form-control";  // Clase de Bootstrap para el estilo
            fechaFinInput.id = "fechaFin";
    
            colFechaFin.appendChild(labelFechaFin);
            colFechaFin.appendChild(fechaFinInput);
    
            // Añadir las columnas a la fila
            row.appendChild(colFechaInicio);
            row.appendChild(colFechaFin);
    
            // Añadir la fila al contenedor
            contenedorBusqueda.appendChild(row);
        }
    });
    


    document.querySelector(".app-search__button").addEventListener("click", () => {
        const opcion = select.value;
        let url = "";

        switch (opcion) {
            case "todos":
                url = "http://localhost:8081/api/reportes";
                break;

            case "estado":
                let estado = inputBusqueda.value.trim().toUpperCase();
                if (!estado) {
                    setAlert("Por favor ingresa un estado para buscar.", "warning");
                    return;
                }

                if (estado === "EN PROCESO" || estado === "ENPROCESO") {
                    estado = "EN_PROCESO";
                }

                const estadosValidos = ["EN_PROCESO", "CERRADO", "ABIERTO"];
                if (!estadosValidos.includes(estado)) {
                    setAlert("El estado ingresado no es válido. Usa EN_PROCESO, CERRADO o ABIERTO.", "warning");
                    return;
                }

                url = `http://localhost:8081/api/reportes/estado?estadoReporte=${encodeURIComponent(estado)}`;
                break;

            case "tipo":
                const tipo = inputBusqueda.value.trim().toUpperCase();
                if (!tipo) {
                    setAlert("Por favor ingresa un tipo de reporte para buscar.", "warning");
                    return;
                }
                url = `http://localhost:8081/api/reportes/tipo?tipoReporte=${encodeURIComponent(tipo)}`;
                break;

            case "periodo":
                const fechaInicio = document.getElementById("fechaInicio").value;
                const fechaFin = document.getElementById("fechaFin").value;
                if (!fechaInicio || !fechaFin) {
                    setAlert("Por favor selecciona ambas fechas.", "warning");
                    return;
                }
                url = `http://localhost:8081/api/reportes/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
                break;

            default:
                setAlert("Selecciona una opción válida.", "warning");
                return;
        }
            
            fetch(url, { method: "GET", headers })
            .then(response => response.json())
            .then(data => {
                tablaReporte.innerHTML = "";

                if (!data || data.length === 0) {
                    setAlert("No se encontraron resultados.", "warning");
                    return;
                }

                setAlert("Datos cargados correctamente.", "success");

                data.forEach((reporte, index) => {
                    const row = document.createElement("tr");

                    // Determinar si el botón debe estar deshabilitado según el estado
                    const estado = reporte.estado.toLowerCase();
                    const isDisabled = estado === 'cerrado' || estado === 'en proceso';

                    row.innerHTML = ` 
                        <td>${index + 1}</td>
                        <td><img src="${reporte.fotoPerfil || '../../images/perfilUsuario.jpg'}" width="50" class="rounded-circle me-2">${reporte.nombreUsuario}</td>
                        <td>${reporte.tipo}</td>
                        <td>${reporte.descripcion}</td>
                        <td>${reporte.estado}</td>
                        <td>${reporte.fechaCreacion}</td>
                        <td>
                            <button class="btn btn-primary btn-sm ver-reporte" data-id="${reporte.idReporte}" data-path="${reporte.path}" ${isDisabled ? 'disabled' : ''}>Ver</button>
                            <button class="btn btn-warning btn-sm eliminar-reporte" data-id="${reporte.idReporte}">Revisión</button>

                            </td>
                    `;

                    // Cambiar colores por estado
                    const celdaEstado = row.children[4];
                    if (estado === 'abierto') {
                        celdaEstado.style.backgroundColor = 'green';
                        celdaEstado.style.color = 'white';
                    } else if (estado === 'cerrado') {
                        celdaEstado.style.backgroundColor = 'red';
                        celdaEstado.style.color = 'white';
                    } else if (estado === 'en proceso') {
                        celdaEstado.style.backgroundColor = 'orange';
                        celdaEstado.style.color = 'white';
                    }

                    tablaReporte.appendChild(row);
                });

            }) // <-- AQUI va el catch, al nivel del .then principal
            .catch(err => {
                console.error("Error al obtener los datos:", err);
                setAlert("Ocurrió un error al realizar la búsqueda.", "error");
            });
                });

    document.addEventListener("click", function (e) {
    const btnVer = e.target.closest(".ver-reporte");
    if (btnVer) {
        const path = btnVer.getAttribute("data-path");
        idReporteActual = parseInt(btnVer.getAttribute("data-id"));
        const idUsuario = parseInt(localStorage.getItem("id")); 
        const token = localStorage.getItem("token");
        Swal.fire({
            title: '¿Deseas ver el reporte?',
            text: "Se abrirá una vista previa del PDF.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, ver',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                btnVer.disabled = true;

                Swal.fire({
                    title: 'Registrando vista...',
                    text: 'Espere un momento',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                fetch("http://localhost:8081/api/reportesVistos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        idUsuario: idUsuario,
                        idReporte: idReporteActual
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al registrar vista");
                    }
                    return response.text(); // <- usamos .text() porque la respuesta no es JSON
                })
                .then(msg => {
                    console.log("Respuesta del servidor:", msg);
                    // Mostrar éxito breve antes de continuar
                    return Swal.fire({
                        icon: 'success',
                        title: 'Vista registrada',
                        text: msg,
                        timer: 1500,
                        showConfirmButton: false
                    });
                })
                .then(() => {
                    // Ahora cargar el PDF
                    return fetch(path)
                        .then(res => res.arrayBuffer())
                        .then(data => pdfjsLib.getDocument({ data }).promise)
                        .then(pdf => pdf.getPage(1))
                        .then(page => {
                            const scale = 1.5;
                            const viewport = page.getViewport({ scale });
                            const canvas = document.getElementById("pdfViewer");
                            const context = canvas.getContext("2d");
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            const renderContext = {
                                canvasContext: context,
                                viewport: viewport
                            };
                            return page.render(renderContext).promise;
                        });
                })
                .then(() => {
                    const modal = new bootstrap.Modal(document.getElementById("modalReporte"));
                    modal.show();
                })
                .catch(err => {
                    console.error("Error:", err);
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo registrar la visualización o cargar el reporte.',
                        icon: 'error'
                    });
                })
                .finally(() => {
                    btnVer.disabled = false;
                });
            }
        });
    }
});

});
    document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", async function(e) {
        if (e.target.classList.contains("eliminar-reporte")) {
        const idReporte = e.target.getAttribute("data-id");
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8081/api/reportesVistos/porReporte/${idReporte}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
            });

            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            const data = await response.json();

            const container = document.getElementById("revisionesContainer");
            container.innerHTML = ""; // Limpiar contenido anterior

            if (data.length === 0) {
            container.innerHTML = `<p class="text-muted">Ningún usuario ha revisado este documento aún.</p>`;
            } else {
            data.forEach(usuario => {
                const card = `
                <div class="card mb-3">
                    <div class="row g-0">
                    <div class="col-md-2 d-flex align-items-center justify-content-center">
                        <img src="${usuario.fotoUsuario}" class="img-fluid rounded-circle m-2" alt="Foto de ${usuario.nombreUsuario}" width="80" height="80">
                    </div>
                    <div class="col-md-10">
                        <div class="card-body">
                        <h5 class="card-title">${usuario.nombreUsuario}</h5>
                        <p class="card-text"><strong>Fecha de revisión:</strong> ${usuario.fechaVisto}</p>
                        <p class="card-text"><small class="text-muted">${usuario.descripcionReporte}</small></p>
                        </div>
                    </div>
                    </div>
                </div>`;
                container.insertAdjacentHTML("beforeend", card);
            });
            }

            const modal = new bootstrap.Modal(document.getElementById('modalRevisiones'));
            modal.show();
        } catch (error) {
            console.error("Error al obtener revisiones:", error);
            alert("Ocurrió un error al cargar los usuarios. Verifica tu conexión o el token.");
        }
        }
    });
    });


