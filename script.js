// ── NAV SCROLL + PROGRESS ──
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
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── ANIMATED COUNTERS ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const start  = target > 100 ? target - 12 : 0;
  const t0     = performance.now();
  const dur    = 1200;
  function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(start + (target - start) * ease) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.dataset.target) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  }),
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
  let pi = 0, ci = 0, del = false;
  function type() {
    const cur = phrases[pi];
    if (!del) {
      typedEl.textContent = cur.slice(0, ci + 1);
      ci++;
      if (ci === cur.length) { setTimeout(() => { del = true; type(); }, 2400); return; }
    } else {
      typedEl.textContent = cur.slice(0, ci - 1);
      ci--;
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, del ? 32 : 52);
  }
  setTimeout(type, 1600);
}

// ── CONSTELLATION PARTICLES ──
const canvas = document.getElementById('particleCanvas');
if (canvas && window.matchMedia('(min-width: 768px)').matches) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  class Dot {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.r  = Math.random() * 1.5 + 0.5;
      this.o  = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(249,115,22,${this.o})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 70; i++) particles.push(new Dot());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(249,115,22,${0.07 * (1 - d / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  (function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  })();
}

// ── 3D PHOTO TILT ──
const photoFrame  = document.getElementById('photoFrame');
const heroVisual  = document.querySelector('.hero-visual');
if (photoFrame && heroVisual && window.matchMedia('(pointer: fine)').matches) {
  heroVisual.addEventListener('mousemove', e => {
    const rect = photoFrame.getBoundingClientRect();
    const rx = ((e.clientY - rect.top  - rect.height / 2) / rect.height) * -22;
    const ry = ((e.clientX - rect.left - rect.width  / 2) / rect.width)  *  22;
    photoFrame.style.transition = 'transform 0.1s ease';
    photoFrame.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
  });
  heroVisual.addEventListener('mouseleave', () => {
    photoFrame.style.transition = 'transform 0.6s ease';
    photoFrame.style.transform  = 'rotate(2deg)';
  });
}

// ── MAGNETIC BUTTONS ──
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.18;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.18;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
