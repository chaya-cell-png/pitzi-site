/* סוד: לחיצה על אותו כפתור 20 פעמים ברצף, ופיצי מתעצבן */
(function () {
  const P = window.Pitzi;
  // כפתורים שבהם לחיצות חוזרות הן חלק מהמשחק, אז לא מתעצבנים עליהן
  const SKIP = '#dontPress, .puddle, .calc-keys button, .cookie-btn, #spinBtn, #phoneBack, .pz-body, #logo, .runner-controls button, .hole';
  const GAP_MS = 4000; // הפסקה ארוכה יותר מאפסת את הספירה
  const STAGES = {
    20: ['עשרים לחיצות על אותו כפתור?! הוא לא יעשה משהו אחר. אני מכיר אותו.', 'אתה יודע שהכפתור הזה לא משתנה, נכון? בדקתי.'],
    35: ['זהו. אני מתעצבן. 😤 תלחץ על משהו אחר. משהו! כל דבר!', 'אני אדום. אני תמיד אדום. אבל עכשיו אני אדום מכעס!'],
    50: ['חמישים. הפסקתי לספור. ...51. אוף.', 'הכפתור ביקש שאגיד לך שהוא צריך חופשה.']
  };
  let target = null, count = 0, last = 0, angryTimer = 0;

  P.register('secrets/same-button', {
    init() {
      document.addEventListener('click', e => {
        const el = e.target.closest('button, a');
        if (!el || el.closest(SKIP)) return;
        const now = Date.now();
        count = el === target && now - last < GAP_MS ? count + 1 : 1;
        target = el;
        last = now;
        if (!STAGES[count]) return;
        // הכפתור עצמו מגיב קודם, ופיצי עונה מיד אחריו
        const line = P.rand(STAGES[count]);
        setTimeout(() => P.say(line), 0);
        P.setPitziClass('angry', true);
        clearTimeout(angryTimer);
        angryTimer = setTimeout(() => P.setPitziClass('angry', false), 4000);
        P.sound('boing');
        P.secret('sameButton');
      }, true);
    }
  });
})();
