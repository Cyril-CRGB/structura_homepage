const magentaCircles = [
  { cx: 100, cy: 50, r: 17 },
  { cx: 75, cy: 80, r: 17 },
  { cx: 125, cy: 80, r: 17 }
];

const descriptions = [
  { label: "ai", description: "Artificial Intelligence tools and insights." },
  { label: "dr", description: "Director ad interim and Board member." },
  { label: "fi/ac", description: "Finance and Accounting services." },
  { label: "data", description: "Data extraction, cleaning, and visualization tools." },
  { label: "web", description: "Web development and automation solutions." }
];

const svg = document.getElementById('blue-buttons-layer');
const placedButtons = [];
const minDistance = 11; // Approximate minimum separation (adjust as needed)

function isFarEnough(x, y, r) {
  return placedButtons.every(btn => {
    const dx = btn.x - x;
    const dy = btn.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist >= btn.r + r + 1; // sum of radii + buffer
  });
}

function createAnimatedButton(x, y, r, delay = 0, label, description) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y + r);
  circle.setAttribute("r", 0);
  circle.setAttribute("fill", "#083F67");
  circle.style.transition = "all 0.01s ease-out";
  circle.style.transitionDelay = `${delay}ms`;

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("alignment-baseline", "middle");
  text.setAttribute("fill", "#EAE0C8");
  text.setAttribute("font-size", "3");
  text.setAttribute("font-family", "Montserrat, serif");
  text.textContent = label;
  text.style.opacity = 0;
  text.style.transition = "opacity 0.01s ease-out";
  text.style.transitionDelay = `${delay + 1}ms`;

  function activateButton(circle, text, label, description) {
    document.querySelectorAll('.blue-button').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('#blue-buttons-layer text').forEach(txt => txt.style.fill = "#083F67");

    circle.classList.add('selected');
    text.style.fill = "#EAE0C8";

    const panel = document.getElementById('info-panel');
    document.getElementById('info-title').textContent = label;
    document.getElementById('info-text').textContent = description;
    panel.classList.add('active');
  }

  circle.addEventListener('click', () => activateButton(circle, text, label, description));
  text.addEventListener('click', () => activateButton(circle, text, label, description));

  circle.addEventListener('mouseenter', () => {
    if (!circle.classList.contains('selected')) text.style.fill = "#EAE0C8";
  });
  circle.addEventListener('mouseleave', () => {
    if (!circle.classList.contains('selected')) text.style.fill = "#083F67";
  });
  text.addEventListener('mouseenter', () => {
    if (!circle.classList.contains('selected')) text.style.fill = "#EAE0C8";
  });
  text.addEventListener('mouseleave', () => {
    if (!circle.classList.contains('selected')) text.style.fill = "#083F67";
  });

  svg.appendChild(circle);
  svg.appendChild(text);
  placedButtons.push({ x, y, r });

  setTimeout(() => {
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    text.style.opacity = 1;
  }, delay + 50);
}

setTimeout(() => {
  let placed = 0;
  let attempts = 0;
  const max = descriptions.length;

  while (placed < max && attempts < 1000) {
    const base = magentaCircles[Math.floor(Math.random() * magentaCircles.length)];
    const angle = Math.random() * 2 * Math.PI;
    const x = base.cx + base.r * Math.cos(angle);
    const y = base.cy + base.r * Math.sin(angle);
    const r = Math.floor(Math.random() * 3) + 5; // radius 5 to 10

    if (isFarEnough(x, y, r)) {
      const { label, description } = descriptions[placed];
      createAnimatedButton(x, y, r, placed * 300, label, description);
      placed++;
    }

    attempts++;
  }

  if (placed < max) {
    console.warn(`Only placed ${placed} buttons after ${attempts} attempts.`);
  }
}, 3000);

// Close the panel when clicking outside of it
document.addEventListener('click', (e) => {
  const panel = document.getElementById('info-panel');
  const content = document.getElementById('info-content');
  if (panel.classList.contains('active') && !content.contains(e.target) && !e.target.closest('circle') && !e.target.closest('text')) {
    panel.classList.remove('active');
  }
});

// Close the panel when pressing ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('info-panel').classList.remove('active');
  }
});
