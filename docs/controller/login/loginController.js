// =================== INICIO DOM ===================
document.addEventListener("DOMContentLoaded", function () {
  // Variables principales
  const container = document.getElementById("container");
  const registerBtn = document.getElementById("register");
  const loginBtn = document.getElementById("login");
  const resetForm = document.getElementById("resetForm");
  const loginForm = document.getElementById("loginForm");

  // ========== Cambio entre login y registro ==========
  if (registerBtn && loginBtn && container) {
    registerBtn.addEventListener("click", () => container.classList.add("active"));
    loginBtn.addEventListener("click", () => container.classList.remove("active"));
  }

  // ========== Login ==========
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (email === "" || password === "") {
      Swal.fire({ icon: "error", title: "Campos vacíos", text: "Por favor, completa todos los campos." });
      return;
    }

    if (password.length < 10) {
      Swal.fire({ icon: "warning", title: "Contraseña corta", text: "Debe tener al menos 10 caracteres." });
      return;
    }

    try {
      // Mostrar mensaje de carga
      Swal.fire({
        title: 'Iniciando sesión...',
        html: 'Por favor espera',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      // Cerrar loading
      Swal.close();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.idUsuario);
        localStorage.setItem("rol", data.role);
        localStorage.setItem("estado", data.estado);

        const estadoUsuario = (data.estado || "").toLowerCase();

        if (estadoUsuario === "inactivo") {
          Swal.fire({
            icon: "error",
            title: "Usuario inactivo",
            text: "Ya no eres un usuario válido en el sistema."
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Inicio exitoso",
            text: "Redirigiendo...",
            timer: 3000,
            showConfirmButton: false
          });

          setTimeout(() => {
            window.location.href = "../modulo-inicio/dashboard-inicio.html";
          }, 3200);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Credenciales incorrectas"
        });
      }
    } catch (error) {
      Swal.close(); // En caso de error también cerrar loading
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor"
      });
      console.error("Error en login:", error);
    }
  });
}


  // ========== Recuperar contraseña ==========
  if (resetForm) {
    resetForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();

      if (!email) {
        Swal.fire("Error", "El correo electrónico es obligatorio", "error");
        return;
      }

      // Mostrar alerta de carga
      const loadingAlert = Swal.fire({
        title: "Enviando Token de Recuperación",
        text: "Por favor, espera un momento...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await fetch("http://localhost:8081/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.text(); // Cambiar a .text() para texto plano

        Swal.close(); // Cerrar alerta de carga

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: data || "Correo de recuperación enviado",
            timer: 3000,
            showConfirmButton: false
          });

          setTimeout(() => {
            window.location.href = "../../view/modulo-login/recuperar-contrasena.html";
          }, 3200);

          document.getElementById("email").value = ""; // Limpiar campo tras éxito
        } else {
          Swal.fire("Error", data || "Hubo un problema con la recuperación", "error");
        }
      } catch (error) {
        Swal.close(); // Cerrar alerta de carga en caso de error
        Swal.fire("Error", "No se pudo conectar con el servidor", "error");
        console.error("Error en recuperación:", error);
      }
    });
  }
});
