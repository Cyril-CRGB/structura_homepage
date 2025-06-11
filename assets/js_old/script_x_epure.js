const magentaCircles = [
  { cx: 100, cy: 50, r: 17 },
  { cx: 80, cy: 80, r: 17 },
  { cx: 120, cy: 80, r: 17 }
];

// Global store for button data (to avoid DOM queries)
const buttonData = [];
let activeButtonId = null;

// Main function to initialize the interactive visual - we'll invoke this at the end
function initializeVisual() {
  const svg = document.getElementById('blue-buttons-layer'); 
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
      const maxAttempts = 100; // Reasonable limit to prevent infinite loops
      
      // Use truly random placement algorithm (like original)
      while (placed < 5 && attempts < maxAttempts) {
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
            delay: placed * 300 // Match original delay timing exactly
          });
          
          placedPositions.push({ x, y, r });
          placed++;
        }
        
        attempts++;
      }
      
      if (placed < 5) {
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
    const {id, x, y, r, delay} = layout;
    
    // Create elements
    const circle = createCircleElement(id, x, y, r, delay);
    const line = createLineElement(id, x, y, r, delay);
    
    // Store data for event handling (avoiding DOM queries later)
    buttonData.push({
      id,
      x, y, r,
      circleEl: circle,
      lineEl: line,
    });
    
    // Add to fragment (not DOM yet)
    fragment.appendChild(circle);
    fragment.appendChild(line);
  });
  
  // Batch append all elements to DOM
  svg.appendChild(fragment);
  
  // Trigger staggered animations with requestAnimationFrame
  requestAnimationFrame(() => {
    buttonData.forEach((btn, index) => {
      setTimeout(() => {
        const circle = btn.circleEl;
        const line = btn.lineEl;
        
        // Apply attribute changes in a batch
        circle.setAttribute("cy", btn.y);
        circle.setAttribute("r", btn.r);
        circle.classList.add("animate-in");
        
        setTimeout(() => {
          line.style.opacity = "1";
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
  // circle.setAttribute("fill", "magenta");
  circle.setAttribute("stroke", "#0a2f4d");
  circle.setAttribute("stroke-width", "0.2");
  circle.setAttribute("clip-path", "inset(25% 0% 0% 0%)");
  circle.classList.add("blue-button");
  // circle.style.cursor = "pointer";
  return circle;
}

function createLineElement(id, x, y, r, delay) {
  const clippedTopY = y - r * 0.53;
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("data-id", id);
  line.setAttribute("x1", x - r - 1);
  line.setAttribute("x2", x + r + 1);
  line.setAttribute("y1", clippedTopY);
  line.setAttribute("y2", clippedTopY);
  line.setAttribute("stroke", "#0a2f4d");
  line.setAttribute("stroke-width", "0.2");
  line.style.opacity = "0";
  line.style.transition = "opacity 0.3s ease-in-out";
  return line;
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
