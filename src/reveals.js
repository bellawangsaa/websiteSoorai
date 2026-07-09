import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initIntro(reduced) {
  if (reduced) return;
  gsap.from('[data-intro]', {
    y: 26, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out', delay: 0.1
  });
}

export function initReveals(reduced) {
  document.querySelectorAll('[data-split]').forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/)
      .map((w) => `<span class="w"><span>${w}</span></span>`).join(' ');
  });

  // work hover preview — crisp, follows cursor (skipped on touch via CSS display:none + pointer check)
  const fine = matchMedia('(pointer: fine)').matches;
  if (fine) {
    const prev = document.createElement('img');
    prev.className = 'work-preview';
    prev.alt = '';
    document.body.appendChild(prev);
    document.querySelectorAll('article.work').forEach((row) => {
      row.addEventListener('pointerenter', () => {
        const first = row.dataset.images.split(',')[0].trim();
        prev.src = `/works/${String(first).padStart(2, '0')}.webp`;
        gsap.to(prev, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
      });
      row.addEventListener('pointerleave', () => gsap.to(prev, { opacity: 0, scale: 0.96, duration: 0.25 }));
    });
    addEventListener('pointermove', (e) => {
      gsap.to(prev, { x: e.clientX, y: e.clientY, xPercent: -50, yPercent: -112, duration: 0.55, ease: 'power3.out' });
    });
  }

  if (reduced) return;

  document.querySelectorAll('[data-split]').forEach((el) => {
    gsap.from(el.querySelectorAll('.w > span'), {
      yPercent: 110, duration: 0.8, stagger: 0.025, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%' }
    });
  });

  gsap.utils.toArray('.sec-head, .work, .service, .xp-list li').forEach((el) => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  const card = document.getElementById('id-card');
  const about = document.getElementById('about');
  about.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / r.width;
    const dy = (e.clientY - r.top - r.height / 2) / r.height;
    gsap.to(card, { rotateY: dx * 12, rotateX: -dy * 12, transformPerspective: 700, duration: 0.5 });
  });
  about.addEventListener('pointerleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7 }));
}
