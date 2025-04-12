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