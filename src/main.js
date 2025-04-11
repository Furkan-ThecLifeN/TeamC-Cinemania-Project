import './js/header.js';
import './js/weekly-trends.js';
import './js/upcoming-this-month.js';
import './js/footer.js';
import './js/pop-up-movie-card.js';
import './js/pop-up-trailer-card.js';
import { renderUpcomingSection } from './js/upcoming-this-month.js';
import { renderHeroSection } from './js/hero.js';

renderHeroSection();

renderUpcomingSection();

export async function setup() {
  await loadHTML('#header-placeholder', './partials/header.html');
  await loadHTML('#hero-placeholder', './partials/hero.html');
}

async function loadHTML(selector, url) {
  const res = await fetch(url);
  const html = await res.text();
  document.querySelector(selector).innerHTML = html;
}



