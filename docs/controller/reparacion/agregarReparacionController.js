document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById('formAgregarReparacion');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Referenciamos el campo de fechaReparacion
    const fechaReparacionInput = document.getElementById('fechaReparacion');
    
    // Establecemos la fecha actual en el campo
    const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    fechaReparacionInput.value = fechaActual;

    // Cancelar la acción del formulario (limpiar o volver al estado anterior)
    cancelBtn.addEventListener('click', function() {
        form.reset(); // Reseteamos el formulario
    });

    try {
        // Obtener el id y el token del localStorage
        const id = localStorage.getItem("id");  // El id del usuario almacenado en localStorage
        const token = localStorage.getItem('token');  // El token almacenado en localStorage

        if (!id || !token) {
            throw new Error("No se encontró el id o token en el almacenamiento local.");
        }

        // Hacer la solicitud al API para obtener la información del usuario
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

        // Actualizamos el campo de nombre del usuario en el formulario
        const usuarioNombre = `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`;
        document.getElementById("reparacionUsuario").value = usuarioNombre;

    } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevenimos el envío del formulario

        // Obtenemos los valores de los campos del formulario
        const descripcion = document.getElementById('descripcionReparacion').value;
        const contratista = document.getElementById('contratista').value;
        const fecha = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
        const fechaFin = document.getElementById('fechaFin').value;
        const costoReparacion = document.getElementById('costoReparacion').value;

        // Validación de los campos
        if (!fecha || !descripcion || !contratista || !fechaFin || !costoReparacion) {
            // Si algún campo está vacío, mostramos un mensaje de error
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Todos los campos son obligatorios.',
                confirmButtonText: 'Aceptar'
            });
        } else {
            try {
                // Preparar los datos para enviar al API
                const data = {
                    idLocal: id,  // Asumimos que 'id' es el id del local
                    idUsuario: id,  // Asumimos que 'id' también es el id del usuario
                    descripcion,
                    contratista,
                    fecha: fecha,  // Usamos la fecha actual
                    fechaFinalizacion: fechaFin,
                    costo: parseFloat(costoReparacion) // Aseguramos que el costo sea un número
                };

                // Realizar la solicitud al API
                const response = await fetch('http://localhost:8081/api/reparaciones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                // Verificar la respuesta del API
                if (response.ok) {
                    const result = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: '¡Reparación agregada!',
                        text: 'La reparación se ha agregado correctamente.',
                        confirmButtonText: 'Aceptar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            form.reset(); // Limpiar formulario si el usuario confirma
                        }
                    });
                } else {
                    const error = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: error.message || 'Ocurrió un error al agregar la reparación.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: 'No se pudo conectar con el servidor.',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    });
});
