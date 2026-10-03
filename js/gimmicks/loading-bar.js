/* גימיק 14: פס טעינה דרמטי – נתקע ב-99%, מתנצל ומספר בדיחה */
(function () {
  const P = window.Pitzi;

  const JOKES = [
    'מה אמר הקיר לקיר השני? "ניפגש בפינה."',
    'מה אמרה המטריה לגשם? "אתה תמיד יורד עליי."',
    'למה המחשב התקרר? כי השאירו את כל החלונות פתוחים.',
    'מה אמר 0 ל-8? "איזו חגורה יפה!"',
    'למה ספר המתמטיקה עצוב? יש לו יותר מדי בעיות.',
    'מה אמרה הנעל הימנית לשמאלית? "בלעדייך אני לא הולכת לשום מקום."',
    'למה הדג לא משחק כדורגל? הוא מפחד מהרשת.',
    'למה הסולם נעלב? כי כולם דורכים עליו.',
    'מה אמר המחק לעיפרון? "אל תדאג, אני אתקן הכל."'
  ];
  const SORRY = [
    'סליחה, נתקעתי ב-99%. בינתיים, בדיחה:',
    'האחוז האחרון הכי קשה. כמו האחרון בתור לגלידה. בינתיים:',
    'אופס. האחוז האחרון הלך לשירותים. בינתיים:'
  ];

  function run(href) {
    const box = P.el('div', 'loader');
    box.setAttribute('role', 'alert');
    box.innerHTML = `
      <div class="loader-box">
        <p class="loader-title">טוען את העמוד הבא...</p>
        <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="bar-fill"></div></div>
        <div class="bar-pct">0%</div>
        <p class="loader-joke"></p>
        <button class="btn btn-white skip-load" type="button">דלג ⏩</button>
      </div>`;
    document.body.appendChild(box);
    const fill = box.querySelector('.bar-fill'), pct = box.querySelector('.bar-pct');
    const bar = box.querySelector('.bar'), joke = box.querySelector('.loader-joke');
    const timers = [];
    const go = () => { timers.forEach(clearTimeout); location.href = href; };
    box.querySelector('.skip-load').addEventListener('click', go);
    box.querySelector('.skip-load').focus();

    const set = v => { fill.style.width = v + '%'; pct.textContent = v + '%'; bar.setAttribute('aria-valuenow', v); };
    let v = 0;
    const step = () => {
      v = Math.min(99, v + 8 + Math.floor(Math.random() * 22));
      set(v);
      if (v < 99) timers.push(setTimeout(step, 110));
      else stuck();
    };
    const stuck = () => {
      timers.push(setTimeout(() => {
        joke.textContent = P.rand(SORRY) + ' ' + P.rand(JOKES);
        P.sound('beep');
      }, 500));
      timers.push(setTimeout(() => { set(100); pct.textContent = '100%! יאללה!'; }, 3300));
      timers.push(setTimeout(go, 3700));
    };
    timers.push(setTimeout(step, 80));
  }

  P.register('loading-bar', {
    init() {
      document.addEventListener('click', e => {
        const a = e.target.closest('a[href]');
        if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (a.target === '_blank' || a.hasAttribute('download') || P.calm) return;
        const url = new URL(a.href, location.href);
        if (!/^(https?|file):$/.test(url.protocol) || url.origin !== location.origin) return;
        if (url.pathname === location.pathname && url.search === location.search) return; // עוגן באותו עמוד
        e.preventDefault();
        run(url.href);
      });
      // בחזרה אחורה הדפדפן משחזר את העמוד מהזיכרון – לא להשאיר אותו תקוע בטעינה
      addEventListener('pageshow', () => document.querySelectorAll('.loader').forEach(n => n.remove()));
    }
  });
})();
