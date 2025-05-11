const magentaCircles = [
  { cx: 100, cy: 40, r: 20 },
  { cx: 70, cy: 75, r: 20 },
  { cx: 130, cy: 75, r: 20 }
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
const buttonRadius = 5;
const minDistance = buttonRadius * 2 + 1;

function isFarEnough(x, y) {
  return placedButtons.every(btn => {
    const dx = btn.x - x;
    const dy = btn.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist >= minDistance;
  });
}

function createAnimatedButton(x, y, r = buttonRadius, delay = 0, label, description) {
  // Create circle
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y + r);
  circle.setAttribute("r", 0);
  circle.setAttribute("fill", "#083F67");
  circle.style.transition = "all 0.01s ease-out";
  circle.style.transitionDelay = `${delay}ms`;

  // Create text label
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
    // Reset all buttons
    document.querySelectorAll('.blue-button').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('#blue-buttons-layer text').forEach(txt => txt.style.fill = "#083F67");

    // Highlight current one
    circle.classList.add('selected');
    text.style.fill = "#EAE0C8";
  
    // Show panel
    const panel = document.getElementById('info-panel');
    document.getElementById('info-title').textContent = description;
    //document.getElementById('info-text').textContent = description;
    panel.classList.add('active');
  }

  // On click show description
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
  placedButtons.push({ x, y });

  // Animate in
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

    if (isFarEnough(x, y)) {
      const { label, description } = descriptions[placed];
      createAnimatedButton(x, y, buttonRadius, placed * 300, label, description);
      placed++;
    }

    attempts++;
  }

  if (placed < max) {
    console.warn(`Only placed ${placed} buttons after ${attempts} attempts.`);
  }
}, 4000);

// Close the panel when clicking outside of it
document.addEventListener('click', (e) => {
  const panel = document.getElementById('info-panel');
  const content = document.getElementById('info-content');
  if (
    panel.classList.contains('active') &&
    !content.contains(e.target) &&
    !e.target.closest('circle') &&
    !e.target.closest('text')
  ) {
    panel.classList.remove('active');
  }
});

// Close the panel when pressing ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('info-panel').classList.remove('active');
  }
});
