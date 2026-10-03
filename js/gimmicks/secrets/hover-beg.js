/* סוד: להשאיר את העכבר על כפתור בלי ללחוץ, והכפתור מתחיל להתחנן */
(function () {
  const P = window.Pitzi;
  const STEPS = [[2500, 'נו...? 🥺'], [5500, 'אני כפתור טוב. באמת.'], [9000, 'בבקשה! רק לחיצה אחת קטנה! 🙏']];
  // כפתור "אל תלחץ" מתחנן הפוך
  const DONT = [[2500, 'אתה מתכוון ללחוץ? אל.'], [5500, 'אני רואה אותך מרחף שם.'], [9000, '...טוב, אל תלחץ. אבל גם אל תלך. 🥺']];
  const SKIP = '#runaway, .pz-body, .cat, .boss *, .runner-controls button, .hole';
  let current = null, timers = [], pop = null;

  function clear(thanks) {
    timers.forEach(clearTimeout);
    timers = [];
    if (pop) pop.remove();
    pop = null;
    if (current) {
      current.classList.remove('begging');
      const id = current.id;
      if (thanks) setTimeout(() => P.say(id === 'dontPress' ? 'אמרתי לא ללחוץ! ...אבל תודה שלא הלכת.' : 'תודה!!! ידעתי שאתה אדם טוב. 🥹'), 0);
    }
    current = null;
  }

  function show(el, text) {
    if (!pop) { pop = P.el('div', 'beg-pop'); pop.setAttribute('aria-hidden', 'true'); document.body.appendChild(pop); }
    const r = el.getBoundingClientRect();
    pop.style.left = (r.left + r.width / 2) + 'px';
    pop.style.top = Math.max(50, r.top - 12) + 'px';
    pop.textContent = text;
    if (!P.calm) el.classList.add('begging');
  }

  P.register('secrets/hover-beg', {
    init() {
      document.addEventListener('pointerover', e => {
        if (e.pointerType !== 'mouse') return;
        const el = e.target.closest('button, .btn');
        if (!el || el === current || el.closest(SKIP) || el.disabled) return;
        clear(false);
        current = el;
        let begged = false;
        (el.id === 'dontPress' ? DONT : STEPS).forEach(([ms, text]) => timers.push(setTimeout(() => {
          show(el, text);
          if (!begged) { begged = true; P.secret('hover'); }
        }, ms)));
      });
      document.addEventListener('pointerout', e => {
        if (current && !current.contains(e.relatedTarget)) clear(false);
      });
      // לחיצה אחרי שהכפתור כבר התחנן = תודה
      document.addEventListener('click', e => {
        if (current && current.contains(e.target)) clear(!!pop);
      }, true);
      addEventListener('scroll', () => clear(false), { passive: true });
    }
  });
})();
