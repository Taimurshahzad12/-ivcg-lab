(function () {
  const L = window.LAB, U = window.UI;
  let lang = "en";
  if ((navigator.language || "").startsWith("ko")) lang = "ko";
  try { lang = localStorage.getItem("lang") || lang; } catch (e) {}

  const t = (o) => (o && typeof o === "object" ? o[lang] || o.en || "" : o || "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ui = (k) => t(U.s[k]);
  const $ = (s) => document.querySelector(s);

  const routes = ["home", "professor", "members", "research", "publications", "news", "contact"];
  const route = () => { const h = (location.hash || "#home").slice(1); return routes.includes(h) ? h : "home"; };

  function initials(name) { return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase(); }
  function avatar(photo, name) {
    const ini = esc(initials(name));
    // shows the photo if it exists, otherwise falls back to initials
    return `<div class="avatar">${photo ? `<img src="${esc(photo)}" alt="${esc(name)}" onerror="this.replaceWith(document.createTextNode('${ini}'))">` : ini}</div>`;
  }
  function links(m) {
    const a = [];
    if (m.email) a.push(`<a href="mailto:${esc(m.email)}">✉ Email</a>`);
    if (m.scholar) a.push(`<a href="${esc(m.scholar)}" target="_blank" rel="noopener">🎓 ${ui("scholar")}</a>`);
    return a.join("");
  }
  function memberCard(m) {
    return `<div class="card member">${avatar(m.photo, t(m.name))}
      <h3>${esc(t(m.name))}</h3><div class="role">${esc(t(m.role))}</div>
      <div class="tags">${(m.interests || []).map((i) => `<span class="tag">${esc(t(i))}</span>`).join("")}</div>
      <div class="links">${links(m)}</div></div>`;
  }
  const head = (title, sub) => `<div class="page-title"><div class="wrap"><h1>${esc(title)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}</div></div>`;

  const newsList = (items) => `<ul class="list">${items.map((n) => `<li><div class="date">${esc(n.date)}</div><div><h4>${esc(t(n.title))}</h4><p>${esc(t(n.text))}</p></div></li>`).join("")}</ul>`;
  const researchCards = () => `<div class="grid g4">${L.research.map((r) => `<div class="card"><div class="num">${r.id}</div><h3>${esc(t(r.title))}</h3><p>${esc(t(r.text))}</p></div>`).join("")}</div>`;
  const profBlock = () => {
    const p = L.professor;
    return `<div class="card prof">${avatar(p.photo, "Soo Kyun Kim")}<div>
      <h3 style="margin:0;font-size:1.5rem">${esc(t(p.name))}</h3><div class="role">${esc(t(p.title))}</div>
      <p><b>${ui("spec")}:</b> ${esc(t(p.specialization))}</p>
      <div class="tags" style="justify-content:flex-start">${p.interests.map((i) => `<span class="tag">${esc(t(i))}</span>`).join("")}</div>
      <p>${ui("office")}: ${esc(p.office)} · ${esc(p.phone)} · <a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p>
      <div class="links" style="margin-left:-6px"><a href="${esc(p.scholar)}" target="_blank" rel="noopener">🎓 ${ui("scholar")}</a></div></div></div>`;
  };

  const pages = {
    home() {
      return `<div class="hero"><canvas id="bg"></canvas><div class="wrap">
        <small>${esc(t(L.university))} · ${esc(t(L.department))}</small>
        <h1>${esc(t(L.name))}</h1><p>${esc(t(L.tagline))}</p><p style="font-size:1rem">${esc(t(L.intro))}</p>
        <a class="btn" href="#research">${ui("explore")}</a><a class="btn ghost" href="#contact">${ui("joinUs")}</a></div></div>
        ${L.recruiting ? `<div class="banner">${esc(t(L.recruiting))}</div>` : ""}
        <section><div class="wrap"><div class="sec-head"><h2>${ui("news")}</h2><a href="#news">${ui("all")}</a></div>${newsList(L.news.slice(0, 3))}</div></section>
        <section class="alt"><div class="wrap"><div class="sec-head"><h2>${ui("prof")}</h2><a href="#professor">${ui("all")}</a></div>${profBlock()}</div></section>
        <section><div class="wrap"><div class="sec-head"><div><h2>${ui("areas")}</h2><p class="sub">${ui("areasSub")}</p></div><a href="#research">${ui("all")}</a></div>${researchCards()}</div></section>
        <section class="alt"><div class="wrap"><div class="sec-head"><h2>${ui("members")}</h2><a href="#members">${ui("all")}</a></div>
          <div class="grid g3">${[...L.members.phd, ...L.members.ms, ...L.members.undergrad].map(memberCard).join("")}</div></div></section>`;
    },
    professor() { return head(ui("prof")) + `<section><div class="wrap">${profBlock()}</div></section>`; },
    members() {
      const grp = (k) => {
        const a = L.members[k];
        return `<h2 style="margin:36px 0 18px;font-size:1.4rem">${ui(k)}</h2>` +
          (a.length ? `<div class="grid g3">${a.map(memberCard).join("")}</div>` : `<div class="empty">${ui("soon")}</div>`);
      };
      return head(ui("members")) + `<section style="padding-top:20px"><div class="wrap">${["phd", "ms", "undergrad", "alumni"].map(grp).join("")}</div></section>`;
    },
    research() {
      const proj = L.projects.length
        ? `<h2 style="margin:48px 0 18px">${ui("projects")}</h2><ul class="list">${L.projects.map((p) => `<li><div class="date">${esc(p.period)}</div><div><h4>${esc(t(p.title))}</h4><p>${esc(t(p.funder))}<br>${esc(t(p.text))}</p></div></li>`).join("")}</ul>` : "";
      return head(ui("areas"), ui("areasSub")) + `<section><div class="wrap">${researchCards()}${proj}</div></section>`;
    },
    publications() {
      return head(ui("pubs")) + `<section style="padding-top:24px"><div class="wrap"><div class="filters"><input id="q" placeholder="${esc(ui("search"))}"></div><div id="publist"></div></div></section>`;
    },
    news() { return head(ui("news")) + `<section><div class="wrap">${newsList(L.news)}</div></section>`; },
    contact() {
      return head(ui("contact")) + `<section><div class="wrap"><div class="card" style="max-width:640px">
        <h3>${esc(t(L.name))}</h3><p>${esc(t(L.university))} · ${esc(t(L.department))}</p>
        <p><b>${ui("office")}:</b> ${esc(L.room)}<br><b>${ui("phone")}:</b> ${esc(L.phone)}<br>
        <b>${ui("email")}:</b> <a href="mailto:${esc(L.email)}">${esc(L.email)}</a><br><b>${ui("addr")}:</b> ${esc(t(L.address))}</p>
        <a class="btn" style="margin:8px 0 0" href="https://map.kakao.com/?q=${encodeURIComponent("제주대학교")}" target="_blank" rel="noopener">Map</a></div></div></section>`;
    }
  };

  function renderPubs() {
    const q = ($("#q") ? $("#q").value : "").toLowerCase();
    const items = L.publications.filter((p) => (p.title + p.authors + p.venue + p.year).toLowerCase().includes(q));
    let y = null, h = "";
    items.forEach((p) => {
      if (p.year !== y) { y = p.year; h += `<div class="year-h">${y}</div>`; }
      h += `<div class="pub"><h4>${esc(p.title)}</h4><div class="au">${esc(p.authors)}</div><div class="ve">${esc(p.venue)}</div></div>`;
    });
    $("#publist").innerHTML = h || `<div class="empty">—</div>`;
  }

  function bgAnim() {
    const c = $("#bg"); if (!c) return;
    const x = c.getContext("2d"); let w, h, pts;
    const size = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; pts = Array.from({ length: Math.min(70, w / 14 | 0) }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 })); };
    size(); window.addEventListener("resize", size);
    (function loop() {
      if (!document.body.contains(c)) return;
      x.clearRect(0, 0, w, h);
      pts.forEach((p) => { p.x = (p.x + p.vx + w) % w; p.y = (p.y + p.vy + h) % h; x.fillStyle = "#9fb4ff"; x.fillRect(p.x, p.y, 2.5, 2.5); });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 110) { x.strokeStyle = `rgba(159,180,255,${1 - d / 110})`; x.beginPath(); x.moveTo(pts[i].x, pts[i].y); x.lineTo(pts[j].x, pts[j].y); x.stroke(); }
      }
      requestAnimationFrame(loop);
    })();
  }

  function frame() {
    const r = route();
    document.documentElement.lang = lang;
    document.title = `${L.short} · ${t(L.university)}`;
    $("#brand").innerHTML = `${esc(L.short.split(" ")[0])}<span> Lab</span>`;
    $("#menu").innerHTML = routes.map((k) => `<li><a href="#${k}" class="${k === r ? "active" : ""}">${esc(t(U.nav[k]))}</a></li>`).join("") +
      `<li><a href="#" id="lang">${lang === "en" ? "한국어" : "English"}</a></li>`;
    $("#main").innerHTML = pages[r]();
    $("#foot").innerHTML = `<div><b>${esc(t(L.name))}</b><br>${esc(t(L.university))} · ${esc(t(L.department))}<br>${esc(t(L.address))}</div>
      <div>${esc(L.phone)}<br><a href="mailto:${esc(L.email)}">${esc(L.email)}</a><br>© ${new Date().getFullYear()} ${esc(L.short)}. ${ui("rights")}</div>`;
    if (r === "publications") { renderPubs(); $("#q").addEventListener("input", renderPubs); }
    if (r === "home") bgAnim();
    $("#lang").addEventListener("click", (e) => { e.preventDefault(); lang = lang === "en" ? "ko" : "en"; try { localStorage.setItem("lang", lang); } catch (_) {} frame(); });
    $("#menu").classList.remove("open");
  }

  $("#burger").addEventListener("click", () => $("#menu").classList.toggle("open"));
  window.addEventListener("hashchange", () => { frame(); window.scrollTo(0, 0); });
  frame();
})();
