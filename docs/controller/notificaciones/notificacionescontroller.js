
    document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const notificationList = document.getElementById("notification-list");
    const notificationCount = document.getElementById("notification-count");
    const badge = document.getElementById("notification-badge");

    if (!token) {
        console.error("Token JWT no encontrado en localStorage");
        notificationCount.innerText = "No autenticado.";
        return;
    }

    fetch("https://laperlacentrocomercial.dyndns.org/api/notifications", {
        headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al obtener notificaciones");
        return res.json();
    })
    .then(data => {
        notificationList.innerHTML = "";

        if (data.length === 0) {
        notificationCount.innerText = "No hay notificaciones nuevas.";
        badge.classList.add("d-none");
        return;
        }

        notificationCount.innerText = `Tiene ${data.length} notificación(es) nueva(s).`;
        badge.textContent = data.length;
        badge.classList.remove("d-none");

        data.forEach(notif => {
        const mensaje = notif.mensaje.toLowerCase();
        let iconClass = "bi-info-circle text-secondary";

        if (mensaje.includes("próxima")) {
            iconClass = "bi-exclamation-triangle text-warning";
        } else if (mensaje.includes("totalmente pagada") || mensaje.includes("liquidada")) {
            iconClass = "bi-cash text-success";
        } else if (mensaje.includes("abono")) {
            iconClass = "bi-cash-coin text-info";
        }

        const li = document.createElement("li");
        li.innerHTML = `
            <a class="app-notification__item" href="javascript:;" data-id="${notif.id}">
            <span class="app-notification__icon"><i class="bi ${iconClass} fs-4"></i></span>
            <div>
                <p class="app-notification__message">${notif.mensaje}</p>
                <small class="text-muted">${new Date(notif.fecha).toLocaleString()}</small>
            </div>
            </a>
        `;

        // Marcar como leída al hacer clic
        li.querySelector("a").addEventListener("click", () => {
            fetch(`https://laperlacentrocomercial.dyndns.org/api/notifications/${notif.id}/mark-read`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
            }).then(() => {
            li.remove(); // Elimina del DOM
            data.length--;

            // Actualiza contador
            if (data.length === 0) {
                notificationCount.innerText = "No hay notificaciones nuevas.";
                badge.classList.add("d-none");
            } else {
                notificationCount.innerText = `Tiene ${data.length} notificación(es) nueva(s).`;
                badge.textContent = data.length;
            }
            });
        });

        notificationList.appendChild(li);
        });
    })
    .catch(err => {
        console.error("Error al cargar notificaciones:", err);
        notificationCount.innerText = "Error al cargar notificaciones.";
        badge.classList.add("d-none");
    });
    });

