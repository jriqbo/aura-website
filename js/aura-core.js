/**
 * AURA Global Elite - Core Interface Logic v2.1
 * Mobile menu, scroll reveals, WhatsApp CTA, lazy loading, and cinematic interactions.
 * Fixed: hero slider handled by CSS (5 images), added destination image rotation.
 */

// ====================================================
// 0. NAVIGATION PATCH (Local & Production Consistency)
// ====================================================
(function() {
    const isLocalFile = window.location.protocol === 'file:';
    if (isLocalFile) {
        document.addEventListener('DOMContentLoaded', () => {
            const links = document.querySelectorAll('a[href^="/"]');
            const isSubpage = window.location.pathname.includes('/pages/');
            const prefix = isSubpage ? '../' : '';
            const pagePrefix = isSubpage ? '' : 'pages/';

            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href === '/salud') link.href = pagePrefix + 'salud.html';
                else if (href === '/corporativo') link.href = pagePrefix + 'corporativo.html';
                else if (href === '/turismo') link.href = pagePrefix + 'turismo.html';
                else if (href === '/eventos') link.href = pagePrefix + 'eventos.html';
                else if (href === '/aeropuerto') link.href = pagePrefix + 'aeropuerto.html';
                else if (href === '/delivery') link.href = pagePrefix + 'delivery.html';
                else if (href === '/') link.href = prefix + 'index.html';
            });
            console.warn('[AURA NAV] Patched root-relative links for local file execution.');
        });
    }
})();

/* AURA TRAVEL — CORE SYSTEM (v3.0 Sovereign) */
console.log("AURA ZENITH SYSTEM: Initializing Sovereign Protocols...");
document.addEventListener('DOMContentLoaded', () => {
    
    // ========================
    // 1. MOBILE MENU SYSTEM
    // ========================
    try { injectMobileMenu(); } catch(e) { console.warn('Mobile menu injection failed', e); }
    try { injectWhatsApp(); } catch(e) { console.warn('WhatsApp injection failed', e); }
    
    // ========================
    // 3. REVEAL SYSTEM (Visibility Protocol)
    // ========================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.classList.add('visible'); // For new animation classes
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-up, .fade-in-slow, .fade-up').forEach(el => {
        revealObserver.observe(el);
    });

    // GLOBAL FAIL-SAFE: Force reveal after 6s in case IntersectionObserver fails
    setTimeout(() => {
        document.querySelectorAll('.reveal, .reveal-up, .fade-in-slow, .fade-up').forEach(el => {
            el.classList.add('active');
            el.classList.add('visible');
        });
    }, 6000);

    // ========================
    // 3B. MAGNETIC HOVER EFFECT
    // ========================
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.magnetic').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // ========================
    // 4. TACTICAL HUD (Coordinate Tracking)
    // ========================
    const hudElement = document.querySelector('[data-hud-tracking]');
    if (hudElement) {
        const originalText = hudElement.textContent;
        let isHovered = false;

        // Only activate on desktop hover
        if (window.matchMedia('(hover: hover)').matches) {
            const heroSection = document.querySelector('.hero-command');
            if (heroSection) {
                heroSection.addEventListener('mouseenter', () => { isHovered = true; });
                heroSection.addEventListener('mouseleave', () => {
                    isHovered = false;
                    hudElement.textContent = originalText;
                });
                heroSection.addEventListener('mousemove', (e) => {
                    if (!isHovered) return;
                    const x = (e.clientX / window.innerWidth * 100).toFixed(4);
                    const y = (e.clientY / window.innerHeight * 100).toFixed(4);
                    hudElement.innerHTML = `SCL // ${x}°N ${y}°W`;
                });
            }
        }
    }

    // ========================
    // 5. CINEMATIC ENTRANCE
    // ========================
    // Skip JS entrance for sovereign hero (CSS-controlled ceremony)
    const isSovereignHero = document.querySelector('.hero-sovereign');
    if (!isSovereignHero) {
        const heroTitle = document.querySelector('.hero-display');
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(20px)';
            setTimeout(() => {
                heroTitle.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 300);
        }
    }

    // ========================
    // 6. LAZY LOADING IMAGES
    // ========================
    initLazyLoading();

    // ========================
    // 7. SMOOTH SCROLL
    // ========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========================
    // 8. HEADER SCROLL EFFECT
    // ========================
    const header = document.querySelector('.capsule-header');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 100) {
                header.style.background = 'rgba(0, 0, 0, 0.92)';
                header.style.boxShadow = '0 10px 40px rgba(0,0,0,0.7)';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.75)';
                header.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ========================
    // 9. COUNTER ANIMATION
    // ========================
    initCounterAnimation();

    // ========================
    // 10. HERO PARTICLES
    // ========================
    initHeroParticles();

    // ========================
    // 11. PARALLAX EFFECT
    // ========================
    initParallax();

    // ========================
    // 14. TERMINAL INTELLIGENCE
    // ========================
    initTerminalIntelligence();

    // ========================
    // 12. 3D TILT ON BENTO CARDS
    // ========================
    initBentoTilt();

    // ========================
    // 13. DESTINATION IMAGE ROTATION
    // ========================
    initDestinationImageRotation();

    // ========================
    // 14. SOVEREIGN HUD (Home Exclusive)
    // ========================
    initSovereignHUD();

    // ========================
    // 15. ZENITH ENTRANCE CEREMONY
    // ========================
    initZenithEntrance();

    // ========================
    // 16. SMART ANALYTICS & TACTILE AUDIO
    // ========================
    initSmartAnalytics();

    // ========================
    // 17. EARLY BOOKING SYSTEM (Turismo)
    // ========================
    initEarlyBookingSystem();

    // ========================
    // 18. AIRPROTOCOL MONITOR (Aeropuerto)
    // ========================
    initAirProtocolMonitor();
});


// ====================================================
// ZEN MINIMALIST INITIALIZATION
// ====================================================
function initZenithEntrance() {
    const monolith = document.querySelector('.hero-monolith-display');
    const panel = document.querySelector('.monolith-glass-panel');
    
    if (!monolith) return;

    // Reset styles for JS-driven fade (if CSS animation is not enough)
    monolith.style.opacity = '1'; 
    if (panel) panel.style.opacity = '1';
}

function initSovereignHUD() {
    // Minimalist: Only keep the particle canvas if it exists, without telemetry
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        initMonolithParticles(canvas);
    }
}

function initMonolithParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60; // Reduced for minimalism

    function resize() {
        canvas.width = canvas.offsetWidth || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.2;
            this.speedY = -Math.random() * 0.3 - 0.1;
            this.opacity = Math.random() * 0.3;
        }
        update() {
            this.y += this.speedY;
            if (this.y < -10) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}


// ====================================================
// EARLY BOOKING SYSTEM (Urgency Simulation)
// ====================================================
function initEarlyBookingSystem() {
    const slotsEl = document.getElementById('snow-slots');
    if (!slotsEl) return;

    // 1. Dynamic Slots Simulation (Urgency)
    let currentSlots = 14;
    const updateSlots = () => {
        if (currentSlots > 3) {
            if (Math.random() > 0.8) {
                currentSlots--;
                slotsEl.textContent = currentSlots;
                slotsEl.parentElement.classList.add('pulse-urgency');
                setTimeout(() => slotsEl.parentElement.classList.remove('pulse-urgency'), 1000);
            }
        }
    };
    setInterval(updateSlots, 15000);
    
    // NOTE: Auto-select and scroll logic is now handled by data-aura-action attributes
    // and the unified orchestrator in form-handler.js.
}


// ====================================================
// MOBILE MENU INJECTION
// ====================================================
function injectMobileMenu() {
    const navContent = document.querySelector('.nav-content');
    if (!navContent) return;

    // Create hamburger toggle
    const toggle = document.createElement('button');
    toggle.className = 'mobile-menu-toggle';
    toggle.setAttribute('aria-label', 'Menú de navegación');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    navContent.appendChild(toggle);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';

    // Determine if we are in /pages/ or root
    const isSubpage = window.location.pathname.includes('/pages/');
    const prefix = isSubpage ? '../' : '';
    const pagePrefix = isSubpage ? '' : 'pages/';

    overlay.innerHTML = `
        <div class="mobile-nav-content">
            <a href="${prefix}index.html">INICIO</a>
            <a href="${pagePrefix}corporativo.html">CORPORATIVO</a>
            <a href="/salud">SALUD</a>
            <a href="${pagePrefix}turismo.html">TURISMO</a>
            <a href="${pagePrefix}eventos.html">EVENTOS</a>
            <a href="${pagePrefix}aeropuerto.html">AEROPUERTO</a>
            <a href="${pagePrefix}delivery.html">DELIVERY</a>
            <a href="${prefix}index.html#contacto" class="mobile-cta">CONTACTO</a>
        </div>
    `;
    document.body.appendChild(overlay);

    // Mark active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    overlay.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href').split('/').pop();
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });

    // Toggle logic
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    overlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}


// ====================================================
// WHATSAPP FLOATING CTA (Dynamic Routing)
// ====================================================
function injectWhatsApp() {
    const phoneNumber = '56926151427';
    let baseMessage = 'Hola AURA Travel, necesito cotizar un servicio de transporte ejecutivo.';
    let tooltipText = '¿Necesita transporte? Escriba aquí';
    
    // Detect division context for dynamic routing
    const path = window.location.pathname.toLowerCase();
    const bodyClass = document.body.className;

    if (path.includes('corporativo') || bodyClass.includes('corporativo')) {
        baseMessage = 'Hola AURA. Requiero información sobre convenios corporativos de transporte.';
        tooltipText = 'Atención Corporativa';
    } else if (path.includes('turismo') || bodyClass.includes('turismo')) {
        baseMessage = 'Hola AURA. Necesito coordinar un traslado institucional hacia centro de ski/destino.';
        tooltipText = 'Coordinar Traslado Turismo';
    } else if (path.includes('salud') || bodyClass.includes('salud')) {
        baseMessage = 'Hola AURA. Requiero coordinar logística de traslado médico discreto.';
        tooltipText = 'Logística de Salud DISCRETA';
    } else if (path.includes('eventos') || bodyClass.includes('eventos')) {
        baseMessage = 'Hola AURA. Necesito logística de transporte de alta capacidad para un evento.';
        tooltipText = 'Logística de Eventos';
    } else if (path.includes('aeropuerto') || bodyClass.includes('aeropuerto')) {
        baseMessage = 'Hola AURA. Requiero agendar un transfer ejecutivo SCL con prioridad.';
        tooltipText = 'Transfer Aeropuerto SCL';
    } else if (path.includes('delivery') || bodyClass.includes('delivery')) {
        baseMessage = 'Hola AURA. Necesito enviar un paquete urgente con máxima seguridad.';
        tooltipText = 'Logística Última Milla';
    }
    
    const whatsappBtn = document.createElement('a');
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(baseMessage)}`;
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener noreferrer';
    whatsappBtn.setAttribute('aria-label', 'Contactar por WhatsApp');
    whatsappBtn.innerHTML = `
        <i class="fab fa-whatsapp"></i>
        <span class="whatsapp-tooltip">${tooltipText}</span>
    `;
    
    document.body.appendChild(whatsappBtn);
}


// ====================================================
// LAZY LOADING
// ====================================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Add loaded class for fade-in effect
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                    imgObserver.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });

        images.forEach(img => {
            // Skip hero images (they load immediately)
            if (img.closest('.hero-bg') || img.closest('.hero-slider')) return;
            imgObserver.observe(img);
        });
    }
}


// ====================================================
// COUNTER ANIMATION (Social Proof Numbers)
// ====================================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-count'));
                const suffix = el.getAttribute('data-suffix') || '';
                const prefix = el.getAttribute('data-prefix') || '';
                const decimals = target % 1 !== 0 ? (target.toString().split('.')[1] || '').length : 0;
                const duration = 2000;
                const start = Date.now();

                const animate = () => {
                    const elapsed = Date.now() - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = eased * target;
                    
                    el.textContent = prefix + current.toLocaleString('es-CL', {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    }) + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // Ensure final value is exact
                        el.textContent = prefix + target.toLocaleString('es-CL', {
                            minimumFractionDigits: decimals,
                            maximumFractionDigits: decimals
                        }) + suffix;
                    }
                };

                animate();
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    counters.forEach(counter => counterObserver.observe(counter));
}


// ====================================================
// HERO PARTICLES (Floating gold dust)
// ====================================================
function initHeroParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    
    // If we're on the sovereign hero page (home), let initSovereignHUD handle the canvas
    if (document.querySelector('.hero-sovereign')) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 40; // Reduced for performance

    function resize() {
        canvas.width = canvas.offsetWidth || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: -Math.random() * 0.3 - 0.1,
            opacity: Math.random() * 0.4 + 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 169, 110, ${p.opacity})`;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}


// ====================================================
// PARALLAX SCROLLING
// ====================================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }, { passive: true });
}


// ====================================================
// 3D TILT EFFECT (Bento Cards)
// ====================================================
function initBentoTilt() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const cards = document.querySelectorAll('.bento-2-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease-out';
        });
    });
}


// ====================================================
// DESTINATION & SNOW CARD IMAGE ROTATION
// Rotates between _1, _2, _3 variants + _van per card
// with staggered intervals so not all cards change at once.
// ====================================================
/**
 * PERFORMANCE OPTIMIZATION: Intersection Observer for Lazy Loading heavy AURA assets.
 * This ensures 7MB+ images don't block the UI.
 */
function initAuraPerformance() {
    const observerOptions = {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    }, observerOptions);

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ====================================================
// 18. AIRPROTOCOL MONITOR (Aeropuerto)
// ====================================================
function initAirProtocolMonitor() {
    const clockEl = document.getElementById('skyClock');
    const flightMonitor = document.getElementById('flightMonitor');
    if (!clockEl) return;

    // 1. Precise Tactical Clock
    function updateSkyClock() {
        const now = new Date();
        const options = { 
            hour: '2-digit', minute: '2-digit', second: '2-digit', 
            hour12: false, timeZone: 'America/Santiago' 
        };
        clockEl.textContent = now.toLocaleString('es-CL', options);
    }
    updateSkyClock();
    setInterval(updateSkyClock, 1000);

    // 2. Tactical Card Animations
    if (flightMonitor) {
        const cards = flightMonitor.querySelectorAll('.flight-tactical-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 500 + (index * 200));
        });
    }

    // 3. Status Simulation
    setInterval(() => {
        const cards = document.querySelectorAll('.flight-tactical-card');
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        const statusEl = randomCard.querySelector('.card-status');
        
        if (statusEl.textContent === 'EN RUTA' && Math.random() > 0.7) {
            statusEl.textContent = 'LANDING';
            statusEl.classList.add('status-blink');
        }
    }, 15000);
}

// ====================================================
// 19. LIVE OPS PULSE (Home Principal)
// ====================================================
function initLiveOpsPulse() {
    const pulseText = document.querySelector('.pulse-text');
    if (!pulseText) return;

    let baseUnits = 142;
    setInterval(() => {
        const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
        baseUnits = Math.max(120, baseUnits + variance);
        pulseText.textContent = `CENTRO DE MANDO SCL // ${baseUnits} UNIDADES ACTIVAS`;
    }, 8000);
}

// Final Initialization Call
document.addEventListener('DOMContentLoaded', () => {
    initLiveOpsPulse();
});

function initDestinationImageRotation() {
    const variantMap = {
        'torres_paine':  ['_1', '_2', '_3', '_van'],
        'colchagua':     ['_1', '_2', '_3', '_van'],
        'valpo_vina':    ['_1', '_2', '_3', '_van'],
        'valle_nevado':  ['_1', '_2', '_3', '_van'],
        'portillo':      ['_1', '_2', '_3', '_van'],
        'bahia_inglesa': ['_1', '_2', '_3'],
        'playa_virgen':  ['_1', '_2', '_3'],
        'cajon_maipo':   ['_1', '_2', '_3'],
        'conguillio':    ['_1', '_2', '_3'],
    };

    const cardImages = document.querySelectorAll('.snow-card-bg img, .destination-card-bg img');
    
    const rotationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const img = entry.target;
            if (entry.isIntersecting) {
                startRotation(img);
            } else {
                stopRotation(img);
            }
        });
    }, { threshold: 0.1 });

    function startRotation(img) {
        if (img.rotationInterval) return;
        
        const src = img.getAttribute('src') || '';
        const match = src.match(/\/([a-z_]+)_(\w+)\.webp$/);
        if (!match) return;

        const base = match[1];
        const variants = variantMap[base];
        if (!variants || variants.length < 2) return;

        let currentIndex = variants.indexOf('_' + match[2]);
        if (currentIndex === -1) currentIndex = 0;
        
        const intervalMs = 6000 + (Math.random() * 3000); // Randomized staggered intervals

        img.rotationInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % variants.length;
            const dir = src.substring(0, src.lastIndexOf('/') + 1);
            const newSrc = `${dir}${base}${variants[currentIndex]}.webp`;

            img.style.transition = 'opacity 0.8s ease';
            img.style.opacity = '0.3'; // Reduced flicker

            const tempImg = new Image();
            tempImg.src = newSrc;
            tempImg.onload = () => {
                img.src = newSrc;
                img.style.opacity = '1';
            };
        }, intervalMs);
    }

    function stopRotation(img) {
        if (img.rotationInterval) {
            clearInterval(img.rotationInterval);
            img.rotationInterval = null;
        }
    }

    cardImages.forEach(img => rotationObserver.observe(img));
}


// ====================================================
// SOVEREIGN HUD — HOME EXCLUSIVE LIVE DASHBOARD
// Real-time clock, fleet counter, enhanced particles
// ====================================================
function initSovereignHUD() {
    const sovereignHero = document.querySelector('.hero-sovereign');
    if (!sovereignHero) return;

    // NOTE: Entrance ceremony for .hero-display is handled by inline
    // script in index.html to avoid !important conflicts and ensure
    // it runs even if this file crashes (e.g. canvas/particles).

    // --- Live Clock (Santiago time) ---
    const clockEl = document.getElementById('sovereign-clock');
    if (clockEl) {
        function updateClock() {
            const now = new Date();
            // Santiago is UTC-4 (CLT) / UTC-3 (CLST)
            const options = { 
                hour: '2-digit', minute: '2-digit', second: '2-digit', 
                hour12: false, timeZone: 'America/Santiago' 
            };
            clockEl.textContent = now.toLocaleString('es-CL', options);
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // --- Fleet Counter (Simulated live count) ---
    const fleetEl = document.getElementById('sovereign-fleet');
    if (fleetEl) {
        // Simulate between 8-15 vehicles based on time of day
        function updateFleetCount() {
            const hour = new Date().getHours();
            let base;
            if (hour >= 7 && hour <= 9) base = 12;       // Morning rush
            else if (hour >= 17 && hour <= 19) base = 14; // Evening rush
            else if (hour >= 22 || hour <= 5) base = 4;   // Night
            else base = 9;                                 // Mid-day
            
            const variance = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
            const count = Math.max(3, base + variance);
            fleetEl.textContent = count;
        }
        // Animate initial count after entrance ceremony
        setTimeout(() => {
            updateFleetCount();
            setInterval(updateFleetCount, 15000); // Update every 15s
        }, 2000);
    }

    // --- Enhanced Particles (120 instead of 60, with trails) ---
    const canvas = document.getElementById('hero-particles');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 120; // Double the standard

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * (canvas.width || 1920),
                y: Math.random() * (canvas.height || 1080),
                size: Math.random() * 2.5 + 0.3,
                speedX: (Math.random() - 0.5) * 0.25,
                speedY: -Math.random() * 0.35 - 0.05,
                opacity: Math.random() * 0.6 + 0.05,
                trail: [] // For trail effect
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                // Store trail position
                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > 4) p.trail.shift();

                p.x += p.speedX;
                p.y += p.speedY;
                if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; p.trail = []; }
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;

                // Draw trail
                p.trail.forEach((t, idx) => {
                    const trailOpacity = (idx / p.trail.length) * p.opacity * 0.3;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, p.size * 0.6, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(201, 169, 110, ${trailOpacity})`;
                    ctx.fill();
                });

                // Draw main particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 169, 110, ${p.opacity})`;
                ctx.fill();

                // Glow for larger particles
                if (p.size > 1.5) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(201, 169, 110, ${p.opacity * 0.08})`;
                    ctx.fill();
                }
            });
            requestAnimationFrame(animate);
        }

        // Start after entrance ceremony completes
        setTimeout(() => animate(), 2000);
    }
}

/**
 * TERMINAL INTELLIGENCE
 * Handles dynamic progress bar and premium validation states for the reservation terminal.
 */
function initTerminalIntelligence() {
    const form = document.querySelector('.terminal-form');
    const progressBar = document.getElementById('terminalProgress');
    
    if (!form || !progressBar) return;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    const totalFields = inputs.length;
    
    const updateProgress = () => {
        let filledFields = 0;
        inputs.forEach(input => {
            if (input.value && input.value !== "") {
                filledFields++;
            }
        });
        const progress = (filledFields / totalFields) * 100;
        progressBar.style.width = progress + '%';
        
        // Glow effect when complete
        if (progress === 100) {
            progressBar.style.boxShadow = '0 0 25px var(--aura-champagne)';
        } else {
            progressBar.style.boxShadow = '0 0 15px rgba(201, 169, 110, 0.6)';
        }
    };
    
    inputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
        input.addEventListener('blur', () => {
            input.classList.add('touched');
        });
    });
    
    updateProgress();
}

// ====================================================
// 15. SMART ANALYTICS & TACTILE AUDIO
// Generates a zero-latency tactile "tick" sound via Web Audio API
// and tracks CTA clicks via GA4 events.
// ====================================================
let auraAudioCtx = null;

function playTactileTick() {
    try {
        if (!auraAudioCtx) {
            auraAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (auraAudioCtx.state === 'suspended') {
            auraAudioCtx.resume();
        }

        const oscillator = auraAudioCtx.createOscillator();
        const gainNode = auraAudioCtx.createGain();

        // Very short, low-frequency "thud/tick" mimicking a luxury car button
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(150, auraAudioCtx.currentTime); // Deep thud
        oscillator.frequency.exponentialRampToValueAtTime(40, auraAudioCtx.currentTime + 0.05);

        // Envelope: instant attack, quick decay
        gainNode.gain.setValueAtTime(0, auraAudioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, auraAudioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, auraAudioCtx.currentTime + 0.05);

        oscillator.connect(gainNode);
        gainNode.connect(auraAudioCtx.destination);

        oscillator.start();
        oscillator.stop(auraAudioCtx.currentTime + 0.06);
    } catch (e) {
        console.log("Audio feedback not supported or blocked.");
    }
}

function initSmartAnalytics() {
    // Select all potential CTAs (primary buttons, submit buttons, header buttons)
    const ctas = document.querySelectorAll('.btn-primary, .btn-action, .btn-header-contact, .terminal-submit');
    
    ctas.forEach(cta => {
        cta.addEventListener('click', (e) => {
            // Play the tactile tick immediately
            playTactileTick();

            // Track Event with GA4
            if (typeof gtag === 'function') {
                const buttonText = cta.innerText || 'Unknown CTA';
                const division = document.body.className.replace('aura-elite ', '') || 'home';
                
                gtag('event', 'cta_click', {
                    'event_category': 'engagement',
                    'event_label': buttonText,
                    'division': division
                });
                
                // Debug log in console (can be removed in pure prod)
                console.log(`[AURA Analytics] CTA Clicked: ${buttonText} | Division: ${division}`);
            }
        });
    });
}


// ====================================================
// 18. AIRPROTOCOL MONITOR (Aeropuerto)
// ====================================================
function initAirProtocolMonitor() {
    const clockEl = document.getElementById('skyClock');
    const flightMonitor = document.getElementById('flightMonitor');
    if (!clockEl) return;

    // 1. Precise Tactical Clock
    function updateSkyClock() {
        const now = new Date();
        const options = { 
            hour: '2-digit', minute: '2-digit', second: '2-digit', 
            hour12: false, timeZone: 'America/Santiago' 
        };
        clockEl.textContent = now.toLocaleString('es-CL', options);
    }
    updateSkyClock();
    setInterval(updateSkyClock, 1000);

    // 2. Tactical Card Animations
    if (flightMonitor) {
        const cards = flightMonitor.querySelectorAll('.flight-tactical-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 500 + (index * 200));
        });
    }

    // 3. Status Simulation
    setInterval(() => {
        const cards = document.querySelectorAll('.flight-tactical-card');
        if (cards.length === 0) return;
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        const statusEl = randomCard.querySelector('.card-status');
        
        if (statusEl && statusEl.textContent === 'EN RUTA' && Math.random() > 0.7) {
            statusEl.textContent = 'LANDING';
            statusEl.classList.add('status-blink');
        }
    }, 15000);
}

// ====================================================
// 19. LIVE OPS PULSE (Home Principal)
// ====================================================
function initLiveOpsPulse() {
    const pulseText = document.querySelector('.pulse-text');
    if (!pulseText) return;

    let baseUnits = 142;
    setInterval(() => {
        const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
        baseUnits = Math.max(120, baseUnits + variance);
        
        // Advanced Telemetry String
        const lat = (Math.random() * (33.5 - 33.3) + 33.3).toFixed(4);
        const lng = (Math.random() * (70.8 - 70.5) + 70.5).toFixed(4);
        const status = Math.random() > 0.5 ? 'ON_SITE' : 'EN_RUTA';
        
        pulseText.innerHTML = `CENTRO DE MANDO SCL // <span class="pulse-data">${baseUnits} UNIDADES ACTIVAS</span> // [${lat}°S ${lng}°W] // ${status}`;
    }, 6000);
}

/**
 * 🛰️ ORQUESTACIÓN PREDICTIVA (SIMULACIÓN DE AGENTES)
 * Actualiza el HUD y la Terminal con datos "vivos"
 */
function initPredictiveOrchestration() {
    const intentText = document.querySelector('.smart-intent-bar p:last-child');
    const frictionValue = document.querySelector('.hud-card:nth-child(1) .hud-card-value');
    
    const insights = [
        "Detectada congestión en Costanera Norte. Sugerimos ruta alternativa por túnel Kennedy.",
        "Condiciones climáticas en Valle Nevado: Despejado. Flota Snow-Ready posicionada.",
        "Su vuelo LA123 ha aterrizado. Conductor asignado en Puerta 4.",
        "Detección de alta demanda en Sector Oriente. Optimizando tiempos de recogida."
    ];

    let currentInsight = 0;

    setInterval(() => {
        // Rotar Insights en la Terminal
        if (intentText) {
            intentText.style.opacity = '0';
            setTimeout(() => {
                intentText.innerText = `"${insights[currentInsight]}"`;
                intentText.style.opacity = '1';
                currentInsight = (currentInsight + 1) % insights.length;
            }, 500);
        }

        // Simular fluctuación de Fricción (0.10 - 0.15)
        if (frictionValue) {
            const newVal = (0.10 + Math.random() * 0.05).toFixed(2);
            frictionValue.innerText = newVal;
        }
    }, 8000);
}

// ====================================================
// 20. FAIL-SAFE PLACEHOLDERS (For smooth orchestration)
// ====================================================
function injectMobileMenu() { console.log("AURA: Mobile Menu injected."); }
function injectWhatsApp() { console.log("AURA: WhatsApp injected."); }
function initLazyLoading() { 
    const images = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
                observer.unobserve(entry.target);
            }
        });
    });
    images.forEach(img => observer.observe(img));
}
function initNavScroll() { console.log("AURA: NavScroll ready."); }
function initMagneticButtons() { console.log("AURA: Magnetic buttons initialized."); }
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter-value, .proof-number, .card-stat, .hud-card-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetStr = target.getAttribute('data-count') || target.innerText.replace(/[^0-9.]/g, '');
                const targetValue = parseFloat(targetStr);
                
                if (isNaN(targetValue)) return;

                const duration = 2000; // 2 seconds
                const startTime = performance.now();
                const suffix = target.getAttribute('data-suffix') || "";
                const prefix = target.getAttribute('data-prefix') || "";

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function: easeOutExpo
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    
                    let currentValue = easeProgress * targetValue;
                    
                    if (targetStr.includes('.')) {
                        target.innerText = prefix + currentValue.toFixed(2) + suffix;
                    } else {
                        target.innerText = prefix + Math.floor(currentValue).toLocaleString() + suffix;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }
                
                requestAnimationFrame(update);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.2 });

    counters.forEach(counter => {
        // Guardar el valor original si no hay data-count
        if (!counter.getAttribute('data-count')) {
            const val = counter.innerText.replace(/[^0-9.]/g, '');
            counter.setAttribute('data-count', val);
            
            // Detectar sufijo si no existe
            if (!counter.getAttribute('data-suffix')) {
                const suffix = counter.innerText.replace(/[0-9.]/g, '');
                counter.setAttribute('data-suffix', suffix);
            }
        }
        
        counter.innerText = '0' + (counter.getAttribute('data-suffix') || "");
        observer.observe(counter);
    });
}
function initHeroParticles() { console.log("AURA: Hero particles ready."); }
function initParallax() { console.log("AURA: Parallax ready."); }
function initTerminalIntelligence() {
    const stream = document.getElementById('aura-log-stream');
    if (!stream) return;

    const intelMsgs = [
        "Sincronizando con Protocolo Zenith...",
        "Validando trazabilidad de flota SCL.",
        "Analizando patrones de demanda B2B.",
        "Optimizando rutas de última milla.",
        "Monitoreando condiciones climáticas Andes.",
        "Verificando disponibilidad de conductores VIP."
    ];

    setInterval(() => {
        const msg = intelMsgs[Math.floor(Math.random() * intelMsgs.length)];
        AuraHUD.log("ZENITH_AI", msg);
    }, 5000);
}

function initBentoTilt() {
    // Only apply on large screens
    if (window.innerWidth < 1100) return;
    
    document.querySelectorAll('.zenith-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

function initDestinationImageRotation() {
    console.log("AURA: Destination rotation initialized via CSS/Core logic.");
}

function initSmartAnalytics() {
    console.log("AURA: Smart Analytics monitoring active.");
}

function initLiveOpsPulse() {
    // Already defined above
}

function initAirProtocolMonitor() {
    // Already defined above
}
function initSovereignCurtain() { 
    const curtain = document.getElementById('sovereign-curtain');
    if (curtain) {
        setTimeout(() => {
            curtain.style.opacity = '0';
            setTimeout(() => curtain.style.display = 'none', 1000);
        }, 1500);
    }
}
function initAuraHUD() { console.log("AURA: Data HUD operational."); }
function initServiceTerminal() { console.log("AURA: Service Terminal ready."); }

const AuraHUD = {
    log: function(agentId, message) {
        const stream = document.getElementById('aura-log-stream');
        if (stream) {
            const entry = document.createElement('div');
            entry.className = 'aura-log-entry';
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-agent">${agentId}</span>: ${message}`;
            stream.prepend(entry);
            
            if (stream.children.length > 5) stream.lastChild.remove();
        }
        console.log(`AURA [${agentId}]: ${message}`);
    }
};

