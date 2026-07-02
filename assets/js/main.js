/* =========================================================================
   EVENTS LABS — « Le Grand Soir » · interactions (toutes pages)
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
const MAIL = {
  fr: { subject: "Demande de devis — Events Labs", body: "Bonjour Events Labs,\n\nJe souhaite un devis pour mon événement.\n\n" },
  ar: { subject: "طلب عرض سعر — Events Labs", body: "مرحبًا Events Labs،\n\nأرغب في عرض سعر لمناسبتي.\n\n" },
  en: { subject: "Quote request — Events Labs", body: "Hello Events Labs,\n\nI'd like a quote for my event.\n\n" }
};
const CURSOR_LABEL = { fr: "Voir", ar: "عرض", en: "View" };

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (REDUCE) document.documentElement.classList.add("no-motion");

/* =========================================================================
   1. Langue / i18n / RTL
   ========================================================================= */
const I18N = window.EL_I18N || {};
let currentLang = "fr";

function waLink(lang = currentLang) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(WA_TEXT[lang] || WA_TEXT.fr)}`;
}
function mailLink(lang = currentLang) {
  const m = MAIL[lang] || MAIL.fr;
  return `mailto:${CONFIG.email}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;
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
  $$("[data-i18n-aria]").forEach(el => {
    const key = el.getAttribute("data-i18n-aria");
    if (dict[key] != null) el.setAttribute("aria-label", dict[key]);
  });
  $$("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
  });

  $$(".lang__btn").forEach(b => b.classList.toggle("is-active", b.dataset.lang === lang));

  refreshLinks();
  const cl = $(".cursor-ring__label");
  if (cl) cl.textContent = CURSOR_LABEL[lang] || "";

  try { localStorage.setItem("el-lang", lang); } catch (e) {}
}

function refreshLinks() {
  $$("[data-wa]").forEach(a => { a.href = waLink(); });
  $$("[data-mail]").forEach(a => { a.href = mailLink(); });
  $$("[data-call]").forEach(a => { a.href = "tel:" + CONFIG.phoneDial; });
  $$("[data-phone-display]").forEach(el => { el.textContent = CONFIG.phoneDisplay; });
  $$("[data-mail-display]").forEach(el => { el.textContent = CONFIG.email; });
}

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
   2. Rideau d'ouverture — landing uniquement, une fois par session
   ========================================================================= */
const curtain = $("#curtain");
(function intro() {
  const raise = () => document.body.classList.add("is-raised");
  if (!curtain) { requestAnimationFrame(() => setTimeout(raise, 80)); return; }

  let seen; try { seen = sessionStorage.getItem("el-intro"); } catch (e) {}
  if (REDUCE || seen) {
    curtain.classList.add("is-gone");
    requestAnimationFrame(() => setTimeout(raise, 80));
    return;
  }
  try { sessionStorage.setItem("el-intro", "1"); } catch (e) {}

  let done = false;
  const open = () => {
    if (done) return;
    done = true;
    curtain.classList.add("is-open");
    setTimeout(raise, 350);
    setTimeout(() => curtain.classList.add("is-gone"), 1300);
  };
  setTimeout(open, 1400);
  curtain.addEventListener("click", open);
  window.addEventListener("keydown", e => { if (e.key === "Escape") open(); }, { once: true });
})();

/* =========================================================================
   3. En-tête : fond, masquage au scroll, fil de progression, FAB
   ========================================================================= */
const header = $("#header");
const progressBar = $(".progress__bar");
const fab = $(".fab-wa");
const hero = $(".hero");
let lastY = 0;

function onScroll() {
  const y = window.scrollY;
  if (header) {
    header.classList.toggle("is-scrolled", y > 40);
    header.classList.toggle("is-hidden", y > 420 && y > lastY && !document.body.classList.contains("menu-open"));
  }
  lastY = y;

  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

  if (fab) {
    const gate = hero ? hero.offsetHeight * 0.6 : 420;
    fab.classList.toggle("is-on", y > gate);
  }
}
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* =========================================================================
   4. Menu mobile
   ========================================================================= */
const burger = $(".burger");
const mnav = $("#mobileNav");
function toggleMenu(open) {
  if (!mnav || !burger) return;
  const isOpen = open ?? !mnav.classList.contains("is-open");
  mnav.classList.toggle("is-open", isOpen);
  mnav.setAttribute("aria-hidden", String(!isOpen));
  burger.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
  if (isOpen && header) header.classList.remove("is-hidden");
}
if (burger) burger.addEventListener("click", () => toggleMenu());
$$("#mobileNav a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));
window.addEventListener("keydown", e => {
  if (e.key === "Escape" && mnav && mnav.classList.contains("is-open")) toggleMenu(false);
});

/* =========================================================================
   5. Curseur custom (desktop, pointeur fin)
   ========================================================================= */
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (finePointer && !REDUCE) {
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  if (dot && ring) {
    let tx = -100, ty = -100, rx = -100, ry = -100, shown = false;

    window.addEventListener("mousemove", e => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; document.body.classList.add("has-cursor"); }
    }, { passive: true });
    document.addEventListener("mouseleave", () => {
      shown = false; document.body.classList.remove("has-cursor");
    });

    (function loop() {
      rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16;
      dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    // Délégation : survit aux changements de DOM (filtres, i18n)
    document.addEventListener("mouseover", e => {
      const view = e.target.closest("[data-cursor='view']");
      const inter = e.target.closest("a, button, .filter, .acc__head");
      ring.classList.toggle("is-view", !!view);
      ring.classList.toggle("is-hover", !view && !!inter);
    });
  }
}

/* =========================================================================
   6. Projecteur du hero — la lumière suit le curseur
   ========================================================================= */
const spot = $(".hero__spot");
if (spot && hero && !REDUCE) {
  let mx = null, my = null, sx = 50, sy = 42;
  hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 100;
    my = ((e.clientY - r.top) / r.height) * 100;
  }, { passive: true });
  hero.addEventListener("pointerleave", () => { mx = null; my = null; });

  (function drift(t) {
    // Sans curseur : la poursuite balaie doucement la scène
    const idleX = 50 + Math.sin(t / 3400) * 16;
    const idleY = 44 + Math.cos(t / 4300) * 9;
    sx += (((mx ?? idleX)) - sx) * 0.055;
    sy += (((my ?? idleY)) - sy) * 0.055;
    spot.style.setProperty("--sx", sx.toFixed(2) + "%");
    spot.style.setProperty("--sy", sy.toFixed(2) + "%");
    requestAnimationFrame(drift);
  })(0);
}

/* =========================================================================
   7. Lucioles — particules dorées sur les fonds de scène
   ========================================================================= */
if (!REDUCE) {
  $$(".sparks").forEach(canvas => {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, parts = [], running = false, raf = 0;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const count = Math.max(14, Math.min(40, Math.round(w / 40)));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: .6 + Math.random() * 1.5,
        vy: .1 + Math.random() * .28,
        drift: .6 + Math.random() * 1.4,
        ph: Math.random() * Math.PI * 2,
        tw: .8 + Math.random() * 1.6,
        warm: Math.random() > .5
      }));
    };

    const tick = t => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy;
        if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
        const x = p.x + Math.sin(t / 1400 * p.drift + p.ph) * 14;
        const a = .16 + .3 * (0.5 + 0.5 * Math.sin(t / 900 * p.tw + p.ph));
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.warm
          ? `rgba(236, 197, 126, ${a})`
          : `rgba(196, 154, 88, ${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    resize();
    window.addEventListener("resize", resize);
    new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? start() : stop()),
      { threshold: 0.05 }).observe(canvas);
    document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  });
}

/* =========================================================================
   8. Reveals au scroll (+ ornements dessinés)
   ========================================================================= */
if (!REDUCE) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
  $$(".rv, .t-reveal, .draw").forEach(el => io.observe(el));
} else {
  $$(".rv, .t-reveal, .draw").forEach(el => el.classList.add("is-in"));
}

/* =========================================================================
   9. Rail des actes (landing) : section active + thème clair/sombre
   ========================================================================= */
const rail = $(".rail");
if (rail) {
  const dots = $$(".rail__dot", rail);
  const paperIds = new Set(["atelier", "services", "approche", "formules"]);
  const sections = ["ouverture", "atelier", "services", "realisations", "approche", "formules", "rsvp"]
    .map(id => document.getElementById(id)).filter(Boolean);

  const sio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      dots.forEach(d => d.classList.toggle("is-active", d.dataset.rail === id));
      rail.classList.toggle("on-paper", paperIds.has(id));
    });
  }, { rootMargin: "-42% 0px -52% 0px" });
  sections.forEach(s => sio.observe(s));

  // Le rail s'efface sur le pied de page
  const footer = $(".footer");
  if (footer) {
    new IntersectionObserver(entries => {
      entries.forEach(e => rail.classList.toggle("is-off", e.isIntersecting));
    }, { threshold: 0.08 }).observe(footer);
  }
}

/* =========================================================================
   10. Compteurs
   ========================================================================= */
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;
  if (REDUCE) { el.textContent = target; return; }
  const dur = 1500, start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const statsIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); statsIO.unobserve(e.target); }
  });
}, { threshold: 0.5 });
$$("[data-count]").forEach(el => statsIO.observe(el));

/* =========================================================================
   11. Accordéons (savoir-faire, FAQ) — un seul volet ouvert par groupe
   ========================================================================= */
$$(".acc").forEach(group => {
  const items = $$(".acc__item", group);
  items.forEach(item => {
    $(".acc__head", item).addEventListener("click", () => {
      const wasOpen = item.classList.contains("is-open");
      items.forEach(i => {
        i.classList.remove("is-open");
        $(".acc__head", i).setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        $(".acc__head", item).setAttribute("aria-expanded", "true");
      }
    });
  });
});

/* =========================================================================
   12. Filmstrip (landing) : drag, flèches, progression
   ========================================================================= */
const strip = $("#strip");
const stripBar = $("#stripBar");
if (strip) {
  const rtl = () => document.documentElement.getAttribute("dir") === "rtl";

  const updateBar = () => {
    const max = strip.scrollWidth - strip.clientWidth;
    const p = max > 0 ? Math.min(Math.abs(strip.scrollLeft) / max, 1) : 0;
    if (stripBar) stripBar.style.transform = `scaleX(${Math.max(p, 0.06)})`;
  };
  strip.addEventListener("scroll", updateBar, { passive: true });
  window.addEventListener("resize", updateBar);
  updateBar();

  const stepPx = () => Math.min(strip.clientWidth * 0.7, 460);
  $("#stripNext")?.addEventListener("click", () =>
    strip.scrollBy({ left: (rtl() ? -1 : 1) * stepPx(), behavior: "smooth" }));
  $("#stripPrev")?.addEventListener("click", () =>
    strip.scrollBy({ left: (rtl() ? 1 : -1) * stepPx(), behavior: "smooth" }));

  let down = false, moved = false, startX = 0, startSL = 0;
  strip.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse") return;
    down = true; moved = false;
    startX = e.clientX; startSL = strip.scrollLeft;
  });
  window.addEventListener("pointermove", e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 7 && !moved) { moved = true; strip.classList.add("is-dragging"); }
    if (moved) strip.scrollLeft = startSL - dx;
  });
  window.addEventListener("pointerup", () => {
    if (!down) return;
    down = false;
    setTimeout(() => strip.classList.remove("is-dragging"), 40);
  });
}

/* =========================================================================
   13. Filtres de galerie (landing + page réalisations)
   ========================================================================= */
const shotsBox = $("[data-shots]");
const filterBtns = $$(".filter");
if (shotsBox && filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const f = btn.dataset.filter;
      $$(".shot", shotsBox).forEach(shot => {
        shot.classList.toggle("is-hidden", f !== "all" && shot.dataset.cat !== f);
      });
      if (shotsBox === strip) strip.scrollTo({ left: 0, behavior: "smooth" });
    });
  });
}

/* =========================================================================
   14. Vignettes vidéo : chargement paresseux + lecture si visible
   ========================================================================= */
if (!REDUCE) {
  const vio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.getAttribute("src") && v.dataset.src) v.setAttribute("src", v.dataset.src);
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.2 });
  $$(".shot__video").forEach(v => vio.observe(v));
}

/* =========================================================================
   15. Lightbox avec navigation
   ========================================================================= */
const lightbox = $("#lightbox");
if (lightbox) {
  const lbInner = $(".lightbox__inner");
  let lbIndex = 0;

  const visibleShots = () => $$(".shot").filter(s => !s.classList.contains("is-hidden"));

  function renderLightbox(shot) {
    const cat = $(".shot__cat", shot)?.textContent || "";
    const name = $(".shot__name", shot)?.textContent || "";
    const vid = $(".shot__video", shot);
    const img = $(".shot__media img", shot);
    const fill = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover";
    let media = "";
    if (vid) {
      const src = vid.getAttribute("src") || vid.dataset.src;
      media = `<video src="${src}" autoplay loop muted playsinline controls style="${fill}"></video>`;
    } else if (img) {
      media = `<img src="${img.src}" alt="" style="${fill}" />`;
    }
    lbInner.innerHTML = media + `<div class="lb-cap"><span class="lb-cat">${cat}</span><span class="lb-name">${name}</span></div>`;
  }

  function openLightbox(shot) {
    lbIndex = visibleShots().indexOf(shot);
    renderLightbox(shot);
    if (typeof lightbox.showModal === "function") lightbox.showModal();
  }
  function stepLightbox(dir) {
    const list = visibleShots();
    if (!list.length) return;
    lbIndex = (lbIndex + dir + list.length) % list.length;
    renderLightbox(list[lbIndex]);
  }

  $$(".shot").forEach(shot => shot.addEventListener("click", () => {
    if (strip && strip.classList.contains("is-dragging")) return;
    openLightbox(shot);
  }));
  $(".lightbox__close")?.addEventListener("click", () => lightbox.close());
  $(".lightbox__nav--prev")?.addEventListener("click", () => stepLightbox(-1));
  $(".lightbox__nav--next")?.addEventListener("click", () => stepLightbox(1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener("close", () => { lbInner.innerHTML = ""; });
  window.addEventListener("keydown", e => {
    if (!lightbox.open) return;
    if (e.key === "ArrowRight") stepLightbox(1);
    if (e.key === "ArrowLeft") stepLightbox(-1);
  });
}

/* =========================================================================
   16. Témoignages : carrousel auto + navigation
   ========================================================================= */
const qcar = $("#qcar");
if (qcar) {
  const slides = $$(".qcar__slide", qcar);
  const count = $("#qCount");
  let idx = 0, timer = null;

  const show = i => {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle("is-active", j === idx));
    if (count) count.textContent = `${idx + 1} / ${slides.length}`;
  };
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  const play = () => {
    if (REDUCE) return;
    stop();
    timer = setInterval(() => show(idx + 1), 7000);
  };

  $("#qNext")?.addEventListener("click", () => { show(idx + 1); play(); });
  $("#qPrev")?.addEventListener("click", () => { show(idx - 1); play(); });
  qcar.addEventListener("mouseenter", stop);
  qcar.addEventListener("mouseleave", play);
  qcar.addEventListener("focusin", stop);
  qcar.addEventListener("focusout", play);
  show(0);
  play();
}

/* =========================================================================
   17. Formulaire R.S.V.P. -> WhatsApp ou e-mail
   ========================================================================= */
const form = $("#quoteForm");
if (form) {
  const LABELS = {
    fr: { intro: "Bonjour Events Labs 👋", n: "Nom", p: "Téléphone", t: "Événement", d: "Date", l: "Lieu", g: "Invités", b: "Budget", m: "Projet" },
    ar: { intro: "مرحبًا Events Labs 👋", n: "الاسم", p: "الهاتف", t: "المناسبة", d: "التاريخ", l: "المكان", g: "الضيوف", b: "الميزانية", m: "المشروع" },
    en: { intro: "Hello Events Labs 👋", n: "Name", p: "Phone", t: "Event", d: "Date", l: "Venue", g: "Guests", b: "Budget", m: "Project" }
  };
  const val = id => $(id)?.value?.trim() || "";

  function formMessage() {
    const L = LABELS[currentLang] || LABELS.fr;
    let t = `${L.intro}\n`;
    const rows = [
      [L.n, val("#f-name")], [L.p, val("#f-phone")], [L.t, val("#f-type")],
      [L.d, val("#f-date")], [L.l, val("#f-place")], [L.g, val("#f-guests")],
      [L.b, val("#f-budget")], [L.m, val("#f-msg")]
    ];
    for (const [label, v] of rows) if (v) t += `\n${label}: ${v}`;
    return t;
  }
  form.addEventListener("submit", e => {
    e.preventDefault();
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(formMessage())}`, "_blank", "noopener");
  });
  $("#quoteMail")?.addEventListener("click", () => {
    const m = MAIL[currentLang] || MAIL.fr;
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(formMessage())}`;
  });
}

/* =========================================================================
   18. Année du footer
   ========================================================================= */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
