/* משחק "הכה בכפתור הכחול" – בסגנון הכה-בחפרפרת. כחול = ללחוץ. פיצי = לא ללחוץ! */
(function () {
  const P = window.Pitzi;
  const ROUND_MS = 30000, TICK = 50, EGG_SCORE = 25;

  // קצב המשחק (באלפיות שנייה). כל ערך עובר בהדרגה מ"התחלה" ל"סוף" לאורך הסיבוב
  const SPEED = {
    blueStay: [1400, 850],    // כמה זמן כפתור כחול נשאר בחוץ
    spawnGap: [880, 500],     // הפסקה ממוצעת בין כפתור לכפתור
    maxUp: [1, 2],            // כמה כפתורים בחוץ בבת אחת
    goldStay: 850, pitziStay: 1600, cookieStay: 1150
  };
  const lerp = ([from, to], t) => from + (to - from) * t;

  /* ---------- משפטים ---------- */
  const START = [
    'הכפתורים הכחולים יוצאים מהחורים! תלחץ עליהם. רק לא עליי.',
    'כללים פשוטים: כחול = ללחוץ. אדום = אני. אל תלחץ עליי.',
    'יאללה! 30 שניות של נקמה בכפתורים הכחולים.',
    'אני אסתתר באחד החורים. סתם. ...או שלא. 😏'
  ];
  const HIT_BLUE = [
    'בום!', 'תפסת אותו!', 'זה על כל הפעמים שהוא היה כחול!', 'פוף! עוד אחד.',
    'הוא אפילו לא ראה את זה בא.', 'ישר לחור!', 'כחול פחות אחד.', 'יפה! הוא ילך להתלונן לאמא שלו.',
    'הכפתורים כבר מדברים עליך בקבוצת וואטסאפ.', 'קליק! איזה צליל נעים.', 'עוד אחד לאוסף!'
  ];
  const HIT_GOLD = [
    'כפתור זהב! חמש נקודות! אני מסונוור!',
    'זהב! זה כמו לזכות בלוטו, רק עם כפתורים.',
    'תפסת את הכפתור הנדיר! הוא היה פה רק לביקור קצר.'
  ];
  const HIT_PITZI = [
    'אאוץ\'! זה אני! אמרתי לא ללחוץ עליי! זה כל העניין של האתר!',
    'שוב?! יש פה תשעה חורים ובחרת דווקא בי?',
    'אני מתחיל לחשוב שאתה עושה את זה בכוונה.',
    'זהו. אני מתחבא בחור אחר. ...אוי, גם פה אתה.',
    'אני מגיש תלונה לוועד הכפתורים.',
    'מינוס שלוש! וגם מינוס חבר.'
  ];
  const COOKIE = ['עוגייה! עוד 3 שניות. וגם פירורים.', 'עוגיית זמן! כל ביס שווה שנייה. בערך.', 'עוגייה בחור? מי שם אותה שם? לא חשוב. עוד זמן!'];
  const ESCAPE = ['הוא ברח! הוא יספר לכולם.', 'פספסת! הוא חזר לחור עם חיוך.', 'הכפתור הכחול עושה לך פרצוף מהחור.', 'אוי, הוא היה מהיר. או שאתה איטי. אני לא שופט.'];
  const EMPTY = ['לחצת על חור ריק. החור מודה לך על תשומת הלב.', 'אין שם כלום. רק חושך ופירור אחד.', 'פספוס! החור אומר: "שלום?"', 'זה חור. חורים לא נותנים נקודות. בדקתי.'];
  const COMBO = {
    5: 'קומבו 5! אתה על גל! 🌊',
    10: 'קומבו 10! הכפתורים מתחילים לפחד.',
    15: 'קומבו 15!!! מישהו שיעצור אותו!',
    20: 'קומבו 20! זה כבר לא משחק, זו שליחות.',
    30: 'קומבו 30! אני הולך להביא לך כוס מים.'
  };
  const SPEEDUP = 'הם מתחילים להאיץ! מישהו נתן להם קפה. ☕';
  const TIME_LOW = ['חמש שניות אחרונות! תלחץ כאילו אין מחר!', 'עוד רגע נגמר! הכפתורים כבר אורזים מזוודות.'];
  const RANKS = [
    [-Infinity, 'הכפתורים מודים לך', 'ניקוד שלילי?! לחצת עליי יותר מעליהם. אני לא יודע אם להיעלב או להתרגש.'],
    [0, 'שומר שלום', 'אפס? לא לחצת על אף כפתור? אתה האדם שחיפשתי כל חיי! ...אבל זה משחק. תלחץ.'],
    [1, 'תייר בממלכת הכפתורים', 'התחלה! הכפתורים בקושי שמו לב שהיית פה.'],
    [5, 'לוחץ מתחיל', 'לא רע! הכפתורים הכחולים ירגישו את זה מחר בבוקר.'],
    [15, 'מכה מוסמך', 'מכה מוסמך! תלה את זה על הקיר. ליד הלוגו.'],
    [25, 'ידיים של נינג\'ה', 'ידיים של נינג\'ה! הכפתורים כבר מספרים עליך אגדות.'],
    [40, 'אגדת הכפתורים', 'אגדה! ספרי ההיסטוריה של הכפתורים ייכתבו מחדש.'],
    [60, 'הכפתורים הגישו תלונה רשמית', 'הכפתורים הכחולים הגישו תלונה רשמית. אני חותם עליה. סתם, אני גאה בך.']
  ];
  const RECORD = [
    'שיא חדש! הכפתורים הכחולים תולים את התמונה שלך עם הכיתוב "מבוקש".',
    'שיא! אני מוסיף אותך לרשימת האנשים שאסור להם להתקרב לכפתורים.'
  ];

  /* ---------- ציורים ---------- */
  const eyes = (pupilDy = 1) => [36, 64].map(x =>
    `<circle cx="${x}" cy="46" r="10" fill="#fff" stroke="#1A1A1A" stroke-width="3"/><circle cx="${x + 1}" cy="${46 + pupilDy}" r="4.5" fill="#1A1A1A"/>`).join('');
  const body = (fill, base) => `
    <ellipse cx="50" cy="90" rx="40" ry="9" fill="${base}" stroke="#1A1A1A" stroke-width="4"/>
    <circle cx="50" cy="54" r="38" fill="${fill}" stroke="#1A1A1A" stroke-width="5"/>
    <ellipse cx="36" cy="30" rx="10" ry="5" fill="#fff" opacity=".45" transform="rotate(-25 36 30)"/>`;
  const svg = inner => `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${inner}</svg>`;
  const ART = {
    // כפתור כחול עם פרצוף מתנשא
    blue: svg(`${body('#3B82F6', '#1E3A8A')}${eyes()}
      <path d="M26 32 l18 5 M74 30 l-18 7" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/>
      <path d="M40 70 q12 6 22 -4" fill="none" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/>`),
    gold: svg(`${body('#FFD93D', '#B8860B')}${eyes()}
      <path d="M30 22 l6 -16 l9 10 l5 -14 l5 14 l9 -10 l6 16 z" fill="#FFB020" stroke="#1A1A1A" stroke-width="3" stroke-linejoin="round"/>
      <path d="M38 68 q12 10 24 0" fill="none" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/>`),
    // פיצי, מבוהל
    pitzi: svg(`${body('#FF3B3B', '#8A1D1D')}${eyes(-3)}
      <ellipse cx="50" cy="72" rx="7" ry="8" fill="#1A1A1A"/>
      <path d="M84 30 q6 8 0 12 q-6 -4 0 -12z" fill="#2EC4B6" stroke="#1A1A1A" stroke-width="2"/>`),
    cookie: svg(`<circle cx="50" cy="54" r="38" fill="#D9A15B" stroke="#1A1A1A" stroke-width="5"/>
      <g fill="#4A2C17"><ellipse cx="36" cy="40" rx="6" ry="5"/><ellipse cx="62" cy="36" rx="5" ry="4"/><ellipse cx="68" cy="62" rx="6" ry="5"/>
      <ellipse cx="44" cy="68" rx="5" ry="4"/><ellipse cx="52" cy="52" rx="4" ry="4"/></g>`)
  };
  const LABEL = { blue: 'כפתור כחול! ללחוץ', gold: 'כפתור זהב! ללחוץ', pitzi: 'פיצי. לא ללחוץ!', cookie: 'עוגייה: עוד זמן' };

  let holes = [], board, talk, scoreEl, timeEl, timeBar, comboEl, startBtn, bestEl, liveEl;
  let running = false, timer = 0, clock = 0, timeLeft = 0, score = 0, combo = 0, bestCombo = 0, pitziHits = 0;
  let nextSpawn = 0, best = 0, saidHalf = false, saidLow = false;

  function say(text) {
    talk.textContent = text;
    talk.classList.remove('bump'); void talk.offsetWidth; talk.classList.add('bump');
  }
  const maybe = (p, list) => { if (Math.random() < p) say(P.rand(list)); };

  function hud() {
    scoreEl.textContent = score;
    timeEl.textContent = Math.max(0, timeLeft / 1000).toFixed(1);
    timeBar.style.width = Math.max(0, Math.min(100, timeLeft / ROUND_MS * 100)) + '%';
    timeBar.parentElement.classList.toggle('low', timeLeft <= 5000);
    comboEl.textContent = combo >= 3 ? `קומבו ×${combo}` : '';
  }

  function popText(h, text, cls) {
    const t = P.el('span', 'whack-pop ' + (cls || ''), text);
    t.setAttribute('aria-hidden', 'true');
    t.addEventListener('animationend', () => t.remove());
    h.el.appendChild(t);
  }

  function setHole(h, kind) {
    h.kind = kind;
    h.el.dataset.kind = kind || '';
    h.el.setAttribute('aria-label', `חור ${h.i + 1}: ${kind ? LABEL[kind] : 'ריק'}`);
  }

  function spawn(progress) {
    const free = holes.filter(h => !h.kind && clock >= h.freeAt);
    if (!free.length) return;
    const h = P.rand(free);
    const r = Math.random();
    const kind = r < 0.18 ? 'pitzi' : r < 0.25 ? 'gold' : r < 0.31 && timeLeft < ROUND_MS - 4000 ? 'cookie' : 'blue';
    const dur = { blue: lerp(SPEED.blueStay, progress), gold: SPEED.goldStay, pitzi: SPEED.pitziStay, cookie: SPEED.cookieStay }[kind];
    h.until = clock + dur;
    h.mole.innerHTML = ART[kind];
    setHole(h, kind);
    h.el.classList.remove('bonk');
    h.el.classList.add('up');
  }

  function retract(h, bonk) {
    setHole(h, null);
    h.freeAt = clock + 350;
    h.el.classList.remove('up');
    if (bonk) {
      h.el.classList.add('bonk');
      setTimeout(() => h.el.classList.remove('bonk'), 300);
    }
  }

  function paused() {
    return document.hidden || P.boss || !!document.querySelector('.modal-wrap, .sleep, .loader');
  }

  function tick() {
    if (!running || paused()) return;
    clock += TICK;
    timeLeft -= TICK;
    const progress = Math.min(1, clock / ROUND_MS);

    holes.forEach(h => {
      if (!h.kind || clock < h.until) return;
      if (h.kind === 'blue' || h.kind === 'gold') { combo = 0; maybe(0.3, ESCAPE); }
      retract(h, false);
    });

    nextSpawn -= TICK;
    const maxUp = Math.round(lerp(SPEED.maxUp, progress));
    if (nextSpawn <= 0 && holes.filter(h => h.kind).length < maxUp) {
      spawn(progress);
      nextSpawn = lerp(SPEED.spawnGap, progress) * (0.7 + Math.random() * 0.6);
    }
    if (!saidHalf && progress >= 0.5) { saidHalf = true; say(SPEEDUP); }
    if (!saidLow && timeLeft <= 5000) { saidLow = true; say(P.rand(TIME_LOW)); P.sound('beep'); }
    hud();
    if (timeLeft <= 0) end();
  }

  function hit(i) {
    const h = holes[i];
    if (!running || !h) return;
    if (!h.kind) { combo = 0; maybe(0.35, EMPTY); hud(); return; }
    const kind = h.kind;
    if (kind === 'blue') {
      score += 1; combo++;
      P.sound('pop');
      popText(h, '+1');
      if (!COMBO[combo]) maybe(0.3, HIT_BLUE);
    } else if (kind === 'gold') {
      score += 5; combo++;
      P.sound('tweet');
      popText(h, '+5', 'gold');
      P.burstFrom(h.el, { particleCount: 40, spread: 50 });
      say(P.rand(HIT_GOLD));
    } else if (kind === 'pitzi') {
      score -= 3; combo = 0;
      P.sound('boing');
      popText(h, '−3', 'bad');
      say(HIT_PITZI[Math.min(pitziHits, HIT_PITZI.length - 1)]);
      pitziHits++;
      board.classList.remove('ouch'); void board.offsetWidth; board.classList.add('ouch');
    } else if (kind === 'cookie') {
      timeLeft += 3000;
      P.sound('pop');
      popText(h, '+3 שנ\'', 'time');
      say(P.rand(COOKIE));
    }
    if (COMBO[combo]) say(COMBO[combo]);
    bestCombo = Math.max(bestCombo, combo);
    retract(h, true);
    hud();
  }

  function start() {
    // השעון מתאפס, אז גם "החור פנוי מ..." חייב להתאפס. אחרת החורים נשארים תפוסים מהסיבוב הקודם
    holes.forEach(h => { retract(h, false); h.freeAt = 0; });
    running = true;
    clock = 0; timeLeft = ROUND_MS; score = 0; combo = 0; bestCombo = 0; pitziHits = 0;
    nextSpawn = 650; saidHalf = false; saidLow = false;
    board.classList.add('playing');
    startBtn.disabled = true;
    startBtn.textContent = 'משחקים... 🔵';
    say(P.rand(START));
    liveEl.textContent = 'המשחק התחיל. מקשים 1 עד 9 לוחצים על החורים.';
    hud();
    clearInterval(timer);
    timer = setInterval(tick, TICK);
  }

  function end() {
    running = false;
    clearInterval(timer);
    holes.forEach(h => retract(h, false));
    board.classList.remove('playing');
    const rank = RANKS.filter(([min]) => score >= min).pop();
    const isRecord = score > best && score > 0;
    if (isRecord) { best = score; P.store.set('whackBest', best); }
    bestEl.textContent = `השיא שלך: ${best}`;
    say(`⏰ נגמר! ${score} נקודות. דרגה: ${rank[1]}.`);
    liveEl.textContent = `נגמר הזמן. ניקוד: ${score}. דרגה: ${rank[1]}.${isRecord ? ' שיא חדש!' : ''}`;
    startBtn.disabled = false;
    startBtn.textContent = 'עוד סיבוב! 🔁';
    P.sound('beep');
    if (score >= EGG_SCORE) P.egg('whack');
    setTimeout(() => {
      if (isRecord && score >= 10) { P.say(P.rand(RECORD)); P.burst({ particleCount: 120, spread: 100 }); }
      else if (pitziHits >= 3) P.say(`לחצת עליי ${pitziHits} פעמים. ספרתי. אני תמיד סופר.`);
      else P.say(rank[2]);
    }, 700);
  }

  P.register('whack', {
    pages: ['whack'],
    init() {
      board = document.getElementById('whackBoard');
      if (!board) return;
      talk = document.getElementById('whackTalk');
      scoreEl = document.getElementById('whackScore');
      timeEl = document.getElementById('whackTime');
      timeBar = document.getElementById('whackBar');
      comboEl = document.getElementById('whackCombo');
      startBtn = document.getElementById('whackStart');
      bestEl = document.getElementById('whackBest');
      liveEl = document.getElementById('whackLive');
      best = P.store.get('whackBest', 0);
      bestEl.textContent = best ? `השיא שלך: ${best}` : 'עוד אין שיא. הכפתורים נושמים לרווחה.';

      for (let i = 0; i < 9; i++) {
        const el = P.el('button', 'hole', `<span class="hole-key" aria-hidden="true">${i + 1}</span><span class="pit"><span class="mole"></span></span>`);
        el.type = 'button';
        el.dataset.quiet = '';
        const h = { el, i, kind: null, until: 0, freeAt: 0, mole: el.querySelector('.mole') };
        setHole(h, null);
        // pointerdown מגיב מהר יותר מ-click; click עם detail=0 הוא מקלדת
        el.addEventListener('pointerdown', e => { e.preventDefault(); hit(i); });
        el.addEventListener('click', e => { if (e.detail === 0) hit(i); });
        board.appendChild(el);
        holes.push(h);
      }
      addEventListener('keydown', e => {
        if (!running || (e.target.closest && e.target.closest('input, textarea'))) return;
        const n = Number(e.key);
        if (n >= 1 && n <= 9) { e.preventDefault(); hit(n - 1); }
      });
      startBtn.addEventListener('click', start);
      hud();
      say('כחול = ללחוץ. אדום = אני = לא ללחוץ! לחץ "התחל" כשאתה מוכן.');
    }
  });
})();
