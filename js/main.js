  // mobile nav
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  // scroll progress bar
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = pct + '%';
  });

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); } });
  }, {threshold:.1, rootMargin:'0px 0px -8% 0px'});
  revealEls.forEach(el => io.observe(el));

  // pipeline active-node stepping
  const pipeline = document.getElementById('pipeline');
  const nodes = pipeline.querySelectorAll('.node');
  let step = 0;
  function advance(){
    nodes.forEach(n => n.classList.remove('active'));
    nodes[step].classList.add('active');
    step = (step + 1) % nodes.length;
  }
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!prefersReduced){ setInterval(advance, 1600); }

  // count-up stat animation
  const counters = document.querySelectorAll('.impact-num [data-target], .impact-num[data-target]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const el = e.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1100;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now - start) / duration, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if(p < 1) requestAnimationFrame(tick);
        }
        if(prefersReduced){ el.textContent = target; } else { requestAnimationFrame(tick); }
        countIO.unobserve(el);
      }
    });
  }, {threshold:.4});
  counters.forEach(c => countIO.observe(c));

  // subtle badge tilt on mouse
  const badge = document.getElementById('tiltBadge');
  if(badge && !prefersReduced){
    badge.addEventListener('mousemove', (e) => {
      const r = badge.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      badge.style.transform = `rotateY(${x*8}deg) rotateX(${-y*8}deg)`;
    });
    badge.addEventListener('mouseleave', () => { badge.style.transform = 'rotateY(0) rotateX(0)'; });
  }

  // magnetic buttons — links/stamps gently pull toward the cursor
  if(!prefersReduced){
    const magneticEls = document.querySelectorAll(
      '.hero-links a, .contact-links a, .stamp, .navlinks a, .skill-tag'
    );
    magneticEls.forEach(el => {
      el.classList.add('magnetic');
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width/2);
        const y = e.clientY - (r.top + r.height/2);
        el.style.transform = `translate(${x*0.22}px, ${y*0.32}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0)';
      });
    });
  }
