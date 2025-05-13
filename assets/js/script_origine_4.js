const magentaCircles = [
  { cx: 100, cy: 50, r: 17 },
  { cx: 80, cy: 80, r: 17 },
  { cx: 120, cy: 80, r: 17 }
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

function isFarEnough(x, y, r) {
  return placedButtons.every(btn => {
    const dx = btn.x - x;
    const dy = btn.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist >= btn.r + r + 1; // sum of radii + small buffer
  });
}

function createAnimatedButton(x, y, r, delay = 0, label, description) {
  // Create circle (blue button)
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y - r * 1.5); // start above, like it's growing down
  circle.setAttribute("r", 0); // invisible at start
  circle.setAttribute("fill", "#083F67");
  circle.classList.add("blue-button");
  circle.style.transition = "all 0.6s ease-out";
  circle.style.transitionDelay = `${delay}ms`;
  circle.style.transformOrigin = "center top";
  circle.style.animation = "sway 4s ease-in-out forwards";

  // Clip-path effect to simulate hiding behind leaves
  circle.style.clipPath = "inset(25% 0% 0% 0%)"; // top 25% clipped
  //circle.setAttribute("clip-path", "url(#leafMask)");

  // Create label text
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("alignment-baseline", "middle");
  text.setAttribute("fill", "#083F67");
  text.setAttribute("font-size", "3");
  text.setAttribute("font-family", "Montserrat, serif");
  text.textContent = label;
  text.style.opacity = 0;
  text.style.transition = "opacity 0.6s ease-out, fill 0.3s ease";
  text.style.transitionDelay = `${delay + 100}ms`;

  // Activation logic
  function activateButton(circle, text, label, description) {
    document.querySelectorAll('.blue-button').forEach(btn => {
      btn.classList.remove('selected');
      //btn.setAttribute("stroke", "#0a2f4d");
    });
    document.querySelectorAll('#blue-buttons-layer text').forEach(txt => txt.setAttribute("fill", "#083F67"));
    circle.classList.add('selected');
    circle.setAttribute("stroke", "#EAE0C8");
    text.setAttribute("fill", "#EAE0C8");

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

  // Animate appearance
  setTimeout(() => {
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    text.style.opacity = 1;
  }, delay + 50);
}

// Placement loop
setTimeout(() => {
  let placed = 0;
  let attempts = 0;
  const max = descriptions.length;

  while (placed < max && attempts < 1000) {
    const base = magentaCircles[Math.floor(Math.random() * magentaCircles.length)];
    const angle = Math.random() * 2 * Math.PI;
    const x = base.cx + base.r * Math.cos(angle);
    const y = base.cy + base.r * Math.sin(angle);
    const r = Math.floor(Math.random() * 3) + 5; // radius between 5 and 10

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

// Close panel on outside click
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

// Close panel on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('info-panel').classList.remove('active');
  }
});


// Add CONTACT ME text after all blue buttons
setTimeout(() => {
  const svg = document.getElementById('blue-buttons-layer');

  const contactText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  contactText.setAttribute("x", 100);
  contactText.setAttribute("y", 185);
  contactText.setAttribute("text-anchor", "middle");
  contactText.setAttribute("alignment-baseline", "middle");
  contactText.setAttribute("fill", "#EAE0C8");
  contactText.setAttribute("font-size", "4");
  contactText.setAttribute("font-family", "Montserrat, serif");
  contactText.style.opacity = 0;
  contactText.style.cursor = "pointer";
  contactText.textContent = "Contact me";

  contactText.style.animation = "sparkle-reveal 2s ease forwards";

  contactText.addEventListener('click', () => {
    const formOverlay = document.createElement('div');
    formOverlay.id = 'contact-overlay';
    formOverlay.style.position = 'fixed';
    formOverlay.style.top = 0;
    formOverlay.style.left = 0;
    formOverlay.style.width = '100vw';
    formOverlay.style.height = '100vh';
    formOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    formOverlay.style.display = 'flex';
    formOverlay.style.justifyContent = 'center';
    formOverlay.style.alignItems = 'center';
    formOverlay.style.zIndex = 9999;

    const form = document.createElement('form');
    form.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
        <h2>Contact Me</h2>
        <label>Name:<br><input type="text" name="name" required></label><br><br>
        <label>Email:<br><input type="email" name="email" required></label><br><br>
        <label>Message:<br><textarea name="message" rows="4" required></textarea></label><br><br>
        <button type="submit">Send</button>
        <button type="button" onclick="document.getElementById('contact-overlay').remove()">Close</button>
      </div>
    `;

    formOverlay.appendChild(form);
    document.body.appendChild(formOverlay);
  });

  svg.appendChild(contactText);
}, 6000); // After blue buttons

// CSS Keyframes for sparkle animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes sparkle-reveal {
  0% { opacity: 0; filter: brightness(2); letter-spacing: 0.2em; }
  50% { opacity: 0.5; filter: brightness(3); }
  100% { opacity: 1; filter: brightness(1); letter-spacing: 0; }
}`;
document.head.appendChild(style);