// upcoming.js
export async function getTrendingToday() {
  const API_KEY = '04c35731a5ee918f014970082a0088b1';
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
}

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export async function renderUpcomingSection() {
  const container = document.getElementById('upcoming-section');
  if (!container) return;
  
  try {
    // Get current date info for the monthly releases
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const firstDay = `${year}-${month}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const lastDayOfMonth = `${year}-${month}-${lastDay}`;
    
    // Get genre map
    const API_KEY = '04c35731a5ee918f014970082a0088b1';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const genreMap = {};
    
    // Get genres first
    const genreResponse = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const genreData = await genreResponse.json();
    
    genreData.genres.forEach(genre => {
      genreMap[genre.id] = genre.name;
    });
    
    // Get monthly releases
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&primary_release_date.gte=${firstDay}&primary_release_date.lte=${lastDayOfMonth}&sort_by=popularity.desc`;
    const response = await fetch(url);
    const data = await response.json();
    const films = data.results;
    
    if (!films || films.length === 0) {
      container.innerHTML = '<p id="no-movie-message">No movies found for this month.</p>';
      return;
    }
    
    // Get or set featured movie
    let randomFilm = JSON.parse(localStorage.getItem('featuredUpcomingMovie'));
    
    if (!randomFilm) {
      randomFilm = films[Math.floor(Math.random() * films.length)];
      localStorage.setItem('featuredUpcomingMovie', JSON.stringify(randomFilm));
    }
    
    // Create HTML structure like in the first image
    container.innerHTML = `
      <h2>UPCOMING THIS MONTH</h2>
      <div class="upcoming-movie-card">
        <div class="movie-poster" style="background-image: url(${IMAGE_BASE_URL}${randomFilm.backdrop_path})"></div>
        <div class="movie-details">
          <h3 class="upcoming-movie-name">${randomFilm.title}</h3>
          
          <div class="movie-info">
            <div class="info-row">
              <span class="info-label">Release date</span>
              <span class="info-date-value">${randomFilm.release_date}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Vote / Votes</span>
              <div class="votes-container">
                <span class="vote-box">${randomFilm.vote_average.toFixed(1)}</span>
                <span class="vote-box">${randomFilm.vote_count}</span>
              </div>
            </div>
            
            <div class="info-row">
              <span class="info-label">Popularity</span>
              <span class="info-popularity-value">${Math.round(randomFilm.popularity)}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Genre</span>
              <span class="info-genre-value">${randomFilm.genre_ids.map(id => genreMap[id]).join(', ')}</span>
            </div>
          </div>
          
          <div class="about-section">
            <h4>ABOUT</h4>
            <p class="movieabout">${randomFilm.overview}</p>
          </div>
          
          <button class="btn-upcoming">Add to my library</button>
        </div>
      </div>
    `;
    
    // Set up library button functionality
    setupLibraryButton(randomFilm);
    
  } catch (error) {
    console.error('Error:', error);
    container.innerHTML = '<p>An error occurred. Please try again later.</p>';
  }
}

function setupLibraryButton(movie) {
  const libraryBtn = document.querySelector('.btn-upcoming');
  if (!libraryBtn) return;
  
  const libraryKey = 'myLibrary';
  let library = JSON.parse(localStorage.getItem(libraryKey)) || [];
  
  // Check if movie is already in library
  const isInLibrary = library.some(film => film.id === movie.id);
  
  // Update button text
  libraryBtn.textContent = isInLibrary ? 'Remove from My Library' : 'Add to my library';
  
  // Update button class
  libraryBtn.classList.add(isInLibrary ? 'clicked' : 'default');
  
  // Set up click event
  libraryBtn.addEventListener('click', () => {
    const isCurrentlyInLibrary = library.some(film => film.id === movie.id);
    
    if (isCurrentlyInLibrary) {
      // Remove from library
      library = library.filter(film => film.id !== movie.id);
      libraryBtn.textContent = 'Add to my library';
      libraryBtn.classList.remove('clicked');
      libraryBtn.classList.add('default');
    } else {
      // Add to library
      library.push({ 
        id: movie.id, 
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genre_ids: movie.genre_ids,
        overview: movie.overview,
        release_date: movie.release_date,
        popularity: movie.popularity
      });
      
      libraryBtn.textContent = 'Remove from My Library';
      libraryBtn.classList.remove('default');
      libraryBtn.classList.add('clicked');
      
      // Show notification
      showNotification();
    }
    
    localStorage.setItem(libraryKey, JSON.stringify(library));
  });
  
  // Set up hover effects
  libraryBtn.addEventListener('mouseenter', () => {
    if (!libraryBtn.classList.contains('clicked')) {
      libraryBtn.classList.add('hovered');
    }
  });
  
  libraryBtn.addEventListener('mouseleave', () => {
    libraryBtn.classList.remove('hovered');
  });
}

function showNotification() {
  const overlay = document.getElementById('overlay');
  const notification = document.getElementById('notification');
  
  if (!overlay || !notification) return;
  
  overlay.classList.remove('hidden');
  notification.classList.remove('hidden');
  
  setTimeout(() => {
    overlay.classList.add('hidden');
    notification.classList.add('hidden');
  }, 2000);
}

// Initialize the upcoming section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  renderUpcomingSection();
});