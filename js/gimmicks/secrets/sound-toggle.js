/* סוד: הדלקה וכיבוי של הסאונד כמה פעמים ברצף, ופיצי שם לב */
(function () {
  const P = window.Pitzi;
  const TOGGLES = 5, WINDOW_MS = 8000, COOLDOWN_MS = 20000;
  const LINES = [
    'אתה מנסה לנגן עליי? אני כפתור, לא פסנתר. 🎹',
    'דלוק, כבוי, דלוק, כבוי... החלטת כבר?',
    'המתג של הסאונד ביקש הפסקה. הוא מסתחרר.',
    'אם זה קוד מורס, אני לא מבין מורס. נסה בעברית.'
  ];
  let clicks = [], quietUntil = 0;

  P.register('secrets/sound-toggle', {
    init() {
      const btn = document.getElementById('soundBtn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const now = Date.now();
        clicks = clicks.filter(t => now - t < WINDOW_MS);
        clicks.push(now);
        if (clicks.length < TOGGLES || now < quietUntil) return;
        clicks = [];
        quietUntil = now + COOLDOWN_MS;
        // הליבה כבר אמרה "בוינג"/"שקט" על הלחיצה הזאת, פיצי עונה אחריה
        setTimeout(() => P.say(P.rand(LINES)), 0);
        P.secret('soundToggle');
      });
    }
  });
})();
