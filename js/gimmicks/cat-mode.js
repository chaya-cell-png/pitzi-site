/* גימיק 20: מצב חתול – חתולים מצוירים מכסים את האתר ורודפים אחרי הסמן */
(function () {
  const P = window.Pitzi;
  const COUNT = 8;
  const FURS = ['#F2A65A', '#9E9E9E', '#3B3B3B', '#F5E6C8', '#D9822B', '#C9C9C9'];
  const catSvg = fur => `
    <svg viewBox="0 0 70 56" aria-hidden="true" focusable="false">
      <path d="M58 30 q12 -6 8 -20" fill="none" stroke="#1A1A1A" stroke-width="6" stroke-linecap="round"/>
      <path d="M58 30 q12 -6 8 -20" fill="none" stroke="${fur}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="38" cy="38" rx="22" ry="14" fill="${fur}" stroke="#1A1A1A" stroke-width="3"/>
      <path d="M8 14 l4 -12 l8 9 z M28 11 l4 -11 l5 12 z" fill="${fur}" stroke="#1A1A1A" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="22" cy="24" r="15" fill="${fur}" stroke="#1A1A1A" stroke-width="3"/>
      <circle cx="16" cy="22" r="3" fill="#1A1A1A"/><circle cx="27" cy="22" r="3" fill="#1A1A1A"/>
      <path d="M19 28 q2.5 2.5 5 0" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
      <path d="M24 49 v5 M46 49 v5" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/>
    </svg>`;

  let cats = [], raf = 0, tx = innerWidth / 2, ty = innerHeight / 2;
  const track = e => { tx = e.clientX; ty = e.clientY; };

  function tick() {
    cats.forEach(c => {
      if (c.fleeUntil > performance.now()) {
        c.x += c.vx; c.y += c.vy;
      } else {
        const dx = tx + c.ox - c.x, dy = ty + c.oy - c.y, d = Math.hypot(dx, dy);
        if (d > 4) { c.x += dx / d * Math.min(c.speed, d); c.y += dy / d * Math.min(c.speed, d); }
        if (dx !== 0) c.el.classList.toggle('flip', dx > 0);
        if (d < 40 && !c.el.classList.contains('pounce')) {
          c.el.classList.add('pounce');
          setTimeout(() => c.el.classList.remove('pounce'), 450);
        }
      }
      c.el.style.transform = `translate(${c.x - 35}px, ${c.y - 28}px)`;
    });
    raf = requestAnimationFrame(tick);
  }

  function release() {
    const W = innerWidth, H = innerHeight;
    for (let i = 0; i < COUNT; i++) {
      const el = P.el('div', 'cat', catSvg(FURS[i % FURS.length]));
      el.setAttribute('aria-hidden', 'true');
      const edge = i % 4;
      const c = {
        el, speed: 1.6 + Math.random() * 2.4, fleeUntil: 0, vx: 0, vy: 0,
        x: edge === 0 ? -40 : edge === 1 ? W + 40 : Math.random() * W,
        y: edge === 2 ? -40 : edge === 3 ? H + 40 : Math.random() * H,
        ox: (Math.random() - 0.5) * 140, oy: (Math.random() - 0.5) * 100
      };
      el.addEventListener('click', () => {
        P.sound('meow');
        const a = Math.random() * Math.PI * 2;
        c.vx = Math.cos(a) * 9; c.vy = Math.sin(a) * 9;
        c.fleeUntil = performance.now() + 700;
      });
      document.body.appendChild(el);
      cats.push(c);
    }
    addEventListener('pointermove', track, { passive: true });
    addEventListener('pointerdown', track, { passive: true });
    raf = requestAnimationFrame(tick);
  }

  function recall() {
    cancelAnimationFrame(raf);
    removeEventListener('pointermove', track);
    removeEventListener('pointerdown', track);
    cats.forEach(c => c.el.remove());
    cats = [];
  }

  P.register('cat-mode', {
    pages: ['home'],
    motion: true,
    init() {
      const btn = document.getElementById('catBtn');
      if (!btn) return;
      const sync = () => {
        btn.textContent = cats.length ? 'החזר את החתולים הביתה 🏠' : 'שחרר את החתולים 🐱';
        btn.setAttribute('aria-pressed', String(!!cats.length));
      };
      btn.addEventListener('click', () => {
        if (P.calm) return P.say('החתולים ישנים במצב רגוע. ששש... 🐈‍⬛💤');
        if (cats.length) { recall(); P.say('החתולים חזרו הביתה. אחד מהם לקח לי את הגרב.'); }
        else { release(); P.sound('meow'); P.say('מיאו! זהירות, הם אוהבים סמנים. אפשר ללחוץ עליהם כדי להבריח אותם.'); }
        sync();
      });
      this.sync = sync;
    },
    disable() { recall(); if (this.sync) this.sync(); }
  });
})();
