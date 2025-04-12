export const APIKey = '0f552bbb3a7946c71382d336324ac39a';

export const genreMap = {
  28: 'Aksiyon', 12: 'Macera', 16: 'Animasyon', 35: 'Komedi',
  80: 'Suç', 99: 'Belgesel', 18: 'Dram', 10751: 'Aile',
  14: 'Fantastik', 36: 'Tarih', 27: 'Korku', 10402: 'Müzik',
  9648: 'Gizem', 10749: 'Romantik', 878: 'Bilim Kurgu', 10770: 'TV Filmi',
  53: 'Gerilim', 10752: 'Savaş', 37: 'Western',
};

let page = 1;

export function initializeLibrary() {
  const container = document.getElementById('film-list');
  const message = document.getElementById('empty-message');
  let page = 1;

  const library = JSON.parse(localStorage.getItem('library')) || [];
  if (library.length === 0) {
    showEmptyLibraryMessage();
  } else {
    displayMovies(library);
  }

  initEventListeners();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeLibrary();
});

function initEventListeners() {
  const loadBtn = document.querySelector('.load-btn');
  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      page++;
      fetchMovies();
    });
  }

  document.addEventListener('click', e => {
    if (e.target.classList.contains('add-remote-btn')) {
      const movieId = parseInt(e.target.dataset.id);
      if (isInLibrary(movieId)) {
        removeFromLibrary(movieId);
      } else {
        addToLibrary(movieId);
      }
    }

    if (e.target.classList.contains('movieCard')) {
      const movieId = e.target.dataset.id;
      showModal(movieId); // Modal'ı açmak için showModal fonksiyonunu çağırıyoruz
    }
  });
}

// Modal gösterme fonksiyonu
async function showModal(id) {
  const movie = await fetchMovieDetails(id);
  if (!movie) return;

  const modal = document.querySelector('.modal-details');
  if (!modal) return;

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
  document.body.style.overflow = 'hidden'; // Sayfa kaydırılmasını engelle
}

// Modal'ı kapatma fonksiyonu
function closeModal() {
  const modal = document.querySelector('.modal-details');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto'; // Sayfa kaydırma tekrar aktif olur
}

// Modal kapama butonuna tıklama işlemi
document.querySelector('.modal-details__close')?.addEventListener('click', closeModal);

// Modal dışına tıklanarak kapatma
document.querySelector('.modal-details')?.addEventListener('click', e => e.target === e.currentTarget && closeModal());

// ESC tuşuyla modal'ı kapatma
document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());

// Film detaylarını çekme fonksiyonu
async function fetchMovieDetails(id) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${APIKey}`);
    const movie = await response.json();
    return movie;
  } catch (error) {
    console.error('Movie details fetching error:', error);
  }
}

export async function fetchMovies() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${APIKey}&page=${page}`
    );
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Could not fetch movie data:', error);
  }
}

export function displayMovies(movies) {
  const container = document.getElementById('film-list');
  const message = document.getElementById('empty-message');
  if (!container) return;

  container.innerHTML = '';
  if (message) message.innerHTML = '';

  movies.forEach(movie => {
    // ✅ Eksik genre_ids varsa üret
    movie.genre_ids = movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []);

    const movieCard = document.createElement('li');
    const filmCard = document.createElement('div');
    const starRating = Math.round(movie.vote_average / 2);
    const stars = '★'.repeat(starRating) + '☆'.repeat(5 - starRating);
    filmCard.innerHTML = `
      <div class="movie-image-container">
        <img class="movie-image" alt="${movie.original_title}" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"/>
      </div>
      <h3>${movie.original_title}</h3>
      <div class="card-down"><span class="left-info">${movie.genre_ids.map(id => genreMap[id]).join(',')} | ${
      movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
    }</span><span class="stars">${stars}</span>
      </div>`;
    movieCard.classList.add('movieCard');
    filmCard.classList.add('filmCard');
    movieCard.dataset.id = movie.id; // Film ID'sini movieCard'a ekleyin
    movieCard.appendChild(filmCard);
    container.appendChild(movieCard);
  });
}

function showEmptyLibraryMessage() {
  const message = document.getElementById('empty-message');
  if (!message) return;

  const markup = `
    <p class="markup">
      <span>OOOPS..</span>
      <span>We are very sorry!</span>
      <span>You don't have any movies at your library</span>
    </p>
    <button type="button" class="searchBtn">Search Movie</button>
  `;
  message.innerHTML = markup;
  setTimeout(() => {
    const searchBtn = document.querySelector('.searchBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        fetchMovies();
      });
    }
  }, 0);
}

function isInLibrary(id) {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  return library.some(movie => movie.id === id);
}

function removeFromLibrary(id) {
  let library = JSON.parse(localStorage.getItem('library')) || [];
  const updatedStorage = library.filter(movie => movie.id !== id);
  localStorage.setItem('library', JSON.stringify(updatedStorage));

  if (updatedStorage.length === 0) {
    showEmptyLibraryMessage();
  } else {
    displayMovies(updatedStorage);
  }
}

// ✅ Global fonksiyon: modal tarafı çağırabilir
window.refreshLibrary = () => {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  if (library.length === 0) {
    showEmptyLibraryMessage();
  } else {
    displayMovies(library);
  }
};
