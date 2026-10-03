/* גימיק 17: לשונית בוכה – כשעוברים ללשונית אחרת הכותרת מתחננת */
(function () {
  const P = window.Pitzi;
  const SAD = ['חזור אליי 😢', 'הלו? אני עדיין פה 🥺', 'פיצי מתגעגע 💔'];
  let original = '', restoreTimer = 0;

  P.register('crying-tab', {
    init() {
      document.addEventListener('visibilitychange', () => {
        clearTimeout(restoreTimer);
        if (document.hidden) {
          original = document.title;
          document.title = P.rand(SAD);
        } else if (original) {
          document.title = 'יש! חזרת! 🎉';
          restoreTimer = setTimeout(() => { document.title = original; original = ''; }, 2000);
        }
      });
    }
  });
})();
