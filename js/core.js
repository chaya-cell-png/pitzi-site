/* פיצי – ליבת האתר: מצב משותף, הדמות, צלילים, חלונות, ביצים וטעינת הגימיקים */
(function () {
  'use strict';

  // כל גימיק הוא קובץ js/gimmicks/<שם>.js שנרשם עם Pitzi.register.
  // כדי להוסיף או להסיר גימיק מספיק לערוך את הרשימה הזו.
  const GIMMICKS = [
    'loading-bar', 'banana-cursor', 'sleepy', 'konami', 'crying-tab', 'scroll-react',
    'animal-sounds', 'boss-mode', 'end-of-internet', 'eggs', 'egg-hints',
    'cookies', 'dont-press', 'runaway', 'gravity', 'cat-mode', 'global-counter',
    'excuses', 'calculator', 'mood', 'reverse-clock',
    'impossible-form', 'cancel', 'quiz', 'lost-404', 'terms', 'runner', 'whack',
    // סודות: אין להם כפתור. הם מתגלים רק לפי ההתנהגות של הגולש
    'secrets/same-button', 'secrets/hover-beg', 'secrets/party-mode', 'secrets/special-time',
    'secrets/returning', 'secrets/sound-toggle', 'secrets/semicolon'
  ];

  const EGGS = {
    konami: 'הקוד הסודי',
    logo: 'הלוגו העקשן',
    cookie: 'עוגייה שלמה בבטן',
    caught: 'תפסת את הבורח',
    flag: 'הדגל הלבן',
    cancel: 'ביטול בשבעה שלבים',
    boss: 'הבוס לא ראה כלום',
    clock: 'אדון הזמן',
    lost: 'נמצא בחושך',
    tiny: 'הביצה הכי קטנה',
    terms: 'קראת את האותיות הקטנות',
    party: 'מצב מסיבה סודי',
    runner: 'רץ למרחקים',
    whack: 'מכה מקצועית'
  };

  // הסודות לא מופיעים ברשימה. רק המספר שלהם מוצג, כדי שיהיה מה לחפש
  const SECRETS = {
    sleepy: 'האתר נרדם',
    scroll: 'מגבלת מהירות',
    sameButton: 'לחיצות חוזרות',
    hover: 'כפתור מתחנן',
    party: 'מצב מסיבה',
    time: 'שעה מיוחדת',
    returning: 'פיצי זוכר',
    soundToggle: 'נגן הסאונד',
    semicolon: 'הנקודה-פסיק החסרה'
  };

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem('pitzi:' + key); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('pitzi:' + key, JSON.stringify(value)); } catch (e) { /* מצב פרטי */ }
    }
  };

  const html = document.documentElement;
  const reduceMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const savedCalm = store.get('calm', null);
  const scriptBase = ((document.currentScript && document.currentScript.src) || 'js/core.js').replace(/core\.js(\?.*)?$/, '');

  function el(tag, cls, inner) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (inner != null) n.innerHTML = inner;
    return n;
  }

  const P = window.Pitzi = {
    page: document.body.dataset.page || 'other',
    calm: savedCalm === null ? reduceMotion : savedCalm,
    soundOn: store.get('sound', false),
    boss: false,
    store, EGGS, SECRETS, el,
    modules: {},
    register(name, def) { this.modules[name] = Object.assign({ name, on: false, active: false }, def); },
    rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  };

  /* ---------- צלילים (Web Audio, בלי קבצים, כל צליל עד שנייה) ---------- */
  let ctx = null;
  function audio() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone({ type = 'sine', f = [[0, 440]], dur = 0.3, vol = 0.2, vib = 0, vibRate = 6, filter = null, at = 0 }) {
    const c = audio(); if (!c) return;
    const t0 = c.currentTime + at;
    const o = c.createOscillator();
    o.type = type;
    f.forEach(([t, fr], i) => i ? o.frequency.exponentialRampToValueAtTime(fr, t0 + t) : o.frequency.setValueAtTime(fr, t0));
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    if (vib) {
      const lfo = c.createOscillator(), lg = c.createGain();
      lfo.frequency.value = vibRate; lg.gain.value = vib;
      lfo.connect(lg).connect(o.frequency);
      lfo.start(t0); lfo.stop(t0 + dur);
    }
    let node = o;
    if (filter) {
      const fl = c.createBiquadFilter();
      fl.type = filter.type; fl.frequency.value = filter.f; fl.Q.value = filter.q || 1;
      node.connect(fl); node = fl;
    }
    node.connect(g).connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  const SOUNDS = {
    boing: () => tone({ f: [[0, 180], [0.15, 520], [0.5, 240]], dur: 0.5, vol: 0.25, vib: 30, vibRate: 18 }),
    pop: () => tone({ type: 'triangle', f: [[0, 900], [0.08, 200]], dur: 0.1, vol: 0.3 }),
    beep: () => tone({ type: 'square', f: [[0, 880]], dur: 0.15, vol: 0.08 }),
    moo: () => tone({ type: 'sawtooth', f: [[0, 140], [0.3, 120], [0.8, 95]], dur: 0.85, vol: 0.18, filter: { type: 'lowpass', f: 600 } }),
    meow: () => tone({ type: 'triangle', f: [[0, 550], [0.15, 950], [0.45, 600]], dur: 0.5, vol: 0.2, vib: 15, vibRate: 7 }),
    woof: () => [0, 0.2].forEach(at => tone({ type: 'square', f: [[0, 320], [0.12, 140]], dur: 0.14, vol: 0.12, filter: { type: 'lowpass', f: 900 }, at })),
    quack: () => [0, 0.18].forEach(at => tone({ type: 'sawtooth', f: [[0, 600], [0.12, 420]], dur: 0.13, vol: 0.12, filter: { type: 'bandpass', f: 1100, q: 3 }, at })),
    baa: () => tone({ type: 'sawtooth', f: [[0, 420], [0.6, 380]], dur: 0.65, vol: 0.13, vib: 25, vibRate: 28, filter: { type: 'lowpass', f: 1800 } }),
    ribbit: () => [0, 0.1].forEach(at => tone({ type: 'square', f: [[0, 200], [0.07, 140]], dur: 0.08, vol: 0.12, filter: { type: 'lowpass', f: 700 }, at })),
    tweet: () => [0, 0.12, 0.24].forEach(at => tone({ f: [[0, 2200], [0.08, 3200]], dur: 0.09, vol: 0.1, at })),
    snore: () => tone({ type: 'sawtooth', f: [[0, 70], [0.9, 55]], dur: 0.9, vol: 0.06, filter: { type: 'lowpass', f: 300 } }),
    whoosh: () => tone({ type: 'sawtooth', f: [[0, 200], [0.8, 1200]], dur: 0.8, vol: 0.06, filter: { type: 'bandpass', f: 800, q: 0.7 } })
  };
  P.sound = function (name) {
    if (!P.soundOn || P.calm || !SOUNDS[name]) return;
    try { SOUNDS[name](); } catch (e) { /* דפדפן בלי אודיו */ }
  };

  /* ---------- קונפטי ---------- */
  P.burst = function (opts) {
    if (P.calm || typeof window.confetti !== 'function') return;
    window.confetti(Object.assign({
      particleCount: 80, spread: 70, origin: { y: 0.6 },
      colors: ['#FF3B3B', '#FFD93D', '#2EC4B6', '#8E44AD'],
      disableForReducedMotion: true
    }, opts));
  };
  P.burstFrom = function (node, opts) {
    const r = node.getBoundingClientRect();
    P.burst(Object.assign({ origin: { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight } }, opts));
  };

  /* ---------- חלון קופץ נגיש ---------- */
  P.modal = function (inner, opts = {}) {
    const wrap = el('div', 'modal-wrap');
    const box = el('div', 'modal ' + (opts.className || ''), inner);
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', opts.label || 'חלון');
    box.tabIndex = -1;
    wrap.appendChild(box);
    document.body.appendChild(wrap);
    const prev = document.activeElement;
    const focusables = () => [...box.querySelectorAll('button, a[href], input, textarea, select')]
      .filter(x => !x.disabled && x.offsetParent !== null);
    let closed = false;
    function close() {
      if (closed) return;
      closed = true;
      wrap.remove();
      if (prev && prev.focus) prev.focus();
      if (opts.onClose) opts.onClose();
    }
    wrap.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (!opts.noEsc) close();
      } else if (e.key === 'Tab') {
        const f = focusables(); if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    box.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
    const focusFirst = () => { const f = focusables(); (f[0] || box).focus(); };
    requestAnimationFrame(focusFirst);
    return { wrap, box, close, focusFirst };
  };

  /* ---------- הודעות קופצות ---------- */
  P.toast = function (text) {
    const t = el('div', 'toast');
    t.setAttribute('role', 'status');
    t.textContent = text;
    t.style.top = (16 + 60 * document.querySelectorAll('.toast:not(.out)').length) + 'px'; // כמה הודעות יחד נערמות
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('out'), 3800);
    setTimeout(() => t.remove(), 4400);
  };

  /* ---------- ביצי הפתעה ---------- */
  P.eggsFound = () => store.get('eggs', []);
  P.egg = function (id) {
    const found = P.eggsFound();
    if (!EGGS[id] || found.includes(id)) return false;
    found.push(id);
    store.set('eggs', found);
    const total = Object.keys(EGGS).length;
    P.toast(`🥚 מצאת ביצת הפתעה: "${EGGS[id]}"! (${found.length}/${total})`);
    P.sound('pop');
    document.dispatchEvent(new CustomEvent('pitzi:egg', { detail: { id, n: found.length, total } }));
    return true;
  };

  /* ---------- סודות ---------- */
  P.secretsFound = () => store.get('secrets', []);
  P.secret = function (id) {
    const found = P.secretsFound();
    if (!SECRETS[id] || found.includes(id)) return false;
    found.push(id);
    store.set('secrets', found);
    const total = Object.keys(SECRETS).length;
    // מחכים רגע, כדי שהגולש יספיק לקרוא קודם את מה שפיצי אמר
    setTimeout(() => P.toast(`🤫 גילית סוד: "${SECRETS[id]}"! (${found.length}/${total})`), 1500);
    document.dispatchEvent(new CustomEvent('pitzi:secret', { detail: { id, n: found.length, total } }));
    return true;
  };

  /* ---------- כותרת וניווט ---------- */
  const NAV = [['index.html', 'בית', 'home'], ['tools.html', 'כלים', 'tools'], ['quiz.html', 'מבחן', 'quiz'], ['game.html', 'משחקים', ['game', 'whack']], ['contact.html', 'צור קשר', 'contact']];
  function buildHeader() {
    const skip = el('a', 'skip', 'דלג לתוכן');
    skip.href = '#main';
    const header = el('header', 'site-header');
    header.innerHTML = `
      <button class="logo" id="logo" type="button" aria-label="הלוגו של האתר: לחץ כאן ואל תלחץ כאן">לחץ כאן <span>ואל תלחץ כאן</span></button>
      <nav class="site-nav" aria-label="ניווט ראשי">
         ${NAV.map(([href, label, page]) => `<a href="${href}"${[].concat(page).includes(P.page) ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
      </nav>
      <div class="controls">
        <button class="chip" id="eggBtn" type="button">🥚</button>
        <button class="chip" id="soundBtn" type="button"></button>
        <button class="chip" id="calmBtn" type="button"></button>
      </div>`;
    document.body.prepend(header);
    document.body.prepend(skip);

    const soundBtn = header.querySelector('#soundBtn');
    const calmBtn = header.querySelector('#calmBtn');
    P.refreshControls = function () {
      soundBtn.textContent = P.soundOn ? '🔊 צלילים' : '🔇 צלילים';
      soundBtn.setAttribute('aria-pressed', String(P.soundOn));
      soundBtn.setAttribute('aria-label', P.soundOn ? 'צלילים פועלים. לחץ להשתקה' : 'צלילים כבויים. לחץ להפעלה');
      calmBtn.textContent = P.calm ? 'חזרה לבלגן 🤪' : 'די, נרגעתי 😌';
      calmBtn.setAttribute('aria-pressed', String(P.calm));
    };
    soundBtn.addEventListener('click', () => {
      P.soundOn = !P.soundOn;
      store.set('sound', P.soundOn);
      if (P.soundOn && P.calm) setCalm(false);
      P.refreshControls();
      P.sound('pop');
      P.say(P.soundOn ? 'בוינג! 🔊 עכשיו אני גם רועש.' : 'שקט. 🤫 אני מדבר רק בבועות.');
    });
    calmBtn.addEventListener('click', () => setCalm(!P.calm));
    P.refreshControls();
  }

  /* ---------- מצב רגוע ---------- */
  function setCalm(v) {
    P.calm = v;
    store.set('calm', v);
    html.classList.toggle('calm', v);
    Object.values(P.modules).forEach(m => {
      if (!m.active || !m.motion) return;
      try {
        if (v && m.on) { if (m.disable) m.disable(); m.on = false; }
        else if (!v && !m.on) { if (m.enable) m.enable(); m.on = true; }
      } catch (e) { console.warn('[פיצי]', m.name, e); }
    });
    if (P.refreshControls) P.refreshControls();
    P.say(v ? 'נרגעתי. 😌 בלי אנימציות ובלי צלילים. נשימה עמוקה...' : 'חזרנו לבלגן! 🤪');
    document.dispatchEvent(new CustomEvent('pitzi:calm', { detail: v }));
  }
  P.setCalm = setCalm;

  /* ---------- פיצי ---------- */
  const PITZI_SVG = `
  <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <g class="pz-flag"><line x1="100" y1="12" x2="100" y2="92" stroke="#111" stroke-width="4" stroke-linecap="round"/>
      <path d="M100 14 h-32 q6 9 0 18 h32z" fill="#fff" stroke="#111" stroke-width="3" stroke-linejoin="round"/></g>
    <g class="pz-torch"><rect x="92" y="70" width="24" height="12" rx="3" fill="#FFD93D" stroke="#111" stroke-width="3" transform="rotate(-25 92 76)"/></g>
    <ellipse cx="60" cy="100" rx="46" ry="13" fill="#8a1d1d" stroke="#111" stroke-width="4"/>
    <circle cx="60" cy="62" r="42" fill="#FF3B3B" stroke="#111" stroke-width="5"/>
    <ellipse cx="44" cy="36" rx="11" ry="6" fill="#fff" opacity=".45" transform="rotate(-25 44 36)"/>
    <circle cx="45" cy="58" r="11" fill="#fff" stroke="#111" stroke-width="3"/>
    <circle cx="75" cy="58" r="11" fill="#fff" stroke="#111" stroke-width="3"/>
    <g class="pz-pupils"><circle cx="45" cy="58" r="5" fill="#111"/><circle cx="75" cy="58" r="5" fill="#111"/></g>
    <ellipse class="pz-lid" cx="45" cy="58" rx="12.5" ry="12.5" fill="#FF3B3B" stroke="#111" stroke-width="3"/>
    <ellipse class="pz-lid" cx="75" cy="58" rx="12.5" ry="12.5" fill="#FF3B3B" stroke="#111" stroke-width="3"/>
    <path class="pz-mouth-happy" d="M48 80 q12 10 24 0" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
    <path class="pz-mouth-tired" d="M49 84 q11 -5 22 0" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
    <g class="pz-band1"><rect x="18" y="64" width="28" height="11" rx="4" fill="#F5D0A9" stroke="#111" stroke-width="2.5" transform="rotate(-35 32 70)"/>
      <circle cx="28" cy="72" r="1.3" fill="#111"/><circle cx="34" cy="68" r="1.3" fill="#111"/></g>
    <g class="pz-band2"><rect x="70" y="24" width="30" height="11" rx="4" fill="#F5D0A9" stroke="#111" stroke-width="2.5" transform="rotate(30 85 30)"/>
      <circle cx="82" cy="28" r="1.3" fill="#111"/><circle cx="88" cy="32" r="1.3" fill="#111"/></g>
    <path class="pz-sweat" d="M102 46 q6 9 0 13 q-6 -4 0 -13z" fill="#2EC4B6" stroke="#111" stroke-width="2"/>
    <g class="pz-brows" stroke="#111" stroke-width="5" stroke-linecap="round"><path d="M33 40 l22 8"/><path d="M87 40 l-22 8"/></g>
    <g class="pz-hat" transform="rotate(-14 60 24)">
      <path d="M44 26 L60 -16 L76 26 Z" fill="#8E44AD" stroke="#111" stroke-width="3" stroke-linejoin="round"/>
      <path d="M50 12 h20 M47 20 h26" stroke="#FFD93D" stroke-width="3"/>
      <circle cx="60" cy="-17" r="6" fill="#FFD93D" stroke="#111" stroke-width="2.5"/></g>
  </svg>`;

  const SELF_LINES = [
    'אני פיצי. אני כפתור. זה כל הסיפור.',
    'לחצת עליי? אני לא כפתור מהסוג הזה! ...טוב, אני כן.',
    'שים לב: האתר הזה לא נבדק על ידי אף מומחה. גם לא על ידי לא-מומחה.',
    'טיפ: מסתתרות באתר ' + Object.keys(EGGS).length + ' ביצי הפתעה. אני לא אומר איפה. טוב, אולי ארמוז בהמשך.',
    'רגע, אני לא מוכן לצילום. תן לי לסדר את העיניים.',
    'יש לי רק שתי עיניים ופה. ובכל זאת אני מדבר יותר מדי.',
    'אני אדום כי אני נבוך. כל הזמן. מאז שנולדתי.'
  ];

  let pitzi, bubble, sayTimer;
  function buildPitzi() {
    pitzi = el('div', 'pitzi');
    pitzi.innerHTML = `<div class="pz-bubble" role="status" aria-live="polite"></div>
      <button class="pz-body" type="button" aria-label="פיצי, הכפתור המנחה. לחץ כדי לשמוע מה יש לו להגיד">${PITZI_SVG}</button>`;
    document.body.appendChild(pitzi);
    bubble = pitzi.querySelector('.pz-bubble');
    pitzi.querySelector('.pz-body').addEventListener('click', () => { P.sound('beep'); P.say(P.rand(SELF_LINES)); });

    // העיניים עוקבות אחרי הסמן
    const pupils = pitzi.querySelector('.pz-pupils');
    let raf = 0, lx = 0, ly = 0;
    addEventListener('pointermove', e => {
      lx = e.clientX; ly = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = pitzi.querySelector('svg').getBoundingClientRect();
        const dx = lx - (r.left + r.width / 2), dy = ly - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1, k = Math.min(4, d / 40);
        pupils.setAttribute('transform', `translate(${(dx / d * k).toFixed(1)} ${(dy / d * k).toFixed(1)})`);
      });
    }, { passive: true });

    // מצמוץ אקראי כל 4–7 שניות
    (function blinkLoop() {
      setTimeout(() => {
        if (!P.calm && !pitzi.classList.contains('sleeping')) {
          pitzi.classList.add('blink');
          setTimeout(() => pitzi.classList.remove('blink'), 170);
        }
        blinkLoop();
      }, 4000 + Math.random() * 3000);
    })();
  }

  P.say = function (text, ms) {
    if (!bubble) return;
    bubble.textContent = text;
    pitzi.classList.add('talking');
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => pitzi.classList.remove('talking'), ms || Math.max(3200, text.length * 75));
  };
  // פיצי פנוי כשהוא לא מדבר ואין חלון, טעינה, שינה או מצב בוס
  P.isBusy = () => P.boss || pitzi.classList.contains('talking') ||
    !!document.querySelector('.modal-wrap, .loader, .sleep');
  P.sayWhenFree = function (text, ms, tries = 30) {
    if (!P.isBusy()) return P.say(text, ms);
    if (tries > 0) setTimeout(() => P.sayWhenFree(text, ms, tries - 1), 1000);
  };
  P.pitziEl = () => pitzi;
  P.setPitziClass = (cls, on) => pitzi && pitzi.classList.toggle(cls, on);
  P.updateMood = function () {
    const n = store.get('presses', 0);
    pitzi.classList.toggle('t1', n >= 15);
    pitzi.classList.toggle('t2', n >= 30);
    pitzi.classList.toggle('flag', n >= 50);
  };

  /* ---------- מונה לחיצות אישי ---------- */
  document.addEventListener('click', e => {
    if (e.target.closest('button, a')) store.set('clicks', store.get('clicks', 0) + 1);
  }, true);

  /* ---------- טעינת הגימיקים והפעלתם ---------- */
  function boot() {
    GIMMICKS.forEach(name => {
      const m = P.modules[name];
      if (!m || (m.pages && !m.pages.includes(P.page))) return;
      m.active = true;
      try {
        if (m.init) m.init();
        if (!(m.motion && P.calm)) { if (m.enable) m.enable(); m.on = true; }
      } catch (e) { console.warn('[פיצי] הגימיק נכשל ונשאר כבוי:', name, e); }
    });
    html.classList.add('ready');
    document.dispatchEvent(new CustomEvent('pitzi:ready'));
  }
  function loadGimmicks() {
    let left = GIMMICKS.length;
    GIMMICKS.forEach(name => {
      const s = document.createElement('script');
      s.src = scriptBase + 'gimmicks/' + name + '.js';
      s.async = false; // שומר על סדר ההרצה
      s.onload = s.onerror = () => { if (--left === 0) boot(); };
      document.head.appendChild(s);
    });
  }

  html.classList.toggle('calm', P.calm);
  buildHeader();
  buildPitzi();
  P.updateMood();
  loadGimmicks();
})();
