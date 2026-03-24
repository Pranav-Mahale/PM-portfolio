/**
 * ============================================================
 *  PRANAV MAHALE – PORTFOLIO  |  script.js
 *  Features:
 *    - Dark / Light theme toggle (localStorage persistent)
 *    - Animated typing effect in hero section
 *    - Scroll-reveal animations (IntersectionObserver)
 *    - Sticky nav with scroll class + active link tracking
 *    - Scroll progress indicator
 *    - Animated stat counters (count-up)
 *    - Hamburger / mobile menu toggle
 *    - Back-to-top button
 *    - Contact form JS validation
 * ============================================================
 */

/* ─── 1. DOM Ready ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initRevealAnimations();
  initTypingEffect();
  initCounterAnimation();
  initBackToTop();
  initContactForm();
  initSmoothScroll();
});

/* ─── 2. Theme Toggle (Dark / Light) ─────────────────────── */
function initTheme() {
  const toggleBtn  = document.getElementById('theme-toggle');
  const themeIcon  = document.getElementById('theme-icon');
  const htmlEl     = document.documentElement;

  // Restore persisted preference (default: dark)
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);

  toggleBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    // Swap icon: moon for dark, sun for light
    themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

/* ─── 3. Scroll Progress Bar ──────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = `${scrollPct}%`;
  }, { passive: true });
}

/* ─── 4. Sticky Navbar ────────────────────────────────────── */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  // Add .scrolled class when user scrolls down
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    highlightActiveLink();
  }, { passive: true });

  function highlightActiveLink() {
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }
}

/* ─── 5. Mobile Menu ──────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMenu(forceClose = false) {
    const isOpen = hamburger.classList.contains('open') && !forceClose;
    hamburger.classList.toggle('open', !isOpen);
    mobileMenu.classList.toggle('open', !isOpen);
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.setAttribute('aria-hidden', String(isOpen));
    document.body.style.overflow = (!isOpen) ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMenu());

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      if (hamburger.classList.contains('open')) toggleMenu(true);
    }
  });
}

/* ─── 6. Scroll Reveal Animations ────────────────────────── */
function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal for performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

/* ─── 7. Typing / Typewriter Effect ──────────────────────── */
function initTypingEffect() {
  const typedEl = document.getElementById('typed-text');
  if (!typedEl) return;

  const roles = [
    'Senior SDET',
    'QA Automation Engineer',
    'Playwright Expert',
    'Cypress Specialist',
    'AI Testing Enthusiast',
    'DevOps-Aware QA Lead',
  ];

  let roleIdx    = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let delay      = 120;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      // Remove one character
      typedEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      delay = 60;
    } else {
      // Add one character
      typedEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      delay = 100;
    }

    // Start deleting once the word is fully typed (pause 1.8s)
    if (!isDeleting && charIdx === currentRole.length) {
      delay = 1800;
      isDeleting = true;
    }

    // Move to next word once fully deleted (pause 400ms)
    if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx    = (roleIdx + 1) % roles.length;
      delay      = 400;
    }

    setTimeout(type, delay);
  }

  // Start typing after a short delay to let hero load
  setTimeout(type, 800);
}

/* ─── 8. Animated Counter (Stats) ────────────────────────── */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800; // ms
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }
}

/* ─── 9. Back-to-Top Button ───────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── 10. Contact Form Validation ────────────────────────── */
function initContactForm() {
  const form       = document.getElementById('contact-form');
  if (!form) return;

  const nameInput    = document.getElementById('form-name');
  const emailInput   = document.getElementById('form-email');
  const subjectInput = document.getElementById('form-subject');
  const msgInput     = document.getElementById('form-message');
  const submitBtn    = document.getElementById('submit-btn');
  const successMsg   = document.getElementById('form-success');

  // Real-time validation on blur
  [nameInput, emailInput, subjectInput, msgInput].forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const valid = [
      validateField(nameInput),
      validateField(emailInput),
      validateField(subjectInput),
      validateField(msgInput),
    ].every(Boolean);

    if (!valid) return;

    // Simulate async send (show loading state)
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    submitBtn.disabled  = true;
    btnText.hidden      = true;
    btnLoading.hidden   = false;

    await simulateSend(1500);

    // Reset UI
    submitBtn.disabled  = false;
    btnText.hidden      = false;
    btnLoading.hidden   = true;

    // Show success
    successMsg.hidden = false;
    form.reset();

    // Hide success after 5s
    setTimeout(() => { successMsg.hidden = true; }, 5000);
  });

  /* Validation helper */
  function validateField(field) {
    let errorMsg = '';
    const value  = field.value.trim();
    const id     = field.id;

    if (!value) {
      errorMsg = 'This field is required.';
    } else if (id === 'form-email' && !isValidEmail(value)) {
      errorMsg = 'Please enter a valid email address.';
    } else if (id === 'form-name' && value.length < 2) {
      errorMsg = 'Name must be at least 2 characters.';
    } else if (id === 'form-message' && value.length < 15) {
      errorMsg = 'Message must be at least 15 characters.';
    }

    // Map field to error span
    const errorSpanMap = {
      'form-name':    'name-error',
      'form-email':   'email-error',
      'form-subject': 'subject-error',
      'form-message': 'message-error',
    };

    const errorSpan = document.getElementById(errorSpanMap[id]);
    if (errorSpan) errorSpan.textContent = errorMsg;

    if (errorMsg) {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
      return false;
    } else {
      field.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');
      return true;
    }
  }

  /* Email regex */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* Simulated async send (replace with real API/mailto call) */
  function simulateSend(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/* ─── 11. Smooth Scroll for Anchor Links ─────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── 12. Particle / Sparkle cursor micro-effect ─────────── */
(function initCursorSparkle() {
  // Lightweight cursor sparkle on desktop only
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const colors = ['#7c3aed', '#06b6d4', '#f43f5e', '#a78bfa', '#34d399'];

  document.addEventListener('mousemove', throttle((e) => {
    if (Math.random() > 0.25) return; // Only spawn ~25% of moves
    spawnParticle(e.clientX, e.clientY);
  }, 30));

  function spawnParticle(x, y) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      border-radius: 50%;
      width: 6px;
      height: 6px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${x}px;
      top:  ${y}px;
      transform: translate(-50%, -50%) scale(1);
      transition: transform 0.6s ease, opacity 0.6s ease;
      opacity: 0.7;
    `;
    document.body.appendChild(dot);

    requestAnimationFrame(() => {
      dot.style.transform = `translate(-50%, -50%) scale(0) translate(${randBetween(-30, 30)}px, ${randBetween(-40, -10)}px)`;
      dot.style.opacity   = '0';
    });

    setTimeout(() => dot.remove(), 650);
  }

  function randBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
})();

/* ─── Utility: Throttle ───────────────────────────────────── */
function throttle(fn, limit) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= limit) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
