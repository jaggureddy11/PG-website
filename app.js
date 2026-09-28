/* CHARLA LIVING — motion & interaction layer */
(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";

  document.documentElement.classList.remove("no-js");
  if (reduced || !hasGsap) document.documentElement.classList.add("no-motion");

  /* ── smooth scroll (Lenis) + GSAP wiring ── */
  let lenis = null;
  if (!reduced && hasGsap && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ── anchor navigation through Lenis ── */
  function scrollToTarget(sel) {
    const el = document.querySelector(sel);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  }
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        closeMenu();
        scrollToTarget(id);
      }
    });
  });

  /* ── nav state ── */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── mobile menu ── */
  const burger = document.getElementById("burger");
  const mmenu = document.getElementById("mmenu");
  function closeMenu() {
    burger.classList.remove("open");
    mmenu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    mmenu.setAttribute("aria-hidden", "true");
    if (lenis) lenis.start();
  }
  burger.addEventListener("click", () => {
    const open = !mmenu.classList.contains("open");
    burger.classList.toggle("open", open);
    mmenu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    mmenu.setAttribute("aria-hidden", String(!open));
    if (lenis) open ? lenis.stop() : lenis.start();
  });

  /* ── locality chips + finder → highlight a card ── */
  function spotlight(locality) {
    const card = document.querySelector(`.rcard[data-locality="${locality}"]`);
    if (!card || !hasGsap || reduced) return;
    gsap.fromTo(
      card,
      { boxShadow: "0 0 0 0 rgba(251,112,9,.55)" },
      { boxShadow: "0 0 0 14px rgba(251,112,9,0)", duration: 1.6, ease: "power2.out", clearProps: "boxShadow", delay: 0.9 }
    );
  }
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => spotlight(chip.dataset.locality));
  });
  document.getElementById("finder").addEventListener("submit", (e) => {
    e.preventDefault();
    const loc = document.getElementById("f-locality").value;
    scrollToTarget("#residences");
    if (loc) spotlight(loc);
  });

  /* ── FAQ accordion ── */
  document.querySelectorAll(".faq__item").forEach((item) => {
    const btn = item.querySelector(".faq__q");
    const panel = item.querySelector(".faq__a");
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq__item.open").forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq__a").style.maxHeight = "0px";
        other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ── visit form (front-end demo) ── */
  document.getElementById("visitForm").addEventListener("submit", function (e) {
    e.preventDefault();
    this.style.display = "none";
    document.querySelector(".visit__alt").style.display = "none";
    const success = document.getElementById("visitSuccess");
    success.hidden = false;
    if (hasGsap && !reduced) {
      gsap.fromTo(success, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    }
  });

  /* ── footer year ── */
  document.getElementById("year").textContent = new Date().getFullYear();

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
      pill.style.left = btn.offsetLeft + "px";
      pill.style.width = btn.offsetWidth + "px";
    };
    const swapContent = () => {
      WEEK[day].meals.forEach((m, mi) => {
        const card = mealsGrid.querySelector(`[data-meal="${SLOTS[mi]}"]`);
        card.querySelector("[data-slot]").textContent = m[0];
        card.querySelector("[data-slotdesc]").textContent = m[1];
        card.querySelector("[data-slotnote]").textContent = m[2];
        const dot = card.querySelector(".meal__dot");
        dot.classList.toggle("meal__dot--veg", !!m[3]);
        dot.classList.toggle("meal__dot--nv", !m[3]);
        dot.title = m[3] ? "Vegetarian" : "Non-veg";
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
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.05, overwrite: true }
        );
      }
    };

    tabs.forEach((t) => t.addEventListener("click", () => renderDay(+t.dataset.day, true)));
    const prev = document.getElementById("dayPrev");
    const next = document.getElementById("dayNext");
    if (prev) prev.addEventListener("click", () => renderDay(day - 1, true));
    if (next) next.addEventListener("click", () => renderDay(day + 1, true));

    const initDay = () => renderDay(day, false);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(initDay);
    else initDay();
    let dayRT;
    window.addEventListener("resize", () => {
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
      const scale = Math.pow(2, z);
      const cx = mercX(MAP_CENTER.lng);
      const cy = mercY(MAP_CENTER.lat);
      const pins = [...layer.querySelectorAll(".pin")];
      const pts = pins.map((pin) => ({
        pin,
        px: (mercX(parseFloat(pin.dataset.lng)) - cx) * scale + w / 2,
        py: (mercY(parseFloat(pin.dataset.lat)) - cy) * scale + h / 2,
      }));
      // shift the cluster into the free space (right of the card on desktop)
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
    window.addEventListener("resize", () => {
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
      el.addEventListener("mouseenter", () => sync(el.dataset.locality, true));
      el.addEventListener("mouseleave", () => sync(el.dataset.locality, false));
    });

    // drop-in once visible
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { mapWrap.classList.add("in-view"); io.disconnect(); }
        }),
        { threshold: 0.25 }
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
    return;
  }

  /* ── hero entrance ── */
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .fromTo(".hero__copy [data-reveal]", { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.12 }, 0.15)
    .fromTo(".hero__img--main", { clipPath: "inset(10% 10% 10% 10% round 28px)", opacity: 0 }, { clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1, duration: 1.4 }, 0.35)
    .fromTo(".hero__img--small", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 0.7)
    .fromTo(".hero__card", { y: 30, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.15 }, 0.9)
    .fromTo(".hero__badge-spin", { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 1, ease: "back.out(1.6)" }, 1.05);

  /* ── scroll reveals ── */
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    if (el.closest(".hero")) return;
    gsap.fromTo(
      el,
      { y: 42, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.05, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }
    );
  });

  /* ── image mask reveals ── */
  gsap.utils.toArray("[data-mask]").forEach((el) => {
    const img = el.querySelector("img");
    gsap.fromTo(el,
      { clipPath: "inset(12% 12% 12% 12% round 20px)", opacity: 0.4 },
      {
        clipPath: "inset(0% 0% 0% 0% round 20px)", opacity: 1, duration: 1.3, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      }
    );
    if (img) {
      gsap.fromTo(img, { scale: 1.18 }, {
        scale: 1, duration: 1.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }
  });

  /* ── parallax layers ── */
  gsap.utils.toArray("[data-parallax]").forEach((el) => {
    const amt = parseFloat(el.dataset.parallax) || 6;
    gsap.to(el, {
      yPercent: amt,
      ease: "none",
      scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: 1.2 },
    });
  });

  /* ── counters ── */
  gsap.utils.toArray("[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || "0", 10);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => gsap.to(obj, {
        v: target, duration: 2, ease: "power2.out",
        onUpdate: () => (el.textContent = obj.v.toFixed(decimals)),
      }),
    });
  });

  /* ── how-it-works line draw ── */
  gsap.to("#howLine", {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: ".how__steps", start: "top 78%", end: "bottom 55%", scrub: 0.8 },
  });

  /* ── hero media drift on scroll ── */
  gsap.to(".hero__media", {
    y: -60, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
  });
})();
