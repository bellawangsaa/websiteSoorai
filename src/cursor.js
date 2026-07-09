import gsap from 'gsap';

export function initCursor() {
  if (matchMedia('(pointer: coarse)').matches) return;
  document.documentElement.classList.add('has-cursor');

  const c = document.createElement('div');
  c.className = 'cursor';
  c.innerHTML = '<span class="cursor-dot"></span><span class="cursor-label">VIEW</span>';
  document.body.appendChild(c);

  const xTo = gsap.quickTo(c, 'x', { duration: 0.16, ease: 'power3.out' });
  const yTo = gsap.quickTo(c, 'y', { duration: 0.16, ease: 'power3.out' });
  addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); });

  // delegation: works for elements added later (e.g. case-study close button)
  document.addEventListener('pointerover', (e) => {
    c.classList.toggle('is-view', !!e.target.closest('article.work'));
    c.classList.toggle('is-link', !e.target.closest('article.work') && !!e.target.closest('a, button'));
  });
}
