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
    loadChanges();
    initLogin();
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

/* ─── Admin Mode ─── */
const ADMIN_HASH = 'admin'; // Still keep 'admin' as a local-only fallback

function initLogin() {
    const loginBtn = document.getElementById('adminLoginBtn');
    if (!loginBtn) return;

    // Create modal logic
    const modalHtml = `
        <div class="login-modal" id="loginModal">
            <div class="login-box">
                <h3>Logowanie Administratora</h3>
                <p style="font-size: 0.9em; color: var(--color-gray); margin-bottom: 15px;">
                    Podaj hasło, aby przejść do trybu edycji.
                </p>
                <input type="password" id="adminPassword" class="login-input" placeholder="Hasło...">
                <div class="login-actions">
                    <button class="btn btn-secondary" id="cancelLogin">Anuluj</button>
                    <button class="btn btn-primary" id="confirmLogin">Zaloguj</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('loginModal');
    const input = document.getElementById('adminPassword');
    const confirmBtn = document.getElementById('confirmLogin');
    const cancelBtn = document.getElementById('cancelLogin');

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        input.value = '';
        input.focus();
    });

    const attemptLogin = async () => {
        const val = input.value.trim();

        // 1. Try Global Access (Decryption)
        if (window.SITE_CONFIG && window.SITE_CONFIG.auth) {
            try {
                showToast('Weryfikacja hasła...', 'info');
                const decryptedToken = await window.AuthVault.decrypt(window.SITE_CONFIG.auth, val);

                // Success!
                localStorage.setItem('githubToken', decryptedToken);
                enableAdminMode(true);
                modal.classList.remove('active');
                showToast('Zalogowano pomyślnie!');
                return;
            } catch (e) {
                // Wrong password or decrypt fail
                console.log('Decryption failed, checking other methods...');
            }
        }

        // 2. Fallback: Local Admin
        if (val === ADMIN_HASH) {
            if (window.SITE_CONFIG && window.SITE_CONFIG.auth) {
                alert('Nieprawidłowe hasło globalne!');
            } else {
                enableAdminMode(false);
                modal.classList.remove('active');
                showToast('Tryb Lokalny', 'info');
            }
        } else {
            alert('Nieprawidłowe hasło!');
        }
    };

    confirmBtn.addEventListener('click', attemptLogin);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') attemptLogin();
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

function enableAdminMode(hasToken) {
    document.body.classList.add('admin-mode');

    // Hide login button and show status
    const loginBtn = document.getElementById('adminLoginBtn');
    if (loginBtn) {
        loginBtn.style.display = 'none';

        if (!loginBtn.parentNode.querySelector('.admin-toolbar')) {
            const toolbar = document.createElement('div');
            toolbar.className = 'admin-toolbar';

            // SINGLE Save Button
            const saveBtn = document.createElement('button');
            saveBtn.className = 'btn-save';
            saveBtn.textContent = 'ZAPISZ ZMIANY';
            saveBtn.title = 'Zapisz i opublikuj zmiany globalnie';

            saveBtn.onclick = async () => {
                saveChanges();
                const token = localStorage.getItem('githubToken');
                if (token) {
                    try {
                        await publishToGitHub(token);
                    } catch (e) {
                        showToast('Błąd publikacji: ' + e.message, 'error');
                    }
                } else {
                    showToast('Zapisano tylko lokalnie (brak tokenu)', 'info');
                }
            };

            toolbar.appendChild(saveBtn);
            loginBtn.parentNode.appendChild(toolbar);
        }
    }

    // Make content editable
    const editableSelectors = 'h1, h2, h3, h4, p, span:not(.btn span), li, .form-group label, .btn span';

    // Helper to apply editable to new/existing elements
    const makeEditable = () => {
        document.querySelectorAll(editableSelectors).forEach(el => {
            if (el.closest('.admin-add-btn') || el.closest('.admin-delete-btn') || el.closest('.admin-toolbar')) return;
            el.setAttribute('contenteditable', 'true');
        });
    };
    makeEditable();

    // Add listeners for stats editing
    document.querySelectorAll('.stat-number').forEach(el => {
        el.addEventListener('input', () => {
            const val = parseInt(el.textContent.replace(/\D/g, '')) || 0;
            el.setAttribute('data-target', val);
        });
    });

    // Add Delete Buttons
    addDeleteButtons();

    // Add "Add Tile" buttons
    addTileButtons();
}

function setupGlobalAccess() {
    const token = localStorage.getItem('githubToken');
    if (!token) return alert('Brak tokenu sesji!');

    const password = prompt('Podaj hasło, którego chcesz używać na wszystkich urządzeniach (np. "admin"):', 'admin');
    if (!password) return;

    showToast('Szyfrowanie...', 'info');

    window.AuthVault.encrypt(token, password).then(async (encryptedData) => {
        // Create config content
        const configContent = `/**
 * Global Configuration for Admin Access
 * Last Updated: ${new Date().toLocaleString()}
 */
window.SITE_CONFIG = {
    auth: ${JSON.stringify(encryptedData, null, 4)}
};`;

        try {
            // Upload config.js
            await publishFile('js/config.js', configContent, token, 'Setup Global Admin Access');

            // Reload config in current window
            window.SITE_CONFIG = { auth: encryptedData };

            showToast('Gotowe! Teraz możesz logować się tym hasłem wszędzie.', 'success');
        } catch (e) {
            showToast('Błąd zapisu konfiguracji: ' + e.message, 'error');
        }
    });
}

function addDeleteButtons() {
    const cards = document.querySelectorAll('.mission-card, .action-card, .news-card, .feature-card, .form-group');
    cards.forEach(card => {
        if (card.querySelector('.admin-delete-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'admin-delete-btn';
        btn.innerHTML = '&times;';
        btn.title = 'Usuń element';
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Czy na pewno chcesz usunąć ten element?')) {
                card.remove();
            }
        });

        // Ensure relative positioning for absolute button
        const style = window.getComputedStyle(card);
        if (style.position === 'static') {
            card.style.position = 'relative';
        }

        card.appendChild(btn);
    });
}

function addTileButtons() {
    const grids = [
        { selector: '.mission-grid', type: 'mission' },
        { selector: '.actions-grid', type: 'action' },
        { selector: '.news-grid', type: 'news', isNews: true },
        { selector: '.about-features', type: 'feature' }
    ];

    grids.forEach(gridInfo => {
        const grid = document.querySelector(gridInfo.selector);
        if (!grid) return;

        // Prevent duplicates
        if (grid.querySelector('.admin-add-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'admin-add-btn';
        btn.textContent = '+ Dodaj kafelek';

        btn.addEventListener('click', () => {
            const lastCard = grid.querySelector(':scope > div:not(.admin-add-btn)');
            if (lastCard) {
                const newCard = lastCard.cloneNode(true);

                // Remove delete button from clone (will be re-added)
                const delBtn = newCard.querySelector('.admin-delete-btn');
                if (delBtn) delBtn.remove();

                // Layout fix for News
                if (gridInfo.isNews) {
                    newCard.classList.remove('news-card-featured');
                    newCard.classList.add('new-item');
                    newCard.style.gridColumn = 'auto';
                    newCard.style.gridRow = 'auto';
                }

                // Handle Numbering for Mission
                if (gridInfo.type === 'mission') {
                    const numberEl = newCard.querySelector('.mission-card-number');
                    if (numberEl) {
                        const count = grid.querySelectorAll('.mission-card').length + 1;
                        numberEl.textContent = count < 10 ? '0' + count : count;
                    }
                }

                // Handle Modals
                const modalLink = newCard.querySelector('[data-modal]');
                if (modalLink) {
                    const oldModalId = modalLink.getAttribute('data-modal');
                    const newModalId = 'modal-new-' + Date.now();
                    modalLink.setAttribute('data-modal', newModalId);

                    // Clone the actual modal
                    const oldModal = document.getElementById(oldModalId);
                    if (oldModal) {
                        const newModal = oldModal.cloneNode(true);
                        newModal.id = newModalId;
                        document.body.appendChild(newModal);

                        // Re-init modal events for the new modal
                        newModal.querySelectorAll('.modal-close').forEach(b => {
                            b.addEventListener('click', () => closeModal(newModal));
                        });
                        newModal.addEventListener('click', (e) => {
                            if (e.target === newModal) closeModal(newModal);
                        });

                        // Make modal content editable
                        newModal.querySelectorAll('h2, h3, p, li').forEach(el => el.setAttribute('contenteditable', 'true'));
                    }
                }

                // Clear content
                newCard.querySelectorAll('[contenteditable]').forEach(el => {
                    const tag = el.tagName.toLowerCase();
                    if (tag === 'h3') el.textContent = 'Nowy Tytuł';
                    else if (tag === 'p') el.textContent = 'Nowy opis...';
                    else if (tag === 'span' && !el.classList.contains('mission-card-number')) el.textContent = 'Etykieta';
                    else if (tag === 'li') el.textContent = 'Nowy element listy';
                });

                grid.insertBefore(newCard, btn);

                // Re-apply admin features to new card
                // Add delete button
                const newDelBtn = document.createElement('button');
                newDelBtn.className = 'admin-delete-btn';
                newDelBtn.innerHTML = '&times;';
                newDelBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Usuń?')) newCard.remove();
                });
                newCard.style.position = 'relative';
                newCard.appendChild(newDelBtn);

                // Init triggers for new link
                if (modalLink) {
                    modalLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        const mId = modalLink.getAttribute('data-modal');
                        const m = document.getElementById(mId);
                        if (m) {
                            m.classList.add('active');
                            document.body.classList.add('modal-open');
                        }
                    });
                }
            }
        });

        grid.appendChild(btn);
    });
}

/* ─── Persistence Logic ─── */

function saveChanges() {
    const data = {
        mission: document.querySelector('.mission-grid')?.innerHTML,
        actions: document.querySelector('.actions-grid')?.innerHTML,
        news: document.querySelector('.news-grid')?.innerHTML,
        features: document.querySelector('.about-features')?.innerHTML,
        stats: document.querySelector('.stats-grid')?.innerHTML,
        modals: []
    };

    // Save only dynamically added modals
    document.querySelectorAll('body > [id^="modal-new-"]').forEach(modal => {
        data.modals.push(modal.outerHTML);
    });

    localStorage.setItem('adminContent', JSON.stringify(data));
    showToast('Zmiany zapisane lokalnie!');
}

function loadChanges() {
    const saved = localStorage.getItem('adminContent');
    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        if (data.mission) document.querySelector('.mission-grid').innerHTML = data.mission;
        if (data.actions) document.querySelector('.actions-grid').innerHTML = data.actions;
        if (data.news) document.querySelector('.news-grid').innerHTML = data.news;
        if (data.features) document.querySelector('.about-features').innerHTML = data.features;
        if (data.stats && document.querySelector('.stats-grid')) {
            document.querySelector('.stats-grid').innerHTML = data.stats;
        }

        // Restore modals
        if (data.modals && Array.isArray(data.modals)) {
            data.modals.forEach(html => {
                // Check if already exists to avoid duplicates on re-run
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const id = temp.firstChild.id;
                if (!document.getElementById(id)) {
                    document.body.appendChild(temp.firstChild);
                }
            });
        }

        // Re-attach event listeners for modals (old and new)
        initModals();

    } catch (e) {
        console.error('Error loading saved content:', e);
    }
}




function getRepoDetails() {
    return {
        owner: 'zuziacz555-hue',
        repo: 'samorzadydlamlodych',
        branch: 'master'
    };
}

async function publishFile(filename, content, token, message) {
    const { owner, repo, branch } = getRepoDetails();
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filename}`;

    try {
        // 1. Get current SHA (if file exists)
        let sha = null;
        const getRes = await fetch(apiUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (getRes.ok) {
            const getData = await getRes.json();
            sha = getData.sha;
        } else if (getRes.status !== 404) {
            throw new Error('Błąd sprawdzania pliku: ' + getRes.status);
        }

        // 2. Prepare Content (Base64)
        const utf8Bytes = new TextEncoder().encode(content);
        // Efficient Base64 for UTF-8
        const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join("");
        const base64Content = btoa(binaryString);

        // 3. Update/Create File
        const putRes = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message || `Update ${filename}`,
                content: base64Content,
                sha: sha,
                branch: branch
            })
        });

        if (!putRes.ok) {
            const err = await putRes.json();
            throw new Error(err.message || 'Błąd zapisu');
        }

        return true;

    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function publishToGitHub(token) {
    showToast('Przygotowywanie...', 'info');

    try {
        // 1. Prepare Index.html Content
        // Clone document to clean it up
        const clone = document.documentElement.cloneNode(true);
        clone.classList.remove('admin-mode', 'modal-open');

        // Remove Admin UI
        clone.querySelector('.admin-toolbar')?.remove();
        clone.querySelector('#loginModal')?.remove(); // Clean new login modal
        clone.querySelector('.admin-toast')?.remove();

        // Remove ALL injected scripts to prevent duplication on reload
        // converting them back to static src tags if needed, but here we just keep them as is
        // ACTUALLY: The scripts (encryption.js, config.js) are static in HTML, so we keep them.

        // Clean up injected setup modal if exists
        clone.querySelector('#setupModal')?.remove();

        // Restore login button
        const loginBtn = clone.querySelector('#adminLoginBtn');
        if (loginBtn) loginBtn.style.display = '';

        // Remove admin elements
        clone.querySelectorAll('.admin-add-btn, .admin-delete-btn').forEach(el => el.remove());
        clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));

        // Clean up active classes
        clone.querySelectorAll('.active').forEach(el => el.classList.remove('active'));

        const content = "<!DOCTYPE html>\n" + clone.outerHTML;

        // 2. Publish index.html
        showToast('Wysyłanie strony...', 'info');
        await publishFile('index.html', content, token, `Update site content (${new Date().toLocaleString()})`);

        showToast('Sukces! Strona zaktualizowana.');

    } catch (err) {
        showToast('Błąd: ' + err.message, 'error');
        if (err.message.includes('Bad credentials') || err.message.includes('401')) {
            localStorage.removeItem('githubToken');
        }
    }
}

function showToast(msg, type = 'success') {
    let toast = document.querySelector('.admin-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'admin-toast';
        document.body.appendChild(toast);
    }

    // Reset classes
    toast.className = 'admin-toast';
    if (type === 'error') toast.classList.add('error');

    // Add spinner for info
    if (type === 'info') {
        toast.innerHTML = `<span class="loader"></span> <span>${msg}</span>`;
    } else {
        toast.textContent = msg;
    }

    toast.classList.add('show');

    if (type !== 'info') {
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

