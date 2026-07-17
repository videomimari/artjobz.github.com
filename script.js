// ============ REEL / PORTFOLIO DATA ============
// Edit this list to add, remove or re-link portfolio categories.
// "href" currently points at the matching page on the live Wix site so links
// keep working today — swap these to your own pages/videos as you build them.
const reels = [
  {
    tc: "SPOOL 01",
    title: "YouTube",
    desc: "Uzun format içerik ve kanal prodüksiyonu.",
    href: "https://www.mimsinanb.com/youtube"
  },
  {
    tc: "SPOOL 02",
    title: "Mekan Tanıtım",
    desc: "Mekanların atmosferini anlatan tanıtım filmleri.",
    href: "https://www.mimsinanb.com/mekan-tan%C4%B1t%C4%B1m"
  },
  {
    tc: "SPOOL 03",
    title: "Klip",
    desc: "Müzik klipleri ve ritme kurulu görsel kurgu.",
    href: "https://www.mimsinanb.com/klip"
  },
  {
    tc: "SPOOL 04",
    title: "Etkinlik",
    desc: "Organizasyon ve etkinliklerin sahne arkası.",
    href: "https://www.mimsinanb.com/etkinlik"
  },
  {
    tc: "SPOOL 05",
    title: "Reels",
    desc: "Sosyal medya için kısa format üretimler.",
    href: "https://www.mimsinanb.com/reels"
  },
  {
    tc: "SPOOL 06",
    title: "Marka İşbirliği",
    desc: "THY, McDonald's, Adidas ile marka projeleri.",
    href: "https://www.mimsinanb.com/marka-i-%C5%9Fbirli%C4%9Fi"
  },
  {
    tc: "SPOOL 07",
    title: "Sağlık Sektörü",
    desc: "Klinik ve sağlık markaları için içerik üretimi.",
    href: "https://www.mimsinanb.com/sa%C4%9Fl%C4%B1k-sekt%C3%B6r%C3%BC"
  }
];

function renderReels(){
  const grid = document.getElementById("reelsGrid");
  if(!grid) return;
  grid.innerHTML = reels.map(r => `
    <a class="reel reveal" href="${r.href}" target="_blank" rel="noopener">
      <span class="reel__tc">${r.tc}</span>
      <div>
        <h3 class="reel__title">${r.title}</h3>
        <p class="reel__desc">${r.desc}</p>
      </div>
      <span class="reel__go">
        İZLE
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </span>
    </a>
  `).join("");
  observeReveals();
}

// ============ ROLE ROTATOR ============
const roles = ["Yönetmen", "Videographer", "Görüntü Yönetmeni", "İçerik Yapımcısı"];
let roleIndex = 0;
function rotateRole(){
  const el = document.getElementById("roleRotator");
  if(!el) return;
  roleIndex = (roleIndex + 1) % roles.length;
  el.style.opacity = 0;
  setTimeout(() => {
    el.textContent = roles[roleIndex];
    el.style.opacity = 1;
  }, 220);
}
setInterval(rotateRole, 2600);

// ============ HUD TIMECODE ============
function pad(n){ return String(n).padStart(2, "0"); }
function tickTimecode(){
  const now = new Date();
  const frames = Math.floor((now.getMilliseconds() / 1000) * 24);
  const tc = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}:${pad(frames)}`;
  const hud = document.getElementById("timecode");
  const foot = document.getElementById("footerTc");
  if(hud) hud.textContent = tc;
  if(foot) foot.textContent = tc;
}
setInterval(tickTimecode, 1000/24);

// ============ NAV TOGGLE (mobile) ============
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if(navToggle && navLinks){
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open);
  });
  navLinks.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );
}

// ============ SCROLL REVEAL ============
function observeReveals(){
  const els = document.querySelectorAll(".reveal:not(.is-visible)");
  if(!("IntersectionObserver" in window)){
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

// ============ INIT ============
document.getElementById("year").textContent = new Date().getFullYear();
renderReels();
document.querySelectorAll(".about, .contact, .fact, .about__copy").forEach(el => el.classList.add("reveal"));
observeReveals();
