"use client";

import { useEffect, useState } from "react";
import { STAGES, StateIcon, usePipeline } from "./pipeline";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#workflow", label: "Workflow" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function TopBar({ sha }: { sha: string }) {
  const { active, done, stateOf } = usePipeline();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const total = STAGES.length;
  const passed = done ? total : active;
  const pct = Math.round((passed / total) * 100);

  return (
    <header className={`topbar${scrolled ? " is-scrolled" : ""}`}>
      <div className="container topbar-row">
        <a href="#top" className="brand" aria-label="Back to top">
          <span className="brand-user">ayush</span>
          <span className="brand-at">@</span>
          <span className="brand-host">devops</span>
          <span className="brand-path">:~$</span>
          <span className="caret" aria-hidden />
        </a>

        <div className="topbar-tools">
          <ThemeToggle />
          <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          </button>
        </div>

        <nav id="site-nav" className={`nav${open ? " is-open" : ""}`} onClick={() => setOpen(false)}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
          <a href="/api/resume" className="btn btn-sm btn-ghost">
            Résumé ↓
          </a>
        </nav>
      </div>

      <div className="runbar" role="status" aria-label={`Portfolio pipeline ${done ? "deployed" : `${pct}% complete`}`}>
        <div className="container runbar-row">
          <span className={`run-pill ${done ? "run-done" : "run-live"}`}>
            <span className="run-dot" />
            {done ? "deployed" : "deploying"}
          </span>
          <span className="run-id">
            run <b>#{sha}</b>
          </span>
          <ol className="run-stages">
            {STAGES.map((s, i) => {
              const st = done ? "passed" : stateOf(i);
              return (
                <li key={s.id} className={`run-stage rs-${st}`}>
                  <a href={`#${s.id}`} title={`${s.label}: ${st}`}>
                    <StateIcon state={st} />
                    <span className="run-label">{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ol>
          <span className="run-pct">{done ? "100%" : `${pct}%`}</span>
        </div>
        <div className="run-progress" style={{ transform: `scaleX(${done ? 1 : Math.max(pct, 3) / 100})` }} />
      </div>
    </header>
  );
}
