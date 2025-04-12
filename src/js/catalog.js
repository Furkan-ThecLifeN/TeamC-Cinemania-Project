function populateYearSelect(startYear = new Date().getFullYear(), endYear = 1980) {
  const yearSelect = document.getElementById("yearSelect");
  if (!yearSelect) return;

  yearSelect.innerHTML = `<option value="">Yıl Seç</option>`;
  for (let year = startYear; year >= endYear; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

function initCatalog() {
  populateYearSelect(); // Dinamik yıl listesi oluşturulur

  const catalogList = document.querySelector(".cata-menu");
  const pagination = document.getElementById("pagination");
  const movieModal = document.getElementById("movieModal");
  const closeModal = document.getElementById("close");

  const searchForm = document.querySelector(".search-form");
  const searchInput = document.getElementById("searchInput");
  const yearSelect = document.getElementById("yearSelect");

  if (!catalogList || !pagination) {
    return setTimeout(initCatalog, 100);
  }

  const bearerToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjdiM2EyZDhhOGJjOGJjNTc2YWNkNjhlNzMzYmMwMiIsIm5iZiI6MTc0Mzc2OTgzNC44MDgsInN1YiI6IjY3ZWZkMGVhNjZkNzAxNDJiNjk5M2VkZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.f11GA6Wa8xeIa9eYADLU7gMUYYBi_DWny7D4WtKA3sU';

  let currentPage = 1;
  let currentQuery = '';
  let selectedYear = '';

  const genreMap = {
    28: "Aksiyon", 12: "Macera", 16: "Animasyon", 35: "Komedi",
    80: "Suç", 99: "Belgesel", 18: "Dram", 10751: "Aile",
    14: "Fantastik", 36: "Tarih", 27: "Korku", 10402: "Müzik",
    9648: "Gizem", 10749: "Romantik", 878: "Bilim Kurgu", 10770: "TV Filmi",
    53: "Gerilim", 10752: "Savaş", 37: "Western"
  };

  async function fetchMovies(page = 1) {
    const queryParams = new URLSearchParams({
      page,
      language: 'tr-TR',
    });

    let endpoint = 'https://api.themoviedb.org/3/discover/movie';

    if (currentQuery) {
      endpoint = 'https://api.themoviedb.org/3/search/movie';
      queryParams.set('query', currentQuery);
    }

    if (selectedYear) {
      queryParams.set('primary_release_year', selectedYear);
    }

    const response = await fetch(`${endpoint}?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        accept: 'application/json'
      }
    });

    const data = await response.json();
    return data;
  }

  async function fetchMovieDetails(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=tr-TR`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        accept: 'application/json'
      }
    });
    return await response.json();
  }

  function loadPagination(totalPages) {
    pagination.innerHTML = "";

    const prevButton = document.createElement("button");
    prevButton.textContent = "<";
    prevButton.classList.add("pagination-btn");
    if (currentPage === 1) prevButton.disabled = true;
    prevButton.addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage--;
        loadMovies();
      }
    });
    pagination.appendChild(prevButton);

    let maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.classList.add("pagination-btn");
      if (i === currentPage) pageButton.classList.add("active");

      pageButton.addEventListener("click", function () {
        currentPage = i;
        loadMovies();
      });

      pagination.appendChild(pageButton);
    }

    if (endPage < totalPages) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.classList.add("pagination-dots");
      pagination.appendChild(dots);

      const lastPage = document.createElement("button");
      lastPage.textContent = totalPages;
      lastPage.classList.add("pagination-btn");
      lastPage.addEventListener("click", function () {
        currentPage = totalPages;
        loadMovies();
      });
      pagination.appendChild(lastPage);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = ">";
    nextButton.classList.add("pagination-btn");
    if (currentPage === totalPages) nextButton.disabled = true;
    nextButton.addEventListener("click", function () {
      if (currentPage < totalPages) {
        currentPage++;
        loadMovies();
      }
    });
    pagination.appendChild(nextButton);
  }

  async function loadMovies() {
    try {
      const data = await fetchMovies(currentPage);
      const movies = data.results;
      const totalPages = data.total_pages;
      catalogList.innerHTML = "";

      function addToLibrary(movie) {
        let movieLibrary = JSON.parse(localStorage.getItem("movieLibrary")) || [];
        if (!movieLibrary.some(item => item.id === movie.id)) {
          movieLibrary.push(movie);
          localStorage.setItem("movieLibrary", JSON.stringify(movieLibrary));
          alert(`${movie.title} başarıyla kütüphaneye eklendi!`);
        } else {
          alert(`${movie.title} zaten kütüphanenizde!`);
        }
      }

      movies.forEach(movie => {
        const year = movie.release_date ? movie.release_date.split("-")[0] : "Yıl yok";
        const genres = movie.genre_ids.map(id => genreMap[id]).filter(Boolean).slice(0, 2).join(", ") || "Tür yok";
        const rating = movie.vote_average.toFixed(1);
        const starRating = Math.round(movie.vote_average / 2);
        const stars = '★'.repeat(starRating) + '☆'.repeat(5 - starRating);

        const li = document.createElement("li");
        li.classList.add("cata-tab");
        li.innerHTML = `
          <div class="cata-flow">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
          </div>
          <div class="cata-info">
            <h3 class="cata-cd-title">${movie.title}</h3>
            <div class="cata-cd-bottom">
              <span class="left-info">${genres} | ${year}</span>
              <span class="right-stars">${stars}</span>
            </div>
          </div>
        `;

        // Film afişine tıklandığında
        li.addEventListener("click", () => {
          const movieId = movie.id;
          
          // Önce window.movieModal.show() fonksiyonunu kontrol et
          if (window.movieModal && typeof window.movieModal.show === 'function') {
            console.log('Dışarıdan tanımlanan movie modal kullanılıyor:', movieId);
            // Eğer varsa, dışarıdan tanımladığınız modalı kullan
            window.movieModal.show(movieId);
          } else {
            console.log('Yerel showModal fonksiyonu kullanılıyor:', movieId);
            // Yoksa, mevcut showModal fonksiyonunu kullan
            showModal(movieId);
          }
        });
        
        catalogList.appendChild(li);
      });

      loadPagination(totalPages);
    } catch (error) {
      console.error("Filmler yüklenirken hata oluştu:", error);
    }
  }

  async function showModal(movieId) {
    try {
      const movie = await fetchMovieDetails(movieId);
      document.getElementById("modalImage").src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      document.getElementById("modalTitle").textContent = movie.title;
      document.getElementById("modalDescription").textContent = movie.overview;
      movieModal.style.display = "block";
    } catch (error) {
      console.error("Film detayları gösterilirken hata oluştu:", error);
    }
  }

  closeModal?.addEventListener("click", function () {
    movieModal.style.display = "none";
  });

  searchForm?.addEventListener("submit", function (e) {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engeller
    currentQuery = searchInput.value.trim(); // input değerini alır
    selectedYear = yearSelect.value; // yıl seçimini alır
    currentPage = 1;
    loadMovies(); // Filmleri yükler
  });

  // İkinci submit event listener'ı kaldırıldı (tekrar vardı)

  loadMovies();
}

initCatalog();