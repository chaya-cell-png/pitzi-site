/* סוד: פיצי מגיב כשמסמנים טקסט באתר, וכשמעתיקים אותו */
(function () {
  const P = window.Pitzi;
  const SELECT = [
    'מה סימנת שם? זה המשפט הכי טוב שלי!',
    'אה, אתה מסמן? מחפש שגיאות כתיב? אין. כמעט.',
    'סימנת את זה? יש לך טעם מעולה במשפטים.',
    'זהירות, אם תסמן חזק מדי המילים יתביישו.',
    'סימון יפה! ממש בקו ישר.',
    'אני רואה מה אתה מסמן. אני לא אומר כלום. ...טוב, אמרתי.'
  ];
  const COPY = [
    'העתקת? לפחות תגיד שזה ממני. 😏',
    'Ctrl+C! הטקסט הזה גר אצלך עכשיו. תדאג לו.',
    'מעתיקים ממני? זה הכי מחמיא שיש.',
    'העתקת! אם זה בשביל מבחן, אני לא אחראי.'
  ];
  const SELECT_COOLDOWN = 12000, MIN_CHARS = 4;
  let selectQuietUntil = 0, copyQuietUntil = 0;

  // מסמנים בתוך שדות טופס או בתוך משחק? זה לא נחשב
  function realSelection() {
    const sel = window.getSelection && window.getSelection();
    if (!sel || sel.isCollapsed) return '';
    const node = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement);
    if (!node || node.closest('input, textarea, canvas, .boss, .pz-bubble')) return '';
    return sel.toString().trim();
  }

  function onSelectDone() {
    // מחכים רגע, כי הדפדפן מעדכן את הסימון אחרי שהעכבר משתחרר
    setTimeout(() => {
      const now = Date.now();
      if (now < selectQuietUntil || realSelection().length < MIN_CHARS) return;
      selectQuietUntil = now + SELECT_COOLDOWN;
      P.say(P.rand(SELECT));
      P.secret('selectCopy');
    }, 50);
  }

  P.register('secrets/select-copy', {
    init() {
      document.addEventListener('pointerup', onSelectDone);
      document.addEventListener('keyup', e => { if (e.shiftKey || e.key === 'Shift') onSelectDone(); });
      document.addEventListener('copy', () => {
        const now = Date.now();
        if (now < copyQuietUntil || !realSelection()) return;
        copyQuietUntil = now + 3000;
        selectQuietUntil = now + SELECT_COOLDOWN; // לא לדבר פעמיים על אותו סימון
        P.say(P.rand(COPY));
        P.secret('selectCopy');
      });
    }
  });
})();
