document.addEventListener("DOMContentLoaded", function () {
    // Obtener datos del localStorage
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const rol = localStorage.getItem("rol");
    const estado = localStorage.getItem("estado");

    // Validar existencia de datos y el estado del usuario
    if (!token || !id || !rol || !estado) {
        window.location.href = "../../view/modulo-login/page-login.html";
    } else if (estado.toLowerCase() === "inactivo") {
        // Si el estado es inactivo, limpiar almacenamiento y redirigir
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../../view/modulo-login/page-login.html";
    }
});



let originalLogo = document.getElementById("companyLogo").src; // Guardamos la imagen original

            // Función para mostrar la vista previa de la imagen seleccionada
            document.getElementById("profilePhoto").addEventListener("change", function (event) {
                let file = event.target.files[0];

                if (file) {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        document.getElementById("companyLogo").src = e.target.result; // Mostrar la imagen
                    };
                    reader.readAsDataURL(file);
                }
            });

            document.getElementById("formAgregarLocal").addEventListener("submit", function (event) {
                event.preventDefault(); // Evita el envío inmediato del formulario

                let fileInput = document.getElementById("profilePhoto");
                let file = fileInput.files[0];

                // Validar que se haya seleccionado un archivo
                if (!file) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Por favor, selecciona una imagen antes de actualizar.",
                    });
                    return;
                }

                // Validar el tipo de archivo (solo imágenes permitidas)
                let allowedExtensions = ["image/jpeg", "image/png", "image/gif"];
                if (!allowedExtensions.includes(file.type)) {
                    Swal.fire({
                        icon: "error",
                        title: "Formato no permitido",
                        text: "Solo se permiten imágenes en formato JPG, PNG o GIF.",
                    });
                    return;
                }

                // Simulación de actualización exitosa
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "El icono de la empresa ha sido actualizado correctamente.",
                });

                // Aquí puedes agregar la lógica para enviar el formulario al servidor si es necesario
                // this.submit();
            });

            // Botón de cancelar
            document.getElementById("cancelBtn").addEventListener("click", function () {
                Swal.fire({
                    icon: "warning",
                    title: "¿Estás seguro?",
                    text: "Los cambios no se guardarán si cancelas.",
                    showCancelButton: true,
                    confirmButtonText: "Sí, cancelar",
                    cancelButtonText: "No, continuar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        document.getElementById("formAgregarLocal").reset();
                        document.getElementById("companyLogo").src = originalLogo; // Restaurar la imagen original
                        Swal.fire("Cancelado", "No se realizaron cambios.", "info").then(() => {
                            window.location.href = "../modulo-inicio/dashboard-inicio.html"; // Redirigir al dashboard
                        });
                    }
                });
            });


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
            
                document.getElementById("logoutBtn").addEventListener("click", function () {
                localStorage.clear();  // Limpia todo el localStorage
                sessionStorage.clear(); // Limpia todo el sessionStorage
                window.location.href = "../modulo-login/page-login.html"; // Redirige al login
                });