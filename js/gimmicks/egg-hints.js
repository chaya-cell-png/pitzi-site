/* רמזים לביצים – אחרי כמה דקות באתר פיצי מתחיל לרמוז איפה מסתתרת ביצה שעוד לא נמצאה.
   לכל ביצה שני רמזים: קודם עדין, ואחר כך כמעט פתרון. הזמן נספר רק כשהלשונית גלויה. */
(function () {
  const P = window.Pitzi;
  const FIRST_HINT_SEC = 180; // הרמז הראשון אחרי 3 דקות
  const EVERY_SEC = 150;      // ואחר כך רמז כל שתי דקות וחצי
  const TICK_SEC = 5;

  // pages: איפה אפשר למצוא את הביצה (null = בכל עמוד). ביצה שאפשר למצוא בעמוד הנוכחי מקבלת עדיפות
  const HINTS = {
    konami: { pages: null, text: ['שמעתי שיש קוד סודי שהופך את האתר. משהו עם חיצים...', 'במקלדת: למעלה, למעלה, למטה, למטה, שמאלה, ימינה, שמאלה, ימינה. לא אני סיפרתי.'] },
    logo: { pages: null, text: ['הלוגו שלמעלה מרגיש שמתעלמים ממנו.', 'נסה ללחוץ על הלוגו 7 פעמים ברצף. הוא יישבר בסוף.'] },
    cookie: { pages: ['home'], text: ['פספסת עוגייה? היא מוגשת רק פעם אחת בכל ביקור...', 'פתח את דף הבית בלשונית חדשה, לחץ "אישור" בחלון העוגיות ותאכל את כל העוגייה.'] },
    caught: { pages: ['home'], text: ['הכפתור הבורח בדף הבית לא יכול לברוח לנצח.', 'תרדוף אחרי הכפתור הבורח 10 פעמים עד שיתעייף, ואז תלחץ עליו.'] },
    flag: { pages: ['home'], text: ['מה יקרה אם פיצי ייכנע? לא שאני מציע...', '50 לחיצות על "אל תלחץ" ואני מניף דגל לבן. אוי, למה סיפרתי.'] },
    cancel: { pages: ['contact'], text: ['הטופס בצור קשר לא אוהב שמבטלים אותו.', 'לחץ "ביטול" בעמוד צור קשר ותתעקש עד הסוף. שבע פעמים "כן".'] },
    boss: { pages: null, text: ['אם הבוס מגיע, יש באתר מקש מילוט...', 'במחשב: לחץ Esc, ואחרי שהבוס הולך לחץ Esc שוב.'] },
    clock: { pages: ['tools'], text: ['השעון בעמוד הכלים ממש רוצה שיאמינו לו.', 'לחץ 3 פעמים על השעון ההפוך בעמוד הכלים.'] },
    lost: { pages: ['404'], text: ['משהו נפל לי בחושך כשחיפשתי עמוד שלא קיים.', 'היכנס ל"עמוד שלא קיים" (יש קישור בדף הבית) וחפש עם הפנס.'] },
    tiny: { pages: null, text: ['יש ביצה ממש-ממש קטנה בסוף האינטרנט.', 'גלול לתחתית העמוד. היא ליד שורת הזכויות השמורות. ממש קטנה!'] },
    catch: { pages: ['catch'], text: ['במשחק העוגיות, מי שמגיע רחוק מספיק פוגש מישהי שאוהבת לרקוד.', 'במשחק "תפוס את העוגיות": בסביבות 15 נקודות נופלת ביצה צבעונית בזיגזג. תעקוב אחריה עם הסל!'] },
    whack: { pages: ['whack'], text: ['הכפתורים הכחולים בחורים צריכים שיעור. אתה המורה.', 'במשחק "הכה בכפתור הכחול": צבור 25 נקודות בסיבוב אחד. ואל תלחץ עליי!'] },
    runner: { pages: ['game'], text: ['פיצי רוצה לרוץ רחוק. ממש רחוק. יש לו משחק משלו.', 'בעמוד "משחק": תגיע ל-500 נקודות. קפוץ מעל מה שעל הרצפה, והתכופף מתחת ליונים.'] },
    party: { pages: null, text: ['יש מצב סודי שנפתח כשלוחצים על שלושה דברים בכותרת, בסדר הנכון.', 'הסדר: הביצה 🥚 בכותרת, אחר כך הלוגו, ובסוף אני (פיצי). אחד אחרי השני.'] },
    terms: { pages: ['terms'], text: ['אף אחד לא קורא את תנאי השימוש. חבל, יש שם הפתעה.', 'פתח את "תנאי שימוש" (קישור בתחתית כל עמוד) וגלול עד הסוף.'] }
  };

  const session = {
    get(k) { try { return Number(sessionStorage.getItem('pitzi:' + k)) || 0; } catch (e) { return 0; } },
    set(k, v) { try { sessionStorage.setItem('pitzi:' + k, String(v)); } catch (e) { /* אין אחסון */ } }
  };
  const given = () => P.store.get('hints', {});

  function candidates() {
    const found = P.eggsFound(), g = given();
    return Object.keys(HINTS).filter(id => P.EGGS[id] && !found.includes(id) && (g[id] || 0) < 2);
  }

  function pick() {
    const g = given();
    const here = id => !HINTS[id].pages || HINTS[id].pages.includes(P.page);
    // עדיפות: ביצה שאפשר למצוא כאן, ואז ביצה שקיבלה פחות רמזים
    const score = id => (here(id) ? 0 : 10) + (g[id] || 0) * 3 + Math.random();
    return candidates().sort((a, b) => score(a) - score(b))[0] || null;
  }

  function give() {
    const id = pick();
    if (!id) return null;
    const g = given(), level = g[id] || 0;
    g[id] = level + 1;
    P.store.set('hints', g);
    session.set('lastHint', session.get('siteSec'));
    const text = HINTS[id].text[level];
    P.sound('beep');
    P.say('💡 רמז: ' + text, 9000);
    return text;
  }

  function busy() {
    const pz = P.pitziEl();
    return P.boss || document.hidden || (pz && pz.classList.contains('talking')) ||
      !!document.querySelector('.modal-wrap, .loader, .sleep');
  }

  function tick() {
    if (document.hidden) return;
    const sec = session.get('siteSec') + TICK_SEC;
    session.set('siteSec', sec);
    if (sec < FIRST_HINT_SEC || !candidates().length) return;
    const last = session.get('lastHint');
    if (last && sec - last < EVERY_SEC) return;
    if (!busy()) give(); // אם פיצי עסוק, מנסים שוב בתזוזה הבאה של השעון
  }

  P.hints = {
    FIRST_HINT_SEC,
    give,
    unlocked: () => session.get('siteSec') >= FIRST_HINT_SEC,
    available: () => candidates().length > 0,
    textFor(id) { const l = given()[id]; return l ? HINTS[id].text[l - 1] : null; }
  };

  P.register('egg-hints', {
    init() { setInterval(tick, TICK_SEC * 1000); }
  });
})();
