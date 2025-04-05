import axios from 'axios';
import iziToast from 'izitoast';
// Stil importu
import 'izitoast/dist/css/iziToast.min.css';
const container = document.getElementById('film-list');
const myFilms = document.querySelector('.my-films');
const loadBtn = document.querySelector('.load-btn');

const library = [];

let page = 1;
let perPage = 8;

// Filmleri listele

function listFilms(films) {
  myFilms.innerHTML = '';
  films.map(film => {
    const li = document.createElement('li');
    li.classList.add('film');
    li.innerHTML = `<a href="#">
        <img src=""/></a>
        <h2 class="film-name"></h2>
        <p class="votes" >Vote/Votes</p>
        <p class="popularity" >Populrity/Votes</p>
        <p class="genre" >Vote/Genre</p>
        <p class="about" >ABOUT/Votes</p>
        <button type="button">Remove From Library</button>`;
    myFilms.appendChild(li);
  });
}
