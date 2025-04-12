export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Favori filmleri saklamak için kullanılan fonksiyonlar
function getLibrary() {
  return JSON.parse(localStorage.getItem('library')) || [];
}

function setLibrary(library) {
  localStorage.setItem('library', JSON.stringify(library));
}

// Library'e ekleme işlemi
function toggleLibrary(movie) {
  const library = getLibrary();
  const index = library.findIndex(item => item.id === movie.id);

  // Eğer film yoksa, ekliyoruz, varsa çıkarıyoruz
  if (index === -1) {
    library.push(movie);
  } else {
    library.splice(index, 1);
  }

  setLibrary(library);
  updateLibraryButton(movie.id);
  showNotification();
}

// Library butonunun metnini güncelleme
function updateLibraryButton(id) {
  const libraryBtn = document.querySelector('.btn-upcoming');
  const library = getLibrary();
  const inLibrary = library.some(movie => movie.id === id);

  // Butonun metnini ve stilini güncelle
  libraryBtn.textContent = inLibrary ? 'Remove from my library' : 'Add to my library';
  libraryBtn.classList.toggle('clicked', inLibrary);
  libraryBtn.classList.toggle('default', !inLibrary);
}

// Film detaylarını alıp, sayfada gösterme
export async function renderUpcomingSection() {
  const container = document.getElementById('upcoming-section');
  if (!container) return;

  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const firstDay = `${year}-${month}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const lastDayOfMonth = `${year}-${month}-${lastDay}`;

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

    let randomFilm = JSON.parse(localStorage.getItem('featuredUpcomingMovie'));

    if (!randomFilm) {
      randomFilm = films[Math.floor(Math.random() * films.length)];
      localStorage.setItem('featuredUpcomingMovie', JSON.stringify(randomFilm));
    }

    // Create HTML structure
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

  // Update button text and style when clicked
  libraryBtn.addEventListener('click', () => {
    toggleLibrary(movie);
  });

  libraryBtn.addEventListener('mouseenter', () => {
    if (!libraryBtn.classList.contains('clicked')) {
      libraryBtn.classList.add('hovered');
    }
  });

  libraryBtn.addEventListener('mouseleave', () => {
    libraryBtn.classList.remove('hovered');
  });
}

// Notification for adding/removing from library
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
