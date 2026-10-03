/* סוד: מי שחוזר לאתר ביום אחר מגלה שפיצי זוכר אותו */
(function () {
  const P = window.Pitzi;
  const DAY_MS = 86400000;

  function message(diff, presses, days) {
    if (days === 3) return 'ביקור שלישי! רשמית אתה לקוח קבוע. אין הנחות.';
    if (days === 10) return 'עשרה ימים שונים באתר! אני חושב שאנחנו חברים. אל תספר לכפתור הבורח.';
    if (diff === 1) {
      return presses
        ? `חזרת! אתמול לחצת עליי ${presses.toLocaleString('he-IL')} פעמים. אני זוכר. אני תמיד זוכר. 🐘`
        : 'חזרת! אתמול לא לחצת עליי בכלל. אני עדיין מעריך את זה.';
    }
    if (diff < 7) return `${diff} ימים לא ראיתי אותך! חשבתי שמצאת כפתור אחר. 😢`;
    return 'עבר יותר משבוע! פיצי כבר התחיל להעלות אבק. איזה כיף שחזרת!';
  }

  P.register('secrets/returning', {
    init() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const last = P.store.get('lastDay', null);
      P.store.set('lastDay', today.getTime());
      if (!last || last === today.getTime()) return; // ביקור ראשון, או שכבר היינו פה היום
      const days = P.store.get('visitDays', 1) + 1;
      P.store.set('visitDays', days);
      const diff = Math.max(1, Math.round((today.getTime() - last) / DAY_MS));
      setTimeout(() => P.sayWhenFree(message(diff, P.store.get('presses', 0), days), 7000), 2500);
      P.secret('returning');
    }
  });
})();
