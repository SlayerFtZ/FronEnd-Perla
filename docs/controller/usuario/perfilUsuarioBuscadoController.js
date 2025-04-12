document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    const id = sessionStorage.getItem("idUsuario");

    // Obtener datos del usuario
    try {
        const response = await fetch(`http://localhost:8081/api/usuarios/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener usuario: ${response.status}`);
        }

        const data = await response.json();
        console.log("Usuario encontrado:", data);

        document.querySelector("input[placeholder='Nombre']").value = data.nombre;
        document.querySelector("input[placeholder='Rol']").value = data.rol;
        document.querySelector("input[placeholder='Apellido paterno']").value = data.apellidoPaterno;
        document.querySelector("input[placeholder='Apellido Materno']").value = data.apellidoMaterno;
        document.querySelector("input[placeholder='Correo']").value = data.correo;
        document.querySelector("input[placeholder='Curp']").value = data.curp;
        document.querySelector("input[placeholder='Rfc']").value = data.rfc;
        document.querySelector("input[placeholder='Fecha de nacimiento']").value = data.fechaNacimiento;
        document.querySelector("input[placeholder='Telefono']").value = data.telefono;
        document.querySelector("input[placeholder='DIrección']").value = data.direccion;
        document.querySelector("input[placeholder='Genero']").value = data.genero || '';
        document.querySelector("input[placeholder='Estado']").value = data.estadoCivil || '';
        document.querySelector("input[placeholder='Nss']").value = data.numeroSeguro || '';

        document.querySelector("#modalActualizarUsuario").addEventListener("shown.bs.modal", function () {
            document.querySelector("#actualizarNombre").value = data.nombre;
            document.querySelector("#actualizarApellidoPaterno").value = data.apellidoPaterno;
            document.querySelector("#actualizarApellidoMaterno").value = data.apellidoMaterno;
            document.querySelector("#actualizarCorreo").value = data.correo;
            document.querySelector("#actualizarCurp").value = data.curp;
            document.querySelector("#actualizarRfc").value = data.rfc;
            document.querySelector("#actualizarFechaNacimiento").value = data.fechaNacimiento;
            document.querySelector("#actualizarNss").value = data.numeroSeguro;
            document.querySelector("#actualizarTelefono").value = data.telefono;
            document.querySelector("#actualizarDireccion").value = data.direccion;
            
        });

        if (data.fotoPerfilUrl) {
            document.getElementById("imagePreview").src = data.fotoPerfilUrl;
        }
    } catch (error) {
        console.warn("Error en usuario:", error.message);
    }

    // Obtener padecimientos
    try {
        const padecimientosResponse = await fetch(`http://localhost:8081/api/padecimientos/usuario/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    
        if (!padecimientosResponse.ok) {
            throw new Error(`Error al obtener padecimientos: ${padecimientosResponse.status}`);
        }
    
        const padecimientosData = await padecimientosResponse.json();
        console.log("Padecimientos encontrados:", padecimientosData);
    
        // Verifica si el arreglo tiene al menos un padecimiento
        if (padecimientosData.length > 0) {
            const padecimiento = padecimientosData[0]; // Tomamos el primero
    
            document.getElementById("padecimientos").value = padecimiento.nombrePadecimiento || 'N/A';
            document.getElementById("descripcion").value = padecimiento.descripcion || 'N/A';
            document.getElementById("categoria").value = padecimiento.categoria || 'N/A';
    
            document.getElementById("healthConditions").value = padecimiento.nombrePadecimiento || 'N/A';
            document.getElementById("healthDescription").value = padecimiento.descripcion || 'N/A';
            document.getElementById("healthCategory").value = padecimiento.categoria || 'seleccion';
    
            const userProfileImageUrl = padecimiento.usuario?.fotoPerfilUrl || '../../images/perfilUsuario.jpg';
            document.querySelector("img.profile-img").src = userProfileImageUrl;
        } else {
            console.warn("No se encontraron padecimientos para este usuario.");
        }
    } catch (error) {
        console.warn("Error en padecimientos:", error.message);
    }
    
    // Obtener contacto de emergencia
    try {
        const emergenciaResponse = await fetch(`http://localhost:8081/api/contactos-emergencia/usuario/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!emergenciaResponse.ok) {
            throw new Error(`Error al obtener contacto de emergencia: ${emergenciaResponse.status}`);
        }

    const contactoEmergenciaData = await emergenciaResponse.json();
    console.log("Contacto de emergencia encontrado:", contactoEmergenciaData);

    const contactoEmergencia = contactoEmergenciaData[0] || {};

    // Asegurarse de que `usuarioData` esté definido y contenga los datos necesarios
    const usuarioData = contactoEmergencia.usuario || {}; // Esto depende de cómo obtengas los datos del usuario

    // Verificar si `usuarioData.fotoPerfilUrl` está definido
    const userProfileImageUrl = usuarioData.fotoPerfilUrl || '../../images/perfilUsuario.jpg';

    // Asignar la imagen de perfil y los demás datos del contacto de emergencia
    document.querySelector("img.profile-img-emergencia").src = userProfileImageUrl;
        document.querySelector("input[placeholder='Ingresa su nombre']").value = contactoEmergencia.nombre || 'N/A';
        document.querySelector("input[placeholder='Ingresa el apellido paterno']").value = contactoEmergencia.apellidoPaterno || 'N/A';
        document.querySelector("input[placeholder='Ingresa el apellido materno']").value = contactoEmergencia.apellidoMaterno || 'N/A';
        document.querySelector("input[placeholder='Ingresa el número de teléfono']").value = contactoEmergencia.telefono || 'N/A';
        document.querySelector("input[placeholder='Parentesco']").value = contactoEmergencia.parentesco || 'N/A';

        document.getElementById("emergencyContactName").value = contactoEmergencia.nombre || 'N/A';
        document.getElementById("emergencyContactLastName").value = contactoEmergencia.apellidoPaterno || 'N/A';
        document.getElementById("emergencyContactSecondLastName").value = contactoEmergencia.apellidoMaterno || 'N/A';
        document.getElementById("emergencyContactPhone").value = contactoEmergencia.telefono || 'N/A';
        document.getElementById("emergencyContactRelationship").value = contactoEmergencia.parentesco || 'seleccion'
    } catch (error) {
        console.warn("Error en contacto de emergencia:", error.message);
    }
});
