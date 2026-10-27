const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
document.addEventListener('keydown', () => { root.dataset.input = 'keyboard'; }, true);
document.addEventListener('pointerdown', () => { root.dataset.input = 'pointer'; }, true);
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
function closeMenu(restoreFocus = false) {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  if (restoreFocus) menu.focus();
}
menu.addEventListener('click', event => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
  if (open && event.detail && !reducedMotion.matches) {
    nav.animate([{ opacity: .4 }, { opacity: 1 }], { duration: 140, easing: 'cubic-bezier(.23,1,.32,1)' });
  }
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
matchMedia('(min-width: 801px)').addEventListener('change', () => closeMenu());
const modal = document.querySelector('#lightbox');
const triggers = [...document.querySelectorAll('[data-image]')];
let selected = 0;
let imageTrigger;
function showImage(index) {
  selected = (index + triggers.length) % triggers.length;
  const item = triggers[selected];
  const photo = modal.querySelector('.gallery-stage img');
  photo.src = item.dataset.image;
  photo.alt = item.dataset.caption;
  modal.querySelector('.gallery-caption p').textContent = item.dataset.caption;
  const credit = modal.querySelector('.gallery-caption a');
  credit.href = item.dataset.source;
  credit.textContent = item.dataset.credit + ' · Ver archivo original';
  modal.querySelector('.gallery-count').textContent = `Fotografía ${selected + 1} de ${triggers.length}`;
}
triggers.forEach((button, index) => {
  button.addEventListener('click', event => {
    imageTrigger = button;
    showImage(index);
    modal.showModal();
    if (event.detail && !reducedMotion.matches) {
      modal.animate([{ opacity: .5, transform: 'translateY(6px) scale(.98)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 200, easing: 'cubic-bezier(.23,1,.32,1)' });
    }
  });
});
modal.querySelector('.close').addEventListener('click', () => modal.close());
modal.querySelector('.gallery-prev').addEventListener('click', () => showImage(selected - 1));
modal.querySelector('.gallery-next').addEventListener('click', () => showImage(selected + 1));
modal.addEventListener('click', event => {
  if (event.target !== modal) return;
  const r = modal.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) modal.close();
});
modal.addEventListener('close', () => imageTrigger?.focus());
document.addEventListener('keydown', event => {
  if (modal.open && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    event.preventDefault();
    showImage(selected + (event.key === 'ArrowRight' ? 1 : -1));
  } else if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu(true);
});
document.querySelectorAll('.quiz-answers').forEach(quiz => {
  quiz.querySelectorAll('button').forEach(button => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      quiz.querySelectorAll('button').forEach(option => {
        option.classList.remove('correct', 'incorrect');
        option.setAttribute('aria-pressed', 'false');
      });
      const right = button.dataset.answer === quiz.dataset.correct;
      button.classList.add(right ? 'correct' : 'incorrect');
      button.setAttribute('aria-pressed', 'true');
      quiz.querySelector('.feedback').textContent = right
        ? '¡Correcto! ' + quiz.dataset.explanation
        : 'Todavía no. Intenta con otra respuesta.';
    });
  });
});
const progress = document.querySelector('.reading-progress');
let queued = false;
function updateProgress() {
  const range = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollY / range) : 0})`;
  queued = false;
}
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateProgress); } }, { passive: true });
addEventListener('resize', updateProgress);
addEventListener('load', updateProgress);
document.fonts.ready.then(updateProgress);
