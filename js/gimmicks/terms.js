/* תנאי שימוש שאף אחד לא קורא – מד קריאה, פיצי מגיב בדרך, ומי שגולל עד הסוף מקבל ביצה */
(function () {
  const P = window.Pitzi;
  const MARKS = [
    [25, '25%? אתה קורא תנאי שימוש? מרשים. אף אחד לא עושה את זה.'],
    [50, 'חצי! עורכי הדין שכתבו את זה לא הגיעו כל כך רחוק.'],
    [75, '75%. אני מתחיל לדאוג לך. יש לך תחביבים אחרים?']
  ];

  P.register('terms', {
    pages: ['terms'],
    init() {
      const legal = document.getElementById('legal'), end = document.getElementById('termsEnd');
      const pctOut = document.getElementById('readPct'), bar = document.getElementById('readBar');
      if (!legal || !end) return;

      let said = 0, done = false;
      const update = () => {
        const top = legal.getBoundingClientRect().top + scrollY;
        const span = Math.max(1, legal.offsetHeight - innerHeight * 0.6);
        const pct = Math.max(0, Math.min(100, Math.round((scrollY + innerHeight * 0.4 - top) / span * 100)));
        pctOut.textContent = `קראת ${pct}%`;
        bar.style.width = pct + '%';
        // בגלילה מהירה שמדלגת על כמה סימונים, פיצי אומר רק את האחרון
        let reached = said;
        while (reached < MARKS.length && pct >= MARKS[reached][0]) reached++;
        if (reached > said && !done) P.say(MARKS[reached - 1][1]);
        said = reached;
      };
      addEventListener('scroll', update, { passive: true });
      addEventListener('resize', update);
      update();

      if (!('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting || scrollY < 200) return; // מסך ענק שרואה הכל מיד לא נחשב לגלילה
        io.disconnect();
        done = true;
        const msg = document.getElementById('termsEndMsg');
        if (P.egg('terms')) {
          msg.textContent = '🥚 מזל טוב! קראת את כל תנאי השימוש. מגיעה לך ביצה, ואולי גם מנוחה.';
          P.burstFrom(end);
          P.say('קראת את כל תנאי השימוש?! אתה האדם הראשון בהיסטוריה. הנה ביצה. 🥚');
        } else {
          msg.textContent = 'כבר קיבלת ביצה על זה. קראת שוב? זה כבר מדאיג. 😅';
          P.say('שוב פה? אני מתחיל לחשוב שאתה עורך דין.');
        }
      }, { threshold: 0.9 });
      io.observe(end);
    }
  });
})();
