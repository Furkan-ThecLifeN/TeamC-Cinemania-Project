import './js/favorite-movies';
import './js/pop-up-movie-card';
import './js/pop-up-trailer-card';
import './js/catalog';
import './js/weekly-trends';
import './js/footer';
import { renderUpcomingSection } from './js/upcoming-this-month.js';

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
