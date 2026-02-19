/* ═══════════════════════════════════════════════════════════
   SAMORZĄD DLA MŁODYCH — JavaScript Animations & Interactions
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollAnimations();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initCounters();
    initFormHandling();
    initHeroAnimation();
    initModals();
});

/* ─── Hero Particles ─── */
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        container.appendChild(particle);
    }
}

/* ─── Hero Entrance Animation ─── */
function initHeroAnimation() {
    const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
    heroElements.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 300 + i * 200);
    });
}

/* ─── Scroll Animations (Intersection Observer) ─── */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve so we can see animations when scrolling back
            }
        });
    }, observerOptions);

    // Observe all elements except hero ones (they animate on load)
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        if (!el.closest('.hero')) {
            observer.observe(el);
        }
    });
}

/* ─── Navbar Scroll Effect ─── */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* ─── Mobile Menu ─── */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/* ─── Smooth Scroll ─── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Skip links that trigger modals
        if (anchor.hasAttribute('data-modal')) return;

        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ─── Counter Animation ─── */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (counters.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;

    const easeOutQuad = (t) => t * (2 - t);

    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentValue = Math.round(target * progress);

        element.textContent = currentValue;

        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = target;
        }
    }, frameDuration);
}

/* ─── Form Handling ─── */
function initFormHandling() {
    const form = document.getElementById('joinForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalContent = btn.innerHTML;

        // Success animation
        btn.innerHTML = `
            <span>✓ Wysłano pomyślnie!</span>
        `;
        btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            form.reset();
        }, 3000);
    });
}

/* ─── Active nav link highlighting ─── */
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active-link');
            }
        });
    }, { passive: true });
})();

/* ─── Modals ─── */
function initModals() {
    // Open modal on link click
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('modal-open');
            }
        });
    });

    // Close modal on close button click
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = btn.closest('.modal-overlay');
            closeModal(overlay);
        });
    });

    // Close modal on overlay click (outside modal content)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

function closeModal(overlay) {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
}
