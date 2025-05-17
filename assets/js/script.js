const magentaCircles = [
  { cx: 100, cy: 50, r: 17 },
  { cx: 80, cy: 80, r: 17 },
  { cx: 120, cy: 80, r: 17 }
];

const textualvariations = [
  { label: "ai", titleX: "Data science, what I offer:", descriptionX: "Artificial Intelligence tools and insights.", points: ["ML models", "Chatbots", "Vision APIs"], variation: ["1", "2", "3"]},
  { label: "cfo", titleX: "Chief Financial Officer, what I offer:", descriptionX:"Finance and Management services", points: ["Financial Management", "Strategic Decision Support", "Stakeholder"], variation: ["4", "5", "6"]},
  { label: "cpa", titleX: "Certified Public Accountant, what I offer:", descriptionX:"Accounting services.", points: ["ERP proficiency", "Year/Quartal/Monthly end closing", "Payroll and social insurances declaration", "Direct & Indirect Taxes"], variation: ["7", "8", "9", "10"]},
  { label: "data", titleX: "Data engineering & analysis, what I offer:", descriptionX:"Data extraction, cleaning and visualization.", points: ["Database Processing", "Exploration & Visualization"], variation: ["11", "12"]},
  { label: "web", titleX: "Web Developer, what I offer:", descriptionX: "Web programmation and automation.", points: ["Agile", "Frontend/Backend", "Deployment/Maintenance"], variation: ["13", "14", "15"]}
];

const svg = document.getElementById('blue-buttons-layer');
const placedButtons = [];
let activeCircle = null;

function isFarEnough(x, y, r) {
  return placedButtons.every(btn => {
    const dx = btn.x - x;
    const dy = btn.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist >= btn.r + r + 1; // sum of radii + small buffer
  });
}

function createAnimatedButton(x, y, r, delay = 0, label, titleX, descriptionX, points = [], variation = []) {
  // Create circle (blue button)
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y - r * 1.5); // start above, like it's growing down
  circle.setAttribute("r", 0); // invisible at start
  circle.setAttribute("fill", "#083F67");
  circle.setAttribute("stroke", "#0a2f4d");
  circle.setAttribute("stroke-width", "0.5");
  circle.classList.add("blue-button");
  circle.style.transition = "all 0.6s ease-out";
  circle.style.transitionDelay = `${delay+100}ms`;
  circle.style.transformOrigin = "center top";
  circle.style.animation = "sway 4s ease-in-out forwards";

  // Clip-path effect to simulate hiding behind leaves
  circle.style.clipPath = "inset(25% 0% 0% 0%)"; // top 25% clipped
  //circle.setAttribute("clip-path", "url(#leafMask)");
  
  svg.appendChild(circle);
  placedButtons.push({ x, y, r });

  // Animate circle and draw line
  setTimeout(() => {
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    createLineForButton(x, y, r, delay + 3600); 
  }, delay + 50);

  return circle;
}

// Add horizontal blue line just above the circle
function createLineForButton(x, y, r, delay = 0) {
  const clippedTopY = y - r * 0.58;

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x - r - 1);
  line.setAttribute("x2", x + r + 1);
  line.setAttribute("y1", clippedTopY);
  line.setAttribute("y2", clippedTopY);
  line.setAttribute("stroke", "#083F67");
  line.setAttribute("stroke-width", "0.7");
  line.style.opacity = 0;
  //line.style.transition = "opacity 0.3s ease";
  line.style.transition = "opacity 0.3s ease-in-out";

  svg.appendChild(line);

  // Animate appearance after delay
  setTimeout(() => {
    line.style.opacity = 1;
  }, delay);
}

// Create label text
function createAnimatedText(x, y, delay, label, titleX, descriptionX, points, variation, circle) {
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
  text.style.transition = "opacity 0.01s ease-out";//, fill 0.01s ease";
  text.style.transitionDelay = `${delay + 1000}ms`;
  text.style.pointerEvents = "all";

  circle.addEventListener('click', () => activateButton(circle, text, label, titleX, descriptionX, points, variation));
  text.addEventListener('click', () => activateButton(circle, text, label, titleX, descriptionX, points, variation));

  addHoverBehavior(circle, text);

  svg.appendChild(text);

  setTimeout(() => {
    text.style.opacity = 1;
  }, delay + 50);
}

function activateButton(circle, text, label, titleX, descriptionX, points = [], variation = []) {
  activeCircle = circle;
  resetAllBlueButtons();
  circle.style.stroke = '#EAE0C8';
  text.setAttribute('fill', '#EAE0C8');
  text.setAttribute('font-weight', 'bold');

  const panel = document.getElementById('info-panel');
  document.getElementById('info-title').textContent = titleX;
  document.getElementById('info-description').textContent = descriptionX;

  // Handle multi-point textualvariations with expandable blocks
  const infoCorpus = document.getElementById('info-corpus');
  infoCorpus.innerHTML = '';
  if (Array.isArray(points) && Array.isArray(variation)) {
    points.forEach((pt, i) => {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = pt;
      const content = document.createElement('div');
      content.textContent = variation[i];
      // Ensure only one <details> is open at a time
      summary.addEventListener("click", () => {
        // Close all other <details> in the panel
        const allDetails = infoCorpus.querySelectorAll("details");
        allDetails.forEach(d => {
          if (d !== details) {
            d.removeAttribute("open");
          }
        });
      });
      details.appendChild(summary);
      details.appendChild(content);
      infoCorpus.appendChild(details);
    });
  } else {
    infoCorpus.textContent = points;
  }

  panel.classList.add('active');
}

function addHoverBehavior(circle, text) {
  let originalTransition;

  const hoverIn = () => {
    originalTransition = circle.style.transition;
    circle.style.transition = "none";

    circle.style.stroke = '#EAE0C8';
    text.setAttribute('fill', '#EAE0C8');
    text.setAttribute('font-weight', 'bold');

    requestAnimationFrame(() => {
      circle.style.transition = originalTransition;
    });
  };

  const hoverOut = () => {
    const panel = document.getElementById('info-panel');
    if (panel.classList.contains('active') && activeCircle === circle) return;

    circle.style.stroke = '#0a2f4d';
    text.setAttribute('fill', '#083F67');
    text.setAttribute('font-weight', 'normal');
  };
  requestAnimationFrame(() => {
    circle.style.transition = originalTransition;
  });
  circle.addEventListener('mouseenter', hoverIn);
  circle.addEventListener('mouseleave', hoverOut);
  text.addEventListener('mouseenter', hoverIn);
  text.addEventListener('mouseleave', hoverOut);
}


// Placement loop
setTimeout(() => {
  let placed = 0;
  let attempts = 0;
  const max = textualvariations.length;

  while (placed < max && attempts < 1000) {
    const base = magentaCircles[Math.floor(Math.random() * magentaCircles.length)];
    const angle = Math.random() * 2 * Math.PI;
    const x = base.cx + base.r * Math.cos(angle);
    const y = base.cy + base.r * Math.sin(angle);
    const r = Math.floor(Math.random() * 3) + 5; // radius between 5 and 10

    if (isFarEnough(x, y, r)) {
      const { label, titleX, descriptionX, points, variation } = textualvariations[placed];
      const circle = createAnimatedButton(x, y, r, placed * 300, label, titleX, descriptionX, points, variation);
      createAnimatedText(x, y, placed * 300, label, titleX, descriptionX, points, variation, circle);
      placed++;
    }
    attempts++;
  }

  if (placed < max) {
    console.warn(`Only placed ${placed} buttons after ${attempts} attempts.`);
  }
}, 3000);

function resetAllBlueButtons() {
  document.querySelectorAll('#blue-buttons-layer circle').forEach(c => c.style.stroke = '#0a2f4d');
  document.querySelectorAll('#blue-buttons-layer text').forEach(t => {
    t.setAttribute('fill', '#083F67');
    t.setAttribute('font-weight', 'normal');
  });
}

// Close the panel when clicking outside of it
document.addEventListener('click', (e) => {
  const panel = document.getElementById('info-panel');
  const content = document.getElementById('info-content');
  if (panel.classList.contains('active') && !content.contains(e.target) && !e.target.closest('circle')) {
    panel.classList.remove('active');
    activeCircle = null;
    resetAllBlueButtons();
  }
});

// Close the panel when pressing ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('info-panel').classList.remove('active');
    activeCircle = null;
    resetAllBlueButtons();
  }
});


// Add CONTACT US and form popup
setTimeout(() => {
  const svg = document.getElementById('blue-buttons-layer');
  // Contact text
  const contactText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  contactText.setAttribute("x", 100);
  contactText.setAttribute("y", 180);
  contactText.setAttribute("text-anchor", "middle");
  contactText.setAttribute("alignment-baseline", "middle");
  contactText.setAttribute("fill", "#083F67");
  contactText.setAttribute("font-size", "4");
  contactText.setAttribute("font-family", "Montserrat, serif");
  contactText.style.opacity = 1;
  contactText.style.cursor = "pointer";
  contactText.textContent = "contact me";

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
    form.setAttribute('action', 'https://formspree.io/f/xwpoyara');
    form.setAttribute('method', 'POST');
    form.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.3); min-width: 280px;">
        <h2 style="margin-top: 0;">contact me</h2><br>
        <label>Name:<br><input type="text" name="name" required style="width: 100%;"></label><br><br>
        <label>Email:<br><input type="email" name="email" required style="width: 100%;"></label><br><br>
        <label>Message:<br><textarea name="message" rows="4" required style="width: 100%;"></textarea></label><br><br>
        <div style="display: flex; justify-content: space-between; gap: 1rem;">
          <button type="submit" style="padding: 0.4rem 1.2rem; font-size: 1rem;">Send</button>
          <button type="button" onclick="document.getElementById('contact-overlay').remove()" style="padding: 0.4rem 1.2rem; font-size: 1rem;">Close</button>
        </div>
      </div>
    `;

    formOverlay.appendChild(form);
    document.body.appendChild(formOverlay);
  });

  svg.appendChild(contactText);

  // Language switcher
  const currentLang = document.documentElement.lang || 'en';
  const langs = ['de ', 'fr ', 'en '];
  langs.forEach((code, i) => {
    const langText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    langText.setAttribute("x", 48 + i * 6); // space out horizontally
    langText.setAttribute("y", 180);
    langText.setAttribute("text-anchor", "middle");
    langText.setAttribute("alignment-baseline", "middle");
    langText.setAttribute("fill", "#083F67");
    langText.setAttribute("font-size", "4");
    langText.setAttribute("font-family", "Montserrat, serif");
    langText.style.cursor = "pointer";
    langText.textContent = code;
  
    // Underline the current language
    if (code === currentLang) {
      langText.setAttribute("text-decoration", "underline");
    }
  
    // On click, redirect to corresponding static page
    langText.addEventListener("click", () => {
      if (code === 'de ') {
        window.location.href = 'de.html';
      } else if (code === 'fr ') {
        window.location.href = 'fr.html';
      } else {
        window.location.href = 'index.html';
      }
    });
  
    svg.appendChild(langText);
  });

  // LinkedIn logo
    const linkedInImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
    linkedInImage.setAttributeNS("http://www.w3.org/1999/xlink", "href", "assets/images/LI-Logo.png");
    linkedInImage.setAttribute("x", 134);        // Adjust X to align with "Contact us"
    linkedInImage.setAttribute("y", 169.5);        // Adjust Y to match vertical alignment
    linkedInImage.setAttribute("width", 20);     // Responsive within SVG viewBox (200x200)
    linkedInImage.setAttribute("height", 20);
    linkedInImage.style.cursor = "pointer";

    linkedInImage.addEventListener("click", () => {
      window.open("https://www.linkedin.com/in/cyril-bromberger-04317658/?locale=en_US", "_blank");
    });

    svg.appendChild(linkedInImage);
}, 6000);
