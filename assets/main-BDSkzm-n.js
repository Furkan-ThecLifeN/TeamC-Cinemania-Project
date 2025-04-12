(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function r(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(o){if(o.ep)return;o.ep=!0;const n=r(o);fetch(o.href,n)}})();document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".modal-details"),t=e.querySelector(".modal-details__close"),r=e.querySelector(".modal-details__library-btn");let a=null;const o={28:"Action",12:"Adventure",16:"Animation",35:"Comedy",80:"Crime",99:"Documentary",18:"Drama",10751:"Family",14:"Fantasy",36:"History",27:"Horror",10402:"Music",9648:"Mystery",10749:"Romance",878:"Sci-Fi",10770:"TV Movie",53:"Thriller",10752:"War",37:"Western"};JSON.parse(localStorage.getItem("myLibrary"));function n(){e.classList.remove("active"),document.body.style.overflow="auto"}t.addEventListener("click",n),e.addEventListener("click",s=>s.target===e&&n()),document.addEventListener("keydown",s=>s.key==="Escape"&&n());function i(){return JSON.parse(localStorage.getItem("myLibrary"))||[]}function d(s){localStorage.setItem("myLibrary",JSON.stringify(s))}function u(s){return i().some(c=>c.id===s)}function p(s){const c=u(s);r.textContent=c?"Remove from library":"Add to library",r.dataset.action=c?"remove":"add"}function h(s){const c=i(),m=c.findIndex(l=>l.id===s.id);!s.genres&&s.genre_ids&&(s.genres=s.genre_ids.map(l=>({id:l,name:o[l]||"Unknown"}))),m===-1?c.push(s):c.splice(m,1),d(c),p(s.id)}r.addEventListener("click",async()=>{if(!a)return;const s=await y(a);s&&h(s)});async function y(s){const m=`https://api.themoviedb.org/3/movie/${s}?api_key=f1a0a8dd870a150fcd20cd47eff55f54&language=en-US`;try{const l=await fetch(m);return l.ok?await l.json():null}catch(l){return console.error("Film verisi alınamadı:",l),null}}async function v(s){const c=await y(s);c&&(a=c.id,e.querySelector(".modal-details__image").src=`https://image.tmdb.org/t/p/w500${c.poster_path}`,e.querySelector(".modal-details__image").alt=c.title,e.querySelector(".modal-details__title").textContent=c.title,e.querySelector(".modal-details__vote").textContent=c.vote_average.toFixed(1),e.querySelector(".modal-details__votes").textContent=c.vote_count,e.querySelector(".modal-details__popularity").textContent=c.popularity.toFixed(1),e.querySelector(".modal-details__genre").textContent=c.genres.map(m=>m.name).join(", "),e.querySelector(".modal-details__about-text").textContent=c.overview,p(c.id),e.classList.add("active"),document.body.style.overflow="hidden")}window.movieModal={show:v,close:n}});const I="f1a0a8dd870a150fcd20cd47eff55f54",$="https://api.themoviedb.org/3";async function T(e,t,r={}){const a=new URL(e+t);a.searchParams.append("api_key",I),a.searchParams.append("language","en-US"),Object.entries(r).forEach(([o,n])=>{a.searchParams.append(o,n)});try{const o=await fetch(a);if(!o.ok)throw new Error(`API error: ${o.status}`);return await o.json()}catch(o){return console.error("fetchMovies error:",o),{results:[]}}}document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".modal-trailer"),t=e.querySelector(".modal-trailer__close"),r=e.querySelector(".modal-trailer__video");function a(){r.src=""}function o(){e.classList.remove("active"),document.body.style.overflow="auto",a()}function n(i){if(!i){console.warn("Movie ID not provided!");return}e.classList.add("active"),document.body.style.overflow="hidden",T($,`/movie/${i}/videos`).then(d=>{const u=d.results.find(p=>p.official===!0&&p.site==="YouTube"&&p.type==="Trailer");u?r.src=`https://www.youtube.com/embed/${u.key}`:console.log("No official YouTube trailer found.")}).catch(d=>{console.error("Trailer fetch error:",d)})}document.body.addEventListener("click",i=>{const d=i.target;if(d.id==="watch-trailer-btn"){i.preventDefault();const u=d.dataset.id;n(u)}d===t&&(i.preventDefault(),o())}),e.addEventListener("click",i=>{i.target===e&&o()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&e.classList.contains("active")&&o()}),window.trailerModal={open:n,close:o}});const B="https://image.tmdb.org/t/p/original",A="0f552bbb3a7946c71382d336324ac39a";async function O(){try{return(await(await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${A}`)).json()).results}catch(e){return console.error("Error fetching trending movies:",e),[]}}async function L(){var t;const e=document.getElementById("hero-section");if(e)try{const r=await O();if(!r||r.length===0){b(e);return}const a=r[Math.floor(Math.random()*r.length)];e.style.backgroundImage=`url('${B}${a.backdrop_path}')`,e.innerHTML=`
      <div class="hero-content" data-movieid="${a.id}">
        <h1 class="hero-title">${a.title}</h1>
        <p class="hero-rating">${C(a.vote_average)}</p>
        <p class="hero-overview">
          ${((t=a.overview)==null?void 0:t.slice(0,200))||"No description available."}
        </p>
        <div class="hero-buttons">
          <button class="hero-button" id="more-details-btn" data-id="${a.id}">
            More details
          </button>
            <button type="button" class="hero-button" id="watch-trailer-btn" data-id="${a.id}">

          Watch trailer
          </button>
        </div>
      </div>
    `,document.getElementById("more-details-btn").addEventListener("click",()=>{const o=a.id;window.movieModal&&typeof window.movieModal.show=="function"?window.movieModal.show(o):console.warn("movieModal.show fonksiyonu bulunamadı.")}),document.getElementById("watch-trailer-btn").addEventListener("click",o=>{o.preventDefault();const n=a.id;if(window.trailerModal&&typeof window.trailerModal.open=="function"){const i=document.querySelector(".hero");i&&(i.dataset.movieid=n),window.trailerModal.open()}})}catch(r){console.error("Error occurred:",r),b(e)}}function C(e){const t=e/2,r=Math.floor(t),a=t%1>=.25&&t%1<=.75,o=5-r-(a?1:0);let n="";for(let i=0;i<r;i++)n+='<span class="star full">★</span>';a&&(n+='<span class="star half">★</span>');for(let i=0;i<o;i++)n+='<span class="star empty">☆</span>';return n}function b(e){e.style.backgroundImage="url('../img/heroDefault.png')",e.innerHTML=`
    <div class="hero-content">
      <h1 class="hero-title">Welcome to Cinemania</h1>
      <p class="hero-overview">Discover the hottest movies trending today.</p>
      <div class="hero-buttons">
        <a href="/catalog.html" class="hero-button">Get Started</a>
      </div>
    </div>
  `}const D="https://image.tmdb.org/t/p/original";async function w(){const e=document.getElementById("upcoming-section");if(e)try{const t=new Date,r=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=`${r}-${a}-01`,n=new Date(r,a,0).getDate(),i=`${r}-${a}-${n}`,d="04c35731a5ee918f014970082a0088b1",u="https://api.themoviedb.org/3",p={};(await(await fetch(`${u}/genre/movie/list?api_key=${d}`)).json()).genres.forEach(f=>{p[f.id]=f.name});const v=`${u}/discover/movie?api_key=${d}&primary_release_date.gte=${o}&primary_release_date.lte=${i}&sort_by=popularity.desc`,m=(await(await fetch(v)).json()).results;if(!m||m.length===0){e.innerHTML='<p id="no-movie-message">No movies found for this month.</p>';return}let l=JSON.parse(localStorage.getItem("featuredUpcomingMovie"));l||(l=m[Math.floor(Math.random()*m.length)],localStorage.setItem("featuredUpcomingMovie",JSON.stringify(l))),e.innerHTML=`
      <h2>UPCOMING THIS MONTH</h2>
      <div class="upcoming-movie-card">
        <div class="movie-poster" style="background-image: url(${D}${l.backdrop_path})"></div>
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
              <span class="info-genre-value">${l.genre_ids.map(f=>p[f]).join(", ")}</span>
            </div>
          </div>
          
          <div class="about-section">
            <h4>ABOUT</h4>
            <p class="movieabout">${l.overview}</p>
          </div>
          
          <button class="btn-upcoming">Add to my library</button>
        </div>
      </div>
    `,N(l)}catch(t){console.error("Error:",t),e.innerHTML="<p>An error occurred. Please try again later.</p>"}}function N(e){const t=document.querySelector(".btn-upcoming");if(!t)return;const r="myLibrary";let a=JSON.parse(localStorage.getItem(r))||[];const o=a.some(n=>n.id===e.id);t.textContent=o?"Remove from My Library":"Add to my library",t.classList.add(o?"clicked":"default"),t.addEventListener("click",()=>{a.some(i=>i.id===e.id)?(a=a.filter(i=>i.id!==e.id),t.textContent="Add to my library",t.classList.remove("clicked"),t.classList.add("default")):(a.push({id:e.id,title:e.title,poster_path:e.poster_path,backdrop_path:e.backdrop_path,vote_average:e.vote_average,vote_count:e.vote_count,genre_ids:e.genre_ids,overview:e.overview,release_date:e.release_date,popularity:e.popularity}),t.textContent="Remove from My Library",t.classList.remove("default"),t.classList.add("clicked"),x()),localStorage.setItem(r,JSON.stringify(a))}),t.addEventListener("mouseenter",()=>{t.classList.contains("clicked")||t.classList.add("hovered")}),t.addEventListener("mouseleave",()=>{t.classList.remove("hovered")})}function x(){const e=document.getElementById("overlay"),t=document.getElementById("notification");!e||!t||(e.classList.remove("hidden"),t.classList.remove("hidden"),setTimeout(()=>{e.classList.add("hidden"),t.classList.add("hidden")},2e3))}document.addEventListener("DOMContentLoaded",()=>{w()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("theme-switcher");if(!e){console.error("theme-switcher elementi bulunamadı!");return}e.addEventListener("click",()=>{document.body.classList.toggle("dark-mode")});const t=document.querySelector(".btn"),r=document.querySelector(".navbar");t.addEventListener("click",()=>{r.classList.toggle("active")});const a=document.querySelectorAll(".nav-menu a");a.forEach(i=>{i.addEventListener("click",()=>{a.forEach(d=>d.classList.remove("active")),i.classList.add("active")})});const o=window.location.pathname.split("/").pop(),n=Array.from(a).find(i=>i.href.includes(o));n&&n.classList.add("active")});async function q(){return(await(await fetch("https://api.themoviedb.org/3/trending/movie/week?language=tr-TR",{method:"GET",headers:{accept:"application/json",Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZWJmOWU4MzdkOWVmNGZlZDZiZTAzY2RlZTAyMTZiNSIsIm5iZiI6MTc0MjkxNzcyNC4zOTYsInN1YiI6IjY3ZTJkMDVjZDcwYzYxNTkwMzc1ZTgzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mGfFevHBMVfVG3Aha3atAbsBAX0sx3BUJdHGcEDZwAk"}})).json()).results}const F={28:"Aksiyon",12:"Macera",16:"Animasyon",35:"Komedi",80:"Suç",99:"Belgesel",18:"Dram",10751:"Aile",14:"Fantastik",36:"Tarih",27:"Korku",10402:"Müzik",9648:"Gizem",10749:"Romantik",878:"Bilim Kurgu",10770:"TV Filmi",53:"Gerilim",10752:"Savaş",37:"Western"};function J(e){return e.map(t=>F[t]||"Bilinmeyen").join(", ")}function H(e){const t=Math.floor(e/2),r=e%2!==0?1:0,a=5-t-r;let o="";for(let n=0;n<t;n++)o+='<i class="fa-solid fa-star"></i>';r&&(o+='<i class="fa-solid fa-star-half"></i>');for(let n=0;n<a;n++)o+='<i class="fa-regular fa-star"></i>';return o}async function M(){try{const e=await q();if(!e||e.length===0){console.error("Film verileri alınamadı veya boş dizi döndü");return}const t=document.querySelector(".weekly-movies-container");if(!t){console.error(".weekly-movies-container elementi bulunamadı");return}t.innerHTML="";const r=window.innerWidth;let a=3;r<=768&&(a=1);const o=e.slice(0,a);o.forEach(n=>{const i=document.createElement("div");i.classList.add("weekly-trend-movie"),i.dataset.movieid=n.id;const d=J(n.genre_ids);i.innerHTML=`
        <div class="title">
          <h3>${n.title}</h3>
          <div class="movie-about">
            <div class="movie-title">
              <p>${d}</p>
              <span> | </span>
              <span>${n.release_date}</span>
            </div>
          </div>
          <div class="star-bar">${H(n.vote_average)}</div>
        </div>
      `,i.style.background=`linear-gradient(to bottom, #00000000 0%, #000000 100%), url('https://image.tmdb.org/t/p/w500${n.poster_path}')`,i.style.backgroundSize="cover",i.style.backgroundPosition="center",i.style.backgroundRepeat="no-repeat",i.addEventListener("click",()=>{console.log("Film afiş tıklaması - Film ID:",n.id),window.movieModal&&typeof window.movieModal.show=="function"?window.movieModal.show(n.id):console.warn("movieModal.show fonksiyonu bulunamadı.")}),t.appendChild(i)}),console.log(`${o.length} adet film başarıyla yüklendi`)}catch(e){console.error("Film yüklenirken hata oluştu:",e)}}document.addEventListener("DOMContentLoaded",()=>{M()});window.addEventListener("resize",M);const R=async()=>{const e=document.getElementById("footer");if(e)try{e.innerHTML=await fetch("./partials/footer.html").then(t=>t.text())}catch(t){console.error("Footer yükleme hatası:",t)}};window.addEventListener("load",R);const P="0f552bbb3a7946c71382d336324ac39a",j={28:"Aksiyon",12:"Macera",16:"Animasyon",35:"Komedi",80:"Suç",99:"Belgesel",18:"Dram",10751:"Aile",14:"Fantastik",36:"Tarih",27:"Korku",10402:"Müzik",9648:"Gizem",10749:"Romantik",878:"Bilim Kurgu",10770:"TV Filmi",53:"Gerilim",10752:"Savaş",37:"Western"};let _=1;function S(){document.getElementById("film-list"),document.getElementById("empty-message");const e=JSON.parse(localStorage.getItem("library"))||[];e.length===0?k():g(e),z()}document.addEventListener("DOMContentLoaded",()=>{S()});function z(){const e=document.querySelector(".load-btn");e&&e.addEventListener("click",()=>{_++,E()}),document.addEventListener("click",t=>{if(t.target.classList.contains("add-remote-btn")){const r=parseInt(t.target.dataset.id);G(r)?U(r):addToLibrary(r)}})}async function E(){try{const t=await(await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${P}&page=${_}`)).json();g(t.results)}catch(e){console.error("Could not fetch movie data:",e)}}function g(e){const t=document.getElementById("film-list"),r=document.getElementById("empty-message");t&&(t.innerHTML="",r&&(r.innerHTML=""),e.forEach(a=>{const o=document.createElement("li"),n=document.createElement("div"),i=Math.round(a.vote_average/2),d="★".repeat(i)+"☆".repeat(5-i);n.innerHTML=`
      <a href="https://image.tmdb.org/t/p/original/${a.poster_path}" class="lightbox">
        <img class="movie-image" alt="${a.original_title}" src="https://image.tmdb.org/t/p/w500/${a.poster_path}"/>
      </a>
      <h3>${a.original_title}</h3>
      <div class="card-down"><span class="left-info">${a.genre_ids.map(u=>j[u]).join(",")} | ${a.release_date?a.release_date.split("-")[0]:"N/A"}</span><span class="stars">${d}</span>
      </div>`,o.classList.add("movieCard"),n.classList.add("filmCard"),o.appendChild(n),t.appendChild(o)}))}function k(){const e=document.getElementById("empty-message");if(!e)return;const t=`
    <p class="markup">
      <span>OOOPS..</span>
      <span>We are very sorry!</span>
      <span>You don't have any movies at your library</span>
    </p>
    <button type="button" class="searchBtn">Search Movie</button>
  `;e.innerHTML=t,setTimeout(()=>{const r=document.querySelector(".searchBtn");r&&r.addEventListener("click",()=>{E()})},0)}function G(e){return(JSON.parse(localStorage.getItem("library"))||[]).some(r=>r.id===e)}function U(e){const r=(JSON.parse(localStorage.getItem("library"))||[]).filter(a=>a.id!==e);localStorage.setItem("library",JSON.stringify(r)),r.length===0?k():g(r)}w();L();document.addEventListener("DOMContentLoaded",()=>{document.getElementById("hero-section")&&L(),document.getElementById("film-list")&&S()});
//# sourceMappingURL=main-BDSkzm-n.js.map
