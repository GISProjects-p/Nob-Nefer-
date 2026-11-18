(() => {
  const CFG = window.NOB_CONFIG, L = window.NOB_LOCATIONS;
  const CDN = "https://cdn.jsdelivr.net/npm/world-atlas@2/";
  const LAND = ["assets/data/land-110m.json", CDN + "land-110m.json"];
  const CTRY = ["assets/data/countries-110m.json", CDN + "countries-110m.json"];
  const CENTER = [29.0292848, 26.8858423]; // centre of Egypt [lon, lat]

  // Approximate outline of Egypt (clockwise, clipped to the coastline at draw time)
  const EGYPT = { type: "Polygon", coordinates: [[[25, 31.6], [34.2, 31.3], [34.9, 29.5], [34.3, 27.8], [35.5, 24], [36.9, 22], [25, 22], [25, 31.6]]] };

  // ISO numeric -> alpha-2 (used to translate country names with Intl.DisplayNames)
  const ISO_MAP = {};
  "4AF 8AL 12DZ 24AO 31AZ 32AR 36AU 40AT 44BS 50BD 51AM 56BE 64BT 68BO 70BA 72BW 76BR 84BZ 90SB 96BN 100BG 104MM 108BI 112BY 116KH 120CM 124CA 140CF 144LK 148TD 152CL 156CN 158TW 170CO 178CG 180CD 188CR 191HR 192CU 196CY 203CZ 204BJ 208DK 214DO 218EC 222SV 226GQ 231ET 232ER 233EE 238FK 242FJ 246FI 250FR 260TF 266GA 268GE 270GM 275PS 276DE 288GH 300GR 304GL 320GT 324GN 328GY 332HT 340HN 348HU 352IS 356IN 360ID 364IR 368IQ 372IE 376IL 380IT 384CI 388JM 392JP 398KZ 400JO 404KE 408KP 410KR 414KW 417KG 418LA 422LB 426LS 428LV 430LR 434LY 440LT 442LU 450MG 454MW 458MY 466ML 478MR 484MX 496MN 498MD 499ME 504MA 508MZ 512OM 516NA 524NP 528NL 540NC 548VU 554NZ 558NI 562NE 566NG 578NO 586PK 591PA 598PG 600PY 604PE 608PH 616PL 620PT 624GW 626TL 630PR 634QA 642RO 643RU 646RW 682SA 686SN 688RS 694SL 703SK 704VN 705SI 706SO 710ZA 716ZW 724ES 728SS 729SD 732EH 740SR 748SZ 752SE 756CH 760SY 762TJ 764TH 768TG 780TT 784AE 788TN 792TR 795TM 800UG 804UA 807MK 818EG 826GB 834TZ 840US 854BF 858UY 860UZ 862VE 887YE 894ZM"
    .replace(/(\d+)([A-Z]{2})/g, (m, n, c) => { ISO_MAP[+n] = c; return m; });

  const UI = {
    en: { flat: "Flat map", globe: "Globe", reset: "Reset view", km: "km", E: "E", W: "W", N: "N", S: "S", err: "The map data could not be loaded. Run the site through a local server (not file://) and check assets/data/land-110m.json." },
    fr: { flat: "Carte plane", globe: "Globe", reset: "Réinitialiser", km: "km", E: "E", W: "O", N: "N", S: "S", err: "Les données de la carte n’ont pas pu être chargées. Lancez le site via un serveur local et vérifiez assets/data/land-110m.json." },
    de: { flat: "Flachkarte", globe: "Globus", reset: "Zurücksetzen", km: "km", E: "O", W: "W", N: "N", S: "S", err: "Die Kartendaten konnten nicht geladen werden. Starten Sie die Seite über einen lokalen Server und prüfen Sie assets/data/land-110m.json." },
    ar: { flat: "خريطة مسطحة", globe: "كرة أرضية", reset: "إعادة الضبط", km: "كم", E: "شرقًا", W: "غربًا", N: "شمالًا", S: "جنوبًا", err: "تعذر تحميل بيانات الخريطة. شغّل الموقع عبر خادم محلي وتأكد من وجود assets/data/land-110m.json." }
  };

  const host = document.getElementById("mapView");
  const scene = host.parentElement;
  const errEl = document.getElementById("mapError");
  const card = document.getElementById("locationCard");
  const nameEl = document.getElementById("locationName");
  const countEl = document.getElementById("specimenCount");
  const hintEl = card.querySelector(".map-card-hint");
  const placeEl = Object.assign(document.createElement("p"), { className: "map-card-place" });
  nameEl.after(placeEl);
  const imgEl = Object.assign(document.createElement("img"), { className: "map-card-img", alt: "", hidden: true });
  card.querySelector(".eyebrow").before(imgEl);

  const lang = () => document.documentElement.lang || "en";
  const T = (k) => (UI[lang()] || UI.en)[k];
  const fail = () => { errEl.hidden = false; errEl.textContent = T("err"); };
  if (!window.d3 || !window.topojson || !L) { fail(); return; }

  async function loadJson(urls) {
    for (const url of urls) {
      try { const r = await fetch(url); if (r.ok) return await r.json(); } catch (e) { /* try next */ }
    }
    throw new Error("data missing");
  }

  Promise.all([loadJson(LAND), loadJson(CTRY).catch(() => null)])
    .then(([land, ctry]) => init(land, ctry))
    .catch((e) => { console.error(e); fail(); });

  function labelPoint(f) {
    const g = f.geometry;
    if (g.type === "Polygon") return d3.geoCentroid(f);
    let best = null, ba = -1;
    g.coordinates.forEach((c) => { const pf = { type: "Polygon", coordinates: c }, a = d3.geoArea(pf); if (a > ba) { ba = a; best = pf; } });
    return d3.geoCentroid(best);
  }

  function init(topo, ctopo) {
    const landFeature = topojson.feature(topo, topo.objects.land);
    const countries = ctopo ? topojson.feature(ctopo, ctopo.objects.countries).features
      .filter((f) => +f.id !== 10)
      .map((f) => ({ name: f.properties.name, code: ISO_MAP[+f.id], pt: labelPoint(f), area: d3.geoArea(f) })) : [];
    const graticule = d3.geoGraticule10();
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let mode = "flat", w = 0, h = 0, proj, path, s0, c0;
    let rot = [-CENTER[0], -CENTER[1]], tr = d3.zoomIdentity, sel = -1, playId = 0, imgToken = 0;
    const progress = L.map(() => 0);
    const arcInterp = L.map((l) => d3.geoInterpolate(CENTER, [l.lon, l.lat]));
    const dn = {};
    const cname = (c) => {
      if (!c.code) return c.name;
      try { dn[lang()] = dn[lang()] || new Intl.DisplayNames([lang()], { type: "region" }); return dn[lang()].of(c.code); } catch (e) { return c.name; }
    };
    const nm = (i) => L[i].names[lang()] || L[i].names.en;
    const split = (i) => { const p = nm(i).split(/[,،]\s*/); return [p[0], p.slice(1).join(lang() === "ar" ? "، " : ", ")]; };

    // ---------- SVG structure ----------
    const svg = d3.select(host).append("svg").attr("class", "geo-svg").attr("role", "img")
      .attr("aria-label", "Map of museums holding Nob Nefer coins");
    const defs = svg.append("defs");
    defs.append("filter").attr("id", "glow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%").html(
      '<feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>');
    const clipPath = defs.append("clipPath").attr("id", "landClip").append("path");
    const sphere = svg.append("path").attr("class", "g-sphere");
    const grat = svg.append("path").attr("class", "g-grat");
    const land = svg.append("path").attr("class", "g-land");
    const egypt = svg.append("path").attr("class", "g-egypt").attr("clip-path", "url(#landClip)");
    const cLabels = svg.append("g").selectAll("text").data(countries).join("text").attr("class", "g-country");
    const arcs = svg.append("g").selectAll("path").data(L).join("path").attr("class", "g-arc");
    const origin = svg.append("g").attr("class", "g-origin");
    origin.append("circle").attr("class", "g-pulse").html(
      '<animate attributeName="r" values="7;26;7" dur="3.2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0;.7" dur="3.2s" repeatCount="indefinite"/>');
    origin.append("circle").attr("class", "g-sun").attr("r", 6);
    const markers = svg.append("g").selectAll("g").data(L).join("g")
      .attr("class", "g-marker").attr("tabindex", 0).attr("role", "button");
    markers.append("circle").attr("class", "g-halo").attr("r", 11);
    markers.append("circle").attr("class", "g-dot").attr("r", 4.5);

    // ---------- Overlay UI ----------
    const ui = document.createElement("div");
    ui.className = "map-ui";
    ui.innerHTML = `
      <div class="map-controls">
        <div class="seg"><button type="button" data-mode="flat"></button><button type="button" data-mode="globe"></button></div>
        <button type="button" class="sq" data-zoom="in" aria-label="Zoom in">+</button>
        <button type="button" class="sq" data-zoom="out" aria-label="Zoom out">−</button>
        <button type="button" class="sq" data-zoom="reset">⟲</button>
      </div>
      <svg class="map-compass" viewBox="-40 -40 80 80" aria-hidden="true"><circle r="30" class="c-ring"/><path d="M0-34 7-7 34 0 7 7 0 34-7 7-34 0-7-7Z" class="c-star"/><path d="M0-34 7-7 0 0-7-7Z" class="c-north"/><text y="-38" text-anchor="middle" class="c-n">N</text></svg>
      <div class="map-scale"><span class="bar"></span><span class="lab"></span></div>
      <div class="map-coords" aria-hidden="true"></div>
      <div class="map-tip" hidden></div>`;
    scene.appendChild(ui);
    const $ = (s) => ui.querySelector(s);
    const tip = $(".map-tip"), coords = $(".map-coords"), bar = $(".map-scale .bar"), barLab = $(".map-scale .lab");

    function labels() {
      $('[data-mode="flat"]').textContent = T("flat");
      $('[data-mode="globe"]').textContent = T("globe");
      $('[data-zoom="reset"]').setAttribute("aria-label", T("reset"));
      markers.attr("aria-label", (d, i) => nm(i));
      cLabels.text(cname);
    }

    // ---------- Projection & zoom ----------
    const zoom = d3.zoom().scaleExtent([1, 10])
      .filter((e) => mode === "flat" ? !e.ctrlKey || e.type === "wheel" : e.type === "wheel")
      .on("zoom", (e) => { tr = e.transform; apply(); });
    const drag = d3.drag().filter(() => mode === "globe").on("drag", (e) => {
      rot = [rot[0] + e.dx * 0.25 / tr.k, Math.max(-90, Math.min(90, rot[1] - e.dy * 0.25 / tr.k))];
      apply();
    });
    svg.call(zoom).call(drag).on("dblclick.zoom", null);

    function setup() {
      w = host.clientWidth; h = host.clientHeight;
      if (mode === "flat") {
        proj = d3.geoNaturalEarth1();
        proj.fitSize([w, h], { type: "MultiPoint", coordinates: [[-170, 80], [170, 80], [-170, -55], [170, -55]] });
        s0 = proj.scale(); c0 = proj.translate();
      } else {
        proj = d3.geoOrthographic().clipAngle(90);
        s0 = Math.min(w, h) * 0.4; proj.scale(s0).translate([w / 2, h / 2]);
      }
      path = d3.geoPath(proj);
      zoom.extent([[0, 0], [w, h]]).translateExtent([[0, 0], [w, h]]);
      scene.classList.toggle("is-globe", mode === "globe");
    }

    function apply() {
      if (mode === "flat") proj.scale(s0 * tr.k).translate([c0[0] * tr.k + tr.x, c0[1] * tr.k + tr.y]);
      else proj.rotate(rot).scale(s0 * tr.k);
      draw();
    }

    function resetView() {
      rot = [-CENTER[0], -CENTER[1]];
      tr = d3.zoomIdentity;
      svg.call(zoom.transform, d3.zoomIdentity);
      apply();
    }

    // ---------- Drawing ----------
    const visible = (p) => mode === "flat" || d3.geoDistance(p, [-rot[0], -rot[1]]) < Math.PI / 2 - 0.02;
    function arcGeo(i) {
      const p = progress[i]; if (p <= 0) return null;
      const n = Math.max(2, Math.round(64 * p) + 1);
      return { type: "LineString", coordinates: Array.from({ length: n }, (_, j) => arcInterp[i](p * j / (n - 1))) };
    }

    function draw() {
      const P = (d) => (d && path(d)) || "";
      sphere.attr("d", P({ type: "Sphere" }));
      grat.attr("d", P(graticule));
      const landD = P(landFeature);
      land.attr("d", landD); clipPath.attr("d", landD);
      egypt.attr("d", P(EGYPT));
      const k2 = tr.k * tr.k;
      cLabels.attr("transform", (d) => { const p = proj(d.pt); return `translate(${p[0]},${p[1]})`; })
        .style("display", (d) => (d.area * k2 > 0.004 && visible(d.pt) ? null : "none"));
      arcs.attr("d", (d, i) => P(arcGeo(i)));
      const o = proj(CENTER);
      origin.attr("transform", `translate(${o[0]},${o[1]})`).style("display", visible(CENTER) ? null : "none");
      markers.attr("transform", (d) => { const p = proj([d.lon, d.lat]); return `translate(${p[0]},${p[1]})`; })
        .style("display", (d) => (visible([d.lon, d.lat]) ? null : "none"));
      updateScale();
    }

    function updateScale() {
      const a = proj.invert([w / 2 - 50, h / 2]), b = proj.invert([w / 2 + 50, h / 2]);
      if (!a || !b) return;
      const km = d3.geoDistance(a, b) * 6371;
      if (!isFinite(km) || km <= 0) return;
      const mag = Math.pow(10, Math.floor(Math.log10(km)));
      const nice = [5, 2, 1].map((m) => m * mag).find((v) => v <= km) || mag;
      bar.style.width = `${100 * nice / km}px`;
      barLab.textContent = `${nice.toLocaleString(lang() === "ar" ? "ar-EG" : lang())} ${T("km")}`;
    }

    function play() {
      const id = ++playId, t0 = performance.now();
      if (reduceMotion) { progress.fill(1); draw(); return; }
      progress.fill(0);
      (function frame(now) {
        if (id !== playId) return;
        let running = false;
        progress.forEach((_, i) => {
          const p = Math.max(0, Math.min(1, (now - t0 - i * 110) / 1500));
          progress[i] = 1 - Math.pow(1 - p, 3);
          if (p < 1) running = true;
        });
        draw();
        if (running) requestAnimationFrame(frame);
      })(t0);
    }

    // ---------- Selection card ----------
    function refreshMarkers() {
      markers.classed("is-selected", (d, i) => i === sel);
      markers.select(".g-dot").attr("r", (d, i) => (i === sel ? 7 : 4.5));
    }
    function fill(i) {
      const [first, rest] = split(i);
      nameEl.removeAttribute("data-i18n");
      nameEl.textContent = first;
      placeEl.textContent = rest;
      countEl.textContent = L[i].count;
      imgEl.alt = nm(i);
    }
    function showImage(i) {
      const token = ++imgToken, exts = CFG.imageExts.slice();
      imgEl.hidden = true;
      (function next() {
        if (token !== imgToken) return;
        const ext = exts.shift();
        if (!ext) return;
        imgEl.onload = () => { if (token === imgToken) imgEl.hidden = false; };
        imgEl.onerror = next;
        imgEl.src = `${CFG.imageDir}${L[i].id}.${ext}`;
      })();
    }
    function select(i) {
      sel = i; fill(i); showImage(i);
      hintEl.hidden = true;
      card.classList.add("has-selection");
      refreshMarkers();
      if (mode === "globe") {
        const r = d3.interpolate(rot, [-L[i].lon, -L[i].lat]);
        d3.transition().duration(900).tween("rot", () => (k) => { rot = r(k); apply(); });
      }
    }
    function clearSelection() {
      sel = -1; imgToken++;
      imgEl.hidden = true; imgEl.removeAttribute("src");
      nameEl.setAttribute("data-i18n", "locationPlaceholder");
      nameEl.textContent = (window.NOB_TRANSLATIONS[lang()] || window.NOB_TRANSLATIONS.en).locationPlaceholder;
      placeEl.textContent = ""; countEl.textContent = "—";
      hintEl.hidden = false; card.classList.remove("has-selection");
      refreshMarkers();
    }
    document.getElementById("closeCard").addEventListener("click", clearSelection);

    // ---------- Events ----------
    markers
      .on("click", (e, d) => select(L.indexOf(d)))
      .on("keydown", (e, d) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(L.indexOf(d)); } })
      .on("mouseenter", (e, d) => { tip.hidden = false; tip.textContent = nm(L.indexOf(d)); })
      .on("mousemove", (e) => { const [x, y] = d3.pointer(e, scene); tip.style.left = `${x}px`; tip.style.top = `${y}px`; })
      .on("mouseleave", () => { tip.hidden = true; });

    svg.on("mousemove.coords", (e) => {
      const c = proj.invert(d3.pointer(e, svg.node()));
      if (!c || !isFinite(c[0]) || Math.abs(c[0]) > 180 || Math.abs(c[1]) > 90) { coords.textContent = ""; return; }
      coords.textContent = `${Math.abs(c[0]).toFixed(2)}° ${T(c[0] < 0 ? "W" : "E")}   ${Math.abs(c[1]).toFixed(2)}° ${T(c[1] < 0 ? "S" : "N")}`;
    }).on("mouseleave.coords", () => { coords.textContent = ""; });

    ui.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.mode && b.dataset.mode !== mode) {
        mode = b.dataset.mode; setup(); resetView(); play();
        ui.querySelectorAll("[data-mode]").forEach((x) => x.classList.toggle("active", x.dataset.mode === mode));
      } else if (b.dataset.zoom === "in") svg.transition().duration(300).call(zoom.scaleBy, 1.6);
      else if (b.dataset.zoom === "out") svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.6);
      else if (b.dataset.zoom === "reset") resetView();
    });

    window.addEventListener("nob-language-change", () => { labels(); updateScale(); if (sel >= 0) fill(sel); });
    new ResizeObserver(() => { setup(); resetView(); }).observe(host);

    new IntersectionObserver((entries, io) => {
      if (entries.some((x) => x.isIntersecting)) { play(); io.disconnect(); }
    }, { threshold: 0.35 }).observe(host);

    ui.querySelector('[data-mode="flat"]').classList.add("active");
    labels(); setup(); resetView();
  }
})();
