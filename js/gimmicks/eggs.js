/* גימיק 16: ביצי הפתעה – מונה בכותרת, רשימה, ותעודה למי שמוצא את כולן.
   כאן גם הביצה של הלוגו העקשן (7 לחיצות ברצף). */
(function () {
  const P = window.Pitzi;
  const LOGO_LINES = [
    'זה הלוגו. הוא לא עושה כלום.',
    'באמת. כלום.',
    'אתה ממשיך ללחוץ על לוגו. מעניין.',
    'הלוגו מתחיל להסמיק.',
    'עוד קצת והוא יגיד משהו...',
    'כמעט...'
  ];
  const total = () => Object.keys(P.EGGS).length;

  function showList() {
    const found = P.eggsFound();
    const hints = P.hints; // מודול הרמזים לא חובה
    const items = Object.entries(P.EGGS).map(([id, name]) => {
      if (found.includes(id)) return `<li>🥚 ${name}</li>`;
      const hint = hints && hints.textFor(id);
      return hint ? `<li>❔ ??? <small class="egg-hint">💡 ${hint}</small></li>` : '<li>❔ ???</li>';
    }).join('');
    let hintAction = '';
    if (hints && hints.available()) {
      hintAction = hints.unlocked()
        ? '<button class="btn" type="button" data-hint>תן לי רמז 💡</button>'
        : `<p class="muted">💡 רמזים נפתחים אחרי ${Math.round(hints.FIRST_HINT_SEC / 60)} דקות באתר. פיצי עוד מתחמם.</p>`;
    }
    const m = P.modal(`
      <h2>ביצי הפתעה: ${found.length}/${total()}</h2>
      <p>${total()} ביצים מוסתרות באתר. מי שמוצא את כולן מקבל תעודה רשמית (בערך).</p>
      <ul class="egg-list">${items}</ul>
      ${P.SECRETS ? `<p class="secret-count">🤫 סודות שגילית: ${P.secretsFound().length}/${Object.keys(P.SECRETS).length}. הם לא ברשימה, כי הם סודות. האתר מגיב למה שאתה עושה.</p>` : ''}
      ${hintAction.startsWith('<p') ? hintAction : ''}
      <div class="actions">${hintAction.startsWith('<button') ? hintAction : ''}<button class="btn btn-teal" type="button" data-close>אמשיך לחפש</button></div>`,
      { label: 'רשימת ביצי ההפתעה', closeOnBackdrop: true });
    const hintBtn = m.box.querySelector('[data-hint]');
    if (hintBtn) hintBtn.addEventListener('click', () => { m.close(); hints.give(); });
  }

  function showCertificate() {
    const date = new Date().toLocaleDateString('he-IL');
    const m = P.modal(`
      <div class="cert">
        <div class="cert-seal" aria-hidden="true">🏅</div>
        <h2>תעודת מוצא ביצים מוסמך</h2>
        <p>מוענקת בזאת ל־</p>
        <input type="text" aria-label="השם שיופיע בתעודה" placeholder="כתוב כאן את השם שלך">
        <p>על מציאת כל ${total()} ביצי ההפתעה באתר "לחץ כאן ואל תלחץ כאן",
          על סקרנות יוצאת דופן ועל התעלמות עקבית מבקשות לא ללחוץ.</p>
        <p class="cert-sign">בהערכה רבה,<br>פיצי, כפתור ראשי<br><small>${date}</small></p>
      </div>
      <div class="actions no-print">
        <button class="btn btn-teal" type="button" data-print>הדפס תעודה 🖨️</button>
        <button class="btn btn-white" type="button" data-close>סגור</button>
      </div>`, { label: 'תעודת מוצא ביצים מוסמך' });
    m.box.querySelector('[data-print]').addEventListener('click', () => print());
    P.burst({ particleCount: 200, spread: 120 });
  }

  P.register('eggs', {
    init() {
      const btn = document.getElementById('eggBtn');
      const refresh = () => {
        const n = P.eggsFound().length;
        btn.textContent = `🥚 ${n}/${total()}`;
        btn.setAttribute('aria-label', `ביצי הפתעה: מצאת ${n} מתוך ${total()}`);
      };
      refresh();
      btn.addEventListener('click', () => (P.eggsFound().length === total() ? showCertificate() : showList()));
      document.addEventListener('pitzi:egg', e => {
        refresh();
        if (e.detail.n === e.detail.total) setTimeout(showCertificate, 1500);
      });

      let clicks = 0, reset = 0;
      document.getElementById('logo').addEventListener('click', () => {
        clicks++;
        clearTimeout(reset);
        reset = setTimeout(() => { clicks = 0; }, 3000);
        if (clicks >= 7) {
          clicks = 0;
          if (!P.egg('logo')) P.say('כבר מצאת את הביצה של הלוגו. הוא עייף עכשיו.');
          else P.say('טוב, טוב! הנה, ביצה. רק תפסיק ללחוץ על הלוגו. 🥚');
        } else P.say(LOGO_LINES[clicks - 1]);
      });
    }
  });
})();
