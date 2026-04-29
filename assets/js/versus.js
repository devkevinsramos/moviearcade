// ==============================
// MovieArcade - Versus
// ==============================
document.addEventListener('DOMContentLoaded', async () => {
  const search = document.querySelector('[data-movie-search]');
  const poolGrid = document.querySelector('[data-pool-grid]');
  const selectedGrid = document.querySelector('[data-selected-grid]');
  const loadMoreButton = document.querySelector('[data-load-more-pool]');
  const arena = document.querySelector('[data-versus-arena]');
  const randomButton = document.querySelector('[data-random-versus]');
  const startButton = document.querySelector('[data-start-versus]');
  const clearButton = document.querySelector('[data-clear-versus]');
  const status = document.querySelector('[data-versus-status]');

  if (!poolGrid || !arena) return;

  // ---------- State ----------
  const movies = await MovieArcadeAPI.getMovies();
  const pageSize = 20;
  let selected = MovieArcade.shuffle(movies).slice(0, 10);
  let poolVisibleCount = pageSize;
  let currentPool = movies;
  let champion = null;
  let queue = [];
  let round = 0;

  // ---------- Pool ----------
  function renderPool(list = movies) {
    currentPool = list;
    const visibleList = list.slice(0, poolVisibleCount);

    poolGrid.innerHTML = visibleList.map((movie) => {
      const active = selected.some((item) => item.id === movie.id);
      const disabled = !active && selected.length >= 10;

      return `
        <button class="btn btn-ghost btn-small" data-toggle-movie="${movie.id}" ${disabled ? 'disabled' : ''}>
          ${active ? '✓' : '+'} ${movie.title}
        </button>
      `;
    }).join('');

    if (loadMoreButton) {
      loadMoreButton.hidden = poolVisibleCount >= list.length;
    }
  }

  function renderSelected() {
    selectedGrid.innerHTML = selected.length
      ? selected.map((movie) => `<span class="selected-pill">${movie.title}</span>`).join('')
      : '<span class="selected-pill">Nenhum filme selecionado</span>';
  }

  function visibleMovies() {
    return MovieArcade.filterMovies(movies, search?.value || '');
  }

  // ---------- Duel cards ----------
  function movieCard(movie) {
    return `
      <article class="card versus-card">
        <div class="poster versus-poster">${MovieArcade.posterMarkup(movie)}</div>
        <h3>${movie.title}</h3>
        <p>${movie.year} • ${movie.director}</p>
        <button class="btn btn-primary" data-vote="${movie.id}">Escolher este</button>
      </article>
    `;
  }

  // ---------- Battle flow ----------
  function startVersus() {
    const battleList = selected.length >= 2
      ? MovieArcade.shuffle(selected).slice(0, 10)
      : MovieArcade.shuffle(movies).slice(0, 10);

    champion = battleList[0];
    queue = battleList.slice(1);
    round = 1;
    renderDuel();
  }

  function renderDuel() {
    if (!champion) {
      arena.innerHTML = '<div class="empty">Monte uma seleção ou clique em seleção aleatória para começar.</div>';
      return;
    }

    if (!queue.length) {
      arena.innerHTML = `
        <article class="card final-winner">
          <span class="kicker">Vencedor final</span>
          <div class="poster final-poster">${MovieArcade.posterMarkup(champion)}</div>
          <h2>${champion.title}</h2>
          <p>${champion.synopsis}</p>
          <button class="btn btn-primary" data-restart-versus>Jogar novamente</button>
        </article>
      `;

      status.textContent = `Campeão definido após ${round - 1} duelos.`;
      return;
    }

    const challenger = queue[0];
    arena.innerHTML = `${movieCard(champion)}<div class="versus-mark">VS</div>${movieCard(challenger)}`;
    status.textContent = `Duelo ${round} de ${Math.min(selected.length || 10, 10) - 1}`;
  }

  // ---------- Events ----------
  poolGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-toggle-movie]');
    if (!button) return;

    const movie = movies.find((item) => item.id === button.dataset.toggleMovie);

    if (selected.some((item) => item.id === movie.id)) {
      selected = selected.filter((item) => item.id !== movie.id);
    } else if (selected.length < 10) {
      selected = [...selected, movie];
    }

    champion = null;
    queue = [];
    renderPool(visibleMovies());
    renderSelected();
    renderDuel();
  });

  arena.addEventListener('click', (event) => {
    const voteButton = event.target.closest('[data-vote]');
    const restartButton = event.target.closest('[data-restart-versus]');

    if (restartButton) {
      startVersus();
      return;
    }

    if (!voteButton) return;

    champion = [champion, queue[0]].find((movie) => movie.id === voteButton.dataset.vote);
    queue.shift();
    round += 1;
    renderDuel();
  });

  search?.addEventListener('input', () => {
    poolVisibleCount = pageSize;
    renderPool(visibleMovies());
  });

  loadMoreButton?.addEventListener('click', () => {
    poolVisibleCount += pageSize;
    renderPool(currentPool);
  });

  randomButton?.addEventListener('click', () => {
    selected = MovieArcade.shuffle(movies).slice(0, 10);
    renderPool(visibleMovies());
    renderSelected();
    startVersus();
  });

  startButton?.addEventListener('click', startVersus);

  clearButton?.addEventListener('click', () => {
    selected = [];
    champion = null;
    queue = [];
    status.textContent = 'Seleção limpa.';
    renderPool(visibleMovies());
    renderSelected();
    renderDuel();
  });

  renderPool();
  renderSelected();
  renderDuel();
});
