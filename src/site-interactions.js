import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let activeLenis = null;
let lenisTickerFn = null;
let activeEventListeners = [];

export function cleanupSiteInteractions() {
  // Remove event listeners
  activeEventListeners.forEach(({ target, type, handler, options }) => {
    target.removeEventListener(type, handler, options);
  });
  activeEventListeners = [];

  // Remove GSAP ticker function
  if (lenisTickerFn) {
    gsap.ticker.remove(lenisTickerFn);
    lenisTickerFn = null;
  }

  // Destroy Lenis
  if (activeLenis) {
    activeLenis.destroy();
    activeLenis = null;
  }

  // Kill all active ScrollTriggers
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

export function initSiteInteractions() {
  "use strict";

  cleanupSiteInteractions();

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";

  document.documentElement.classList.remove("no-js");
  if (reduced || !hasGsap) document.documentElement.classList.add("no-motion");

  const addTrackedListener = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    activeEventListeners.push({ target, type, handler, options });
  };

  /* ── Ultra-smooth scroll (Lenis) with zero input lag & adaptive sync ── */
  if (!reduced && hasGsap && typeof Lenis !== "undefined") {
    activeLenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      syncTouch: false,
    });

    activeLenis.on("scroll", ScrollTrigger.update);

    lenisTickerFn = (time) => {
      activeLenis?.raf(time * 1000);
    };

    gsap.ticker.add(lenisTickerFn);
    gsap.ticker.lagSmoothing(0);
  }

  /* ── anchor navigation through Lenis ── */
  function scrollToTarget(sel) {
    const el = document.querySelector(sel);
    if (!el) return;
    if (activeLenis) activeLenis.scrollTo(el, { offset: -80, duration: 1.0 });
    else el.scrollIntoView({ behavior: "smooth" });
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const clickHandler = (e) => {
      const id = a.getAttribute("href");
      if (id && id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        closeMenu();
        scrollToTarget(id);
      }
    };
    addTrackedListener(a, "click", clickHandler);
  });

  /* ── nav state ── */
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
    addTrackedListener(window, "scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── mobile menu ── */
  const burger = document.getElementById("burger");
  const mmenu = document.getElementById("mmenu");
  function closeMenu() {
    if (!burger || !mmenu) return;
    burger.classList.remove("open");
    mmenu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    mmenu.setAttribute("aria-hidden", "true");
    if (activeLenis) activeLenis.start();
  }

  if (burger && mmenu) {
    const burgerClick = () => {
      const open = !mmenu.classList.contains("open");
      burger.classList.toggle("open", open);
      mmenu.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      mmenu.setAttribute("aria-hidden", String(!open));
      if (activeLenis) (open ? activeLenis.stop() : activeLenis.start());
    };
    addTrackedListener(burger, "click", burgerClick);
  }

  /* ── locality chips + finder → highlight a card ── */
  function spotlight(locality) {
    const card = document.querySelector(`.rcard[data-locality="${locality}"]`);
    if (!card || !hasGsap || reduced) return;
    gsap.fromTo(
      card,
      { boxShadow: "0 0 0 0 rgba(251,112,9,.55)" },
      { boxShadow: "0 0 0 14px rgba(251,112,9,0)", duration: 1.2, ease: "power2.out", clearProps: "boxShadow", delay: 0.6 }
    );
  }

  document.querySelectorAll(".chip").forEach((chip) => {
    addTrackedListener(chip, "click", () => spotlight(chip.dataset.locality));
  });

  const finderForm = document.getElementById("finder");
  if (finderForm) {
    const finderSubmit = (e) => {
      e.preventDefault();
      const locEl = document.getElementById("f-locality");
      const loc = locEl ? locEl.value : "";
      scrollToTarget("#residences");
      if (loc) spotlight(loc);
    };
    addTrackedListener(finderForm, "submit", finderSubmit);
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll(".faq__item").forEach((item) => {
    const btn = item.querySelector(".faq__q");
    const panel = item.querySelector(".faq__a");
    if (btn && panel) {
      const toggleFaq = () => {
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq__item.open").forEach((other) => {
          other.classList.remove("open");
          const otherPanel = other.querySelector(".faq__a");
          if (otherPanel) {
            otherPanel.style.maxHeight = "0px";
            otherPanel.setAttribute("aria-hidden", "true");
          }
          const otherBtn = other.querySelector(".faq__q");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          panel.style.maxHeight = panel.scrollHeight + "px";
          panel.setAttribute("aria-hidden", "false");
          btn.setAttribute("aria-expanded", "true");
        }
      };
      addTrackedListener(btn, "click", toggleFaq);
    }
  });

  /* ── rolling resident stories ── */
  const storiesMarquee = document.querySelector(".stories__marquee");
  if (storiesMarquee) {
    let originalRows = [...storiesMarquee.querySelectorAll(".stories__row")].map((row) => row.cloneNode(true));
    const reviews = [...storiesMarquee.querySelectorAll('.tcard:not([aria-hidden="true"])')].map((card) => card.cloneNode(true));
    if (originalRows.length === 0 && reviews.length > 0) {
      const rowA = document.createElement("div");
      rowA.className = "stories__row stories__row--a";
      const rowB = document.createElement("div");
      rowB.className = "stories__row stories__row--b";
      const half = Math.ceil(reviews.length / 2);
      const revA = reviews.slice(0, half);
      const revB = reviews.slice(half);
      [...revA, ...revA.map((r) => { const c = r.cloneNode(true); c.setAttribute("aria-hidden", "true"); return c; })].forEach((r) => rowA.append(r));
      [...revB, ...revB.map((r) => { const c = r.cloneNode(true); c.setAttribute("aria-hidden", "true"); return c; })].forEach((r) => rowB.append(r));
      originalRows = [rowA, rowB];
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let storiesResizeTimer;

    const buildStoryDisplay = () => {
      // Mobile screen (<= 768px): Horizontal bidirectional marquee (left-to-right and right-to-left)
      // Desktop screen (> 768px): Untouched 3 vertical rolling columns layout
      if (window.innerWidth <= 768) {
        storiesMarquee.classList.remove("stories__marquee--columns");
        storiesMarquee.classList.toggle("stories__marquee--static", reducedMotion.matches);
        storiesMarquee.replaceChildren(...originalRows.map((row) => row.cloneNode(true)));
        return;
      }

      const columnCount = reducedMotion.matches ? 1 : window.innerWidth <= 1080 ? 2 : 3;
      const columns = Array.from({ length: columnCount }, () => []);
      reviews.forEach((review, index) => columns[index % columnCount].push(review));

      const columnElements = columns.map((columnReviews, index) => {
        const column = document.createElement("div");
        column.className = `stories__column stories__column--${index + 1}`;

        const track = document.createElement("div");
        track.className = "stories__column-track";
        track.style.setProperty("--duration", `${34 + index * 5}s`);

        columnReviews.forEach((review) => track.append(review.cloneNode(true)));
        columnReviews.forEach((review) => {
          const duplicate = review.cloneNode(true);
          duplicate.setAttribute("aria-hidden", "true");
          track.append(duplicate);
        });

        column.append(track);
        return column;
      });

      storiesMarquee.replaceChildren(...columnElements);
      storiesMarquee.classList.add("stories__marquee--columns");
      storiesMarquee.classList.toggle("stories__marquee--static", reducedMotion.matches);
    };

    buildStoryDisplay();
    const resizeHandler = () => {
      clearTimeout(storiesResizeTimer);
      storiesResizeTimer = setTimeout(buildStoryDisplay, 180);
    };
    addTrackedListener(window, "resize", resizeHandler);
    if (reducedMotion.addEventListener) {
      addTrackedListener(reducedMotion, "change", buildStoryDisplay);
    }
  }

  /* ── visit form is managed reactively by React with live Cloud Firestore sync ── */

  /* ── amenities category filter ── */
  const amFilters = document.querySelectorAll(".am-filter");
  const amCards = document.querySelectorAll(".amcard");
  if (amFilters.length && amCards.length) {
    amFilters.forEach((btn) => {
      const filterClick = () => {
        const cat = btn.dataset.cat;
        amFilters.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        amCards.forEach((card) => {
          const match = cat === "all" || card.dataset.cat === cat;
          if (match) {
            card.classList.remove("is-hidden");
            if (hasGsap && !reduced) {
              gsap.fromTo(card, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", force3D: true });
            }
          } else {
            card.classList.add("is-hidden");
          }
        });
      };
      addTrackedListener(btn, "click", filterClick);
    });
  }

  /* ── footer year ── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── weekly food menu tabs ── */
  const WEEK = [
    { meals: [
      ["Thatte idli & medu vada", "Steamed pillowy-soft, with coconut chutney and hot drumstick sambar.", "Filter coffee or ginger chai", 1],
      ["Rice, sambar & beans palya", "Ghee rice on the side, curd, papad and a fresh salad.", "Unlimited servings", 1],
      ["Masala chai & punugulu", "Crisp golden fritters, straight out of the evening kadai.", "Served hot at five", 1],
      ["Phulka, dal tadka & aloo gobi", "Soft ghee phulkas with homestyle dal and a dry sabzi.", "Jowar roti on request", 1],
    ]},
    { meals: [
      ["Rava idli & sambar", "Semolina idlis, pepper-and-cashew tempered, with tomato chutney.", "Coffee or badam milk", 1],
      ["Chapati, rajma & salad", "Slow-cooked rajma with onion-cucumber salad and buttermilk.", "Rajma cooked overnight", 1],
      ["Filter coffee & murukku", "Crunchy rice-flour spirals with the evening tumbler.", "Batch fried at 4:45", 1],
      ["Veg dum biryani & raita", "Seeraga samba rice, crisp fried onion, mint raita on the side.", "Tuesday biryani night", 1],
    ]},
    { meals: [
      ["Pongal & vada", "Ghee-roasted pepper pongal finished with cashews and curry leaf.", "Ginger chai on the side", 1],
      ["Rice, rasam & cabbage palya", "Pepper rasam, poriyal, curd and fryums — the midweek reset.", "Rasam refills free", 1],
      ["Chai & Mysore bonda", "Fluffy deep-fried dal fritters with coconut chutney.", "Straight from the kadai", 1],
      ["Chapati, chana & bhindi fry", "Amritsari-style chana with a crisp bhindi poriyal.", "Chapatis off the tawa", 1],
    ]},
    { meals: [
      ["Plain dosa & chutney", "Golden, crisp dosas with coconut, tomato and mint chutneys.", "Batter fermented in-house", 1],
      ["Puliyogare & curd rice", "Tangy tamarind rice, temple-style, with cool curd rice.", "Tempered fresh daily", 1],
      ["Badam milk & rusk", "Slow-stirred almond milk with cardamom and saffron.", "Served warm", 1],
      ["Rice, sambar & beetroot palya", "Comfort food, done right — sambar, poriyal and curd.", "Early dinner Thursday", 1],
    ]},
    { meals: [
      ["Set dosa & saagu", "Soft pillowy set dosas with the house vegetable saagu.", "Saagu is the star", 1],
      ["Chapati, dal & carrot poriyal", "Ghee chapatis, homestyle dal and a sweet carrot stir-fry.", "Salad & buttermilk", 1],
      ["Chai & bread pakora", "Stuffed bread fritters with green chutney, monsoon-style.", "Rain or shine", 1],
      ["Chicken curry, rice & rasam", "Free-range chicken in a home-ground masala, with rice and rasam.", "Friday non-veg night", 0],
    ]},
    { meals: [
      ["Masala dosa & filter coffee", "Red-chutney smeared, potato palya inside, coffee on the side.", "The weekend classic", 1],
      ["Bisibele bath & raita", "Slow-cooked rice and lentils with fresh masala and ghee.", "Saturday special", 1],
      ["Chai & vegetable pakora", "Mixed-veg fritters with mint chutney, batch-fried at five.", "Weekend batch", 1],
      ["Paneer butter masala & naan", "House-made paneer gravy with soft butter naans.", "Paneer made in-house", 1],
    ]},
    { meals: [
      ["Poori bhaji & kesari", "Fluffy pooris with potato bhaji and a sweet kesari bath.", "Sunday breakfast spread", 1],
      ["Chicken biryani — Sunday feast", "Dum-cooked biryani with raita and a boiled egg on the side.", "Veg biryani always available", 0],
      ["Buttermilk & fresh fruit", "Chaas and a fruit cut to balance the big lunch.", "Seasonal picks", 1],
      ["Tomato rice & papad", "Light, tangy tomato rice with crisp papad — early Sunday night.", "Khichdi on request", 1],
    ]},
  ];
  const SLOTS = ["b", "l", "s", "d"];

  const daysWrap = document.querySelector(".food__days");
  if (daysWrap) {
    const pill = document.getElementById("daysPill");
    const tabs = [...daysWrap.querySelectorAll("button[data-day]")];
    const mealsGrid = document.getElementById("mealsGrid");
    let day = (new Date().getDay() + 6) % 7;

    const movePill = (btn) => {
      if (!pill || !btn) return;
      pill.style.left = btn.offsetLeft + "px";
      pill.style.width = btn.offsetWidth + "px";
    };
    const swapContent = () => {
      if (!mealsGrid) return;
      WEEK[day].meals.forEach((m, mi) => {
        const card = mealsGrid.querySelector(`[data-meal="${SLOTS[mi]}"]`);
        if (!card) return;
        const slotEl = card.querySelector("[data-slot]");
        if (slotEl) slotEl.textContent = m[0];
        const slotDescEl = card.querySelector("[data-slotdesc]");
        if (slotDescEl) slotDescEl.textContent = m[1];
        const slotNoteEl = card.querySelector("[data-slotnote]");
        if (slotNoteEl) slotNoteEl.textContent = m[2];
        const dot = card.querySelector(".meal__dot");
        if (dot) {
          dot.classList.toggle("meal__dot--veg", !!m[3]);
          dot.classList.toggle("meal__dot--nv", !m[3]);
          dot.title = m[3] ? "Vegetarian" : "Non-veg";
        }
      });
    };
    const renderDay = (i, animate) => {
      day = (i + 7) % 7;
      tabs.forEach((t) => t.setAttribute("aria-selected", String(+t.dataset.day === day)));
      movePill(tabs[day]);
      swapContent();
      if (animate && hasGsap && !reduced) {
        gsap.killTweensOf(".meal");
        gsap.fromTo(
          ".meal",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.28, ease: "power2.out", stagger: 0.04, overwrite: true, force3D: true }
        );
      }
    };

    tabs.forEach((t) => addTrackedListener(t, "click", () => renderDay(+t.dataset.day, true)));
    const prev = document.getElementById("dayPrev");
    const next = document.getElementById("dayNext");
    if (prev) addTrackedListener(prev, "click", () => renderDay(day - 1, true));
    if (next) addTrackedListener(next, "click", () => renderDay(day + 1, true));

    const initDay = () => renderDay(day, false);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(initDay);
    else initDay();
    let dayRT;
    addTrackedListener(window, "resize", () => {
      clearTimeout(dayRT);
      dayRT = setTimeout(() => movePill(tabs[day]), 150);
    });
  }

  /* ── map pins (positioned to match the embedded Google Map) ── */
  const MAP_CENTER = { lat: 12.9187, lng: 77.5645 };
  const mapWrap = document.querySelector(".mapwrap");
  if (mapWrap) {
    const layer = document.getElementById("mapPins");
    const frame = document.getElementById("gmap");
    const mercX = (lng) => ((lng + 180) / 360) * 256;
    const mercY = (lat) =>
      ((1 - Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) / Math.PI) / 2) * 256;

    const layoutMap = () => {
      const w = mapWrap.clientWidth;
      const h = mapWrap.clientHeight;
      const mobile = window.matchMedia("(max-width: 780px)").matches;
      const z = w < 1100 ? 13 : 14;
      if (frame && frame.dataset.z !== String(z)) {
        frame.dataset.z = String(z);
        frame.src = `https://maps.google.com/maps?q=${MAP_CENTER.lat},${MAP_CENTER.lng}&z=${z}&hl=en&output=embed`;
      }
      if (!layer) return;
      const scale = Math.pow(2, z);
      const cx = mercX(MAP_CENTER.lng);
      const cy = mercY(MAP_CENTER.lat);
      const pins = [...layer.querySelectorAll(".pin")];
      if (!pins.length) return;
      const pts = pins.map((pin) => ({
        pin,
        px: (mercX(parseFloat(pin.dataset.lng)) - cx) * scale + w / 2,
        py: (mercY(parseFloat(pin.dataset.lat)) - cy) * scale + h / 2,
      }));
      const minX = Math.min(...pts.map((p) => p.px));
      const maxX = Math.max(...pts.map((p) => p.px));
      const mid = (minX + maxX) / 2;
      const cardEdge = mobile ? 12 : Math.min(360, w - 48) + 36;
      let shift = mobile ? w / 2 - mid : (w + cardEdge) / 2 - mid;
      shift = Math.max(12 - minX, Math.min(shift, w - 12 - maxX));
      pts.forEach(({ pin, px, py }) => {
        pin.style.left = px + shift + "px";
        pin.style.top = py + "px";
      });
    };
    layoutMap();
    let mapRT;
    addTrackedListener(window, "resize", () => {
      clearTimeout(mapRT);
      mapRT = setTimeout(layoutMap, 150);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutMap);

    // hover sync: pins <-> list rows
    const pins = [...document.querySelectorAll(".pin")];
    const rows = [...document.querySelectorAll(".mapcard__row")];
    const sync = (loc, on) => {
      pins.filter((p) => p.dataset.locality === loc).forEach((p) => p.classList.toggle("is-lit", on));
      rows.filter((r) => r.dataset.locality === loc).forEach((r) => r.classList.toggle("is-lit", on));
    };
    [...pins, ...rows].forEach((el) => {
      addTrackedListener(el, "mouseenter", () => sync(el.dataset.locality, true));
      addTrackedListener(el, "mouseleave", () => sync(el.dataset.locality, false));
    });

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { mapWrap.classList.add("in-view"); io.disconnect(); }
        }),
        { threshold: 0.2 }
      );
      io.observe(mapWrap);
    } else {
      mapWrap.classList.add("in-view");
    }
  }

  /* ── nav scrollspy ── */
  const navLinks = [...document.querySelectorAll(".nav__links a")];
  if (navLinks.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          const id = "#" + en.target.id;
          navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === id));
        }
      }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    document.querySelectorAll("section[id]").forEach((s) => spy.observe(s));
  }

  if (!hasGsap || reduced) {
    document.querySelectorAll("[data-reveal]").forEach((el) => (el.style.opacity = 1));
    return cleanupSiteInteractions;
  }

  /* ── hero entrance ── */
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .fromTo(".site-hero__copy [data-reveal]", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, force3D: true }, 0.1);

  /* ── scroll reveals ── */
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    if (el.closest(".site-hero") || el.matches(".audiences__grid .acard") || el.closest(".story-zigzag-section")) return;
    gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.85, ease: "power3.out", force3D: true,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      }
    );
  });

  /* ── connected story zigzag thread sequence ── */
  const storySection = document.querySelector(".story-zigzag-section");
  const threadSvg = document.querySelector(".story-zigzag-thread-svg");
  const threadTrack = document.getElementById("storyThreadTrack");
  const threadPath = document.getElementById("storyThreadPath");

  if (storySection && threadSvg && threadPath) {
    const rows = [...storySection.querySelectorAll(".story-row")];
    let threadTimeline = null;
    let pathLength = 3200;

    const buildStoryThread = () => {
      if (window.innerWidth <= 900 || rows.length < 4) {
        if (threadTimeline) {
          threadTimeline.kill();
          threadTimeline = null;
        }
        return;
      }

      const secRect = storySection.getBoundingClientRect();
      const collages = rows.map((r) => r.querySelector(".story-collage"));
      if (collages.some((c) => !c)) return;

      const getBox = (el) => {
        const r = el.getBoundingClientRect();
        return {
          left: r.left - secRect.left,
          top: r.top - secRect.top,
          right: r.right - secRect.left,
          bottom: r.bottom - secRect.top,
          w: r.width,
          h: r.height,
        };
      };

      const c1 = getBox(collages[0]);
      const c2 = getBox(collages[1]);
      const c3 = getBox(collages[2]);
      const c4 = getBox(collages[3]);

      const waypoints = [
        // ── Row 1: Collage 1 (Left Image - line emerges smoothly from image) ──
        { x: c1.left + c1.w * 0.45, y: c1.top + c1.h * 0.4 },
        { x: c1.right + 20, y: c1.top + c1.h * 0.58 },
        { x: c1.left + c1.w * 0.7, y: c1.bottom + 30 },
        
        // ── Smooth Weave from Row 1 to Row 2 ──
        { x: (c1.right + c2.left) / 2, y: (c1.bottom + c2.top) / 2 },
        
        // ── Row 2: Collage 2 (Right Image) ──
        { x: c2.left - 15, y: c2.top + c2.h * 0.3 },
        { x: c2.left + c2.w * 0.55, y: c2.top - 20 },
        { x: c2.right + 20, y: c2.top + c2.h * 0.52 },
        { x: c2.left + c2.w * 0.45, y: c2.bottom + 30 },
        
        // ── Clean, Elegant Curve from Row 2 to Row 3 ──
        { x: (c2.left + c3.right) / 2, y: (c2.bottom + c3.top) / 2 },
        
        // ── Row 3: Collage 3 (Left Image) ──
        { x: c3.right + 15, y: c3.top + c3.h * 0.28 },
        { x: c3.left + c3.w * 0.45, y: c3.top - 20 },
        { x: c3.left - 20, y: c3.top + c3.h * 0.5 },
        { x: c3.left + c3.w * 0.6, y: c3.bottom + 30 },
        
        // ── Clean Curve from Row 3 to Row 4 ──
        { x: (c3.right + c4.left) / 2, y: (c3.bottom + c4.top) / 2 },
        
        // ── Row 4: Collage 4 (Right Image) ──
        { x: c4.left - 15, y: c4.top + c4.h * 0.3 },
        { x: c4.left + c4.w * 0.55, y: c4.top - 20 },
        { x: c4.right + 20, y: c4.top + c4.h * 0.52 },
        { x: c4.left + c4.w * 0.35, y: c4.bottom + 45 },
      ];

      function getSmoothSplinePath(pts, tension = 0.24) {
        if (!pts || pts.length < 2) return "";
        let path = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = i > 0 ? pts[i - 1] : pts[i];
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

          const cp1x = p1.x + (p2.x - p0.x) * tension;
          const cp1y = p1.y + (p2.y - p0.y) * tension;
          const cp2x = p2.x - (p3.x - p1.x) * tension;
          const cp2y = p2.y - (p3.y - p1.y) * tension;

          path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
        }
        return path;
      }

      const d = getSmoothSplinePath(waypoints, 0.25);
      threadSvg.setAttribute("viewBox", `0 0 ${secRect.width} ${secRect.height}`);
      threadPath.setAttribute("d", d);
      if (threadTrack) threadTrack.setAttribute("d", d);

      try {
        pathLength = threadPath.getTotalLength() || 3200;
        threadPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
        threadPath.style.strokeDashoffset = `${pathLength}`;
      } catch (e) {
        pathLength = 3200;
      }

      if (hasGsap && !reduced) {
        if (threadTimeline) threadTimeline.kill();

        threadTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: rows[0],
            endTrigger: rows[rows.length - 1],
            start: "top 60%",
            end: "bottom 65%",
            scrub: true,
            invalidateOnRefresh: true,
          }
        });

        threadTimeline.fromTo(
          threadPath,
          { strokeDashoffset: pathLength },
          { strokeDashoffset: 0, ease: "none", force3D: true },
          0
        );
      }
    };

    if (document.readyState === "complete") {
      setTimeout(() => {
        buildStoryThread();
        ScrollTrigger.refresh();
      }, 60);
    } else {
      addTrackedListener(window, "load", () => {
        setTimeout(() => {
          buildStoryThread();
          ScrollTrigger.refresh();
        }, 60);
      });
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(() => {
          buildStoryThread();
          ScrollTrigger.refresh();
        }, 100);
      });
    }

    let storyResizeTimer;
    addTrackedListener(window, "resize", () => {
      clearTimeout(storyResizeTimer);
      storyResizeTimer = setTimeout(() => {
        buildStoryThread();
        ScrollTrigger.refresh();
      }, 150);
    });
  }

  /* ── image mask reveals ── */
  gsap.utils.toArray("[data-mask]").forEach((el) => {
    if (el.closest(".audiences__grid")) return;
    const img = el.querySelector("img");
    gsap.fromTo(el,
      { clipPath: "inset(10% 10% 10% 10% round 20px)", opacity: 0.5 },
      {
        clipPath: "inset(0% 0% 0% 0% round 20px)", opacity: 1, duration: 1.0, ease: "power3.out", force3D: true,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }
    );
    if (img) {
      gsap.fromTo(img, { scale: 1.12 }, {
        scale: 1, duration: 1.2, ease: "power3.out", force3D: true,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }
  });

  /* ── parallax layers ── */
  gsap.utils.toArray("[data-parallax]").forEach((el) => {
    const amt = parseFloat(el.dataset.parallax) || 5;
    gsap.to(el, {
      yPercent: amt,
      ease: "none",
      force3D: true,
      scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: 0.5 },
    });
  });

  /* ── counters ── */
  gsap.utils.toArray("[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || "0", 10);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => gsap.to(obj, {
        v: target, duration: 1.6, ease: "power2.out",
        onUpdate: () => (el.textContent = obj.v.toFixed(decimals)),
      }),
    });
  });

  /* ── how-it-works line draw ── */
  if (document.getElementById("howLine")) {
    gsap.to("#howLine", {
      scaleX: 1, ease: "none", force3D: true,
      scrollTrigger: { trigger: ".how__steps", start: "top 80%", end: "bottom 60%", scrub: 0.4 },
    });
  }

  // Schedule a clean refresh after layout stabilizes
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 300);

  return cleanupSiteInteractions;
}
