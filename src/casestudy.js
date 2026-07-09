import gsap from 'gsap';

const view = document.getElementById('casestudy');
let lastFocus = null;
let hooks = {};

function open(article) {
  gsap.killTweensOf(view); // a mid-close reopen must not inherit the stale close's onComplete
  const { title, images } = article.dataset;
  const imgs = images.split(',').map((n) => `/works/${String(n.trim()).padStart(2, '0')}.webp`);
  view.innerHTML = `
    <div class="cs-inner">
      <header class="cs-head">
        <h2>${title}</h2>
        <button class="cs-close" type="button">Close</button>
      </header>
      ${imgs.map((s) => `<img src="${s}" alt="${title} — case study image" loading="lazy" />`).join('')}
    </div>`;
  view.hidden = false;
  view.scrollTop = 0;
  lastFocus = document.activeElement;
  view.querySelector('.cs-close').focus();
  view.querySelector('.cs-close').addEventListener('click', close);
  gsap.fromTo(view, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
  gsap.from(view.querySelectorAll('.cs-head, img'), {
    y: 36, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', delay: 0.1
  });
  hooks.onOpen?.();
}

function close() {
  gsap.to(view, {
    opacity: 0, duration: 0.3, ease: 'power2.in',
    onComplete: () => {
      view.hidden = true;
      gsap.set(view, { clearProps: 'opacity' });
      hooks.onClose?.();
      lastFocus?.focus();
    }
  });
}

export function initCaseStudy(h = {}) {
  hooks = h;
  document.querySelectorAll('article.work').forEach((a) => {
    a.addEventListener('click', () => open(a));
    a.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(a); }
    });
  });
  view.addEventListener('click', (e) => { if (e.target === view) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !view.hidden) close();
  });
}
