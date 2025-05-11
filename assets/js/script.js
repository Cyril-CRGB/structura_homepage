const magentaCircles = [
    { cx: 100, cy: 40, r: 20 },
    { cx: 70, cy: 75, r: 20 },
    { cx: 130, cy: 75, r: 20 }
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
  
  function createAnimatedButton(x, y, r = buttonRadius, delay = 0) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y + r); // start slightly lower for upward growth
    circle.setAttribute("r", 0);      // start with radius 0 (grows to r)
    circle.setAttribute("fill", "#083F67");
    circle.style.transition = "all 0.6s ease-out";
    circle.style.transitionDelay = `${delay}ms`;
  
    svg.appendChild(circle);
    placedButtons.push({ x, y });
  
    // trigger growth after next tick
    setTimeout(() => {
      circle.setAttribute("cy", y);
      circle.setAttribute("r", r);
    }, delay + 50);
  }
  
  // Delay until all other animations are done (~5s + 3s + buffer = 9000ms)
  setTimeout(() => {
    let placed = 0;
    let attempts = 0;
    const max = 5;
  
    while (placed < max && attempts < 1000) {
      const base = magentaCircles[Math.floor(Math.random() * magentaCircles.length)];
      const angle = Math.random() * 2 * Math.PI;
      const x = base.cx + base.r * Math.cos(angle);
      const y = base.cy + base.r * Math.sin(angle);
  
      if (isFarEnough(x, y)) {
        createAnimatedButton(x, y, buttonRadius, placed * 400); // delay each growth
        placed++;
      }
  
      attempts++;
    }
  
    if (placed < max) {
      console.warn(`Only placed ${placed} buttons after ${attempts} attempts.`);
    }
  }, 9000); // <-- Start after 9 seconds