/* גימיק 13: מבחן אישיות "איזה כלי מטבח אתה?" – 6 שאלות ותוצאה עם תמונה לשיתוף */
(function () {
  const P = window.Pitzi;
  const COMMENTS = ['תשובה מעניינת...', 'אה-הא. רשמתי.', 'המממ, מתחיל להריח כמו תוצאה.', 'בחירה אמיצה.', 'אני כבר מנחש... אבל לא אגיד.'];

  P.register('quiz', {
    pages: ['quiz'],
    init() {
      const box = document.getElementById('quiz');
      const data = window.QUIZ_DATA;
      if (!box || !data) return;
      const { TOOLS, QUESTIONS } = data;

      function start() {
        box.innerHTML = `
          <div class="center">
            <p class="lead">שש שאלות. אפס תשובות לא נכונות. תוצאה אחת שתשנה את חייך (את החלק של המטבח).</p>
            <button class="btn btn-red" type="button" data-start>יאללה, מתחילים! 🍴</button>
          </div>`;
        box.querySelector('[data-start]').addEventListener('click', () => ask(0, {}));
      }

      function ask(i, score) {
        const { q, a } = QUESTIONS[i];
        box.innerHTML = `
          <p class="quiz-progress">שאלה ${i + 1} מתוך ${QUESTIONS.length}</p>
          <h2 id="qTitle">${q}</h2>
          <div class="quiz-options" role="group" aria-labelledby="qTitle">
            ${a.map(([text], k) => `<button class="btn" type="button" data-k="${k}">${text}</button>`).join('')}
          </div>`;
        box.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
          const tool = a[Number(b.dataset.k)][1];
          score[tool] = (score[tool] || 0) + 1;
          score._last = tool;
          if (i % 2 === 1 && i < QUESTIONS.length - 1) P.say(P.rand(COMMENTS));
          if (i + 1 < QUESTIONS.length) ask(i + 1, score);
          else {
            // תיקו מוכרע לטובת התשובה האחרונה
            const best = Object.keys(TOOLS).reduce((w, t) =>
              (score[t] || 0) > (score[w] || 0) || ((score[t] || 0) === (score[w] || 0) && t === score._last) ? t : w);
            history.replaceState(null, '', '?r=' + best);
            result(best, true);
          }
        }));
        box.querySelector('[data-k]').focus();
      }

      function result(id, mine) {
        const t = TOOLS[id];
        const shareUrl = new URL('og/' + id + '.html', location.href).href;
        const msg = `יצא לי ${t.name} ${t.emoji} במבחן "איזה כלי מטבח אתה?" 😂 בוא תבדוק מה יוצא לך: ${shareUrl}`;
        box.innerHTML = `
          <div class="center">
            <p class="quiz-progress">${mine ? 'התוצאה שלך:' : 'מישהו שלח לך את התוצאה שלו:'}</p>
            <div class="result-art">${t.art}</div>
            <p class="result-name">${t.name}!</p>
            <p class="lead">${t.text}</p>
            <div class="actions">
              ${mine ? `<a class="btn btn-teal" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">שתף בוואטסאפ 💬</a>
              <a class="btn btn-white" href="og/${id}.png" download="${id}.png">שמור תמונה 🖼️</a>` : ''}
              <button class="btn ${mine ? 'btn-white' : 'btn-red'}" type="button" data-again>${mine ? 'שוב מההתחלה' : 'גם אני רוצה לנסות!'}</button>
            </div>
          </div>`;
        box.querySelector('[data-again]').addEventListener('click', () => {
          history.replaceState(null, '', location.pathname);
          ask(0, {});
        });
        if (mine) {
          P.burst({ particleCount: 140, spread: 100 });
          P.sound('boing');
          P.say(`${t.name}! ידעתי. יש לך בדיוק את האנרגיה של ${t.name}.`);
        }
        box.querySelector('[data-again]').focus();
      }

      const r = new URLSearchParams(location.search).get('r');
      if (r && TOOLS[r]) result(r, false);
      else start();
    }
  });
})();
