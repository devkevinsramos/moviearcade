// ==============================
// MovieArcade - Movies rendering
// ==============================
document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('[data-movies-grid]');
  const search = document.querySelector('[data-movie-search]');
  const count = document.querySelector('[data-movie-count]');
  const loadMoreButton = document.querySelector('[data-load-more-movies]');

  if (!grid) return;

  // ---------- State ----------
  const fixedLimit = Number(grid.dataset.limit || 0);
  const pageSize = Number(grid.dataset.pageSize || 20);
  const featuredIds = (grid.dataset.featuredIds || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  let visibleCount = fixedLimit || pageSize;
  let allMovies = [];
  let currentList = [];

  // ---------- Text helper ----------
  function limitText(text, maxLength = 260) {
    if (!text || text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}...`;
  }

  // ---------- Card template ----------
  function createMovieCard(movie) {
    return `
      <article class="card movie-card reveal">
        <div class="movie-card-top">
          <div class="poster movie-poster">${MovieArcade.posterMarkup(movie)}</div>

          <div class="movie-info">
            <h3>${movie.title}</h3>
            <div class="movie-meta">${movie.year} • ${movie.runtime}min • Nota ${movie.rating}</div>
            <p><strong>Diretor:</strong> ${movie.director}</p>
            <p><strong>Atores principais:</strong> ${(movie.actors || []).join(', ')}</p>
            <p><strong>Gênero:</strong> ${(movie.genres || []).join(', ')}</p>
          </div>
        </div>

        <p class="movie-synopsis">${limitText(movie.synopsis)}</p>
      </article>
    `;
  }

  // ---------- Render ----------
  function render(list) {
    currentList = list;
    const finalList = list.slice(0, visibleCount);

    grid.innerHTML = finalList.length
      ? finalList.map(createMovieCard).join('')
      : '<div class="empty">Nenhum filme foi encontrado.</div>';

    if (count) {
      count.textContent = fixedLimit
        ? `${Math.min(fixedLimit, list.length)} de ${list.length} filmes`
        : `${Math.min(visibleCount, list.length)} de ${list.length} filmes`;
    }

    if (loadMoreButton) {
      loadMoreButton.hidden = Boolean(fixedLimit) || visibleCount >= list.length;
    }
  }

  // ---------- Events ----------
  search?.addEventListener('input', () => {
    visibleCount = fixedLimit || pageSize;
    render(MovieArcade.filterMovies(allMovies, search.value));
  });

  loadMoreButton?.addEventListener('click', () => {
    visibleCount += pageSize;
    render(currentList);
  });

  // ---------- Init ----------
  try {
    allMovies = await MovieArcadeAPI.getMovies();

    if (featuredIds.length) {
      const featuredMovies = featuredIds
        .map((id) => allMovies.find((movie) => movie.id === id))
        .filter(Boolean);

      render(featuredMovies);
      return;
    }

    render(allMovies);
  } catch (error) {
    grid.innerHTML = `<div class="empty">${error.message}</div>`;
  }
});
