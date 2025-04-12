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


document.addEventListener("DOMContentLoaded", async function () {
    // Recupera el ID y el token del localStorage
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    // Valida si existen el ID y el token
    if (!id || !token) {
        console.error("ID, token o rol no válidos en localStorage.");
        return;
    }

    try {
        // Actualizar los datos cuando se hace clic en el botón de "Actualizar"
        const formActualizarUsuario = document.getElementById('formActualizarUsuario');
        const btnActualizar = document.querySelector('button[type="submit"]');
    
        if (formActualizarUsuario && btnActualizar) {
            formActualizarUsuario.addEventListener('submit', async function (event) {
                event.preventDefault();  // Evitar el comportamiento por defecto del formulario
    
                // Obtener los valores del formulario
                const nombre = document.getElementById('actualizarNombre').value;
                const apellidoPaterno = document.getElementById('actualizarApellidoPaterno').value;
                const apellidoMaterno = document.getElementById('actualizarApellidoMaterno').value;
                const correo = document.getElementById('actualizarCorreo').value;
                const curp = document.getElementById('actualizarCurp').value;
                const rfc = document.getElementById('actualizarRfc').value;
                const fechaNacimiento = document.getElementById('actualizarFechaNacimiento').value;
                const nss = document.getElementById('actualizarNss').value;
                const telefono = document.getElementById('actualizarTelefono').value;
                const direccion = document.getElementById('actualizarDireccion').value;
                const genero = document.querySelector('input[name="genero"]:checked').value;
                const estadoCivil = document.querySelector('input[name="estado"]:checked').value;
                const rol = document.querySelector('input[name="rol"]:checked').value;
    
                // Crear el objeto con los datos actualizados
                const usuarioActualizado = {
                    nombre,
                    apellidoPaterno,
                    apellidoMaterno,
                    correo,
                    curp,
                    rfc,
                    fechaNacimiento,
                    numeroSeguro: nss,
                    telefono,
                    direccion,
                    genero,
                    estadoCivil,
                    rol
                };
    
                try {
                    // Realiza la actualización en el backend
                    const response = await fetch(`http://localhost:8081/api/usuarios/actualizar/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(usuarioActualizado),
                    });
    
                    if (response.ok) {
                        alert('Usuario actualizado correctamente');
                        // Cerrar el modal
                        const modal = new bootstrap.Modal(document.getElementById('modalActualizarUsuario'));
                        modal.hide();
                    } else {
                        alert('Error al actualizar el usuario');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Hubo un error al intentar actualizar el usuario');
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
