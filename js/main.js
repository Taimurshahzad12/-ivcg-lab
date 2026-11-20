(function () {
  "use strict";
  const L = window.LAB, U = window.UI;
  let lang = (navigator.language || "").startsWith("ko") ? "ko" : "en";
  try { lang = localStorage.getItem("lang") || lang; } catch (e) {}

  const t = (o) => (o && typeof o === "object" ? o[lang] || o.en || "" : o || "");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ui = (k) => t(U.s[k]);
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const routes = ["home", "professor", "members", "research", "publications", "news", "contact"];
  const route = () => { const h = (location.hash || "#home").slice(1); return routes.includes(h) ? h : "home"; };
  const fmtDate = (d) => { try { return new Date(d + "T00:00:00").toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", { year: "numeric", month: "short", day: "numeric" }); } catch (e) { return d; } };

  /* ---------- icons ---------- */
  const svg = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${p}</svg>`;
  const ICON = {
    eye: svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    cube: svg('<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 12l9-5M12 12L3 7M12 12v10"/>'),
    vr: svg('<rect x="2" y="7" width="20" height="10" rx="4"/><path d="M8 17c1-2 2-2 4-2s3 0 4 2"/><circle cx="7.5" cy="12" r="1"/><circle cx="16.5" cy="12" r="1"/>'),
    net: svg('<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="12" cy="10" r="2"/><path d="M6.6 7.2l3.8 1.6M17.4 7.2l-3.8 1.6M12 12v4"/>'),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    phone: svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>'),
    pin: svg('<path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'),
    door: svg('<path d="M5 21V4a1 1 0 011-1h9a1 1 0 011 1v17M3 21h18"/><circle cx="12.5" cy="12" r=".8"/>')
  };
  const RICON = [ICON.eye, ICON.cube, ICON.vr, ICON.net];

  /* ---------- publications ---------- */
  function topic(p) {
    const s = p.title.toLowerCase();
    if (/reality|metaverse|game|augmented|virtual/.test(s)) return "x";
    if (/detect|ocular|retinal|skin|lesion|facial|recognition/.test(s)) return "v";
    if (/mesh|surface|ridge|panorama|generation|\bgan\b|wave function|graphics/.test(s)) return "g";
    if (/image|face|vision|object|swin/.test(s)) return "v";
    return "m";
  }
  const TOPIC_KEY = { v: "tVision", g: "tGraphics", x: "tXR", m: "tML" };
  const pubs = () => L.publications.slice().sort((a, b) => b.year - a.year);

  /* ---------- people ---------- */
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  function avatar(photo, name) {
    const ini = esc(initials(name));
    return `<div class="avatar"><div class="in">${photo ? `<img src="${esc(photo)}" alt="${esc(name)}" width="200" height="200" loading="lazy" decoding="async" onerror="this.replaceWith(document.createTextNode('${ini}'))">` : ini}</div></div>`;
  }
  function links(m) {
    const a = [];
    if (m.email) a.push(`<a href="mailto:${esc(m.email)}">${ui("email")}</a>`);
    if (m.scholar) a.push(`<a href="${esc(m.scholar)}" target="_blank" rel="noopener noreferrer">${ui("scholar")}</a>`);
    return a.length ? `<div class="links">${a.join("")}</div>` : "";
  }
  const tags = (arr) => `<ul class="tags">${(arr || []).map((x) => `<li class="tag">${esc(t(x))}</li>`).join("")}</ul>`;
  const memberCard = (m, i = 0) => `<article class="card member rv d${(i % 4) + 1}">${avatar(m.photo, m.name.en)}
      <h3>${esc(t(m.name))}</h3><div class="role">${esc(t(m.role))}</div>${m.about ? `<p class="about">${esc(t(m.about))}</p>` : ""}
      ${tags(m.interests)}${links(m)}</article>`;
  const people = () => [...L.members.phd, ...L.members.ms, ...L.members.undergrad];

  const head = (title, sub) => `<div class="page-title"><div class="wrap"><div class="kicker">${esc(L.short)}</div><h1>${esc(title)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}</div></div>`;
  const secHead = (kick, title, sub, href) => `<div class="sec-head rv"><div>${kick ? `<div class="kicker">${esc(kick)}</div>` : ""}<h2>${esc(title)}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}</div>${href ? `<a class="more" href="${href}">${ui("all")}</a>` : ""}</div>`;

  const timeline = (items) => `<ol class="timeline">${items.map((n, i) => `<li class="tl rv d${(i % 3) + 1}"><time datetime="${esc(n.date)}">${esc(fmtDate(n.date))}</time><h3>${esc(t(n.title))}</h3><p>${esc(t(n.text))}</p></li>`).join("")}</ol>`;
  const newsCards = (items) => `<div class="grid g3">${items.map((n, i) => `<article class="card ncard rv d${(i % 3) + 1}"><time datetime="${esc(n.date)}">${esc(fmtDate(n.date))}</time><h3>${esc(t(n.title))}</h3><p>${esc(t(n.text))}</p></article>`).join("")}</div>`;
  const researchCards = () => `<div class="grid g4">${L.research.map((r, i) => `<article class="card rcard rv d${i + 1}"><span class="num" aria-hidden="true">${r.id}</span><div class="ico">${RICON[i % 4]}</div><h3>${esc(t(r.title))}</h3><p>${esc(t(r.text))}</p></article>`).join("")}</div>`;

  function profBlock() {
    const p = L.professor;
    return `<article class="card prof rv">${avatar(p.photo, "Soo Kyun Kim")}<div>
      <div class="role">${esc(t(p.title))}</div><h3>${esc(t(p.name))}</h3>
      <dl class="kv"><dt>${ui("spec")}</dt><dd>${esc(t(p.specialization))}</dd><dt>${ui("office")}</dt><dd>${esc(p.office)} · ${esc(p.phone)}</dd><dt>${ui("email")}</dt><dd><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></dd></dl>
      ${tags(p.interests)}<div class="links"><a href="${esc(p.scholar)}" target="_blank" rel="noopener noreferrer">${ui("scholar")}</a></div></div></article>`;
  }

  const pubCard = (p, i) => { const k = topic(p); return `<article class="card pcard t-${k} rv d${(i % 4) + 1}"><div class="top"><span class="badge">${ui(TOPIC_KEY[k])}</span><span class="yr">${p.year}</span></div>
      <h3>${esc(p.title)}</h3><div class="au">${esc(p.authors)}</div><div class="ve">${esc(p.venue)}</div></article>`; };

  /* ---------- pages ---------- */
  const pages = {
    home() {
      const P = pubs(), recent = P.filter((p) => p.year >= 2023).length;
      const stats = [[P.length, "stPubs"], [recent, "stRecent"], [L.research.length, "stAreas"], [people().length + L.members.alumni.length + 1, "stPeople"]];
      return `<section class="hero" aria-labelledby="hero-title" style="padding:0"><canvas id="bg" aria-hidden="true"></canvas><div class="wrap"><div class="hero-copy">
          <span class="eyebrow"><b></b>${esc(t(L.university))} · ${esc(t(L.department))}</span>
          <h1 id="hero-title">${esc(t(L.name)).replace(/^(\S+ \S+ )/, "<span>$1</span>")}</h1>
          <p class="lead">${esc(t(L.tagline))}</p>
          <ul class="chips">${[1, 2, 3, 4].map((i) => `<li class="chip">${ui("heroChip" + i)}</li>`).join("")}</ul>
          <div class="actions"><a class="btn" href="#research">${ui("explore")} →</a><a class="btn ghost" href="#contact">${ui("joinUs")}</a></div></div></div></section>
        <div class="stats"><div class="wrap"><ul class="rv">${stats.map(([n, k]) => `<li class="stat"><b class="grad-text" data-count="${n}">${n}</b><span>${ui(k)}</span></li>`).join("")}</ul></div></div>
        <section><div class="wrap">${secHead(L.short, ui("areas"), t(L.intro), "#research")}${researchCards()}</div></section>
        <section class="alt"><div class="wrap">${secHead(ui("pubs"), ui("recent"), ui("recentSub"), "#publications")}<div class="grid g2">${P.slice(0, 4).map(pubCard).join("")}</div></div></section>
        <section><div class="wrap">${secHead("", ui("timeline"), "", "#news")}${newsCards(L.news.slice(0, 3))}</div></section>
        <section class="alt"><div class="wrap">${secHead("", ui("prof"), "", "#professor")}${profBlock()}</div></section>
        <section><div class="wrap">${secHead(L.short, ui("members"), "", "#members")}<div class="grid g3">${people().map(memberCard).join("")}</div></div></section>
        <section class="alt"><div class="wrap"><div class="cta rv"><h2>${ui("ctaTitle")}</h2><p>${esc(t(L.recruiting))}</p><a class="btn" href="mailto:${esc(L.email)}">${esc(L.email)}</a></div></div></section>`;
    },
    professor() { return head(ui("prof"), t(L.professor.name)) + `<section style="padding-top:clamp(32px,5vw,56px)"><div class="wrap">${profBlock()}</div></section>`; },
    members() {
      const grp = (k) => { const a = L.members[k]; return `<h2 class="group-h rv">${ui(k)}</h2>` + (a.length ? `<div class="grid g3">${a.map(memberCard).join("")}</div>` : `<div class="empty">${ui("soon")}</div>`); };
      return head(ui("members"), t(L.name)) + `<section style="padding-top:clamp(32px,5vw,56px)"><div class="wrap">${["phd", "ms", "undergrad", "alumni"].map(grp).join("")}</div></section>`;
    },
    research() {
      const proj = L.projects.length ? `<h2 class="group-h">${ui("projects")}</h2>${timeline(L.projects.map((p) => ({ date: p.period, title: p.title, text: { en: t(p.funder) + " — " + t(p.text), ko: t(p.funder) + " — " + t(p.text) } })))}` : "";
      return head(ui("areas"), t(L.intro)) + `<section style="padding-top:clamp(32px,5vw,56px)"><div class="wrap">${researchCards()}${proj}</div></section>`;
    },
    publications() {
      const years = {}; pubs().forEach((p) => (years[p.year] = (years[p.year] || 0) + 1));
      const ys = Object.keys(years).sort(), max = Math.max(...Object.values(years));
      return head(ui("pubs"), `${pubs().length} ${ui("papers")}`) + `<section style="padding-top:clamp(28px,4vw,48px)"><div class="wrap">
        <div class="chart" id="chart" role="group" aria-label="${esc(ui("filterYear"))}">${ys.map((y) => `<button type="button" class="bar" data-y="${y}" aria-pressed="false" aria-label="${y}: ${years[y]} ${esc(ui("papers"))}"><em>${years[y]}</em><i data-h="${Math.max(8, years[y] / max * 100)}"></i><span>${y}</span></button>`).join("")}</div>
        <p class="cap">${ui("perYear")}</p>
        <div class="toolbar"><label class="sr" for="q">${esc(ui("search"))}</label><input id="q" type="search" placeholder="${esc(ui("search"))}" autocomplete="off">
          <div class="filters" role="group" aria-label="${esc(ui("filterTopic"))}">${[["all", ui("all2")], ["v", ui("tVision")], ["g", ui("tGraphics")], ["x", ui("tXR")], ["m", ui("tML")]].map(([k, n]) => `<button type="button" class="fbtn" data-t="${k}" aria-pressed="${k === "all"}">${n}</button>`).join("")}</div></div>
        <p class="cap" id="count" aria-live="polite"></p><div id="publist"></div></div></section>`;
    },
    news() { return head(ui("news")) + `<section style="padding-top:clamp(32px,5vw,56px)"><div class="wrap" style="max-width:780px">${timeline(L.news)}</div></section>`; },
    contact() {
      const row = (ic, k, v) => `<div class="cinfo"><div class="ico">${ic}</div><div><b>${ui(k)}</b><span>${v}</span></div></div>`;
      return head(ui("contact"), t(L.name)) + `<section style="padding-top:clamp(32px,5vw,56px)"><div class="wrap"><div class="grid g2"><div class="card rv">
        ${row(ICON.door, "office", esc(L.room) + " · " + esc(t(L.department)))}${row(ICON.phone, "phone", `<a href="tel:${esc(L.phone.replace(/[^+\d]/g, ""))}">${esc(L.phone)}</a>`)}
        ${row(ICON.mail, "email", `<a href="mailto:${esc(L.email)}">${esc(L.email)}</a>`)}${row(ICON.pin, "addr", esc(t(L.address)))}</div>
        <div class="card map rv d2"><iframe title="${esc(t(L.university))} map" loading="lazy" referrerpolicy="no-referrer" src="https://www.openstreetmap.org/export/embed.html?bbox=126.5370%2C33.4400%2C126.5650%2C33.4620&layer=mapnik&marker=33.4560%2C126.5612"></iframe></div></div></div></section>`;
    }
  };

  /* ---------- publications interactivity ---------- */
  function setupPubs() {
    let topicF = "all", yearF = null;
    const list = $("#publist"), q = $("#q");
    function draw() {
      const s = q.value.trim().toLowerCase();
      const items = pubs().filter((p) => (topicF === "all" || topic(p) === topicF) && (!yearF || String(p.year) === yearF) && (p.title + " " + p.authors + " " + p.venue + " " + p.year).toLowerCase().includes(s));
      let y = null, h = "";
      items.forEach((p) => {
        if (p.year !== y) { y = p.year; h += `<h2 class="year-h grad-text" style="display:block">${y}</h2>`; }
        const k = topic(p);
        h += `<article class="pub t-${k}"><span class="badge">${ui(TOPIC_KEY[k])}</span><h3 style="font-size:1.02rem;margin:8px 0 4px;line-height:1.4">${esc(p.title)}</h3><div class="au">${esc(p.authors)}</div><div class="ve">${esc(p.venue)}</div></article>`;
      });
      list.innerHTML = h || `<div class="empty">${ui("noResults")}</div>`;
      $("#count").textContent = `${items.length} ${ui("papers")}`;
      $$("#chart .bar").forEach((b) => { b.classList.toggle("dim", !!yearF && b.dataset.y !== yearF); b.setAttribute("aria-pressed", String(b.dataset.y === yearF)); });
    }
    q.addEventListener("input", draw);
    $$(".fbtn").forEach((b) => b.addEventListener("click", () => { topicF = b.dataset.t; $$(".fbtn").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); draw(); }));
    $$("#chart .bar").forEach((b) => b.addEventListener("click", () => { yearF = yearF === b.dataset.y ? null : b.dataset.y; draw(); }));
    draw();
    const ch = $("#chart"); ch.scrollLeft = ch.scrollWidth; // show newest years first on narrow screens
    requestAnimationFrame(() => setTimeout(() => $$("#chart i").forEach((i) => (i.style.height = i.dataset.h + "%")), 60));
  }

  /* ---------- effects ---------- */
  let io = null;
  function reveal() {
    if (io) io.disconnect();
    const els = $$(".rv");
    if (!("IntersectionObserver" in window) || reduce) { els.forEach((e) => e.classList.add("in")); return; }
    io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in"); io.unobserve(e.target);
      e.target.querySelectorAll("[data-count]").forEach(count);
    }), { threshold: 0.1, rootMargin: "0px 0px -4% 0px" });
    els.forEach((e) => io.observe(e));
  }
  function count(el) {
    if (reduce) return;
    const n = +el.dataset.count, t0 = performance.now();
    (function step(now) { const p = Math.min(1, (now - t0) / 1100); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t0);
  }

  /* hero: rotating 3D mesh + scan line + detection boxes */
  let heroRun = 0;
  function heroAnim() {
    const c = $("#bg"); if (!c) return;
    const token = ++heroRun, x = c.getContext("2d");
    let w, h, dpr, mx = 0, my = 0, visible = true;
    const N = 28, M = 14, pts = [];
    for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
      const u = (i / N) * 2 * Math.PI, v = (j / M) * 2 * Math.PI, R = 1, r = 0.45;
      pts.push([(R + r * Math.cos(v)) * Math.cos(u), (R + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v)]);
    }
    const dust = Array.from({ length: 50 }, () => ({ x: Math.random(), y: Math.random(), s: Math.random() * 1.4 + .4, v: Math.random() * .0003 + .0001 }));
    const boxes = [
      { l: "face 0.98", c: "#6ff5e8", ox: -.7, oy: -.35, bw: .17, bh: .22, ph: 0 },
      { l: "object 0.94", c: "#9bb0ff", ox: .75, oy: .0, bw: .2, bh: .17, ph: 2 },
      { l: "pose 0.91", c: "#ff9b7a", ox: -.15, oy: .72, bw: .22, bh: .18, ph: 4 }
    ];
    function size() { dpr = Math.min(1.75, devicePixelRatio || 1); w = c.offsetWidth; h = c.offsetHeight; c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size();
    const onResize = () => { size(); if (reduce) draw(performance.now()); };
    window.addEventListener("resize", onResize);
    const hero = c.parentElement;
    hero.addEventListener("pointermove", (e) => { const r = hero.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; });
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible && !reduce) requestAnimationFrame(loop); }).observe(hero);
    const t0 = performance.now();
    function draw(now) {
      const tt = (now - t0) / 1000, wide = w > 900;
      const cx = wide ? w * .76 : w * .5, cy = wide ? h * .5 : h * .78, sc = wide ? Math.min(h * .21, w * .15) : Math.min(w * .17, h * .13);
      x.clearRect(0, 0, w, h);
      dust.forEach((d) => { d.y = (d.y + d.v) % 1; x.fillStyle = "rgba(160,180,255,.4)"; x.beginPath(); x.arc(d.x * w, d.y * h, d.s, 0, 7); x.fill(); });
      x.globalAlpha = wide ? 1 : .22;
      const a = tt * .45 + mx * 1.1, b = .9 + my * .5 + Math.sin(tt * .4) * .15, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      const scan = (Math.sin(tt * 1.1) * .5 + .5) * 2 - 1;
      const P = pts.map((p) => {
        const X = p[0] * ca - p[1] * sa, Y = p[0] * sa + p[1] * ca, Z = p[2];
        const Y2 = Y * cb - Z * sb, Z2 = Y * sb + Z * cb, f = 3.2 / (3.2 + Z2);
        return [cx + X * sc * f, cy + Y2 * sc * f, Z2, Y2];
      });
      x.lineWidth = 1;
      for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
        const p = P[i * M + j], q1 = P[((i + 1) % N) * M + j], q2 = P[i * M + ((j + 1) % M)];
        x.strokeStyle = `rgba(140,170,255,${.1 + .22 * (1 - (p[2] + 1.5) / 3)})`;
        x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(q1[0], q1[1]); x.moveTo(p[0], p[1]); x.lineTo(q2[0], q2[1]); x.stroke();
      }
      P.forEach((p) => { const near = Math.abs(p[3] - scan * 1.4) < .12; x.fillStyle = near ? "#6ff5e8" : "rgba(190,205,255,.85)"; x.beginPath(); x.arc(p[0], p[1], near ? 2.6 : 1.4, 0, 7); x.fill(); });
      const sy = cy + scan * 1.4 * sc, span = 1.8 * sc, g = x.createLinearGradient(cx - span, 0, cx + span, 0);
      g.addColorStop(0, "transparent"); g.addColorStop(.5, "rgba(111,245,232,.85)"); g.addColorStop(1, "transparent");
      x.strokeStyle = g; x.lineWidth = 2; x.beginPath(); x.moveTo(cx - span, sy); x.lineTo(cx + span, sy); x.stroke();
      if (wide) boxes.forEach((bx) => {
        const bw = bx.bw * sc * 2.4, bh = bx.bh * sc * 2.4;
        const X = cx + (bx.ox + Math.sin(tt * .8 + bx.ph) * .04) * sc * 2.1 - bw / 2, Y = cy + (bx.oy + Math.cos(tt * .7 + bx.ph) * .04) * sc * 2.1 - bh / 2;
        x.strokeStyle = bx.c; x.lineWidth = 1.6; const cl = 11;
        x.beginPath();
        [[X, Y, 1, 1], [X + bw, Y, -1, 1], [X, Y + bh, 1, -1], [X + bw, Y + bh, -1, -1]].forEach(([px, py, dx, dy]) => { x.moveTo(px + dx * cl, py); x.lineTo(px, py); x.lineTo(px, py + dy * cl); });
        x.stroke();
        x.font = "600 11px Inter,sans-serif"; const tw = x.measureText(bx.l).width + 12;
        x.fillStyle = bx.c; x.fillRect(X, Y - 18, tw, 16); x.fillStyle = "#06102a"; x.fillText(bx.l, X + 6, Y - 6);
      });
      x.globalAlpha = 1;
    }
    function loop(now) {
      if (token !== heroRun || !document.body.contains(c)) { window.removeEventListener("resize", onResize); return; }
      if (!visible || document.hidden) { return; }
      draw(now); requestAnimationFrame(loop);
    }
    document.addEventListener("visibilitychange", () => { if (!document.hidden && visible && !reduce) requestAnimationFrame(loop); });
    if (reduce) draw(t0 + 1500); else requestAnimationFrame(loop);
  }

  /* ---------- header / shell ---------- */
  const hdr = $("#hdr"), nav = $("#nav"), burger = $("#burger");
  function setMenu(open) {
    nav.classList.toggle("open", open); hdr.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", ui(open ? "closeMenu" : "openMenu"));
  }
  function onScroll() {
    const r = route();
    hdr.classList.toggle("page", r !== "home");
    hdr.classList.toggle("solid", r === "home" && scrollY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#progress").style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  }

  function frame(opts) {
    const r = route(), focus = opts && opts.focus;
    document.documentElement.lang = lang;
    document.title = (r === "home" ? "" : t(U.nav[r]) + " · ") + `${L.short} · ${t(L.university)}`;
    $("#skip").textContent = ui("skip");
    $("#brand").innerHTML = `<i aria-hidden="true"></i>${esc(L.short)}`;
    $("#brand").setAttribute("aria-label", `${L.short} — ${t(U.nav.home)}`);
    nav.setAttribute("aria-label", ui("mainNav"));
    $("#menu").innerHTML = routes.map((k) => `<li><a class="nl" href="#${k}"${k === r ? ' aria-current="page"' : ""}>${esc(t(U.nav[k]))}</a></li>`).join("");
    const lb = $("#lang"); lb.textContent = lang === "en" ? "한국어" : "EN"; lb.setAttribute("aria-label", ui("switchLang")); lb.setAttribute("lang", lang === "en" ? "ko" : "en");
    $("#theme").setAttribute("aria-label", ui("theme"));
    $("#main").innerHTML = pages[r]();
    $("#foot").innerHTML = `<div><div class="fh">${esc(t(L.name))}</div><address>${esc(t(L.university))} · ${esc(t(L.department))}<br>${esc(t(L.address))}</address><p style="margin-top:14px">© ${new Date().getFullYear()} ${esc(L.short)}. ${ui("rights")}</p></div>
      <div role="navigation" aria-label="${esc(ui("menu"))}"><div class="fh">${ui("menu")}</div><ul>${routes.map((k) => `<li><a href="#${k}">${esc(t(U.nav[k]))}</a></li>`).join("")}</ul></div>
      <div><div class="fh">${ui("contact")}</div><ul><li><a href="tel:${esc(L.phone.replace(/[^+\d]/g, ""))}">${esc(L.phone)}</a></li><li><a href="mailto:${esc(L.email)}">${esc(L.email)}</a></li><li><a href="${esc(L.professor.scholar)}" target="_blank" rel="noopener noreferrer">${ui("scholar")}</a></li></ul></div>`;
    if (r === "publications") setupPubs();
    if (r === "home") heroAnim();
    reveal(); onScroll(); setMenu(false);
    if (focus) $("#main").focus({ preventScroll: true });
  }

  burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); burger.focus(); } });
  document.addEventListener("click", (e) => { if (nav.classList.contains("open") && !e.target.closest("#nav,#burger")) setMenu(false); });
  $("#skip").addEventListener("click", (e) => { e.preventDefault(); $("#main").focus(); $("#main").scrollIntoView(); });
  $("#lang").addEventListener("click", () => { lang = lang === "en" ? "ko" : "en"; try { localStorage.setItem("lang", lang); } catch (_) {} frame(); });
  $("#theme").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (_) {}
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("hashchange", () => { frame({ focus: true }); window.scrollTo(0, 0); });
  frame();
})();
