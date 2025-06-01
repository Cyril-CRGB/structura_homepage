// Enhanced JavaScript functionality for better performance and Lighthouse scores

// --- Constants and Cached DOM Elements ---
const DURATION_MEDIUM = 300; // Consistent duration for animations/timeouts
const SCROLL_THRESHOLD_HEADER = 100;
const SCROLL_THRESHOLD_BACK_TO_TOP = 500;

// Get elements once DOM is ready to avoid repeated queries
let mobileMenuBtn, mobileMenu, menuIcon, scrollIndicator, header, backToTopBtn, contactForm;
let desktopLanguageDropdownBtn, mobileLanguageDropdownBtn, desktopLanguageDropdownMenu, mobileLanguageDropdownMenu;

// Global store for button data (to avoid DOM queries for SVG buttons)
const svgButtonData = [];
// Initial setup for the SVG circles
const magentaCircles = [
    { cx: 100, cy: 50, r: 17 },
    { cx: 80, cy: 80, r: 17 },
    { cx: 120, cy: 80, r: 17 }
];


// --- Utility Functions ---

/**
 * Custom alert/modal function to replace browser's alert.
 * Uses opacity and scale transitions for smooth animation.
 */
function showCustomAlert(message) {
    const modalId = 'customAlertModal';
    let modal = document.getElementById(modalId);

    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] opacity-0 transition-opacity duration-300';
        modal.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center transform scale-95 transition-transform duration-300">
                <p class="text-gray-800 text-lg mb-6">${message}</p>
                <button class="bg-gradient-to-r from-[#E54656] to-[#F75759] text-white font-semibold py-2 px-6 rounded-lg" onclick="document.getElementById('${modalId}').classList.remove('opacity-100', 'scale-100'); document.getElementById('${modalId}').classList.add('opacity-0', 'scale-95'); setTimeout(() => document.getElementById('${modalId}').remove(), ${DURATION_MEDIUM});">
                    OK
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        // Trigger transitions after a slight delay to allow rendering
        setTimeout(() => {
            modal.classList.add('opacity-100');
            modal.querySelector('div').classList.add('scale-100');
        }, 10);
    } else {
        // If modal already exists, just update message and show
        modal.querySelector('p').textContent = message;
        modal.classList.add('opacity-100');
        modal.querySelector('div').classList.add('scale-100');
    }
}

/**
 * Smooth scrolling for navigation links.
 */
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) { // Ensure mobile menu is defined before accessing
            mobileMenu.classList.add('hidden');
            menuIcon.textContent = 'menu';
        }
    }
}

/**
 * Toggles the visibility of a language dropdown menu.
 */
function toggleLanguageDropdown(dropdownMenuElement) {
    if (dropdownMenuElement) {
        dropdownMenuElement.classList.toggle('show');
    }
}

/**
 * Sets the initial language displayed and highlights the active link.
 */
function setInitialLanguage() {
    const path = window.location.pathname;
    let currentLang = 'en'; // Default to English
    let activeLinkSelector = '[data-lang="en"]';

    if (path.includes('de.html')) {
        currentLang = 'de';
        activeLinkSelector = '[data-lang="de"]';
    } else if (path.includes('fr.html')) {
        currentLang = 'fr';
        activeLinkSelector = '[data-lang="fr"]';
    }

    // Highlight active language link
    document.querySelectorAll('.language-dropdown-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.matches(activeLinkSelector)) {
            link.classList.add('active');
        }
    });
}

/**
 * Switches the current page language based on the provided language code.
 */
function switchLanguage(langCode) {
    let newPath = 'index.html'; // Default for English
    if (langCode === 'de') {
        newPath = 'de.html';
    } else if (langCode === 'fr') {
        newPath = 'fr.html';
    }
    window.location.href = newPath;
}


// --- Scroll-Related Functions (Throttled) ---

/**
 * Updates the scroll progress indicator width.
 */
function updateScrollProgress() {
    if (!scrollIndicator) return; // Exit if element not found

    const scrollTop = window.pageYOffset;
    const docHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    ) - window.innerHeight;

    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollIndicator.style.width = scrollPercent + '%';
}

/**
 * Updates the header background based on scroll position.
 */
function updateHeaderBackground() {
    if (!header) return; // Exit if element not found

    if (window.scrollY > SCROLL_THRESHOLD_HEADER) {
        header.classList.add('bg-white/95', 'shadow-lg');
        header.classList.remove('bg-white/80', 'shadow-xl');
    } else {
        header.classList.remove('bg-white/95', 'shadow-lg');
        header.classList.add('bg-white/80', 'shadow-xl');
    }
}

/**
 * Updates the visibility of the back-to-top button.
 */
function updateBackToTopButton() {
    if (!backToTopBtn) return; // Exit if element not found

    if (window.scrollY > SCROLL_THRESHOLD_BACK_TO_TOP) {
        backToTopBtn.classList.remove('opacity-0', 'invisible');
        backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
        backToTopBtn.classList.add('opacity-0', 'invisible');
        backToTopBtn.classList.remove('opacity-100', 'visible');
    }
}

// Performance optimization: Throttle scroll events
let ticking = false;
function requestScrollTick() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateScrollProgress();
            updateHeaderBackground();
            updateBackToTopButton();
            ticking = false;
        });
        ticking = true;
    }
}


// --- SVG Button Visuals (Optimized) ---

// Main function to initialize the interactive visual
function initializeVisual() {
    const svg = document.getElementById('blue-buttons-layer');
    if (!svg) {
        console.warn('SVG layer for blue buttons not found. Skipping visual initialization.');
        return;
    }

    // Generate optimized button layouts first (separate calculation from rendering)
    generateButtonLayouts().then(layoutsArray => {
        // Render buttons with staggered animation using requestAnimationFrame
        renderButtons(layoutsArray, svg);
    });
}

// Calculate button positions first, deferring execution to prevent blocking
function generateButtonLayouts() {
    return new Promise(resolve => {
        // Re-introduced a slight delay to ensure browser can render initial layout
        setTimeout(() => {
            const layouts = [];
            const placedPositions = [];
            let placed = 0;
            let attempts = 0;
            const maxAttempts = 100; // Reasonable limit to prevent infinite loops

            while (placed < 7 && attempts < maxAttempts) {
                // Randomly select a base magenta circle
                const base = magentaCircles[Math.floor(Math.random() * magentaCircles.length)];

                // Generate random angle around the circle
                const angle = Math.random() * 2 * Math.PI;

                // Place exactly on the perimeter of the magenta circle
                const x = Math.round((base.cx + base.r * Math.cos(angle)) * 10) / 10;
                const y = Math.round((base.cy + base.r * Math.sin(angle)) * 10) / 10;
                // Random radius between 5-8 (similar to original 5-10 range, adjusted to 5-7 as per original comment)
                const r = Math.floor(Math.random() * 3) + 5;

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

            if (placed < 7) {
                console.warn(`Only placed ${placed} buttons after ${attempts} attempts.`);
            }

            resolve(layouts);
        }, 0); // Minimal timeout to avoid blocking main thread during initial render
    });
}

// Optimized collision detection
function isFarEnough(x, y, r, positions) {
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

    layouts.forEach(layout => {
        const { id, x, y, r, delay } = layout;

        // Create elements
        const circle = createCircleElement(id, x, y, r, delay);
        const line = createLineElement(id, x, y, r, delay);

        // Store data for event handling (avoiding DOM queries later)
        svgButtonData.push({
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
        svgButtonData.forEach((btn) => {
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
    circle.setAttribute("stroke", "#0a2f4d");
    circle.setAttribute("stroke-width", "0.2");
    circle.setAttribute("clip-path", "inset(25% 0% 0% 0%)");
    circle.classList.add("blue-button");
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


// --- Formspree Form Handling ---

// The form is grabbed by its ID
// The event listener is added after the DOM is fully loaded
function setupContactForm() {
    if (contactForm) {
        // Intercept the submit event
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // stop the browser from doing a full-page redirect

            const formData = new FormData(contactForm);

            try {
                // POST the data via Fetch to Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Accept: 'application/json'
                    }
                });
                // If Formspree responds OK (status 200), show the thank-you block
                if (response.ok) {
                    contactForm.innerHTML = `
                        <div class="form-container text-center space-y-4 text-gray-600">
                            <p class="text-lg font-semibold">Thanks for contacting me! Merci de m'avoir contacté! Danke für Ihre Nachricht!</p>
                            <p>I will answer within 2 hours. Je vous reviens d'ici 2 heures. Ich melde mich bei Ihnen innerhalb von zwei Stunden.</p>
                            <div class="form-actions">
                                <button
                                    type="button"
                                    class="close-form bg-[#0a2f4d] hover:bg-[#1786D2] text-white font-semibold py-2 px-6 rounded"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    `;
                }
                // Non-OK (4xx/5xx) -> show an error block
                else {
                    contactForm.innerHTML = `
                        <div class="form-container text-center space-y-4 text-gray-600">
                            <p class="text-red-600 font-semibold">Something went wrong (Formspree.io). Please try again later or contact me per email.</p>
                            <div class="form-actions">
                                <button
                                    type="button"
                                    class="close-form glow-button bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    `;
                }
            } catch (error) {
                // Network error or fetch() failure
                contactForm.innerHTML = `
                    <div class="form-container text-center space-y-4 text-gray-600">
                        <p class="text-red-600 font-semibold">Network error (Fetch). Please try again later or contact me per email.</p>
                        <div class="form-actions">
                            <button
                                type="button"
                                class="close-form glow-button bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                `;
            }
        });

        // Catch clicks on the “Close” buttons (any element with .close-form)
        contactForm.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-form')) {
                // Remove the overlay or form container entirely
                const overlay = document.getElementById('contact-overlay');
                if (overlay) overlay.remove();
            }
        });
    }
}


// --- Event Listeners and Initialization ---

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    mobileMenuBtn = document.getElementById('mobileMenuBtn');
    mobileMenu = document.getElementById('mobileMenu');
    menuIcon = document.getElementById('menuIcon');
    scrollIndicator = document.getElementById('scrollIndicator');
    header = document.getElementById('header');
    backToTopBtn = document.getElementById('backToTop');
    contactForm = document.getElementById('contactForm');
    desktopLanguageDropdownBtn = document.getElementById('languageDropdownBtnDesktop');
    mobileLanguageDropdownBtn = document.getElementById('languageDropdownBtnMobile');
    desktopLanguageDropdownMenu = document.getElementById('languageDropdownMenuDesktop');
    mobileLanguageDropdownMenu = document.getElementById('languageDropdownMenuMobile');

    addOptimizedStyles(); // Add global optimized CSS styles
    initializeVisual(); // Initialize SVG button animation

    updateScrollProgress();
    updateHeaderBackground();
    updateBackToTopButton();
    setInitialLanguage(); // Set the language on page load
    setupContactForm(); // Set up the contact form handling

    // Mobile menu functionality
    mobileMenuBtn?.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuIcon.textContent = 'close'; // Change icon to 'close'
        } else {
            mobileMenu.classList.add('hidden');
            menuIcon.textContent = 'menu'; // Change icon back to 'menu'
        }
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.textContent = 'menu';
        });
    });

    // Language Dropdown Event Listeners
    desktopLanguageDropdownBtn?.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from immediately closing the dropdown
        toggleLanguageDropdown(desktopLanguageDropdownMenu);
    });

    mobileLanguageDropdownBtn?.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from immediately closing the dropdown
        toggleLanguageDropdown(mobileLanguageDropdownMenu);
    });

    // Close dropdowns when clicking outside
    window.addEventListener('click', (event) => {
        if (desktopLanguageDropdownMenu && desktopLanguageDropdownMenu.classList.contains('show') && !event.target.closest('#languageDropdownBtnDesktop')) {
            desktopLanguageDropdownMenu.classList.remove('show');
        }
        if (mobileLanguageDropdownMenu && mobileLanguageDropdownMenu.classList.contains('show') && !event.target.closest('#languageDropdownBtnMobile')) {
            mobileLanguageDropdownMenu.classList.remove('show');
        }
    });

    // Add click listeners to language links inside dropdowns
    document.querySelectorAll('.language-dropdown-menu a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const langCode = event.target.dataset.lang;
            switchLanguage(langCode);
        });
    });

    // Back to top functionality
    backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1, /* Trigger when 10% of the element is visible */
        rootMargin: '0px 0px -50px 0px' /* Shrink the bottom of the viewport by 50px */
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.animate-fade-in').forEach(el => {
        observer.observe(el);
    });

    // Keyboard navigation support for mobile menu (Escape key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            menuIcon.textContent = 'menu';
        }
    });
});

window.addEventListener('scroll', requestScrollTick);