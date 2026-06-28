/* =========================================================================
   EVENTS LABS — interactions
   ========================================================================= */

/* -------------------------------------------------------------------------
   CONFIG — À RENSEIGNER PAR EVENTS LABS
   Remplacez ces valeurs par les vraies coordonnées. C'est le seul endroit
   à modifier pour brancher WhatsApp / téléphone / e-mail / réseaux.
   ------------------------------------------------------------------------- */
const CONFIG = {
  // Numéro WhatsApp au format international, SANS "+", espaces ni "0" initial.
  // Ex. pour 0550 12 34 56 -> "213550123456"
  whatsapp: "213000000000",
  // Téléphone affiché (format lisible) + numéro à composer
  phoneDisplay: "+213 0 00 00 00 00",
  phoneDial: "+213000000000",
  email: "contact@eventslabs.dz",
  instagram: "https://www.instagram.com/eventslabs.dz",
  facebook: "https://www.facebook.com/eventslabs.dz"
};

/* Messages WhatsApp pré-remplis par langue */
const WA_TEXT = {
  fr: "Bonjour Events Labs 👋 Je souhaite un devis pour mon événement.",
  ar: "مرحبًا Events Labs 👋 أرغب في عرض سعر لمناسبتي.",
  en: "Hello Events Labs 👋 I'd like a quote for my event."
};
const CURSOR_LABEL = { fr: "Voir", ar: "عرض", en: "View" };

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

/* =========================================================================
   1. Langue / i18n / RTL
   ========================================================================= */
const I18N = window.EL_I18N || {};
let currentLang = "fr";

function waLink(lang = currentLang) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(WA_TEXT[lang] || WA_TEXT.fr)}`;
}

function applyLang(lang) {
  const dict = I18N[lang];
  if (!dict) return;
  currentLang = lang;

  const html = document.documentElement;
  html.setAttribute("lang", lang);
  html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] != null) el.innerHTML = dict[key];
  });

  // Boutons de langue
  $$(".lang__btn").forEach(b => b.classList.toggle("is-active", b.dataset.lang === lang));

  // Liens dépendants de la langue
  refreshLinks();
  $(".cursor__label").textContent = CURSOR_LABEL[lang] || "";

  try { localStorage.setItem("el-lang", lang); } catch (e) {}
}

function refreshLinks() {
  $$("[data-wa]").forEach(a => { a.href = waLink(); });
  $$("[data-call]").forEach(a => { a.href = "tel:" + CONFIG.phoneDial; });
  $$("[data-phone-display]").forEach(el => { el.textContent = CONFIG.phoneDisplay; });
  $$("[data-mail-display]").forEach(el => { el.textContent = CONFIG.email; });
}

/* Init langue : ?lang= > localStorage > navigateur > fr */
(function initLang() {
  const param = new URLSearchParams(location.search).get("lang");
  let saved; try { saved = localStorage.getItem("el-lang"); } catch (e) {}
  const nav = (navigator.language || "fr").slice(0, 2);
  const pick = [param, saved, nav, "fr"].find(l => l && I18N[l]) || "fr";
  applyLang(pick);
})();

$$(".lang__btn").forEach(btn =>
  btn.addEventListener("click", () => applyLang(btn.dataset.lang))
);

/* =========================================================================
   2. En-tête : état au scroll
   ========================================================================= */
const header = $("#header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* =========================================================================
   3. Menu mobile
   ========================================================================= */
const burger = $(".burger");
const mobileNav = $("#mobileNav");
function toggleMenu(open) {
  const isOpen = open ?? !mobileNav.classList.contains("is-open");
  mobileNav.classList.toggle("is-open", isOpen);
  mobileNav.setAttribute("aria-hidden", String(!isOpen));
  burger.setAttribute("aria-expanded", String(isOpen));
  header.classList.toggle("over-menu", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
}
burger.addEventListener("click", () => toggleMenu());
$$("#mobileNav a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));

/* =========================================================================
   4. Curseur custom (desktop, pointeur fin)
   ========================================================================= */
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (finePointer) {
  const cursor = $(".cursor");
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function loop() {
    cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
  $$("[data-cursor='view'], a, button").forEach(el => {
    const isView = el.matches("[data-cursor='view']");
    el.addEventListener("mouseenter", () => cursor.classList.toggle("is-view", isView) || cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => { cursor.classList.remove("is-view"); cursor.classList.remove("is-hover"); });
  });
}

/* =========================================================================
   5. Reveal au scroll
   ========================================================================= */
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // Stagger du titre hero
  $$(".hero__title .reveal").forEach((el, i) => el.style.setProperty("--i", i));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach(el => io.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("is-visible"));
}

/* =========================================================================
   6. Compteurs (stats)
   ========================================================================= */
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || isNaN(target)) { el.textContent = target + suffix; return; }
  const dur = 1400; const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const statsIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); statsIO.unobserve(e.target); }
  });
}, { threshold: 0.5 });
$$(".stat__num").forEach(el => statsIO.observe(el));

/* =========================================================================
   7. Filtres galerie
   ========================================================================= */
const filters = $$(".filter");
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    $$(".shot").forEach(shot => {
      const show = f === "all" || shot.dataset.cat === f;
      shot.classList.toggle("is-hidden", !show);
    });
  });
});

/* =========================================================================
   8. Lightbox
   ========================================================================= */
const lightbox = $("#lightbox");
const lbInner = $(".lightbox__inner");
function openLightbox(shot) {
  const media = shot.querySelector(".shot__media");
  const cs = getComputedStyle(media);
  const cat = shot.querySelector(".shot__cat")?.textContent || "";
  const name = shot.querySelector(".shot__name")?.textContent || "";
  lbInner.style.backgroundImage = cs.backgroundImage;
  lbInner.style.backgroundColor = cs.backgroundColor;
  lbInner.innerHTML = `<div class="lb-cap"><span class="lb-cat">${cat}</span><span class="lb-name">${name}</span></div>`;
  if (typeof lightbox.showModal === "function") lightbox.showModal();
}
$$(".shot").forEach(shot => shot.addEventListener("click", () => openLightbox(shot)));
$(".lightbox__close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });

/* =========================================================================
   9. Formulaire -> WhatsApp
   ========================================================================= */
const form = $("#quoteForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#f-name").value.trim();
    const type = $("#f-type").value;
    const date = $("#f-date").value.trim();
    const msg  = $("#f-msg").value.trim();
    const L = {
      fr: { intro: "Bonjour Events Labs 👋", n: "Nom", t: "Événement", d: "Date", m: "Projet" },
      ar: { intro: "مرحبًا Events Labs 👋", n: "الاسم", t: "المناسبة", d: "التاريخ", m: "المشروع" },
      en: { intro: "Hello Events Labs 👋", n: "Name", t: "Event", d: "Date", m: "Project" }
    }[currentLang] || {};
    let text = `${L.intro}\n`;
    if (name) text += `\n${L.n}: ${name}`;
    if (type) text += `\n${L.t}: ${type}`;
    if (date) text += `\n${L.d}: ${date}`;
    if (msg)  text += `\n${L.m}: ${msg}`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });
}

/* =========================================================================
   10. Année footer + ancrages doux
   ========================================================================= */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
