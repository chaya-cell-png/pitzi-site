/* משחק הריצה של פיצי – בסגנון הדינוזאור של גוגל, רק עגול, אדום ודברן.
   בעברית רצים שמאלה: העולם מחושב רגיל ומצויר במראה. */
(function () {
  const P = window.Pitzi;
  const W = 600, H = 220, GROUND = 192;
  const PITZI_X = 60, PITZI_SIZE = 40, DUCK_H = 24;
  const GRAVITY = 0.55, JUMP_V = -10.5;

  /* ---------- משפטים ---------- */
  const START = [
    'יאללה! בעברית רצים שמאלה. אל תתבלבל.',
    'רץ! רץ! ...למה אני רץ, בעצם?',
    'הרופא אמר לי לעשות ספורט. לא לזה הוא התכוון.',
    'אני הדינוזאור של גוגל, רק עגול ואדום יותר.',
    'מרתון! טוב, ספרינט. טוב, ריצה קלה. נראה.',
    'כפתורים לא אמורים לרוץ. גם לא לדבר. והנה אנחנו.',
    'מצאתי את סוף האינטרנט. עכשיו אני מחפש את ההתחלה.'
  ];
  const MILESTONES = {
    100: 'מאה! קיבלתי שריר ברגל. אין לי רגליים.',
    200: 'מאתיים! אני מרגיש שאני יכול לרוץ לנצח. או עוד דקה.',
    300: 'שלוש מאות! זהירות: מעכשיו יש גם יונים.',
    400: 'ארבע מאות. מישהו ראה את בקבוק המים שלי?',
    500: 'חמש מאות! אם הייתה פה מדליה, הייתי לוקח אותה. ואז נופל איתה.',
    600: 'שש מאות. הדינוזאור של גוגל כבר שולח לי הודעות קנאה.',
    700: 'שבע מאות! מתחיל להחשיך. מישהו כיבה את השמש?',
    800: 'שמונה מאות. לילה טוב לכולם, חוץ ממני. אני רץ.',
    900: 'תשע מאות! הרגליים שלי... רגע, אין לי. הכל בסדר.',
    1000: 'אלף!!! אני רשמית הכפתור הכי מהיר בעולם. אין הרבה תחרות.'
  };
  const MORE_MILESTONES = [
    n => `${n}! אני לא עוצר. אני לא יודע איך עוצרים.`,
    n => `${n}. מישהו מצלם את זה?`,
    n => `${n}! למסך הזה אין סוף. אוי.`,
    n => `${n}. אני שומע מוזיקת ניצחון. או שזה הלב שלי.`,
    n => `${n}! אני כבר לא כפתור. אני אגדה.`
  ];
  const INTRO = {
    blue: 'כפתור כחול! האויב המושבע שלי. אל תיגע בו!',
    sock: 'גרב בודדת באמצע הדרך. איפה השנייה? תמיד אותה שאלה.',
    cookie: 'עוגייה מתגלגלת! אסור לאכול תוך כדי ריצה.',
    pan: 'מחבת על הרצפה? מי מבשל פה?',
    cat: 'חתול! הוא לא זז. חתולים אף פעם לא זזים כשצריך.',
    terms: 'ערימת תנאי שימוש. אף אחד לא קורא אותם, אבל אפשר למעוד עליהם.',
    pigeon: 'יונה עם ביטחון עצמי! היא בטוחה שהשמיים שלה.',
    loading: 'פס טעינה מעופף! תקוע על 99% גם באוויר.'
  };
  const DEATH = {
    blue: ['נגעתי בכפתור כחול. אני צריך מקלחת.', 'הכפתור הכחול ניצח. עכשיו הוא לא יפסיק לדבר על זה.'],
    sock: ['מעדתי על גרב. הקלאסיקה של כל בית.', 'הגרב ניצחה. הגרב השנייה תשמח לשמוע.'],
    cookie: ['נתקלתי בעוגייה. לפחות זה היה טעים.', 'פירורים בכל מקום. היה שווה.'],
    pan: ['נחבטתי במחבת. עכשיו אני ביצת עין.', 'בוינג! המחבת הזאת חזקה ממני.'],
    cat: ['החתול לא זז. ברור שהחתול לא זז.', 'נתקעתי בחתול. הוא אפילו לא התעורר.'],
    terms: ['נקברתי בתנאי שימוש. לפי סעיף 7.3, זה לא באחריות האתר.', 'מעדתי על סעיף 4.2. ידעתי שהיה צריך לקרוא.'],
    pigeon: ['היונה ניצחה. היא תספר על זה לכל הכיכר.', 'נתקלתי ביונה. היא אפילו לא אמרה סליחה.'],
    loading: ['נתקעתי בפס הטעינה. 99%... 99%... 99%...', 'הפס הגיע ל-100% בדיוק עליי.']
  };
  const ANY_DEATH = ['זה לא נחשב, לא הייתי מוכן!', 'מישהו הזיז את המכשול. אני בטוח.', 'נפלתי? לא. עשיתי מנוחה אסטרטגית.', 'אאוץ\'. בפעם הבאה אני שוכר נהג.'];
  const NEAR = ['פיו! זה היה קרוב!', 'ראיתי את כל החיים שלי עוברים. היו בהם המון לחיצות.', 'וואו! עוד מילימטר!', 'כמעט! הלב שלי, אם היה לי, היה דופק.', 'קפיצה של אלופים!'];
  const JUMPS = ['הופ!', 'וויי!', 'אני עף! טוב, קופץ.', 'בוינג!', 'תראו אותי באוויר!', 'כוח המשיכה, תירגע.'];
  const DUCKS = ['מתכופף!', 'אני שטוח כמו פנקייק.', 'לא מסתכל למעלה. לא מסתכל למעלה.'];
  const RECORD = ['שיא חדש!!! אני מתקשר לספר השיאים. אין קליטה.', 'שיא! מגיעה לך כפית זהב. אין לנו. יש עוגייה.', 'שברת את השיא! אני תולה את זה על המקרר.'];
  const SHORT_RUN = ['זה היה... קצר. אבל מתוק.', 'אפילו לא התחממתי.', 'שנייה, עוד לא קשרתי שרוכים. אין לי שרוכים.'];
  const AFTER = ['עוד סיבוב? אני מוכן. הרגליים שלי לא, אבל אני כן.', 'אל תתייאש. גם הדינוזאור של גוגל התחיל ככה.', 'כל נפילה היא שיעור. השיעור הפעם: לקפוץ.'];

  /* ---------- צבעים (יום ולילה) ---------- */
  const DAY = { bg: [255, 248, 231], ink: [26, 26, 26], cloud: [255, 255, 255] };
  const NIGHT = { bg: [29, 33, 64], ink: [243, 240, 230], cloud: [70, 76, 120] };
  const mix = (k, t) => `rgb(${DAY[k].map((v, i) => Math.round(v + (NIGHT[k][i] - v) * t)).join(',')})`;

  /* ---------- מכשולים ---------- */
  const TYPES = {
    blue: { w: 30, h: 30 },
    sock: { w: 26, h: 36 },
    cookie: { w: 30, h: 30, extra: 1.5 },
    pan: { w: 48, h: 22 },
    cat: { w: 42, h: 34 },
    terms: { w: 28, h: 52 },
    pigeon: { w: 38, h: 24, flying: true },
    loading: { w: 64, h: 18, flying: true }
  };
  const GROUND_TYPES = ['blue', 'sock', 'cookie', 'pan', 'cat', 'terms'];

  let canvas, ctx, liveOut, bestOut, scale = 1;
  let state = 'ready', last = 0, frame = 0, deadAt = 0, deaths = 0;
  let pz, obstacles, clouds, dashes, speed, dist, score, best, nextGap, night, nightTarget, seen, bubble, nearCooldown, lastMilestone, recordSaid;

  function reset() {
    pz = { y: GROUND - PITZI_SIZE, vy: 0, duck: false, wantDuck: false, dead: false };
    obstacles = [];
    clouds = [0, 1, 2].map(i => ({ x: 120 + i * 220, y: 30 + Math.random() * 50 }));
    dashes = Array.from({ length: 14 }, () => ({ x: Math.random() * W, y: GROUND + 6 + Math.random() * 18, w: 4 + Math.random() * 10 }));
    speed = 6; dist = 0; score = 0; nextGap = 300; night = 0; nightTarget = 0;
    seen = {}; bubble = null; nearCooldown = 0; lastMilestone = 0; recordSaid = false;
  }

  const say = (text, ms = 2600) => { bubble = { text, until: performance.now() + ms }; };

  /* ---------- לוגיקה ---------- */
  function jump() {
    if (state === 'ready') return start();
    if (state === 'over') { if (performance.now() - deadAt > 450) start(); return; }
    if (pz.y < GROUND - PITZI_SIZE - 0.5) return; // כבר באוויר
    pz.vy = JUMP_V;
    P.sound('pop');
    if (Math.random() < 0.08 && !bubble) say(P.rand(JUMPS), 1200);
  }
  function setDuck(v) {
    pz.wantDuck = v;
    if (v && state === 'running' && Math.random() < 0.12 && !bubble) say(P.rand(DUCKS), 1300);
  }

  function start() {
    reset();
    state = 'running';
    say(P.rand(START), 3000);
    liveOut.textContent = 'המשחק התחיל.';
  }

  function spawn() {
    const flyingOk = score > 300 && Math.random() < 0.28;
    const type = flyingOk ? (Math.random() < 0.65 ? 'pigeon' : 'loading') : P.rand(GROUND_TYPES);
    const t = TYPES[type];
    let bottom = GROUND;
    if (t.flying) bottom = type === 'loading' ? GROUND - 30 : P.rand([GROUND - 4, GROUND - 32, GROUND - 32, GROUND - 70]);
    const o = { type, x: W + 20, w: t.w, h: t.h, y: bottom - t.h, extra: t.extra || 0, passed: false, minGap: Infinity };
    obstacles.push(o);
    // לפעמים שני כפתורים כחולים צמודים
    if (type === 'blue' && score > 150 && Math.random() < 0.3) obstacles.push(Object.assign({}, o, { x: o.x + 32 }));
    if (!seen[type]) {
      seen[type] = true;
      if (!bubble || Math.random() < 0.5) say(INTRO[type], 2600);
    }
    nextGap = 230 + speed * 14 + Math.random() * 260;
  }

  function hit(o, box) {
    const m = 5;
    return box.x + m < o.x + o.w - m && box.x + box.w - m > o.x + m && box.y + m < o.y + o.h - m && box.y + box.h - m > o.y + m;
  }

  function pitziBox() {
    const h = pz.duck ? DUCK_H : PITZI_SIZE;
    return { x: PITZI_X, y: pz.duck ? GROUND - DUCK_H : pz.y, w: PITZI_SIZE + (pz.duck ? 8 : 0), h };
  }

  function die(o) {
    state = 'over';
    pz.dead = true;
    deadAt = performance.now();
    deaths++;
    P.sound('boing');
    const line = Math.random() < 0.75 ? P.rand(DEATH[o.type]) : P.rand(ANY_DEATH);
    say(line, 60000);
    const final = Math.floor(score);
    const isRecord = final > best;
    if (isRecord) { best = final; P.store.set('runnerBest', best); }
    bestOut.textContent = `השיא שלך: ${best}`;
    liveOut.textContent = `נפלת! ${line} ניקוד: ${final}.${isRecord ? ' שיא חדש!' : ''}`;
    setTimeout(() => {
      if (deaths === 5) P.say('חמש נפילות. רוצה לעבור לחזאי מזג הרוח? הוא פחות מסוכן.');
      else if (isRecord && final > 50) { P.say(P.rand(RECORD)); P.burst({ particleCount: 100, spread: 90 }); }
      else P.say(P.rand(final < 50 ? SHORT_RUN : AFTER));
    }, 700);
  }

  function update(dt) {
    frame += dt;
    if (state !== 'running') return;
    speed = Math.min(13, 6 + score * 0.008);
    const move = speed * dt;
    dist += move;
    score = dist / 40;

    // פיצי
    pz.duck = pz.wantDuck && pz.y >= GROUND - PITZI_SIZE - 0.5;
    pz.vy += (GRAVITY + (pz.wantDuck && pz.y < GROUND - PITZI_SIZE ? 1.1 : 0)) * dt;
    pz.y = Math.min(GROUND - PITZI_SIZE, pz.y + pz.vy * dt);
    if (pz.y >= GROUND - PITZI_SIZE) pz.vy = 0;

    // מכשולים
    nextGap -= move;
    if (nextGap <= 0) spawn();
    const box = pitziBox();
    for (const o of obstacles) {
      o.x -= move + o.extra * dt;
      if (hit(o, box)) return die(o);
      const overlapX = box.x < o.x + o.w && box.x + box.w > o.x;
      // המרווח האנכי בין פיצי למכשול (מעליו בקפיצה, או מתחתיו בהתכופפות)
      if (overlapX) o.minGap = Math.min(o.minGap, Math.max(o.y - (box.y + box.h), box.y - (o.y + o.h)));
      if (!o.passed && o.x + o.w < box.x) {
        o.passed = true;
        if (o.minGap < 9 && frame > nearCooldown) { nearCooldown = frame + 240; say(P.rand(NEAR), 1500); }
      }
    }
    obstacles = obstacles.filter(o => o.x + o.w > -40);

    // רקע
    clouds.forEach(c => { c.x -= move * 0.2; if (c.x < -80) { c.x = W + 40 + Math.random() * 100; c.y = 25 + Math.random() * 55; } });
    dashes.forEach(d => { d.x -= move; if (d.x < -12) d.x = W + Math.random() * 40; });

    // אבני דרך, לילה וביצה
    const m = Math.floor(score / 100) * 100;
    if (m > lastMilestone) {
      lastMilestone = m;
      P.sound('beep');
      say(MILESTONES[m] || P.rand(MORE_MILESTONES)(m), 2800);
      if (m === 500) P.egg('runner');
    }
    if (!recordSaid && best > 50 && score > best) { recordSaid = true; say('עקפת את השיא! תמשיך, תמשיך!', 2200); }
    nightTarget = Math.floor(score / 700) % 2;
    night += Math.sign(nightTarget - night) * Math.min(Math.abs(nightTarget - night), 0.008 * dt);
  }

  /* ---------- ציור ---------- */
  function line(c, w) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; }

  function drawPitzi(ink) {
    const b = pitziBox(), cx = b.x + b.w / 2;
    const legPhase = state === 'running' && pz.y >= GROUND - PITZI_SIZE - 0.5 ? Math.floor(frame / 5) % 2 : 0;
    line(ink, 3);
    if (!pz.duck) { // רגליים קטנות
      ctx.beginPath();
      ctx.moveTo(cx - 7, b.y + b.h - 4); ctx.lineTo(cx - 9 + legPhase * 4, b.y + b.h + 2);
      ctx.moveTo(cx + 7, b.y + b.h - 4); ctx.lineTo(cx + 9 - legPhase * 4, b.y + b.h + 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#8a1d1d';
    ctx.beginPath(); ctx.ellipse(cx, b.y + b.h - 4, b.w / 2, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#FF3B3B';
    ctx.beginPath(); ctx.ellipse(cx, b.y + b.h / 2 - 2, b.w / 2, b.h / 2 - 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // עיניים מסתכלות קדימה
    const ey = b.y + b.h * 0.4, er = pz.duck ? 4 : 6;
    [cx - 1, cx + 11].forEach(ex => {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill(); line('#1A1A1A', 2); ctx.stroke();
      if (pz.dead) {
        ctx.beginPath(); ctx.moveTo(ex - 3, ey - 3); ctx.lineTo(ex + 3, ey + 3); ctx.moveTo(ex + 3, ey - 3); ctx.lineTo(ex - 3, ey + 3); ctx.stroke();
      } else {
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath(); ctx.arc(ex + 2, ey + 1, er / 2, 0, Math.PI * 2); ctx.fill();
      }
    });
  }

  function drawObstacle(o, ink) {
    const { x, y, w, h } = o;
    line(ink, 2.5);
    switch (o.type) {
      case 'blue':
        ctx.fillStyle = '#1e3a8a'; ctx.beginPath(); ctx.ellipse(x + w / 2, y + h - 4, w / 2, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2 - 2, w / 2 - 1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.ellipse(x + w / 2 - 5, y + 7, 5, 3, -0.5, 0, Math.PI * 2); ctx.fill();
        break;
      case 'sock':
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.moveTo(x + 8, y); ctx.lineTo(x + 20, y); ctx.lineTo(x + 20, y + 24);
        ctx.quadraticCurveTo(x + 28, y + 26, x + 26, y + h); ctx.lineTo(x + 2, y + h); ctx.quadraticCurveTo(x - 1, y + 26, x + 8, y + 24); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#FF3B3B'; ctx.fillRect(x + 9, y + 5, 10, 4); ctx.fillRect(x + 9, y + 13, 10, 4);
        break;
      case 'cookie': {
        const cx = x + w / 2, cy = y + h / 2, a = -dist / 12;
        ctx.fillStyle = '#D9A15B'; ctx.beginPath(); ctx.arc(cx, cy, w / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#4A2C17';
        [[0.5, 6], [2.4, 7], [4.2, 5], [0, 0]].forEach(([ang, r]) => { ctx.beginPath(); ctx.arc(cx + Math.cos(ang + a) * r, cy + Math.sin(ang + a) * r, 2.6, 0, Math.PI * 2); ctx.fill(); });
        break;
      }
      case 'pan':
        ctx.fillStyle = '#5B3A29'; ctx.fillRect(x + w - 6, y + 9, 22, 6); ctx.strokeRect(x + w - 6, y + 9, 22, 6);
        ctx.fillStyle = '#3A3A3A'; ctx.beginPath(); ctx.ellipse(x + w / 2 - 4, y + h / 2 + 2, w / 2 - 2, h / 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(x + w / 2 - 6, y + h / 2 + 1, 9, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFD93D'; ctx.beginPath(); ctx.arc(x + w / 2 - 6, y + h / 2 + 1, 3, 0, Math.PI * 2); ctx.fill();
        break;
      case 'cat':
        ctx.fillStyle = '#F2A65A';
        ctx.beginPath(); ctx.moveTo(x + w - 4, y + 22); ctx.quadraticCurveTo(x + w + 8, y + 10, x + w + 2, y + 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(x + w / 2 + 4, y + h - 9, 16, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 2, y + 8); ctx.lineTo(x + 5, y - 2); ctx.lineTo(x + 10, y + 5); ctx.moveTo(x + 14, y + 5); ctx.lineTo(x + 19, y - 2); ctx.lineTo(x + 21, y + 8); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(x + 12, y + 13, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1A1A1A'; ctx.beginPath(); ctx.arc(x + 8, y + 12, 1.6, 0, Math.PI * 2); ctx.arc(x + 15, y + 12, 1.6, 0, Math.PI * 2); ctx.fill();
        break;
      case 'terms':
        for (let i = 0; i < 5; i++) {
          const py = y + h - (i + 1) * 10.4, off = (i % 2 ? 2 : -1);
          ctx.fillStyle = '#fff'; ctx.fillRect(x + off, py, w, 10); ctx.strokeRect(x + off, py, w, 10);
          ctx.beginPath(); ctx.moveTo(x + off + 5, py + 5); ctx.lineTo(x + off + w - 5, py + 5); line('#999', 1.5); ctx.stroke(); line(ink, 2.5);
        }
        break;
      case 'pigeon': {
        const flap = Math.floor(frame / 9) % 2;
        ctx.fillStyle = '#9aa3ad';
        ctx.beginPath(); ctx.ellipse(x + w / 2 + 3, y + h / 2 + 3, 15, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(x + 8, y + 7, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#FFB020'; ctx.beginPath(); ctx.moveTo(x + 1, y + 6); ctx.lineTo(x - 6, y + 8); ctx.lineTo(x + 1, y + 10); ctx.fill();
        ctx.fillStyle = '#1A1A1A'; ctx.beginPath(); ctx.arc(x + 6, y + 5, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#7d8691';
        ctx.beginPath(); ctx.moveTo(x + 14, y + 9); ctx.lineTo(x + 24, flap ? y - 8 : y + 22); ctx.lineTo(x + 32, y + 9); ctx.fill(); ctx.stroke();
        break;
      }
      case 'loading':
        ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = '#2EC4B6'; ctx.fillRect(x + 2, y + 2, (w - 4) * 0.99, h - 4);
        break;
    }
  }

  function wrap(text, maxW) {
    const words = text.split(' '), lines = [];
    let cur = '';
    words.forEach(wd => {
      const test = cur ? cur + ' ' + wd : wd;
      if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = wd; } else cur = test;
    });
    if (cur) lines.push(cur);
    return lines;
  }

  function drawBubble(text) {
    ctx.font = '600 14px Rubik, sans-serif';
    const lines = wrap(text, 250);
    const bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 22, bh = lines.length * 18 + 12;
    const b = pitziBox();
    const tipX = W - (b.x + b.w / 2); // מיקום פיצי על המסך (במראה)
    const right = Math.min(W - 6, tipX + 40), left = right - bw;
    const top = Math.max(6, b.y - bh - 16);
    ctx.fillStyle = '#fff';
    line('#1A1A1A', 2.5);
    ctx.beginPath(); ctx.roundRect(left, top, bw, bh, 10); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tipX - 6, top + bh); ctx.lineTo(tipX, top + bh + 9); ctx.lineTo(tipX + 6, top + bh); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1A1A1A';
    ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.textBaseline = 'top';
    lines.forEach((l, i) => ctx.fillText(l, right - 11, top + 7 + i * 18));
  }

  function centerText(lines, ink) {
    ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = ink;
    lines.forEach(([text, font, y]) => { ctx.font = font; ctx.fillText(text, W / 2, y); });
  }

  function draw() {
    const ink = mix('ink', night);
    ctx.fillStyle = mix('bg', night);
    ctx.fillRect(0, 0, W, H);

    // העולם, במראה
    ctx.save();
    ctx.translate(W, 0); ctx.scale(-1, 1);
    ctx.fillStyle = mix('cloud', night); line(ink, 2);
    clouds.forEach(c => { ctx.beginPath(); ctx.ellipse(c.x, c.y, 26, 10, 0, 0, Math.PI * 2); ctx.ellipse(c.x + 16, c.y - 6, 14, 9, 0, 0, Math.PI * 2); ctx.fill(); });
    line(ink, 2.5);
    ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke();
    ctx.fillStyle = ink;
    dashes.forEach(d => ctx.fillRect(d.x, d.y, d.w, 2));
    obstacles.forEach(o => drawObstacle(o, ink));
    drawPitzi(ink);
    ctx.restore();

    // ניקוד
    ctx.font = '400 16px "Secular One", sans-serif';
    ctx.direction = 'ltr'; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillStyle = ink;
    const pad = n => String(Math.floor(n)).padStart(5, '0');
    ctx.fillText(`${best ? 'שיא ' + pad(best) + '   ' : ''}${pad(score)}`, 12, 10);

    if (state === 'ready') {
      centerText([['פיצי רץ!', '400 34px "Secular One", sans-serif', 70], ['רווח / חץ למעלה / נגיעה = קפיצה · חץ למטה = התכופפות', '600 14px Rubik, sans-serif', 108]], ink);
    } else if (state === 'over') {
      centerText([['נפלת!', '400 34px "Secular One", sans-serif', 58], ['רווח או נגיעה כדי לשחק שוב', '600 14px Rubik, sans-serif', 88]], ink);
    }
    if (bubble && performance.now() < bubble.until) drawBubble(bubble.text);
    else bubble = null;
  }

  function loop(t) {
    const paused = document.hidden || P.boss || !!document.querySelector('.modal-wrap, .sleep');
    const dt = paused ? 0 : Math.min(2.5, (t - last) / (1000 / 60));
    last = t;
    if (dt) update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function resize() {
    const cssW = canvas.clientWidth, dpr = window.devicePixelRatio || 1;
    scale = cssW / W;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssW * H / W * dpr);
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
  }

  P.register('runner', {
    pages: ['game'],
    init() {
      canvas = document.getElementById('runner');
      if (!canvas || !canvas.getContext) return;
      ctx = canvas.getContext('2d');
      liveOut = document.getElementById('runnerLive');
      bestOut = document.getElementById('runnerBest');
      best = P.store.get('runnerBest', 0);
      bestOut.textContent = best ? `השיא שלך: ${best}` : 'עוד אין שיא. זה הזמן.';
      reset();
      resize();
      addEventListener('resize', resize);

      const gameKeyTarget = el => !el || el === document.body || el === canvas || el.closest('.runner-controls');
      addEventListener('keydown', e => {
        if (e.target.closest && e.target.closest('input, textarea')) return;
        if ((e.key === ' ' && gameKeyTarget(document.activeElement)) || e.key === 'ArrowUp') { e.preventDefault(); if (!e.repeat) jump(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); setDuck(true); }
      });
      addEventListener('keyup', e => { if (e.key === 'ArrowDown') setDuck(false); });
      canvas.addEventListener('pointerdown', e => { e.preventDefault(); jump(); });

      const jumpBtn = document.getElementById('runnerJump'), duckBtn = document.getElementById('runnerDuck');
      jumpBtn.addEventListener('pointerdown', e => { e.preventDefault(); jump(); });
      jumpBtn.addEventListener('click', e => { if (e.detail === 0) jump(); }); // מקלדת
      duckBtn.addEventListener('pointerdown', e => { e.preventDefault(); setDuck(true); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => duckBtn.addEventListener(ev, () => setDuck(false)));

      canvas.focus({ preventScroll: true });
      requestAnimationFrame(t => { last = t; loop(t); });
      setTimeout(() => P.sayWhenFree('זה המשחק שלי! אני רץ, אתה קופץ. סגרנו? 🏃'), 900);
    }
  });
})();
