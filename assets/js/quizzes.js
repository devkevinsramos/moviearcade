// ==============================
// MovieArcade - Quizzes
// ==============================
document.addEventListener('DOMContentLoaded', async () => {
  const quizBox = document.querySelector('[data-quiz-box]');
  const modeButtons = document.querySelectorAll('[data-quiz-mode]');
  if (!quizBox) return;

  // ---------- State ----------
  const movies = await MovieArcadeAPI.getMovies();
  let currentMode = 'synopsis';
  let score = 0;
  let total = 0;

  // ---------- Options ----------
  function getMovieOptions(correctMovie) {
    return MovieArcade.shuffle([
      correctMovie,
      ...MovieArcade.shuffle(movies.filter((movie) => movie.id !== correctMovie.id)).slice(0, 3)
    ]);
  }

  function getYearOptions(correctMovie) {
    const otherYears = [...new Set(movies
      .filter((movie) => movie.year !== correctMovie.year)
      .map((movie) => movie.year)
    )];

    return MovieArcade.shuffle([
      correctMovie.year,
      ...MovieArcade.shuffle(otherYears).slice(0, 3)
    ]);
  }

  // ---------- Question renderer ----------
  function renderQuestion() {
    const correctMovie = MovieArcade.pickRandom(movies);
    let question = '';
    let options = '';

    if (currentMode === 'synopsis') {
      question = `<p class="lead">"${correctMovie.synopsis}"</p>`;
      options = getMovieOptions(correctMovie).map((movie) => `
        <button class="btn btn-ghost quiz-option" data-answer="${movie.id}" data-correct="${correctMovie.id}">
          ${movie.title}
        </button>
      `).join('');
    }

    if (currentMode === 'year') {
      question = `<p class="lead">Em qual ano foi lançado <strong>${correctMovie.title}</strong>?</p>`;
      options = getYearOptions(correctMovie).map((year) => `
        <button class="btn btn-ghost quiz-option" data-answer="${year}" data-correct="${correctMovie.year}">
          ${year}
        </button>
      `).join('');
    }

    if (currentMode === 'poster') {
      question = `
        <div class="poster-quiz-layout">
          <div class="quiz-poster poster poster-blur">${MovieArcade.posterMarkup(correctMovie)}</div>
          <div>
            <p class="lead">Qual filme está escondido neste poster?</p>
            <div class="quiz-options poster-options">
              ${getMovieOptions(correctMovie).map((movie) => `
                <button class="btn btn-ghost quiz-option" data-answer="${movie.id}" data-correct="${correctMovie.id}">
                  ${movie.title}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    quizBox.innerHTML = `
      <div class="quiz-header">
        <span class="count-badge">Pontuação: ${score}/${total}</span>
        <button class="btn btn-ghost btn-small" data-next-question>Nova pergunta</button>
      </div>

      <div class="quiz-question">
        ${question}
      </div>

      ${currentMode !== 'poster' ? `<div class="quiz-options">${options}</div>` : ''}
    `;
  }

  // ---------- Mode change ----------
  function setMode(mode) {
    currentMode = mode;
    score = 0;
    total = 0;

    modeButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.quizMode === mode);
    });

    renderQuestion();
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.quizMode));
  });

  // ---------- Answer click ----------
  quizBox.addEventListener('click', (event) => {
    const answerButton = event.target.closest('[data-answer]');
    const nextButton = event.target.closest('[data-next-question]');

    if (nextButton) {
      renderQuestion();
      return;
    }

    if (!answerButton) return;

    const buttons = quizBox.querySelectorAll('[data-answer]');
    const isCorrect = answerButton.dataset.answer === answerButton.dataset.correct;

    total += 1;
    if (isCorrect) score += 1;

    buttons.forEach((button) => {
      button.disabled = true;
      button.classList.toggle('correct', button.dataset.answer === button.dataset.correct);
      button.classList.toggle('wrong', button === answerButton && !isCorrect);
    });

    quizBox.querySelector('.poster-blur')?.classList.remove('poster-blur');
    setTimeout(renderQuestion, 1200);
  });

  setMode(currentMode);
});
