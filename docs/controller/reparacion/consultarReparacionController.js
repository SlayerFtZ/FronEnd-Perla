document.addEventListener('DOMContentLoaded', function () {
    // Obtenemos todos los botones "Ver Historial"
    const verHistorialBtns = document.querySelectorAll('.btn-info');

    verHistorialBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            
            const historial = [
                {
                    descripcion: 'Reparación del juego mecánico del avión del sector del norte',
                    contratista: 'Althan Travis',
                    fechaReparacion: '10/12/2025',
                    fechaFin: '15/12/2025',
                    costo: '$1560.00'
                },
                {
                    descripcion: 'Reparación del sistema hidráulico del avión del sector sur',
                    contratista: 'Josue Perez',
                    fechaReparacion: '12/01/2026',
                    fechaFin: '15/01/2026',
                    costo: '$160.00'
                }
                // Agrega más objetos si lo deseas
            ];

            // Aquí vaciamos el contenido previo del modal
            const historialReparaciones = document.getElementById('historialReparaciones');
            historialReparaciones.innerHTML = ''; 

            // Agregamos las filas con los datos del historial
            historial.forEach(function (item) {
                const row = `
                    <tr>
                        <td>${item.descripcion}</td>
                        <td>${item.contratista}</td>
                        <td>${item.fechaReparacion}</td>
                        <td>${item.fechaFin}</td>
                        <td>${item.costo}</td>
                    </tr>
                `;
                historialReparaciones.innerHTML += row;
            });

            // Abrir el modal de historial
            var myModal = new bootstrap.Modal(document.getElementById('modalHistorial'));
            myModal.show();
        });
    });
});
