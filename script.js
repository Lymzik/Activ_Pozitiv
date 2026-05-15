/* Прокат в Томске — главный скрипт */

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// Закрывать мобильное меню при клике вне его
document.addEventListener('click', (e) => {
  if (nav.classList.contains('open') &&
      !nav.contains(e.target) &&
      !burger.contains(e.target)) {
    nav.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Burger menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  if (nav.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close nav on link click
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// Catalog tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = {
  winter: document.getElementById('tab-winter'),
  summer: document.getElementById('tab-summer'),
  'repair-tab': document.getElementById('tab-repair-tab'),
};

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Object.entries(tabPanels).forEach(([key, panel]) => {
      if (!panel) return;
      panel.classList.toggle('hidden', key !== tab);
    });
  });
});

// Booking form
const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  showModal();
});

function showModal() {
  document.getElementById('successModal').classList.add('active');
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('successModal').classList.remove('active');
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
  bookingForm.reset();
}

// Make closeModal global for onclick in HTML
window.closeModal = closeModal;

// Season content config
const SEASONS = {
  winter: {
    desc: 'Прокат и профессиональный сервис снаряжения. Готовим лыжи под температуру снега в Академгородке — сегодня вечером, для завтрашнего катания.',
    cardMainIcon: '⛷️',
    cardMainTitle: 'Зима в разгаре!',
    cardMainSub: 'Лыжи, сноуборды, тюбинги',
    cardFloatIcon: '🔧',
    cardFloatTitle: 'Заточка кантов',
    cardFloatSub: 'от 500₽',
    illustIcon: '🏔️',
    directionBadge: 'Сезон сейчас',
  },
  summer: {
    desc: 'Прокат велосипедов, самокатов и SUP-бордов по всему Томску. Техника настроена и готова — просто приезжай и катись.',
    cardMainIcon: '🚵',
    cardMainTitle: 'Лето в самом разгаре!',
    cardMainSub: 'Велосипеды, самокаты, SUP',
    cardFloatIcon: '🔧',
    cardFloatTitle: 'Сервис велосипеда',
    cardFloatSub: 'от 300₽',
    illustIcon: '🌲',
    directionBadge: 'Сезон сейчас',
  },
};

// Auto season detection
function setActiveSeason() {
  const month = new Date().getMonth(); // 0-11
  const isWinter = month <= 2 || month >= 10; // Nov–Mar = зима
  const season = isWinter ? 'winter' : 'summer';
  const cfg = SEASONS[season];

  // Hero description
  const heroDesc = document.getElementById('hero-desc');
  if (heroDesc) heroDesc.textContent = cfg.desc;

  // Hero floating cards
  document.getElementById('hero-card-main-icon').textContent  = cfg.cardMainIcon;
  document.getElementById('hero-card-main-title').textContent = cfg.cardMainTitle;
  document.getElementById('hero-card-main-sub').textContent   = cfg.cardMainSub;
  document.getElementById('hero-card-float-icon').textContent  = cfg.cardFloatIcon;
  document.getElementById('hero-card-float-title').textContent = cfg.cardFloatTitle;
  document.getElementById('hero-card-float-sub').textContent   = cfg.cardFloatSub;
  document.getElementById('hero-illus-icon').textContent       = cfg.illustIcon;

  // Direction cards — убираем старый бейдж, ставим на нужный
  document.querySelectorAll('.direction-card').forEach(card => {
    card.classList.remove('active-season');
    const badge = card.querySelector('.direction-card__badge');
    if (badge) badge.remove();
  });
  const activeCard = document.querySelector(`.direction-card--${season}`);
  if (activeCard) {
    activeCard.classList.add('active-season');
    const badge = document.createElement('div');
    badge.className = 'direction-card__badge';
    badge.textContent = cfg.directionBadge;
    activeCard.appendChild(badge);
  }

  // Catalog — активируем нужный таб
  tabBtns.forEach(b => b.classList.remove('active'));
  const defaultTab = document.querySelector(`[data-tab="${season}"]`);
  if (defaultTab) defaultTab.classList.add('active');

  Object.entries(tabPanels).forEach(([key, panel]) => {
    if (!panel) return;
    panel.classList.toggle('hidden', key !== season);
  });
}

setActiveSeason();

// Direction cards — переключают таб каталога и скроллят к нему
document.querySelectorAll('.direction-card').forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    const season = card.dataset.season; // 'winter' | 'summer'
    // Активируем нужный таб
    tabBtns.forEach(b => b.classList.remove('active'));
    const targetBtn = document.querySelector(`[data-tab="${season}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    Object.entries(tabPanels).forEach(([key, panel]) => {
      if (!panel) return;
      panel.classList.toggle('hidden', key !== season);
    });
    // Скроллим к секции каталога
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    // Direction cards уже обработаны выше
    if (link.closest('.direction-card')) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.product-card, .why-card, .offer-card, .review-card, .direction-card, .delivery__item, .pledge-item'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity .5s ease ${i * 0.06}s, transform .5s ease ${i * 0.06}s`;
  observer.observe(el);
});

// Phone input formatting
const phoneInput = document.querySelector('input[type="tel"]');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('8')) val = '7' + val.slice(1);
    if (val.startsWith('7')) {
      val = '+7 (' + val.slice(1, 4) + ') ' + val.slice(4, 7) + '-' + val.slice(7, 9) + '-' + val.slice(9, 11);
    }
    e.target.value = val.slice(0, 18);
  });
}
