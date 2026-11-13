/* Runs before the stylesheet to avoid a flash of the wrong saved theme. */
(function () {
  'use strict';
  var root = document.documentElement;
  var system = window.matchMedia('(prefers-color-scheme: dark)');
  var saved = null;
  try { saved = localStorage.getItem('hope-bell-theme'); } catch (error) { /* Storage may be unavailable. */ }
  function valid(value) { return value === 'dark' || value === 'light'; }
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#17151b' : '#f7f4ee';
    document.querySelectorAll('.theme-toggle').forEach(function (button) {
      var label = theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему';
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.title = label;
    });
  }
  function initial() { return valid(saved) ? saved : (system.matches ? 'dark' : 'light'); }
  apply(initial());
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.theme-toggle').forEach(function (button) {
      button.disabled = false;
      button.addEventListener('click', function () {
        saved = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('hope-bell-theme', saved); } catch (error) { /* Keep the current session usable. */ }
        apply(saved);
      });
    });
    apply(initial());
  });
  function systemChanged() { if (!valid(saved)) apply(initial()); }
  if (system.addEventListener) system.addEventListener('change', systemChanged);
  else if (system.addListener) system.addListener(systemChanged);
  window.addEventListener('storage', function (event) {
    if (event.key === 'hope-bell-theme' || event.key === null) {
      saved = event.newValue;
      apply(initial());
    }
  });
}());
