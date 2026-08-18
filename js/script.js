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
    initServicesCarousel();
    initTestimonialsCarousel();
    initGalleryCarousel();
    initHeroCarousel();
});

// ===== 1. Navbar Logic =====
function initNavbar() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const currentLocation = location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href !== '/' && currentLocation.includes(href)) {
            link.classList.add('active');
        } else if (currentLocation.endsWith('/') && href === 'index.html') {
            link.classList.add('active');
        }
    });
}

// ===== 2. Scroll Reveal =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .fade-in, .animate-on-scroll');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-revealed');
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
}

// ===== 3. Loading Screen =====
function initLoadingScreen() {
    const loader = document.getElementById('relief-loader');
    if (!loader) return;

    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
            document.dispatchEvent(new Event('loaderFinished'));
        }, 500);
    }, 1200);
}

// ===== 4. Welcome Popup =====
function initWelcomePopup() {
    const popup = document.getElementById('welcome-popup');
    if (!popup) return;

    if (sessionStorage.getItem('reliefPopupSeen')) {
        popup.remove();
        return;
    }

    const closeBtn = document.getElementById('close-popup');

    const showPopup = () => popup.classList.add('show');
    const hidePopup = () => {
        popup.classList.remove('show');
        sessionStorage.setItem('reliefPopupSeen', 'true');
        setTimeout(() => popup.remove(), 500);
    };

    if (document.getElementById('relief-loader')) {
        document.addEventListener('loaderFinished', () => setTimeout(showPopup, 800));
    } else {
        setTimeout(showPopup, 1500);
    }

    if (closeBtn) closeBtn.addEventListener('click', hidePopup);
    popup.addEventListener('click', (e) => { if (e.target === popup) hidePopup(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('show')) hidePopup();
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
                element.textContent = (current / 1000).toFixed(0) + suffix;
                if (current >= number) element.textContent = (number / 1000) + 'K+';
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
            const heroImg = heroSection.querySelector('.hero-carousel img.active, .hero-carousel-wrap img');
            if (heroImg) heroImg.style.transform = `translateY(${scrolled * 0.04}px)`;
        }
    });
}

// ===== 7. Scroll To Top =====
function initScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 400);
    });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== 8. Services Carousel =====
function initServicesCarousel() {
    const track    = document.getElementById('servicesCarousel');
    const dotsWrap = document.getElementById('svcDots');
    const prevBtn  = document.getElementById('svcPrev');
    const nextBtn  = document.getElementById('svcNext');
    if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

    const slides  = Array.from(track.querySelectorAll('.svc-slide'));
    const total   = slides.length;
    let current   = 0;
    let autoTimer = null;

    function getVisible() {
        const w = window.innerWidth;
        return w < 576 ? 1 : w < 992 ? 2 : 3;
    }

    function maxIndex() { return Math.max(0, total - getVisible()); }

    function buildDots() {
        dotsWrap.innerHTML = '';
        const pages = maxIndex() + 1;
        for (let i = 0; i < pages; i++) {
            const d = document.createElement('button');
            d.className = 'svc-dot' + (i === 0 ? ' active' : '');
            d.setAttribute('aria-label', 'Slide ' + (i + 1));
            d.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(d);
        }
    }

    function updateDots() {
        dotsWrap.querySelectorAll('.svc-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function getSlideWidth() {
        return slides[0].offsetWidth + parseInt(getComputedStyle(track).gap || 24);
    }

    function goTo(index) {
        current = Math.min(Math.max(index, 0), maxIndex());
        track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
        updateDots();
    }

    function next() { goTo(current >= maxIndex() ? 0 : current + 1); }
    function prev() { goTo(current <= 0 ? maxIndex() : current - 1); }

    prevBtn.addEventListener('click', () => { resetAuto(); prev(); });
    nextBtn.addEventListener('click', () => { resetAuto(); next(); });

    function startAuto() { autoTimer = setInterval(next, 4000); }
    function stopAuto()  { clearInterval(autoTimer); }
    function resetAuto() { stopAuto(); startAuto(); }

    track.parentElement.addEventListener('mouseenter', stopAuto);
    track.parentElement.addEventListener('mouseleave', startAuto);

    let startX = 0, dragging = false, moved = false;
    track.addEventListener('mousedown', e => { startX = e.clientX; dragging = true; moved = false; });
    track.addEventListener('mousemove', () => { if (dragging) moved = true; });
    track.addEventListener('mouseup', e => {
        if (dragging && moved) {
            const diff = e.clientX - startX;
            if (diff < -50) next();
            else if (diff > 50) prev();
            resetAuto();
        }
        dragging = false;
    });
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (diff < -50) { next(); resetAuto(); }
        else if (diff > 50) { prev(); resetAuto(); }
    }, { passive: true });

    window.addEventListener('resize', () => { buildDots(); goTo(Math.min(current, maxIndex())); });

    buildDots();
    startAuto();
}

// ===== 9. Testimonials Carousel =====
function initTestimonialsCarousel() {
    const track    = document.getElementById('testiTrack');
    const dotsWrap = document.getElementById('testiDots');
    const prevBtn  = document.getElementById('testiPrev');
    const nextBtn  = document.getElementById('testiNext');
    if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

    const slides  = Array.from(track.querySelectorAll('.testi-slide'));
    const total   = slides.length;
    let current   = 0;
    let autoTimer = null;

    function getVisible() {
        const w = window.innerWidth;
        return w < 576 ? 1 : w < 992 ? 2 : 3;
    }

    function maxIndex() { return Math.max(0, total - getVisible()); }

    function buildDots() {
        dotsWrap.innerHTML = '';
        const pages = maxIndex() + 1;
        for (let i = 0; i < pages; i++) {
            const d = document.createElement('button');
            d.className = 'testi-dot' + (i === 0 ? ' active' : '');
            d.setAttribute('aria-label', 'Testimonial ' + (i + 1));
            d.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(d);
        }
    }

    function updateDots() {
        dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function getSlideWidth() {
        return slides[0].offsetWidth + parseInt(getComputedStyle(track).gap || 28);
    }

    function goTo(index) {
        current = Math.min(Math.max(index, 0), maxIndex());
        track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
        updateDots();
    }

    function next() { goTo(current >= maxIndex() ? 0 : current + 1); }
    function prev() { goTo(current <= 0 ? maxIndex() : current - 1); }

    prevBtn.addEventListener('click', () => { resetAuto(); prev(); });
    nextBtn.addEventListener('click', () => { resetAuto(); next(); });

    function startAuto() { autoTimer = setInterval(next, 5000); }
    function stopAuto()  { clearInterval(autoTimer); }
    function resetAuto() { stopAuto(); startAuto(); }

    track.parentElement.addEventListener('mouseenter', stopAuto);
    track.parentElement.addEventListener('mouseleave', startAuto);

    let startX = 0, dragging = false, moved = false;
    track.addEventListener('mousedown', e => { startX = e.clientX; dragging = true; moved = false; });
    track.addEventListener('mousemove', () => { if (dragging) moved = true; });
    track.addEventListener('mouseup', e => {
        if (dragging && moved) {
            const diff = e.clientX - startX;
            if (diff < -50) next();
            else if (diff > 50) prev();
            resetAuto();
        }
        dragging = false;
    });
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (diff < -50) { next(); resetAuto(); }
        else if (diff > 50) { prev(); resetAuto(); }
    }, { passive: true });

    window.addEventListener('resize', () => { buildDots(); goTo(Math.min(current, maxIndex())); });

    buildDots();
    startAuto();
}

// ===== 10. Gallery Carousel =====
function initGalleryCarousel() {
    const track    = document.getElementById('galleryTrack');
    const dotsWrap = document.getElementById('galleryDots');
    const prevBtn  = document.getElementById('galleryPrev');
    const nextBtn  = document.getElementById('galleryNext');
    if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

    const slides  = Array.from(track.querySelectorAll('.gallery-slide'));
    const total   = slides.length;
    let current   = 0;
    let autoTimer = null;

    function getVisible() { return window.innerWidth < 768 ? 1 : 2; }
    function maxIndex() { return Math.max(0, total - getVisible()); }

    function buildDots() {
        dotsWrap.innerHTML = '';
        const pages = maxIndex() + 1;
        for (let i = 0; i < pages; i++) {
            const d = document.createElement('button');
            d.className = 'gallery-dot' + (i === 0 ? ' active' : '');
            d.setAttribute('aria-label', 'Gallery image ' + (i + 1));
            d.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(d);
        }
    }

    function updateDots() {
        dotsWrap.querySelectorAll('.gallery-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function getSlideWidth() {
        return slides[0].offsetWidth + parseInt(getComputedStyle(track).gap || 24);
    }

    function goTo(index) {
        current = Math.min(Math.max(index, 0), maxIndex());
        track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
        updateDots();
    }

    function next() { goTo(current >= maxIndex() ? 0 : current + 1); }
    function prev() { goTo(current <= 0 ? maxIndex() : current - 1); }

    prevBtn.addEventListener('click', () => { resetAuto(); prev(); });
    nextBtn.addEventListener('click', () => { resetAuto(); next(); });

    function startAuto() { autoTimer = setInterval(next, 4500); }
    function stopAuto()  { clearInterval(autoTimer); }
    function resetAuto() { stopAuto(); startAuto(); }

    track.parentElement.addEventListener('mouseenter', stopAuto);
    track.parentElement.addEventListener('mouseleave', startAuto);

    let startX = 0, dragging = false, moved = false;
    track.addEventListener('mousedown', e => { startX = e.clientX; dragging = true; moved = false; });
    track.addEventListener('mousemove', () => { if (dragging) moved = true; });
    track.addEventListener('mouseup', e => {
        if (dragging && moved) {
            const diff = e.clientX - startX;
            if (diff < -50) next();
            else if (diff > 50) prev();
            resetAuto();
        }
        dragging = false;
    });
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (diff < -50) { next(); resetAuto(); }
        else if (diff > 50) { prev(); resetAuto(); }
    }, { passive: true });

    window.addEventListener('resize', () => { buildDots(); goTo(Math.min(current, maxIndex())); });

    buildDots();
    startAuto();
}

// ===== 11. Hero Image Carousel =====
function initHeroCarousel() {
    const carousel = document.getElementById('heroCarousel');
    const dotsWrap = document.getElementById('heroDots');
    if (!carousel || !dotsWrap) return;

    const slides  = Array.from(carousel.querySelectorAll('.hero-slide'));
    const total   = slides.length;
    let current   = 0;
    let autoTimer = null;

    function buildDots() {
        dotsWrap.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const d = document.createElement('button');
            d.className = 'hero-dot' + (i === 0 ? ' active' : '');
            d.setAttribute('aria-label', 'Hero image ' + (i + 1));
            d.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(d);
        }
    }

    function updateDots() {
        dotsWrap.querySelectorAll('.hero-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function goTo(index) {
        slides[current].classList.remove('active');
        current = index;
        slides[current].classList.add('active');
        updateDots();
        resetAuto();
    }

    function next() {
        slides[current].classList.remove('active');
        current = (current + 1) % total;
        slides[current].classList.add('active');
        updateDots();
    }

    function startAuto() { autoTimer = setInterval(next, 5000); }
    function stopAuto()  { clearInterval(autoTimer); }
    function resetAuto() { stopAuto(); startAuto(); }

    buildDots();
    startAuto();
}
