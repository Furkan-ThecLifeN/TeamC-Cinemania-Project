(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}})();document.addEventListener("DOMContentLoaded",()=>{const n=document.getElementById("theme-switcher");if(!n){console.error("theme-switcher elementi bulunamadı!");return}n.addEventListener("click",()=>{document.body.classList.toggle("dark-mode")});const a=document.querySelector(".btn"),i=document.querySelector(".navbar");a.addEventListener("click",()=>{i.classList.toggle("active")});const r=document.querySelectorAll(".nav-menu a");r.forEach(o=>{o.addEventListener("click",()=>{r.forEach(s=>s.classList.remove("active")),o.classList.add("active")})});const e=window.location.pathname.split("/").pop(),t=Array.from(r).find(o=>o.href.includes(e));t&&t.classList.add("active")});async function v(){return(await(await fetch("https://api.themoviedb.org/3/trending/movie/week?language=tr-TR",{method:"GET",headers:{accept:"application/json",Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZWJmOWU4MzdkOWVmNGZlZDZiZTAzY2RlZTAyMTZiNSIsIm5iZiI6MTc0MjkxNzcyNC4zOTYsInN1YiI6IjY3ZTJkMDVjZDcwYzYxNTkwMzc1ZTgzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mGfFevHBMVfVG3Aha3atAbsBAX0sx3BUJdHGcEDZwAk"}})).json()).results}const p={28:"Aksiyon",12:"Macera",16:"Animasyon",35:"Komedi",80:"Suç",99:"Belgesel",18:"Dram",10751:"Aile",14:"Fantastik",36:"Tarih",27:"Korku",10402:"Müzik",9648:"Gizem",10749:"Romantik",878:"Bilim Kurgu",10770:"TV Filmi",53:"Gerilim",10752:"Savaş",37:"Western"};function g(n){return n.map(a=>p[a]||"Bilinmeyen").join(", ")}function y(n){const a=Math.floor(n/2),i=n%2!==0?1:0,r=5-a-i;let e="";for(let t=0;t<a;t++)e+='<i class="fa-solid fa-star"></i>';i&&(e+='<i class="fa-solid fa-star-half"></i>');for(let t=0;t<r;t++)e+='<i class="fa-regular fa-star"></i>';return e}async function h(){const n=await v();if(!n||n.length===0)return;const a=document.querySelector(".weekly-movies-container");a.innerHTML="";const i=window.innerWidth;let r=3;i<=768&&(r=1),n.slice(0,r).forEach(t=>{const o=document.createElement("div");o.classList.add("weekly-trend-movie");const s=g(t.genre_ids);o.innerHTML=`
      <div class="title">
        <h3>${t.title}</h3>
        <div class="movie-about">
          <div class="movie-title">
            <p>${s}</p>
            <span> | </span>
            <span>${t.release_date}</span>
          </div>

        </div>
        <div class="star-bar">${y(t.vote_average)}</div>
      </div>
    `,o.style.background=`linear-gradient(to bottom, #00000000 0%, #000000 100%), url('https://image.tmdb.org/t/p/w500${t.poster_path}')`,o.style.backgroundSize="cover",o.style.backgroundPosition="center",o.style.backgroundRepeat="no-repeat",a.appendChild(o)})}window.addEventListener("resize",h);h();const b=async()=>{const n=document.getElementById("footer");if(n)try{n.innerHTML=await fetch("./partials/footer.html").then(a=>a.text())}catch(a){console.error("Footer yükleme hatası:",a)}};window.addEventListener("load",b);const w="0ce25b1b3df50695af6eae55a386f147",L="https://api.themoviedb.org/3",M="https://image.tmdb.org/t/p/original";async function E(){return(await(await fetch(`${L}/trending/movie/day?api_key=${w}`)).json()).results}async function k(){var i;const n=document.getElementById("hero-section");try{let t=function(o){const s=o/2,d=Math.floor(s),u=s%1>=.25&&s%1<=.75,f=5-d-(u?1:0);let l="";for(let c=0;c<d;c++)l+='<span class="star full">★</span>';u&&(l+='<span class="star half">★</span>');for(let c=0;c<f;c++)l+='<span class="star empty">☆</span>';return l};var a=t;const r=await E();if(!r||r.length===0){m(n);return}const e=r[Math.floor(Math.random()*r.length)];n.style.backgroundImage=`url('${M}${e.backdrop_path}')`,n.innerHTML=`
      <div class="hero-content">
        <h1 class="hero-title">${e.title}</h1>
        <p class="hero-rating">${t(e.vote_average)}</p>
        <p class="hero-overview">${((i=e.overview)==null?void 0:i.slice(0,200))||"No description available."}</p>
        <div class="hero-buttons">
          <button class="hero-button" data-id="${e.id}" id="more-details-btn">More details</button>
          <button class="hero-button" data-id="${e.id}" id="watch-trailer-btn">Watch trailer</button>
        </div>
      </div>
    `,document.getElementById("more-details-btn").addEventListener("click",()=>{const o=new CustomEvent("openDetailsModal",{detail:{id:e.id}});window.dispatchEvent(o)}),document.getElementById("watch-trailer-btn").addEventListener("click",()=>{const o=new CustomEvent("openTrailerModal",{detail:{id:e.id}});window.dispatchEvent(o)})}catch(r){console.error("Hata oluştu:",r),m(n)}}function m(n){n.style.backgroundImage="url('../img/heroDefault.png')",n.innerHTML=`
    <div class="hero-content">
      <h1 class="hero-title">Welcome to Cinemania</h1>
      <p class="hero-overview">Discover the hottest movies trending today.</p>
      <div class="hero-buttons">
        <a href="/catalog.html" class="hero-button">Get Started</a>
      </div>
    </div>
  `}k();
//# sourceMappingURL=main-B4iuOu9g.js.map
