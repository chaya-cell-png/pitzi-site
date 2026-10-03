/* גימיק 1: הכפתור הבורח – בורח מהעכבר (או מהאצבע); אחרי 10 ניסיונות הוא מתעייף ונותן ללחוץ */
(function () {
  const P = window.Pitzi;
  const TIRED_AFTER = 10;
  const FLEE_LINES = ['חחח, כמעט!', 'לא היום!', 'אני מהיר יותר מהעכבר שלך!', 'תפוס אותי אם תוכל!', 'אולה! 💃'];
  const REST_MS = 7000; // עייף שלא לחצו עליו נח ואז חוזר לברוח
  let attempts = 0, tired = false, restTimer = 0;

  P.register('runaway', {
    pages: ['home'],
    init() {
      const area = document.getElementById('playground'), btn = document.getElementById('runaway');
      if (!area || !btn) return;

      const place = (x, y) => { btn.style.left = x + 'px'; btn.style.top = y + 'px'; };
      const center = () => place((area.clientWidth - btn.offsetWidth) / 2, (area.clientHeight - btn.offsetHeight) / 2);
      center();
      addEventListener('resize', () => { if (!tired) center(); });

      function flee(px, py) {
        const maxX = area.clientWidth - btn.offsetWidth - 8, maxY = area.clientHeight - btn.offsetHeight - 8;
        let x, y, tries = 0;
        do {
          x = 8 + Math.random() * maxX;
          y = 8 + Math.random() * maxY;
        } while (++tries < 20 && Math.hypot(x + btn.offsetWidth / 2 - px, y + btn.offsetHeight / 2 - py) < 120);
        place(x, y);
        attempts++;
        P.sound('pop');
        if (attempts >= TIRED_AFTER) {
          tired = true;
          btn.classList.add('tired');
          btn.textContent = 'אוף... תלחץ כבר 😮‍💨';
          P.say('טוב, טוב... נכנעתי. אני עייף. אפשר ללחוץ.');
          clearTimeout(restTimer);
          restTimer = setTimeout(() => {
            if (!tired) return;
            tired = false;
            attempts = 0;
            btn.classList.remove('tired');
            btn.textContent = 'לחץ עליי!';
            P.say('נחתי! אני שוב מהיר. 😎 פספסת את ההזדמנות.');
          }, REST_MS);
        } else if (attempts % 3 === 0) P.say(P.rand(FLEE_LINES));
      }

      area.addEventListener('pointermove', e => {
        // במצב רגוע הוא עדיין בורח, רק קופץ בלי החלקה (ה-CSS מבטל את המעבר)
        if (tired || (e.pointerType !== 'mouse' && e.pointerType !== 'pen')) return;
        const a = area.getBoundingClientRect(), b = btn.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (b.left + b.width / 2), e.clientY - (b.top + b.height / 2));
        if (dist < Math.max(b.width, b.height) / 2 + 30) flee(e.clientX - a.left, e.clientY - a.top);
      });

      btn.addEventListener('click', e => {
        const keyboard = e.detail === 0;
        if (!tired && !keyboard) {
          // במגע הכפתור קופץ מהאצבע במקום להילחץ
          const a = area.getBoundingClientRect();
          return flee(e.clientX - a.left, e.clientY - a.top);
        }
        clearTimeout(restTimer);
        let line = 'תפסת אותי! אתה מהיר. או שאני עייף. כנראה שניהם.';
        if (keyboard && !tired) line = 'עם מקלדת? זאת רמאות! ...טוב, זה נחשב.';
        P.say(line);
        P.burstFrom(btn);
        P.sound('boing');
        P.egg('caught');
        attempts = 0;
        tired = false;
        btn.classList.remove('tired');
        btn.textContent = 'עוד סיבוב? 😏';
        setTimeout(center, 50);
      });
    }
  });
})();
