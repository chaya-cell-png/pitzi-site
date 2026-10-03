/* גימיק 5: קוד סודי – ↑↑↓↓←→←→ הופך את כל האתר */
(function () {
  const P = window.Pitzi;
  const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
  let pos = 0;

  P.register('konami', {
    init() {
      addEventListener('keydown', e => {
        if (e.target.closest && e.target.closest('input, textarea')) return;
        pos = e.key === CODE[pos] ? pos + 1 : (e.key === CODE[0] ? 1 : 0);
        if (pos < CODE.length) return;
        pos = 0;
        const flipped = document.documentElement.classList.toggle('flipped');
        P.sound('whoosh');
        P.say(flipped ? '🙃 הפכת את האתר! עכשיו תסובב את המסך. או את הראש.' : '🙂 אוף, סוף סוף. הדם כבר עלה לי לראש.');
        P.egg('konami');
      });
    }
  });
})();
