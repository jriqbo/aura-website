/**
 * AURA Travel — Main Application Script
 * Handles navigation, animations, booking form, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initFormTabs();
  initBookingForm();
  initSmoothScroll();
  initNavHighlight();
});

/* --- Scroll Animations (Intersection Observer) --- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* --- Form Tabs --- */
function initFormTabs() {
  const tabs = document.querySelectorAll('.form-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

/* --- Booking Form Submission --- */
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const activeTab = document.querySelector('.form-tab.active');
    const servicio = activeTab ? activeTab.dataset.tab : 'general';

    const nombre = data.get('nombre') || '';
    const telefono = data.get('telefono') || '';
    const origen = data.get('origen') || '';
    const destino = data.get('destino') || '';
    const fecha = data.get('fecha') || '';
    const hora = data.get('hora') || '';
    const comentarios = data.get('comentarios') || '';

    const message = `Hola AURA Travel, solicito cotización:\n` +
      `Servicio: ${servicio}\n` +
      `Nombre: ${nombre}\n` +
      `Teléfono: ${telefono}\n` +
      `Origen: ${origen}\n` +
      `Destino: ${destino}\n` +
      `Fecha: ${fecha} - Hora: ${hora}\n` +
      `Notas: ${comentarios}`;

    const whatsappUrl = `https://wa.me/56926151427?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Show success feedback
    const btn = document.getElementById('btn-submit-booking');
    const originalText = btn.textContent;
    btn.textContent = '✓ Enviado — Abriendo WhatsApp...';
    btn.style.background = '#10B981';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 3000);
  });
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* --- Active Nav Highlight --- */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.floating-nav a:not(.nav-logo)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

