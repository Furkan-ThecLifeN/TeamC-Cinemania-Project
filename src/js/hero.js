import { getTrendingToday, IMAGE_BASE_URL } from '../js/heroTmdb';

export async function renderHeroSection() {
  const container = document.getElementById('hero-section');
  try {
    const movies = await getTrendingToday();

    if (!movies || movies.length === 0) {
      renderFallback(container);
      return;
    }

    const movie = movies[Math.floor(Math.random() * movies.length)];

    container.style.backgroundImage = `url('${IMAGE_BASE_URL}${movie.backdrop_path}')`;
    container.innerHTML = `
      <div class="hero-content">
        <h1 class="hero-title">${movie.title}</h1>
        <p class="hero-rating">${getStarRating(movie.vote_average)}</p>
        <p class="hero-overview">${movie.overview?.slice(0, 200) || 'No description available.'}</p>
        <div class="hero-buttons">
          <button class="hero-button" data-id="${movie.id}" id="more-details-btn">More details</button>
          <button class="hero-button" data-id="${movie.id}" id="watch-trailer-btn">Watch trailer</button>
        </div>
      </div>
    `;



    function getStarRating(voteAverage) {
        const rating = voteAverage / 2; // 10 üzerinden 5'e indir
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
      


    document.getElementById('more-details-btn').addEventListener('click', () => {
      const event = new CustomEvent('openDetailsModal', { detail: { id: movie.id } });
      window.dispatchEvent(event);
    });

    document.getElementById('watch-trailer-btn').addEventListener('click', () => {
      const event = new CustomEvent('openTrailerModal', { detail: { id: movie.id } });
      window.dispatchEvent(event);
    });

  } catch (err) {
    console.error('Hata oluştu:', err);
    renderFallback(container);
  }
}

function renderFallback(container) {
  container.style.backgroundImage = `url('/default-hero.jpg')`; // Projeye varsayılan bir görsel ekle
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

