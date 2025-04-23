
    // 🔀 Mostrar u ocultar formularios
    const seleccionartipo = document.getElementById('selectPrincipal');
    const ingresoGral = document.getElementById('ingresoGral');
    const ingresoJuego = document.getElementById('ingresoJuego');

    ingresoGral.style.display = 'none';
    ingresoJuego.style.display = 'none';

    seleccionartipo.addEventListener('change', function () {
        const seleccion = seleccionartipo.value;
        ingresoGral.style.display = seleccion === 'ingGral' ? 'block' : 'none';
        ingresoJuego.style.display = seleccion === 'ingJue' ? 'block' : 'none';
    });


    // 🕹️ Formulario de ingreso de juegos
    const formAgregarJuego = document.getElementById('formAgregarIngresoJuego'); 
    const cancelBtnJuego = document.getElementById('cancelBtnJuego');  
    const selectJuego = document.getElementById("selectJuego");

    async function cargarMaquinas() {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8081/api/maquinas-juegos", {
                headers: {
                    "Authorization": `Bearer ${token}` 
                }
            });

            if (response.status === 204) {
                swalError("Sin máquinas", "No hay máquinas registradas.");
                return;
            }

            const maquinas = await response.json();

            // Asegúrate de que selectJuego exista en el DOM
            if (!selectJuego) {
                console.error("Elemento selectJuego no encontrado en el DOM.");
                return;
            }

            // Limpiar el select por si ya tiene opciones previas
            selectJuego.innerHTML = "";

            // Agregar opción inicial
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Seleccione una máquina";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            selectJuego.appendChild(defaultOption);

            // Agregar las máquinas al select
            maquinas.forEach(maquina => {
                if (maquina.nombre) { 
                    const option = document.createElement("option");
                    option.value = maquina.idMaquina;
                    option.textContent = maquina.nombre;
                    selectJuego.appendChild(option);
                }
            });

        } catch (error) {
            console.error("Error cargando máquinas:", error);
            swalError("Error", "No se pudieron cargar las máquinas.");
        }
    }
    selectJuego?.addEventListener("change", function () {
        const idMaquina = this.value;
        if (idMaquina) {
            sessionStorage.setItem("idMaquina", idMaquina);
        }
    });

    cancelBtnJuego?.addEventListener('click', function () {
        swalConfirm(formAgregarJuego);
    });

    formAgregarJuego?.addEventListener('submit', function (e) {
        e.preventDefault();
        let esValido = true;

        const campos = [
            'selectJuego', 'fechaInicioJuego', 'agregarMonto'
        ];

        campos.forEach(id => {
            const campo = document.getElementById(id);
            if (!validarCampo(campo)) esValido = false;
        });

        if (!esValido) {
            swalError('Campos incompletos', 'Completa los campos marcados en rojo.');
            return;
        }

        // Validar si se ha seleccionado una máquina
        const idMaquina = sessionStorage.getItem("idMaquina");
        if (!idMaquina) {
            swalError('Máquina no seleccionada', 'Por favor selecciona una máquina.');
            return;
        }

        const data = {
            idMaquina: idMaquina,
            fecha: document.getElementById("fechaInicioJuego").value, 
            totalIngresos: parseFloat(document.getElementById("agregarMonto").value), 
            idUsuario: parseInt(localStorage.getItem("id")) 
        };
        

        const token = localStorage.getItem("token");
        fetch("http://localhost:8081/api/ingresos-juegos/registrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                Swal.fire("Éxito", "Ingreso registrado correctamente.", "success");
                formAgregarJuego.reset();
                sessionStorage.clear();
            } else {
                throw new Error("Error al registrar el ingreso.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            swalError("Error", "No se pudo registrar el ingreso.");
        });
    });

    // Eliminar feedback al escribir
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', function () {
            this.classList.remove('is-invalid');
            const feedback = this.nextElementSibling;
            if (feedback) feedback.style.display = 'none';
        });
    });

    cargarMaquinas(); // Inicializa select de máquinas al cargar

    // Evento de cancelar la operación
    cancelBtnJuego?.addEventListener("click", function () {
        Swal.fire({
            title: "¿Cancelar?",
            text: "¿Estás seguro de cancelar la operación?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "Volver"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    title: "Operación cancelada",
                    text: "No se realizó ningún cambio.",
                });
                formAgregarJuego.reset();
                sessionStorage.clear();
                window.location.href = '../../view/modulo-inicio/dashboard-inicio.html';
            }
        });
    });

    // Función de validación de campos
    function validarCampo(campo) {
        if (!campo.value) {
            campo.classList.add('is-invalid');
            const feedback = campo.nextElementSibling;
            if (feedback) feedback.style.display = 'block';
            return false;
        } else {
            campo.classList.remove('is-invalid');
            const feedback = campo.nextElementSibling;
            if (feedback) feedback.style.display = 'none';
            return true;
        }
    }

