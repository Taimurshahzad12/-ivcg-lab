(function () {
  const L = window.LAB, U = window.UI;
  let lang = (navigator.language || "").startsWith("ko") ? "ko" : "en";
  try { lang = localStorage.getItem("lang") || lang; } catch (e) {}

  const t = (o) => (o && typeof o === "object" ? o[lang] || o.en || "" : o || "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ui = (k) => t(U.s[k]);
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  const routes = ["home", "professor", "members", "research", "publications", "news", "contact"];
  const route = () => { const h = (location.hash || "#home").slice(1); return routes.includes(h) ? h : "home"; };

  /* ---------- icons ---------- */
  const svg = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
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

  /* ---------- publication helpers ---------- */
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
    return `<div class="avatar"><div class="in">${photo ? `<img src="${esc(photo)}" alt="${esc(name)}" onerror="this.replaceWith(document.createTextNode('${ini}'))">` : ini}</div></div>`;
  }
  function links(m) {
    const a = [];
    if (m.email) a.push(`<a href="mailto:${esc(m.email)}">Email</a>`);
    if (m.scholar) a.push(`<a href="${esc(m.scholar)}" target="_blank" rel="noopener">${ui("scholar")}</a>`);
    return a.join("");
  }
  const memberCard = (m, i = 0) => `<div class="card member rv d${(i % 4) + 1}">${avatar(m.photo, m.name.en)}
      <h3>${esc(t(m.name))}</h3><div class="role">${esc(t(m.role))}</div>
      <div class="tags">${(m.interests || []).map((x) => `<span class="tag">${esc(t(x))}</span>`).join("")}</div>
      <div class="links">${links(m)}</div></div>`;
  const people = () => [...L.members.phd, ...L.members.ms, ...L.members.undergrad];

  const head = (title, sub) => `<div class="page-title"><div class="wrap"><div class="kicker">${esc(L.short)}</div><h1>${esc(title)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}</div></div>`;
  const secHead = (kick, title, sub, href) => `<div class="sec-head rv"><div><div class="kicker">${esc(kick)}</div><h2>${esc(title)}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}</div>${href ? `<a class="more" href="${href}">${ui("all")}</a>` : ""}</div>`;

  const timeline = (items) => `<div class="timeline">${items.map((n, i) => `<div class="tl rv d${(i % 3) + 1}"><time>${esc(n.date)}</time><h4>${esc(t(n.title))}</h4><p>${esc(t(n.text))}</p></div>`).join("")}</div>`;
  const researchCards = () => `<div class="grid g4">${L.research.map((r, i) => `<div class="card rcard rv d${i + 1}"><div class="num">${r.id}</div><div class="ico">${RICON[i % 4]}</div><h3>${esc(t(r.title))}</h3><p>${esc(t(r.text))}</p></div>`).join("")}</div>`;

  function profBlock() {
    const p = L.professor;
    return `<div class="card prof rv">${avatar(p.photo, "Soo Kyun Kim")}<div>
      <div class="role">${esc(t(p.title))}</div><h3>${esc(t(p.name))}</h3>
      <div class="kv"><b>${ui("spec")}</b><span>${esc(t(p.specialization))}</span><b>${ui("office")}</b><span>${esc(p.office)} · ${esc(p.phone)}</span><b>${ui("email")}</b><span><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></span></div>
      <div class="tags">${p.interests.map((i) => `<span class="tag">${esc(t(i))}</span>`).join("")}</div>
      <div class="links"><a href="${esc(p.scholar)}" target="_blank" rel="noopener">${ui("scholar")}</a></div></div></div>`;
  }

  const pubCard = (p, i) => { const k = topic(p); return `<div class="card pcard tag-${k} rv d${(i % 4) + 1}"><div class="top"><span class="badge" style="--c:var(--${{ v: "accent", g: "accent3", x: "warm", m: "accent2" }[k]})">${ui(TOPIC_KEY[k])}</span><span class="yr">${p.year}</span></div>
      <h4>${esc(p.title)}</h4><div class="au">${esc(p.authors)}</div><div class="ve" style="color:var(--accent)">${esc(p.venue)}</div></div>`; };

  /* ---------- pages ---------- */
  const pages = {
    home() {
      const P = pubs(), recent = P.filter((p) => p.year >= 2023).length;
      const stats = [[P.length, "stPubs"], [recent, "stRecent"], [L.research.length, "stAreas"], [people().length + L.members.alumni.length + 1, "stPeople"]];
      return `<div class="hero"><canvas id="bg"></canvas><div class="wrap">
          <span class="eyebrow"><b></b>${esc(t(L.university))} · ${esc(t(L.department))}</span>
          <h1>${esc(t(L.name)).replace(/^(\S+ \S+ )/, "<span>$1</span>")}</h1>
          <p class="lead">${esc(t(L.tagline))}</p>
          <div class="chips">${[1, 2, 3, 4].map((i) => `<span class="chip">${ui("heroChip" + i)}</span>`).join("")}</div>
          <a class="btn" href="#research">${ui("explore")} →</a><a class="btn ghost" href="#contact">${ui("joinUs")}</a></div>
          <div class="scroll-hint">${ui("scroll")}</div></div>
        <div class="stats"><div class="wrap"><div class="grid g4 rv">${stats.map(([n, k]) => `<div class="stat"><b class="grad-text" data-count="${n}">0</b><span>${ui(k)}</span></div>`).join("")}</div></div></div>
        <section><div class="wrap">${secHead(L.short, ui("areas"), t(L.intro), "#research")}${researchCards()}</div></section>
        <section class="alt"><div class="wrap">${secHead(ui("pubs"), ui("recent"), ui("recentSub"), "#publications")}<div class="grid g2">${P.slice(0, 4).map(pubCard).join("")}</div></div></section>
        <section><div class="wrap"><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:56px">
          <div>${secHead("", ui("timeline"), "", "#news")}${timeline(L.news.slice(0, 3))}</div>
          <div>${secHead("", ui("prof"), "", "#professor")}${profBlock()}</div></div></div></section>
        <section class="alt"><div class="wrap">${secHead(L.short, ui("members"), "", "#members")}<div class="grid g3">${people().map(memberCard).join("")}</div></div></section>
        <section><div class="wrap"><div class="cta rv"><h2>${ui("ctaTitle")}</h2><p>${esc(t(L.recruiting))}</p><a class="btn" href="mailto:${esc(L.email)}">${esc(L.email)}</a></div></div></section>`;
    },
    professor() { return head(ui("prof")) + `<section><div class="wrap">${profBlock()}</div></section>`; },
    members() {
      const grp = (k) => { const a = L.members[k]; return `<h3 class="group-h rv">${ui(k)}</h3>` + (a.length ? `<div class="grid g3">${a.map(memberCard).join("")}</div>` : `<div class="empty">${ui("soon")}</div>`); };
      return head(ui("members"), t(L.name)) + `<section style="padding-top:20px"><div class="wrap">${["phd", "ms", "undergrad", "alumni"].map(grp).join("")}</div></section>`;
    },
    research() {
      const proj = L.projects.length ? `<h3 class="group-h">${ui("projects")}</h3>${timeline(L.projects.map((p) => ({ date: p.period, title: p.title, text: { en: t(p.funder) + " — " + t(p.text), ko: t(p.funder) + " — " + t(p.text) } })))}` : "";
      return head(ui("areas"), ui("areasSub")) + `<section><div class="wrap">${researchCards()}${proj}</div></section>`;
    },
    publications() {
      const years = {}; pubs().forEach((p) => (years[p.year] = (years[p.year] || 0) + 1));
      const ys = Object.keys(years).sort(), max = Math.max(...Object.values(years));
      return head(ui("pubs"), `${pubs().length} ${ui("pubs").toLowerCase()}`) + `<section style="padding-top:26px"><div class="wrap">
        <div class="chart" id="chart">${ys.map((y) => `<div class="bar" data-y="${y}"><em>${years[y]}</em><i data-h="${Math.max(8, years[y] / max * 100)}"></i><span>${y}</span></div>`).join("")}</div>
        <div class="cap">${ui("perYear")}</div>
        <div class="toolbar"><input id="q" placeholder="${esc(ui("search"))}">
          ${[["all", ui("all2")], ["v", ui("tVision")], ["g", ui("tGraphics")], ["x", ui("tXR")], ["m", ui("tML")]].map(([k, n]) => `<button class="fbtn ${k === "all" ? "on" : ""}" data-t="${k}">${n}</button>`).join("")}</div>
        <div class="cap" id="count"></div><div id="publist"></div></div></section>`;
    },
    news() { return head(ui("news")) + `<section><div class="wrap" style="max-width:780px">${timeline(L.news)}</div></section>`; },
    contact() {
      const row = (ic, k, v) => `<div class="cinfo"><div class="ico">${ic}</div><div><b>${ui(k)}</b>${v}</div></div>`;
      return head(ui("contact"), t(L.name)) + `<section><div class="wrap"><div class="grid g2"><div class="card rv">
        ${row(ICON.door, "office", esc(L.room) + " · " + esc(t(L.department)))}${row(ICON.phone, "phone", esc(L.phone))}
        ${row(ICON.mail, "email", `<a href="mailto:${esc(L.email)}">${esc(L.email)}</a>`)}${row(ICON.pin, "addr", esc(t(L.address)))}</div>
        <div class="card rv d2" style="padding:0;overflow:hidden;min-height:320px"><iframe title="map" style="border:0;width:100%;height:100%;min-height:320px" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=126.5370%2C33.4400%2C126.5650%2C33.4620&layer=mapnik&marker=33.4560%2C126.5612"></iframe></div></div></div></section>`;
    }
  };

  /* ---------- publications interactivity ---------- */
  function setupPubs() {
    let topicF = "all", yearF = null;
    const list = $("#publist"), q = $("#q");
    function draw() {
      const s = q.value.toLowerCase();
      const items = pubs().filter((p) => (topicF === "all" || topic(p) === topicF) && (!yearF || String(p.year) === yearF) && (p.title + p.authors + p.venue + p.year).toLowerCase().includes(s));
      let y = null, h = "";
      items.forEach((p) => {
        if (p.year !== y) { y = p.year; h += `<div class="year-h"><span>${y}</span></div>`; }
        const k = topic(p);
        h += `<div class="pub tag-${k}" style="--c:var(--${{ v: "accent", g: "accent3", x: "warm", m: "accent2" }[k]})"><div class="meta"><span class="badge">${ui(TOPIC_KEY[k])}</span></div><h4>${esc(p.title)}</h4><div class="au">${esc(p.authors)}</div><div class="ve">${esc(p.venue)}</div></div>`;
      });
      list.innerHTML = h || `<div class="empty">—</div>`;
      $("#count").textContent = `${items.length} ${ui("shown")}`;
      $$("#chart .bar").forEach((b) => b.classList.toggle("dim", !!yearF && b.dataset.y !== yearF));
    }
    q.addEventListener("input", draw);
    $$(".fbtn").forEach((b) => b.addEventListener("click", () => { topicF = b.dataset.t; $$(".fbtn").forEach((x) => x.classList.toggle("on", x === b)); draw(); }));
    $$("#chart .bar").forEach((b) => b.addEventListener("click", () => { yearF = yearF === b.dataset.y ? null : b.dataset.y; draw(); }));
    draw();
    requestAnimationFrame(() => setTimeout(() => $$("#chart i").forEach((i) => (i.style.height = i.dataset.h + "%")), 60));
  }

  /* ---------- effects ---------- */
  function reveal() {
    const els = $$(".rv");
    if (!("IntersectionObserver" in window) || reduce) { els.forEach((e) => e.classList.add("in")); $$("[data-count]").forEach((e) => (e.textContent = e.dataset.count)); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in"); io.unobserve(e.target);
      e.target.querySelectorAll("[data-count]").forEach(count);
    }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }
  function count(el) {
    const n = +el.dataset.count, t0 = performance.now();
    (function step(now) { const p = Math.min(1, (now - t0) / 1200); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t0);
  }

  /* hero: rotating 3D mesh + scan line + detection boxes + particles */
  function heroAnim() {
    const c = $("#bg"); if (!c) return;
    const x = c.getContext("2d"); let w, h, dpr, mx = 0, my = 0;
    const N = 30, M = 16, pts = [];
    for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
      const u = (i / N) * 2 * Math.PI, v = (j / M) * 2 * Math.PI, R = 1, r = 0.45;
      pts.push([(R + r * Math.cos(v)) * Math.cos(u), (R + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v)]);
    }
    const dust = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), s: Math.random() * 1.6 + .4, v: Math.random() * .0004 + .0001 }));
    const boxes = [
      { l: "face 0.98", c: "#5ef2e6", ox: -.62, oy: -.28, bw: .2, bh: .26, ph: 0 },
      { l: "object 0.94", c: "#8fa5ff", ox: .52, oy: .1, bw: .24, bh: .2, ph: 2 },
      { l: "pose 0.91", c: "#ff9b7a", ox: -.12, oy: .55, bw: .26, bh: .22, ph: 4 }
    ];
    function size() { dpr = Math.min(2, devicePixelRatio || 1); w = c.offsetWidth; h = c.offsetHeight; c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); window.addEventListener("resize", size);
    c.parentElement.addEventListener("mousemove", (e) => { mx = e.clientX / w - .5; my = e.clientY / h - .5; });
    const t0 = performance.now();
    function frame(now) {
      if (!document.body.contains(c)) return;
      const tt = (now - t0) / 1000, wide = w > 900;
      const cx = wide ? w * .72 : w * .5, cy = h * (wide ? .48 : .72), sc = Math.min(w, h) * (wide ? .27 : .2);
      x.clearRect(0, 0, w, h);
      dust.forEach((d) => { d.y = (d.y + d.v) % 1; x.fillStyle = "rgba(160,180,255,.45)"; x.beginPath(); x.arc(d.x * w, d.y * h, d.s, 0, 7); x.fill(); });
      const a = tt * .45 + mx * 1.2, b = .9 + my * .6 + Math.sin(tt * .4) * .15, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      const scan = (Math.sin(tt * 1.1) * .5 + .5) * 2 - 1;
      const P = pts.map((p) => {
        let X = p[0] * ca - p[1] * sa, Y = p[0] * sa + p[1] * ca, Z = p[2];
        const Y2 = Y * cb - Z * sb, Z2 = Y * sb + Z * cb, f = 3.2 / (3.2 + Z2);
        return [cx + X * sc * f, cy + Y2 * sc * f, Z2, Y2];
      });
      x.lineWidth = 1;
      for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
        const p = P[i * M + j], q1 = P[((i + 1) % N) * M + j], q2 = P[i * M + ((j + 1) % M)];
        const al = .1 + .22 * (1 - (p[2] + 1.5) / 3);
        x.strokeStyle = `rgba(140,170,255,${al})`;
        x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(q1[0], q1[1]); x.moveTo(p[0], p[1]); x.lineTo(q2[0], q2[1]); x.stroke();
      }
      P.forEach((p) => {
        const near = Math.abs(p[3] - scan * 1.4) < .12;
        x.fillStyle = near ? "#5ef2e6" : "rgba(190,205,255,.85)";
        x.beginPath(); x.arc(p[0], p[1], near ? 2.8 : 1.5, 0, 7); x.fill();
      });
      const sy = cy + scan * 1.4 * sc;
      const g = x.createLinearGradient(cx - 1.7 * sc, 0, cx + 1.7 * sc, 0);
      g.addColorStop(0, "transparent"); g.addColorStop(.5, "rgba(94,242,230,.8)"); g.addColorStop(1, "transparent");
      x.strokeStyle = g; x.lineWidth = 2; x.beginPath(); x.moveTo(cx - 1.7 * sc, sy); x.lineTo(cx + 1.7 * sc, sy); x.stroke();
      if (wide) boxes.forEach((bx) => {
        const k = Math.sin(tt * .8 + bx.ph), bw = bx.bw * sc * 2.3, bh = bx.bh * sc * 2.3;
        const X = cx + (bx.ox + k * .04) * sc * 2.2 - bw / 2, Y = cy + (bx.oy + Math.cos(tt * .7 + bx.ph) * .04) * sc * 2.2 - bh / 2;
        x.strokeStyle = bx.c; x.lineWidth = 1.6; const cl = 12;
        x.beginPath();
        [[X, Y, 1, 1], [X + bw, Y, -1, 1], [X, Y + bh, 1, -1], [X + bw, Y + bh, -1, -1]].forEach(([px, py, dx, dy]) => { x.moveTo(px + dx * cl, py); x.lineTo(px, py); x.lineTo(px, py + dy * cl); });
        x.stroke();
        x.font = "600 11px Inter,sans-serif"; const tw = x.measureText(bx.l).width + 12;
        x.fillStyle = bx.c; x.fillRect(X, Y - 18, tw, 16); x.fillStyle = "#06102a"; x.fillText(bx.l, X + 6, Y - 6);
      });
      if (!reduce) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function onScroll() {
    const hd = $("header.site"), r = route();
    hd.classList.toggle("page", r !== "home");
    hd.classList.toggle("solid", r === "home" && scrollY > 60);
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#progress").style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  }

  /* ---------- shell ---------- */
  function frame() {
    const r = route();
    document.documentElement.lang = lang;
    document.title = `${L.short} · ${t(L.university)}`;
    $("#brand").innerHTML = `<i></i>${esc(L.short)}`;
    $("#menu").innerHTML = routes.map((k) => `<li><a href="#${k}" class="${k === r ? "active" : ""}">${esc(t(U.nav[k]))}</a></li>`).join("") +
      `<li><a href="#" class="lang" id="lang">${lang === "en" ? "한국어" : "EN"}</a></li>`;
    $("#main").innerHTML = pages[r]();
    $("#foot").innerHTML = `<div><h5>${esc(t(L.name))}</h5>${esc(t(L.university))} · ${esc(t(L.department))}<br>${esc(t(L.address))}<br><br>© ${new Date().getFullYear()} ${esc(L.short)}. ${ui("rights")}</div>
      <div><h5>${ui("nav") || ""}Menu</h5><ul>${routes.map((k) => `<li><a href="#${k}">${esc(t(U.nav[k]))}</a></li>`).join("")}</ul></div>
      <div><h5>${ui("contact")}</h5><ul><li>${esc(L.phone)}</li><li><a href="mailto:${esc(L.email)}">${esc(L.email)}</a></li><li><a href="${esc(L.professor.scholar)}" target="_blank" rel="noopener">${ui("scholar")}</a></li></ul></div>`;
    if (r === "publications") setupPubs();
    if (r === "home") heroAnim();
    reveal(); onScroll();
    $("#lang").addEventListener("click", (e) => { e.preventDefault(); lang = lang === "en" ? "ko" : "en"; try { localStorage.setItem("lang", lang); } catch (_) {} frame(); });
    $("#menu").classList.remove("open");
  }

  $("#burger").addEventListener("click", () => $("#menu").classList.toggle("open"));
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("hashchange", () => { frame(); window.scrollTo(0, 0); });
  frame();
})();
