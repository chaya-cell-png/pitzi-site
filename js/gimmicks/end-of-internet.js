/* גימיק 24: סוף האינטרנט – בתחתית כל עמוד, עם טיל שמחזיר למעלה */
(function () {
  const P = window.Pitzi;

  P.register('end-of-internet', {
    init() {
      const footer = P.el('footer', 'site-footer', `
        <p class="eoi-title">🌐 הגעת לסוף האינטרנט.</p>
        <p>באמת. אין כלום אחרי זה. בדקנו פעמיים. חזור הביתה.</p>
        <button class="rocket" type="button" aria-label="טיל: חזרה לראש העמוד"><span aria-hidden="true">🚀</span></button>
        <p class="copy">© פיצי בע"מ (בערך). כל הזכויות שמורות במגירה. <a href="terms.html">תנאי שימוש</a> (אף אחד לא קורא). <button class="tiny-egg" type="button" aria-label="ביצה זעירה">🥚</button></p>`);
      document.body.appendChild(footer);

      const rocket = footer.querySelector('.rocket');
      rocket.addEventListener('click', () => {
        P.sound('whoosh');
        if (!P.calm) {
          rocket.classList.add('launch');
          setTimeout(() => rocket.classList.remove('launch'), 1300);
        }
        scrollTo({ top: 0, behavior: P.calm ? 'auto' : 'smooth' });
        const skip = document.querySelector('.site-header .logo');
        if (skip) setTimeout(() => skip.focus({ preventScroll: true }), 400);
        P.say('3... 2... 1... המראה! 🚀 ברוך שובך לתחילת האינטרנט.');
      });

      const tiny = footer.querySelector('.tiny-egg');
      tiny.addEventListener('click', () => { P.egg('tiny'); tiny.remove(); });
      if (P.eggsFound().includes('tiny')) tiny.remove();

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
          if (!entries[0].isIntersecting) return;
          io.disconnect();
          P.say('הגעת לסוף! מעכשיו אתה רשמית מומחה לאינטרנט. 🎓');
        }, { threshold: 0.6 });
        io.observe(footer.querySelector('.eoi-title'));
      }
    }
  });
})();
