import './js/header';
import './js/catalog';
import './js/weekly-trends';
import './js/footer';import { renderHeroSection } from './js/hero.js';

renderHeroSection();


export async function setup() {
    await loadHTML('#header-placeholder', './partials/header.html');
    await loadHTML('#hero-placeholder', './partials/hero.html');
  }

  async function loadHTML(selector, url) {
    const res = await fetch(url);
    const html = await res.text();
    document.querySelector(selector).innerHTML = html;
  }
