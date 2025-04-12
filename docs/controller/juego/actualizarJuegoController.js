document.addEventListener("DOMContentLoaded", function () {
    // Verificar si el usuario tiene token, id y rol en el localStorage
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const rol = localStorage.getItem("rol");

    // Si no hay token, id o rol, redirigir al login
    if (!token || !id || !rol) {
        window.location.href = "../../view/modulo-login/page-login.html"; // Si no hay token, id o rol, redirigir al login
    }

    // Cargar las máquinas de juego desde la API
    const apiUrl = 'http://localhost:8081/api/maquinas-juegos';
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
    const container = document.querySelector('.row');

    // Realizar la solicitud GET para cargar las máquinas
    fetch(apiUrl, { headers })
        .then(response => {
            if (response.status === 204) {
                container.innerHTML = "<p>No hay máquinas registradas.</p>";
                return;
            }
            return response.json();
        })
        .then(data => {
            // Iterar sobre la respuesta para crear las tarjetas
            data.forEach(maquina => {
                const card = createCard(maquina);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error al obtener las máquinas de juego:', error);
        });

    // Escuchar el envío del formulario de actualización
    document.getElementById("formActJuego").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío tradicional del formulario

        let nombreJuego = document.getElementById("nombreActJuego").value.trim();
        let descripcionJuego = document.getElementById("descripcionActJuego").value.trim();
        let estadoUso = document.getElementById("estadoActUso").value;

        if (nombreJuego === "" || descripcionJuego === "" || estadoUso === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Todos los campos son obligatorios.",
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Juego actualizado",
            text: "El juego se ha actualizado correctamente.",
            confirmButtonText: "Aceptar"
        }).then(() => {
            document.getElementById("formActJuego").reset();
            let modal = bootstrap.Modal.getInstance(document.getElementById("modalActJuego"));
            modal.hide(); // Cierra el modal
        });
    });

    // Función para crear una tarjeta para cada máquina
    function createCard(maquina) {
        const cardCol = document.createElement('div');
        cardCol.classList.add('col-md-4');

        const card = document.createElement('div');
        card.classList.add('card');
        card.style.width = '20rem';

        // Crear el contenedor de la imagen
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('container', 'fxFlex=Centro');

        const img = document.createElement('img');
        img.src = '../../images/logo-la perla.png'; // Puedes cambiar la ruta de la imagen si es necesario
        img.classList.add('card-img-top', 'd-block', 'mx-auto');
        img.alt = '...';

        imgContainer.appendChild(img);
        card.appendChild(imgContainer);

        // Crear el cuerpo de la tarjeta
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = maquina.nombre;

        const cardSubtitle = document.createElement('h6');
        cardSubtitle.classList.add('card-subtitle', 'mb-2', 'text-muted');
        cardSubtitle.textContent = `ESTADO: ${maquina.estado}`;

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = `DESCRIPCIÓN: ${maquina.descripcion}`;

        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary');
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#modalActJuego');
        button.textContent = 'Actualizar';

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardSubtitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(button);

        card.appendChild(cardBody);
        cardCol.appendChild(card);

        return cardCol;
    }

    // Escuchar el evento de logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.clear();  // Limpia todo el localStorage
        sessionStorage.clear(); // Limpia todo el sessionStorage
        window.location.href = "../modulo-login/page-login.html"; // Redirige al login
    });
});
