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


document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('opcionesBuscarIngreso');
    const inputBuscar = document.querySelector('.app-search__input');
    const btnBuscar = document.querySelector('.app-search__button');
    const tbody = document.querySelector('tbody');
    const token = localStorage.getItem('token');
    const urlBase = 'http://localhost:8081/api/ingresos-juegos';

    // Función para renderizar la tabla
    function renderIngresos(data) {
        tbody.innerHTML = '';

        data.content.forEach((ingreso) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ingreso.idIngreso}</td>
                <td>${ingreso.idUsuario}</td>
                <td>${ingreso.idMaquina || 'N/A'}</td>
                <td>${ingreso.fecha}</td>
                <td>$${ingreso.totalIngresos.toLocaleString()}</td> 
                <td>
                    <button class="btn btn-warning btn-sm btn-abrir-modal"
                        data-id="${ingreso.idIngreso}"
                        data-juego="${ingreso.idMaquina || ''}" 
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

    // Cargar ingresos según opción seleccionada
    btnBuscar.addEventListener('click', async (e) => {
        e.preventDefault();
        const opcion = select.value;
        const valor = inputBuscar.value.trim();
        let url = '';

        switch (opcion) {
            case 'todos':
                url = `${urlBase}?numeroPagina=0&tamanoPagina=10`;
                break;

            case 'nMaquina':
                alert('Funcionalidad de búsqueda por máquina aún no implementada.');
                return;

            case 'fecha':
                const fechas = valor.split(' a ');
                if (fechas.length !== 2) {
                    alert('Usa el formato: yyyy-MM-dd a yyyy-MM-dd');
                    return;
                }
                const fechaInicio = fechas[0];
                const fechaFin = fechas[1];
                url = `${urlBase}/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&numeroPagina=0&tamanoPagina=10`;
                break;

            default:
                alert('Selecciona una opción válida');
                return;
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error en la petición');
            const data = await response.json();
            renderIngresos(data);

        } catch (error) {
            console.error(error);
            alert('Hubo un problema al cargar los datos.');
        }
    });

    // Escuchar clics en los botones "Actualizar" del tbody
    tbody.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('btn-abrir-modal')) {
            const boton = e.target;

            const idIngreso = boton.getAttribute('data-id');
            const monto = boton.getAttribute('data-monto');
            const fecha = boton.getAttribute('data-fecha');
            const idMaquina = boton.getAttribute('data-juego');

            document.getElementById('idIngresoActualizar').value = idIngreso;
            document.getElementById('montoActualizar').value = monto;
            document.getElementById('fechaActualizar').value = fecha;
            document.getElementById('juegoSeleccionado').value = idMaquina || '';
        }
    });
});



document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();  // Limpia todo el localStorage
    sessionStorage.clear(); // Limpia todo el sessionStorage
    window.location.href = "../modulo-login/page-login.html"; // Redirige al login
});
