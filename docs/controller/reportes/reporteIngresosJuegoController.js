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

});


// <!-- generar reporte para ingresos de juegos -->
        
const token = localStorage.getItem('token');
let pdfBlob = null;
document.addEventListener('DOMContentLoaded', () => {
    const fechaInicioInput = document.getElementById('fechaInicioReporte');
    const fechaFinInput = document.getElementById('fechaFinReporte');
    const iframePreview = document.getElementById('pdfPreview');
    const generarBtn = document.querySelector('.btn.btn-primary');
    const cancelarBtn = document.querySelector('.btn.btn-danger');

    generarBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const fechaInicio = fechaInicioInput.value;
        const fechaFin = fechaFinInput.value;

        if (!fechaInicio || !fechaFin) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Por favor, selecciona las fechas de inicio y fin.',
            });
            return;
        }

        fetch(`https://laperlacentrocomercial.dyndns.org/api/reportes/generar/ingresos-juegos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
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

        const idUsuario = getDecryptedUserId();

        const datos = {
            idUsuario: idUsuario,
            tipo: tipo,
            descripcion: descripcion,
            estado: estado
        };

        const formData = new FormData();
        formData.append('datos', JSON.stringify(datos));
        formData.append('pdf', pdfBlob, 'reporte.pdf');

        fetch('https://laperlacentrocomercial.dyndns.org/api/reportes/guardar', {
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
        fechaInicioInput.value = '';
        fechaFinInput.value = '';
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
