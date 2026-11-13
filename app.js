'use strict';
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
let observer;
function reveal() {
  observer?.disconnect();
  const blocks = document.querySelectorAll('[data-reveal]');
  blocks.forEach(block => block.classList.remove('will-reveal', 'is-visible'));
  if (preference.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -20px 0px', threshold: 0 });
  blocks.forEach(block => { block.classList.add('will-reveal'); observer.observe(block); });
}
reveal();
preference.addEventListener('change', reveal);
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
