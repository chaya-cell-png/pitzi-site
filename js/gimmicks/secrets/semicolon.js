/* סוד לקהל הטכנולוגי: אחרי הרבה לחיצות פיצי חושד שחסרה נקודה-פסיק, ואחר כך האתר "נתקע" לרגע.
   ולמי שפותח את הקונסול: הודעה מיוחדת. */
(function () {
  const P = window.Pitzi;
  const FIRST_AT = 25, SECOND_AT = 45; // לחיצות בביקור הנוכחי

  const session = {
    get(k) { try { return Number(sessionStorage.getItem('pitzi:' + k)) || 0; } catch (e) { return 0; } },
    set(k, v) { try { sessionStorage.setItem('pitzi:' + k, String(v)); } catch (e) { /* אין אחסון */ } }
  };

  function suspicion() {
    P.say('רגע.', 1500);
    setTimeout(() => P.say('אני חושב שהמפתח שכח פה נקודה-פסיק.', 3200), 1600);
    setTimeout(() => P.say('...לא משנה.', 2500), 5000);
  }

  function glitch() {
    const html = document.documentElement;
    if (!P.calm) {
      html.classList.add('glitch');
      setTimeout(() => html.classList.remove('glitch'), 1300);
    }
    const err = P.el('div', 'fake-error');
    err.setAttribute('role', 'status');
    err.textContent = 'Uncaught SyntaxError: missing ; before statement\n    at pitzi.js:42:7\n    at button.click (everywhere)';
    document.body.appendChild(err);
    P.sound('beep');
    P.say('אם האתר נתקע עכשיו, לא ראית כלום. 👀', 3000);
    setTimeout(() => {
      err.textContent = '✓ Fixed. ;';
      P.say('...הוספתי את הנקודה-פסיק. הכל בסדר. אף אחד לא ראה. נכון? ;)', 4000);
    }, 3200);
    setTimeout(() => err.remove(), 5200);
    P.secret('semicolon');
  }

  P.register('secrets/semicolon', {
    init() {
      console.log(
        '%cשלום, מפתח/ת! 👋',
        'font: 700 20px sans-serif; color: #FF3B3B',
        '\nמחפש סודות בקוד? יש כמה. רמז: הם בתיקייה js/gimmicks/secrets.\nואם מצאת באג, זו תכונה. — פיצי ;'
      );
      document.addEventListener('click', e => {
        // לחיצות בתוך משחקים לא נספרות, כדי שהתקלה המזויפת לא תקפוץ באמצע סיבוב
        if (!e.target.closest('button, a') || e.target.closest('.hole, .runner-controls')) return;
        const n = session.get('clicks') + 1;
        session.set('clicks', n);
        if (n === FIRST_AT) setTimeout(suspicion, 600);
        else if (n === SECOND_AT) setTimeout(glitch, 600);
      }, true);
    }
  });
})();
