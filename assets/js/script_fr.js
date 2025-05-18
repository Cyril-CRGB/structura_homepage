/**
 * High-Performance JavaScript Implementation
 * Optimized for Lighthouse 100 score
 */

// Data structure for magenta circles (base anchors)
const magentaCircles = [
  { cx: 100, cy: 50, r: 17 },
  { cx: 80, cy: 80, r: 17 },
  { cx: 120, cy: 80, r: 17 }
];

// Data structure for information variations
const textualvariations = [
  { label: "ia", titleX: "Science des données, ce que j'offre:", descriptionX: "Outils et perspectives en intelligence artificielle.", points: ["ML models", "Chatbots", "Vision APIs"], variation: ["fr_1", "fr_2", "fr_3"]},
  { label: "cfo", titleX: "Directeur Financier, ce que j'offre:", descriptionX:"Services financiers et de management.", points: ["Management financier", "Soutiens aux décisions stratégiques", "Actionnaires"], variation: ["fr_4", "fr_5", "fr_6"]},
  { label: "bff", titleX: "Brevet fédéral de spécialiste en finance et comptabilité, ce que j'offre:", descriptionX:"Services comptables.", points: ["Maîtrise ERP", "Clôture et Reporting mensuel/trimestriel/annuel", "Salaires et déclaration aux ass. sociales", "Taxes directes et indirectes"], variation: ["fr_7", "fr_8", "fr_9", "fr_10"]},
  { label: "data", titleX: "Gestion et analyse de données, ce que j'offre:", descriptionX:"Extraction, nettoyage et visualisation des données.", points: ["Traitement de bases de données", "Exploration & Visualisation"], variation: ["fr_11", "fr_12"]},
  { label: "web", titleX: "Dévelopeur web, ce que j'offre:", descriptionX: "Programmation et automatisation web.", points: ["Agile", "Frontend/Backend", "Déploiement/Maintenance"], variation: ["fr_13", "fr_14", "fr_15"]}
];

// Global store for button data (to avoid DOM queries)
const buttonData = [];
let activeButtonId = null;

// Main function to initialize the interactive visual - we'll invoke this at the end
function initializeVisual() {
  // Get SVG layer once and store reference
  const svg = document.getElementById('blue-buttons-layer');
  if (!svg) return;
  
  // Add single event delegation listener for all interactive elements
  svg.addEventListener('click', handleSvgClick);
  svg.addEventListener('mouseover', handleSvgHover);
  svg.addEventListener('mouseout', handleSvgHoverOut);
  
  // Set up panel close handlers once
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleEscKeyPress);
  
  // Pre-create details elements in the info panel for reuse
  prepareInfoPanel();
  
  // Generate optimized button layouts first (separate calculation from rendering)
  generateButtonLayouts().then(layoutsArray => {
    // Render buttons with staggered animation using requestAnimationFrame
    renderButtons(layoutsArray, svg);
  });
}

// Calculate button positions first, avoiding DOM manipulation during calculation
function generateButtonLayouts() {
  return new Promise(resolve => {
    // Use a web worker if complex calculations are needed
    setTimeout(() => {
      const layouts = [];
      const placedPositions = [];
      let placed = 0;
      let attempts = 0;
      const maxAttempts = 1000; // Reasonable limit to prevent infinite loops
      
      // Use truly random placement algorithm (like original)
      while (placed < textualvariations.length && attempts < maxAttempts) {
        // Randomly select a base magenta circle
        const base = magentaCircles[Math.floor(Math.random() * magentaCircles.length)];
        
        // Generate random angle around the circle
        const angle = Math.random() * 2 * Math.PI;
        
        // Place exactly on the perimeter of the magenta circle
        const x = Math.round((base.cx + base.r * Math.cos(angle)) * 10) / 10;
        const y = Math.round((base.cy + base.r * Math.sin(angle)) * 10) / 10;
        
        // Random radius between 5-8 (similar to original 5-10 range)
        const r = Math.floor(Math.random() * 3) + 5; // Exactly as in original: 5-7 range
        
        // Check if position is usable
        if (isFarEnough(x, y, r, placedPositions)) {
          layouts.push({
            id: `btn-${placed}`,
            x, 
            y, 
            r,
            variation: textualvariations[placed],
            delay: placed * 300 // Match original delay timing exactly
          });
          
          placedPositions.push({ x, y, r });
          placed++;
        }
        
        attempts++;
      }
      
      if (placed < textualvariations.length) {
        console.warn(`Only placed ${placed} buttons after ${attempts} attempts.`);
      }
      
      resolve(layouts);
    }, 1000); // Minimal timeout to avoid blocking main thread
  });
}

// Optimized collision detection
function isFarEnough(x, y, r, positions) {
  // Quick grid-based checks could be added for large sets
  return positions.every(pos => {
    const dx = pos.x - x;
    const dy = pos.y - y;
    // Skip square root for performance using squared distance
    const distSquared = dx * dx + dy * dy;
    const minDistSquared = (pos.r + r + 1) * (pos.r + r + 1);
    return distSquared >= minDistSquared;
  });
}

// Create all SVG elements with batched operations
function renderButtons(layouts, svg) {
  // Create document fragment for batch insertion
  const fragment = document.createDocumentFragment();
  
  // Create all elements first, without adding to DOM
  layouts.forEach(layout => {
    const {id, x, y, r, variation, delay} = layout;
    const {label, titleX, descriptionX, points, variation: varPoints} = variation;
    
    // Create elements
    const circle = createCircleElement(id, x, y, r, delay);
    const line = createLineElement(id, x, y, r, delay);
    const text = createTextElement(id, x, y, label, delay);
    
    // Store data for event handling (avoiding DOM queries later)
    buttonData.push({
      id,
      x, y, r,
      circleEl: circle,
      textEl: text,
      lineEl: line,
      label, 
      titleX, 
      descriptionX, 
      points, 
      variation: varPoints,
      isActive: false
    });
    
    // Add to fragment (not DOM yet)
    fragment.appendChild(circle);
    fragment.appendChild(line);
    fragment.appendChild(text);
  });
  
  // Batch append all elements to DOM
  svg.appendChild(fragment);
  
  // Trigger staggered animations with requestAnimationFrame
  requestAnimationFrame(() => {
    buttonData.forEach((btn, index) => {
      setTimeout(() => {
        const circle = btn.circleEl;
        const line = btn.lineEl;
        const text = btn.textEl;
        
        // Apply attribute changes in a batch
        circle.setAttribute("cy", btn.y);
        circle.setAttribute("r", btn.r);
        circle.classList.add("animate-in");
        
        setTimeout(() => {
          text.style.opacity = "1";
          setTimeout(() => {
            line.style.opacity = "1";
          }, 100);
        }, 100);
      }, btn.delay);
    });
  });
}

// Factory functions for SVG elements
function createCircleElement(id, x, y, r, delay) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("data-id", id);
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y - r * 1.5); // Start position for animation
  circle.setAttribute("r", 0);
  circle.setAttribute("fill", "#083F67");
  circle.setAttribute("stroke", "#0a2f4d");
  circle.setAttribute("stroke-width", "0.5");
  circle.setAttribute("clip-path", "inset(25% 0% 0% 0%)");
  circle.classList.add("blue-button");
  circle.style.cursor = "pointer";
  return circle;
}

function createLineElement(id, x, y, r, delay) {
  const clippedTopY = y - r * 0.56;
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("data-id", id);
  line.setAttribute("x1", x - r - 1);
  line.setAttribute("x2", x + r + 1);
  line.setAttribute("y1", clippedTopY);
  line.setAttribute("y2", clippedTopY);
  line.setAttribute("stroke", "#083F67");
  line.setAttribute("stroke-width", "0.7");
  line.style.opacity = "0";
  line.style.transition = "opacity 0.3s ease-in-out";
  return line;
}

function createTextElement(id, x, y, label, delay) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("data-id", id);
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("alignment-baseline", "middle");
  text.setAttribute("fill", "#083F67");
  text.setAttribute("font-size", "3");
  text.setAttribute("font-family", "Montserrat, serif");
  text.textContent = label;
  text.style.opacity = "0";
  text.style.transition = "opacity 1s ease-out";
  text.style.cursor = "pointer";
  text.style.pointerEvents = "auto";
  return text;
}

// Event delegation handlers
function handleSvgClick(e) {
  const element = e.target;
  const id = element.getAttribute('data-id');
  
  if (id) {
    e.stopPropagation();
    const buttonInfo = buttonData.find(btn => btn.id === id);
    if (buttonInfo) {
      activateButton(buttonInfo);
    }
  }
}

function handleSvgHover(e) {
  const element = e.target;
  const id = element.getAttribute('data-id');
  
  if (id && id !== activeButtonId) {
    const buttonInfo = buttonData.find(btn => btn.id === id);
    if (buttonInfo) {
      buttonInfo.circleEl.style.stroke = '#EAE0C8';
      buttonInfo.textEl.setAttribute('fill', '#EAE0C8');
      buttonInfo.textEl.setAttribute('font-weight', 'bold');
    }
  }
}

function handleSvgHoverOut(e) {
  const element = e.target;
  const id = element.getAttribute('data-id');
  
  if (id && id !== activeButtonId) {
    const buttonInfo = buttonData.find(btn => btn.id === id);
    if (buttonInfo) {
      buttonInfo.circleEl.style.stroke = '#0a2f4d';
      buttonInfo.textEl.setAttribute('fill', '#083F67');
      buttonInfo.textEl.setAttribute('font-weight', 'normal');
    }
  }
}

// Info panel management
function prepareInfoPanel() {
  const infoCorpus = document.getElementById('info-corpus');
  if (!infoCorpus) return;
  
  // Clear existing content
  infoCorpus.innerHTML = '';
  
  // Find maximum number of points needed
  const maxPoints = Math.max(...textualvariations.map(v => v.points ? v.points.length : 0));
  
  // Pre-create details elements for reuse
  for (let i = 0; i < maxPoints; i++) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const content = document.createElement('div');
    details.appendChild(summary);
    details.appendChild(content);
    details.style.display = 'none';
    details.setAttribute('data-index', i);
    
    // Optimize details toggling
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = details.hasAttribute('open');
      
      // Close all other details
      document.querySelectorAll('#info-corpus details[open]').forEach(d => {
        if (d !== details) d.removeAttribute('open');
      });
      
      // Toggle current details
      if (isOpen) {
        details.removeAttribute('open');
      } else {
        details.setAttribute('open', '');
      }
    });
    
    infoCorpus.appendChild(details);
  }
}

function activateButton(buttonInfo) {
  // Reset previous active button
  resetAllButtons();
  
  // Set new active button
  activeButtonId = buttonInfo.id;
  buttonInfo.isActive = true;
  buttonInfo.circleEl.style.stroke = '#EAE0C8';
  buttonInfo.textEl.setAttribute('fill', '#EAE0C8');
  buttonInfo.textEl.setAttribute('font-weight', 'bold');
  
  // Update panel content
  const panel = document.getElementById('info-panel');
  document.getElementById('info-title').textContent = buttonInfo.titleX;
  document.getElementById('info-description').textContent = buttonInfo.descriptionX;
  
  // Update details content efficiently
  const allDetails = document.querySelectorAll('#info-corpus details');
  allDetails.forEach((details, i) => {
    const hasContent = buttonInfo.points && i < buttonInfo.points.length;
    
    if (hasContent) {
      const summary = details.querySelector('summary');
      const content = details.querySelector('div');
      
      summary.textContent = buttonInfo.points[i];
      content.textContent = buttonInfo.variation[i];
      details.style.display = '';
    } else {
      details.style.display = 'none';
    }
  });
  
  // Show panel
  panel.classList.add('active');
}

function resetAllButtons() {
  // Only update changed properties
  if (activeButtonId) {
    buttonData.forEach(btn => {
      if (btn.isActive) {
        btn.circleEl.style.stroke = '#0a2f4d';
        btn.textEl.setAttribute('fill', '#083F67');
        btn.textEl.setAttribute('font-weight', 'normal');
        btn.isActive = false;
      }
    });
    activeButtonId = null;
  }
}

// Panel close handlers
function handleOutsideClick(e) {
  const panel = document.getElementById('info-panel');
  const content = document.getElementById('info-content');
  
  if (panel.classList.contains('active') && 
      !content.contains(e.target) && 
      !e.target.closest('circle') &&
      !e.target.closest('text')) {
    panel.classList.remove('active');
    resetAllButtons();
  }
}

function handleEscKeyPress(e) {
  if (e.key === 'Escape') {
    document.getElementById('info-panel').classList.remove('active');
    resetAllButtons();
  }
}

// Add CSS to document head for optimized animations
function addOptimizedStyles() {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .blue-button {
      transition: r 0.6s ease-out, cy 0.6s ease-out;
      will-change: transform, r, cy;
    }
    #blue-buttons-layer text {
      will-change: opacity, fill;
    }
  `;
  document.head.appendChild(styleSheet);
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    addOptimizedStyles();
    initializeVisual();
  });
} else {
  addOptimizedStyles();
  initializeVisual();
}

// Optimized contact form and language switcher implementation
document.addEventListener('DOMContentLoaded', () => {
  // Wait for SVG to be ready before adding elements
  const addSvgElements = () => {
    const svg = document.getElementById('blue-buttons-layer');
    if (!svg) {
      // If SVG isn't ready yet, try again in 100ms
      setTimeout(addSvgElements, 100);
      return;
    }

    // Create document fragment to batch DOM operations
    const fragment = document.createDocumentFragment();
    const svgNS = "http://www.w3.org/2000/svg";
    const xlinkNS = "http://www.w3.org/1999/xlink";
    
    // Common SVG text element properties - reduces repetition
    const createSvgText = (x, y, content) => {
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("alignment-baseline", "middle");
      text.setAttribute("fill", "#083F67");
      text.setAttribute("font-size", "4");
      text.setAttribute("font-family", "Montserrat, serif");
      text.style.cursor = "pointer";
      text.textContent = content;
      return text;
    };

    // Contact text with event delegation
    const contactText = createSvgText(100, 180, "Que puis-je pour vous?");
    contactText.dataset.action = "contact";
    fragment.appendChild(contactText);

    // Language switcher
    const currentLang = document.documentElement.lang || 'en';
    const langs = ['de ', 'fr ', 'en '];
    
    langs.forEach((code, i) => {
      const langText = createSvgText(48 + i * 6, 180, code);
      langText.dataset.lang = code.trim();
      
      // Underline the current language
      if (code.trim() === currentLang) {
        langText.setAttribute("text-decoration", "underline");
      }
      
      fragment.appendChild(langText);
    });

    // LinkedIn logo - preload image for better performance
    const linkedInImage = document.createElementNS(svgNS, "image");
    linkedInImage.setAttributeNS(xlinkNS, "href", "assets/images/LI-Logo.png");
    linkedInImage.setAttribute("x", 134);
    linkedInImage.setAttribute("y", 169.5);
    linkedInImage.setAttribute("width", 20);
    linkedInImage.setAttribute("height", 20);
    linkedInImage.style.cursor = "pointer";
    linkedInImage.dataset.action = "linkedin";
    
    // Add all elements to SVG at once
    fragment.appendChild(linkedInImage);
    svg.appendChild(fragment);
    
    // Event delegation - more efficient than individual event listeners
    svg.addEventListener('click', handleSvgClicks);
  };

  // Start the process
  addSvgElements();
  
  // Preload LinkedIn image
  const preloadImage = new Image();
  preloadImage.src = "assets/images/LI-Logo.png";
  
  // Event delegation handler
  function handleSvgClicks(e) {
    const target = e.target;
    
    // Handle contact form
    if (target.dataset.action === 'contact' || 
        (target.parentNode && target.parentNode.dataset.action === 'contact')) {
      showContactForm();
    }
    
    // Handle LinkedIn click
    else if (target.dataset.action === 'linkedin' || 
             (target.parentNode && target.parentNode.dataset.action === 'linkedin')) {
      window.open("https://www.linkedin.com/in/cyril-bromberger-04317658/?locale=en_US", "_blank");
    }
    
    // Handle language switch
    else if (target.dataset.lang) {
      const lang = target.dataset.lang;
      switch(lang) {
        case 'de':
          window.location.href = 'de.html';
          break;
        case 'fr':
          window.location.href = 'fr.html';
          break;
        case 'en':
          window.location.href = 'index.html';
          break;
      }
    }
  }
  
  // Contact form creation - moved to separate function
  function showContactForm() {
    // Create form elements
    const formOverlay = document.createElement('div');
    formOverlay.id = 'contact-overlay';
    
    // Use CSS classes instead of inline styles for better performance
    formOverlay.className = 'contact-overlay';
    
    // Create form with better performance practices
    const form = document.createElement('form');
    form.setAttribute('action', 'https://formspree.io/f/xwpoyara');
    form.setAttribute('method', 'POST');
    form.className = 'contact-form';
    
    // Use template literal once instead of multiple DOM operations
    form.innerHTML = `
      <div class="form-container">
        <h2>De quoi avez-vous besoin?</h2><br>
        <div class="form-field">
          <label for="name">Nom:</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-field">
          <label for="email">Courriel:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-field">
          <label for="message">Message:</label>
          <textarea id="message" name="message" rows="4" required></textarea>
        </div>
        <div class="form-actions">
          <button type="submit">Envoyer</button>
          <button type="button" class="close-form">Fermer</button>
        </div>
      </div>
    `;
    
    // Handle submit event
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // prevent default form behavior
      const formData = new FormData(form);

      // Send form data using Fetch
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json'
          }
        });

        // Replace form content with thank you message
        form.innerHTML = `
          <div class="form-container">
            <p>Merci de m’avoir contacté!</p>
            <p>Je répondrai dans les 2 heures.</p>
            <p>À bientôt.</p>
            <div class="form-actions">
              <button type="button" class="close-form">Fermer</button>
            </div>
          </div>
        `;
      } catch (error) {
        form.innerHTML = `
          <div class="form-container">
            <p>Une erreur s'est produite. S’il vous plaît réessayez plus tard.</p>
            <div class="form-actions">
              <button type="button" class="close-form">Fermer</button>
            </div>
          </div>
        `;
      }
    });

    // Attach close handler with event delegation
    form.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-form')) {
        document.getElementById('contact-overlay').remove();
      }
    });
    
    // Append to DOM only once
    formOverlay.appendChild(form);
    document.body.appendChild(formOverlay);
    
    // Focus on first field for better UX
    setTimeout(() => document.getElementById('name').focus(), 100);
  }
});
