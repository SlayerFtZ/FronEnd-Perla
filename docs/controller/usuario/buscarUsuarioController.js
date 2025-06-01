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

    // Evento del botón de búsqueda
    document.querySelector('.app-search__button').addEventListener('click', buscarUsuario);

    document.getElementById('searchEmail').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            buscarUsuario();
        }
    });
    
    function buscarUsuario() {
        const valorBusqueda = document.getElementById('searchEmail').value.trim();
        const opcion = document.getElementById('opcionesBuscarUsuario').value;

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
            case 'correo':
                url = `https://laperlacentrocomercial.dyndns.org/api/usuarios/buscar/correo/${valorBusqueda}`;
                break;
            case 'nombre':
                url = `https://laperlacentrocomercial.dyndns.org/api/usuarios/buscar/nombre/${valorBusqueda}`;
                break;
            case 'apellido':
                url = `https://laperlacentrocomercial.dyndns.org/api/usuarios/buscar/apellido/${valorBusqueda}`;
                break;
            case 'direccion':
                url = `https://laperlacentrocomercial.dyndns.org/api/usuarios/buscar/direccion/${valorBusqueda}`;
                break;
            case 'curp':
                url = `https://laperlacentrocomercial.dyndns.org/api/usuarios/buscar/curp/${valorBusqueda}`;
                break;
                case 'telefono':
                    url = `https://laperlacentrocomercial.dyndns.org/api/usuarios/buscar/telefono/${valorBusqueda}`;
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

                const usuarios = Array.isArray(data) ? data : [data];

                if (usuarios.length === 0) throw new Error();

                Swal.fire({
                    icon: 'success',
                    title: 'Usuario encontrado',
                    text: 'Se encontraron usuarios con los datos proporcionados.',
                });

                mostrarUsuariosEnTabla(usuarios);
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontraron usuarios con esos datos.',
                });
                document.getElementById('tablaUsuarios').innerHTML = `
                    <tr><td colspan="7" class="text-center">No se encontraron usuarios.</td></tr>
                `;
            });
    }

    function mostrarUsuariosEnTabla(usuarios) {
        const tabla = document.getElementById('tablaUsuarios');
        tabla.innerHTML = '';
    
        let contenido = '';
        usuarios.forEach(usuario => {
            let claseFondoEstado = '';
            switch (usuario.estado) {
                case 'Activo':
                    claseFondoEstado = 'bg-success text-white';
                    break;
                case 'Inactivo':
                    claseFondoEstado = 'bg-danger text-white';
                    break;
            }
    
            contenido += `
                <tr>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="redirigirPerfil(${usuario.idUsuario})">
                            Ver perfil
                        </button>
                    </td>
                    <td>
                        <img src="${usuario.fotoPerfilUrl || '../../images/perfilUsuario.jpg'}" width="50" class="me-2">
                        ${usuario.nombre}
                    </td>
                    <td>${usuario.apellidoPaterno}</td>
                    <td>${usuario.apellidoMaterno}</td>
                    <td>${usuario.rfc}</td>
                    <td>${usuario.curp}</td>
                    <td class="text-end">${usuario.rol}</td>
                    <td class="text-end ${claseFondoEstado}"><strong>${usuario.estado}</strong></td>
                </tr>
            `;
        });
    
        tabla.innerHTML = contenido;
    }
    
    

    // Redirección al perfil
    window.redirigirPerfil = function (idUsuario) {
        // Guardamos el id del usuario en sessionStorage
        sessionStorage.setItem("idUsuario", idUsuario);
        window.location.href = `../../view/modulo-usuario/perfilUsuario-consultado.html`;
    };

     // Evento de logout
        document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.clear();  // Limpia todo el localStorage
        sessionStorage.clear(); // Limpia todo el sessionStorage
        window.location.href = "../modulo-login/page-login.html"; // Redirige al login
    });
});
