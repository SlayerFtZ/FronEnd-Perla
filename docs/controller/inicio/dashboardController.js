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


    //conexion con el card de total de socios 

    document.addEventListener("DOMContentLoaded", function () {
        const token = localStorage.getItem("token");
    
        fetch("http://localhost:8081/api/dashboard/usuarios/por-rol", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(data => {
            const socioData = data.find(item => item.rol === "Socio");
            const socioTotal = socioData ? socioData.cantidad : 0;
            document.getElementById("total-socios").textContent = socioTotal;
    
            const adminData = data.find(item => item.rol === "Administrador");
            const adminTotal = adminData ? adminData.cantidad : 0;
            document.getElementById("total-administradores").textContent = adminTotal;

            const empleadoData = data.find(item => item.rol === "Empleado");
            const empleadoTotal = empleadoData ? empleadoData.cantidad : 0;
            document.getElementById("total-empleado").textContent = empleadoTotal;
        })
        .catch(error => {
            console.error("Error al obtener los datos de roles:", error);
            document.getElementById("total-socios").textContent = "Error";
            document.getElementById("total-administradores").textContent = "Error";
        });
    });
    
    document.addEventListener("DOMContentLoaded", function () {
      const fecha = new Date();
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1;
    
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    
      const fetchJuegos = fetch(`http://localhost:8081/api/dashboard/ingresos/juegos?year=${year}&month=${month}`, { method: 'GET', headers })
        .then(response => {
          if (!response.ok) throw new Error('Error al obtener juegos');
          return response.json();
        });
    
      const fetchRentas = fetch(`http://localhost:8081/api/dashboard/ingresos/rentas?year=${year}&month=${month}`, { method: 'GET', headers })
        .then(response => {
          if (!response.ok) throw new Error('Error al obtener rentas');
          return response.json();
        });
    
      Promise.all([fetchJuegos, fetchRentas])
        .then(([dataJuegos, dataRentas]) => {
          const totalJuegos = dataJuegos.totalPagosJuego || 0;
          const totalRentas = dataRentas.totalPagosRenta || 0;
          const totalExtras = 1000; // si deseas que también sea dinámico, se puede agregar otro fetch
    
          // Actualizar widgets visuales
          const juegosElement = document.querySelector('.widget-small.warning .info p b');
          if (juegosElement) juegosElement.textContent = `$${totalJuegos.toLocaleString('es-MX')}`;
    
          const rentaElement = document.querySelector('.widget-small.info .info p b');
          if (rentaElement) rentaElement.textContent = `$${totalRentas.toLocaleString('es-MX')}`;
    
          // Actualizar gráfica de pastel
          const supportChartElement = document.getElementById("supportRequestChart");
          const supportChart = echarts.init(supportChartElement, null, { renderer: 'svg' });
    
          const updatedSupportRequests = {
            tooltip: {
              trigger: 'item',
              formatter: "<b>{b}:</b> ${c}"
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: 'Support Requests',
                type: 'pie',
                radius: '75%',
                data: [
                  { value: totalJuegos, name: 'Juegos' },
                  { value: totalRentas, name: 'Rentas' },
                  { value: totalExtras, name: 'Pagos extras' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
    
          supportChart.setOption(updatedSupportRequests);
          new ResizeObserver(() => supportChart.resize()).observe(supportChartElement);
        })
        .catch(error => {
          console.error('Error al cargar datos del dashboard:', error);
    
          const juegosElement = document.querySelector('.widget-small.warning .info p b');
          if (juegosElement) juegosElement.textContent = 'Error al cargar';
    
          const rentaElement = document.querySelector('.widget-small.info .info p b');
          if (rentaElement) rentaElement.textContent = 'Error al cargar';
        });
    });
    
    
    
     // total de ingresos
    document.addEventListener("DOMContentLoaded", function () {
      const fecha = new Date();
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1;
    
      const url = `http://localhost:8081/api/dashboard/ingresos/combinados?year=${year}&month=${month}`;
    
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        const totalCombinado = data.totalCombinado || 0;
        const ingresosElement = document.querySelector('#totalIngresos .info p b');
        if (ingresosElement) {
          ingresosElement.textContent = `$${totalCombinado.toLocaleString('es-MX')}`;
        }
      })
      .catch(error => {
        console.error('Error al obtener los ingresos combinados:', error);
        const ingresosElement = document.querySelector('#totalIngresos .info p b');
        if (ingresosElement) {
          ingresosElement.textContent = 'Error al cargar';
        }
      });
    });
    
    //total reparaciones
    document.addEventListener("DOMContentLoaded", function () {
      const fecha = new Date();
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1;
    
      const url = `http://localhost:8081/api/dashboard/reparaciones/costo?year=${year}&month=${month}`;
    
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        const totalCosto = data.totalCosto || 0;
        const ingresosElement = document.querySelector('#totalReparaciones .info p b');
        if (ingresosElement) {
          ingresosElement.textContent = `$${totalCosto.toLocaleString('es-MX')}`;
        }
      })
      .catch(error => {
        console.error('Error al obtener los ingresos combinados:', error);
        const ingresosElement = document.querySelector('#totalReparaciones .info p b');
        if (ingresosElement) {
          ingresosElement.textContent = 'Error al cargar';
        }
      });
    });

    //total  de egresos
    document.addEventListener("DOMContentLoaded", function () {
      const fecha = new Date();
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1;
    
      const url = `http://localhost:8081/api/dashboard/egresos?year=${year}&month=${month}`;
    
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        const totalEgresos = data.totalEgresos || 0;
        const ingresosElement = document.querySelector('#totalEgresos .info p b');
        if (ingresosElement) {
          ingresosElement.textContent = `$${totalEgresos.toLocaleString('es-MX')}`;
        }
      })
      .catch(error => {
        console.error('Error al obtener los ingresos combinados:', error);
        const ingresosElement = document.querySelector('#totalEgresos .info p b');
        if (ingresosElement) {
          ingresosElement.textContent = 'Error al cargar';
        }
      });
    });


    
        const salesData = {
            xAxis: {
            type: 'category',
            data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            },
            yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '${value}'
            }
            },
            series: [
            {
                data: [1200, 1500, 1800, 1300, 1700, 2000, 1900, 2200, 2500, 2700, 3000, 2000],
                type: 'bar',
                itemStyle: {
                color: function (params) {
                    const colors = ['#ff9e80', '#a3ffb0', '#a3b8ff', '#ff99d5', '#d8a3ff', '#a3fff9', '#fbff99', '#ffbf80', '#c5ff99', '#99c5ff', '#ff99bf', '#99ffd8'];
    
                    return colors[params.dataIndex];
                }
                }
            }
            ],
            tooltip: {
            trigger: 'axis',
            formatter: "<b>{b0}:</b> ${c0}"
            }
        }
    
        const supportRequests = {
            tooltip: {
            trigger: 'item',
            formatter: "<b>{b}:</b> ${c}"
            },
            legend: {
            orient: 'vertical',
            left: 'left'
            },
            series: [
            {
                name: 'Support Requests',
                type: 'pie',
                radius: '75%',
                data: [
                { value: 4800, name: 'Juegos' },
                { value: 5000, name: 'Rentas' },
                { value: 1000, name: 'Extras' }
                ],
                emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
                }
            }
            ]
        };
    
    
        const salesChartElement = document.getElementById('salesChart');
        const salesChart = echarts.init(salesChartElement, null, { renderer: 'svg' });
        salesChart.setOption(salesData);
        new ResizeObserver(() => salesChart.resize()).observe(salesChartElement);
    
        const supportChartElement = document.getElementById("supportRequestChart");
        const supportChart = echarts.init(supportChartElement, null, { renderer: 'svg' });
        supportChart.setOption(supportRequests);
        new ResizeObserver(() => supportChart.resize()).observe(supportChartElement);




    document.addEventListener("DOMContentLoaded", function () {
        var egresosChart = echarts.init(document.getElementById("egresosAnual"));
        var egresosOption = {
  
          tooltip: { trigger: "axis" },
          xAxis: {
            type: "category",
            data: ["Enero", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
          },
          yAxis: { type: "value" },
          series: [
            {
              name: "Egresos",
              type: "bar",
              data: [1200, 1500, 1800, 1300, 1600, 1700, 2000, 2200, 2100, 1900, 1800, 2500],
              itemStyle: { color: "#ff5733" }
            }
          ]
        };
  
        egresosChart.setOption(egresosOption);
  
        var mantenimientoChart = echarts.init(document.getElementById("gastosMantenimiento"));
        var mantenimientoOption = {
          tooltip: { trigger: "axis" },
          legend: { data: ['Reparaciones', 'Servicios', 'Materiales', 'Otros'], left: 'left' },
          xAxis: {
            type: 'category',
            data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
          },
          yAxis: { type: 'value' },
          series: [
            {
              name: 'Reparaciones',
              type: 'line',
              data: [300, 400, 500, 450, 600, 650, 700, 750, 800, 850, 900, 950],
              smooth: true, // Línea suave
              color: '#ff5733'
            },
            {
              name: 'Servicios',
              type: 'line',
              data: [200, 250, 300, 350, 400, 420, 440, 480, 510, 550, 580, 600],
              smooth: true,
              color: '#33ff57'
            },
            {
              name: 'Materiales',
              type: 'line',
              data: [150, 200, 220, 250, 280, 300, 320, 340, 360, 380, 400, 420],
              smooth: true,
              color: '#3357ff'
            },
            {
              name: 'Otros',
              type: 'line',
              data: [100, 120, 150, 180, 200, 210, 230, 250, 270, 290, 310, 330],
              smooth: true,
              color: '#FF00C8FF'
            }
          ]
        };
        mantenimientoChart.setOption(mantenimientoOption);
      });




    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.clear();  // Limpia todo el localStorage
        sessionStorage.clear(); // Limpia todo el sessionStorage
        window.location.href = "../modulo-login/page-login.html"; // Redirige al login
    });

