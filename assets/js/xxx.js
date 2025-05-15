

//Language switching
let currentLang = 'en';

function updateLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  const langData = translations[lang];
  document.getElementById('page-title').textContent = langData.title;
  document.getElementById('main-title').textContent = langData.title;
  document.getElementById('main-description').textContent = langData.description;

  // Redraw buttons
  recreateButtons(langData.buttons);
}

// Wire up buttons
document.querySelectorAll('#lang-switch button').forEach(btn => {
  btn.addEventListener('click', () => updateLanguage(btn.dataset.lang));
});

// Call default on load
updateLanguage('en');


/* === recreate buttons === */
function recreateButtons() {
  // Clear previous buttons
  svg.innerHTML = "";

  placedButtons.length = 0; // reset placement memory
  let placed = 0;
  let attempts = 0;

  const lang = document.documentElement.lang || 'en';
  const langData = translations[lang];
  const max = langData.buttons.length;

  while (placed < max && attempts < 1000) {
    const base = magentaCircles[Math.floor(Math.random() * magentaCircles.length)];
    const angle = Math.random() * 2 * Math.PI;
    const x = base.cx + base.r * Math.cos(angle);
    const y = base.cy + base.r * Math.sin(angle);
    const r = Math.floor(Math.random() * 3) + 5;

    if (isFarEnough(x, y, r)) {
      const { label, description } = langData.buttons[placed];
      createAnimatedButton(x, y, r, placed * 300, label, description);
      createLineForButton(x, y, r, placed * 300 + 600);
      placed++;
    }
    attempts++;
  }

  if (placed < max) {
    console.warn(`Only placed ${placed} buttons after ${attempts} attempts.`);
  }
}