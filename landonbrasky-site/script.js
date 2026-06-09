// ── NAV SCROLL + PROGRESS BAR ──
const nav         = document.getElementById('nav');
const navProgress = document.getElementById('navProgress');
const backToTop   = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  nav.classList.toggle('scrolled', scrolled > 40);

  if (navProgress) {
    const total = document.body.scrollHeight - window.innerHeight;
    navProgress.style.width = (scrolled / total * 100) + '%';
  }

  if (backToTop) backToTop.classList.toggle('visible', scrolled > 400);
}, { passive: true });

// ── MOBILE NAV ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ── BACK TO TOP ──
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── CURSOR GLOW ──
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
  }, { passive: true });
}

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── ANIMATED STAT COUNTERS ──
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const start    = target > 100 ? target - 12 : 0;
  const duration = 1200;
  const t0       = performance.now();

  function step(now) {
    const p    = Math.min((now - t0) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(start + (target - start) * ease) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.dataset.target) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

// ── TYPING ANIMATION ──
const phrases = [
  'Problem-solver. Builder. Leader.',
  'Manufacturing Engineering Intern.',
  'Industrial Engineering @ Purdue.',
  'Lean Six Sigma Green Belt.',
  'Robotics Driver, Builder & Programmer.',
];

const typedEl = document.getElementById('typedText');
if (typedEl) {
  let phraseIndex = 0;
  let charIndex   = 0;
  let deleting    = false;

  function type() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        setTimeout(() => { deleting = true; type(); }, 2400);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(type, deleting ? 32 : 52);
  }

  setTimeout(type, 800);
}
