// ============================================
// MAIN.JS — Loads data from Railway API
// ============================================

const API_URL = 'https://mehroj-production.up.railway.app';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch(API_URL + '/api/data');
    const data = await res.json();
    Object.assign(SITE_DATA, data);
  } catch(e) {
    console.log('Using default data');
  }
  applyBranding();
  renderServices();
  renderPackages();
  renderReviews();
  renderFAQ();
  initNav();
  initScrollReveal();
});

// ---- BRANDING ----
function applyBranding() {
  const d = SITE_DATA;
  document.title = d.name + ' — ' + d.tagline;
  ['nav-brand','footer-brand'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = d.name;
  });
  ['logo-icon','footer-logo-icon'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = d.name.charAt(0);
  });
  ['nav-phone','mobile-phone','footer-phone','form-phone'].forEach(id => {
    const el = document.getElementById(id);
    if(el) {
      el.href = 'tel:+1' + d.phone.replace(/\D/g,'');
      if(id !== 'form-phone') el.textContent = (id === 'mobile-phone' ? '✆ ' : '') + d.phone;
      else el.textContent = d.phone;
    }
  });
  const fc = document.getElementById('footer-copy');
  if(fc) fc.textContent = '© ' + new Date().getFullYear() + ' ' + d.name + ' LLC. All rights reserved.';
  const fi = document.getElementById('footer-insta');
  if(fi) fi.href = d.instagram;
  const fa = document.getElementById('footer-areas');
  if(fa) fa.textContent = d.areas;
}

// ---- SERVICES ----
function renderServices() {
  const grid = document.getElementById('services-grid');
  if(!grid) return;
  grid.innerHTML = SITE_DATA.services.map(s => `
    <a href="${s.link || 'pages/inquiry.html'}" class="service-card reveal" style="text-decoration:none;color:inherit;display:block">
      <div class="service-img">
        <img src="${s.image}" alt="${s.title}" loading="lazy">
      </div>
      <div class="service-price-box">
        <div class="service-price-amount">${s.price || ''}</div>
      </div>
      <div class="service-body">
        <h3>${s.title}</h3>
        ${s.priceDetail ? `<div class="service-price-detail">${s.priceDetail}</div>` : ''}
        <p>${s.description}</p>
      </div>
    </a>
  `).join('');
}

// ---- PACKAGES ----
function renderPackages() {
  const grid = document.getElementById('packages-grid');
  if(!grid) return;
  grid.innerHTML = SITE_DATA.packages.map(p => `
    <div class="pkg-card ${p.highlight ? 'highlight' : ''} reveal">
      ${p.tag ? `<div class="pkg-tag">${p.tag}</div>` : ''}
      <div class="pkg-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="pkg-body">
        <h3 class="pkg-name">${p.name}</h3>
        <div class="pkg-price">${p.price}</div>
        <ul class="pkg-includes">
          ${p.includes.map(item => `<li>${item}</li>`).join('')}
        </ul>
        ${p.note ? `<p class="pkg-note">${p.note}</p>` : ''}
      </div>
    </div>
  `).join('');
}

// ---- REVIEWS ----
function renderReviews() {
  const grid = document.getElementById('reviews-grid');
  if(!grid) return;
  grid.innerHTML = SITE_DATA.reviews.map(r => `
    <div class="review-card reveal">
      <div class="review-stars">${'★'.repeat(r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">${r.name}</div>
      <div class="review-event">${r.event}</div>
    </div>
  `).join('');
}

// ---- FAQ ----
function renderFAQ() {
  const grid = document.getElementById('faq-grid');
  if(!grid) return;
  grid.innerHTML = SITE_DATA.faq.map((f) => `
    <div class="faq-item reveal">
      <button class="faq-q" onclick="toggleFAQ(this)">
        ${f.question}
        <span class="faq-chevron">+</span>
      </button>
      <div class="faq-a">${f.answer}</div>
    </div>
  `).join('');
}

function toggleFAQ(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q.open').forEach(b => {
    b.classList.remove('open');
    b.nextElementSibling.classList.remove('open');
  });
  if(!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// ---- FORM ----
function submitForm(e) {
  e.preventDefault();
  document.getElementById('contact-form').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
}

// ---- NAV ----
function initNav() {
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('open');
  });
}

function closeMobile() {
  document.getElementById('mobile-menu').classList.remove('open');
}

// ---- SCROLL REVEAL ----
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  const mutObs = new MutationObserver(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
  });
  mutObs.observe(document.body, { childList: true, subtree: true });
}
