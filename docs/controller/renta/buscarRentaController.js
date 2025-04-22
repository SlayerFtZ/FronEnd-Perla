document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const rol = localStorage.getItem("rol");
    const estado = localStorage.getItem("estado");

    if (!token || !id || !rol || !estado || estado.toLowerCase() === "inactivo") {
        console.log("No se encontraron credenciales válidas. Redirigiendo al login.");
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../../view/modulo-login/page-login.html";
        return;
    }

    const botonBuscar = document.querySelector('.app-search__button');
    if (botonBuscar) {
        botonBuscar.addEventListener('click', buscarRentas);
    }

    function buscarRentas() {
        const valorBusqueda = document.getElementById('inputBusqueda')?.value.trim();
        const opcion = document.getElementById('opcionesBuscarUsuario')?.value;

        if (!valorBusqueda || opcion === 'seleccion') {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Selecciona una opción de búsqueda y escribe un valor.',
            });
            return;
        }

        let url = '';
        switch (opcion) {
            case 'localNombreUsuario':
                url = `http://localhost:8081/api/rentas/buscar/usuario?nombreUsuario=${valorBusqueda}`;
                break;
            case 'localNombreLocal':
                url = `http://localhost:8081/api/rentas/buscar/local?nombreLocal=${valorBusqueda}`;
                break;
            case 'estadoPagoLocal':
                url = `http://localhost:8081/api/rentas/buscar/estadoPago?estadoPago=${valorBusqueda}`;
                break;
            case 'fechaInicio':
                url = `http://localhost:8081/api/rentas/buscar/fecha?fechaInicio=${valorBusqueda}`;
                break;
            default:
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: 'Opción de búsqueda no válida.',
                });
                return;
        }

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error("Respuesta no OK");
            return response.json();
        })
        .then(data => {
            const rentas = Array.isArray(data) ? data : [data];
            if (!rentas.length) throw new Error("Sin resultados");
            renderizarTablaRentas(rentas);
        })
        .catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Sin resultados',
                text: 'No se encontraron registros con esos datos.',
            });
            document.querySelector('.table-responsive tbody').innerHTML = `
                <tr><td colspan="9" class="text-center">No se encontraron resultados.</td></tr>
            `;
        });
    }

    function renderizarTablaRentas(rentas) {
        const tbody = document.querySelector('.table-responsive tbody');
        tbody.innerHTML = '';

        rentas.forEach(renta => {
            const botonEstadoPago = renta.estadoPago === 'Pagado'
                ? `<button class="btn btn-warning" disabled>Abonar renta</button>`
                : `<button class="btn btn-warning btn-abonar" 
                        data-bs-toggle="modal" 
                        data-bs-target="#simularPagoModal"
                        data-monto="${renta.montoPagado}" 
                        data-adeudo="${renta.adeudo}" 
                        data-id-renta="${renta.idRenta}">
                        Abonar renta
                    </button>`;

            let claseFondoEstado = '';
            switch (renta.estadoPago) {
                case 'Pagado': claseFondoEstado = 'bg-success text-white'; break;
                case 'Abono': claseFondoEstado = 'bg-warning text-dark'; break;
                case 'Pendiente': claseFondoEstado = 'bg-danger text-white'; break;
            }

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>LC-${renta.idLocal}</td>
                <td><img src="../../images/perfilUsuario.jpg" width="25" class="me-2"> Usuario #${renta.idUsuario}</td>
                <td>${new Date(renta.fechaInicio).toLocaleDateString('es-MX')}</td>
                <td>${new Date(renta.fechaFin).toLocaleDateString('es-MX')}</td>
                <td>${renta.estadoLocal}</td>
                <td>$${renta.adeudo.toFixed(2)}</td>
                <td>$${renta.montoPagado.toFixed(2)}</td>
                <td class="${claseFondoEstado} fw-bold">${renta.estadoPago}</td>
                <td>${botonEstadoPago}</td>
            `;
            tbody.appendChild(fila);
        });

        document.querySelectorAll('.btn-abonar').forEach(btn => {
            btn.addEventListener('click', () => {
                const monto = btn.getAttribute('data-monto');
                const adeudo = btn.getAttribute('data-adeudo');
                const idRenta = btn.getAttribute('data-id-renta');

                const inputMonto = document.getElementById('montoAbonado');
                const inputAdeudo = document.getElementById('Adeudo');
                const inputHiddenAdeudo = document.getElementById('hiddenAdeudo');
                const inputHiddenIdRenta = document.getElementById('hiddenIdRenta');

                if (inputMonto) inputMonto.value = `$${parseFloat(monto).toFixed(2)}`;
                if (inputAdeudo) inputAdeudo.value = `$${parseFloat(adeudo).toFixed(2)}`;
                if (inputHiddenAdeudo) inputHiddenAdeudo.value = adeudo;
                if (inputHiddenIdRenta) inputHiddenIdRenta.value = idRenta;
            });
        });
    }

    const formPago = document.getElementById('formPago');
if (formPago) {
    formPago.addEventListener('submit', function (e) {
        e.preventDefault();

        const montoInput = document.getElementById('montoAbonado');
        const hiddenAdeudo = document.getElementById('hiddenAdeudo');
        const hiddenIdRenta = document.getElementById('hiddenIdRenta');

        const montoRenta = parseFloat(document.getElementById('montoRenta').value);
        const adeudo = hiddenAdeudo ? parseFloat(hiddenAdeudo.value) : NaN;
        const idRenta = hiddenIdRenta?.value;

        if (isNaN(adeudo) || montoRenta <= 0) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Por favor ingrese un monto válido para abonar.',
                confirmButtonText: 'Aceptar'
            });
        } else if (montoRenta > adeudo) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'El monto a abonar no puede ser mayor que el adeudo.',
                confirmButtonText: 'Aceptar'
            });
        } else {
            fetch(`http://localhost:8081/api/rentas/${idRenta}/abono?monto=${montoRenta}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ monto: montoRenta })
            })
            .then(response => response.json())
.then(data => {
    console.log('Respuesta de la API:', data);  // Revisa lo que recibes
    // Verifica si el estado de pago es 'ABONO' para determinar si el abono fue exitoso
    if (data.estadoPago === 'ABONO') {
        Swal.fire({
            title: '¡Éxito!',
            text: 'Se ha abonado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            montoInput.value = '';
            $('#simularPagoModal').modal('hide');
            buscarRentas(); // ✅ Recarga la tabla con los nuevos datos
        });
    } else if (data.estadoPago === 'PAGADO') {
        Swal.fire({
            title: '¡Pago exitoso!',
            text: 'La Renta ya ha sido liquidada.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            $('#simularPagoModal').modal('hide');
            buscarRentas(); // ✅ También recarga si el pago finaliza la renta
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: data.message || 'Hubo un problema al procesar el abono.',
            confirmButtonText: 'Aceptar'
        });
    }
})
.catch(error => {
    console.error("Error en el abono: ", error);
    Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Hubo un error al procesar la solicitud.',
        confirmButtonText: 'Aceptar'
    });
});
                }
            });
        }

});
