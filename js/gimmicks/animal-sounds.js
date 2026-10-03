/* גימיק 19: צלילי חיות – כל כפתור משמיע קול של חיה אחרת (והקול מופיע גם כבועה) */
(function () {
  const P = window.Pitzi;
  const ANIMALS = [
    ['moo', '🐄 מוּ!'], ['meow', '🐱 מיאו!'], ['woof', '🐶 הב הב!'], ['quack', '🦆 גה גה!'],
    ['baa', '🐑 מֶה!'], ['ribbit', '🐸 קְוָוה!'], ['tweet', '🐦 ציוץ!']
  ];
  let turn = Math.floor(Math.random() * ANIMALS.length);

  function onClick(e) {
    const btn = e.target.closest('button, .btn');
    if (!btn || btn.hasAttribute('data-quiet') || btn.closest('.boss, .pz-body')) return;
    const [sound, label] = ANIMALS[turn++ % ANIMALS.length];
    P.sound(sound);
    const r = btn.getBoundingClientRect();
    const pop = P.el('div', 'animal-pop');
    pop.textContent = label;
    pop.setAttribute('aria-hidden', 'true');
    pop.style.left = (e.clientX || r.left + r.width / 2) + 'px';
    pop.style.top = ((e.clientY || r.top) - 10) + 'px';
    pop.addEventListener('animationend', () => pop.remove());
    document.body.appendChild(pop);
  }

  P.register('animal-sounds', {
    motion: true,
    enable() { document.addEventListener('click', onClick); },
    disable() { document.removeEventListener('click', onClick); }
  });
})();
