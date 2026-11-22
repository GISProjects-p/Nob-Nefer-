(() => {
  // ---------- Settings: change these if your files are elsewhere ----------
  window.NOB_CONFIG = {
    imageDir: "assets/",                       // location photos: assets/1.jpg … assets/21.jpg
    imageExts: ["jpg", "jpeg", "png", "webp"]  // extensions to try, in order
  };

  // ---------- Locations: [en, fr, de, ar, specimens, lon, lat, continent] ----------
  const R = [
    ["Gandor Art Foundation, Geneva, Switzerland", "Fondation d'art Gandor, Genève, Suisse", "Gandor Kunststiftung, Genf, Schweiz", "مؤسسة جاندور للفنون، جنيف، سويسرا", 1, 6.151335, 46.199144, "EU"],
    ["British Museum, London", "British Museum, Londres", "Britisches Museum, London", "المتحف البريطاني، لندن", 1, -0.126948, 51.519495, "EU"],
    ["National Library of France, Paris, France", "Bibliothèque nationale de France, Paris, France", "Nationalbibliothek von Frankreich, Paris, Frankreich", "المكتبة الوطنية الفرنسية، باريس، فرنسا", 1, 2.375812, 48.833564, "EU"],
    ["Kestner Museum, Hanover, Germany", "Musée Kestner, Hanovre, Allemagne", "Kestner-Museum, Hannover, Deutschland", "متحف كستنر، هانوفر، ألمانيا", 1, 9.736244, 52.368123, "EU"],
    ["American Numismatic Society, New York, USA", "Société numismatique américaine, New York, États-Unis", "Amerikanische Numismatische Gesellschaft, New York, USA", "الجمعية الأمريكية لعلم المسكوكات، نيويورك، الولايات المتحدة", 1, -74.006866, 40.72355, "NA"],
    ["Greco Roman Museum, Alexandria, Egypt", "Musée gréco-romain, Alexandrie, Égypte", "Griechisch-Römisches Museum, Alexandria, Ägypten", "المتحف اليوناني الروماني، الإسكندرية، مصر", 1, 29.906902, 31.199174, "AF"],
    ["Egyptian Museum, Cairo, Egypt", "Musée égyptien, Le Caire, Égypte", "Ägyptisches Museum, Kairo, Ägypten", "المتحف المصري، القاهرة، مصر", 2, 31.233627, 30.04775, "AF"],
    ["Museum of Egypt's Capitals, New Capital, Egypt", "Musée des capitales d'Égypte, Nouvelle Capitale, Égypte", "Museum der ägyptischen Hauptstädte, Neue Hauptstadt, Ägypten", "متحف عواصم مصر، العاصمة الجديدة، مصر", 1, 31.721734, 30.013908, "AF"],
    ["Museum of Art, San Antonio, USA", "Musée d'art, San Antonio, États-Unis", "Kunstmuseum, San Antonio, USA", "متحف الفن، سان أنطونيو، الولايات المتحدة", 1, -98.482126, 29.43736, "NA"],
    ["Kunsthistorisches Museum, Vienna, Austria", "Musée d'histoire de l'art, Vienne, Autriche", "Kunsthistorisches Museum, Wien, Österreich", "متحف تاريخ الفن، فيينا، النمسا", 1, 16.361827, 48.203793, "EU"],
    ["Royal Mint Museum, Madrid, Spain", "Musée royal de la monnaie, Madrid, Espagne", "Königliches Münzmuseum, Madrid, Spanien", "المتحف الملكي للعملة، مدريد، إسبانيا", 1, -3.669926, 40.422651, "EU"],
    ["Coin Cabinet, National Museums in Berlin, Germany", "Cabinet des monnaies, Musées nationaux de Berlin, Allemagne", "Münzkabinett, Staatliche Museen zu Berlin, Deutschland", "خزانة العملات، متاحف برلين الحكومية، ألمانيا", 1, 13.397132, 52.518884, "EU"],
    ["Israel Museum, Jerusalem", "Musée d'Israël, Jérusalem", "Israel-Museum, Jerusalem", "متحف إسرائيل، القدس", 1, 35.204044, 31.771744, "AS"],
    ["National Numismatic Collection, Copenhagen, Denmark", "Collection numismatique nationale, Copenhague, Danemark", "Nationale Numismatische Sammlung, Kopenhagen, Dänemark", "المجموعة الوطنية لعلم المسكوكات، كوبنهاغن، الدنمارك", 1, 12.57509, 55.674752, "EU"],
    ["Cabinet of Medals, Paris, France", "Cabinet des médailles, Paris, France", "Medaillenkabinett, Paris, Frankreich", "خزانة الميداليات، باريس، فرنسا", 1, 2.338411, 48.86731, "EU"],
    ["Cantonal Coin Museum, Lausanne, Switzerland", "Musée monétaire cantonal, Lausanne, Suisse", "Kantonales Münzmuseum, Lausanne, Schweiz", "المتحف النقدي الكانتوني، لوزان، سويسرا", 1, 6.633875, 46.523635, "EU"],
    ["Fitzwilliam Museum, Cambridge, United Kingdom", "Musée Fitzwilliam, Cambridge, Royaume-Uni", "Fitzwilliam-Museum, Cambridge, Vereinigtes Königreich", "متحف فيتزويليام، كامبريدج، المملكة المتحدة", 1, 0.119509, 52.200218, "EU"],
    ["Ashmolean Museum, Oxford, United Kingdom", "Musée Ashmolean, Oxford, Royaume-Uni", "Ashmolean Museum, Oxford, Vereinigtes Königreich", "متحف أشموليان، أكسفورد، المملكة المتحدة", 1, -1.260327, 51.755644, "EU"],
    ["State Hermitage Museum, St Petersburg, Russia", "Musée de l'Ermitage, Saint-Pétersbourg, Russie", "Staatliche Eremitage, Sankt Petersburg, Russland", "متحف الإرميتاج الحكومي، سانت بطرسبرغ، روسيا", 1, 30.313575, 59.940426, "EU"],
    ["Egyptian Museum, Berlin, Germany", "Musée égyptien, Berlin, Allemagne", "Ägyptisches Museum, Berlin, Deutschland", "المتحف المصري، برلين، ألمانيا", 1, 13.397638, 52.520287, "EU"],
    ["Roemer- und Pelizaeus-Museum, Hildesheim, Germany", "Musée Roemer et Pelizaeus, Hildesheim, Allemagne", "Roemer- und Pelizaeus-Museum, Hildesheim, Deutschland", "متحف رومر وبيليزايوس، هيلدسهايم، ألمانيا", 1, 9.944171, 52.149388, "EU"]
  ];
  window.NOB_LOCATIONS = R.map((r, i) => ({ id: i + 1, names: { en: r[0], fr: r[1], de: r[2], ar: r[3] }, count: r[4], lon: r[5], lat: r[6], cont: r[7] }));

  // ---------- Translation patch (runs after translations.js) ----------
  const T = window.NOB_TRANSLATIONS;
  const NAMES = { en: ["Nectanebo II", "Nub Nefer"], fr: ["Nectanébo II", "Nub Nefer"], de: ["Nektanebos II.", "Nub Nefer"], ar: ["نختنبو الثاني", "نوب نفر"] };
  const Q = { en: ["“", "”"], fr: ["«\u00a0", "\u00a0»"], de: ["„", "“"], ar: ["«", "»"] };
  Object.keys(NAMES).forEach((lang) => NAMES[lang].forEach((n) => {
    const re = new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    Object.keys(T[lang]).forEach((k) => { T[lang][k] = T[lang][k].replace(re, (m) => Q[lang][0] + m + Q[lang][1]); });
  }));

  const C = {
    en: { credit1: "Dr. Almoatzbellah Elshahawi", credit2: "Hekmat Awad El-kilany" },
    fr: { credit1: "Dr Almoatzbellah Elshahawi", credit2: "Hekmat Awad El-kilany" },
    de: { credit1: "Dr. Almoatzbellah Elshahawi", credit2: "Hekmat Awad El-kilany" },
    ar: { credit1: "د. المعتز بالله الشهاوي", credit2: "حكمت عوض الكيلاني" }
  };
  const H = {
    en: { heroHeading: "REUNITING THE DISPERSED <span>NUB NEFER</span> COINS", horseTitle: "Horse emblem", horseText: "Strength · royal power", qrCaption: "SCAN TO EXPLORE" },
    fr: { heroHeading: "RÉUNIR LES MONNAIES <span>NUB NEFER</span> DISPERSÉES", horseTitle: "Emblème du cheval", horseText: "Force · pouvoir royal", qrCaption: "SCANNEZ POUR EXPLORER" },
    de: { heroHeading: "DIE ZERSTREUTEN <span>NUB-NEFER</span>-MÜNZEN WIEDERVEREINEN", horseTitle: "Pferdemotiv", horseText: "Stärke · königliche Macht", qrCaption: "ZUM ENTDECKEN SCANNEN" },
    ar: { heroHeading: "إعادة جمع عملات <span>نوب نفر</span> المتفرقة", horseTitle: "رمز الحصان", horseText: "القوة · السلطة الملكية", qrCaption: "امسح الرمز للاستكشاف" }
  };
  const X = {
    en: { chartKicker: "SPECIMENS BY CONTINENT", chartEyebrow: "THE DISTRIBUTION", chartTitle: "Where the specimens rest today", chartText: "Recorded specimens grouped by the continent of the museum that holds them.", contAfrica: "Africa", contEurope: "Europe", contNorthAmerica: "North America", contAsia: "Asia", mapCredit: "Map data: Natural Earth" },
    fr: { chartKicker: "EXEMPLAIRES PAR CONTINENT", chartEyebrow: "LA RÉPARTITION", chartTitle: "Où reposent aujourd’hui les exemplaires", chartText: "Exemplaires recensés, regroupés par continent du musée qui les conserve.", contAfrica: "Afrique", contEurope: "Europe", contNorthAmerica: "Amérique du Nord", contAsia: "Asie", mapCredit: "Données cartographiques : Natural Earth" },
    de: { chartKicker: "EXEMPLARE NACH KONTINENT", chartEyebrow: "DIE VERTEILUNG", chartTitle: "Wo die Exemplare heute aufbewahrt werden", chartText: "Dokumentierte Exemplare, gruppiert nach dem Kontinent des aufbewahrenden Museums.", contAfrica: "Afrika", contEurope: "Europa", contNorthAmerica: "Nordamerika", contAsia: "Asien", mapCredit: "Kartendaten: Natural Earth" },
    ar: { chartKicker: "العينات حسب القارة", chartEyebrow: "التوزيع", chartTitle: "أين تُحفظ العينات اليوم", chartText: "العينات المسجلة مجمعة حسب قارة المتحف الذي يحفظها.", contAfrica: "إفريقيا", contEurope: "أوروبا", contNorthAmerica: "أمريكا الشمالية", contAsia: "آسيا", mapCredit: "بيانات الخريطة: Natural Earth" }
  };
  Object.keys(X).forEach((lang) => {
    const [a, b] = lang === "ar" ? ["نوب", "نفر"] : ["NUB", "NEFER"];
    Object.assign(T[lang], X[lang], C[lang], H[lang], { brandHtml: `${a} <b>${b}</b>`, heroTitle: `${a} <span>${b}</span>`, footerBrand: `${a} ${b}` });
  });

  // ---------- Continent chart ----------
  const el = document.getElementById("continentChart");
  if (!el) return;
  const KEY = { EU: "contEurope", AF: "contAfrica", NA: "contNorthAmerica", AS: "contAsia" };
  const sums = {};
  window.NOB_LOCATIONS.forEach((l) => { sums[l.cont] = (sums[l.cont] || 0) + l.count; });
  const total = Object.values(sums).reduce((a, b) => a + b, 0), max = Math.max(...Object.values(sums));
  let shown = false;
  function render() {
    const d = T[document.documentElement.lang] || T.en;
    el.innerHTML = Object.keys(sums).sort((a, b) => sums[b] - sums[a]).map((c) =>
      `<div class="bar-row"><span class="bar-label">${d[KEY[c]]}</span><span class="bar-track"><i data-w="${sums[c] / max * 100}" style="width:${shown ? sums[c] / max * 100 : 0}%"></i></span><b>${sums[c]}</b></div>`).join("") +
      `<p class="chart-total"><strong>${total}</strong> ${d.specimensLabel}</p>`;
  }
  render();
  window.addEventListener("nob-language-change", render);
  new IntersectionObserver((entries, io) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    shown = true; io.disconnect();
    el.querySelectorAll("i").forEach((i) => { i.style.width = i.dataset.w + "%"; });
  }, { threshold: 0.3 }).observe(el);
})();
