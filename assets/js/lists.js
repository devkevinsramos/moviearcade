// ==============================
// MovieArcade - Curated lists
// ==============================
document.addEventListener('DOMContentLoaded', async () => {
  const grids = document.querySelectorAll('[data-lists-grid]');
  if (!grids.length) return;

  const movies = await MovieArcadeAPI.getMovies();

  // ---------- List definitions ----------
  const lists = [
    {
      title: 'Dramas essenciais',
      description: 'Histórias marcadas por conflitos humanos, memória, escolhas e impacto emocional.',
      filter: (movie) => movie.genres.includes('Drama')
    },
    {
      title: 'Crime, máfia e investigação',
      description: 'Filmes sobre poder, violência, investigação, corrupção e personagens no limite.',
      filter: (movie) => movie.genres.includes('Crime') || movie.genres.includes('Mistério')
    },
    {
      title: 'Ficção científica',
      description: 'Tempo, espaço, inteligência artificial, futuros distópicos e grandes ideias.',
      filter: (movie) => movie.genres.includes('Ficção científica')
    },
    {
      title: 'Terror e suspense',
      description: 'Obras de tensão, medo, paranoia, slasher, sobrenatural e horror psicológico.',
      filter: (movie) => movie.genres.includes('Terror') || movie.genres.includes('Suspense')
    },
    {
      title: 'Aventura e fantasia',
      description: 'Grandes jornadas, mundos fantásticos, descobertas e histórias de escala épica.',
      filter: (movie) => movie.genres.includes('Aventura') || movie.genres.includes('Fantasia')
    },
    {
      title: 'Comédias e filmes leves',
      description: 'Filmes com humor, energia pop, leveza e personagens marcantes.',
      filter: (movie) => movie.genres.includes('Comédia')
    },
    {
      title: 'Ação e cultura pop',
      description: 'Filmes conhecidos pelo impacto visual, cenas memoráveis e presença na cultura popular.',
      filter: (movie) => movie.genres.includes('Ação')
    },
    {
      title: 'Animações',
      description: 'Histórias animadas com força visual, aventura e grande alcance cultural.',
      filter: (movie) => movie.genres.includes('Animação')
    }
  ];

  // ---------- Card template ----------
  function createListCard(list) {
    const items = movies.filter(list.filter).slice(0, 10);

    return `
      <article class="card list-card">
        <h3>${list.title}</h3>
        <p>${list.description}</p>

        <ul class="movie-list">
          ${items.map((movie) => `
            <li>
              <span>${movie.title}</span>
              <small>${movie.year}</small>
            </li>
          `).join('')}
        </ul>
      </article>
    `;
  }

  grids.forEach((grid) => {
    const limit = Number(grid.dataset.listsLimit || lists.length);
    grid.innerHTML = lists.slice(0, limit).map(createListCard).join('');
  });
});
