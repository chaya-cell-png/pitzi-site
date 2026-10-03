/* גימיק 3: סמן משוגע – העכבר הופך לבננה ומשאיר שובל קונפטי */
(function () {
  const P = window.Pitzi;
  const COLORS = ['#FF3B3B', '#FFD93D', '#2EC4B6', '#8E44AD'];
  const MAX_LIVE = 40;
  let last = 0, live = 0;

  function spawn(e) {
    if (e.pointerType !== 'mouse') return;
    const now = performance.now();
    if (now - last < 35 || live >= MAX_LIVE) return;
    last = now;
    const s = document.createElement('span');
    s.className = 'trail';
    s.style.left = (e.clientX + 6) + 'px';
    s.style.top = (e.clientY + 10) + 'px';
    s.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    s.style.setProperty('--dx', (Math.random() * 40 - 20).toFixed(0) + 'px');
    live++;
    s.addEventListener('animationend', () => { s.remove(); live--; });
    document.body.appendChild(s);
  }

  P.register('banana-cursor', {
    motion: true,
    enable() {
      if (!matchMedia('(pointer: fine)').matches) return; // במגע אין סמן
      document.documentElement.classList.add('banana');
      addEventListener('pointermove', spawn, { passive: true });
    },
    disable() {
      document.documentElement.classList.remove('banana');
      removeEventListener('pointermove', spawn);
    }
  });
})();
