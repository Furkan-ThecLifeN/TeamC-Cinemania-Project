document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuIcon = document.querySelector('.mobile-menu-icon use');
  const body = document.body;

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('is-open');
    const svgHref = menuIcon.getAttribute('href').split('#')[0];

    mobileMenu.classList.toggle('is-open');
    mobileMenuBtn.setAttribute('aria-expanded', !isOpen);

    menuIcon.setAttribute(
      'href',

      isOpen ? svgHref + '#icon-menu' : svgHref + '#icon-close'
    );

    body.style.overflow = isOpen ? '' : 'hidden';
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleMenu();
    });

    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu();
      });
    });

    document.addEventListener('click', e => {
      if (
        mobileMenu.classList.contains('is-open') &&
        !e.target.closest('.mobile-menu') &&
        !e.target.closest('.mobile-menu-btn')
      ) {
        toggleMenu();
      }
    });

    mobileMenu.addEventListener('click', e => {
      e.stopPropagation();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  }

  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    link.classList.remove('active');
  });

  if (currentPath.includes('catalog.html')) {
    document.querySelectorAll('[data-page="catalog"]').forEach(link => {
      link.classList.add('active');
    });
  } else if (currentPath.includes('mylibrary.html')) {
    document.querySelectorAll('[data-page="library"]').forEach(link => {
      link.classList.add('active');
    });
  } else {
    document.querySelectorAll('[data-page="home"]').forEach(link => {
      link.classList.add('active');
    });
  }
});
