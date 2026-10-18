// Build / Break mode, the security checklist, and the counters.
(function () {
  const root = document.documentElement;
  const KEY = "mi-mode";

  function setMode(mode) {
    root.classList.toggle("break", mode === "break");
    document.querySelectorAll(".mode").forEach((b) => b.setAttribute("aria-pressed", mode === "break"));
    try { localStorage.setItem(KEY, mode); } catch (e) {}
  }
  let saved = "build";
  try { saved = localStorage.getItem(KEY) || "build"; } catch (e) {}
  setMode(saved);

  document.querySelectorAll(".mode").forEach((b) =>
    b.addEventListener("click", () => setMode(root.classList.contains("break") ? "build" : "break"))
  );
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() !== "b" || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/input|textarea|select/i.test(document.activeElement.tagName)) return;
    setMode(root.classList.contains("break") ? "build" : "break");
  });

  // checklist: opening an item marks it checked
  const items = [...document.querySelectorAll(".checks li")];
  const out = document.querySelector("[data-score]");
  const meter = document.querySelector(".meter");
  if (meter) meter.innerHTML = items.map(() => "<i></i>").join("");
  function score() {
    const n = items.filter((li) => li.classList.contains("on")).length;
    if (out) out.textContent = n;
    if (meter) [...meter.children].forEach((i, k) => i.classList.toggle("on", k < n));
  }
  items.forEach((li) => {
    const btn = li.querySelector("button");
    btn.addEventListener("click", () => {
      const open = !li.classList.contains("open");
      li.classList.toggle("open", open);
      li.classList.add("on");
      btn.setAttribute("aria-expanded", open);
      score();
    });
  });
  score();

  // count up big numbers once they scroll into view
  const fmt = new Intl.NumberFormat(root.lang === "ar" ? "ar-EG" : "en-US");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const end = +en.target.dataset.count;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / 1400);
        en.target.textContent = fmt.format(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((el) => {
    el.textContent = fmt.format(+el.dataset.count);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) io.observe(el);
  });
})();
