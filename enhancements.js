// Small, session-only interactions; no tracking or stored reader data.
const listenerCopy = {
  intention: ['“I’m concerned about you.”', 'In my upbringing, “sorry” could express sympathy without accepting blame.'],
  reception: ['“Why are you apologizing?”', 'The stranger heard an apology. Same word, different expectations.']
};
document.querySelectorAll('[data-listener]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-listener]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const [quote, context] = listenerCopy[button.dataset.listener];
    document.querySelector('#listenerQuote').textContent = quote;
    document.querySelector('#listenerContext').textContent = context;
  });
});
const explored = new Set();
const decoded = new Set();
function markExplored(name) {
  explored.add(name);
  document.querySelector(`[data-journey="${name}"]`).classList.add('is-done');
  document.querySelector('#journeyStatus').textContent = explored.size === 3
    ? '3 / 3 explored · Same words. A little more context.'
    : `${explored.size} / 3 explored · Follow your curiosity.`;
}
document.querySelectorAll('[data-answer]').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-answer]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    markExplored('meaning');
  });
});
document.querySelectorAll('[data-phrase]').forEach(button => button.addEventListener('click', () => {
  decoded.add(button.dataset.phrase);
  document.querySelector('#decodeStatus').textContent = `${decoded.size} of 4 expressions explored`;
  if (decoded.size === 4) markExplored('decode');
}));
document.querySelectorAll('[data-pov]').forEach(button => button.addEventListener('click', () => markExplored('audience')));
document.querySelector('#navToggle').addEventListener('keydown', event => {
  if (event.key === 'Escape') closeStoryNav();
});
document.querySelector('#siteNav').addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeStoryNav();
    document.querySelector('#navToggle').focus();
  }
});
function closeStoryNav() {
  document.querySelector('#siteNav').classList.remove('open');
  document.querySelector('#navToggle').setAttribute('aria-expanded', 'false');
}
