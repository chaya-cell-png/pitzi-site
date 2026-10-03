/* סוד: לחיצה על שלושה דברים בכותרת בסדר הנכון – ביצה 🥚, לוגו, פיצי – פותחת מצב מסיבה.
   אותו סדר שוב מכבה אותו. */
(function () {
  const P = window.Pitzi;
  const SEQUENCE = ['eggs', 'logo', 'pitzi'];
  const WINDOW_MS = 20000; // יש זמן לסגור את חלון הביצים בדרך
  let steps = [];

  const which = el => el.closest('#eggBtn') ? 'eggs' : el.closest('#logo') ? 'logo' : el.closest('.pz-body') ? 'pitzi' : null;
  const session = {
    get() { try { return sessionStorage.getItem('pitzi:party') === '1'; } catch (e) { return false; } },
    set(v) { try { sessionStorage.setItem('pitzi:party', v ? '1' : ''); } catch (e) { /* אין אחסון */ } }
  };

  function setParty(on, announce) {
    document.documentElement.classList.toggle('party', on);
    P.setPitziClass('party', on);
    session.set(on);
    if (!announce) return;
    if (on) {
      P.burst({ particleCount: 180, spread: 120 });
      P.sound('boing');
      P.say('🥳 גילית את המצב הסודי! מסיבה! (כדי לכבות: אותו סדר שוב.)', 7000);
      P.egg('party');
      P.secret('party');
    } else P.say('המסיבה נגמרה. מישהו צריך לנקות את הקונפטי. לא אני, אין לי ידיים.');
  }

  P.register('secrets/party-mode', {
    motion: true,
    init() {
      document.addEventListener('click', e => {
        const id = which(e.target);
        if (!id) return;
        const now = Date.now();
        steps = steps.filter(s => now - s.t < WINDOW_MS);
        steps.push({ id, t: now });
        const tail = steps.slice(-SEQUENCE.length).map(s => s.id);
        if (tail.join() !== SEQUENCE.join()) return;
        steps = [];
        if (P.calm) return setTimeout(() => P.say('יש פה מסיבה סודית, אבל במצב רגוע היא בשקט. ששש... 🤫'), 0);
        // פיצי כבר אמר משהו על הלחיצה עליו, אז המסיבה מתחילה רגע אחרי
        setTimeout(() => setParty(!document.documentElement.classList.contains('party'), true), 0);
      }, true);
    },
    // מצב רגוע מכבה את המסיבה, ומחזיר אותה רק אם היא הייתה דלוקה
    enable() { if (session.get()) setParty(true, false); },
    disable() {
      const was = document.documentElement.classList.contains('party');
      setParty(false, false);
      session.set(was);
    }
  });
})();
