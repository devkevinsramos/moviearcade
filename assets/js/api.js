// ==============================
// MovieArcade - Optional TMDB API
// ==============================
// Cole seu token da TMDB aqui. Sem token, o site usa movies.json.
const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOGZmZmRlYmVkMWNmNjMzMWU0ZDIwNDM0M2VmN2QyYyIsIm5iZiI6MTc3NzQzNDUxOS4wNCwic3ViIjoiNjlmMTdmOTc3N2IyZjA3ZmIxYTEwYjkwIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.AjaQhg4OwR_UAeMkG7YPjIwrbsYOXkx0-O5j2cyuBDk';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieArcadeAPI = (() => {
  // ---------- Request ----------
  async function fetchTMDBMovie(tmdbId) {
    if (!tmdbId) throw new Error('Filme sem tmdbId.');

    const url = `${TMDB_BASE_URL}/movie/${tmdbId}?language=pt-BR&append_to_response=credits`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${TMDB_TOKEN}` }
    });

    if (!response.ok) throw new Error('Erro ao buscar filme na TMDB.');
    return response.json();
  }

  // ---------- Formatter ----------
  function formatTMDBMovie(tmdbMovie, localMovie) {
    const director = tmdbMovie.credits?.crew?.find((person) => person.job === 'Director');
    const actors = tmdbMovie.credits?.cast?.slice(0, 4).map((actor) => actor.name) || localMovie.actors;

    return {
      ...localMovie,
      title: localMovie.title,
      poster: tmdbMovie.poster_path ? `${TMDB_IMAGE_URL}${tmdbMovie.poster_path}` : localMovie.poster,
      director: director?.name || localMovie.director,
      actors,
      synopsis: localMovie.synopsis || tmdbMovie.overview,
      runtime: tmdbMovie.runtime || localMovie.runtime,
      genres: tmdbMovie.genres?.map((genre) => genre.name) || localMovie.genres,
      rating: tmdbMovie.vote_average ? Number(tmdbMovie.vote_average.toFixed(1)) : localMovie.rating,
      year: tmdbMovie.release_date ? Number(tmdbMovie.release_date.slice(0, 4)) : localMovie.year
    };
  }

  // ---------- Public loader ----------
  async function getMovies() {
    const localMovies = await MovieArcade.getMovies();

    if (!TMDB_TOKEN || TMDB_TOKEN === 'COLE_SEU_TOKEN_AQUI') {
      return localMovies;
    }

    return Promise.all(localMovies.map(async (movie) => {
      try {
        const tmdbMovie = await fetchTMDBMovie(movie.tmdbId);
        return formatTMDBMovie(tmdbMovie, movie);
      } catch (error) {
        console.warn(`Falha ao buscar ${movie.title}. Usando dados locais.`, error);
        return movie;
      }
    }));
  }

  return { getMovies };
})();
