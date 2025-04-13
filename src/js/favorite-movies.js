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
let movies = [];
let totalPage = 1;

export function initializeLibrary() {
  const container = document.getElementById('film-list');
  const message = document.getElementById('empty-message');

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
    movies = data.results;
    totalPage = data.total_pages;

    displayMovies(movies);
    loadPagination(totalPage);
  } catch (error) {
    console.error('Could not fetch movie data:', error);
  }
}

export function displayMovies(movies) {
  const container = document.getElementById('film-list');
  const message = document.getElementById('empty-message');

  if (!container || !Array.isArray(movies)) return;

  container.innerHTML = '';
  if (message) message.innerHTML = '';

  movies.forEach(movie => {
    const movieCard = document.createElement('li');
    const filmCard = document.createElement('div');
    const starRating = Math.round(movie.vote_average / 2);
    const stars = '★'.repeat(starRating) + '☆'.repeat(5 - starRating);
    filmCard.innerHTML = `
      
        <div><img class="movie-image" alt="${
          movie.original_title
        }" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"/>
      </div>
     
      <div class="card-info"><h3>${movie.original_title}</h3>
      <div class="card-down"><span class="left-info">${movie.genre_ids
        .map(id => genreMap[id])
        .join(',')} | ${
      movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
    }</span><span class="stars">${stars}</span></div>
      </div>`;
    movieCard.classList.add('movieCard');
    filmCard.classList.add('filmCard');
    filmCard.setAttribute('data-id', movie.id);
    filmCard.addEventListener('click', () => {
      
      showModal(movie.id);
    });

    movieCard.appendChild(filmCard);
    container.appendChild(movieCard);
  });
  loadPagination(totalPage);
}

function loadPagination(totalPage) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '<';
  prevBtn.classList.add('pagination-btn');
  if (page === 1) {
    prevBtn.disabled = true;
  }
  prevBtn.addEventListener('click', function () {
    if (page > 1) {
      page--;
      fetchMovies();
    }
  });
  pagination.appendChild(prevBtn);
  let maxVisiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;
  if (endPage > totalPage) {
    endPage = totalPage;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.classList.add('pagination-btn');

    if (i === page) {
      pageBtn.classList.add('active-page');
    }
    pageBtn.addEventListener('click', function () {
      setTimeout(() => {
        page = i;
        fetchMovies();
      }, 500);
    });
    pagination.appendChild(pageBtn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '>';
  nextBtn.classList.add('pagination-btn');
  if (page === totalPage) {
    nextBtn.disabled = true;
  }
  nextBtn.addEventListener('click', function () {
    if (page < totalPage) {
      page++;
      fetchMovies();
    }
  });
  pagination.appendChild(nextBtn);
  if (endPage < totalPage) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.classList.add('pagination-dots');
    pagination.appendChild(dots);
    const lastPage = document.createElement('button');
    lastPage.textContent = totalPage;
    lastPage.classList.add('pagination-btn');
    lastPage.addEventListener('click', function () {
      page = totalPage;
      fetchMovies();
    });
    pagination.appendChild(lastPage);
  }
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

async function fetchMovieDetails(id) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${APIKey}`
    );
    return await response.json();
  } catch (error) {
    console.log('Filmler yüklenemedi!', error);
  }
}
async function showModal(id) {
  const movie = await fetchMovieDetails(id);

  if (!movie) return;
  const modal = document.querySelector('#modal');
  const modalInfo = modal.querySelector('.modal-info');
  const libraryBtn = modal.querySelector('.library-btn');
  
  modalInfo.innerHTML = `
  <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
    movie.title
  }"/>
  <h2 class="Modal-title">${movie.original_title}
  <p>Vote/Votes<span>${movie.vote_average}/${movie.vote_count}</span>
  </p>
  <p>Popularity<span>${movie.popularity}</span></p>
  <p>Genre<span> ${
    Array.isArray(movie.genres)
      ? movie.genres.map(id => genreMap[id]).join(',')
      : 'Tür bulunamadı'
  }
  </span></p>
  <p>ABOUT <br><span>${movie.overview}</span></p>
  </h2>`;
  libraryBtn.innerHTML = `Remove From Library`;
  modal.classList.remove('modal-hidden');
}
