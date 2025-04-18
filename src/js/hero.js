const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const API_KEY = '0f552bbb3a7946c71382d336324ac39a';

export async function getTrendingToday() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

export async function renderHeroSection() {
  const container = document.getElementById('hero-section');
  if (!container) return;

  try {
    const movies = await getTrendingToday();

    if (!movies || movies.length === 0) {
      renderFallback(container);
      return;
    }

    const movie = movies[Math.floor(Math.random() * movies.length)];

    container.style.backgroundImage = `url('${IMAGE_BASE_URL}${movie.backdrop_path}')`;
    container.innerHTML = `
      <div class="hero-content" data-movieid="${movie.id}">
        <h1 class="hero-title">${movie.title}</h1>
        <p class="hero-rating">${getStarRating(movie.vote_average)}</p>
        <p class="hero-overview">
          ${movie.overview?.slice(0, 200) || 'No description available.'}
        </p>
        <div class="hero-buttons">
          <button class="hero-button" id="more-details-btn" data-id="${movie.id}">
            More details
          </button>
            <button type="button" class="hero-button" id="watch-trailer-btn" data-id="${movie.id}">

          Watch trailer
          </button>
        </div>
      </div>
    `;

    // ▶ More details modalını aç
    document
      .getElementById('more-details-btn')
      .addEventListener('click', () => {
        const movieId = movie.id;
        if (window.movieModal && typeof window.movieModal.show === 'function') {
          window.movieModal.show(movieId);
        } else {
          console.warn('movieModal.show fonksiyonu bulunamadı.');
        }
      });

    document
  .getElementById('watch-trailer-btn')
  .addEventListener('click', (e) => {
    e.preventDefault(); 
    const movieId = movie.id;
    if (window.trailerModal && typeof window.trailerModal.open === 'function') {
      const heroContainer = document.querySelector('.hero');
      if (heroContainer) {
        heroContainer.dataset.movieid = movieId;
      }
      window.trailerModal.open();
    }
  });


  } catch (err) {
    console.error('Error occurred:', err);
    renderFallback(container);
  }
}

function getStarRating(voteAverage) {
  const rating = voteAverage / 2;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = '';

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<span class="star full">★</span>';
  }

  if (hasHalfStar) {
    starsHTML += '<span class="star half">★</span>';
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<span class="star empty">☆</span>';
  }

  return starsHTML;
}

function renderFallback(container) {
  container.style.backgroundImage = `url('../img/heroDefault.png')`;
  container.innerHTML = `
    <div class="hero-content">
      <h1 class="hero-title">Welcome to Cinemania</h1>
      <p class="hero-overview">Discover the hottest movies trending today.</p>
      <div class="hero-buttons">
        <a href="/catalog.html" class="hero-button">Get Started</a>
      </div>
    </div>
  `;
}
