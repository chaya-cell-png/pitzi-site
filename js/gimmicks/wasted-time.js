/* מונה זמן מבוזבז – שעון קטן בפינה שסופר את כל הזמן באתר (גם בין ביקורים), עם הערות בדרך.
   נספר רק כשהלשונית גלויה. */
(function () {
  const P = window.Pitzi;
  const MILESTONES = {
    1: 'דקה שלמה באתר! זה בערך 60 שניות של כיף טהור.',
    3: 'שלוש דקות. בזמן הזה יכולת לצחצח שיניים. פעמיים. אבל זה יותר כיף.',
    5: 'חמש דקות! עם הזמן הזה היית יכול לקפל כביסה. אבל זה יותר כיף.',
    10: 'עשר דקות! אתה רשמית מבזבז זמן מקצועי. 🏅',
    15: 'רבע שעה. שתית מים היום? אני לא שותה, אני כפתור.',
    20: '20 דקות. אם מישהו שואל, אתה עושה מחקר.',
    30: 'חצי שעה!!! אתה הגולש הכי נאמן שלי. אני קצת מתרגש.',
    45: '45 דקות. זה כמו שיעור שלם, רק שפה לא היה מבחן. טוב, היה מבחן כלי מטבח.',
    60: 'שעה! אני חייב לשאול: הכל בסדר בבית?'
  };
  const LATER = 'עוד חצי שעה עברה. אני מתחיל לחשוב שאתה גר פה.';
  const CLICK = [
    'זה לא זמן מבוזבז. זה זמן שהושקע בצחוק.',
    'השעון הזה לא שופט. טוב, קצת.',
    'רוצה לאפס? אין כפתור כזה. הזמן לא חוזר. פילוסופי, הא?',
    'כל שנייה פה נספרת. אני יודע, כי אני סופר.'
  ];

  function fmt(s) {
    const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, sec = s % 60;
    const pad = n => String(n).padStart(2, '0');
    return h ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
  }

  P.register('wasted-time', {
    init() {
      let total = P.store.get('wasted', 0);
      const chip = P.el('button', 'waste-clock');
      chip.type = 'button';
      chip.dataset.quiet = '';
      document.body.appendChild(chip);
      const draw = () => {
        chip.innerHTML = `⏳ <span class="waste-label">זמן מבוזבז:</span> <b>${fmt(total)}</b>`;
        chip.setAttribute('aria-label', `זמן מבוזבז באתר: ${fmt(total)}. לחץ לשמוע את פיצי`);
      };
      draw();
      chip.addEventListener('click', () => P.say(P.rand(CLICK)));

      setInterval(() => {
        if (document.hidden) return;
        total++;
        draw();
        if (total % 5 === 0) P.store.set('wasted', total);
        if (total % 60 !== 0) return;
        const min = total / 60;
        const line = MILESTONES[min] || (min > 60 && min % 30 === 0 ? LATER : null);
        if (line) P.sayWhenFree('⏳ ' + line, 6000);
      }, 1000);
      addEventListener('pagehide', () => P.store.set('wasted', total));
    }
  });
})();
