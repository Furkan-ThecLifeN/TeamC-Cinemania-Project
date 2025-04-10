// Footer yükleme fonksiyonu
const loadFooter = async () => {
  const target = document.getElementById('footer');
  if (!target) return;

  try {
    target.innerHTML = await fetch('./partials/footer.html').then(r =>
      r.text()
    );
  } catch (e) {
    console.error('Footer yükleme hatası:', e);
  }
};

// Sayfa yüklendiğinde çalıştır
window.addEventListener('load', loadFooter);
