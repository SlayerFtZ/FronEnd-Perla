document.addEventListener("DOMContentLoaded", function () {
    // Verificar si el usuario tiene token, id y rol en el localStorage
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const rol = localStorage.getItem("rol");

    // Si no hay token, id o rol, redirigir al login
    if (!token || !id || !rol) {
        window.location.href = "../../view/modulo-login/page-login.html"; // Si no hay token, id o rol, redirigir al login
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
                url = `http://localhost:8081/api/usuarios/buscar/correo/${valorBusqueda}`;
                break;
            case 'nombre':
                url = `http://localhost:8081/api/usuarios/buscar/nombre/${valorBusqueda}`;
                break;
            case 'apellido':
                url = `http://localhost:8081/api/usuarios/buscar/apellido/${valorBusqueda}`;
                break;
            case 'direccion':
                url = `http://localhost:8081/api/usuarios/buscar/direccion/${valorBusqueda}`;
                break;
            case 'curp':
                url = `http://localhost:8081/api/usuarios/buscar/curp/${valorBusqueda}`;
                break;
                case 'telefono':
                    url = `http://localhost:8081/api/usuarios/buscar/telefono/${valorBusqueda}`;
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

    // Mostrar usuarios en tabla
function mostrarUsuariosEnTabla(usuarios) {
    const tabla = document.getElementById('tablaUsuarios');
    tabla.innerHTML = '';

    let contenido = '';
    usuarios.forEach(usuario => {
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
});
