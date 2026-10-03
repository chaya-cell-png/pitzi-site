/* סוד: כניסה לאתר בשעה מסוימת מקבלת בדיחה מיוחדת (כל בדיחה פעם אחת ביום) */
(function () {
  const P = window.Pitzi;
  // [מזהה, האם השעה מתאימה, בדיחה]. הסדר קובע: דקה מדויקת קודמת לטווח שעות
  const SLOTS = [
    ['1111', d => d.getHours() === 11 && d.getMinutes() === 11, '11:11! תבקש משאלה. אני ביקשתי שתפסיק ללחוץ עליי. זה לא התגשם.'],
    ['1234', d => d.getHours() === 12 && d.getMinutes() === 34, '12:34. שעה מסודרת כמו ארון של מישהו אחר.'],
    ['1337', d => d.getHours() === 13 && d.getMinutes() === 37, '13:37. מפתחים יבינו. מפתחים: אתם יודעים מה עשיתם.'],
    ['midnight', d => d.getHours() === 0, 'חצות! בשעה כזאת כפתורים הופכים לדלעות. ...אני עדיין כפתור. פיו.'],
    ['night', d => d.getHours() >= 2 && d.getHours() < 5, 'מה אתה עושה ער בשעה כזאת? גם אני ער. אבל אני כפתור, ככה אנחנו בנויים.'],
    ['dawn', d => d.getHours() === 5, 'או שעוד לא ישנת, או שכבר קמת. בשני המקרים: וואו. ☕'],
    ['friday', d => d.getDay() === 5 && d.getHours() >= 12 && d.getHours() < 16, 'שישי בצהריים? לך לעזור בבית. האתר יחכה לך. אני מבטיח לא לזוז.']
  ];

  function check() {
    const now = new Date(), today = now.toDateString();
    const seen = P.store.get('timeJokes', {});
    const slot = SLOTS.find(([id, match]) => match(now) && seen[id] !== today);
    if (!slot) return;
    seen[slot[0]] = today;
    P.store.set('timeJokes', seen);
    P.sayWhenFree('🕐 ' + slot[2], 7000);
    P.secret('time');
  }

  P.register('secrets/special-time', {
    init() {
      setTimeout(check, 4000);
      setInterval(check, 30000); // גם מי שנשאר באתר עד 11:11 יקבל את הבדיחה
    }
  });
})();
