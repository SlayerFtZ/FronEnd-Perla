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
const select = document.getElementById("opcionesBuscarEgreso");
const input = document.getElementById("inputBusqueda");
const tablaBody = document.querySelector("tbody");
const urlBase = "http://localhost:8081/api/pagos"; // Ajusta a tu ruta real

// Función reutilizable para buscar y renderizar la tabla
function buscarEgresos() {
    const opcion = select.value;
    const valor = input.value.trim();
    const token = localStorage.getItem("token");
    let url = "";
    let paginacion = "?numeroPagina=0&tamanoPagina=10";

    switch (opcion) {
        case "todos":
            url = `${urlBase}`;
            break;
        case "nMaquina":
            url = `${urlBase}/buscar/maquina?nombre=${encodeURIComponent(valor)}${paginacion}`;
            break;
        case "fecha":
            const [fechaInicio, fechaFin] = valor.split(",");
            url = `${urlBase}/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}${paginacion}`;
            break;
        case "descripcion":
            Swal.fire({
                icon: 'info',
                title: 'Información',
                text: 'El filtro por descripción aún no está implementado.',
                confirmButtonText: 'Aceptar'
            });
            return;
        default:
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Selecciona una opción válida.',
                confirmButtonText: 'Aceptar'
            });
            return;
    }

    fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("No se encontraron datos");
        return response.json();
    })
    .then(data => {
        const resultados = data.content || data;
        tablaBody.innerHTML = "";
        resultados.forEach(ingreso => {
            const fila = `
                <tr>
                    <td>${ingreso.idPago}</td>
                    <td><img src="${ingreso.foto || '../../images/perfilUsuario.jpg'}" width="50" class="me-2">
                    ${ingreso.nombreCompleto}</td>
                    <td>${ingreso.descripcion}</td>
                    <td>${ingreso.fechaPago}</td>
                    <td>$${ingreso.monto.toFixed(2)}</td>
                    <td>
                        <button type="button" class="btn btn-warning btn-abrir-modal" 
                            data-id="${ingreso.idPago}"
                            data-nombre="${ingreso.nombreCompleto}"
                            data-descripcion="${ingreso.descripcion}"
                            data-fecha="${ingreso.fechaPago}"
                            data-monto="${ingreso.monto}"
                            data-bs-toggle="modal"
                            data-bs-target="#modalActualizarEgreso">
                            Actualizar
                        </button>
                    </td>
                </tr>
            `;
            tablaBody.insertAdjacentHTML("beforeend", fila);
        });
    })
    .catch(error => {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontraron resultados.',
            confirmButtonText: 'Aceptar'
        });
        tablaBody.innerHTML = "<tr><td colspan='6'>No se encontraron resultados</td></tr>";
    });
}

// Buscar cuando se hace clic en el botón
document.querySelector(".app-search__button").addEventListener("click", buscarEgresos);

// Delegación de eventos para abrir el modal
tablaBody.addEventListener("click", (e) => {
    if (e.target.classList.contains('btn-abrir-modal')) {
        const btn = e.target;
        document.getElementById('usuarioEgreso').value = btn.getAttribute('data-nombre');
        document.getElementById('descripcionEgreso').value = btn.getAttribute('data-descripcion');
        document.getElementById('fechaEgreso').value = btn.getAttribute('data-fecha');
        document.getElementById('costMen').value = btn.getAttribute('data-monto');
        document.getElementById('modalActualizarEgreso').setAttribute('data-id-pago', btn.getAttribute('data-id'));
    }
});

// Actualizar egreso
document.getElementById('btnActualizarEgreso').addEventListener('click', () => {
    const modal = document.getElementById('modalActualizarEgreso');
    const idPago = modal.getAttribute('data-id-pago');
    const token = localStorage.getItem("token");

    const descripcion = document.getElementById('descripcionEgreso').value.trim();
    const fechaPago = document.getElementById('fechaEgreso').value;
    const monto = parseFloat(document.getElementById('costMen').value);

    const data = {
        descripcion,
        fechaPago,
        monto,
        idUsuario: localStorage.getItem("id") // Ajusta dinámicamente si es necesario
    };

    fetch(`${urlBase}/actualizar/${idPago}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al actualizar el pago');
        return response.json();
    })
    .then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Pago actualizado',
            text: 'El pago se actualizó correctamente.',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            buscarEgresos(); // Recarga solo la tabla
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide(); // Cierra el modal
        });
    })
    .catch(error => {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el egreso.',
            confirmButtonText: 'Aceptar'
        });
    });
});




document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();  // Limpia todo el localStorage
    sessionStorage.clear(); // Limpia todo el sessionStorage
    window.location.href = "../modulo-login/page-login.html"; // Redirige al login
});
