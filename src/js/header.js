document.addEventListener('DOMContentLoaded', () => {
  const switcher = document.getElementById('theme-switcher');

  if (!switcher) {
    console.error('theme-switcher elementi bulunamadı!');
    return;
  }

  switcher.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  // Menü butonuna tıklanınca navbar içinde .active sınıfı eklenir ve nav-menu görünür olur
  const menuButton = document.querySelector('.btn');
  const navbar = document.querySelector('.navbar');

  menuButton.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });

  // Navbar bağlantılarında active sınıfını değiştirme
  const navLinks = document.querySelectorAll('.nav-menu a');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Tüm linklerden active sınıfını kaldır
      navLinks.forEach(link => link.classList.remove('active'));
      // Tıklanan linke active sınıfını ekle
      link.classList.add('active');
    });
  });

  // Sayfa yüklendiğinde, hangi sayfada olduğuna göre aktif linki ayarla
  const currentPage = window.location.pathname.split('/').pop();
  const activeLink = Array.from(navLinks).find(link =>
    link.href.includes(currentPage)
  );

  if (activeLink) {
    activeLink.classList.add('active');
  }
});
