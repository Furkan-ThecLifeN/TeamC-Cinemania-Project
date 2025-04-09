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

        const randomFilm = films[Math.floor(Math.random() * films.length)];
        console.log('Seçilen film:', randomFilm);

        document.querySelector(
          '.movie-poster'
        ).src = `https://image.tmdb.org/t/p/original${randomFilm.backdrop_path}`;
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
        document.querySelector('.movieabout').textContent = randomFilm.overview;

        const libraryBtn = document.querySelector('.btn-upcoming');
        const libraryKey = 'myLibrary';
        let library = JSON.parse(localStorage.getItem(libraryKey)) || [];

        const isInLibrary = library.some(film => film.id === randomFilm.id);
        libraryBtn.textContent = isInLibrary
          ? 'Remove from My Library'
          : 'Add to My Library';

        libraryBtn.addEventListener('click', () => {
          if (library.some(film => film.id === randomFilm.id)) {
            library = library.filter(film => film.id !== randomFilm.id);
            libraryBtn.textContent = 'Add to My Library';
          } else {
            library.push(randomFilm);
            libraryBtn.textContent = 'Remove from My Library';
          }

          localStorage.setItem(libraryKey, JSON.stringify(library));
        });
      })
      .catch(err => console.error('Film verisi alınamadı:', err));
  })
  .catch(err => console.error('Tür verisi alınamadı:', err));

const toggleBtn = document.getElementById('themeToggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});
