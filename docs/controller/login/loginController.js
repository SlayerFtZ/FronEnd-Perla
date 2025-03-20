document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");
    const resetForm = document.getElementById("resetForm");
    const loginForm = document.getElementById("loginForm");

    registerBtn.addEventListener("click", () => container.classList.add("active"));
    loginBtn.addEventListener("click", () => container.classList.remove("active"));

    // Validación del formulario de recuperación de contraseña
    resetForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value.trim();

      if (email === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor, ingresa tu correo electrónico.",
          confirmButtonColor: "#d33"
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "¡Correo enviado!",
        text: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        confirmButtonColor: "#3085d6",
        timer: 3000,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = "recuperar-contrasena.html";
      }, 3200);
    });

    // Validación del formulario de inicio de sesión
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (email === "" || password === "") {
        Swal.fire({
          icon: "error",
          title: "Campos vacíos",
          text: "Por favor, completa todos los campos.",
          confirmButtonColor: "#d33"
        });
        return;
      }

      if (password.length < 6) {
        Swal.fire({
          icon: "warning",
          title: "Contraseña débil",
          text: "La contraseña debe tener al menos 6 caracteres.",
          confirmButtonColor: "#ff9800"
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Redirigiendo...",
        timer: 3000,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = "../modulo-inicio/dashboard-inicio.html";
      }, 3200);
    });
  });