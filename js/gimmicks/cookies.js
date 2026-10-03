/* גימיק 7: עוגיות אמיתיות – "אישור" בחלון העוגיות מגיש עוגייה מצוירת שאפשר לנגוס בה */
(function () {
  const P = window.Pitzi;
  const BITES_TO_FINISH = 7;
  const BITE_LINES = [
    'ננננגוס! 😋', 'עוגייה עם 0% מעקב ו-100% שוקולד.', 'פירורים על כל המקלדת. מושלם.',
    'האתר היחיד שהעוגיות שלו באמת טעימות.', 'עוד ביס? אתה לא צריך לשאול.', 'כמעט נגמר... לאט לאט, תהנה.'
  ];
  const COOKIE_SVG = `
    <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs><mask id="bites"><rect width="200" height="200" fill="#fff"/><g class="bite-holes"></g></mask></defs>
      <g mask="url(#bites)">
        <circle cx="100" cy="100" r="86" fill="#D9A15B" stroke="#1A1A1A" stroke-width="6"/>
        <circle cx="100" cy="100" r="70" fill="#E4B26E"/>
        <g fill="#4A2C17">
          <ellipse cx="70" cy="70" rx="9" ry="7"/><ellipse cx="125" cy="62" rx="8" ry="6"/><ellipse cx="140" cy="110" rx="9" ry="7"/>
          <ellipse cx="95" cy="105" rx="7" ry="6"/><ellipse cx="60" cy="125" rx="8" ry="7"/><ellipse cx="110" cy="145" rx="9" ry="6"/>
          <ellipse cx="150" cy="148" rx="6" ry="5"/><ellipse cx="45" cy="90" rx="6" ry="5"/>
        </g>
      </g>
    </svg>`;

  function svgPoint(svg, x, y) {
    const pt = svg.createSVGPoint();
    pt.x = x; pt.y = y;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function eat(m) {
    m.box.innerHTML = `
      <h2>הנה העוגייה שלך 🍪</h2>
      <p>לחץ עליה כדי לנגוס. אפשר גם עם מקלדת.</p>
      <button class="cookie-btn" type="button" aria-label="עוגייה. לחץ כדי לנגוס">${COOKIE_SVG}</button>
      <p class="cookie-line" aria-live="polite"></p>
      <div class="actions"><button class="btn btn-white" type="button" data-close>אני כבר שבע, תודה</button></div>`;
    const btn = m.box.querySelector('.cookie-btn'), svg = btn.querySelector('svg');
    const holes = svg.querySelector('.bite-holes'), line = m.box.querySelector('.cookie-line');
    let bites = 0;
    btn.addEventListener('click', e => {
      let p;
      if (e.detail === 0 || !e.clientX) { // מקלדת: נוגסים בקצה אקראי
        const a = Math.random() * Math.PI * 2;
        p = { x: 100 + Math.cos(a) * 82, y: 100 + Math.sin(a) * 82 };
      } else p = svgPoint(svg, e.clientX, e.clientY);
      const ns = 'http://www.w3.org/2000/svg';
      [[0, 0, 30], [-22, 14, 20], [22, 14, 20], [0, -24, 18]].forEach(([dx, dy, r]) => {
        const c = document.createElementNS(ns, 'circle');
        c.setAttribute('cx', p.x + dx); c.setAttribute('cy', p.y + dy); c.setAttribute('r', r);
        c.setAttribute('fill', '#000');
        holes.appendChild(c);
      });
      bites++;
      P.sound('pop');
      btn.classList.remove('nom'); void btn.offsetWidth; btn.classList.add('nom');
      if (bites < BITES_TO_FINISH) { line.textContent = BITE_LINES[(bites - 1) % BITE_LINES.length]; return; }
      P.egg('cookie');
      P.burstFrom(btn);
      m.box.innerHTML = `
        <h2>אכלת את כל העוגייה! 🎉</h2>
        <p>עכשיו, כשהבטן מלאה, אפשר להיכנס לאתר. רק... אל תלחץ על הכפתור האדום.</p>
        <div class="actions"><button class="btn btn-red" type="button" data-close>נכנסים!</button></div>`;
      m.focusFirst();
    });
    m.focusFirst();
  }

  function settings(m) {
    m.box.innerHTML = `
      <h2>הגדרות עוגיות ⚙️</h2>
      <ul class="cookie-settings">
        <li><label><input type="checkbox" checked disabled> שוקולד צ'יפס (חובה, סליחה)</label></li>
        <li><label><input type="checkbox" checked> לטבול בחלב</label></li>
        <li><label><input type="checkbox"> צימוקים (באמת? אוקיי...)</label></li>
        <li><label><input type="checkbox" checked disabled> מעקב אחרי הגולש (לא קיים. אין לנו אפילו איפה לשמור)</label></li>
      </ul>
      <div class="actions"><button class="btn btn-teal" type="button" data-eat>שמור והגש עוגייה</button></div>`;
    m.box.querySelector('[data-eat]').addEventListener('click', () => eat(m));
    m.focusFirst();
  }

  P.register('cookies', {
    pages: ['home'],
    init() {
      try { if (sessionStorage.getItem('pitzi:cookies')) return; sessionStorage.setItem('pitzi:cookies', '1'); } catch (e) { /* אין אחסון */ }
      const m = P.modal(`
        <h2>🍪 האתר הזה משתמש בעוגיות</h2>
        <p>לא, ברצינות. עוגיות. עם שוקולד. אנחנו לא אוספים שום מידע, רק פירורים.</p>
        <div class="actions">
          <button class="btn btn-red" type="button" data-ok>אישור, תביאו עוגייה</button>
          <button class="btn btn-white" type="button" data-settings>הגדרות</button>
        </div>`, { label: 'חלון עוגיות', onClose: () => P.say('ברוך הבא! אני פיצי. אני מבקש רק דבר אחד: אל תלחץ על הכפתור האדום.') });
      m.box.querySelector('[data-ok]').addEventListener('click', () => eat(m));
      m.box.querySelector('[data-settings]').addEventListener('click', () => settings(m));
    }
  });
})();
