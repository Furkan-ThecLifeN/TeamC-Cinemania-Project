// favorite.js
export const APIKey = '0f552bbb3a7946c71382d336324ac39a';
export const genreMap = {
  28: 'Action',
  12: 'Adventure',
  /* other genres */
};

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
    const filmCard = document.createElement("div");
    filmCard.innerHTML = `
      <a href="https://image.tmdb.org/t/p/original/${movie.poster_path}" class="lightbox">
        <img class="movie-image" alt="${movie.original_title}" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"/>
      </a>
      <h3>${movie.original_title}</h3>
      <p class="popularity">Popularity ${movie.popularity}</p>
      <p class="genre">${movie.genre_ids.map(id => genreMap[id]).join(',')}|${
        movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
      }</p>
      <button class="add-remote-btn" data-id="${movie.id}">
        ${isInLibrary(movie.id) ? 'Remove from Library' : 'Add to Library'}
      </button>
    `;
    movieCard.classList.add('movieCard');
    filmCard.classList.add("filmCard");
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
  
  const searchBtn = document.querySelector('.searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      fetchMovies();
    });
  }
}

function isInLibrary(id) {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  return library.some(movie => movie.id === id);
}

function addToLibrary(id) {
  // Implement adding to library
  // You'll need to fetch the movie details by ID first
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