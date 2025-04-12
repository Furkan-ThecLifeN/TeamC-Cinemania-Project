// favorite.js
export const APIKey = '0f552bbb3a7946c71382d336324ac39a';
export const genreMap = {
  28: 'Aksiyon',
  12: 'Macera',
  16: 'Animasyon',
  35: 'Komedi',
  80: 'Suç',
  99: 'Belgesel',
  18: 'Dram',
  10751: 'Aile',
  14: 'Fantastik',
  36: 'Tarih',
  27: 'Korku',
  10402: 'Müzik',
  9648: 'Gizem',
  10749: 'Romantik',
  878: 'Bilim Kurgu',
  10770: 'TV Filmi',
  53: 'Gerilim',
  10752: 'Savaş',
  37: 'Western',
};
let page = 1;

export function initializeLibrary() {
  const container = document.getElementById('film-list');
  const message = document.getElementById('empty-message');
  let page = 1;

  // Load library from localStorage
  const library = JSON.parse(localStorage.getItem('library')) || [];
  if (library.length === 0) {
    showEmptyLibraryMessage();
  } else {
    displayMovies(library);
  }

  // Initialize event listeners
  initEventListeners();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeLibrary(); // sayfa yüklendiğinde çalışacak fonksiyon
});
function initEventListeners() {
  // Add event listeners for load button if it exists
  const loadBtn = document.querySelector('.load-btn');
  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      page++;
      fetchMovies();
    });
  }

  // Add event listener for add/remove buttons
  document.addEventListener('click', e => {
    if (e.target.classList.contains('add-remote-btn')) {
      const movieId = parseInt(e.target.dataset.id);
      if (isInLibrary(movieId)) {
        removeFromLibrary(movieId);
      } else {
        addToLibrary(movieId);
      }
    }
  });
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
    const movieCard = document.createElement('li');
    const filmCard = document.createElement('div');
    const starRating = Math.round(movie.vote_average / 2);
    const stars = '★'.repeat(starRating) + '☆'.repeat(5 - starRating);
    filmCard.innerHTML = `
      <a href="https://image.tmdb.org/t/p/original/${
        movie.poster_path
      }" class="lightbox">
        <img class="movie-image" alt="${
          movie.original_title
        }" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"/>
      </a>
      <h3>${movie.original_title}</h3>
      <div class="card-down"><span class="left-info">${movie.genre_ids
        .map(id => genreMap[id])
        .join(',')} | ${
      movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
}</span><span class="stars">${stars}</span>
      </div>`;
    movieCard.classList.add('movieCard');
    filmCard.classList.add('filmCard');
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

  // Refresh the display
  if (updatedStorage.length === 0) {
    showEmptyLibraryMessage();
  } else {
    displayMovies(updatedStorage);
  }
}
