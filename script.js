// ============ VIDEO GALLERY ============
// Video listesi videos.json dosyasından okunuyor.
// Yeni video eklemek için o dosyaya bir obje eklemen yeterli — bu dosyayı
// düzenlemene gerek yok.
const CATEGORIES = ["Youtube", "Mekan Tanıtım", "Klip", "Etkinlik", "Reels", "Marka İşbirliği", "Sağlık Sektörü"];

// Kategori kartı görselleri — istersen kendi fotoğraflarınla değiştir.
const CATEGORY_META = {
  "Youtube":          "https://images.unsplash.com/photo-1727425867955-410b097a2719?auto=format&fit=crop&w=700&q=65",
  "Mekan Tanıtım":     "https://images.unsplash.com/photo-1756706815775-0a66d4301a20?auto=format&fit=crop&w=700&q=65",
  "Klip":             "https://images.unsplash.com/photo-1690460814053-5906ac3e90cd?auto=format&fit=crop&w=700&q=65",
  "Etkinlik":         "https://images.unsplash.com/photo-1666289186874-0d023fe7d002?auto=format&fit=crop&w=700&q=65",
  "Reels":            "https://images.unsplash.com/photo-1758874573052-4499233b02a4?auto=format&fit=crop&w=700&q=65",
  "Marka İşbirliği":   "https://images.unsplash.com/photo-1462927114214-6956d2fddd4e?auto=format&fit=crop&w=700&q=65",
  "Sağlık Sektörü":    "https://images.unsplash.com/photo-1631507623095-c710d184498f?auto=format&fit=crop&w=700&q=65"
};

function renderCatGrid(){
  const grid = document.getElementById("catGrid");
  if(!grid) return;
  grid.innerHTML = CATEGORIES.map((c, i) => `
    <div class="cat-card reveal" data-cat="${c}" tabindex="0" role="button" aria-label="${c} kategorisini filtrele">
      <img src="${CATEGORY_META[c]}" alt="${c}" loading="lazy">
      <div class="cat-card__body">
        <span class="cat-card__num">0${i + 1}</span>
        <h3 class="cat-card__title">${c}</h3>
        <span class="cat-card__cta">
          PROJELERİ İNCELE
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".cat-card").forEach(card => {
    const go = () => {
      activeCategory = card.dataset.cat;
      renderFilters();
      renderGallery();
      document.getElementById("filters").scrollIntoView({ behavior: "smooth", block: "start" });
    };
    card.addEventListener("click", go);
    card.addEventListener("keydown", (e) => { if(e.key === "Enter") go(); });
  });

  observeReveals();
}

let allVideos = [];
let activeCategory = "Tümü";

function youtubeThumb(id){
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
function youtubeEmbed(id){
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
}

async function loadVideos(){
  const grid = document.getElementById("gallery");
  if(!grid) return;
  try{
    const res = await fetch("videos.json", { cache: "no-store" });
    if(!res.ok) throw new Error("videos.json okunamadı");
    const data = await res.json();
    allVideos = Array.isArray(data) ? data : [];
  }catch(err){
    console.error(err);
    allVideos = [];
    grid.innerHTML = `<p class="gallery__empty">Videolar yüklenemedi. Yerel önizlemede test ediyorsan basit bir sunucu üzerinden aç (bkz. README).</p>`;
    return;
  }
  renderFilters();
  renderGallery();
}

function renderFilters(){
  const wrap = document.getElementById("filters");
  if(!wrap) return;
  const cats = ["Tümü", ...CATEGORIES];
  wrap.innerHTML = cats.map(c => `
    <button class="filter-chip ${c === activeCategory ? "is-active" : ""}" data-cat="${c}" role="tab" aria-selected="${c === activeCategory}">
      ${c}
    </button>
  `).join("");
  wrap.querySelectorAll(".filter-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      renderFilters();
      renderGallery();
    });
  });
}

function renderGallery(){
  const grid = document.getElementById("gallery");
  const empty = document.getElementById("galleryEmpty");
  if(!grid) return;

  const list = activeCategory === "Tümü"
    ? allVideos
    : allVideos.filter(v => v.category === activeCategory);

  if(list.length === 0){
    grid.innerHTML = "";
    if(empty) empty.hidden = false;
    return;
  }
  if(empty) empty.hidden = true;

  grid.innerHTML = list.map((v, i) => `
    <div class="video-card reveal" data-index="${i}" data-title="${escapeHtml(v.title)}" data-yt="${v.youtubeId}" tabindex="0" role="button" aria-label="${escapeHtml(v.title)} videosunu oynat">
      <div class="video-card__thumb">
        <img src="${youtubeThumb(v.youtubeId)}" alt="${escapeHtml(v.title)}" loading="lazy">
        <span class="video-card__play">
          <span>
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </span>
        </span>
      </div>
      <div class="video-card__body">
        <span class="video-card__cat">${v.category}</span>
        <h3 class="video-card__title">${escapeHtml(v.title)}</h3>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".video-card").forEach(card => {
    const open = () => openModal(card.dataset.yt, card.dataset.title);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => { if(e.key === "Enter") open(); });
  });

  observeReveals();
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[s]));
}

// ============ MODAL PLAYER ============
const modal = document.getElementById("videoModal");
const modalIframe = document.getElementById("modalIframe");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("modalClose");

function openModal(youtubeId, title){
  if(!modal || !modalIframe) return;
  modalIframe.src = youtubeEmbed(youtubeId);
  modalTitle.textContent = title;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeModal(){
  if(!modal || !modalIframe) return;
  modal.hidden = true;
  modalIframe.src = "";
  document.body.style.overflow = "";
}
if(modal){
  modal.addEventListener("click", (e) => { if(e.target.dataset.close) closeModal(); });
}
if(modalClose) modalClose.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeModal(); });

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

// ============ CONTACT FORM (mailto) ============
// Statik site olduğu için form bir sunucuya gönderim yapmıyor;
// doldurulan bilgilerle bir e-posta taslağı hazırlayıp mail uygulamanı açıyor.
const contactForm = document.getElementById("contactForm");
if(contactForm){
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const projectType = data.get("projectType") || "";
    const budget = data.get("budget") || "";
    const date = data.get("date") || "";
    const message = data.get("message") || "";

    const subject = `Yeni proje talebi — ${projectType}`;
    const bodyLines = [
      `Proje Türü: ${projectType}`,
      `Bütçe Aralığı: ${budget}`,
      date ? `Tahmini Tarih: ${date}` : null,
      "",
      "Mesaj:",
      message
    ].filter(Boolean);

    const mailto = `mailto:mimsinanb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;
  });
}

// ============ INIT ============
document.getElementById("year").textContent = new Date().getFullYear();
renderCatGrid();
loadVideos();
document.querySelectorAll(".about, .contact, .fact, .about__copy").forEach(el => el.classList.add("reveal"));
observeReveals();
