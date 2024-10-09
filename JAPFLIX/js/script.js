document.addEventListener('DOMContentLoaded', () => {
  console.log('Script cargado correctamente'); // Verifica que el script se está cargando

  let peliculas = [];

  // Realiza la solicitud fetch al cargar la página
  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
      peliculas = data; // Almacena los datos en la variable peliculas
      console.log('Datos de películas cargados:', peliculas); // Verifica que los datos se carguen correctamente

      const btnBuscar = document.getElementById('btnBuscar');
      const inputBuscar = document.getElementById('inputBuscar');
      const lista = document.getElementById('lista');
      const contenedorPelicula = document.getElementById('peliculaSeleccionada');
      const tituloPelicula = document.getElementById('tituloPelicula');
      const descripcionPelicula = document.getElementById('descripcionPelicula');
      const generosPelicula = document.getElementById('generosPelicula');

      btnBuscar.addEventListener('click', () => {
        const query = inputBuscar.value.toLowerCase();
        lista.innerHTML = ''; // Limpia la lista antes de mostrar los resultados

        if (query) {
          const resultados = peliculas.filter(pelicula => 
            pelicula.title.toLowerCase().includes(query) ||
            pelicula.genres.some(genero => typeof genero === 'string' && genero.toLowerCase().includes(query)) ||
            (pelicula.tagline && pelicula.tagline.toLowerCase().includes(query)) ||
            (pelicula.overview && pelicula.overview.toLowerCase().includes(query))
          );

          console.log('Resultados de búsqueda:', resultados); // Verifica los resultados de la búsqueda

          resultados.forEach(pelicula => {
            const item = document.createElement('li');
            item.classList.add('list-group-item', 'bg-dark', 'text-white');
            item.innerHTML = `
              <h5>${pelicula.title}</h5>
              <p>${pelicula.tagline || ''}</p>
              <p>${Estrellas(pelicula.vote_average)}</p>
            `;
            item.addEventListener('click', () => mostrarDetallesPelicula(pelicula));
            lista.appendChild(item);
          });
        }
      });

      function Estrellas(vote) {
        const stars = Math.round(vote / 2); // Convierte la calificación a un rango de 0 a 5
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
      }

      function mostrarDetallesPelicula(pelicula) {
        console.log('Detalles de la película seleccionada:', pelicula); // Verifica los detalles de la película seleccionada
        tituloPelicula.textContent = pelicula.title;
        descripcionPelicula.textContent = pelicula.overview;
        generosPelicula.innerHTML = '';
        pelicula.genres.forEach(genero => {
          const button = document.createElement('button');
          button.classList.add('btn', 'btn-secondary', 'm-1');
          button.textContent = typeof genero === 'string' ? genero : genero.name;
          generosPelicula.appendChild(button);
        });

        detallesAdicionales.innerHTML = `
          <button class="btn btn-info" type="button" data-bs-toggle="collapse" data-bs-target="#detallesCollapse" aria-expanded="false" aria-controls="detallesCollapse">
            Más detalles
          </button>
          <div class="collapse mt-2" id="detallesCollapse">
            <div class="card card-body bg-dark text-white">
              <p><strong>Año de lanzamiento:</strong> ${new Date(pelicula.release_date).getFullYear()}</p>
              <p><strong>Duración:</strong> ${pelicula.runtime} minutos</p>
              <p><strong>Presupuesto:</strong> $${pelicula.budget.toLocaleString()}</p>
              <p><strong>Ganancias:</strong> $${pelicula.revenue.toLocaleString()}</p>
            </div>
          </div>
        `;
        
        contenedorPelicula.style.display = 'block';
      }
    })
    .catch(error => console.error('Error al obtener los datos:', error));
});
