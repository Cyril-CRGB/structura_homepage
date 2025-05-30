// Enhanced JavaScript functionality

        // Custom alert/modal function to replace browser's alert
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
                        <button class="bg-gradient-to-r from-[#E54656] to-[#F75759] text-white font-semibold py-2 px-6 rounded-lg" onclick="document.getElementById('${modalId}').classList.remove('opacity-100', 'scale-100'); document.getElementById('${modalId}').classList.add('opacity-0', 'scale-95'); setTimeout(() => document.getElementById('${modalId}').remove(), 300);">
                            OK
                        </button>
                    </div>
                `;
                document.body.appendChild(modal);
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

        // Smooth scrolling for navigation links
        function scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                mobileMenu.classList.add('hidden');
                menuIcon.textContent = 'menu';
            }
        }

        // Mobile menu functionality
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const menuIcon = document.getElementById('menuIcon');

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

        // Language Dropdown Functionality
        function toggleLanguageDropdown(dropdownId) {
            const dropdownMenu = document.getElementById(dropdownId);
            dropdownMenu.classList.toggle('show');
        }

        // Event Listeners for Language Dropdowns
        document.getElementById('languageDropdownBtnDesktop')?.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from immediately closing the dropdown
            toggleLanguageDropdown('languageDropdownMenuDesktop');
        });

        document.getElementById('languageDropdownBtnMobile')?.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from immediately closing the dropdown
            toggleLanguageDropdown('languageDropdownMenuMobile');
        });

        // Close dropdowns when clicking outside
        window.addEventListener('click', (event) => {
            const desktopMenu = document.getElementById('languageDropdownMenuDesktop');
            const mobileMenu = document.getElementById('languageDropdownMenuMobile');

            if (desktopMenu && desktopMenu.classList.contains('show') && !event.target.closest('#languageDropdownBtnDesktop')) {
                desktopMenu.classList.remove('show');
            }
            if (mobileMenu && mobileMenu.classList.contains('show') && !event.target.closest('#languageDropdownBtnMobile')) {
                mobileMenu.classList.remove('show');
            }
        });

        // Set initial language displayed and highlight active link
        function setInitialLanguage() {
            const path = window.location.pathname;
            let currentLang = 'en'; // Default to English code
            let activeLinkSelector = '[data-lang="en"]'; // Default to English

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

        // Handle language switching
        function switchLanguage(langCode) {
            let newPath = 'index.html'; // Default for English
            if (langCode === 'de') {
                newPath = 'de.html';
            } else if (langCode === 'fr') {
                newPath = 'fr.html';
            }
            window.location.href = newPath;
        }

        // Add click listeners to language links inside dropdowns
        document.querySelectorAll('.language-dropdown-menu a').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                const langCode = event.target.dataset.lang;
                switchLanguage(langCode);
            });
        });

        // Scroll progress indicator
        function updateScrollProgress() {
            const scrollIndicator = document.getElementById('scrollIndicator');
            const scrollTop = window.pageYOffset;
            // Calculate document height considering potential scroll issues
            const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight,
                                       document.body.offsetHeight, document.documentElement.offsetHeight,
                                       document.body.clientHeight, document.documentElement.clientHeight) - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            if (scrollIndicator) {
                scrollIndicator.style.width = scrollPercent + '%';
            }
        }

        // Header background on scroll
        function updateHeaderBackground() {
            const header = document.getElementById('header');
            if (window.scrollY > 100) {
                header?.classList.add('bg-white/95', 'shadow-lg');
                header?.classList.remove('bg-white/80', 'shadow-xl');
            } else {
                header?.classList.remove('bg-white/95', 'shadow-lg');
                header?.classList.add('bg-white/80', 'shadow-xl');
            }
        }

        // Back to top button visibility
        function updateBackToTopButton() {
            const backToTopBtn = document.getElementById('backToTop');
            if (window.scrollY > 500) {
                backToTopBtn?.classList.remove('opacity-0', 'invisible');
                backToTopBtn?.classList.add('opacity-100', 'visible');
            } else {
                backToTopBtn?.classList.add('opacity-0', 'invisible');
                backToTopBtn?.classList.remove('opacity-100', 'visible');
            }
        }

        // Back to top functionality
        document.getElementById('backToTop')?.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Performance optimization: Throttle scroll events
        let ticking = false;
        function requestTick() {
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

        window.addEventListener('scroll', requestTick);

        // Form submission
        //document.getElementById('contactForm')?.addEventListener('submit', function(e) {
        //    e.preventDefault();

            // Basic form validation
        //    const name = document.getElementById('name').value.trim();
        //    const email = document.getElementById('email').value.trim();
        //    const message = document.getElementById('message').value.trim();

        //    if (!name || !email || !message) {
        //        showCustomAlert('Please fill in all required fields.');
        //        return;
        //    }

            // Email validation
        //    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //    if (!emailRegex.test(email)) {
        //        showCustomAlert('Please enter a valid email address.');
        //        return;
        //    }

            // Simulate form submission
            // showCustomAlert('Thank you for your message! We\'ll get back to you soon.');
            // this.reset(); // Clear the form after submission
        //});

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
        document.querySelectorAll('.service-card, .glass-morphism, .animate-fade-in').forEach(el => {
            observer.observe(el);
        });

        // Keyboard navigation support for mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                menuIcon.textContent = 'menu';
            }
        });

        // Initialize on load
        document.addEventListener('DOMContentLoaded', () => {
            updateScrollProgress();
            updateHeaderBackground();
            updateBackToTopButton();
            setInitialLanguage(); // Set the language on page load
        });

        // ----- OLD JAVASCRIPT CODE ---
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
            while (placed < 7 && attempts < maxAttempts) {
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
            
            if (placed < 7) {
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