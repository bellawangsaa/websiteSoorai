import './styles.css';
import { initScroll, reduced } from './scroll.js';
import { initIntro, initReveals } from './reveals.js';
import { initCursor } from './cursor.js';
import { initCaseStudy } from './casestudy.js';

const lenis = initScroll();
initIntro(reduced);
initReveals(reduced);
initCursor();
initCaseStudy({ onOpen: () => lenis?.stop(), onClose: () => lenis?.start() });

document.querySelectorAll('.nav a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    if (!lenis) return;
    e.preventDefault();
    lenis.scrollTo(a.getAttribute('href'), { duration: 1.3 });
  });
});

const clock = document.getElementById('clock');
const fmt = new Intl.DateTimeFormat('en-US', { timeStyle: 'medium' });
setInterval(() => { clock.textContent = fmt.format(new Date()); }, 1000);

export { lenis };

function webglSupported() {
  try { return !!document.createElement('canvas').getContext('webgl2'); }
  catch { return false; }
}

const forceOff = new URLSearchParams(location.search).has('nogl'); // QA flag
if (!reduced && !forceOff && webglSupported()) {
  import('./hero3d.js').then((m) => m.initHero3D());
} else {
  document.querySelector('.hero-3d').style.display = 'none';
}
