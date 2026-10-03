/* גימיק 15: עמוד 404 מחפש – פיצי עם פנס מחפש את העמוד בחושך */
(function () {
  const P = window.Pitzi;
  const SEARCH_LINES = [
    'המממ... לא פה.',
    'מישהו ראה עמוד? בערך בגודל של עמוד?',
    'הוא היה פה רגע אחד! אולי הלך לשתות.',
    'עמוד? עמוד? פססס... עמוד!',
    'מצאתי! ...לא, זה רק פירור של עוגייה.'
  ];
  // [סמל, תיאור, תגובה, מיקום מימין %, מלמעלה %]
  const ITEMS = [
    ['🧦', 'גרב בודדת', 'גרב! אבל רק אחת. כרגיל.', 8, 18],
    ['🔑', 'מפתחות', 'המפתחות שלך! הם היו פה כל הזמן.', 78, 62],
    ['📺', 'שלט של טלוויזיה', 'השלט! תמיד נמצא במקום האחרון שמחפשים.', 86, 12],
    ['🧩', 'חלק של פאזל', 'החלק החסר של הפאזל! אבל של איזה פאזל?', 30, 82],
    ['🥚', 'ביצה', null, 62, 30]
  ];

  P.register('lost-404', {
    pages: ['404'],
    init() {
      const room = document.getElementById('lostRoom'), dark = document.getElementById('dark');
      if (!room) return;
      const html = document.documentElement;
      P.setPitziClass('torch', true);

      ITEMS.forEach(([icon, label, line, right, top]) => {
        const b = P.el('button', 'lost-item', icon);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.style.right = right + '%';
        b.style.top = top + '%';
        b.addEventListener('click', () => {
          if (line) return P.say(line);
          if (P.egg('lost')) P.say('ביצה! בחושך! איזה מזל שהבאתי פנס. 🥚');
          b.remove();
        });
        if (!line && P.eggsFound().includes('lost')) return;
        room.appendChild(b);
      });
      const home = P.el('a', 'btn btn-red lost-home', 'הנה הבית! 🏠');
      home.href = 'index.html';
      home.style.right = '44%';
      home.style.top = '92%';
      room.appendChild(home);

      // הפנס עוקב אחרי העכבר או האצבע
      const move = e => {
        dark.style.setProperty('--x', e.clientX + 'px');
        dark.style.setProperty('--y', e.clientY + 'px');
      };
      addEventListener('pointermove', move, { passive: true });
      addEventListener('pointerdown', move, { passive: true });

      // נגישות ומצב רגוע: אפשר פשוט להדליק את האור
      const light = P.el('button', 'chip light-btn', '');
      light.type = 'button';
      const sync = () => {
        const on = html.classList.contains('lights-on');
        light.textContent = on ? '🌑 כבה את האור' : '💡 הדלק את האור';
        light.setAttribute('aria-pressed', String(on));
      };
      light.addEventListener('click', () => {
        html.classList.toggle('lights-on');
        sync();
        P.say(html.classList.contains('lights-on') ? 'אה, היה מתג? למה אף אחד לא אמר לי?' : 'חזרנו לחושך. ככה יותר מותח.');
      });
      document.body.appendChild(light);
      html.classList.toggle('lights-on', P.calm);
      document.addEventListener('pitzi:calm', e => { if (e.detail) html.classList.add('lights-on'); sync(); });
      sync();

      setTimeout(() => P.say('אל תדאג, אני אמצא את העמוד! הבאתי פנס. 🔦'), 600);
      let n = 0;
      setInterval(() => { if (!P.calm) P.say(SEARCH_LINES[n++ % SEARCH_LINES.length]); }, 9000);
    }
  });
})();
