/* משחק "תפוס את העוגיות" – בסגנון Catch the Ball. פיצי עם סל זז ימינה ושמאלה ותופס מה שנופל.
   עוגייה שנופלת לרצפה = פחות חיים. כפתור כחול בסל = פחות חיים.
   כל 25 נקודות מגיע "גשם עוגיות", ופעם בסיבוב נופלת "הביצה המרקדת" (ביצת הפתעה). */
(function () {
  const P = window.Pitzi;
  const BODY_R = 26, BASKET_W = 90, BASKET_H = 22, MAX_LIVES = 3;
  const EGG_FROM = 8, EGG_SPREAD = 7; // הביצה המרקדת מופיעה בוודאות פעם בסיבוב, בין 8 ל-14 (לפני גשם העוגיות הראשון)
  const SHOWER_EVERY = 17, SHOWER_FRAMES = 240; // גשם קצר (4 שניות) כל 17 נקודות. בזמן הגשם אי אפשר לאבד לבבות
  const DROPS_PER_HEART = 2; // כמה עוגיות צריכות ליפול לרצפה כדי שיירד לב
  const SCORE_EGG = 50;      // ביצת הפתעה נסתרת למי שמגיע לניקוד הזה בסיבוב אחד

  /* ---------- משפטים ---------- */
  const START = [
    'עוגיות נופלות מהשמיים! תפוס כמה שיותר. ואל תפיל אף אחת!',
    'מישהו הפך את צנצנת העוגיות בשמיים. תעזור לי!',
    'סל ביד, פה פתוח. בוא נתפוס עוגיות!',
    'גשם של עוגיות! סוף סוף תחזית שאני אוהב.'
  ];
  const CATCH = ['יאמי!', 'לסל!', 'עוד אחת!', 'תפיסה של מקצוענים!', 'הסל מתמלא, הלב מתמלא.', 'פירורים זה סימן לאיכות.', 'נחיתה רכה!'];
  const GOLD = ['עוגיית זהב! חמש נקודות ושן זהב.', 'זהב! אני אשים אותה במסגרת. סתם, אני אוכל אותה.', 'עוגיית זהב! היא עולה יותר מהסל.'];
  const HEART = ['לב! חיים נוספים. ואהבה. בעיקר חיים.', 'תפסת לב! מעכשיו אני קצת יותר אמיץ.'];
  const BLUE = ['אוי! תפסתי כפתור כחול! איכס, איכס, איכס!', 'כפתור כחול בסל?! מי הכניס אותו לשמיים?', 'הכפתור הכחול נחת לי בסל. אני צריך סל חדש.'];
  const MISS = ['הרצפה אכלה עוגייה. הרצפה שמחה. אני לא.', 'פספוס! העוגייה הזאת תחסר לי.', 'חוק חמש השניות? לא חל על עוגיות של פיצי.'];
  const LAST_LIFE = 'נשאר לנו לב אחד! בלי לחץ. טוב, עם קצת לחץ.';
  const FIRST_DROP = ['עוגייה אחת נפלה. עוד אחת, ויורד לב!', 'אופס, עוגייה על הרצפה. זה עדיין בסדר... פעם אחת.', 'נפלה אחת! הלב מחזיק מעמד, אבל הוא מתחיל להזיע.'];  const MILESTONES = {
    10: 'עשר עוגיות! הסל מתחיל להיות כבד.',
    20: 'עשרים! אני מרגיש כמו מאפייה מהלכת.',
    30: 'שלושים! מעכשיו קוראים לי "פיצי השף".',
    40: 'ארבעים! זה כבר לא סל, זה מחסן.',
    50: 'חמישים!!! אני צריך משאית.',
    75: 'שבעים וחמש! אני מתחיל לחשוש שהשמיים יגמרו לנו.',
    100: 'מאה עוגיות!!! קוראים לזה "מאפייה". אני פותח עסק.'
  };
  const MORE = n => `${n}! העוגיות מתחילות להתלונן על התור.`;
  const STREAK = { 10: 'רצף של 10 בלי פספוס! ידיים מגנטיות!', 25: 'רצף 25! העוגיות פשוט קופצות אליך.', 50: 'רצף 50!!! אתה לא תופס עוגיות, הן תופסות אותך.' };
  const LEVEL_UP = ['שלב חדש! השמיים מתחילים לזרוק מהר יותר.', 'עלית שלב! מישהו שם למעלה ממהר.', 'שלב חדש! העוגיות עשו חימום.'];
  const SHOWER = ['🍪 גשם עוגיות!!! עכשיו אי אפשר לאבד לבבות, רק לצבור נקודות!', '🍪 התפרצות עוגיות! בזמן הגשם שום דבר לא נחשב נגדך. תפוס הכל!'];
  const SHOWER_END = 'הגשם נגמר. זה היה הרגע הכי טעים בחיים שלי.';
  const EGG_APPEAR = 'מה זה?! ביצה מרקדת! תפוס אותה! היא זזה מצד לצד!';
  const EGG_CAUGHT = 'תפסת את הביצה המרקדת!!! 🥚 היא רקדה ישר לסל!';
  const EGG_AGAIN = 'שוב תפסת את הביצה המרקדת! היא מתחילה לחבב אותך. +10.';
  const EGG_MISSED = 'הביצה רקדה לה משם. אולי בסיבוב הבא...';
  const ENDS = [
    [0, 'זה היה... קצר. אבל העוגיות שתפסת היו טעימות.'],
    [5, 'לא רע! הסל אומר תודה.'],
    [15, 'יפה מאוד! מגיעה לך כוס חלב.'],
    [30, 'מרשים! אתה תופס עוגיות כמו מקצוען.'],
    [50, 'אגדה! אף עוגייה לא בטוחה כשאתה בסביבה.']
  ];
  const RECORD = ['שיא חדש! אני אוכל את כל העוגיות לכבודך.', 'שיא! אני תולה את הסל על הקיר.'];

  let canvas, ctx, liveOut, bestOut;
  let W = 760, H = 400, FLOOR = H - 22, BASKET_Y = 0;
  let state = 'ready', last = 0, frame = 0, deadAt = 0;
  let px, targetX, items, crumbs, floats, clouds, spawnIn, score, lives, streak, best, bubble;
  let drops, lastMilestone, level, hurtUntil, shakeUntil, happyUntil, showerUntil, nextShowerAt, eggSpawned, eggAt;
  const keys = { left: false, right: false };

  function layout() {
    FLOOR = H - 22;
    BASKET_Y = FLOOR - BODY_R * 2 - BASKET_H + 6;
  }

  function reset() {
    px = targetX = W / 2;
    items = []; crumbs = []; floats = []; spawnIn = 40;
    score = 0; lives = MAX_LIVES; streak = 0; drops = 0; bubble = null; lastMilestone = 0; level = 1;
    hurtUntil = 0; shakeUntil = 0; happyUntil = 0; showerUntil = 0; nextShowerAt = SHOWER_EVERY; eggSpawned = false;
    eggAt = EGG_FROM + Math.floor(Math.random() * EGG_SPREAD);
    if (!clouds) clouds = Array.from({ length: 4 }, (_, i) => ({ x: i * W / 3.5, y: 30 + Math.random() * 60, s: 0.7 + Math.random() * 0.6 }));
  }
  const say = (text, ms = 2400) => { bubble = { text, until: performance.now() + ms }; };
  const showering = () => frame < showerUntil;

  /* ---------- לוגיקה ---------- */
  function start() {
    reset();
    state = 'running';
    say(P.rand(START), 3000);
    liveOut.textContent = 'המשחק התחיל. חיצים ימינה ושמאלה, או העכבר, מזיזים את פיצי.';
  }

  // הקושי עולה לאט, כדי שסיבוב יימשך יותר זמן
  const fallSpeed = () => 1.9 + Math.min(3.2, score * 0.035);
  const blueChance = () => (score < 4 || showering() ? 0 : Math.min(0.24, 0.08 + score * 0.003));

  function addItem(type) {
    const r = { cookie: 15, gold: 16, heart: 14, blue: 16, egg: 17 }[type];
    const it = { type, r, x: r + 10 + Math.random() * (W - r * 2 - 20), y: -r, vy: fallSpeed() * (0.85 + Math.random() * 0.3), rot: Math.random() * 6 };
    if (type === 'egg') { it.vy = 1.6; it.baseX = Math.max(140, Math.min(W - 140, it.x)); it.phase = Math.random() * 6; }
    items.push(it);
  }

  function spawn() {
    if (!eggSpawned && score >= eggAt && !showering()) {
      eggSpawned = true;
      addItem('egg');
      say(EGG_APPEAR, 2600);
      P.sound('tweet');
    } else {
      const r = Math.random();
      let type = 'cookie';
      if (r < blueChance()) type = 'blue';
      else if (r > (showering() ? 0.85 : 0.93)) type = 'gold';
      else if (r > 0.89 && lives < MAX_LIVES && !showering()) type = 'heart';
      addItem(type);
    }
    const gap = Math.max(30, 64 - score * 0.45) * (0.75 + Math.random() * 0.5);
    spawnIn = showering() ? gap / 3.2 : gap;
  }

  function burstCrumbs(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      crumbs.push({ x, y, vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 4 - 1, life: 40 + Math.random() * 20, color, s: 2 + Math.random() * 3 });
    }
  }
  function floatText(text, x, y, color) { floats.push({ text, x, y, life: 50, color }); }

  function loseLife(line, shake) {
    lives--;
    streak = 0;
    hurtUntil = frame + 24;
    shakeUntil = shake ? frame + 24 : 0; // רועד רק מכפתור כחול, לא מעוגייה שנפלה
    P.sound('boing');
    if (lives <= 0) return gameOver(line);
    say(lives === 1 ? line + ' ' + LAST_LIFE : line, 2400);
  }

  function caught(it) {
    burstCrumbs(it.x, BASKET_Y, it.type === 'blue' ? '#3B82F6' : it.type === 'heart' ? '#FF3B3B' : '#C98B4F', 9);
    if (it.type === 'blue') {
      if (showering()) { say('כפתור כחול בזמן הגשם? לא נחשב! 😎', 1600); return; }
      floatText('−❤', it.x, BASKET_Y - 10, '#1E3A8A');
      return loseLife(P.rand(BLUE), true);
    }
    happyUntil = frame + 14;
    if (it.type === 'heart') { lives = Math.min(MAX_LIVES, lives + 1); P.sound('tweet'); floatText('+❤', it.x, BASKET_Y - 10, '#C81E1E'); say(P.rand(HEART)); return; }
    if (it.type === 'egg') {
      score += 10;
      floatText('+10 🥚', it.x, BASKET_Y - 10, '#8E44AD');
      P.sound('tweet');
      P.burst({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      say(P.egg('catch') ? EGG_CAUGHT : EGG_AGAIN, 3200);
      return;
    }
    const pts = it.type === 'gold' ? 5 : 1;
    score += pts;
    streak++;
    floatText('+' + pts, it.x, BASKET_Y - 10, it.type === 'gold' ? '#B8860B' : '#1A1A1A');
    P.sound(it.type === 'gold' ? 'tweet' : 'pop');

    const m = Math.floor(score / 10) * 10;
    const newLevel = 1 + Math.floor(score / 20);
    if (score >= nextShowerAt && !showering()) { // בזמן גשם לא מתחיל גשם חדש, אחרת הוא מתארך בלי סוף
      showerUntil = frame + SHOWER_FRAMES;
      nextShowerAt = Infinity; // ייקבע מחדש כשהגשם ייגמר
      say(P.rand(SHOWER), 2600);
      P.sound('boing');
    } else if (STREAK[streak]) say(STREAK[streak]);
    else if (m > lastMilestone) say(MILESTONES[m] || MORE(m), 2600);
    else if (newLevel > level) say(P.rand(LEVEL_UP));
    else if (it.type === 'gold') say(P.rand(GOLD));
    else if (Math.random() < 0.1 && !bubble) say(P.rand(CATCH), 1100);
    if (m > lastMilestone) lastMilestone = m;
    level = Math.max(level, newLevel);
    if (score >= SCORE_EGG && P.egg('baker')) {
      say('🥚 רגע, מה זה בתחתית הסל?! מצאת ביצת הפתעה נסתרת! מגיע לך תואר "מאפייה מהלכת".', 3600);
      P.burst({ particleCount: 140, spread: 110, origin: { y: 0.5 } });
    }
  }

  function gameOver(line) {
    state = 'over';
    deadAt = performance.now();
    say(line, 60000);
    const isRecord = score > best;
    if (isRecord) { best = score; P.store.set('catchBest', best); }
    bestOut.textContent = `השיא שלך: ${best}`;
    liveOut.textContent = `המשחק נגמר. ניקוד: ${score}.${isRecord ? ' שיא חדש!' : ''}`;
    setTimeout(() => {
      if (isRecord && score >= 10) { P.say(P.rand(RECORD)); P.burst({ particleCount: 110, spread: 90 }); }
      else P.say(ENDS.filter(([min]) => score >= min).pop()[1]);
    }, 700);
  }

  function update(dt) {
    frame += dt;
    if (keys.left) targetX -= 8 * dt;
    if (keys.right) targetX += 8 * dt;
    targetX = Math.max(BASKET_W / 2, Math.min(W - BASKET_W / 2, targetX));
    px += (targetX - px) * Math.min(1, 0.3 * dt);
    clouds.forEach(c => { c.x += 0.15 * c.s * dt; if (c.x > W + 80) c.x = -80; });
    crumbs.forEach(c => { c.x += c.vx * dt; c.y += c.vy * dt; c.vy += 0.25 * dt; c.life -= dt; });
    crumbs = crumbs.filter(c => c.life > 0 && c.y < H);
    floats.forEach(f => { f.y -= 0.8 * dt; f.life -= dt; });
    floats = floats.filter(f => f.life > 0);
    if (state !== 'running') return;

    const wasShowering = showerUntil && frame - dt < showerUntil;
    spawnIn -= dt;
    if (spawnIn <= 0) spawn();
    for (const it of items) {
      const prevBottom = it.y + it.r;
      it.y += it.vy * dt;
      it.rot += 0.05 * dt;
      if (it.type === 'egg') it.x = it.baseX + Math.sin(frame / 22 + it.phase) * 120; // הריקוד
      if (!it.done && prevBottom <= BASKET_Y + 6 && it.y + it.r >= BASKET_Y && Math.abs(it.x - px) < BASKET_W / 2 + it.r * 0.4) {
        it.done = true;
        caught(it);
        if (state !== 'running') return;
      } else if (!it.done && it.y - it.r > FLOOR) {
        it.done = true;
        if (it.type === 'egg') say(EGG_MISSED);
        else if (it.type === 'cookie' || it.type === 'gold') {
          burstCrumbs(it.x, FLOOR, '#C98B4F', 6);
          if (!showering()) { // בזמן הגשם פספוס לא נחשב
            drops++;
            streak = 0;
            if (drops % DROPS_PER_HEART === 0) {
              loseLife(P.rand(MISS));
              if (state !== 'running') return;
            } else say(P.rand(FIRST_DROP), 1800);
          }
        }
      }
    }
    items = items.filter(it => !it.done);
    if (wasShowering && !showering()) {
      // הגשם הבא: בכפולה הבאה של SHOWER_EVERY אחרי הניקוד שבסוף הגשם
      nextShowerAt = (Math.floor(score / SHOWER_EVERY) + 1) * SHOWER_EVERY;
      say(SHOWER_END);
    }
  }

  /* ---------- ציור ---------- */
  function line(c, w) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; }

  function drawBackground() {
    const sky = ctx.createLinearGradient(0, 0, 0, FLOOR);
    sky.addColorStop(0, showering() ? '#FFE3B3' : '#BFE9F2');
    sky.addColorStop(1, '#FFF8E7');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, FLOOR);
    // שמש עם פרצוף
    const sx = 150, sy = 62; // משמאל, כדי לא להסתיר את הניקוד
    ctx.fillStyle = '#FFD93D'; line('#1A1A1A', 3);
    ctx.beginPath(); ctx.arc(sx, sy, 26, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath(); ctx.arc(sx - 8, sy - 4, 2.5, 0, Math.PI * 2); ctx.arc(sx + 8, sy - 4, 2.5, 0, Math.PI * 2); ctx.fill();
    line('#1A1A1A', 2.5); ctx.beginPath(); ctx.arc(sx, sy + 3, 8, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    // עננים
    ctx.fillStyle = '#fff'; line('#1A1A1A', 2);
    clouds.forEach(c => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, 34 * c.s, 13 * c.s, 0, 0, Math.PI * 2);
      ctx.ellipse(c.x + 20 * c.s, c.y - 8 * c.s, 18 * c.s, 12 * c.s, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    });
    // משטח עץ
    ctx.fillStyle = '#E2B887'; ctx.fillRect(0, FLOOR, W, H - FLOOR);
    line('#C08A55', 2);
    for (let x = 30; x < W; x += 70) { ctx.beginPath(); ctx.moveTo(x, FLOOR + 6); ctx.lineTo(x + 30, FLOOR + 6); ctx.stroke(); }
    line('#1A1A1A', 3); ctx.beginPath(); ctx.moveTo(0, FLOOR); ctx.lineTo(W, FLOOR); ctx.stroke();
  }

  function drawCookie(x, y, r, rot, gold) {
    ctx.fillStyle = gold ? '#FFD93D' : '#D9A15B'; line('#1A1A1A', 2.5);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = gold ? '#B8860B' : '#4A2C17';
    [[0.4, 6], [2.3, 7], [4.1, 5], [0, 0]].forEach(([a, d]) => { ctx.beginPath(); ctx.arc(x + Math.cos(a + rot) * d * r / 14, y + Math.sin(a + rot) * d * r / 14, 2.6, 0, Math.PI * 2); ctx.fill(); });
    if (gold) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x - r * 0.4, y - r * 0.45, 2.5, 0, Math.PI * 2); ctx.fill(); }
  }

  function drawItem(it) {
    const { x, y, r } = it;
    if (it.type === 'cookie' || it.type === 'gold') return drawCookie(x, y, r, it.rot, it.type === 'gold');
    line('#1A1A1A', 2.5);
    if (it.type === 'heart') {
      ctx.fillStyle = '#FF3B3B';
      ctx.beginPath(); ctx.moveTo(x, y + r * 0.8);
      ctx.bezierCurveTo(x - r * 1.4, y - r * 0.2, x - r * 0.6, y - r * 1.2, x, y - r * 0.35);
      ctx.bezierCurveTo(x + r * 0.6, y - r * 1.2, x + r * 1.4, y - r * 0.2, x, y + r * 0.8);
      ctx.fill(); ctx.stroke();
    } else if (it.type === 'egg') {
      // ביצה צבעונית מתנדנדת עם נצנוצים
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(frame / 8) * 0.35);
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.8, r, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.save(); ctx.clip();
      ['#FF3B3B', '#FFD93D', '#2EC4B6', '#8E44AD'].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(-r, -r + i * r * 0.5 + 2, r * 2, r * 0.25); });
      ctx.restore();
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.8, r, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#FFD93D';
      for (let i = 0; i < 3; i++) {
        const a = frame / 15 + i * 2.1, sx = x + Math.cos(a) * (r + 9), sy = y + Math.sin(a) * (r + 9);
        ctx.beginPath(); ctx.moveTo(sx, sy - 5); ctx.lineTo(sx + 1.5, sy - 1.5); ctx.lineTo(sx + 5, sy); ctx.lineTo(sx + 1.5, sy + 1.5);
        ctx.lineTo(sx, sy + 5); ctx.lineTo(sx - 1.5, sy + 1.5); ctx.lineTo(sx - 5, sy); ctx.lineTo(sx - 1.5, sy - 1.5); ctx.closePath(); ctx.fill();
      }
    } else { // כפתור כחול מתנשא
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff';
      [x - 5, x + 5].forEach(ex => { ctx.beginPath(); ctx.arc(ex, y - 2, 3.5, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = '#1A1A1A';
      [x - 5, x + 5].forEach(ex => { ctx.beginPath(); ctx.arc(ex, y - 1, 1.6, 0, Math.PI * 2); ctx.fill(); });
      line('#1A1A1A', 2);
      ctx.beginPath(); ctx.moveTo(x - 9, y - 8); ctx.lineTo(x - 2, y - 6); ctx.moveTo(x + 9, y - 9); ctx.lineTo(x + 2, y - 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 4, y + 6); ctx.quadraticCurveTo(x + 1, y + 8, x + 5, y + 4); ctx.stroke();
    }
  }

  function drawPitzi() {
    const hurt = frame < hurtUntil, happy = frame < happyUntil;
    const squash = happy ? 1 - 0.12 * Math.sin((happyUntil - frame) / 14 * Math.PI) : 1;
    const cy = FLOOR - BODY_R * squash;
    const nearest = items.reduce((n, it) => (!n || it.y > n.y ? it : n), null);
    const look = nearest ? Math.max(-3, Math.min(3, (nearest.x - px) / 30)) : 0;
    line('#1A1A1A', 3);
    ctx.beginPath(); ctx.moveTo(px - BODY_R + 2, cy - 4); ctx.lineTo(px - BASKET_W / 2 + 12, BASKET_Y + BASKET_H - 2);
    ctx.moveTo(px + BODY_R - 2, cy - 4); ctx.lineTo(px + BASKET_W / 2 - 12, BASKET_Y + BASKET_H - 2); ctx.stroke();
    ctx.fillStyle = '#8a1d1d';
    ctx.beginPath(); ctx.ellipse(px, FLOOR - 4, BODY_R + 2, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = hurt ? '#ff7a7a' : '#FF3B3B';
    ctx.beginPath(); ctx.ellipse(px, cy - 2, BODY_R / Math.sqrt(squash), BODY_R * squash, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    [px - 9, px + 9].forEach(ex => {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex, cy - 7, 6.5, 0, Math.PI * 2); ctx.fill(); line('#1A1A1A', 2); ctx.stroke();
      ctx.fillStyle = '#1A1A1A'; ctx.beginPath(); ctx.arc(ex + look, cy - 9, 3, 0, Math.PI * 2); ctx.fill();
    });
    line('#1A1A1A', 2.5); ctx.beginPath();
    if (hurt || state === 'over') ctx.arc(px, cy + 13, 5, Math.PI * 1.15, Math.PI * 1.85);
    else ctx.arc(px, cy + 4, happy ? 8 : 6, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
    // עוגיות שמציצות מהסל, לפי הניקוד
    const pile = Math.min(5, Math.ceil(score / 6));
    for (let i = 0; i < pile; i++) drawCookie(px - BASKET_W / 2 + 18 + i * ((BASKET_W - 36) / 4), BASKET_Y + 2, 9, i, false);
    // הסל
    ctx.fillStyle = '#FFD93D'; line('#1A1A1A', 3);
    ctx.beginPath();
    ctx.moveTo(px - BASKET_W / 2, BASKET_Y); ctx.lineTo(px + BASKET_W / 2, BASKET_Y);
    ctx.lineTo(px + BASKET_W / 2 - 10, BASKET_Y + BASKET_H); ctx.lineTo(px - BASKET_W / 2 + 10, BASKET_Y + BASKET_H); ctx.closePath();
    ctx.fill(); ctx.stroke();
    line('#B8860B', 2); ctx.beginPath();
    for (let i = 1; i < 5; i++) { const bx = px - BASKET_W / 2 + (BASKET_W / 5) * i; ctx.moveTo(bx, BASKET_Y + 3); ctx.lineTo(bx + (bx < px ? 3 : -3), BASKET_Y + BASKET_H - 3); }
    ctx.stroke();
  }

  function wrap(text, maxW) {
    const words = text.split(' '), out = [];
    let cur = '';
    words.forEach(wd => { const t = cur ? cur + ' ' + wd : wd; if (ctx.measureText(t).width > maxW && cur) { out.push(cur); cur = wd; } else cur = t; });
    if (cur) out.push(cur);
    return out;
  }

  function drawBubble(text) {
    ctx.font = '600 15px Rubik, sans-serif';
    const lines = wrap(text, 280);
    const bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 24, bh = lines.length * 19 + 12;
    const left = Math.max(6, Math.min(W - bw - 6, px - bw / 2)), top = Math.max(40, BASKET_Y - bh - 28);
    ctx.fillStyle = '#fff'; line('#1A1A1A', 2.5);
    ctx.beginPath(); ctx.roundRect(left, top, bw, bh, 10); ctx.fill(); ctx.stroke();
    const tip = Math.max(left + 14, Math.min(left + bw - 14, px));
    ctx.beginPath(); ctx.moveTo(tip - 6, top + bh); ctx.lineTo(tip, top + bh + 9); ctx.lineTo(tip + 6, top + bh); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1A1A1A'; ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    lines.forEach((l, i) => ctx.fillText(l, left + bw / 2, top + 7 + i * 19));
  }

  function drawHud() {
    for (let i = 0; i < MAX_LIVES; i++) {
      const x = 22 + i * 26, y = 22;
      ctx.fillStyle = i < lives ? '#FF3B3B' : 'rgba(255,255,255,.7)'; line('#1A1A1A', 2);
      ctx.beginPath(); ctx.moveTo(x, y + 8);
      ctx.bezierCurveTo(x - 13, y - 1, x - 5, y - 11, x, y - 3);
      ctx.bezierCurveTo(x + 5, y - 11, x + 13, y - 1, x, y + 8);
      ctx.fill(); ctx.stroke();
    }
    // כמה עוגיות כבר נפלו לקראת הלב הבא (עוגייה סדוקה ליד הלבבות)
    const pending = drops % DROPS_PER_HEART;
    if (pending && !showering()) {
      drawCookie(22 + MAX_LIVES * 26 + 6, 23, 9, 0, false);
      line('#1A1A1A', 2); ctx.beginPath(); ctx.moveTo(22 + MAX_LIVES * 26 + 2, 16); ctx.lineTo(22 + MAX_LIVES * 26 + 8, 23); ctx.lineTo(22 + MAX_LIVES * 26 + 4, 30); ctx.stroke();
      ctx.font = '600 13px Rubik, sans-serif'; ctx.fillStyle = '#1A1A1A'; ctx.direction = 'ltr'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(`${pending}/${DROPS_PER_HEART}`, 22 + MAX_LIVES * 26 + 20, 24);
    }
    if (showering()) {
      ctx.font = '600 13px Rubik, sans-serif'; ctx.fillStyle = '#C81E1E'; ctx.direction = 'rtl'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('🛡️ מוגן', 22 + MAX_LIVES * 26, 24);
    }
    // לוח ניקוד על רקע לבן, כדי שהעננים לא יסתירו אותו
    ctx.fillStyle = 'rgba(255,255,255,.9)'; line('#1A1A1A', 2.5);
    ctx.beginPath(); ctx.roundRect(W - 150, 8, 140, 52, 12); ctx.fill(); ctx.stroke();
    ctx.font = '400 20px "Secular One", sans-serif'; ctx.fillStyle = '#1A1A1A';
    ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.textBaseline = 'top';
    ctx.fillText(`🍪 ${score}`, W - 20, 12);
    ctx.font = '600 13px Rubik, sans-serif';
    ctx.fillText(`שלב ${level}${best ? ` · שיא ${best}` : ''}`, W - 20, 38);
    if (showering()) {
      ctx.font = '400 26px "Secular One", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#C81E1E';
      ctx.fillText('🍪 גשם עוגיות! 🍪', W / 2, 14);
      const left = (showerUntil - frame) / SHOWER_FRAMES;
      ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillRect(W / 2 - 80, 48, 160, 7);
      ctx.fillStyle = '#FF3B3B'; ctx.fillRect(W / 2 - 80, 48, 160 * left, 7);
    }
  }

  function drawEffects() {
    crumbs.forEach(c => { ctx.globalAlpha = Math.min(1, c.life / 20); ctx.fillStyle = c.color; ctx.fillRect(c.x, c.y, c.s, c.s); });
    ctx.globalAlpha = 1;
    ctx.font = '400 20px "Secular One", sans-serif'; ctx.textAlign = 'center'; ctx.direction = 'ltr';
    floats.forEach(f => {
      ctx.globalAlpha = Math.min(1, f.life / 25);
      ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y);
    });
    ctx.globalAlpha = 1;
  }

  function centerText(rows) {
    ctx.fillStyle = 'rgba(255,248,231,.85)'; line('#1A1A1A', 3);
    ctx.beginPath(); ctx.roundRect(W / 2 - 230, H / 2 - 105, 460, 120, 18); ctx.fill(); ctx.stroke();
    ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#1A1A1A';
    rows.forEach(([text, font, dy]) => { ctx.font = font; ctx.fillText(text, W / 2, H / 2 - 45 + dy); });
  }

  function draw() {
    ctx.save();
    if (frame < shakeUntil) ctx.translate(Math.sin(frame * 1.7) * 4, 0); // רעידה קלה, לא הבהוב
    drawBackground();
    items.forEach(drawItem);
    drawPitzi();
    drawEffects();
    ctx.restore();
    drawHud();
    if (state === 'ready') centerText([['תפוס את העוגיות!', '400 34px "Secular One", sans-serif', -12], ['עכבר / אצבע / חיצים מזיזים את פיצי', '600 15px Rubik, sans-serif', 26], ['לחץ על הלוח או רווח כדי להתחיל', '600 15px Rubik, sans-serif', 48]]);
    else if (state === 'over') centerText([['נגמר!', '400 36px "Secular One", sans-serif', -12], [`${score} עוגיות בסל · שלב ${level}`, '600 16px Rubik, sans-serif', 26], ['לחץ על הלוח או רווח כדי לשחק שוב', '600 14px Rubik, sans-serif', 50]]);
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

  // לוח רחב במחשב, ולוח גבוה יותר בטלפון כדי שלא ייצא קטן
  function resize() {
    const cssW = canvas.clientWidth || 760, dpr = window.devicePixelRatio || 1;
    const wide = cssW >= 600;
    const newW = wide ? 760 : 480, newH = wide ? 400 : 520;
    if (newW !== W) { const k = newW / W; px *= k; targetX *= k; items.forEach(it => { it.x *= k; if (it.baseX) it.baseX *= k; }); }
    W = newW; H = newH;
    layout();
    canvas.style.aspectRatio = `${W} / ${H}`;
    const cssH = cssW * H / W;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    const s = cssW / W * dpr;
    ctx.setTransform(s, 0, 0, s, 0, 0);
  }

  function pointerX(e) {
    const r = canvas.getBoundingClientRect();
    return (e.clientX - r.left) / r.width * W;
  }

  function startOrRestart() {
    if (state === 'ready') start();
    else if (state === 'over' && performance.now() - deadAt > 500) start();
  }

  P.register('catch', {
    pages: ['catch'],
    init() {
      canvas = document.getElementById('catchCanvas');
      if (!canvas || !canvas.getContext) return;
      ctx = canvas.getContext('2d');
      liveOut = document.getElementById('catchLive');
      bestOut = document.getElementById('catchBest');
      best = P.store.get('catchBest', 0);
      bestOut.textContent = best ? `השיא שלך: ${best}` : 'עוד אין שיא. העוגיות מחכות.';
      layout();
      reset();
      resize();
      addEventListener('resize', resize);

      canvas.addEventListener('pointermove', e => { targetX = pointerX(e); });
      canvas.addEventListener('pointerdown', e => { e.preventDefault(); targetX = pointerX(e); startOrRestart(); });
      addEventListener('keydown', e => {
        if (e.target.closest && e.target.closest('input, textarea')) return;
        if (e.key === 'ArrowLeft') { keys.left = true; e.preventDefault(); }
        else if (e.key === 'ArrowRight') { keys.right = true; e.preventDefault(); }
        else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && state === 'running') e.preventDefault(); // שהעמוד לא יגלול באמצע משחק
        else if ((e.key === ' ' || e.key === 'Enter') && (document.activeElement === canvas || document.activeElement === document.body)) { e.preventDefault(); startOrRestart(); }
      });
      addEventListener('keyup', e => {
        if (e.key === 'ArrowLeft') keys.left = false;
        if (e.key === 'ArrowRight') keys.right = false;
      });

      canvas.focus({ preventScroll: true });
      requestAnimationFrame(t => { last = t; loop(t); });
      setTimeout(() => P.sayWhenFree('גשם של עוגיות בדרך! אני מחזיק את הסל, אתה מזיז אותי. 🧺'), 900);
    }
  });
})();
