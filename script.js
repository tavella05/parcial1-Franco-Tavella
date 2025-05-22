const API_URL = 'https://api.spacexdata.com/v4/launches/past';
let lanzamientosGuardados = [];

fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        lanzamientosGuardados = data
            .sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc))
            .slice(0, 50);
        aplicarFiltros();
    })
    .catch(error => console.error('Error al obtener datos de SpaceX:', error));

// Mostrar lanzamientos en el contenedor
function mostrarLanzamientos(lanzamientos) {
    const contenedor = document.getElementById('contenedor-lanzamientos');
    contenedor.innerHTML = ''; // Limpiar resultados anteriores

    if (lanzamientos.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron lanzamientos.</p>';
        return;
    }

    lanzamientos.forEach(lanzamiento => {
        const div = document.createElement('div');
        div.className = 'lanzamiento';

        const fecha = new Date(lanzamiento.date_utc).toLocaleDateString();

        div.innerHTML = `
            <h2>${lanzamiento.name}</h2>
            <p><strong>Fecha:</strong> ${fecha}</p>
            <p class="estado ${lanzamiento.success ? '' : 'fallo'}">
                ${lanzamiento.success ? '✅ Éxito' : '❌ Fallo'}
            </p>
            ${lanzamiento.links.webcast ? `<p><a href="${lanzamiento.links.webcast}" target="_blank">Ver video</a></p>` : ''}
        `;

        contenedor.appendChild(div);
    });
}

// Función para aplicar todos los filtros
function aplicarFiltros() {
    const textoBusqueda = document.getElementById('busqueda').value.toLowerCase();
    const filtroEstado = document.getElementById('filtroEstado').value;

    let filtrados = lanzamientosGuardados;

    // Filtro por nombre
    if (textoBusqueda) {
        filtrados = filtrados.filter(lanzamiento =>
            lanzamiento.name.toLowerCase().includes(textoBusqueda)
        );
    }

    // Filtro por estado (éxito o fallo)
    if (filtroEstado === 'exito') {
        filtrados = filtrados.filter(l => l.success === true);
    } else if (filtroEstado === 'fallo') {
        filtrados = filtrados.filter(l => l.success === false);
    }

    mostrarLanzamientos(filtrados);
}

// Listeners para filtros
document.getElementById('busqueda').addEventListener('input', aplicarFiltros);
document.getElementById('filtroEstado').addEventListener('change', aplicarFiltros);
