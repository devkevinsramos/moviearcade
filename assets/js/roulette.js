// ==============================
// MovieArcade - Roulette
// ==============================
document.addEventListener('DOMContentLoaded', async () => {
  const search = document.querySelector('[data-movie-search]');
  const poolGrid = document.querySelector('[data-pool-grid]');
  const selectedGrid = document.querySelector('[data-selected-grid]');
  const loadMoreButton = document.querySelector('[data-load-more-pool]');
  const randomButton = document.querySelector('[data-random-pool]');
  const clearButton = document.querySelector('[data-clear-pool]');
  const spinButton = document.querySelector('[data-spin]');
  const wheel = document.querySelector('[data-wheel]');
  const result = document.querySelector('[data-result]');

  if (!poolGrid || !wheel) return;

  // ---------- State ----------
  const movies = await MovieArcadeAPI.getMovies();
  const pageSize = 20;
  let selected = MovieArcade.shuffle(movies).slice(0, 10);
  let poolVisibleCount = pageSize;
  let rotation = 0;
  let currentPool = movies;

  // ---------- Render movie pool ----------
  function renderPool(list = movies) {
    currentPool = list;
    const visibleList = list.slice(0, poolVisibleCount);

    poolGrid.innerHTML = visibleList.map((movie) => `
      <button class="btn btn-ghost btn-small" data-toggle-movie="${movie.id}">
        ${selected.some((item) => item.id === movie.id) ? '✓' : '+'} ${movie.title}
      </button>
    `).join('');

    if (loadMoreButton) {
      loadMoreButton.hidden = poolVisibleCount >= list.length;
    }
  }

  // ---------- Render selected movies ----------
  function renderSelected() {
    selectedGrid.innerHTML = selected.length
      ? selected.map((movie) => `<span class="selected-pill">${movie.title}</span>`).join('')
      : '<span class="selected-pill">Nenhum filme selecionado</span>';

    updateWheel();
  }

  // ---------- Wheel visual ----------
  function updateWheel() {
    const colors = ['#ff3131', '#ff8a00', '#ff6a00', '#151515'];
    const slices = selected.length || 1;
    const step = 360 / slices;

    const gradient = Array.from({ length: slices }, (_, index) => {
      const start = index * step;
      const end = (index + 1) * step;
      return `${colors[index % colors.length]} ${start}deg ${end}deg`;
    }).join(', ');

    wheel.style.background = `conic-gradient(${gradient})`;
  }

  function visibleMovies() {
    return MovieArcade.filterMovies(movies, search?.value || '');
  }

  // ---------- Events ----------
  poolGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-toggle-movie]');
    if (!button) return;

    const movie = movies.find((item) => item.id === button.dataset.toggleMovie);

    if (selected.some((item) => item.id === movie.id)) {
      selected = selected.filter((item) => item.id !== movie.id);
    } else {
      selected = [...selected, movie];
    }

    renderPool(visibleMovies());
    renderSelected();
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
    result.textContent = 'Seleção aleatória montada.';
    renderPool(visibleMovies());
    renderSelected();
  });

  clearButton?.addEventListener('click', () => {
    selected = [];
    result.textContent = 'Seleção limpa.';
    renderPool(visibleMovies());
    renderSelected();
  });

  spinButton?.addEventListener('click', () => {
    if (!selected.length) {
      result.textContent = 'Escolha pelo menos um filme para girar.';
      return;
    }

    const winnerIndex = Math.floor(Math.random() * selected.length);
    const winner = selected[winnerIndex];
    const slice = 360 / selected.length;
    const targetAngle = 360 - (winnerIndex * slice + slice / 2);

    rotation += 1440 + targetAngle;
    wheel.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
      result.textContent = winner.title;
    }, 950);
  });

  renderPool();
  renderSelected();
});
