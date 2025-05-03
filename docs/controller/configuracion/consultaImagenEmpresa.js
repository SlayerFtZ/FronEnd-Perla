window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("token"); 

    fetch('http://localhost:8081/api/archivos/empresa', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        console.log('Respuesta completa:', response);
        if (!response.ok) {
            throw new Error('Error al obtener la imagen');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data); 
        const imageUrl = data.url;
        const imgElement = document.getElementById('companyLogo');

        if (imgElement) {
            imgElement.classList.add('responsive-logo');

            if (imageUrl) {
                imgElement.src = imageUrl;
            } else {
                imgElement.src = '../../images/logo-la perla.png';
            }

            imgElement.onerror = function () {
                this.onerror = null;
                this.src = '../../images/logo-la perla.png';
            };
        } else {
            console.warn("Elemento con id 'companyLogo' no encontrado.");
        }
    })
    .catch(error => {
        console.error('Error al cargar la imagen:', error);
        const imgElement = document.getElementById('companyLogo');
        if (imgElement) {
            imgElement.classList.add('responsive-logo');
            imgElement.src = '../../images/logo-la perla.png';
        }
    });
});