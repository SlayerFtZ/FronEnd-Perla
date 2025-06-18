
const secretKey = "clave-secreta-123"; 
function getDecryptedUserId() {
  const encryptedID = localStorage.getItem("id");
  if (!encryptedID) return null;

  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedID, secretKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Error al desencriptar ID:", e);
    return null;
  }
}

function getDecryptedRole() {
  const encryptedRole = localStorage.getItem("rol");
  if (!encryptedRole) return null;

  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedRole, secretKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Error al desencriptar rol:", e);
    return null;
  }
}

// Exportar las funciones globalmente si usas módulos
// export { getDecryptedUserId, getDecryptedRole };


document.addEventListener("DOMContentLoaded", function () {
    const secretKey = "clave-secreta-123"; // misma clave usada para cifrar

    const token = localStorage.getItem("token");
    const id = getDecryptedUserId();
    const encryptedRole = localStorage.getItem("rol");
    const estado = localStorage.getItem("estado");

    let rol = "";
    if (encryptedRole) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedRole, secretKey);
            rol = bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error("Error al desencriptar el rol:", error);
        }
    }

    const userRole = rol ? rol.toLowerCase() : "";
    const loginPage = "../../modulo-login/page-login.html";

    const rolesPermitidos = ["superadmin", "administrador", "mesa_directiva"];

    const rutaActual = window.location.pathname.toLowerCase().replace(/\/+$/, "");

    const paginasRestringidas = [
        "/view/modulo-configuracion/actualizar-icono-empresa.html",
        "/view/modulo-configuracion/configuracion-global-renta.html",
        "/view/modulo-egresos/agregar-egreso.html",
        "/view/modulo-egresos/consultar-egreso.html",
        "/view/modulo-ingresos/agregar-ingreso.html",
        "/view/modulo-ingresos/consultar-ingreso.html",
        "/view/modulo-pagos-extra/consulta-pago-extra.html",
        "/view/modulo-pagos-extra/pagos-extra.html",
        "/view/modulo-renta/actualizar-renta.html",
        "/view/modulo-renta/agregar-renta.html",
        "/view/modulo-renta/buscar-renta.html",
        "/view/modulo-juego/actualizar-juego.html",
        "/view/modulo-juego/agregar-juego.html",
        "/view/modulo-local/actualizar-local.html",
        "/view/modulo-local/agregar-local.html",
        "/view/modulo-usuario/agregar-contacto-emergencia.html",
        "/view/modulo-usuario/agregar-perfil-salud.html",
        "/view/modulo-usuario/agregar-usuario.html",
        "/view/modulo-reportes/consultar-reporte.html",
        "/view/modulo-reportes/agregar-reporte-juegos-anio.html",
        "/view/modulo-reportes/agregar-ingresos-juegos-periodo.html",
        "/view/modulo-reportes/agregar-reporte-egresos-anio.html",
        "/view/modulo-reportes/agregar-reporte-egresos-mes.html",
        "/view/modulo-reportes/agregar-reporte-ingresos-mes.html",
        "/view/modulo-reportes/agregar-reporte-rentas-anio.html",
        "/view/modulo-reportes/agregar-reporte-rentas-mes.html",
        "/view/modulo-reportes/agregar-reportes-ingresos-anio.html",
        "/view/modulo-reportes/agregar-recibo-reparacion.html",

        "/view/modulo-usuario/consultar-usuario.html",
        "/view/modulo-usuario/perfilUsuario-consultado.html",
        "/view/modulo-reparaciones/agregar-reparacion.html",
        "/view/modulo-reparaciones/consultar-reparacion.html"

    ];

    if (!token || !id || !encryptedRole || !estado) {
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
            window.location.href = "/view/modulo-inicio/dashboard-inicio.html";
        });
    }

    // ===== Acceso a la navegación según el rol =====
    const navegacionRentas = document.getElementById("navegacionRenta")
    const navegacionJuegos = document.getElementById("navegacionJuego")
    const navegacionIngresoEgreso = document.getElementById("navegacionIngresoEgreso")
    const navegacionConfiguracion = document.getElementById("navegacionConfiguraciones")
    const navegacionLocales = document.getElementById("navegacionLocales")
    const navegacionRentaAgregar = document.getElementById("navegacionRentaAgregar")
    const navegacionRentaConsultar = document.getElementById("navegacionRentaConsultar")
    const navegacionLocalAgregar = document.getElementById("navegacionLocalAgregar")
    const navegacionLocalActualizar = document.getElementById("navegacionLocalActualizar")
    const navegacionPagosExtra = document.getElementById("navegacionPagosExtra")
    const navegacionReporteConsultarAdmin = document.getElementById("navegacionReporteConsultarAdmin")
    const navegacionReporteJuegosAnio = document.getElementById("navegacionReporteJuegosAnio")
    const navegacionReporteIngresosMes = document.getElementById("navegacionReporteIngresosMes")
    const navegacionReporteIngresosAnual = document.getElementById("navegacionReporteIngresosAnual")
    const navegacionReporteEgresosMes = document.getElementById("navegacionReporteEgresosMes")
    const navegacionReporteEgresosAnio = document.getElementById("navegacionReporteEgresosAnio")
    const navegacionReporteRentasAnio = document.getElementById("navegacionReporteRentasAnio")
    const navegacionReportesRentasMes = document.getElementById("navegacionReportesRentasMes")
    const navegacionReportesIgresosJuegoPeriodo = document.getElementById("navegacionReportesIgresosJuegoPeriodo")
    const agregarUsuarioAcceso = document.getElementById("agregarUsuarioAcceso")
    const agregarPerfilSaludAcceso = document.getElementById("agregarPerfilSaludAcceso")
    const agregarEmergenciaAcceso = document.getElementById("agregarEmergenciaAcceso")
    

    if (!rolesPermitidos.includes(userRole)) {
        navegacionJuegos?.style && (navegacionJuegos.style.display = "none");
        navegacionIngresoEgreso?.style && (navegacionIngresoEgreso.style.display = "none");
        navegacionConfiguracion?.style && (navegacionConfiguracion.style.display = "none");
        navegacionRentaAgregar?.style && (navegacionRentaAgregar.style.display = "none");
        navegacionRentaConsultar?.style && (navegacionRentaConsultar.style.display = "none");
        navegacionLocalAgregar?.style && (navegacionLocalAgregar.style.display = "none");
        navegacionLocalActualizar?.style && (navegacionLocalActualizar.style.display = "none");
        navegacionPagosExtra?.style && (navegacionPagosExtra.style.display = "none");
        navegacionReporteConsultarAdmin?.style && (navegacionReporteConsultarAdmin.style.display = "none");
        navegacionReporteJuegosAnio?.style && (navegacionReporteJuegosAnio.style.display = "none");
        navegacionReporteIngresosMes?.style && (navegacionReporteIngresosMes.style.display = "none");
        navegacionReporteIngresosAnual?.style && (navegacionReporteIngresosAnual.style.display = "none");
        navegacionReporteEgresosMes?.style && (navegacionReporteEgresosMes.style.display = "none");
        navegacionReporteEgresosAnio?.style && (navegacionReporteEgresosAnio.style.display = "none");
        navegacionReporteRentasAnio?.style && (navegacionReporteRentasAnio.style.display = "none");
        navegacionReportesRentasMes?.style && (navegacionReportesRentasMes.style.display = "none");
        navegacionReportesIgresosJuegoPeriodo?.style && (navegacionReportesIgresosJuegoPeriodo.style.display = "none");



        agregarUsuarioAcceso?.style && (agregarUsuarioAcceso.style.display = "none");
        agregarPerfilSaludAcceso?.style && (agregarPerfilSaludAcceso.style.display = "none");
        agregarEmergenciaAcceso?.style && (agregarEmergenciaAcceso.style.display = "none");
    }
});
