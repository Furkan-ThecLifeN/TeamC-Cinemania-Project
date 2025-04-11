import { fetchMovies, BASE_URL } from './fetchMovies';

document.addEventListener('DOMContentLoaded', () => {
  const heroTrailerId = document.querySelector('.hero'); // film id'si data-movieid içinde olmalı
  const modal = document.querySelector('.modal-trailer');
  const closeBtn = modal.querySelector('.modal-trailer__close');
  const watchTrailerBtn = document.querySelector('.hero-button-watchTrailer');
  const iframe = modal.querySelector('.modal-trailer__video');

  function stopVideo() {
    const videoSrc = iframe.src;
    iframe.src = videoSrc;
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    stopVideo();
  }

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const movieId = heroTrailerId.dataset.movieid;

    fetchMovies(BASE_URL, `/movie/${movieId}/videos`).then(videoData => {
      const officialTrailer = videoData.results.find(
        video =>
          video.official === true &&
          video.site === 'YouTube' &&
          video.type === 'Trailer'
      );

      if (officialTrailer) {
        const youtubeUrl = `https://www.youtube.com/embed/${officialTrailer.key}`;
        iframe.src = youtubeUrl;
      } else {
        console.log('No official YouTube trailer found.');
      }
    });
  }

  if (watchTrailerBtn) {
    watchTrailerBtn.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', e => {
      e.preventDefault();
      closeModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  window.trailerModal = {
    open: openModal,
    close: closeModal,
  };
});
