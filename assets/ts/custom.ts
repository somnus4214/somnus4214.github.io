type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'StackColorScheme';

function getCurrentScheme(): ColorScheme {
  return document.documentElement.dataset.scheme === 'light' ? 'light' : 'dark';
}

function applyScheme(nextScheme: ColorScheme) {
  document.documentElement.dataset.scheme = nextScheme;
  localStorage.setItem(STORAGE_KEY, nextScheme);

  window.dispatchEvent(
    new CustomEvent('onColorSchemeChange', {
      detail: nextScheme,
    }),
  );
}

function bindColorSchemeToggle() {
  const toggle = document.getElementById('dark-mode-toggle');
  if (!toggle) return;

  toggle.addEventListener(
    'click',
    (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const nextScheme = getCurrentScheme() === 'dark' ? 'light' : 'dark';
      applyScheme(nextScheme);
    },
    true,
  );
}

window.addEventListener('load', () => {
  bindColorSchemeToggle();
});
