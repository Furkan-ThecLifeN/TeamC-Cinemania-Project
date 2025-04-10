document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('overlay');
  const notification = document.getElementById('notification');
  const libraryBtn = document.querySelector('.btn-upcoming');
  const libraryKey = 'myLibrary';

  // API'den gelen film verisini burada alalım
  const randomFilm = {
    id: 123, // Örnek film ID'si, gerçek API'den alınan değer ile değişecek
    title: 'Example Movie',
  };

  // Kütüphaneyi alalım
  let library = JSON.parse(localStorage.getItem(libraryKey)) || [];

  // Butona tıklama olayını dinleyelim
  libraryBtn.addEventListener('click', function () {
    // Film kütüphanede var mı kontrol edelim
    const isInLibrary = library.some(film => film.id === randomFilm.id);

    if (isInLibrary) {
      // Film çıkarıldığında kararma olmasın
      overlay.style.display = 'none';
      notification.classList.add('hidden');
    } else {
      // Film eklenince kararma ve bildirim göster
      overlay.style.display = 'block';
      notification.classList.remove('hidden');

      setTimeout(() => {
        overlay.style.display = 'none';
        notification.classList.add('hidden');
      }, 2000); // 2 saniye sonra gizle
    }

    // Film kütüphaneye ekleyip çıkarma işlemi
    if (isInLibrary) {
      library = library.filter(film => film.id !== randomFilm.id);
      libraryBtn.textContent = 'Add to My Library';
    } else {
      library.push(randomFilm);
      libraryBtn.textContent = 'Remove from My Library';
    }

    // Kütüphaneyi güncelle
    localStorage.setItem(libraryKey, JSON.stringify(library));
  });

  // Film verisi ve diğer işlemler API'den alınıyor (bu kısmı değiştirmedim)
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
                  overlay.classList.add('hidden'); // Overlay'i gizle
                  notification.classList.add('hidden'); // Bildirim kutusunu gizle
                }, 1000); // 1 saniye sonra gizle
              });
            }

            localStorage.setItem(libraryKey, JSON.stringify(library));
          });

          // Hover efekti
          libraryBtn.addEventListener('mouseenter', () => {
            if (libraryBtn.textContent === 'Add to My Library') {
              libraryBtn.classList.remove('default', 'clicked');
              libraryBtn.classList.add('hovered');
            }
          });

          // Fare çekilince sadece Add durumunda eski haline dön
          libraryBtn.addEventListener('mouseleave', () => {
            if (libraryBtn.textContent === 'Add to My Library') {
              libraryBtn.classList.remove('hovered', 'clicked');
              libraryBtn.classList.add('default');
            }
          });

          // Focus durumunda tekrar hover olmasını sağlamak
          libraryBtn.addEventListener('focus', () => {
            libraryBtn.classList.add('hovered');
          });

          // Hidden class'ı kaldırarak içerikleri göster
          document
            .querySelector('.upcoming-movie-card')
            .classList.remove('hidden');

          // Butonu görünür yap
          document
            .querySelector('.btn-upcoming')
            .classList.remove('hidden-button');
        })
        .catch(err => console.error('Film verisi alınamadı:', err));
    })
    .catch(err => console.error('Tür verisi alınamadı:', err));
});
