// Certificates – add new ones here (newest first).
// image: certificate screenshot in images/certificates/, url: link to the certificate (or the image itself)
const CERTIFICATES = [
  {
    title: 'Python for Web: Django 1',
    issuer: 'Czechitas',
    year: 2022,
    image: 'images/certificates/django.jpeg',
    url: 'images/certificates/django.jpeg',
  },
  {
    title: 'Python',
    issuer: 'Czechitas',
    year: 2021,
    image: 'images/certificates/python.jpeg',
    url: 'images/certificates/python.jpeg',
  },
  {
    title: 'Building a Website from A to Z – 2',
    issuer: 'Czechitas',
    year: 2019,
    image: 'images/certificates/web-a-z-2.jpeg',
    url: 'images/certificates/web-a-z-2.jpeg',
  },
  {
    title: 'Google Analytics II – Advanced Analysis',
    issuer: 'H1.cz',
    year: 2017,
    image: 'images/certificates/google-analytics-2.jpeg',
    url: 'images/certificates/google-analytics-2.jpeg',
  },
];

function renderCertificates() {
  const list = document.getElementById('certificates-list');
  if (!list) return;

  list.innerHTML = CERTIFICATES.map((cert) => `
    <article class="card">
      <img class="card-img" src="${cert.image}" alt="${cert.title} certificate" loading="lazy">
      <div class="card-body">
        <h3>${cert.title}</h3>
        <p class="cert-meta">${cert.issuer} · ${cert.year}</p>
        <div class="card-links">
          <a href="${cert.url}" target="_blank" rel="noopener">
            View certificate <svg class="icon" aria-hidden="true"><use href="#i-external"/></svg>
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

// Mobile menu: close after clicking a link
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => { toggle.checked = false; });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle.checked = false;
  });
}

// Highlight the menu item of the section currently in view
function initActiveNav() {
  const links = [...document.querySelectorAll('.site-nav a')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href')));

  function update() {
    const offset = window.scrollY + window.innerHeight * 0.35;
    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
    let current = 0;
    sections.forEach((section, i) => {
      if (section && section.offsetTop <= offset) current = i;
    });
    if (atBottom) current = sections.length - 1;

    links.forEach((link, i) => {
      link.classList.toggle('active', i === current);
      if (i === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// Contact form: sends to data-endpoint (e.g. Formspree) if set, otherwise opens the e-mail client
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const endpoint = form.dataset.endpoint;
    status.className = 'form-status';

    if (!endpoint) {
      const subject = encodeURIComponent(`Message from ${data.get('name')}`);
      const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')} (${data.get('email')})`);
      window.location.href = `mailto:vendula.bezakova@gmail.com?subject=${subject}&body=${body}`;
      return;
    }

    status.textContent = 'Sending…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(response.statusText);
      form.reset();
      status.textContent = 'Thank you! Your message has been sent.';
      status.classList.add('success');
    } catch {
      status.textContent = 'Something went wrong. Please e-mail me directly.';
      status.classList.add('error');
    }
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
renderCertificates();
initNav();
initActiveNav();
initContactForm();
