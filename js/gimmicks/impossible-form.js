/* גימיק 11: טופס בלתי אפשרי – הטלפון נבחר בגלגל מזל והתאריך בקפיצות לשלוליות.
   פרטיות: הטופס לא נשלח לשום מקום ושום דבר לא נשמר. */
(function () {
  const P = window.Pitzi;
  const DIGITS = 10;
  const COLORS = ['#FF3B3B', '#FFD93D', '#2EC4B6', '#8E44AD', '#FFFFFF'];
  const ns = 'http://www.w3.org/2000/svg';

  function drawWheel(svg) {
    const cx = 120, cy = 120, r = 112;
    const pt = (deg, rad) => [cx + rad * Math.sin(deg * Math.PI / 180), cy - rad * Math.cos(deg * Math.PI / 180)];
    let out = '';
    for (let d = 0; d < 10; d++) {
      const [x1, y1] = pt(d * 36 - 18, r), [x2, y2] = pt(d * 36 + 18, r), [tx, ty] = pt(d * 36, r * 0.7);
      const fill = COLORS[d % COLORS.length];
      out += `<path d="M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${fill}" stroke="#1A1A1A" stroke-width="3"/>`;
      out += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" font-family="Secular One, sans-serif" font-size="26" text-anchor="middle" dominant-baseline="central" fill="${fill === '#8E44AD' ? '#fff' : '#1A1A1A'}" transform="rotate(${d * 36} ${tx.toFixed(1)} ${ty.toFixed(1)})">${d}</text>`;
    }
    out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1A1A1A" stroke-width="6"/><circle cx="${cx}" cy="${cy}" r="16" fill="#1A1A1A"/>`;
    svg.innerHTML = out;
  }

  const PUDDLE = label => `
    <svg viewBox="0 0 180 110" aria-hidden="true" focusable="false">
      <ellipse cx="90" cy="88" rx="80" ry="18" fill="#7FC8F8" stroke="#1A1A1A" stroke-width="4"/>
      <ellipse cx="70" cy="84" rx="26" ry="5" fill="#fff" opacity=".6"/>
      <g class="drops" fill="#7FC8F8" stroke="#1A1A1A" stroke-width="2">
        <circle cx="50" cy="66" r="6"/><circle cx="90" cy="58" r="7"/><circle cx="130" cy="66" r="6"/>
      </g>
      <g class="boot"><path d="M78 20 h20 v34 h14 q8 0 8 10 h-42z" fill="#FFD93D" stroke="#1A1A1A" stroke-width="4" stroke-linejoin="round"/></g>
    </svg>
    <span>${label}</span>`;

  P.register('impossible-form', {
    pages: ['contact'],
    init() {
      const form = document.getElementById('impossibleForm');
      if (!form) return;
      const wheel = document.getElementById('wheel'), spin = document.getElementById('spinBtn');
      const back = document.getElementById('phoneBack'), display = document.getElementById('phoneDisplay');
      const dayP = document.getElementById('dayPuddle'), monthP = document.getElementById('monthPuddle');
      const dateOut = document.getElementById('dateDisplay'), result = document.getElementById('formResult');
      const msg = document.getElementById('fMsg');

      const state = { phone: '', day: 1, month: 1, rotation: 0, spinning: false };

      /* --- טלפון בגלגל מזל --- */
      drawWheel(wheel);
      const showPhone = () => {
        const p = state.phone.padEnd(DIGITS, '_');
        display.textContent = p.slice(0, 3) + '-' + p.slice(3);
        display.setAttribute('aria-label', state.phone ? 'הטלפון עד עכשיו: ' + state.phone.split('').join(' ') : 'עוד לא נבחרו ספרות');
      };
      showPhone();
      spin.addEventListener('click', () => {
        if (state.spinning) return;
        if (state.phone.length >= DIGITS) return P.say('יש כבר עשר ספרות! מספר ארוך יותר זה כבר מספר של חללית.');
        const digit = Math.floor(Math.random() * 10);
        const current = ((state.rotation % 360) + 360) % 360;
        const target = (360 - digit * 36) % 360;
        state.rotation += (P.calm ? 0 : 360 * (3 + Math.floor(Math.random() * 3))) + ((target - current + 360) % 360);
        state.spinning = true;
        spin.disabled = true;
        P.sound('whoosh');
        wheel.style.transform = `rotate(${state.rotation}deg)`;
        setTimeout(() => {
          state.spinning = false;
          spin.disabled = false;
          state.phone += digit;
          showPhone();
          P.sound('pop');
          if (state.phone.length === 1 && digit !== 0) P.say(`${digit}? מספרי טלפון בדרך כלל מתחילים ב-0. אבל מי אני שאשפוט.`);
          else if (state.phone.length === DIGITS) P.say('מספר יפה! בטוח שהוא שלך? ...לא חשוב, הוא לא נשלח לשום מקום.');
        }, P.calm ? 50 : 2700);
      });
      back.addEventListener('click', () => {
        state.phone = state.phone.slice(0, -1);
        showPhone();
        P.say('ספרה נמחקה. הגלגל נעלב קצת.');
      });

      /* --- תאריך בשלוליות --- */
      dayP.innerHTML = PUDDLE('שלולית הימים');
      monthP.innerHTML = PUDDLE('שלולית החודשים');
      const showDate = () => { dateOut.textContent = `יום ${state.day} · חודש ${state.month} · שנה: השנה (לא היו מספיק שלוליות)`; };
      showDate();
      const splash = (btn, key, max) => {
        state[key] = state[key] % max + 1;
        showDate();
        P.sound('pop');
        btn.classList.remove('splash'); void btn.offsetWidth; btn.classList.add('splash');
        if (key === 'day' && state.day === 31 && state.month === 2) P.say('31 בפברואר? אני אוהב את האופטימיות שלך.');
      };
      dayP.addEventListener('click', () => splash(dayP, 'day', 31));
      monthP.addEventListener('click', () => splash(monthP, 'month', 12));

      /* --- הודעה --- */
      let praised = false;
      msg.addEventListener('input', () => {
        if (!praised && msg.value.length > 100) { praised = true; P.say('וואו, מכתב שלם! מעריך את זה. גם אם אף אחד לא יקרא.'); }
      });

      /* --- שליחה (לשום מקום) --- */
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (state.phone.length < DIGITS) {
          result.textContent = `חסרות ${DIGITS - state.phone.length} ספרות בטלפון. הגלגל מחכה לך! 🎡`;
          return P.say('כמעט! רק עוד כמה סיבובים בגלגל.');
        }
        const submit = form.querySelector('[type="submit"]');
        submit.disabled = true;
        submit.textContent = 'שולח...';
        setTimeout(() => {
          submit.disabled = false;
          submit.textContent = 'שלח ✉️';
          result.innerHTML = '<p class="output">✅ נשלח בהצלחה ל... שום מקום. כמו שהבטחנו: לא אספנו שום פרט. ההודעה שלך שמורה רק בלב שלנו. ❤️</p>';
          P.burstFrom(submit);
          P.say('ההודעה בדרך לשום מקום! זמן הגעה משוער: אף פעם.');
          form.dispatchEvent(new Event('pitzi:reset'));
        }, P.calm ? 100 : 1600);
      });

      form.addEventListener('pitzi:reset', () => {
        form.reset();
        state.phone = ''; state.day = 1; state.month = 1;
        showPhone(); showDate();
        praised = false;
      });
    }
  });
})();
