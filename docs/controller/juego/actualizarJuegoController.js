document.addEventListener("DOMContentLoaded", function () {
    // Obtener datos del localStorage
    const token = localStorage.getItem("token");
    const id = getDecryptedUserId();
    const rol = localStorage.getItem("rol");
    const estado = localStorage.getItem("estado");

    // Validar existencia de datos y el estado del usuario
    if (!token || !id || !rol || !estado) {
        return window.location.href = "../../view/modulo-login/page-login.html";
    } else if (estado.toLowerCase() === "inactivo") {
        localStorage.clear();
        sessionStorage.clear();
        return window.location.href = "../../view/modulo-login/page-login.html";
    }

    if (typeof verificarSesion === "function" && !verificarSesion()) return;

    async function cargarMaquinas() {
        const apiUrl = 'https://laperlacentrocomercial.dyndns.org/api/maquinas-juegos';
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        const container = document.querySelector('.row');

        if (!container) return;

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
            container.innerHTML = ''; // Limpiar el contenedor antes de agregar las tarjetas

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

    function crearCard(maquina) {
        const cardCol = document.createElement('div');
        cardCol.classList.add('col-md-4');

        const card = document.createElement('div');
        card.classList.add('card');
        card.style.width = '20rem';

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('container', 'text-center'); // fxFlex eliminado, reemplazado por 'text-center'

        const img = document.createElement('img');
        img.src = '../../images/logo-la perla.png';
        img.classList.add('card-img-top', 'd-block', 'mx-auto');
        img.alt = 'Imagen de máquina';

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
            sessionStorage.setItem('idcardJuego', maquina.idMaquina);

            const nombreInput = document.getElementById("nombreActJuego");
            const descripcionInput = document.getElementById("descripcionActJuego");
            const estadoSelect = document.getElementById("estadoActUso");

            if (nombreInput && descripcionInput && estadoSelect) {
                nombreInput.value = maquina.nombre;
                descripcionInput.value = maquina.descripcion;
                estadoSelect.value = maquina.estado;
            }
        });

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardSubtitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(button);

        card.appendChild(cardBody);
        cardCol.appendChild(card);

        return cardCol;
    }

    async function actualizarJuego(event) {
        event.preventDefault();

        const nombreJuego = document.getElementById("nombreActJuego")?.value.trim().toUpperCase();
        const descripcionJuego = document.getElementById("descripcionActJuego")?.value.trim().toUpperCase();
        const estadoUso = document.getElementById("estadoActUso")?.value;

        if (!nombreJuego || !descripcionJuego || !estadoUso) {
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

        const apiUpdateUrl = `https://laperlacentrocomercial.dyndns.org/api/maquinas-juegos/${idJuego}`;
        const requestBody = {
            nombre: nombreJuego,
            descripcion: descripcionJuego,
            estado: estadoUso
        };

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

            if (!response.ok) throw new Error('Error al actualizar la máquina de juego.');

            await response.json(); // podrías usarlo si quieres algo de la respuesta

            Swal.fire({
                icon: "success",
                title: "Juego actualizado",
                text: "El juego se ha actualizado correctamente.",
                confirmButtonText: "Aceptar"
            }).then(() => {
                document.getElementById("formActJuego")?.reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById("modalActJuego"));
                modal?.hide();
                location.reload();
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

    document.getElementById("formActJuego")?.addEventListener("submit", actualizarJuego);

    // Logout
    document.getElementById("logoutBtn")?.addEventListener("click", function () {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../modulo-login/page-login.html";
    });
});
