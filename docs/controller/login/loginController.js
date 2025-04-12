document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");
  const registerBtn = document.getElementById("register");
  const loginBtn = document.getElementById("login");
  const resetForm = document.getElementById("resetForm");
  const loginForm = document.getElementById("loginForm");

  if (registerBtn && loginBtn && container) {
    registerBtn.addEventListener("click", () => container.classList.add("active"));
    loginBtn.addEventListener("click", () => container.classList.remove("active"));
  }

  // **Login**
 // **Login**
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
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.idUsuario);
        localStorage.setItem("rol", data.role);

        Swal.fire({ icon: "success", title: "Inicio exitoso", text: "Redirigiendo...", timer: 3000, showConfirmButton: false });

        setTimeout(() => { window.location.href = "../modulo-inicio/dashboard-inicio.html"; }, 3200);
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.message || "Credenciales incorrectas" });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error de conexión", text: "No se pudo conectar con el servidor" });
    }
  });
}
});


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("resetForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita la recarga de la página

    const email = document.getElementById("email").value;

    if (!email) {
      Swal.fire("Error", "El correo electrónico es obligatorio", "error");
      return;
    }

    try {
      const response = await fetch("https://tu-api.com/api/recuperar-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Éxito", data.message || "Correo de recuperación enviado", "success");
      } else {
        Swal.fire("Error", data.error || "Hubo un problema con la recuperación", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
      console.error("Error en la API:", error);
    }
  });
});
