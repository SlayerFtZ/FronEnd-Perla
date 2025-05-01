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


    // Cargar usuarios al iniciar
    loadUsuarios();

    const searchBtn = document.querySelector(".app-search__button");
    const searchInput = document.querySelector(".app-search__input");
    const resultTable = document.querySelector("tbody");
    const filtroBusqueda = document.getElementById("opcionesBuscarPagoExtra");

    // Permitir búsqueda con la tecla Enter
    searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            searchBtn.click();
        }
    });

    const opcionesBuscarPagoExtra = document.getElementById("opcionesBuscarPagoExtra");
const fechaDePagoFields = document.getElementById("fechaDePagoFields");

opcionesBuscarPagoExtra.addEventListener("change", function () {
    const filtro = opcionesBuscarPagoExtra.value;

    // Mostrar u ocultar los campos de fecha
    if (filtro === "fechaDePago") {
        fechaDePagoFields.style.display = "block";
    } else {
        fechaDePagoFields.style.display = "none";
    }
});

// BÚSQUEDA DE PAGOS EXTRAS
searchBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const textoBusqueda = searchInput.value.trim();
    const filtro = filtroBusqueda.value;
    let url = "";

    if (filtro === "seleccion") {
        Swal.fire({
            icon: 'info',
            title: 'Filtro no seleccionado',
            text: 'Selecciona un tipo de búsqueda antes de continuar.',
        });
        return;
    }

    if (filtro === "todos") {
        url = `http://localhost:8081/api/pagos-extras`;
    } else if (filtro === "fechaDePago") {
        const fechaInicio = document.getElementById("fechaInicio").value;
        const fechaFin = document.getElementById("fechaFin").value;

        if (!fechaInicio || !fechaFin) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos vacíos',
                text: 'Por favor, ingresa ambas fechas (inicio y fin).',
            });
            return;
        }

        url = `http://localhost:8081/api/pagos-extras?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`;
    } else if (filtro === "nombreUsuario") {
        if (!textoBusqueda) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo vacío',
                text: 'Escribe un nombre de usuario para buscar.',
            });
            return;
        }
        url = `http://localhost:8081/api/pagos-extras?nombre=${encodeURIComponent(textoBusqueda)}`;
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Filtro no válido',
            text: 'El filtro seleccionado no es válido.',
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
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    })
    .then(data => {
        resultTable.innerHTML = "";
    
        if (!data || data.length === 0) {
            resultTable.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron resultados</td></tr>`;
            Swal.fire({
                icon: 'info',
                title: 'Sin resultados',
                text: 'No se encontraron pagos extras con los criterios de búsqueda.',
            });
            return;
        }
    
        data.forEach(pago => {
            resultTable.innerHTML += `
            <tr>
                <td>${pago.idPagoExtra}</td>
                <td>${pago.nombreCompleto || `ID ${pago.idUsuario}`}</td>
                <td>${pago.fecha}</td>
                <td>$${parseFloat(pago.montoAportado).toFixed(2)}</td>
                <td>${pago.descripcion}</td>
                <td>
                <button 
                    type="button" 
                            class="btn btn-warning mb-3 btn-editar" 
                            data-bs-toggle="modal" 
                            data-bs-target="#modalPagoExtra"
                            data-id="${pago.idPagoExtra}"
                            data-idusuario="${pago.idUsuario}"
                            data-fecha="${pago.fecha}"
                            data-monto="${pago.montoAportado}"
                            data-descripcion="${pago.descripcion}">
                            Actualizar
                        </button>
                    </td>
                </tr>`;
        });
    
        // ✅ Este Swal debe estar aquí DENTRO
        Swal.fire({
            icon: 'success',
            title: 'Búsqueda exitosa',
            text: 'Los resultados se han cargado correctamente.',
        });
    
    })
    .catch(error => {
        console.error("Error al buscar pagos extras:", error);
        resultTable.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Ocurrió un error al buscar</td></tr>`;
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Ocurrió un error al buscar: ${error.message}`,
        });
    });
});    

    // FUNCIÓN PARA CARGAR USUARIOS
    async function loadUsuarios() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:8081/api/usuarios', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error en la solicitud');

            const data = await response.json();
            const select = document.getElementById('opcionesUsuario');
            data.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.idUsuario;
                option.textContent = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;
                select.appendChild(option);
            });

            select.addEventListener('change', () => {
                sessionStorage.setItem('selectedUserIdPagoExtra', select.value);
            });

        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    }
    
    document.getElementById("formPagoExtra").addEventListener("submit", async function (e) {
        e.preventDefault();
    
        const idPagoExtra = sessionStorage.getItem("idPagoExtraActualizar");
        const idUsuario = document.getElementById("opcionesUsuario").value;
        const fecha = document.getElementById("fechaExtra").value;
        const monto = document.getElementById("montoExtra").value;
        const descripcion = document.getElementById("notaextra").value;
    
        const token = localStorage.getItem("token");
    
        try {
            const response = await fetch(`http://localhost:8081/api/pagos-extras/actualizar/${idPagoExtra}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idUsuario,
                    fecha,
                    montoAportado: monto,
                    descripcion
                })
            });
    
            if (!response.ok) throw new Error("Error al actualizar");
    
            Swal.fire({
                icon: 'success',
                title: 'Pago actualizado',
                text: 'La información del pago extra ha sido actualizada.',
            }).then(() => {
                // Cerrar modal y recargar tabla
                const modal = bootstrap.Modal.getInstance(document.getElementById("modalPagoExtra"));
                modal.hide();
                searchBtn.click(); // vuelve a ejecutar la búsqueda actual
            });
    
        } catch (error) {
            console.error("Error actualizando:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el pago extra.',
            });
        }
    });
    document.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("btn-editar")) {
            const btn = e.target;
    
            const idPago = btn.getAttribute("data-id");
            const idUsuario = btn.getAttribute("data-idusuario");
            const fecha = btn.getAttribute("data-fecha");
            const monto = btn.getAttribute("data-monto");
            const descripcion = btn.getAttribute("data-descripcion");
    
            // Rellenar los campos del modal
            document.getElementById("opcionesUsuario").value = idUsuario;
            document.getElementById("fechaExtra").value = fecha;
            document.getElementById("montoExtra").value = monto;
            document.getElementById("notaextra").value = descripcion;
    
            // Si quieres mantener el ID para actualizarlo después:
            sessionStorage.setItem("idPagoExtraActualizar", idPago);
        }
    });
        
        // BOTÓN DE CIERRE DE SESIÓN
        document.getElementById("logoutBtn").addEventListener("click", function () {
            localStorage.clear();
            sessionStorage.clear();
            Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Has cerrado sesión correctamente.',
            }).then(() => {
                window.location.href = "../modulo-login/page-login.html";
            });
        });
    }); 
    