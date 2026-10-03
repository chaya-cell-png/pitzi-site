/* גימיק 8: מחולל תירוצים – מרכיב תירוץ מצחיק לאיחור */
(function () {
  const P = window.Pitzi;
  const OPEN = ['סליחה על האיחור,', 'אתה לא תאמין,', 'אני יכול להסביר:', 'זה לא באשמתי,', 'קרה משהו מוזר:'];
  const WHO = ['החתול שלי', 'השכן מלמעלה', 'תוכי עם ביטחון עצמי מופרז', 'השעון המעורר', 'הגרב השמאלי שלי',
    'צב מהיר במיוחד', 'המקרר', 'הרובוט שואב האבק', 'דינוזאור מתנפח', 'סבא של החתול'];
  const DID = ['נעל אותי בחוץ', 'החביא לי את הנעליים', 'ביקש ממני עזרה בשיעורי בית', 'התחיל לשיר ולא יכולתי לקום באמצע',
    'לקח לי את האוטובוס', 'שכנע אותי שהיום יום ראשון', 'חסם את הדלת עם מגדל קוביות', 'התעקש שנצטלם סלפי',
    'נתקע במעלית ונשאר שם לבד, אז נשארתי איתו', 'הסביר לי איך עובד הירח'];
  const END = ['ולכן הגעתי רק עכשיו.', 'אבל הבאתי עוגייה כפיצוי.', 'וזה לא יקרה שוב. כנראה.', 'יש לי עדים. הם יונים.',
    'השעון שלי יכול לאשר.', 'ואני עדיין בהלם.'];

  P.register('excuses', {
    pages: ['tools'],
    init() {
      const out = document.getElementById('excuseOut'), btn = document.getElementById('excuseBtn');
      const copy = document.getElementById('excuseCopy'), share = document.getElementById('excuseShare');
      if (!btn) return;
      let current = '', count = 0;
      const updateShare = () => {
        share.href = 'https://wa.me/?text=' + encodeURIComponent((current || 'תירוץ מהאתר "לחץ כאן ואל תלחץ כאן"') + '\n' + location.href);
      };
      updateShare();
      btn.addEventListener('click', () => {
        let next;
        do { next = `${P.rand(OPEN)} ${P.rand(WHO)} ${P.rand(DID)}, ${P.rand(END)}`; } while (next === current);
        current = next;
        out.textContent = current;
        updateShare();
        if (++count === 10) P.say('עשרה תירוצים? אתה מאחר הרבה, הא? 😅');
        else if (count === 1) P.say('תירוץ מעולה. אני הייתי מאמין. אבל אני כפתור.');
      });
      copy.addEventListener('click', () => {
        if (!current) return P.say('קודם צריך תירוץ. אין לי תירוץ למה אין תירוץ.');
        const done = () => P.say('הועתק! 📋 עכשיו רק צריך לומר את זה בביטחון.');
        if (navigator.clipboard) navigator.clipboard.writeText(current).then(done, () => P.say('לא הצלחתי להעתיק. תירוץ: הלוח היה תפוס.'));
        else P.say('הדפדפן לא מרשה להעתיק. תירוץ מצוין, אגב.');
      });
    }
  });
})();
