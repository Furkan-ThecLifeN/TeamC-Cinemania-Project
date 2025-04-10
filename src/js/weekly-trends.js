async function fetchWeeklyTrendingMovies() {
  const response = await fetch(
    'https://api.themoviedb.org/3/trending/movie/week?language=tr-TR',
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZWJmOWU4MzdkOWVmNGZlZDZiZTAzY2RlZTAyMTZiNSIsIm5iZiI6MTc0MjkxNzcyNC4zOTYsInN1YiI6IjY3ZTJkMDVjZDcwYzYxNTkwMzc1ZTgzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mGfFevHBMVfVG3Aha3atAbsBAX0sx3BUJdHGcEDZwAk',
      },
    }
  );

  const data = await response.json();
  return data.results;
}

const genreMap = {
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

function getGenreNames(genreIds) {
  return genreIds.map(id => genreMap[id] || 'Bilinmeyen').join(', ');
}

function createStarRating(rating) {
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 !== 0 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fa-solid fa-star"></i>';
  }
  if (halfStar) {
    stars += '<i class="fa-solid fa-star-half"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="fa-regular fa-star"></i>';
  }

  return stars;
}

async function loadTrendingMovies() {
  const movies = await fetchWeeklyTrendingMovies();
  if (!movies || movies.length === 0) return;

  const moviesContainer = document.querySelector('.weekly-movies-container');
  moviesContainer.innerHTML = '';

  const screenWidth = window.innerWidth;
  let numberOfMovies = 3;
  if (screenWidth <= 768) {
    numberOfMovies = 1;
  }

  const limitedMovies = movies.slice(0, numberOfMovies);

  limitedMovies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('weekly-trend-movie');

    const genreNames = getGenreNames(movie.genre_ids);

    movieElement.innerHTML = `
      <div class="title">
        <h3>${movie.title}</h3>
        <div class="movie-about">
          <div class="movie-title">
            <p>${genreNames}</p>
            <span> | </span>
            <span>${movie.release_date}</span>
          </div>

        </div>
        <div class="star-bar">${createStarRating(movie.vote_average)}</div>
      </div>
    `;

    movieElement.style.background = `linear-gradient(to bottom, #00000000 0%, #000000 100%), url('https://image.tmdb.org/t/p/w500${movie.poster_path}')`;
    movieElement.style.backgroundSize = 'cover';
    movieElement.style.backgroundPosition = 'center';
    movieElement.style.backgroundRepeat = 'no-repeat';

    moviesContainer.appendChild(movieElement);
  });
}

window.addEventListener('resize', loadTrendingMovies);

loadTrendingMovies();
