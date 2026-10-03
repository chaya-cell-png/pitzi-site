/* גימיק 9: מחשבון מתווכח – מחזיר תשובה ואז מתווכח איתה */
(function () {
  const P = window.Pitzi;
  const ARGUE = [
    r => `${r}... אבל מי אמר?`,
    r => `${r}. לפחות זה מה שאמרו לי בבית הספר. לא בטוח שהקשבתי.`,
    r => `יצא ${r}. אני אישית מעדיף ${r + 1}. הוא יותר מעניין.`,
    r => `${r}! ...רגע, בדקתי שוב. עדיין ${r}. מעצבן.`,
    r => `התשובה היא ${r}. אבל השאלה האמיתית היא: למה?`,
    r => `${r}. המחשבון הקודם היה אומר משהו אחר. בגלל זה הוא כבר לא פה.`,
    r => `${r}. אל תספר לאף אחד שעזרתי לך.`,
    r => `${r}. אבל אם תסתכל על זה מספיק זמן, זה מתחיל להיראות כמו ברווז.`
  ];

  // מנתח תרגילים פשוט (בלי eval): מספרים, + - * / וסוגריים
  function evaluate(src) {
    const s = src.replace(/×/g, '*').replace(/÷/g, '/').replace(/\s+/g, '');
    let i = 0;
    const peek = () => s[i];
    function num() {
      const m = /^\d*\.?\d+/.exec(s.slice(i));
      if (!m) throw new Error('bad');
      i += m[0].length;
      return parseFloat(m[0]);
    }
    function factor() {
      if (peek() === '-') { i++; return -factor(); }
      if (peek() === '+') { i++; return factor(); }
      if (peek() === '(') { i++; const v = expr(); if (s[i++] !== ')') throw new Error('bad'); return v; }
      return num();
    }
    function term() {
      let v = factor();
      while (peek() === '*' || peek() === '/') { const op = s[i++]; const r = factor(); v = op === '*' ? v * r : v / r; }
      return v;
    }
    function expr() {
      let v = term();
      while (peek() === '+' || peek() === '-') { const op = s[i++]; const r = term(); v = op === '+' ? v + r : v - r; }
      return v;
    }
    if (!s) throw new Error('empty');
    const v = expr();
    if (i !== s.length) throw new Error('bad');
    return v;
  }

  P.register('calculator', {
    pages: ['tools'],
    init() {
      const input = document.getElementById('calcInput'), keys = document.getElementById('calcKeys');
      const out = document.getElementById('calcOut');
      if (!input) return;
      let pending = 0;
      ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+', 'C', '(', ')', '⌫'].forEach(k => {
        const b = P.el('button', 'btn' + (k === '=' ? ' btn-red' : /[0-9.]/.test(k) ? ' btn-white' : ''), k);
        b.type = 'button';
        b.dataset.quiet = '';
        b.setAttribute('aria-label', { '÷': 'חלקי', '×': 'כפול', '-': 'פחות', '+': 'ועוד', '=': 'שווה', C: 'נקה', '⌫': 'מחק תו' }[k] || k);
        b.addEventListener('click', () => {
          if (k === '=') return solve();
          if (k === 'C') input.value = '';
          else if (k === '⌫') input.value = input.value.slice(0, -1);
          else input.value += k;
          P.sound('beep');
        });
        keys.appendChild(b);
      });
      input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); solve(); } });

      function solve() {
        clearTimeout(pending);
        let r;
        try { r = evaluate(input.value); }
        catch (e) {
          out.textContent = input.value.trim() ? 'את זה אפילו אני לא מבין. ואני מבין הכל. בערך.' : 'אין תרגיל? אז התשובה היא שקט.';
          return;
        }
        if (!isFinite(r)) { out.textContent = 'חילוק באפס? זה לא תרגיל, זה חור שחור. אני לא נכנס לשם. 🕳️'; return; }
        r = Math.round(r * 1e8) / 1e8;
        out.textContent = `= ${r}`;
        P.sound('beep');
        pending = setTimeout(() => { out.textContent = P.rand(ARGUE)(r); }, 1100);
      }
    }
  });
})();
