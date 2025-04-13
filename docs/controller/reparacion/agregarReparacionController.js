document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById('formAgregarReparacion');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = form.querySelector('button[type="submit"]');

    const fechaReparacionInput = document.getElementById('fechaReparacion');
    const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    fechaReparacionInput.value = fechaActual;

    cancelBtn.addEventListener('click', function() {
        form.reset();
    });

    try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem('token');

        if (!id || !token) {
            throw new Error("No se encontró el id o token en el almacenamiento local.");
        }

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

        const usuarioNombre = `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`;
        document.getElementById("reparacionUsuario").value = usuarioNombre;

    } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const descripcion = document.getElementById('descripcionReparacion').value.trim();
        const contratista = document.getElementById('contratista').value.trim();
        const fecha = new Date().toISOString().split('T')[0];
        const fechaFin = document.getElementById('fechaFin').value;
        const costoReparacion = document.getElementById('costoReparacion').value;

        // Validación básica
        if (!fecha || !descripcion || !contratista || !fechaFin || !costoReparacion) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Todos los campos son obligatorios.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Validación de fecha final
        if (new Date(fechaFin) < new Date(fecha)) {
            Swal.fire({
                icon: 'warning',
                title: 'Fecha inválida',
                text: 'La fecha de finalización no puede ser anterior a la fecha de inicio.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Validación de costo
        if (isNaN(costoReparacion) || parseFloat(costoReparacion) <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Costo inválido',
                text: 'Ingrese un costo válido mayor a 0.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerText = 'Enviando...';

            const data = {
                idUsuario: localStorage.getItem("id"),
                descripcion,
                contratista,
                fecha,
                fechaFinalizacion: fechaFin,
                costo: parseFloat(costoReparacion)
            };

            const response = await fetch('http://localhost:8081/api/reparaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            submitBtn.disabled = false;
            submitBtn.innerText = 'Agregar Reparación';

            if (response.ok) {
                const result = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: '¡Reparación agregada!',
                    text: `La reparación se ha registrado correctamente a nombre de ${result.nombreUsuario}.`,
                    confirmButtonText: 'Aceptar'
                }).then((res) => {
                    if (res.isConfirmed) {
                        form.reset();
                        fechaReparacionInput.value = fechaActual; // Reiniciar fecha actual
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
            submitBtn.disabled = false;
            submitBtn.innerText = 'Agregar Reparación';

            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'No se pudo conectar con el servidor.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
});
