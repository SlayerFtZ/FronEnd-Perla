document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const rol = localStorage.getItem("rol");
    const estado = localStorage.getItem("estado");
    const userRole = rol ? rol.toLowerCase() : "";
    const loginPage = "../../modulo-login/page-login.html";

    const rolesPermitidos = ["superadmin", "administrador", "mesa directiva"];

    const rutaActual = window.location.pathname.toLowerCase().replace(/\/+$/, "");

    const paginasRestringidas = [
        //modulo de reparaciones
        "/docs/view/modulo-configuracion/actualizar-iconoempresa.html",
        "/docs/view/modulo-configuracion/configuracionglobal-renta.html",
        //modulo de egresos
        "/docs/view/modulo-egresos/agregar-egreso.html",
        "/docs/view/modulo-egresos/consultar-egreso.html",
        //modulo de ingresos
        "/docs/view/modulo-ingresos/agregar-ingreso.html",
        "/docs/view/modulo-ingresos/consultar-ingreso.html",
        //modulo de juegos
        "/docs/view/modulo-juego/actualizar-juego.html",
        "/docs/view/modulo-juego/agregar-juego.html",
        //modulo de locales
        "/docs/view/modulo-local/actualizar-local.html",
        "/docs/view/modulo-local/agregar-local.html",
        "/docs/view/modulo-local/consultar-local.html",
        //modulo de rentas
        "/docs/view/modulo-renta/actualizar-renta.html",
        "/docs/view/modulo-renta/agregar-renta.html",
        "/docs/view/modulo-renta/buscar-renta.html",
        //modulo de usuarios
        "/docs/view/modulo-usuario/agregar-contacto-emergencia.html",
        "/docs/view/modulo-usuario/agregar-perfil-salud.html",
        "/docs/view/modulo-usuario/agregar-usuario.html",

    ];

    if (!token || !id || !rol || !estado) {
        window.location.href = loginPage;
        return;
    }

    if (estado.toLowerCase() === "inactivo") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = loginPage;
        return;
    }

    if (paginasRestringidas.includes(rutaActual) && !rolesPermitidos.includes(userRole)) {
        Swal.fire({
            icon: "error",
            title: "Acceso Denegado",
            text: "No tienes permiso para acceder a esta página.",
            confirmButtonText: "Aceptar"
        }).then(() => {
            window.location.href = "/docs/view/modulo-inicio/dashboard-inicio.html";
        });
    }
});

const rol = localStorage.getItem("rol");

const navegacionRentas = document.getElementById("navegacionRenta")
const navegacionJuegos = document.getElementById("navegacionJuego")
const navegacionIngresoEgreso = document.getElementById("navegacionIngresoEgreso")
const navegacionConfiguracion = document.getElementById("navegacionConfiguraciones")
const navegacionLocales = document.getElementById("navegacionLocales")
const agregarUsuarioAcceso = document.getElementById("agregarUsuarioAcceso")
const agregarPerfilSaludAcceso = document.getElementById("agregarPerfilSaludAcceso")
const agregarEmergenciaAcceso = document.getElementById("agregarEmergenciaAcceso")

const rolesPermitidos = ["superadmin", "administrador", "mesa directiva"];
const userRole = rol ? rol.toLowerCase() : ""; // Convertir el rol a minúsculas para comparación

if (!rolesPermitidos.includes(userRole)) {
    // navegacionRentas.style.display = "none"; // Oculta el botón si no tiene rol permitido
    // navegacionJuegos.style.display = "none"; // Oculta el botón si no tiene rol permitido
    // navegacionIngresoEgreso.style.display = "none"; // Oculta el botón si no tiene rol permitido
    // navegacionConfiguracion.style.display = "none"; // Oculta el botón si no tiene rol permitido
    // navegacionLocales.style.display = "none"; // Oculta el botón si no tiene rol permitido

    // //acceso al modulo de usuarios
    // agregarUsuarioAcceso.style.display = "none"; // Oculta el botón si no tiene rol permitido
    // agregarPerfilSaludAcceso.style.display = "none"; // Oculta el botón si no tiene rol permitido
    // agregarEmergenciaAcceso.style.display = "none"; // Oculta el botón si no tiene rol permitido

}