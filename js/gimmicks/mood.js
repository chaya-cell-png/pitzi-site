/* גימיק 10: חזאי מזג רוח – תחזית למצב הרוח של הגולש לפי השעה ביום */
(function () {
  const P = window.Pitzi;
  // [משעה, עד שעה, סמל, תחזית, מדד אנרגיה]
  const FORECAST = [
    [5, 8, '🌅', 'בוקר ערפילי עם סיכוי לפיהוק של 90%. מומלץ קפה. או שוקו. או שניהם.', 35],
    [8, 12, '☀️', 'בהיר ואנרגטי. אזהרה: התקפי פרודוקטיביות אפשריים באזורי המרכז.', 85],
    [12, 14, '🍝', 'עננות רעבה. סיכוי למחשבות על אוכל: 100%. סיכוי לחשוב על משהו אחר: 2%.', 60],
    [14, 17, '😴', 'שפל אחר-צהריים. רוחות של "רק עוד חמש דקות" מכיוון הספה.', 30],
    [17, 20, '🌇', 'חמים ונעים. סיכוי לחיוכים: גבוה. סיכוי לריקוד במטבח: בינוני.', 75],
    [20, 23, '🌙', 'ערב רגוע עם התקררות קלה באזור המקרר.', 50],
    [23, 29, '🦉', 'לילה! צפויות מחשבות פילוסופיות על החיים ועל בננות. תחזית רשמית: לך לישון.', 15]
  ];

  function render(hour) {
    const h = hour < 5 ? hour + 24 : hour;
    const f = FORECAST.find(([a, b]) => h >= a && h < b);
    return `
      <div class="row"><span class="mood-icon" aria-hidden="true">${f[2]}</span>
      <p style="flex:1;min-width:180px;margin:0">${f[3]}</p></div>
      <p style="margin:12px 0 0">מדד אנרגיה: ${f[4]}%</p>
      <div class="meter" aria-hidden="true"><div style="width:${f[4]}%"></div></div>`;
  }

  P.register('mood', {
    pages: ['tools'],
    init() {
      const out = document.getElementById('moodOut'), range = document.getElementById('moodHour');
      const label = document.getElementById('moodHourLabel');
      if (!out) return;
      const now = new Date().getHours();
      const show = h => {
        out.innerHTML = render(h);
        label.textContent = String(h).padStart(2, '0') + ':00' + (h === now ? ' (עכשיו)' : '');
      };
      range.value = now;
      show(now);
      range.addEventListener('input', () => show(Number(range.value)));
    }
  });
})();
