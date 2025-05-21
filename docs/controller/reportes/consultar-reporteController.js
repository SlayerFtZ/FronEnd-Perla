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

            // Función para recargar la tabla
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
                            <!-- El botón de descarga será deshabilitado si el estado es cerrado o en proceso -->
                            <button class="download-btn btn btn-secondary btn-sm" type="button" data-path="${reporte.path}" ${isDisabled ? 'disabled' : ''}>
                                <i class="bi bi-cloud-download-fill"></i> Descargar
                            </button>
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

                // ✅ Agrega eventos de descarga
                document.querySelectorAll('.download-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const filePath = btn.getAttribute("data-path"); // Obtener la ruta del archivo PDF
                        if (filePath) {
                            // Crear un enlace para descargar el archivo
                            const link = document.createElement('a');
                            link.href = filePath; // URL del archivo PDF
                            link.download = filePath.split('/').pop(); // Usar el nombre del archivo desde la URL

                            // Usar `setAttribute` para asegurar la descarga directa
                            link.setAttribute('download', '');  // Asegura la descarga sin abrir nueva pestaña

                            // Forzar la descarga
                            link.style.display = 'none';  // Esconde el enlace
                            document.body.appendChild(link);  // Agrega el enlace al DOM

                            link.click();  // Dispara la descarga del archivo

                            document.body.removeChild(link);  // Limpia el DOM después de la descarga
                        } else {
                            alert('No se encontró el archivo para descargar.');
                        }
                    });
                });

            }) // <-- AQUI va el catch, al nivel del .then principal
            .catch(err => {
                console.error("Error al obtener los datos:", err);
                setAlert("Ocurrió un error al realizar la búsqueda.", "error");
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

        const contenedorPDF = document.getElementById("pdfContainer");
        if (!contenedorPDF) {
            console.error("No se encontró el contenedor con id 'pdfContainer'");
            return;
        }
        contenedorPDF.innerHTML = ""; // Limpiar contenido anterior

        fetch(path)
            .then(res => res.arrayBuffer())
            .then(data => pdfjsLib.getDocument({ data }).promise)
            .then(pdf => {
                const scale = 1.5;

                for (let i = 1; i <= pdf.numPages; i++) {
                    pdf.getPage(i).then(page => {
                        const viewport = page.getViewport({ scale });
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");

                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        canvas.style.marginBottom = "20px";

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };

                        page.render(renderContext);
                        contenedorPDF.appendChild(canvas);
                    });
                }
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

            // Verificar si el botón de descarga debe estar deshabilitado
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
        
                    <button class="btn btn-secondary btn-sm download-btn" type="button" data-id="${reporte.idReporte}" data-path="${reporte.path}" ${isDisabled ? 'disabled' : ''}>
                        <i class="bi bi-cloud-download-fill"></i> Descargar
                    </button>
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

        // ✅ Agrega eventos de descarga
            document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', () => {
            const filePath = btn.getAttribute('data-path');
            const idReporte = btn.getAttribute('data-id');
            const idUsuario = localStorage.getItem('id');

            if (filePath && filePath.startsWith('http')) {
                const fileName = filePath.split('/').pop();

                const link = document.createElement('a');
                link.href = filePath;
                link.download = fileName; // nombre personalizado
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo no encontrado',
                    text: 'No se encontró una ruta válida para descargar el archivo.',
                });
            }
        });
    });

    })
    .catch(err => {
        console.error("Error al obtener los datos:", err);
        setAlert("Ocurrió un error al realizar la búsqueda.", "error");
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

            // Verificar si el botón de descarga debe estar deshabilitado
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
                    <!-- Aquí agregamos la lógica para deshabilitar el botón de descarga según el estado -->
                    <button class="btn btn-secondary btn-sm download-btn" type="button" data-path="${reporte.path}" ${isDisabled ? 'disabled' : ''}>
                        <i class="bi bi-cloud-download-fill"></i> Descargar
                    </button>
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

        // ✅ Agrega eventos de descarga
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filePath = btn.getAttribute('data-path');  // Obtenemos la ruta del PDF desde el atributo `data-path`
                if (filePath) {
                    const link = document.createElement('a');
                    link.href = filePath;  // Establecemos la URL del PDF
                    link.download = '';  // Si no se especifica nombre, tomará el nombre por defecto de la URL (puedes personalizarlo si lo deseas)
                    document.body.appendChild(link);  // Necesario para Firefox
                    link.click();  // Inicia la descarga
                    document.body.removeChild(link);  // Limpia el DOM después de la descarga
                } else {
                    alert('No se encontró el archivo para descargar.');
                }
            });
        });

    })
    .catch(err => {
        console.error("Error al obtener los datos:", err);
        setAlert("Ocurrió un error al realizar la búsqueda.", "error");
    });
}

    
});



