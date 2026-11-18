(() => {
  const translations = window.NOB_TRANSLATIONS;
  const languageSelect = document.getElementById("languageSelect");
  const progressBar = document.getElementById("progressBar");

  function setLanguage(lang) {
    const dictionary = translations[lang] || translations.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      if (dictionary[key] !== undefined) element.innerHTML = dictionary[key];
    });
    languageSelect.value = lang;
    localStorage.setItem("nob-nefer-language", lang);
    window.dispatchEvent(new CustomEvent("nob-language-change", { detail: { lang } }));
  }

  const savedLanguage = localStorage.getItem("nob-nefer-language");
  setLanguage(savedLanguage && translations[savedLanguage] ? savedLanguage : "en");
  languageSelect.addEventListener("change", (event) => setLanguage(event.target.value));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
})();
