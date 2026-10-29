// Certificates – add new ones here, in the order they should appear.
// image: certificate screenshot in images/certificates/ (optional), url: link to the certificate (optional)
const CERTIFICATES = [
  {
    title: 'UX in Practice: Design an App Through Users\' Eyes',
    issuer: 'Czechitas',
    year: 2026,
    image: 'images/certificates/ux-v-praxi.jpeg',
    url: 'images/certificates/ux-v-praxi.jpeg',
  },
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
    title: 'JavaScript 2',
    issuer: 'Czechitas',
    year: 2024,
    image: 'images/certificates/javascript-2.jpeg',
    url: 'images/certificates/javascript-2.jpeg',
  },
  {
    title: 'Building a Website from A to Z – 2',
    issuer: 'Czechitas',
    year: 2019,
    image: 'images/certificates/web-a-z-2.jpeg',
    url: 'images/certificates/web-a-z-2.jpeg',
  },
];

const isImage = (url) => /\.(jpe?g|png|webp|gif|avif)$/i.test(url);

function renderCertificates() {
  const list = document.getElementById('certificates-list');
  if (!list) return;

  list.innerHTML = CERTIFICATES.map((cert, i) => `
    <article class="card">
      ${cert.image
        ? `<a class="card-img-link" href="${cert.image}" data-lightbox="${i}" aria-label="Enlarge ${cert.title} certificate">
            <img class="card-img" src="${cert.image}" alt="${cert.title} certificate" loading="lazy">
          </a>`
        : `<div class="card-img card-img-placeholder" aria-hidden="true">${cert.issuer}</div>`}
      <div class="card-body">
        <h3>${cert.title}</h3>
        <p class="cert-meta">${cert.issuer} · ${cert.year}</p>
        ${cert.url ? `<div class="card-links">
          ${isImage(cert.url) && cert.image
            ? `<a href="${cert.url}" data-lightbox="${i}">View certificate</a>`
            : `<a href="${cert.url}" target="_blank" rel="noopener">
                View certificate <svg class="icon" aria-hidden="true"><use href="#i-external"/></svg>
              </a>`}
        </div>` : ''}
      </div>
    </article>
  `).join('');
}

// Certificate lightbox (native <dialog>): click, arrow keys to browse, Esc or backdrop click to close
function initLightbox() {
  const dialog = document.getElementById('lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const img = dialog.querySelector('.lightbox-img');
  const caption = dialog.querySelector('.lightbox-caption');
  const items = CERTIFICATES.filter((cert) => cert.image);
  let current = 0;

  function show(index) {
    current = (index + items.length) % items.length;
    const cert = items[current];
    img.src = cert.image;
    img.alt = `${cert.title} certificate`;
    caption.textContent = `${cert.title} · ${cert.issuer} · ${cert.year}`;
  }

  document.getElementById('certificates-list').addEventListener('click', (e) => {
    const link = e.target.closest('[data-lightbox]');
    if (!link) return;
    e.preventDefault();
    show(items.indexOf(CERTIFICATES[link.dataset.lightbox]));
    dialog.showModal();
  });

  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  const hideNav = items.length < 2;
  dialog.querySelector('.lightbox-prev').hidden = hideNav;
  dialog.querySelector('.lightbox-next').hidden = hideNav;
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

    data.set('subject', `New message from ${data.get('name')} (vendulabezakova.github.io)`);
    data.set('replyto', data.get('email'));
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Sending…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error(result.message || response.statusText);
      form.reset();
      status.textContent = 'Thank you! Your message has been sent.';
      status.classList.add('success');
    } catch {
      status.textContent = 'Something went wrong. Please e-mail me directly.';
      status.classList.add('error');
    }
    button.disabled = false;
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
renderCertificates();
initLightbox();
initNav();
initActiveNav();
initContactForm();
