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

      fetch(`http://localhost:8081/api/dashboard/ingresos?year=${year}&month=${month}`, {
        method: 'GET',
        headers
      })
        .then(response => {
          if (!response.ok) throw new Error('Error al obtener ingresos');
          return response.json();
        })
        .then(data => {
          const totalJuegos = data.totalJuego || 0;
          const totalRentas = data.totalRenta || 0;
          const totalExtras = data.totalExtras || 0;

          // Calcular la suma total
          const sumaTotal = totalJuegos + totalRentas + totalExtras;

          // Actualizar widgets visuales
          const juegosElement = document.querySelector('.widget-small.warning .info p b');
          if (juegosElement) juegosElement.textContent = `$${totalJuegos.toLocaleString('es-MX')}`;

          const rentaElement = document.querySelector('.widget-small.info .info p b');
          if (rentaElement) rentaElement.textContent = `$${totalRentas.toLocaleString('es-MX')}`;

          // Mostrar la suma total en el componente con id "graficatotal"
          const graficatotalElement = document.getElementById('graficatotal');
          if (graficatotalElement) {
            graficatotalElement.textContent = `Total: $${sumaTotal.toLocaleString('es-MX')}`;
          }

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

          const graficatotalElement = document.getElementById('graficatotal');
          if (graficatotalElement) {
            graficatotalElement.textContent = 'Error al cargar';
          }
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


    async function fetchSalesDataAndRenderChart() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');

      const url = `http://localhost:8081/api/dashboard/ingresos/anuales?year=${year}&month=${month}`;

      const token = localStorage.getItem('token');

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        const monthlyTotals = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ].map(mes => {
          const item = data.find(d => d.mes.toLowerCase() === mes);
          return item ? item.total : 0;
        });

        // Calculate the total sum of all months
        const totalSum = monthlyTotals.reduce((sum, value) => sum + value, 0);

        // Update the card with the total sum
        const totalSumElement = document.getElementById('totalSumCard');
        if (totalSumElement) {
          totalSumElement.textContent = `$${totalSum.toLocaleString('es-MX')}`;
        }

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
              data: monthlyTotals,
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
        };

        const salesChartElement = document.getElementById('salesChart');
        const salesChart = echarts.init(salesChartElement, null, { renderer: 'svg' });
        salesChart.setOption(salesData);
        new ResizeObserver(() => salesChart.resize()).observe(salesChartElement);

      } catch (error) {
        console.error('Error al cargar los datos del gráfico:', error);
      }
    }

    fetchSalesDataAndRenderChart();



    document.addEventListener("DOMContentLoaded", function () {
      // Gráfica de egresos
      var egresosChart = echarts.init(document.getElementById("egresosAnual"));
  
      async function fetchEgresosData() {
          const url = 'http://localhost:8081/api/dashboard/egresos/anuales?year=2025&month=01';
          const token = localStorage.getItem('token');
  
          try {
              const response = await fetch(url, {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                  }
              });
  
              const data = await response.json();
  
              const egresosData = [
                  "enero", "febrero", "marzo", "abril", "mayo", "junio", 
                  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
              ].map(mes => {
                  const item = data.find(d => d.mes.toLowerCase() === mes);
                  return item ? item.total : 0;
              });
  
              const totalEgresos = egresosData.reduce((sum, value) => sum + value, 0);
  
              const totalGraficaEgresosElement = document.getElementById('totalGraficaEgresos');
              if (totalGraficaEgresosElement) {
                  totalGraficaEgresosElement.textContent = `$${totalEgresos.toLocaleString('es-MX')}`;
              }
  
              const egresosOption = {
                  tooltip: { trigger: "axis" },
                  xAxis: {
                      type: "category",
                      data: ["Enero", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
                  },
                  yAxis: { type: "value" },
                  series: [{
                      name: "Egresos",
                      type: "bar",
                      data: egresosData,
                      itemStyle: { color: "#ff5733" }
                  }]
              };
  
              egresosChart.setOption(egresosOption);
  
          } catch (error) {
              console.error('Error al cargar los datos de egresos:', error);
          }
      }
  
      fetchEgresosData(); // ✅ ya hace el setOption
  
      
        const token = localStorage.getItem('token');
        const meses = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
      
        // Obtener año y mes actuales del sistema
        const fechaActual = new Date();
        const year = fechaActual.getFullYear();
        const month = String(fechaActual.getMonth() + 1).padStart(2, '0'); // mes comienza desde 0
      
        const ingresosUrl = `http://localhost:8081/api/dashboard/ingresos/anuales?year=${year}&month=${month}`;
        const egresosUrl = `http://localhost:8081/api/dashboard/egresos/anuales?year=${year}&month=${month}`;
      
        const headers = {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        };
      
        Promise.all([
          fetch(egresosUrl, { headers }).then(res => res.json()),
          fetch(ingresosUrl, { headers }).then(res => res.json())
        ])
        .then(([egresosData, ingresosData]) => {
          const egresosTotales = meses.map(mes => {
            const item = egresosData.find(d => d.mes.toLowerCase() === mes);
            return item ? item.total : 0;
          });
      
          const ingresosTotales = meses.map(mes => {
            const item = ingresosData.find(d => d.mes.toLowerCase() === mes);
            return item ? item.total : 0;
          });
      
          const totalIngresos = ingresosTotales.reduce((acc, val) => acc + val, 0);
          const totalEgresos = egresosTotales.reduce((acc, val) => acc + val, 0);
          const resultado = totalIngresos - totalEgresos;
      
          document.getElementById('totalIngreso').textContent = `Ingresos: $${totalIngresos.toLocaleString()}`;
          document.getElementById('totalEgreso').textContent = `Egresos: $${totalEgresos.toLocaleString()}`;
          document.getElementById('total').textContent = `Resultado: $${resultado.toLocaleString()}`;
      
          const chart = echarts.init(document.getElementById("estadoResultados"));
          const options = {
            tooltip: { trigger: "axis" },
            legend: { data: ['Ingresos', 'Egresos'], left: 'left' },
            xAxis: {
              type: 'category',
              data: meses.map(m => m.charAt(0).toUpperCase() + m.slice(1))
            },
            yAxis: { type: 'value' },
            series: [
              {
                name: 'Egresos',
                type: 'line',
                data: egresosTotales,
                smooth: true,
                color: '#ff5733'
              },
              {
                name: 'Ingresos',
                type: 'line',
                data: ingresosTotales,
                smooth: true,
                color: '#33ff57'
              },
            ]
          };
      
          chart.setOption(options);
        })
        .catch(error => {
          console.error("Error al cargar los datos:", error);
        });
      });
      


    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.clear();  // Limpia todo el localStorage
        sessionStorage.clear(); // Limpia todo el sessionStorage
        window.location.href = "../modulo-login/page-login.html"; // Redirige al login
    });

