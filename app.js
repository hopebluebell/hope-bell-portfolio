'use strict';
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealSelector = '[data-reveal], .hero-frame, .scroll-cue, .index-hero .split, .about-strip .split, .case-hero-grid, .brief > div, .case-contents, .section-heading, .screen-stage, .outcome > div, .case-next, .about-hero h1, .about-hero > p, .skills > h2, .skills li, .skills-bottom, .contact-hero > h1, .contact-grid, .contact-behance, .footer-grid, .footer-bottom';
const candidates = Array.from(document.querySelectorAll(revealSelector));
// Animate a group once rather than moving both it and its children.
const blocks = candidates.filter(block => !candidates.some(parent => parent !== block && parent.contains(block)));
blocks.forEach((block, index) => {
  block.setAttribute('data-reveal', '');
  block.style.setProperty('--reveal-delay', `${(index % 3) * 55}ms`);
});
let observer;
function reveal() {
  if (observer) observer.disconnect();
  blocks.forEach(block => block.classList.remove('will-reveal', 'is-visible'));
  if (preference.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -16px 0px', threshold: 0 });
  blocks.forEach(block => { block.classList.add('will-reveal'); observer.observe(block); });
}
reveal();
if (preference.addEventListener) preference.addEventListener('change', reveal);
else if (preference.addListener) preference.addListener(reveal);
document.addEventListener('focusin', event => {
  const block = event.target.closest('[data-reveal]');
  if (block) block.classList.add('is-visible');
});
const dialog = document.querySelector('.lightbox');
let opener;
if (dialog && typeof dialog.showModal === 'function') {
  document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    const full = dialog.querySelector('img');
    full.alt = button.querySelector('img').alt;
    full.src = button.dataset.zoom;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    dialog.querySelector('img').removeAttribute('src');
    opener?.focus();
  });
} else {
  document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
    window.location.href = button.dataset.zoom;
  }));
}
