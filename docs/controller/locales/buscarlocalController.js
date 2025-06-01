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


document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token no válido en localStorage.");
        return;
    }

    // Usar addEventListener en lugar de onclick
    document.querySelector('.app-search__button').addEventListener('click', buscarLocal);

    function buscarLocal() {
        const valorBusqueda = document.getElementById('searchLocal').value.trim(); // Cambié 'search' por 'searchLocal'
        const opcion = document.getElementById('opcionesBuscarLocal').value;

        if (valorBusqueda === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Por favor ingresa un valor para buscar.',
            });
            return;
        }

        let url = '';
        switch (opcion) {
            case 'estado':
                url = `https://laperlacentrocomercial.dyndns.org/api/locales/estado/${valorBusqueda}`;
                break;
            case 'idUsuario':
                url = `https://laperlacentrocomercial.dyndns.org/api/locales/usuario/${valorBusqueda}`;
                break;
            case 'nombre':
                    url = `https://laperlacentrocomercial.dyndns.org/api/locales/nombre?nombre=${valorBusqueda}`;
                    break;
            default:
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: 'Selecciona una opción de búsqueda válida.',
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
                if (!response.ok) throw new Error();
                return response.json();
            })
            .then(data => {
                Swal.close();
                const locales = Array.isArray(data) ? data : [data];
                if (locales.length === 0) throw new Error();

                Swal.fire({
                    icon: 'success',
                    title: 'Local encontrado',
                    text: 'Se encontraron locales con los datos proporcionados.',
                });

                renderizarTablaLocales(locales);
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontraron locales con esos datos.',
                });
                document.getElementById('tablaLocal').innerHTML = `
                    <tr><td colspan="3" class="text-center">No se encontraron locales.</td></tr>
                `;
            });
    }

    function renderizarTablaLocales(locales) {
        const tbody = document.getElementById('tablaLocal');
        tbody.innerHTML = ''; // Limpiar contenido previo
    
        locales.forEach(local => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${local.numeroLocal}</td>
                <td>${local.estado}</td>
                <td>$${local.precioMensual.toFixed(2)}</td>
            `;
    
            // Obtener la celda del estado (segunda celda)
            const celdaEstado = fila.children[1];
            const estado = local.estado.toLowerCase();
    
            // Cambiar el color de fondo y texto según el estado
            if (estado === 'disponible') {
                celdaEstado.style.backgroundColor = 'green';
                celdaEstado.style.color = 'white';
            } else if (estado === 'ocupado') {
                celdaEstado.style.backgroundColor = 'red';
                celdaEstado.style.color = 'white';
            }else if (estado === 'reservado') {
                celdaEstado.style.backgroundColor = 'orange';
                celdaEstado.style.color = 'white';
            }
    
            tbody.appendChild(fila);
        });
    }
    
    
    
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.clear();  // Limpia todo el localStorage
        sessionStorage.clear(); // Limpia todo el sessionStorage
        window.location.href = "../modulo-login/page-login.html"; // Redirige al login
    });

});
