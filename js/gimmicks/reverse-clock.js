/* גימיק 23: שעון הפוך – הולך אחורה, ופיצי מתעקש שזה השעון האמיתי */
(function () {
  const P = window.Pitzi;
  const LINES = [
    'זה השעון האמיתי. כל השאר הפוכים.',
    'כן, הוא הולך אחורה. ככה מגיעים מוקדם לכל מקום.',
    'בעוד כמה שעות יהיה אתמול. תתכונן.',
    'מדענים אמרו לי שהוא שבור. אני אמרתי להם שהם שבורים.',
    'כל עוד אתה מסתכל עליו, אתה נהיה צעיר יותר. כנראה.'
  ];

  P.register('reverse-clock', {
    pages: ['tools'],
    init() {
      const face = document.getElementById('reverseClock'), note = document.getElementById('clockNote');
      if (!face) return;
      const d = new Date();
      let secs = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
      const pad = n => String(n).padStart(2, '0');
      const draw = () => {
        const s = ((secs % 86400) + 86400) % 86400;
        face.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
      };
      draw();
      setInterval(() => { secs--; draw(); }, 1000);

      let clicks = 0;
      face.addEventListener('click', () => {
        clicks++;
        P.say(LINES[(clicks - 1) % LINES.length]);
        if (clicks === 3) {
          P.egg('clock');
          note.textContent = 'אדון הזמן! עכשיו גם אתה יודע את האמת.';
        }
      });
    }
  });
})();
