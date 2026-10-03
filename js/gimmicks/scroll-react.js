/* גימיק 18: גלילה עם תגובות – בגלילה מהירה פיצי צועק "וואו, לאט!" */
(function () {
  const P = window.Pitzi;
  const LINES = [
    'וואו, לאט! יש פה מגבלת מהירות!',
    'היי! קיבלתי סחרחורת!',
    'לאט לאט, הפיקסלים לא מספיקים לרוץ אחריך!',
    'מישהו פה מאחר לאנשהו? יש לנו מחולל תירוצים, אגב.'
  ];
  const SPEED = 4; // פיקסלים למילישנייה
  let lastY = 0, lastT = 0, coolUntil = 0;

  P.register('scroll-react', {
    init() {
      lastY = scrollY; lastT = performance.now();
      addEventListener('scroll', () => {
        const now = performance.now(), dt = now - lastT;
        if (dt > 0 && dt < 200 && Math.abs(scrollY - lastY) / dt > SPEED && now > coolUntil) {
          coolUntil = now + 8000;
          P.sound('whoosh');
          P.say(P.rand(LINES));
          P.secret('scroll');
        }
        lastY = scrollY; lastT = now;
      }, { passive: true });
    }
  });
})();
