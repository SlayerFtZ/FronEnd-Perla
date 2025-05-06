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
        contenedorBusqueda.innerHTML = "";

        if (opcion === "periodo") {
            fechaInicioInput = document.createElement("input");
            fechaInicioInput.type = "date";
            fechaInicioInput.className = "form-control mb-2";
            fechaInicioInput.id = "fechaInicio";

            fechaFinInput = document.createElement("input");
            fechaFinInput.type = "date";
            fechaFinInput.className = "form-control mb-2";
            fechaFinInput.id = "fechaFin";

            contenedorBusqueda.appendChild(fechaInicioInput);
            contenedorBusqueda.appendChild(fechaFinInput);
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
                    row.innerHTML = ` 
                        <td>${index + 1}</td>
                        <td><img src="${reporte.fotoPerfil || '../../images/perfilUsuario.jpg'}" width="50" class="rounded-circle me-2">${reporte.nombreUsuario}</td>
                        <td>${reporte.tipo}</td>
                        <td>${reporte.descripcion}</td>
                        <td>${reporte.estado}</td>
                        <td>${reporte.fechaCreacion}</td>
                        <td>
                            <button class="btn btn-primary btn-sm ver-reporte" data-id="${reporte.idReporte}" data-path="${reporte.path}">Ver</button>
                        </td>
                        <td>
                            <button 
                                class="btn btn-warning btn-sm btn-actualizar"  
                                data-bs-toggle="modal" 
                                data-bs-target="#actualizarModalDatos"
                                data-id="${reporte.idReporte}"
                                data-idUsuario="${reporte.idUsuario}"
                                data-tipo="${reporte.tipo}"
                                data-descripcion="${reporte.descripcion}"
                                data-nombre="${reporte.nombreUsuario}">
                                Actualizar
                            </button>
                            <button id="download-btn" class="download-btn" type="button" class="btn btn-secondary btn-sm"><i class="bi bi-cloud-download-fill"></i> Descargar</button>
                        </td>
                    `;
                
                    // Obtener la celda del estado (quinta celda, ya que la primera es el número)
                    const celdaEstado = row.children[4];  // 0: número, 1: foto, 2: tipo, 3: descripción, 4: estado
                    const estado = reporte.estado.toLowerCase();
                
                    // Cambiar el color de fondo y texto según el estado
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
                
                    // Agregar la fila a la tabla
                    tablaReporte.appendChild(row);
                })
                .catch(err => {
                    console.error("Error al obtener los datos:", err);
                    setAlert("Ocurrió un error al realizar la búsqueda.", "error");
                });
            });
    });

    document.addEventListener("click", function (e) {
        // Evento para botón de ver
        const btnVer = e.target.closest(".ver-reporte");
        if (btnVer) {
            const path = btnVer.getAttribute("data-path");
            idReporteActual = btnVer.getAttribute("data-id");
            console.log("ID seleccionado desde botón 'Ver':", idReporteActual);

            const modal = new bootstrap.Modal(document.getElementById("modalReporte"));
            modal.show();

            fetch(path)
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
                    page.render(renderContext);
                })
                .catch(err => {
                    console.error("Error al cargar el PDF:", err);
                    setAlert("No se pudo cargar el reporte.", "error");
                });
        }

        // Evento para botón actualizar estado
        const btnActualizar = e.target.closest("#btnActualizarEstado");
        if (btnActualizar) {
            console.log("Botón de actualización presionado");

            const nuevoEstado = document.getElementById("estadoReporte").value;
            console.log("Nuevo estado seleccionado:", nuevoEstado);

            if (nuevoEstado === "seleccion") {
                setAlert("Selecciona un estado válido.", "warning");
                return;
            }

            if (!idReporteActual) {
                setAlert("No se ha seleccionado un reporte válido.", "error");
                return;
            }

            const url = `http://localhost:8081/api/reportes/estado/${idReporteActual}?estadoReporte=${encodeURIComponent(nuevoEstado.toUpperCase())}`;

            fetch(url, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (!response.ok) throw new Error("Error al actualizar el estado.");
                    return response.text();
                })
                .then(text => {
                    console.log(text);
                    setAlert(text, "success");
                    recargarTabla();
                })
                .catch(error => {
                    console.error("Error actualizando estado:", error);
                    setAlert("No se pudo actualizar el estado del reporte.", "error");
                });
        }
    });

    // Función para recargar la tabla
    function recargarTabla() {
        fetch('http://localhost:8081/api/reportes', {
            method: "GET",
            headers: headers,
        })
            .then(response => response.json())
            .then(data => {
                tablaReporte.innerHTML = "";

                if (!data || data.length === 0) {
                    setAlert("No se encontraron resultados.", "warning");
                    return;
                }

                data.forEach((reporte, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = ` 
                        <td>${index + 1}</td>
                        <td><img src="${reporte.fotoPerfil || '../../images/perfilUsuario.jpg'}" width="50" class="rounded-circle me-2">${reporte.nombreUsuario}</td>
                        <td>${reporte.tipo}</td>
                        <td>${reporte.descripcion}</td>
                        <td>${reporte.estado}</td>
                        <td>${reporte.fechaCreacion}</td>
                        <td>
                            <button class="btn btn-primary btn-sm ver-reporte" data-id="${reporte.idReporte}" data-path="${reporte.path}">Ver</button>
                        </td>
                        <td>
                            <button 
                                class="btn btn-warning btn-sm btn-actualizar"  
                                data-bs-toggle="modal" 
                                data-bs-target="#actualizarModalDatos"
                                data-id="${reporte.idReporte}"
                                data-idUsuario="${reporte.idUsuario}"
                                data-tipo="${reporte.tipo}"
                                data-descripcion="${reporte.descripcion}"
                                data-nombre="${reporte.nombreUsuario}">
                                Actualizar
                            </button>
                            <button id="download-btn" class="download-btn" type="button" class="btn btn-secondary btn-sm"><i class="bi bi-cloud-download-fill"></i> Descargar</button>
                        </td>
                    `;
                
                    // Obtener la celda del estado (quinta celda, ya que la primera es el número)
                    const celdaEstado = row.children[4];  // 0: número, 1: foto, 2: tipo, 3: descripción, 4: estado
                    const estado = reporte.estado.toLowerCase();
                
                    // Cambiar el color de fondo y texto según el estado
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
                
                    // Agregar la fila a la tabla
                    tablaReporte.appendChild(row);
                })
                .catch(err => {
                    console.error("Error al obtener los datos:", err);
                    setAlert("Ocurrió un error al realizar la búsqueda.", "error");
                });
            });
    }
    
});

document.addEventListener("DOMContentLoaded", () => {
    // Definir los headers de forma global
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    // Referencias a elementos
    const btnActualizarDatos = document.getElementById('actualizarDatos');
    const modalActualizar = new bootstrap.Modal(document.getElementById('actualizarModalDatos'));

    // Evento que se activa cuando el modal es mostrado
    const actualizarModal = document.getElementById('actualizarModalDatos');
    actualizarModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;  // Botón que activó el modal
        const idReporte = button.getAttribute('data-id');
        const idUsuario = button.getAttribute('data-idUsuario');
        const nombreUsuario = button.getAttribute('data-nombre');
        const descripcion = button.getAttribute('data-descripcion');
        const tipo = button.getAttribute('data-tipo');  // Asumiendo que el tipo se pasa desde el botón

        // Asignar los valores al modal
        document.getElementById('idReporte').value = idReporte;
        document.getElementById('idUsuario').value = idUsuario;
        document.getElementById('nombreUsuario').value = nombreUsuario;
        document.getElementById('descripcion').value = descripcion;

        // Si el tipo tiene un valor, se asigna al select
        const opcionesBuscar = document.getElementById('opcionesBuscar');
        if (tipo) {
            opcionesBuscar.value = tipo;  // Asignar el valor del tipo al select
        } else {
            opcionesBuscar.value = ''; // Reiniciar el select si no hay tipo
        }
    });

    // Evento para guardar los cambios
    btnActualizarDatos.addEventListener('click', () => {
        const idReporte = document.getElementById('idReporte').value;
        const idUsuario = localStorage.getItem('id');
        const tipo = document.getElementById('opcionesBuscar').value.trim().toUpperCase();  // Obtener el valor del select en mayúsculas
        const descripcion = document.getElementById('descripcion').value.trim();

        // Imprimir valores a la consola para depuración
        console.log('Tipo seleccionado:', tipo);
        console.log('Datos a enviar:', { idReporte, idUsuario, tipo, descripcion });

        // Validación de campos
        if (!idReporte || !idUsuario || !tipo || !descripcion) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Todos los campos son obligatorios.',
            });
        }

        // Preparar solicitud
        console.log('Payload enviado a la API:', { tipo, descripcion, idUsuario });

        fetch(`http://localhost:8081/api/reportes/actualizarDatos/${idReporte}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({ tipo, descripcion, idUsuario }),
        })
        .then(res => res.text())  // Esperar la respuesta en texto plano
        .then(data => {
            console.log('Respuesta del servidor:', data);  // Verifica lo que realmente está llegando
            if (data.trim() === 'Datos del reporte actualizados correctamente.') {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: data,
                });
                modalActualizar.hide();
                recargarTabla();  // Refresca la tabla
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al actualizar el reporte.',
                });
            }
        })
        .catch(err => {
            console.error('Error al actualizar:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al procesar la solicitud.',
            });
        });
    });

    // Función para recargar la tabla
    function recargarTabla() {
        fetch('http://localhost:8081/api/reportes', {
            method: "GET",
            headers: headers,  // Usar los headers definidos globalmente
        })
        .then(response => response.json())
        .then(data => {
            const tablaReporte = document.getElementById('tablaReporte');
            tablaReporte.innerHTML = "";

            if (!data || data.length === 0) {
                setAlert("No se encontraron resultados.", "warning");
                return;
            }

            data.forEach((reporte, index) => {
                const row = document.createElement("tr");
                row.innerHTML = ` 
                    <td>${index + 1}</td>
                    <td><img src="${reporte.fotoPerfil || '../../images/perfilUsuario.jpg'}" width="50" class="rounded-circle me-2">${reporte.nombreUsuario}</td>
                    <td>${reporte.tipo}</td>
                    <td>${reporte.descripcion}</td>
                    <td>${reporte.estado}</td>
                    <td>${reporte.fechaCreacion}</td>
                    <td>
                        <button class="btn btn-primary btn-sm ver-reporte" data-id="${reporte.idReporte}" data-path="${reporte.path}">Ver</button>
                    </td>
                    <td>
                        <button 
                            class="btn btn-warning btn-sm btn-actualizar"  
                            data-bs-toggle="modal" 
                            data-bs-target="#actualizarModalDatos"
                            data-id="${reporte.idReporte}"
                            data-idUsuario="${reporte.idUsuario}"
                            data-tipo="${reporte.tipo}"
                            data-descripcion="${reporte.descripcion}"
                            data-nombre="${reporte.nombreUsuario}">
                            Actualizar
                        </button>
                        <button id="download-btn" class="download-btn" type="button" class="btn btn-secondary btn-sm"><i class="bi bi-cloud-download-fill"></i> Descargar</button>
                    </td>
                `;
            
                // Obtener la celda del estado (quinta celda, ya que la primera es el número)
                const celdaEstado = row.children[4];  // 0: número, 1: foto, 2: tipo, 3: descripción, 4: estado
                const estado = reporte.estado.toLowerCase();
            
                // Cambiar el color de fondo y texto según el estado
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
            
                // Agregar la fila a la tabla
                tablaReporte.appendChild(row);
            })
            .catch(err => {
                console.error("Error al obtener los datos:", err);
                setAlert("Ocurrió un error al realizar la búsqueda.", "error");
            });
        });
    }
});




document.getElementById('download-btn').addEventListener('click', function() {
    // Simula la descarga (puedes reemplazar esto con un enlace de descarga real)
    this.innerText = 'Descargando...';
    this.disabled = true;

    // Mostrar un mensaje de confirmación después de un tiempo
    setTimeout(function() {
        alert('¡Descarga completada!');
        // Restaurar el botón a su estado original
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.innerText = 'Descargar';
        downloadBtn.disabled = false;
    }, 2000); // 2 segundos de simulación de descarga
});
