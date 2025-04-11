import './js/header';
import { initializeLibrary } from './js/favorite-movies';


document.addEventListener('DOMContentLoaded', () => {
    // Initialize the hero section
    if (document.getElementById('hero-section')) {
      renderHeroSection();
    }
    
    // Initialize the movie library
    if (document.getElementById('film-list')) {
      initializeLibrary();
    }
  });
  