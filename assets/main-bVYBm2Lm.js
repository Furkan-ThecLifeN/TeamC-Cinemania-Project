(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function o(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=o(a);fetch(a.href,r)}})();document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".modal-details"),t=e.querySelector(".modal-details__close"),o=e.querySelector(".modal-details__library-btn");let n=null;const a={28:"Action",12:"Adventure",16:"Animation",35:"Comedy",80:"Crime",99:"Documentary",18:"Drama",10751:"Family",14:"Fantasy",36:"History",27:"Horror",10402:"Music",9648:"Mystery",10749:"Romance",878:"Sci-Fi",10770:"TV Movie",53:"Thriller",10752:"War",37:"Western"};function r(){return JSON.parse(localStorage.getItem("library"))||[]}function i(s){localStorage.setItem("library",JSON.stringify(s))}function d(s){return r().some(c=>c.id===s)}function u(s){const c=d(s);o.textContent=c?"Remove from library":"Add to library",o.dataset.action=c?"remove":"add"}function f(s){const c=r(),m=c.findIndex(l=>l.id===s.id);!s.genres&&s.genre_ids&&(s.genres=s.genre_ids.map(l=>({id:l,name:a[l]||"Unknown"}))),m===-1?c.push(s):c.splice(m,1),i(c),u(s.id),typeof window.refreshLibrary=="function"&&window.refreshLibrary()}async function g(s){const m=`https://api.themoviedb.org/3/movie/${s}?api_key=f1a0a8dd870a150fcd20cd47eff55f54&language=en-US`;try{const l=await fetch(m);return l.ok?await l.json():null}catch(l){return console.error("Film verisi alınamadı:",l),null}}async function w(s){const c=await g(s);c&&(n=c.id,e.querySelector(".modal-details__image").src=`https://image.tmdb.org/t/p/w500${c.poster_path}`,e.querySelector(".modal-details__image").alt=c.title,e.querySelector(".modal-details__title").textContent=c.title,e.querySelector(".modal-details__vote").textContent=c.vote_average.toFixed(1),e.querySelector(".modal-details__votes").textContent=c.vote_count,e.querySelector(".modal-details__popularity").textContent=c.popularity.toFixed(1),e.querySelector(".modal-details__genre").textContent=c.genres?c.genres.map(m=>m.name).join(", "):c.genre_ids.map(m=>a[m]||"Unknown").join(", "),e.querySelector(".modal-details__about-text").textContent=c.overview,u(c.id),e.classList.add("active"),document.body.style.overflow="hidden")}function p(){e.classList.remove("active"),document.body.style.overflow="auto"}t.addEventListener("click",p),e.addEventListener("click",s=>s.target===e&&p()),document.addEventListener("keydown",s=>s.key==="Escape"&&p()),o.addEventListener("click",async()=>{if(!n)return;const s=await g(n);s&&f(s)}),window.movieModal={show:w,close:p}});const O="f1a0a8dd870a150fcd20cd47eff55f54",q="https://api.themoviedb.org/3";async function D(e,t,o={}){const n=new URL(e+t);n.searchParams.append("api_key",O),n.searchParams.append("language","en-US"),Object.entries(o).forEach(([a,r])=>{n.searchParams.append(a,r)});try{const a=await fetch(n);if(!a.ok)throw new Error(`API error: ${a.status}`);return await a.json()}catch(a){return console.error("fetchMovies error:",a),{results:[]}}}document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".modal-trailer"),t=e.querySelector(".modal-trailer__close"),o=e.querySelector(".modal-trailer__video");function n(){o.src=""}function a(){e.classList.remove("active"),document.body.style.overflow="auto",n()}function r(i){if(!i){console.warn("Movie ID not provided!");return}e.classList.add("active"),document.body.style.overflow="hidden",D(q,`/movie/${i}/videos`).then(d=>{const u=d.results.find(f=>f.official===!0&&f.site==="YouTube"&&f.type==="Trailer");u?o.src=`https://www.youtube.com/embed/${u.key}`:console.log("No official YouTube trailer found.")}).catch(d=>{console.error("Trailer fetch error:",d)})}document.body.addEventListener("click",i=>{const d=i.target;if(d.id==="watch-trailer-btn"){i.preventDefault();const u=d.dataset.id;r(u)}d===t&&(i.preventDefault(),a())}),e.addEventListener("click",i=>{i.target===e&&a()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&e.classList.contains("active")&&a()}),window.trailerModal={open:r,close:a}});const x="https://image.tmdb.org/t/p/original",N="0f552bbb3a7946c71382d336324ac39a";async function F(){try{return(await(await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${N}`)).json()).results}catch(e){return console.error("Error fetching trending movies:",e),[]}}async function S(){var t;const e=document.getElementById("hero-section");if(e)try{const o=await F();if(!o||o.length===0){L(e);return}const n=o[Math.floor(Math.random()*o.length)];e.style.backgroundImage=`url('${x}${n.backdrop_path}')`,e.innerHTML=`
      <div class="hero-content" data-movieid="${n.id}">
        <h1 class="hero-title">${n.title}</h1>
        <p class="hero-rating">${j(n.vote_average)}</p>
        <p class="hero-overview">
          ${((t=n.overview)==null?void 0:t.slice(0,200))||"No description available."}
        </p>
        <div class="hero-buttons">
          <button class="hero-button" id="more-details-btn" data-id="${n.id}">
            More details
          </button>
            <button type="button" class="hero-button" id="watch-trailer-btn" data-id="${n.id}">

          Watch trailer
          </button>
        </div>
      </div>
    `,document.getElementById("more-details-btn").addEventListener("click",()=>{const a=n.id;window.movieModal&&typeof window.movieModal.show=="function"?window.movieModal.show(a):console.warn("movieModal.show fonksiyonu bulunamadı.")}),document.getElementById("watch-trailer-btn").addEventListener("click",a=>{a.preventDefault();const r=n.id;if(window.trailerModal&&typeof window.trailerModal.open=="function"){const i=document.querySelector(".hero");i&&(i.dataset.movieid=r),window.trailerModal.open()}})}catch(o){console.error("Error occurred:",o),L(e)}}function j(e){const t=e/2,o=Math.floor(t),n=t%1>=.25&&t%1<=.75,a=5-o-(n?1:0);let r="";for(let i=0;i<o;i++)r+='<span class="star full">★</span>';n&&(r+='<span class="star half">★</span>');for(let i=0;i<a;i++)r+='<span class="star empty">☆</span>';return r}function L(e){e.style.backgroundImage="url('../img/heroDefault.png')",e.innerHTML=`
    <div class="hero-content">
      <h1 class="hero-title">Welcome to Cinemania</h1>
      <p class="hero-overview">Discover the hottest movies trending today.</p>
      <div class="hero-buttons">
        <a href="/catalog.html" class="hero-button">Get Started</a>
      </div>
    </div>
  `}const J="https://image.tmdb.org/t/p/original";function E(){return JSON.parse(localStorage.getItem("library"))||[]}function H(e){localStorage.setItem("library",JSON.stringify(e))}function P(e){const t=E(),o=t.findIndex(n=>n.id===e.id);o===-1?t.push(e):t.splice(o,1),H(t),R(e.id),z()}function R(e){const t=document.querySelector(".btn-upcoming"),n=E().some(a=>a.id===e);t.textContent=n?"Remove from my library":"Add to my library",t.classList.toggle("clicked",n),t.classList.toggle("default",!n)}async function k(){const e=document.getElementById("upcoming-section");if(e)try{const t=new Date,o=t.getFullYear(),n=String(t.getMonth()+1).padStart(2,"0"),a=`${o}-${n}-01`,r=new Date(o,n,0).getDate(),i=`${o}-${n}-${r}`,d="04c35731a5ee918f014970082a0088b1",u="https://api.themoviedb.org/3",f={};(await(await fetch(`${u}/genre/movie/list?api_key=${d}`)).json()).genres.forEach(y=>{f[y.id]=y.name});const p=`${u}/discover/movie?api_key=${d}&primary_release_date.gte=${a}&primary_release_date.lte=${i}&sort_by=popularity.desc`,m=(await(await fetch(p)).json()).results;if(!m||m.length===0){e.innerHTML='<p id="no-movie-message">No movies found for this month.</p>';return}let l=JSON.parse(localStorage.getItem("featuredUpcomingMovie"));l||(l=m[Math.floor(Math.random()*m.length)],localStorage.setItem("featuredUpcomingMovie",JSON.stringify(l))),e.innerHTML=`
      <h2>UPCOMING THIS MONTH</h2>
      <div class="upcoming-movie-card">
        <div class="movie-poster" style="background-image: url(${J}${l.backdrop_path})"></div>
        <div class="movie-details">
          <h3 class="upcoming-movie-name">${l.title}</h3>
          
          <div class="movie-info">
            <div class="info-row">
              <span class="info-label">Release date</span>
              <span class="info-date-value">${l.release_date}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Vote / Votes</span>
              <div class="votes-container">
                <span class="vote-box">${l.vote_average.toFixed(1)}</span>
                <span class="vote-box">${l.vote_count}</span>
              </div>
            </div>
            
            <div class="info-row">
              <span class="info-label">Popularity</span>
              <span class="info-popularity-value">${Math.round(l.popularity)}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Genre</span>
              <span class="info-genre-value">${l.genre_ids.map(y=>f[y]).join(", ")}</span>
            </div>
          </div>
          
          <div class="about-section">
            <h4>ABOUT</h4>
            <p class="movieabout">${l.overview}</p>
          </div>
          
          <button class="btn-upcoming">Add to my library</button>
        </div>
      </div>
    `,U(l)}catch(t){console.error("Error:",t),e.innerHTML="<p>An error occurred. Please try again later.</p>"}}function U(e){const t=document.querySelector(".btn-upcoming");t&&(t.addEventListener("click",()=>{P(e)}),t.addEventListener("mouseenter",()=>{t.classList.contains("clicked")||t.classList.add("hovered")}),t.addEventListener("mouseleave",()=>{t.classList.remove("hovered")}))}function z(){const e=document.getElementById("overlay"),t=document.getElementById("notification");!e||!t||(e.classList.remove("hidden"),t.classList.remove("hidden"),setTimeout(()=>{e.classList.add("hidden"),t.classList.add("hidden")},2e3))}document.addEventListener("DOMContentLoaded",()=>{k()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("theme-switcher");if(!e){console.error("theme-switcher elementi bulunamadı!");return}e.addEventListener("click",()=>{document.body.classList.toggle("dark-mode")});const t=document.querySelector(".btn"),o=document.querySelector(".navbar");t.addEventListener("click",()=>{o.classList.toggle("active")});const n=document.querySelectorAll(".nav-menu a");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(d=>d.classList.remove("active")),i.classList.add("active")})});const a=window.location.pathname.split("/").pop(),r=Array.from(n).find(i=>i.href.includes(a));r&&r.classList.add("active")});async function G(){return(await(await fetch("https://api.themoviedb.org/3/trending/movie/week?language=tr-TR",{method:"GET",headers:{accept:"application/json",Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZWJmOWU4MzdkOWVmNGZlZDZiZTAzY2RlZTAyMTZiNSIsIm5iZiI6MTc0MjkxNzcyNC4zOTYsInN1YiI6IjY3ZTJkMDVjZDcwYzYxNTkwMzc1ZTgzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mGfFevHBMVfVG3Aha3atAbsBAX0sx3BUJdHGcEDZwAk"}})).json()).results}const W={28:"Aksiyon",12:"Macera",16:"Animasyon",35:"Komedi",80:"Suç",99:"Belgesel",18:"Dram",10751:"Aile",14:"Fantastik",36:"Tarih",27:"Korku",10402:"Müzik",9648:"Gizem",10749:"Romantik",878:"Bilim Kurgu",10770:"TV Filmi",53:"Gerilim",10752:"Savaş",37:"Western"};function Y(e){return e.map(t=>W[t]||"Bilinmeyen").join(", ")}function Z(e){const t=Math.floor(e/2),o=e%2!==0?1:0,n=5-t-o;let a="";for(let r=0;r<t;r++)a+='<i class="fa-solid fa-star"></i>';o&&(a+='<i class="fa-solid fa-star-half"></i>');for(let r=0;r<n;r++)a+='<i class="fa-regular fa-star"></i>';return a}async function I(){try{const e=await G();if(!e||e.length===0){console.error("Film verileri alınamadı veya boş dizi döndü");return}const t=document.querySelector(".weekly-movies-container");if(!t){console.error(".weekly-movies-container elementi bulunamadı");return}t.innerHTML="";const o=window.innerWidth;let n=3;o<=768&&(n=1);const a=e.slice(0,n);a.forEach(r=>{const i=document.createElement("div");i.classList.add("weekly-trend-movie"),i.dataset.movieid=r.id;const d=Y(r.genre_ids);i.innerHTML=`
        <div class="title">
          <h3>${r.title}</h3>
          <div class="movie-about">
            <div class="movie-title">
              <p>${d}</p>
              <span> | </span>
              <span>${r.release_date}</span>
            </div>
          </div>
          <div class="star-bar">${Z(r.vote_average)}</div>
        </div>
      `,i.style.background=`linear-gradient(to bottom, #00000000 0%, #000000 100%), url('https://image.tmdb.org/t/p/w500${r.poster_path}')`,i.style.backgroundSize="cover",i.style.backgroundPosition="center",i.style.backgroundRepeat="no-repeat",i.addEventListener("click",()=>{console.log("Film afiş tıklaması - Film ID:",r.id),window.movieModal&&typeof window.movieModal.show=="function"?window.movieModal.show(r.id):console.warn("movieModal.show fonksiyonu bulunamadı.")}),t.appendChild(i)}),console.log(`${a.length} adet film başarıyla yüklendi`)}catch(e){console.error("Film yüklenirken hata oluştu:",e)}}document.addEventListener("DOMContentLoaded",()=>{I()});window.addEventListener("resize",I);const K=async()=>{const e=document.getElementById("footer");if(e)try{e.innerHTML=await fetch("./partials/footer.html").then(t=>t.text())}catch(t){console.error("Footer yükleme hatası:",t)}};window.addEventListener("load",K);const $="0f552bbb3a7946c71382d336324ac39a",T={28:"Aksiyon",12:"Macera",16:"Animasyon",35:"Komedi",80:"Suç",99:"Belgesel",18:"Dram",10751:"Aile",14:"Fantastik",36:"Tarih",27:"Korku",10402:"Müzik",9648:"Gizem",10749:"Romantik",878:"Bilim Kurgu",10770:"TV Filmi",53:"Gerilim",10752:"Savaş",37:"Western"};let B=1;function C(){document.getElementById("film-list"),document.getElementById("empty-message");const e=JSON.parse(localStorage.getItem("library"))||[];e.length===0?b():v(e),V()}document.addEventListener("DOMContentLoaded",()=>{C()});function V(){const e=document.querySelector(".load-btn");e&&e.addEventListener("click",()=>{B++,A()}),document.addEventListener("click",t=>{if(t.target.classList.contains("add-remote-btn")){const o=parseInt(t.target.dataset.id);ee(o)?te(o):addToLibrary(o)}if(t.target.classList.contains("movieCard")){const o=t.target.dataset.id;Q(o)}})}async function Q(e){const t=await X(e);if(!t)return;const o=document.querySelector(".modal-details");o&&(o.querySelector(".modal-details__image").src=`https://image.tmdb.org/t/p/w500${t.poster_path}`,o.querySelector(".modal-details__image").alt=t.title,o.querySelector(".modal-details__title").textContent=t.title,o.querySelector(".modal-details__vote").textContent=t.vote_average.toFixed(1),o.querySelector(".modal-details__votes").textContent=t.vote_count,o.querySelector(".modal-details__popularity").textContent=t.popularity.toFixed(1),o.querySelector(".modal-details__genre").textContent=t.genres?t.genres.map(n=>n.name).join(", "):t.genre_ids.map(n=>T[n]||"Unknown").join(", "),o.querySelector(".modal-details__about-text").textContent=t.overview,updateLibraryButton(t.id),o.classList.add("active"),document.body.style.overflow="hidden")}function h(){document.querySelector(".modal-details").classList.remove("active"),document.body.style.overflow="auto"}var _;(_=document.querySelector(".modal-details__close"))==null||_.addEventListener("click",h);var M;(M=document.querySelector(".modal-details"))==null||M.addEventListener("click",e=>e.target===e.currentTarget&&h());document.addEventListener("keydown",e=>e.key==="Escape"&&h());async function X(e){try{return await(await fetch(`https://api.themoviedb.org/3/movie/${e}?api_key=${$}`)).json()}catch(t){console.error("Movie details fetching error:",t)}}async function A(){try{const t=await(await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${$}&page=${B}`)).json();v(t.results)}catch(e){console.error("Could not fetch movie data:",e)}}function v(e){const t=document.getElementById("film-list"),o=document.getElementById("empty-message");t&&(t.innerHTML="",o&&(o.innerHTML=""),e.forEach(n=>{n.genre_ids=n.genre_ids||(n.genres?n.genres.map(u=>u.id):[]);const a=document.createElement("li"),r=document.createElement("div"),i=Math.round(n.vote_average/2),d="★".repeat(i)+"☆".repeat(5-i);r.innerHTML=`
      <div class="movie-image-container">
        <img class="movie-image" alt="${n.original_title}" src="https://image.tmdb.org/t/p/w500/${n.poster_path}"/>
      </div>
      <h3>${n.original_title}</h3>
      <div class="card-down"><span class="left-info">${n.genre_ids.map(u=>T[u]).join(",")} | ${n.release_date?n.release_date.split("-")[0]:"N/A"}</span><span class="stars">${d}</span>
      </div>`,a.classList.add("movieCard"),r.classList.add("filmCard"),a.dataset.id=n.id,a.appendChild(r),t.appendChild(a)}))}function b(){const e=document.getElementById("empty-message");if(!e)return;const t=`
    <p class="markup">
      <span>OOOPS..</span>
      <span>We are very sorry!</span>
      <span>You don't have any movies at your library</span>
    </p>
    <button type="button" class="searchBtn">Search Movie</button>
  `;e.innerHTML=t,setTimeout(()=>{const o=document.querySelector(".searchBtn");o&&o.addEventListener("click",()=>{A()})},0)}function ee(e){return(JSON.parse(localStorage.getItem("library"))||[]).some(o=>o.id===e)}function te(e){const o=(JSON.parse(localStorage.getItem("library"))||[]).filter(n=>n.id!==e);localStorage.setItem("library",JSON.stringify(o)),o.length===0?b():v(o)}window.refreshLibrary=()=>{const e=JSON.parse(localStorage.getItem("library"))||[];e.length===0?b():v(e)};k();S();document.addEventListener("DOMContentLoaded",()=>{document.getElementById("hero-section")&&S(),document.getElementById("film-list")&&C()});
//# sourceMappingURL=main-bVYBm2Lm.js.map
