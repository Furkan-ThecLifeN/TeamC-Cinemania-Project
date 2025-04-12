document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.modal-details');
  const closeBtn = modal.querySelector('.modal-details__close');
  const libraryBtn = modal.querySelector('.modal-details__library-btn');
  let currentMovieId = null;

  const genreMap = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
    53: 'Thriller', 10752: 'War', 37: 'Western',
  };

  // ✅ library olarak tek key'e geçtik
  function getLibrary() {
    return JSON.parse(localStorage.getItem('library')) || [];
  }

  function setLibrary(library) {
    localStorage.setItem('library', JSON.stringify(library));
  }

  function isInLibrary(id) {
    return getLibrary().some(movie => movie.id === id);
  }

  function updateLibraryButton(id) {
    const inLibrary = isInLibrary(id);
    libraryBtn.textContent = inLibrary
      ? 'Remove from library'
      : 'Add to library';
    libraryBtn.dataset.action = inLibrary ? 'remove' : 'add';
  }

  function toggleLibrary(movie) {
    const library = getLibrary();
    const index = library.findIndex(item => item.id === movie.id);

    // Genre eşleştirme
    if (!movie.genres && movie.genre_ids) {
      movie.genres = movie.genre_ids.map(id => ({
        id,
        name: genreMap[id] || 'Unknown',
      }));
    }

    index === -1 ? library.push(movie) : library.splice(index, 1);
    setLibrary(library);
    updateLibraryButton(movie.id);

    // ✅ Favoriler listesi açıksa anında yenile
    if (typeof window.refreshLibrary === 'function') {
      window.refreshLibrary();
    }
  }

  async function fetchMovieDetails(id) {
    const API_KEY = 'f1a0a8dd870a150fcd20cd47eff55f54';
    const URL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;

    try {
      const res = await fetch(URL);
      return res.ok ? await res.json() : null;
    } catch (err) {
      console.error('Film verisi alınamadı:', err);
      return null;
    }
  }

  async function showModal(id) {
    const movie = await fetchMovieDetails(id);
    if (!movie) return;

    currentMovieId = movie.id;

    modal.querySelector('.modal-details__image').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    modal.querySelector('.modal-details__image').alt = movie.title;
    modal.querySelector('.modal-details__title').textContent = movie.title;
    modal.querySelector('.modal-details__vote').textContent = movie.vote_average.toFixed(1);
    modal.querySelector('.modal-details__votes').textContent = movie.vote_count;
    modal.querySelector('.modal-details__popularity').textContent = movie.popularity.toFixed(1);
    modal.querySelector('.modal-details__genre').textContent = movie.genres
      ? movie.genres.map(g => g.name).join(', ')
      : movie.genre_ids.map(id => genreMap[id] || 'Unknown').join(', ');
    modal.querySelector('.modal-details__about-text').textContent = movie.overview;

    updateLibraryButton(movie.id);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => e.target === modal && closeModal());
  document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());

  libraryBtn.addEventListener('click', async () => {
    if (!currentMovieId) return;
    const movie = await fetchMovieDetails(currentMovieId);
    movie && toggleLibrary(movie);
  });

  window.movieModal = {
    show: showModal,
    close: closeModal,
  };
});
