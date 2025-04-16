document.addEventListener("DOMContentLoaded", function () {

    // Función para verificar si el usuario tiene token, id y rol
    function verificarSesion() {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const rol = localStorage.getItem("rol");

        if (!token || !id || !rol) {
            window.location.href = "../../view/modulo-login/page-login.html"; // Redirigir al login si no hay token, id o rol
            return false;
        }
        return true;
    }

    if (!verificarSesion()) return;

    // Función para cargar las máquinas de juego
    async function cargarMaquinas() {
        const apiUrl = 'http://localhost:8081/api/maquinas-juegos';
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        const container = document.querySelector('.row');
        const loadingMessage = document.createElement('p');
        loadingMessage.textContent = "Cargando máquinas de juego...";
        container.appendChild(loadingMessage);

        try {
            const response = await fetch(apiUrl, { headers });
            if (response.status === 204) {
                container.innerHTML = "<p>No hay máquinas registradas.</p>";
                return;
            }
            const data = await response.json();
            container.innerHTML = ''; // Limpiar el contenedor antes de agregar las nuevas tarjetas
            data.forEach(maquina => {
                const card = crearCard(maquina);
                container.appendChild(card);
            });
        } catch (error) {
            console.error('Error al obtener las máquinas de juego:', error);
            container.innerHTML = "<p>Hubo un error al cargar las máquinas. Por favor, intenta de nuevo más tarde.</p>";
        }
    }

    cargarMaquinas();

    // Función para crear una tarjeta para cada máquina
    function crearCard(maquina) {
        const cardCol = document.createElement('div');
        cardCol.classList.add('col-md-4');

        const card = document.createElement('div');
        card.classList.add('card');
        card.style.width = '20rem';

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('container', 'fxFlex=Centro');

        const img = document.createElement('img');
        img.src = '../../images/logo-la perla.png';
        img.classList.add('card-img-top', 'd-block', 'mx-auto');
        img.alt = '...';

        imgContainer.appendChild(img);
        card.appendChild(imgContainer);

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

        button.addEventListener('click', function () {
            sessionStorage.setItem('idcardJuego', maquina.idMaquina); // Usar 'idMaquina' en lugar de 'id'
            document.getElementById("nombreActJuego").value = maquina.nombre;
            document.getElementById("descripcionActJuego").value = maquina.descripcion;
            document.getElementById("estadoActUso").value = maquina.estado;
        });

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardSubtitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(button);

        card.appendChild(cardBody);
        cardCol.appendChild(card);

        return cardCol;
    }

    // Función para actualizar el juego
    async function actualizarJuego(event) {
        event.preventDefault(); // Evita el envío tradicional del formulario

        const nombreJuego = document.getElementById("nombreActJuego").value.trim().toUpperCase();
        const descripcionJuego = document.getElementById("descripcionActJuego").value.trim().toUpperCase();
        const estadoUso = document.getElementById("estadoActUso").value;

        if (nombreJuego === "" || descripcionJuego === "" || estadoUso === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Todos los campos son obligatorios.",
            });
            return;
        }

        const idJuego = sessionStorage.getItem('idcardJuego');
        if (!idJuego) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se ha seleccionado un juego para actualizar.",
            });
            return;
        }

        const apiUpdateUrl = `http://localhost:8081/api/maquinas-juegos/${idJuego}`;
        const requestBody = {
            nombre: nombreJuego,
            descripcion: descripcionJuego,
            estado: estadoUso
        };

        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            const response = await fetch(apiUpdateUrl, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la máquina de juego.');
            }

            const data = await response.json();
            Swal.fire({
                icon: "success",
                title: "Juego actualizado",
                text: "El juego se ha actualizado correctamente.",
                confirmButtonText: "Aceptar"
            }).then(() => {
                document.getElementById("formActJuego").reset();
                let modal = bootstrap.Modal.getInstance(document.getElementById("modalActJuego"));
                modal.hide(); // Cierra el modal
                location.reload(); // Actualiza la página
            });
            
        } catch (error) {
            console.error('Error al actualizar la máquina de juego:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al actualizar el juego.",
            });
        }
    }

    document.getElementById("formActJuego").addEventListener("submit", actualizarJuego);

    // Función de logout
    function logout() {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../modulo-login/page-login.html"; // Redirige al login
    }

    document.getElementById("logoutBtn").addEventListener("click", logout);
});
