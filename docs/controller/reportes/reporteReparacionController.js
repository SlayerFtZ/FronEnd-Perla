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



// <!-- mostrar las reparaciones en el select y recargar datos en los otros campos -->
const token = localStorage.getItem('token');
let pdfBlob = null;
document.addEventListener('DOMContentLoaded', () => {
    const selectElement = document.getElementById('reciboSeleccionReparacion');
    const selectElementContratista = document.getElementById('contratistaReporte');
    const selectElementMonto = document.getElementById('montoReporte');
    const selectElementDescripcion = document.getElementById('descripcionReporte');
    const iframePreview = document.getElementById('pdfPreview');
    const generarBtn = document.querySelector('.btn.btn-primary');
    const cancelarBtn = document.querySelector('.btn.btn-danger');

    fetch('http://localhost:8081/api/reparaciones', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(reparacion => {
                const option = document.createElement('option');
                option.value = reparacion.idReparacion;
                option.textContent = `${reparacion.contratista} - ${reparacion.fecha}`;
                option.dataset.contratista = reparacion.contratista;
                option.dataset.monto = reparacion.costo;
                option.dataset.descripcion = reparacion.descripcion;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al obtener las reparaciones.',
            });
            console.error('Error al obtener las reparaciones:', error);
        });

    selectElement.addEventListener('change', (event) => {
        const selectedOption = event.target.selectedOptions[0];
        if (selectedOption && selectedOption.value !== 'seleccion') {
            selectElementContratista.value = selectedOption.dataset.contratista || '';
            selectElementMonto.value = selectedOption.dataset.monto || '';
            selectElementDescripcion.value = selectedOption.dataset.descripcion || '';
        } else {
            selectElementContratista.value = '';
            selectElementMonto.value = '';
            selectElementDescripcion.value = '';
            iframePreview.src = '';
        }
    });

    generarBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const contratista = selectElementContratista.value;
        const monto = parseFloat(selectElementMonto.value);
        const descripcion = selectElementDescripcion.value;

        if (!contratista || isNaN(monto) || !descripcion) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Por favor, selecciona una reparación válida antes de generar el PDF.',
            });
            return;
        }

        fetch('http://localhost:8081/api/reportes/generar/recibo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                monto: monto,
                concepto: descripcion,
                contratista: contratista
            })
        })
            .then(response => {
                if (!response.ok) throw new Error('Error generando el PDF');
                return response.blob();
            })
            .then(blob => {
                pdfBlob = blob; // Guardar el blob para su uso posterior
                const pdfURL = URL.createObjectURL(blob);
                iframePreview.src = pdfURL;
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'El PDF se generó correctamente.',
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error generando el reporte PDF.',
                });
                console.error('Error generando el reporte PDF:', error);
            });
    });

    const guardarBtn = document.getElementById('guardarReporteBtn');

    guardarBtn.addEventListener('click', () => {
        const tipo = document.getElementById('tipoReporte').value;
        const estado = document.getElementById('estadoReporte').value;
        const descripcion = document.getElementById('descripcionGuardarPFDReporte').value;

        if (tipo === 'seleccion' || estado === 'seleccion' || !descripcion.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos para guardar el reporte.',
            });
            return;
        }

        if (!pdfBlob) {
            Swal.fire({
                icon: 'warning',
                title: 'PDF no generado',
                text: 'Por favor, genera primero el PDF antes de guardarlo.',
            });
            return;
        }

        const idUsuario = localStorage.getItem('id');

        const datos = {
            idUsuario: idUsuario,
            tipo: tipo,
            descripcion: descripcion,
            estado: estado
        };

        const formData = new FormData();
        formData.append('datos', JSON.stringify(datos));
        formData.append('pdf', pdfBlob, 'reporte.pdf');

        fetch('http://localhost:8081/api/reportes/guardar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // No se pone Content-Type manualmente con FormData
            },
            body: formData
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al guardar el reporte');
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Reporte guardado',
                    text: 'El reporte y el PDF se han guardado correctamente.',
                });

                // Limpiar campos si lo deseas
                document.getElementById('tipoReporte').value = 'seleccion';
                document.getElementById('estadoReporte').value = 'seleccion';
                document.getElementById('descripcionGuardarPFDReporte').value = '';
                pdfBlob = null;
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al guardar el reporte.',
                });
                console.error('Error al guardar el reporte:', error);
            });
    });


    cancelarBtn.addEventListener('click', () => {
        selectElement.value = 'seleccion';
        selectElementContratista.value = '';
        selectElementMonto.value = '';
        selectElementDescripcion.value = '';
        iframePreview.src = '';
        Swal.fire({
            icon: 'info',
            title: 'Cancelado',
            text: 'Los campos han sido limpiados.',
        });
    });
});


document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();  // Limpia todo el localStorage
    sessionStorage.clear(); // Limpia todo el sessionStorage
    window.location.href = "../modulo-login/page-login.html"; // Redirige al login
});
