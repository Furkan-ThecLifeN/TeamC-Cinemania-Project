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

  try {
    const movies = await getTrendingToday();

    if (!movies || movies.length === 0) {
      container.innerHTML = '<p>Gösterilecek film bulunamadı.</p>';
      return;
    }

    const movie = movies[0];

    container.innerHTML = `
      <div class="upcoming-movie-card">
        <div class="movie-poster" style="background-image: url('${IMAGE_BASE_URL}${movie.backdrop_path}')"></div>
        <div class="movie-details">
          <h3 class="upcoming-movie-name">${movie.title}</h3>
          <p class="movieabout">${movie.overview}</p>
          <button class="btn-upcoming">Add to My Library</button>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Hata:', error);
    container.innerHTML = '<p>Bir hata oluştu. Lütfen tekrar deneyin.</p>';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('overlay');
  const notification = document.getElementById('notification');
  const libraryBtn = document.querySelector('.btn-upcoming');
  const libraryKey = 'myLibrary';

  const randomFilm = {
    id: 123,
    title: 'Example Movie',
  };

  let library = JSON.parse(localStorage.getItem(libraryKey)) || [];

  libraryBtn.addEventListener('click', function () {
    const isInLibrary = library.some(film => film.id === randomFilm.id);

    if (isInLibrary) {
      overlay.style.display = 'none';
      notification.classList.add('hidden');
    } else {
      overlay.style.display = 'block';
      notification.classList.remove('hidden');

      setTimeout(() => {
        overlay.style.display = 'none';
        notification.classList.add('hidden');
      }, 2000);
    }

    if (isInLibrary) {
      library = library.filter(film => film.id !== randomFilm.id);
      libraryBtn.textContent = 'Add to My Library';
    } else {
      library.push(randomFilm);
      libraryBtn.textContent = 'Remove from My Library';
    }

    localStorage.setItem(libraryKey, JSON.stringify(library));
  });

  const API_KEY = '04c35731a5ee918f014970082a0088b1';
  const BASE_URL = 'https://api.themoviedb.org/3';
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const firstDay = `${year}-${month}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const lastDayOfMonth = `${year}-${month}-${lastDay}`;

  const genreMap = {};

  fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      data.genres.forEach(genre => {
        genreMap[genre.id] = genre.name;
      });

      const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&primary_release_date.gte=${firstDay}&primary_release_date.lte=${lastDayOfMonth}&sort_by=popularity.desc`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          const films = data.results;

          if (!films || films.length === 0) {
            document
              .getElementById('no-movie-message')
              .classList.remove('movie-hidden');
            return;
          }

          let randomFilm = JSON.parse(
            localStorage.getItem('featuredUpcomingMovie')
          );

          if (!randomFilm) {
            randomFilm = films[Math.floor(Math.random() * films.length)];
            localStorage.setItem(
              'featuredUpcomingMovie',
              JSON.stringify(randomFilm)
            );
          }

          console.log('Seçilen film:', randomFilm);

          document.querySelector(
            '.movie-poster'
          ).style.backgroundImage = `url(https://image.tmdb.org/t/p/original${randomFilm.backdrop_path})`;

          document.querySelector('.upcoming-movie-name').textContent =
            randomFilm.title;
          document.querySelector('.info-date-value').textContent =
            randomFilm.release_date;
          document.querySelectorAll('.vote-box')[0].textContent =
            randomFilm.vote_average;
          document.querySelectorAll('.vote-box')[1].textContent =
            randomFilm.vote_count;
          document.querySelector('.info-popularity-value').textContent =
            Math.round(randomFilm.popularity);
          document.querySelector('.info-genre-value').textContent =
            randomFilm.genre_ids.map(id => genreMap[id]).join(', ');
          document.querySelector('.movieabout').textContent =
            randomFilm.overview;

          const libraryBtn = document.querySelector('.btn-upcoming');
          const libraryKey = 'myLibrary';
          let library = JSON.parse(localStorage.getItem(libraryKey)) || [];

          let isInLibrary = library.some(film => film.id === randomFilm.id);
          libraryBtn.textContent = isInLibrary
            ? 'Remove from My Library'
            : 'Add to My Library';

          libraryBtn.classList.add(isInLibrary ? 'clicked' : 'default');

          libraryBtn.addEventListener('click', () => {
            isInLibrary = library.some(film => film.id === randomFilm.id);

            if (isInLibrary) {
              library = library.filter(film => film.id !== randomFilm.id);
              libraryBtn.textContent = 'Add to My Library';
              libraryBtn.classList.remove('clicked', 'hovered');
              libraryBtn.classList.add('hovered');

              document.getElementById('overlay').classList.add('hidden');
              document.getElementById('notification').classList.add('hidden');
            } else {
              library.push({ id: randomFilm.id, title: randomFilm.title });
              libraryBtn.textContent = 'Remove from My Library';
              libraryBtn.classList.remove('default', 'hovered');
              libraryBtn.classList.add('clicked');

              document.addEventListener('DOMContentLoaded', function () {
                const overlay = document.getElementById('overlay');
                const notification = document.getElementById('notification');

                overlay.classList.remove('hidden');
                notification.classList.remove('hidden');

                setTimeout(() => {
                  overlay.classList.add('hidden');
                  notification.classList.add('hidden');
                }, 1000);
              });
            }

            localStorage.setItem(libraryKey, JSON.stringify(library));
          });

          libraryBtn.addEventListener('mouseenter', () => {
            if (libraryBtn.textContent === 'Add to My Library') {
              libraryBtn.classList.remove('default', 'clicked');
              libraryBtn.classList.add('hovered');
            }
          });

          libraryBtn.addEventListener('mouseleave', () => {
            if (libraryBtn.textContent === 'Add to My Library') {
              libraryBtn.classList.remove('hovered', 'clicked');
              libraryBtn.classList.add('default');
            }
          });

          libraryBtn.addEventListener('focus', () => {
            libraryBtn.classList.add('hovered');
          });

          document
            .querySelector('.upcoming-movie-card')
            .classList.remove('hidden');

          document
            .querySelector('.btn-upcoming')
            .classList.remove('hidden-button');
        })
        .catch(err => console.error('Film verisi alınamadı:', err));
    })
    .catch(err => console.error('Tür verisi alınamadı:', err));
});
