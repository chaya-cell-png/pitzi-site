/* גימיק 21: מונה לחיצות עולמי – דורש שירות חיצוני (למשל Firebase), ולכן נדחה לשלב מאוחר.
   כרגע מוצג המונה האישי מ-localStorage. כשיהיה שירות: למלא את COUNTER_URL
   (כתובת שמחזירה JSON בצורת {"count": 123} ומקבלת POST להגדלה). */
(function () {
  const P = window.Pitzi;
  const COUNTER_URL = null;

  P.register('global-counter', {
    pages: ['home'],
    init() {
      const out = document.getElementById('globalCounter');
      if (!out) return;
      const personal = () => P.store.get('clicks', 0).toLocaleString('he-IL');
      const showPersonal = () => {
        out.textContent = `המונה העולמי יוצא לחופשה. בינתיים: אתה לחצת באתר ${personal()} פעמים. שיא אישי!`;
      };
      showPersonal();
      document.addEventListener('click', () => setTimeout(showPersonal, 0));
      if (!COUNTER_URL) return;
      fetch(COUNTER_URL)
        .then(r => r.json())
        .then(d => { out.textContent = `האתר נלחץ ${Number(d.count).toLocaleString('he-IL')} פעמים בכל העולם. אתה אחראי ל-${personal()} מהן.`; })
        .catch(showPersonal);
    }
  });
})();
