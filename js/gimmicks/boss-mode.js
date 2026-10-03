/* גימיק 22: מצב בוס – Esc מחליף מיד לגיליון אלקטרוני משעמם. Esc נוסף (או לחיצה כפולה) מחזיר */
(function () {
  const P = window.Pitzi;
  const ROWS = [
    ['סעיף', 'רבעון 1', 'רבעון 2', 'רבעון 3', 'רבעון 4', 'סה"כ', 'יעד', 'סטייה'],
    ['ציוד משרדי', 1240, 1180, 1320, 1290], ['נייר מדפסת', 860, 910, 875, 930],
    ['מהדקים', 120, 95, 140, 110], ['קפה', 2300, 2450, 2610, 2780], ['חשמל', 4100, 3980, 4420, 4210],
    ['ניקיון', 1900, 1900, 1900, 1900], ['תחזוקה', 760, 1320, 640, 980], ['תוכנה', 3200, 3200, 3350, 3350],
    ['הדרכות', 1500, 0, 2100, 800], ['ריהוט', 0, 4300, 0, 650], ['טלפוניה', 980, 1010, 990, 1005],
    ['דואר', 210, 190, 260, 240], ['כיבוד', 640, 700, 820, 910], ['שונות', 330, 280, 410, 375]
  ];
  let sheet = null, savedTitle = '';

  function cell(v) { return typeof v === 'number' ? v.toLocaleString('he-IL') : v; }

  function show() {
    const cols = 'ABCDEFGHIJK'.split('');
    let body = '';
    for (let i = 0; i < 32; i++) {
      const row = ROWS[i];
      let cells = [];
      if (row && i > 0) {
        const sum = row.slice(1).reduce((a, b) => a + b, 0), goal = Math.round(sum * 1.04 / 10) * 10;
        cells = [row[0], ...row.slice(1).map(cell), cell(sum), cell(goal), cell(sum - goal)];
      } else if (row) cells = row;
      body += `<tr><th>${i + 1}</th>${cols.map((c, j) => `<td>${cells[j] != null ? cells[j] : ''}</td>`).join('')}</tr>`;
    }
    sheet = P.el('div', 'boss');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-label', 'גיליון: תקציב רבעוני. לחץ Esc כדי לחזור');
    sheet.innerHTML = `
      <div class="boss-title">תקציב_רבעוני_סופי_סופי(3).xlsx</div>
      <div class="boss-ribbon"><span>קובץ</span><span>בית</span><span>הוספה</span><span>פריסת עמוד</span><span>נוסחאות</span><span>נתונים</span><span>סקירה</span><span>תצוגה</span></div>
      <div class="boss-formula"><b>F2</b><span>=SUM(B2:E2)</span></div>
      <div class="boss-grid" tabindex="0"><table><tr><th></th>${cols.map(c => `<th>${c}</th>`).join('')}</tr>${body}</table></div>
      <div class="boss-tabs"><span>גיליון1</span><span>גיליון2</span><span>תחזית</span></div>`;
    sheet.addEventListener('dblclick', hide);
    document.body.appendChild(sheet);
    sheet.querySelector('.boss-grid').focus();
    savedTitle = document.title;
    document.title = 'תקציב_רבעוני_סופי_סופי(3).xlsx';
    P.boss = true;
  }

  function hide() {
    if (!sheet) return;
    sheet.remove();
    sheet = null;
    document.title = savedTitle;
    P.boss = false;
    P.egg('boss');
    P.say('פפפ... זה היה קרוב. הבוס הלך? אפשר להמשיך לבזבז זמן.');
  }

  P.register('boss-mode', {
    init() {
      addEventListener('keydown', e => {
        if (e.key !== 'Escape' || document.querySelector('.modal-wrap, .loader')) return;
        e.preventDefault();
        sheet ? hide() : show();
      });
    }
  });
})();
