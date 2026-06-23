import './style.css'

/* ── BACKGROUND CANVAS: Sky blue gradient + bokeh + bokeh circles ── */
(function(){
  const c = document.getElementById('bg-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H;
  let bokeh = [];
  let stars = [];

  function resize(){
    W = c.width  = window.innerWidth;
    H = c.height = window.innerHeight;
    initBg();
  }

  function initBg(){
    /* bokeh circles — larger and more visible */
    bokeh = [];
    const bk = Math.floor(W * H / 14000) + 18;
    for(let i=0;i<bk;i++){
      const gold = Math.random() < .18;
      bokeh.push({
        x: Math.random()*W, y: Math.random()*H,
        r: Math.random()*80 + 30,
        alpha: Math.random()*.28 + .08,
        speed: (Math.random()-.5)*.0003,
        phase: Math.random()*Math.PI*2,
        baseY: 0,
        gold
      });
      bokeh[bokeh.length-1].baseY = bokeh[bokeh.length-1].y;
    }
    /* twinkle stars */
    stars = [];
    const sn = Math.floor(W*H/2800);
    for(let i=0;i<sn;i++){
      stars.push({
        x: Math.random()*W, y: Math.random()*H,
        r: Math.random()*.9+.2,
        a: Math.random()*.6+.2,
        speed: Math.random()*.002+.001,
        phase: Math.random()*Math.PI*2,
        gold: Math.random()<.15
      });
    }
  }

  let frame = 0;
  function draw(){
    ctx.clearRect(0,0,W,H);

    /* Sky gradient — brighter at top like reference image */
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0,    '#d6eef8');
    grad.addColorStop(0.18, '#b8dff0');
    grad.addColorStop(0.45, '#92c4dd');
    grad.addColorStop(0.75, '#7ab5d0');
    grad.addColorStop(1,    '#5a9ec0');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,W,H);

    /* Strong radial glow burst top-center */
    const burst = ctx.createRadialGradient(W*.5, H*.08, 0, W*.5, H*.08, W*.65);
    burst.addColorStop(0,   'rgba(255,255,255,.62)');
    burst.addColorStop(.3,  'rgba(255,255,255,.22)');
    burst.addColorStop(.6,  'rgba(255,255,255,.06)');
    burst.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = burst;
    ctx.fillRect(0,0,W,H);

    const t = frame * .016;

    /* Bokeh */
    bokeh.forEach(b=>{
      b.y = b.baseY + Math.sin(t * b.speed * 200 + b.phase) * 18;
      const bg = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
      const col = b.gold ? `rgba(245,224,138,${b.alpha})` : `rgba(255,255,255,${b.alpha})`;
      bg.addColorStop(0, col);
      bg.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
      ctx.fill();
    });

    /* Stars */
    stars.forEach(s=>{
      const a = s.a * (.5 + .5*Math.sin(t*s.speed*300+s.phase));
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle = s.gold ? `rgba(245,224,138,${a})` : `rgba(255,255,255,${a+.1})`;
      ctx.fill();
    });

    frame++;
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize',resize);
})();

/* ── CSS SPARKLE PARTICLES ── */
(function(){
  const layer = document.getElementById('sparkle-layer');
  if (!layer) return;
  const colors = ['rgba(255,255,255,.7)','rgba(245,224,138,.75)','rgba(201,148,10,.55)','rgba(194,223,238,.8)'];
  for(let i=0;i<30;i++){
    const p = document.createElement('div');
    p.className='sp';
    const sz = Math.random()*3+.8;
    p.style.cssText=[
      `left:${Math.random()*100}%`,
      `width:${sz}px`,`height:${sz}px`,
      `background:${colors[Math.floor(Math.random()*colors.length)]}`,
      `animation-duration:${Math.random()*16+10}s`,
      `animation-delay:${Math.random()*18}s`
    ].join(';');
    layer.appendChild(p);
  }
})();

/* ── COUNTDOWN ── */
(function(){
  const target = new Date(2026,5,27,18,0,0); // June 27, 2026 at 18:00 (5 = June)
  const pad = n=>String(n).padStart(2,'0');
  function tick(){
    const diff = target - Date.now();
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minEl = document.getElementById('cd-min');
    const secEl = document.getElementById('cd-sec');
    
    if(!daysEl || !hoursEl || !minEl || !secEl) return;
    
    if(diff<=0){
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minEl.textContent = '00';
      secEl.textContent = '00';
      return;
    }
    daysEl.textContent  = pad(Math.floor(diff/86400000));
    hoursEl.textContent = pad(Math.floor((diff%86400000)/3600000));
    minEl.textContent   = pad(Math.floor((diff%3600000)/60000));
    secEl.textContent   = pad(Math.floor((diff%60000)/1000));
  }
  tick(); setInterval(tick,1000);
})();

/* ── SCROLL REVEAL ── */
(function(){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  const hero = document.querySelector('.hero');
  if(hero) setTimeout(()=>hero.classList.add('in'),60);
})();


// Audio & Welcome Screen Logic
const welcomeScreen = document.getElementById('welcomeScreen');
const btnOpen = document.getElementById('btnOpen');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

if (btnOpen && welcomeScreen && bgMusic) {
  btnOpen.addEventListener('click', () => {
    // Start audio
    bgMusic.play().catch(e => console.log('Audio autoplay blocked', e));
    
    // Hide welcome screen
    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
      welcomeScreen.style.display = 'none';
      // Show music toggle
      if (musicToggle) musicToggle.classList.add('visible');
    }, 1000); // matches CSS transition
  });
}

if (musicToggle && bgMusic) {
  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.classList.remove('paused');
    } else {
      bgMusic.pause();
      musicToggle.classList.add('paused');
    }
  });

  // Pausar música cuando la pestaña se oculta o se cambia de app
  let wasPlayingBeforeHide = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Si la música está sonando, pausarla
      if (!bgMusic.paused) {
        wasPlayingBeforeHide = true;
        bgMusic.pause();
        musicToggle.classList.add('paused'); // Actualizar botón
      }
    } else {
      // Si volvimos a la pestaña y la música estaba sonando, reanudarla
      if (wasPlayingBeforeHide) {
        bgMusic.play().catch(e => console.log('Audio resume blocked', e));
        musicToggle.classList.remove('paused');
        wasPlayingBeforeHide = false;
      }
    }
  });
}
