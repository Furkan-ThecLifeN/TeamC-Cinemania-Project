import { renderUpcomingSection } from './js/upcoming-this-month.js';

renderUpcomingSection();

export async function setup() {
  await loadHTML('#header-placeholder', './partials/header.html');
  await loadHTML('#hero-placeholder', './partials/hero.html');
  await loadHTML(
    '#upcoming-this-month-placeholder',
    './partials/upcoming-this-month.html'
  );
}

async function loadHTML(selector, url) {
  const res = await fetch(url);
  const html = await res.text();
  document.querySelector(selector).innerHTML = html;
}
