import './js/pop-up-movie-card.js';
import './js/pop-up-trailer-card.js';
import { renderHeroSection } from './js/hero.js';
import { renderUpcomingSection } from './js/upcoming-this-month.js';
import './js/header.js';
import './js/weekly-trends.js';
import './js/footer.js';
import { initializeLibrary } from './js/favorite-movies';
renderUpcomingSection();

renderHeroSection();//


export async function setup() {
  await loadHTML('#header-placeholder', './partials/header.html');
  await loadHTML('#hero-placeholder', './partials/hero.html');
  await loadHTML(
    '#upcoming-this-month-placeholder',
    './partials/upcoming-this-month.html');
}

async function loadHTML(selector, url) {
  const res = await fetch(url);
  const html = await res.text();
  document.querySelector(selector).innerHTML = html;
}


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







