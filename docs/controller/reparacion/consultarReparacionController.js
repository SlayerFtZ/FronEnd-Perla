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

  
  const searchBtn = document.querySelector(".app-search__button");
  const searchInput = document.querySelector(".app-search__input");
  const resultTable = document.querySelector("tbody");
  const filtroBusqueda = document.getElementById("opcionesBuscarReparacion");
  let idReparacionGlobal = null;
  
  // 🔍 Búsqueda de reparaciones
  searchBtn.addEventListener("click", function (e) {
    e.preventDefault();
  
    const textoBusqueda = searchInput.value.trim();
    const filtro = filtroBusqueda.value;
  
    if (textoBusqueda === "" || filtro === "seleccion") {
      Swal.fire({
        icon: "warning",
        title: "Búsqueda inválida",
        text: "Selecciona un filtro y haz tu búsqueda.",
      });
      return;
    }
  
    let url = "";
  
    switch (filtro) {
      case "contratista":
      url = `http://localhost:8081/api/reparaciones/buscar/contratista/${encodeURIComponent(textoBusqueda)}`;
      break;

      case "usuario":
      url = `http://localhost:8081/api/reparaciones/buscar/usuario/${encodeURIComponent(textoBusqueda)}`;
      break;

      case "fecha":
      const partes = textoBusqueda.includes("/") 
        ? textoBusqueda.split("/") 
        : textoBusqueda.split("-");

      if (partes.length === 3) {
        let [dia, mes, anio] = partes;

        if (textoBusqueda.includes("-")) {
        [dia, mes, anio] = partes;
        }

        if (
        !isNaN(dia) &&
        !isNaN(mes) &&
        !isNaN(anio) &&
        dia >= 1 &&
        dia <= 31 &&
        mes >= 1 &&
        mes <= 12
        ) {
        const fechaFormateada = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        url = `http://localhost:8081/api/reparaciones/buscar/fecha/${encodeURIComponent(fechaFormateada)}`;
        break;
        }
      }

      Swal.fire({
        icon: "warning",
        title: "Formato de fecha inválido",
        text: "Por favor, ingresa una fecha válida en formato DD/MM/AAAA o DD-MM-AAAA.",
      });
      return;

      default:
      Swal.fire({
        icon: "warning",
        title: "Opción no válida",
        text: "Por favor, selecciona un filtro de búsqueda.",
      });
      return;
    }
  
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 204) {
          resultTable.innerHTML = `<tr><td colspan="7" class="text-center">No se encontraron resultados</td></tr>`;
          Swal.fire({
            icon: "info",
            title: "Sin resultados",
            text: "No se encontraron reparaciones con el filtro seleccionado.",
          });
          return null;
        }
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data) return;
  
        resultTable.innerHTML = "";
  
        Swal.fire({
          icon: "success",
          title: "Reparaciones encontradas",
          text: `Se encontraron ${data.length} reparaciones.`,
        });
  
        data.forEach((reparacion) => {
          const row = `
            <tr data-reparacion='${JSON.stringify(reparacion)}'>
              <td><img src="../../images/perfilUsuario.jpg" width="25" class="me-2"> ${reparacion.contratista}</td>
              <td><img src="${reparacion.imagenUsuario || '../../images/perfilUsuario.jpg'}" width="50" class="me-2">
                    ${reparacion.nombreCompletoUsuario}</td>
              <td>${reparacion.descripcion}</td>
              <td>${reparacion.fecha}</td>
              <td>${reparacion.fechaFinalizacion}</td>
              <td>$${parseFloat(reparacion.costo).toFixed(2)}</td>
              <td>
                <button type="button" class="btn btn-warning btn-abrir-modal" data-bs-toggle="modal" data-bs-target="#modalActReparacion">
                  Actualizar
                </button>
              </td>
            </tr>
          `;
          resultTable.innerHTML += row;
        });
      })
      .catch((error) => {
        console.error("Error al buscar reparaciones:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al buscar reparaciones. Por favor, inténtalo de nuevo más tarde.",
        });
        resultTable.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Ocurrió un error al buscar</td></tr>`;
      });
  });
  
  // 🟡 Abrir modal con datos
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-abrir-modal")) {
      const tr = e.target.closest("tr");
      const reparacion = JSON.parse(tr.getAttribute("data-reparacion"));
      idReparacionGlobal = reparacion.idReparacion;
  
      document.getElementById("reparacionUsuario").value = reparacion.nombreCompletoUsuario || "";
      document.getElementById("descripcionReparacion").value = reparacion.descripcion || "";
      document.getElementById("contratista").value = reparacion.contratista || "";
      document.getElementById("fechaReparacion").value = reparacion.fecha || "";
      document.getElementById("fechaFin").value = reparacion.fechaFinalizacion || "";
      document.getElementById("costoReparacion").value = reparacion.costo || "";
    }
  });
  
  document.getElementById("btnActualizarReparacion").addEventListener("click", function (e) {
    e.preventDefault(); // Evita que la página se recargue
  
    const descripcion = document.getElementById("descripcionReparacion").value.trim();
    const contratista = document.getElementById("contratista").value.trim();
    const fecha = document.getElementById("fechaReparacion").value;
    const fechaFinalizacion = document.getElementById("fechaFin").value;
    const costo = parseFloat(document.getElementById("costoReparacion").value);
  
    // Validación de campos vacíos
    if (!descripcion || !contratista || !fecha || !fechaFinalizacion || isNaN(costo)) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, llena todos los campos correctamente.",
      });
      return;
    }
  
    const data = {
      idUsuario: localStorage.getItem("id"),
      descripcion,
      contratista,
      fecha,
      fechaFinalizacion,
      costo,
    };
    const token = localStorage.getItem("token");
  
    // Actualización de la reparación
    fetch(`http://localhost:8081/api/reparaciones/${idReparacionGlobal}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al actualizar la reparación');
        }
        return response.json();
      })
      .then((data) => {
        // Oculta el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("modalActReparacion"));
        modal.hide();
  
        // Mostrar mensaje de éxito
        Swal.fire({
          icon: "success",
          title: "Reparación actualizada",
          text: "La reparación se actualizó correctamente.",
        }).then(() => {
          // Recargar la tabla con los resultados actuales
          searchBtn.click();
        });
      })
      .catch((error) => {
        console.error("Error al actualizar la reparación:", error);
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: "Ocurrió un error al actualizar la reparación. Intenta de nuevo.",
        });
      });
  });
  
  

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "../modulo-login/page-login.html";
  });
});
