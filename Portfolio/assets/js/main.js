/* Ayush Kumar · Portfolio
   Progressive enhancement only: every section renders without this file. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header: scrolled state + mobile menu ---------- */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    links.classList.toggle("is-open", open);
  }
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- active nav link ---------- */
  const navAnchors = [...links.querySelectorAll('a[href^="#"]')];
  const sections = navAnchors.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- hero terminal: play the release log ---------- */
  const term = document.getElementById("hero-term");
  if (term && !reduceMotion) {
    const lines = [...term.querySelectorAll(".t-line")];
    lines.forEach((l) => l.classList.add("is-pending"));
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    async function typeLine(line) {
      // Type the text after the prompt character by character.
      const prompt = line.querySelector(".t-prompt");
      const full = line.textContent.slice(prompt ? prompt.textContent.length : 0);
      const textNode = document.createTextNode("");
      line.replaceChildren(...(prompt ? [prompt] : []), textNode);
      line.classList.remove("is-pending");
      for (let i = 0; i <= full.length; i++) { textNode.data = full.slice(0, i); await sleep(38); }
    }

    (async function play() {
      await sleep(500);
      for (const line of lines) {
        if (line.hasAttribute("data-type")) { await typeLine(line); await sleep(350); }
        else { line.classList.remove("is-pending"); await sleep(line.classList.contains("t-done") ? 520 : 380); }
      }
    })();
  }

  /* ---------- pipeline tabs ---------- */
  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));

    function select(index, focus) {
      tabs.forEach((t, i) => {
        const on = i === index;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
        if (on) { panels[i].classList.remove("is-entering"); void panels[i].offsetWidth; panels[i].classList.add("is-entering"); }
      });
      if (focus) { tabs[index].focus(); tabs[index].scrollIntoView({ block: "nearest", inline: "nearest" }); }
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(i, false));
      tab.addEventListener("keydown", (e) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (e.key in keys) { e.preventDefault(); select((i + keys[e.key] + tabs.length) % tabs.length, true); }
        else if (e.key === "Home") { e.preventDefault(); select(0, true); }
        else if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });
    select(0, false);
  });

  /* ---------- project filters ---------- */
  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll("#project-grid .card");
  const empty = document.getElementById("grid-empty");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => { const on = b === btn; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
      let shown = 0;
      cards.forEach((card) => {
        const match = f === "all" || card.dataset.cat.split(" ").includes(f);
        card.classList.toggle("is-hidden", !match);
        if (match) { shown++; card.classList.add("is-visible"); }
      });
      empty.hidden = shown > 0;
    });
  });

  /* ---------- copy email ---------- */
  const copyBtn = document.getElementById("copy-email");
  const copyStatus = document.getElementById("copy-status");
  if (copyBtn) {
    const label = copyBtn.querySelector(".copy-label");
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        label.textContent = "Copied ✓";
        copyStatus.textContent = "Email address copied to clipboard";
      } catch {
        label.textContent = email;
        copyStatus.textContent = "Copy failed. Email is " + email;
      }
      setTimeout(() => { label.textContent = "Copy email"; }, 2200);
    });
  }

  /* ---------- footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
