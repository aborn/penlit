// 手动选择的主题。这个文件在 head 里同步加载，赶在首次绘制前设好，避免闪屏。
(function () {
  var KEY = 'penlit-theme';
  var COLORS = { light: '#f6f2ea', dark: '#14161f' };
  var root = document.documentElement;
  var system = window.matchMedia('(prefers-color-scheme: dark)');

  function saved() {
    try {
      var value = localStorage.getItem(KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch (e) {
      return null;
    }
  }

  function save(theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {
      // 隐私模式下存不了，本次访问仍然生效
    }
  }

  function current() {
    return root.getAttribute('data-theme') || (system.matches ? 'dark' : 'light');
  }

  function sync() {
    var theme = current();
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      meta.setAttribute('content', COLORS[theme]);
    });
    var button = document.getElementById('theme-toggle');
    if (!button) return;
    var dark = theme === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', button.getAttribute(dark ? 'data-to-light' : 'data-to-dark'));
    button.title = button.getAttribute('aria-label');
  }

  var initial = saved();
  if (initial) root.setAttribute('data-theme', initial);

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('theme-toggle');
    sync();
    if (!button) return;
    button.hidden = false;
    button.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      save(next);
      sync();
    });
  });

  system.addEventListener('change', sync);
})();
