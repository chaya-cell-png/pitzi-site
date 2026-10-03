/* נתוני המבחן "איזה כלי מטבח אתה?" – משותפים לעמוד המבחן ולכרטיסי השיתוף ב-og/ */
(function () {
  const S = 'stroke="#1A1A1A" stroke-width="5" stroke-linejoin="round"';
  const eyes = (x1, x2, y) => [x1, x2].map(x =>
    `<circle cx="${x}" cy="${y}" r="9" fill="#fff" stroke="#1A1A1A" stroke-width="3"/><circle cx="${x + 2}" cy="${y + 1}" r="4" fill="#1A1A1A"/>`).join('');
  const smile = (x, y, w = 18) => `<path d="M${x - w / 2} ${y} q${w / 2} ${w * 0.6} ${w} 0" fill="none" stroke="#1A1A1A" stroke-width="3.5" stroke-linecap="round"/>`;
  const svg = (inner, label) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${inner}</svg>`;

  const TOOLS = {
    pan: {
      name: 'מחבת', emoji: '🍳',
      text: 'חם, יציב ותמיד במרכז העניינים. כולם מתאספים סביבך, ואתה יודע להפוך כל רעיון למשהו מוכן.',
      art: svg(`<rect x="128" y="92" width="70" height="18" rx="9" fill="#5B3A29" ${S} transform="rotate(-18 128 100)"/>
        <ellipse cx="82" cy="110" rx="70" ry="60" fill="#3A3A3A" ${S}/><ellipse cx="82" cy="108" rx="56" ry="46" fill="#555"/>
        <ellipse cx="86" cy="132" rx="30" ry="18" fill="#fff" stroke="#1A1A1A" stroke-width="3"/><circle cx="86" cy="132" r="9" fill="#FFD93D" stroke="#1A1A1A" stroke-width="3"/>
        ${eyes(66, 98, 88)}${smile(82, 104)}`, 'מחבת מחייכת עם ביצת עין')
    },
    whisk: {
      name: 'מטרפה', emoji: '🌀',
      text: 'אנרגיה בלי סוף! איפה שאתה מגיע הכל מתערבב, ובדרך כלל יוצא מזה משהו אוורירי ונהדר.',
      art: svg(`<ellipse cx="100" cy="74" rx="52" ry="64" fill="#fff" stroke="#1A1A1A" stroke-width="4"/>
        <ellipse cx="100" cy="74" rx="34" ry="64" fill="none" stroke="#1A1A1A" stroke-width="4"/>
        <ellipse cx="100" cy="74" rx="16" ry="64" fill="none" stroke="#1A1A1A" stroke-width="4"/>
        <rect x="86" y="132" width="28" height="62" rx="12" fill="#FF3B3B" ${S}/>
        ${eyes(82, 118, 66)}${smile(100, 88)}`, 'מטרפה מחייכת')
    },
    peeler: {
      name: 'קולפן', emoji: '🥕',
      text: 'אתה יודע להגיע ישר לעיקר, שכבה אחרי שכבה. חד, מדויק, ואף אחד לא מצליח להסתיר ממך כלום.',
      art: svg(`<path d="M66 102 V40 a34 34 0 0 1 68 0 V102" fill="none" ${S}/>
        <rect x="94" y="22" width="12" height="76" fill="#D9DEE3" stroke="#1A1A1A" stroke-width="3"/>
        <rect x="72" y="96" width="56" height="98" rx="18" fill="#2EC4B6" ${S}/>
        ${eyes(88, 112, 128)}${smile(100, 148)}`, 'קולפן מחייך')
    },
    ladle: {
      name: 'מצקת', emoji: '🥣',
      text: 'אתה תמיד דואג שלכולם יהיה מספיק. לב גדול, ידית ארוכה, ותמיד יש לך עוד מנה למי שצריך.',
      art: svg(`<rect x="92" y="8" width="16" height="116" rx="8" fill="#C0C7CF" ${S}/>
        <path d="M36 118 h128 a64 58 0 0 1 -128 0z" fill="#D9DEE3" ${S}/>
        ${eyes(82, 118, 138)}${smile(100, 156)}`, 'מצקת מחייכת')
    },
    colander: {
      name: 'מסננת', emoji: '🫧',
      text: 'רגוע ושלֵו. אתה יודע בדיוק מה לשמור ומה לשחרר, ושום לחץ לא נתקע אצלך.',
      art: svg(`<path d="M22 84 h156 a78 72 0 0 1 -156 0z" fill="#8E44AD" ${S}/>
        <rect x="12" y="72" width="176" height="18" rx="9" fill="#A55CC7" ${S}/>
        <g fill="#FFF8E7">${[[50, 140], [70, 150], [130, 150], [150, 140], [100, 158], [44, 112], [156, 112]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g>
        ${eyes(82, 118, 112)}${smile(100, 130)}`, 'מסננת מחייכת')
    },
    spoon: {
      name: 'כף עץ', emoji: '🥄',
      text: 'אמין, חם וקלאסי. בלעדיך שום מתכון לא מתחיל, וכולם יודעים שאפשר לסמוך עליך.',
      art: svg(`<rect x="90" y="96" width="20" height="100" rx="10" fill="#C98B4F" ${S}/>
        <ellipse cx="100" cy="60" rx="48" ry="56" fill="#D9A066" ${S}/>
        ${eyes(84, 116, 54)}${smile(100, 76)}`, 'כף עץ מחייכת')
    }
  };

  const QUESTIONS = [
    { q: 'שבת בבוקר. מה התוכנית?', a: [['קם מוקדם ועושה מיליון דברים', 'whisk'], ['מכין ארוחת בוקר לכל הבית', 'ladle'], ['נשאר במיטה עם ספר טוב', 'colander'], ['מארגן את כולם לטיול', 'pan']] },
    { q: 'מה החטיף המועדף עליך?', a: [['תפוח מקולף בדיוק מושלם', 'peeler'], ['עוגייה של סבתא', 'spoon'], ['פופקורן קופצני', 'whisk'], ['קערה גדולה של משהו לחלוק', 'ladle']] },
    { q: 'חבר מספר לך על בעיה. מה אתה עושה?', a: [['שואל שאלות עד שמגיעים לשורש', 'peeler'], ['מקשיב ונותן חיבוק', 'spoon'], ['מכין לו משהו טעים', 'ladle'], ['בונה איתו תוכנית פעולה', 'pan']] },
    { q: 'איזה כוח-על היית בוחר?', a: [['מהירות-על', 'whisk'], ['לראות דרך קירות', 'peeler'], ['להיות רגוע תמיד', 'colander'], ['לחמם כל חדר בחיוך', 'pan']] },
    { q: 'בעבודה בצוות, אתה...', a: [['המנהיג', 'pan'], ['זה שמביא כיבוד', 'ladle'], ['זה שבודק את כל הפרטים', 'peeler'], ['זה שתמיד אפשר לסמוך עליו', 'spoon']] },
    { q: 'בחר צבע:', a: [['אדום', 'pan'], ['צהוב', 'whisk'], ['טורקיז', 'colander'], ['חום עצי', 'spoon']] }
  ];

  window.QUIZ_DATA = { TOOLS, QUESTIONS };
})();
