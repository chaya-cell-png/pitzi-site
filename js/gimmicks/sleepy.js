/* גימיק 4: האתר נעלב – אחרי 30 שניות בלי תזוזה הוא נרדם ונוחר, ותזוזה מעירה אותו בבהלה */
(function () {
  const P = window.Pitzi;
  const IDLE_MS = 30000;
  const WAKE_LINES = [
    'אה?! מה?! לא ישנתי! רק נחתי את העיניים.',
    'הייתי ער כל הזמן. סתם בדקתי את הפיקסלים מבפנים.',
    'חלמתי שאני כפתור כחול. איזה סיוט.',
    'מי? מה? איפה? אה, זה אתה. נבהלתי!'
  ];
  let timer = 0, overlay = null, snore = 0, asleepAt = 0;

  function sleep() {
    if (overlay || document.hidden || P.boss) return schedule();
    asleepAt = Date.now();
    overlay = P.el('div', 'sleep', `
      <div>
        <div class="zzz" aria-hidden="true"><span>Z</span><span>z</span><span>z</span></div>
        <p>ששש... האתר נרדם.</p>
        <p style="font-size:1.1rem">תזיז משהו כדי להעיר אותו. בעדינות!</p>
      </div>`);
    overlay.setAttribute('role', 'status');
    document.body.appendChild(overlay);
    P.setPitziClass('sleeping', true);
    P.sound('snore');
    snore = setInterval(() => P.sound('snore'), 2600);
  }

  function wake() {
    if (overlay && Date.now() - asleepAt > 400) {
      overlay.remove();
      overlay = null;
      clearInterval(snore);
      P.setPitziClass('sleeping', false);
      const html = document.documentElement;
      html.classList.add('startled');
      setTimeout(() => html.classList.remove('startled'), 600);
      P.sound('boing');
      P.say(P.rand(WAKE_LINES));
      P.secret('sleepy');
    }
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(sleep, IDLE_MS);
  }

  P.register('sleepy', {
    init() {
      ['pointermove', 'pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart'].forEach(ev =>
        addEventListener(ev, wake, { passive: true }));
      schedule();
    }
  });
})();
