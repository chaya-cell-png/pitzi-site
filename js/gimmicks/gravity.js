/* גימיק 6: כפתור גרביטציה – כל האלמנטים בעמוד נופלים לתחתית ומתערבבים (Matter.js, נטען רק כשצריך) */
(function () {
  const P = window.Pitzi;
  const MATTER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
  let running = null;

  function loadMatter() {
    if (window.Matter) return Promise.resolve(window.Matter);
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = MATTER_URL;
      s.onload = () => resolve(window.Matter);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function start(M) {
    const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = M;
    const W = innerWidth, H = innerHeight;
    const els = [...document.querySelectorAll('[data-fall], .site-header')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.bottom > -200 && r.top < H + 200 && r.width > 0;
    });
    const engine = Engine.create();
    engine.gravity.y = 1.2;
    const wall = { isStatic: true };
    Composite.add(engine.world, [
      Bodies.rectangle(W / 2, H + 50, W * 3, 100, wall),
      Bodies.rectangle(-50, H / 2, 100, H * 4, wall),
      Bodies.rectangle(W + 50, H / 2, 100, H * 4, wall)
    ]);
    const pairs = els.map(el => {
      const r = el.getBoundingClientRect();
      const body = Bodies.rectangle(r.left + r.width / 2, r.top + r.height / 2, r.width, r.height,
        { restitution: 0.35, friction: 0.4, chamfer: { radius: 12 } });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.04);
      el.classList.add('falling');
      return { el, body, x: body.position.x, y: body.position.y };
    });
    Composite.add(engine.world, pairs.map(p => p.body));

    document.documentElement.style.overflow = 'hidden';
    const catcher = P.el('div', 'gravity-catcher');
    catcher.setAttribute('aria-hidden', 'true');
    document.body.appendChild(catcher);
    const mouse = Mouse.create(catcher);
    Composite.add(engine.world, MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2 } }));

    const restore = P.el('button', 'btn btn-red gravity-restore', 'החזר הכל למקום 🧲');
    restore.type = 'button';
    document.body.appendChild(restore);
    restore.focus();

    Events.on(engine, 'afterUpdate', () => {
      pairs.forEach(p => {
        p.el.style.transform = `translate(${p.body.position.x - p.x}px, ${p.body.position.y - p.y}px) rotate(${p.body.angle}rad)`;
      });
    });
    const runner = Runner.create();
    Runner.run(runner, engine);

    function stop() {
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      catcher.remove();
      restore.remove();
      document.documentElement.style.overflow = '';
      pairs.forEach(p => {
        p.el.classList.add('unfalling');
        p.el.style.transform = '';
        setTimeout(() => p.el.classList.remove('falling', 'unfalling'), 900);
      });
      running = null;
      P.say('הכל חזר למקום. כמעט. נראה לי שחסר בורג.');
      const btn = document.getElementById('gravityBtn');
      if (btn) btn.focus();
    }
    restore.addEventListener('click', stop);
    running = stop;
  }

  P.register('gravity', {
    pages: ['home'],
    motion: true,
    init() {
      const btn = document.getElementById('gravityBtn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (P.calm) return P.say('במצב רגוע כוח המשיכה נח. גם הוא צריך הפסקה.');
        if (running) return;
        btn.disabled = true;
        P.sound('whoosh');
        P.say('אוי, לא! הכל נופל! תפסו את הכותרת!');
        loadMatter()
          .then(start)
          .catch(() => P.say('כוח המשיכה לא נטען. כנראה שהוא בחופשה. נסה שוב עוד מעט.'))
          .finally(() => { btn.disabled = false; });
      });
    },
    disable() { if (running) running(); }
  });
})();
