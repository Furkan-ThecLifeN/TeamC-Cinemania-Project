const container = document.getElementById('film-list');
let page = 1;
const loadBtn = document.querySelector('.load-btn');
const APIKey = '0f552bbb3a7946c71382d336324ac39a';
const library = '';
const message = document.getElementById('empty-message');
const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

document.addEventListener('DOMContentLoaded', () => {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  if (library.length === 0) {
    showEmptyLibraryMessage();
  } else {
    displayMovies(library);
  }
});
// see all movies when the page loaded
async function fetchMovies() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${APIKey}&page=${page}`
    );
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Film verileri alınamadı:', error);
  }
}

// list movies
function displayMovies(movies) {
  container.innerHTML = '';
  message.innerHTML = '';
  movies.forEach(movie => {
    const movieCard = document.createElement('div');

    movieCard.innerHTML = `
      <img class="movie-image" alt="${
        movie.original_title
      }" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"/>
      <h3>${movie.original_title}</h3>
      
      <p class="popularity" >Populrity ${movie.popularity}</p>
      <p class="genre">${movie.genre_ids.map(id => genreMap[id]).join(',')}|${
      movie.release_date.split('-')[0]
    }</p>`;
    container.appendChild(movieCard);
  });
}


// <p class="votes" >Vote/Votes  ${movie.vote_count}/${movie.vote_average}</p>
// <p class="about" >ABOUT ${movie.overview}</p>
//Showing single movie card
const filmCard = document.querySelectorAll('.movie-image');
filmCard.addEventListener('click', () => {});

//user will see if there is no movie in library

function showEmptyLibraryMessage() {
  const markup = `<p class="markup">OOOPS..<br>We are very sorry!<br>You don’t have any movies at your library</p>
  <button type="button" class="searchBtn">Search Movie</button>`;
  message.innerHTML = markup;
  const searchBtn = document.querySelector('.searchBtn');
  searchBtn.addEventListener('click', () => {
    fetchMovies();
  });
}

// Remove movie from library
const addRemoveBtn = document.querySelector('.add-remote-btn');
addRemoveBtn.addEventListener('click', e => {
  const checkId = e.target.dataset.id;
  if (checkId.includes(library)) {
    addToLibrary();
  } else {
    removeFromLibrary(idToRemove);
  }
});

function removeFromLibrary(id) {
  let library = JSON.parse(localStorage.getItem('library')) || [];
  const updatedStorage = library.filter(movie => movie.id !== id);
  localStorage.setItem('library', JSON.stringify(updatedStorage));
  displayMovies(updatedStorage);
}
