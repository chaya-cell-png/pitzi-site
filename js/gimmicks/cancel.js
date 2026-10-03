/* גימיק 12: ביטול פסימי – "בטוח?" ← "ממש בטוח?", שבעה שלבים עד שהטופס מתבטל */
(function () {
  const P = window.Pitzi;
  const STEPS = [
    'בטוח שאתה רוצה לבטל?',
    'ממש בטוח?',
    'ממש ממש בטוח? הטופס התאמץ.',
    'חשבת על הגלגל? הוא הסתובב בשבילך.',
    'ועל השלוליות? הן כבר לא יהיו אותו דבר.',
    'הטופס התחיל לבכות קצת. 😢 עדיין לבטל?',
    'אחרון, מבטיח: בטוח-בטוח-בטוח?'
  ];

  P.register('cancel', {
    pages: ['contact'],
    init() {
      const btn = document.getElementById('cancelBtn'), form = document.getElementById('impossibleForm');
      if (!btn) return;
      btn.addEventListener('click', () => {
        let step = 0;
        const m = P.modal('', { label: 'אישור ביטול' });
        const render = () => {
          // בשלב החמישי הכפתורים מתחלפים. סתם, כדי לבדוק שאתה ער.
          const swapped = step === 4;
          const yes = `<button class="btn btn-red" type="button" data-yes>כן, לבטל</button>`;
          const no = `<button class="btn btn-teal" type="button" data-close>לא, התחרטתי</button>`;
          m.box.innerHTML = `
            <p class="muted">שלב ${step + 1} מתוך ${STEPS.length}</p>
            <h2>${STEPS[step]}</h2>
            <div class="actions">${swapped ? no + yes : yes + no}</div>`;
          m.box.querySelector('[data-yes]').addEventListener('click', () => {
            P.sound('beep');
            if (++step < STEPS.length) return render();
            m.box.innerHTML = `
              <h2>טוב. בוטל. 🚪</h2>
              <p>הטופס הלך לחדר שלו. הוא יהיה בסדר. כנראה.</p>
              <div class="actions"><button class="btn btn-white" type="button" data-close>סגור</button></div>`;
            m.focusFirst();
            form.dispatchEvent(new Event('pitzi:reset'));
            P.egg('cancel');
          });
          m.focusFirst();
        };
        render();
        m.box.addEventListener('click', e => {
          if (e.target.closest('[data-close]') && step < STEPS.length) P.say('יופי! ידעתי שאתה איתנו. 💪');
        }, true);
      });
    }
  });
})();
