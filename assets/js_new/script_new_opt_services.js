// Enhanced JavaScript functionality for better performance and Lighthouse scores

// --- Constants and Cached DOM Elements ---
const DURATION_MEDIUM = 300; // Consistent duration for animations/timeouts
const SCROLL_THRESHOLD_HEADER = 100;
const SCROLL_THRESHOLD_BACK_TO_TOP = 500;

// Get elements once DOM is ready to avoid repeated queries
let mobileMenuBtn, mobileMenu, menuIcon, scrollIndicator, header, backToTopBtn, contactForm;
let desktopLanguageDropdownBtn, mobileLanguageDropdownBtn, desktopLanguageDropdownMenu, mobileLanguageDropdownMenu;


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
    desktopLanguageDropdownBtn = document.getElementById('languageDropdownBtnDesktop');
    mobileLanguageDropdownBtn = document.getElementById('languageDropdownBtnMobile');
    desktopLanguageDropdownMenu = document.getElementById('languageDropdownMenuDesktop');
    mobileLanguageDropdownMenu = document.getElementById('languageDropdownMenuMobile');

    updateScrollProgress();
    updateHeaderBackground();
    updateBackToTopButton();
    setInitialLanguage(); // Set the language on page load

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