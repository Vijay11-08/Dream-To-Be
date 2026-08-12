// ===================================================
// RELIEF SKIN & COSMETIC CLINIC — Core JavaScript
// ===================================================

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initScrollReveal();
    initLoadingScreen();
    initWelcomePopup();
    initStatsCounter();
    initHeroParallax();
    initScrollToTop();
});

// ===== 1. Navbar Logic =====
function initNavbar() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    // Sticky / Scrolled state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Link Highlighting (Pill styling is handled in CSS based on .active)
    const currentLocation = location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Simple path matching
        if (href !== '/' && currentLocation.includes(href)) {
            link.classList.add('active');
        } else if (currentLocation.endsWith('/') && href === 'index.html') {
            link.classList.add('active');
        }
    });
}

// ===== 2. Intersection Observer (Scroll Reveals) =====
function initScrollReveal() {
    // Select elements that should animate in
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .fade-in, .animate-on-scroll');
    
    if (revealElements.length === 0) return;

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered reveal based on index within the intersection batch
                setTimeout(() => {
                    entry.target.classList.add('is-revealed');
                    entry.target.classList.add('visible'); // For legacy animate-on-scroll support
                }, index * 80); 
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

// ===== 3. Loading Screen =====
function initLoadingScreen() {
    const loader = document.getElementById('relief-loader');
    if (!loader) return;

    // Simulate minimal loading time (800ms) to let assets load and show brand
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
            // Trigger popup logic after loader disappears
            document.dispatchEvent(new Event('loaderFinished'));
        }, 500);
    }, 1200);
}

// ===== 4. Welcome Popup =====
function initWelcomePopup() {
    const popup = document.getElementById('welcome-popup');
    if (!popup) return;

    // Only show once per session
    if (sessionStorage.getItem('reliefPopupSeen')) {
        popup.remove();
        return;
    }

    const closeBtn = document.getElementById('close-popup');
    
    const showPopup = () => {
        popup.classList.add('show');
    };

    const hidePopup = () => {
        popup.classList.remove('show');
        sessionStorage.setItem('reliefPopupSeen', 'true');
        setTimeout(() => popup.remove(), 500);
    };

    // Wait for loader to finish, or show immediately if no loader
    if (document.getElementById('relief-loader')) {
        document.addEventListener('loaderFinished', () => {
            setTimeout(showPopup, 800);
        });
    } else {
        setTimeout(showPopup, 1500);
    }

    if (closeBtn) closeBtn.addEventListener('click', hidePopup);
    
    // Close on backdrop click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) hidePopup();
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('show')) {
            hidePopup();
        }
    });
}

// ===== 5. Stats Counter =====
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.hero-stat h3');
    if (statNumbers.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        const suffix = text.replace(/[0-9]/g, '');
        const duration = 2000;
        const steps = 60;
        const increment = number / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), number);

            if (number >= 1000) {
                element.textContent = (current / 1000).toFixed(current >= number ? 0 : 0) + suffix;
                if (current >= number) {
                    element.textContent = (number / 1000) + 'K+';
                }
            } else {
                element.textContent = current + suffix;
            }

            if (step >= steps) {
                element.textContent = text;
                clearInterval(timer);
            }
        }, duration / steps);
    }
}

// ===== 6. Hero Parallax =====
function initHeroParallax() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < 800) {
            const heroImg = heroSection.querySelector('.hero-image-wrapper img');
            if (heroImg) {
                heroImg.style.transform = `translateY(${scrolled * 0.08}px) scale(1.02)`;
            }
        }
    });
}
// ===== 7. Scroll To Top Button =====
function initScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
