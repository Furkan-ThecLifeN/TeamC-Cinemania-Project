(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function o(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=o(n);fetch(n.href,r)}})();const I="https://image.tmdb.org/t/p/original",k="0f552bbb3a7946c71382d336324ac39a";async function $(){try{return(await(await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${k}`)).json()).results}catch(e){return console.error("Error fetching trending movies:",e),[]}}async function L(){var t;const e=document.getElementById("hero-section");if(e)try{const o=await $();if(!o||o.length===0){b(e);return}const a=o[Math.floor(Math.random()*o.length)];e.style.backgroundImage=`url('${I}${a.backdrop_path}')`,e.innerHTML=`
      <div class="hero-content">
        <h1 class="hero-title">${a.title}</h1>
        <p class="hero-rating">${T(a.vote_average)}</p>
        <p class="hero-overview">${((t=a.overview)==null?void 0:t.slice(0,200))||"No description available."}</p>
        <div class="hero-buttons">
          <button class="hero-button" data-id="${a.id}" id="more-details-btn">More details</button>
          <button class="hero-button" data-id="${a.id}" id="watch-trailer-btn">Watch trailer</button>
        </div>
      </div>
    `,document.getElementById("more-details-btn").addEventListener("click",()=>{const n=new CustomEvent("openDetailsModal",{detail:{id:a.id}});window.dispatchEvent(n)}),document.getElementById("watch-trailer-btn").addEventListener("click",()=>{const n=new CustomEvent("openTrailerModal",{detail:{id:a.id}});window.dispatchEvent(n)})}catch(o){console.error("Error occurred:",o),b(e)}}function T(e){const t=e/2,o=Math.floor(t),a=t%1>=.25&&t%1<=.75,n=5-o-(a?1:0);let r="";for(let s=0;s<o;s++)r+='<span class="star full">★</span>';a&&(r+='<span class="star half">★</span>');for(let s=0;s<n;s++)r+='<span class="star empty">☆</span>';return r}function b(e){e.style.backgroundImage="url('../img/heroDefault.png')",e.innerHTML=`
    <div class="hero-content">
      <h1 class="hero-title">Welcome to Cinemania</h1>
      <p class="hero-overview">Discover the hottest movies trending today.</p>
      <div class="hero-buttons">
        <a href="/catalog.html" class="hero-button">Get Started</a>
      </div>
    </div>
  `}const B="https://image.tmdb.org/t/p/original";async function w(){const e=document.getElementById("upcoming-section");if(e)try{const t=new Date,o=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),n=`${o}-${a}-01`,r=new Date(o,a,0).getDate(),s=`${o}-${a}-${r}`,u="04c35731a5ee918f014970082a0088b1",d="https://api.themoviedb.org/3",f={};(await(await fetch(`${d}/genre/movie/list?api_key=${u}`)).json()).genres.forEach(v=>{f[v.id]=v.name});const g=`${d}/discover/movie?api_key=${u}&primary_release_date.gte=${n}&primary_release_date.lte=${s}&sort_by=popularity.desc`,m=(await(await fetch(g)).json()).results;if(!m||m.length===0){e.innerHTML='<p id="no-movie-message">No movies found for this month.</p>';return}let l=JSON.parse(localStorage.getItem("featuredUpcomingMovie"));l||(l=m[Math.floor(Math.random()*m.length)],localStorage.setItem("featuredUpcomingMovie",JSON.stringify(l))),e.innerHTML=`
      <h2>UPCOMING THIS MONTH</h2>
      <div class="upcoming-movie-card">
        <div class="movie-poster" style="background-image: url(${B}${l.backdrop_path})"></div>
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
              <span class="info-genre-value">${l.genre_ids.map(v=>f[v]).join(", ")}</span>
            </div>
          </div>
          
          <div class="about-section">
            <h4>ABOUT</h4>
            <p class="movieabout">${l.overview}</p>
          </div>
          
          <button class="btn-upcoming">Add to my library</button>
        </div>
      </div>
    `,A(l)}catch(t){console.error("Error:",t),e.innerHTML="<p>An error occurred. Please try again later.</p>"}}function A(e){const t=document.querySelector(".btn-upcoming");if(!t)return;const o="myLibrary";let a=JSON.parse(localStorage.getItem(o))||[];const n=a.some(r=>r.id===e.id);t.textContent=n?"Remove from My Library":"Add to my library",t.classList.add(n?"clicked":"default"),t.addEventListener("click",()=>{a.some(s=>s.id===e.id)?(a=a.filter(s=>s.id!==e.id),t.textContent="Add to my library",t.classList.remove("clicked"),t.classList.add("default")):(a.push({id:e.id,title:e.title,poster_path:e.poster_path,backdrop_path:e.backdrop_path,vote_average:e.vote_average,vote_count:e.vote_count,genre_ids:e.genre_ids,overview:e.overview,release_date:e.release_date,popularity:e.popularity}),t.textContent="Remove from My Library",t.classList.remove("default"),t.classList.add("clicked"),O()),localStorage.setItem(o,JSON.stringify(a))}),t.addEventListener("mouseenter",()=>{t.classList.contains("clicked")||t.classList.add("hovered")}),t.addEventListener("mouseleave",()=>{t.classList.remove("hovered")})}function O(){const e=document.getElementById("overlay"),t=document.getElementById("notification");!e||!t||(e.classList.remove("hidden"),t.classList.remove("hidden"),setTimeout(()=>{e.classList.add("hidden"),t.classList.add("hidden")},2e3))}document.addEventListener("DOMContentLoaded",()=>{w()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("theme-switcher");if(!e){console.error("theme-switcher elementi bulunamadı!");return}e.addEventListener("click",()=>{document.body.classList.toggle("dark-mode")});const t=document.querySelector(".btn"),o=document.querySelector(".navbar");t.addEventListener("click",()=>{o.classList.toggle("active")});const a=document.querySelectorAll(".nav-menu a");a.forEach(s=>{s.addEventListener("click",()=>{a.forEach(u=>u.classList.remove("active")),s.classList.add("active")})});const n=window.location.pathname.split("/").pop(),r=Array.from(a).find(s=>s.href.includes(n));r&&r.classList.add("active")});async function C(){return(await(await fetch("https://api.themoviedb.org/3/trending/movie/week?language=tr-TR",{method:"GET",headers:{accept:"application/json",Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZWJmOWU4MzdkOWVmNGZlZDZiZTAzY2RlZTAyMTZiNSIsIm5iZiI6MTc0MjkxNzcyNC4zOTYsInN1YiI6IjY3ZTJkMDVjZDcwYzYxNTkwMzc1ZTgzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mGfFevHBMVfVG3Aha3atAbsBAX0sx3BUJdHGcEDZwAk"}})).json()).results}const N={28:"Aksiyon",12:"Macera",16:"Animasyon",35:"Komedi",80:"Suç",99:"Belgesel",18:"Dram",10751:"Aile",14:"Fantastik",36:"Tarih",27:"Korku",10402:"Müzik",9648:"Gizem",10749:"Romantik",878:"Bilim Kurgu",10770:"TV Filmi",53:"Gerilim",10752:"Savaş",37:"Western"};function D(e){return e.map(t=>N[t]||"Bilinmeyen").join(", ")}function q(e){const t=Math.floor(e/2),o=e%2!==0?1:0,a=5-t-o;let n="";for(let r=0;r<t;r++)n+='<i class="fa-solid fa-star"></i>';o&&(n+='<i class="fa-solid fa-star-half"></i>');for(let r=0;r<a;r++)n+='<i class="fa-regular fa-star"></i>';return n}async function _(){const e=await C();if(!e||e.length===0)return;const t=document.querySelector(".weekly-movies-container");t.innerHTML="";const o=window.innerWidth;let a=3;o<=768&&(a=1),e.slice(0,a).forEach(r=>{const s=document.createElement("div");s.classList.add("weekly-trend-movie");const u=D(r.genre_ids);s.innerHTML=`
      <div class="title">
        <h3>${r.title}</h3>
        <div class="movie-about">
          <div class="movie-title">
            <p>${u}</p>
            <span> | </span>
            <span>${r.release_date}</span>
          </div>

        </div>
        <div class="star-bar">${q(r.vote_average)}</div>
      </div>
    `,s.style.background=`linear-gradient(to bottom, #00000000 0%, #000000 100%), url('https://image.tmdb.org/t/p/w500${r.poster_path}')`,s.style.backgroundSize="cover",s.style.backgroundPosition="center",s.style.backgroundRepeat="no-repeat",t.appendChild(s)})}window.addEventListener("resize",_);_();const x=async()=>{const e=document.getElementById("footer");if(e)try{e.innerHTML=await fetch("./partials/footer.html").then(t=>t.text())}catch(t){console.error("Footer yükleme hatası:",t)}};window.addEventListener("load",x);document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".modal-details"),t=e.querySelector(".modal-details__close"),o=e.querySelector(".modal-details__library-btn");let a=null;const n={28:"Action",12:"Adventure",16:"Animation",35:"Comedy",80:"Crime",99:"Documentary",18:"Drama",10751:"Family",14:"Fantasy",36:"History",27:"Horror",10402:"Music",9648:"Mystery",10749:"Romance",878:"Sci-Fi",10770:"TV Movie",53:"Thriller",10752:"War",37:"Western"};JSON.parse(localStorage.getItem("myLibrary"));function r(){e.classList.remove("active"),document.body.style.overflow="auto"}t.addEventListener("click",r),e.addEventListener("click",i=>i.target===e&&r()),document.addEventListener("keydown",i=>i.key==="Escape"&&r());function s(){return JSON.parse(localStorage.getItem("myLibrary"))||[]}function u(i){localStorage.setItem("myLibrary",JSON.stringify(i))}function d(i){return s().some(c=>c.id===i)}function f(i){const c=d(i);o.textContent=c?"Remove from library":"Add to library",o.dataset.action=c?"remove":"add"}function y(i){const c=s(),m=c.findIndex(l=>l.id===i.id);!i.genres&&i.genre_ids&&(i.genres=i.genre_ids.map(l=>({id:l,name:n[l]||"Unknown"}))),m===-1?c.push(i):c.splice(m,1),u(c),f(i.id)}o.addEventListener("click",async()=>{if(!a)return;const i=await p(a);i&&y(i)});async function p(i){const m=`https://api.themoviedb.org/3/movie/${i}?api_key=f1a0a8dd870a150fcd20cd47eff55f54&language=en-US`;try{const l=await fetch(m);return l.ok?await l.json():null}catch(l){return console.error("Film verisi alınamadı:",l),null}}async function g(i){const c=await p(i);c&&(a=c.id,e.querySelector(".modal-details__image").src=`https://image.tmdb.org/t/p/w500${c.poster_path}`,e.querySelector(".modal-details__image").alt=c.title,e.querySelector(".modal-details__title").textContent=c.title,e.querySelector(".modal-details__vote").textContent=c.vote_average.toFixed(1),e.querySelector(".modal-details__votes").textContent=c.vote_count,e.querySelector(".modal-details__popularity").textContent=c.popularity.toFixed(1),e.querySelector(".modal-details__genre").textContent=c.genres.map(m=>m.name).join(", "),e.querySelector(".modal-details__about-text").textContent=c.overview,f(c.id),e.classList.add("active"),document.body.style.overflow="hidden")}window.movieModal={show:g,close:r}});const J="f1a0a8dd870a150fcd20cd47eff55f54",H="https://api.themoviedb.org/3";async function P(e,t,o={}){const a=new URL(e+t);a.searchParams.append("api_key",J),a.searchParams.append("language","en-US"),Object.entries(o).forEach(([n,r])=>{a.searchParams.append(n,r)});try{const n=await fetch(a);if(!n.ok)throw new Error(`API error: ${n.status}`);return await n.json()}catch(n){return console.error("fetchMovies error:",n),{results:[]}}}document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".hero"),t=document.querySelector(".modal-trailer"),o=t.querySelector(".modal-trailer__close"),a=document.querySelector(".hero-button-watchTrailer"),n=t.querySelector(".modal-trailer__video");function r(){const d=n.src;n.src=d}function s(){t.classList.remove("active"),document.body.style.overflow="auto",r()}function u(){t.classList.add("active"),document.body.style.overflow="hidden";const d=e.dataset.movieid;P(H,`/movie/${d}/videos`).then(f=>{const y=f.results.find(p=>p.official===!0&&p.site==="YouTube"&&p.type==="Trailer");if(y){const p=`https://www.youtube.com/embed/${y.key}`;n.src=p}else console.log("No official YouTube trailer found.")})}a&&a.addEventListener("click",d=>{d.preventDefault(),u()}),o&&o.addEventListener("click",d=>{d.preventDefault(),s()}),t&&t.addEventListener("click",d=>{d.target===t&&s()}),document.addEventListener("keydown",d=>{d.key==="Escape"&&t.classList.contains("active")&&s()}),window.trailerModal={open:u,close:s}});const R="0f552bbb3a7946c71382d336324ac39a",j={28:"Action",12:"Adventure"};function U(){document.getElementById("film-list"),document.getElementById("empty-message");const e=JSON.parse(localStorage.getItem("library"))||[];e.length===0?S():h(e),F()}function F(){const e=document.querySelector(".load-btn");e&&e.addEventListener("click",()=>{page++,E()}),document.addEventListener("click",t=>{if(t.target.classList.contains("add-remote-btn")){const o=parseInt(t.target.dataset.id);M(o)&&z(o)}})}async function E(){try{const t=await(await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${R}&page=${page}`)).json();h(t.results)}catch(e){console.error("Could not fetch movie data:",e)}}function h(e){const t=document.getElementById("film-list"),o=document.getElementById("empty-message");t&&(t.innerHTML="",o&&(o.innerHTML=""),e.forEach(a=>{const n=document.createElement("li"),r=document.createElement("div");r.innerHTML=`
      <a href="https://image.tmdb.org/t/p/original/${a.poster_path}" class="lightbox">
        <img class="movie-image" alt="${a.original_title}" src="https://image.tmdb.org/t/p/w500/${a.poster_path}"/>
      </a>
      <h3>${a.original_title}</h3>
      <p class="popularity">Popularity ${a.popularity}</p>
      <p class="genre">${a.genre_ids.map(s=>j[s]).join(",")}|${a.release_date?a.release_date.split("-")[0]:"N/A"}</p>
      <button class="add-remote-btn" data-id="${a.id}">
        ${M(a.id)?"Remove from Library":"Add to Library"}
      </button>
    `,n.classList.add("movieCard"),r.classList.add("filmCard"),n.appendChild(r),t.appendChild(n)}))}function S(){const e=document.getElementById("empty-message");if(!e)return;const t=`
    <p class="markup">
      <span>OOOPS..</span>
      <span>We are very sorry!</span>
      <span>You don't have any movies at your library</span>
    </p>
    <button type="button" class="searchBtn">Search Movie</button>
  `;e.innerHTML=t;const o=document.querySelector(".searchBtn");o&&o.addEventListener("click",()=>{E()})}function M(e){return(JSON.parse(localStorage.getItem("library"))||[]).some(o=>o.id===e)}function z(e){const o=(JSON.parse(localStorage.getItem("library"))||[]).filter(a=>a.id!==e);localStorage.setItem("library",JSON.stringify(o)),o.length===0?S():h(o)}w();L();document.addEventListener("DOMContentLoaded",()=>{document.getElementById("hero-section")&&L(),document.getElementById("film-list")&&U()});
//# sourceMappingURL=main-CbsX7FoZ.js.map
