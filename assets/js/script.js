// ==============================
// MovieArcade - Global helpers
// ==============================
const MovieArcade = (() => {
  // ---------- Relative paths ----------
  const path = window.location.pathname;
  const isNested = path.includes('/pages/arcades/') || path.includes('/pages/movies/');
  const isPage = path.includes('/pages/') && !isNested;
  const prefix = isNested ? '../../' : isPage ? '../' : '';
  const dataPath = `${prefix}assets/data/movies.json`;

  // ---------- Global links ----------
  const links = {
    index: `${prefix}index.html`,
    home: `${prefix}pages/home.html`,
    arcades: `${prefix}pages/arcades.html`,
    movies: `${prefix}pages/movies.html`,
    about: `${prefix}pages/about.html`,
    quizzes: `${prefix}pages/arcades/quizzes.html`,
    roulette: `${prefix}pages/arcades/roulette.html`,
    versus: `${prefix}pages/arcades/versus.html`,
    lists: `${prefix}pages/movies/lists.html`,
    sorry: `${prefix}pages/sorry.html`
  };

  // ---------- Data helpers ----------
  async function getMovies() {
    const response = await fetch(dataPath);
    if (!response.ok) throw new Error('Não foi possível carregar a base de filmes.');
    return response.json();
  }

  function posterMarkup(movie) {
    if (movie.poster) {
      return `<img src="${movie.poster}" alt="Poster de ${movie.title}" loading="lazy">`;
    }
    return `<span>${movie.title}</span>`;
  }

  function filterMovies(movies, term) {
    const query = term.trim().toLowerCase();
    if (!query) return movies;

    return movies.filter((movie) => {
      const searchable = [
        movie.title,
        movie.director,
        movie.year,
        movie.synopsis,
        ...(movie.actors || []),
        ...(movie.genres || [])
      ].join(' ').toLowerCase();

      return searchable.includes(query);
    });
  }

  function shuffle(list) {
    return [...list].sort(() => Math.random() - 0.5);
  }

  function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  // ---------- Header interactions ----------
  function setupMenu(activePage = '') {
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-nav-links]');

    if (toggle && menu) {
      toggle.addEventListener('click', () => menu.classList.toggle('open'));
    }

    document.querySelectorAll('[data-link]').forEach((item) => {
      const key = item.dataset.link;

      if (links[key]) {
        item.href = links[key];
      }

      if (key === activePage) {
        item.classList.add('active');
      }
    });
  }

  return { prefix, dataPath, links, getMovies, posterMarkup, filterMovies, shuffle, pickRandom, setupMenu };
})();

document.addEventListener('DOMContentLoaded', () => {
  MovieArcade.setupMenu(document.body.dataset.page || '');
});
