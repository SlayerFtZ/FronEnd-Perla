document.getElementById("formActJuego").addEventListener("submit", function(event) {
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