import { fetchMovies, BASE_URL } from './fetchMovies';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.modal-trailer');
  const closeBtn = modal.querySelector('.modal-trailer__close');
  const iframe = modal.querySelector('.modal-trailer__video');

  // Video durdur
  function stopVideo() {
    iframe.src = '';
  }

  // Modal kapat
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    stopVideo();
  }

  // Modal aç
  function openModal(movieId) {
    if (!movieId) {
      console.warn('Movie ID not provided!');
      return;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    fetchMovies(BASE_URL, `/movie/${movieId}/videos`)
      .then(videoData => {
        const officialTrailer = videoData.results.find(
          video =>
            video.official === true &&
            video.site === 'YouTube' &&
            video.type === 'Trailer'
        );

        if (officialTrailer) {
          iframe.src = `https://www.youtube.com/embed/${officialTrailer.key}`;
        } else {
          console.log('No official YouTube trailer found.');
        }
      })
      .catch(err => {
        console.error('Trailer fetch error:', err);
      });
  }

  // Butonlar için dinleyici
  document.body.addEventListener('click', e => {
    const target = e.target;

    if (target.id === 'watch-trailer-btn') {
      e.preventDefault();
      const movieId = target.dataset.id;
      openModal(movieId);
    }

    if (target === closeBtn) {
      e.preventDefault();
      closeModal();
    }
  });

  // Modal dışına tıklama ile kapatma
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC ile kapatma
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Global erişim için
  window.trailerModal = {
    open: openModal,
    close: closeModal,
  };
});
