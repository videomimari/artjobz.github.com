document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile menu toggle ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('is-open');
      mainNav.style.display = mainNav.classList.contains('is-open') ? 'flex' : '';
    });
  }

  /* ---------- Recording timecode (TC) counter ---------- */
  const tcEl = document.getElementById('tcCounter');
  if (tcEl) {
    let frames = 0;
    const fps = 24;
    setInterval(() => {
      frames++;
      const totalSeconds = Math.floor(frames / fps);
      const f = frames % fps;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      const pad = n => String(n).padStart(2, '0');
      tcEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
    }, 1000 / fps);
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Staggered hero title reveal ---------- */
  document.querySelectorAll('.hero-title .reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
  });

  /* ---------- Animated stat counters ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statObserver.observe(el));

  /* ---------- Header background on scroll ---------- */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.background = 'rgba(10,10,10,0.85)';
      header.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
    } else {
      header.style.background = 'linear-gradient(to bottom, rgba(10,10,10,0.85), transparent)';
      header.style.borderBottom = 'none';
    }
  });

  /* ---------- Showreel button placeholder ---------- */
  const playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      alert('Showreel videonuzu buraya bağlayın (ör. Vimeo / YouTube linki).');
    });
  }

});
