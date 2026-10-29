"use client";

import type { CSSProperties } from "react";
import { STAGES, StateIcon, usePipeline } from "./pipeline";
import ThemeToggle from "./ThemeToggle";

/** Desktop nav: every link is a pipeline job showing its live state. */
export default function Sidebar({ sha }: { sha: string }) {
  const { active, done, stateOf } = usePipeline();
  const total = STAGES.length;
  const pct = Math.round(((done ? total : active) / total) * 100);

  return (
    <aside className="sidebar" aria-label="Sections">
      <div className="sb-card">
        <div className="sb-run">
          <span className={`run-pill ${done ? "run-done" : "run-live"}`}>
            <span className="run-dot" />
            {done ? "deployed" : "deploying"}
          </span>
          <span className="sb-run-id">#{sha}</span>
        </div>
        <div className="sb-progress" aria-hidden>
          <span style={{ width: `${done ? 100 : Math.max(pct, 4)}%` }} />
        </div>

        <nav className="sb-nav">
          {STAGES.map((s, i) => {
            const st = done ? "passed" : stateOf(i);
            return (
              <a key={s.id} href={`#${s.id}`} className={`sb-link sbl-${st}${i === active && !done ? " is-current" : ""}`}>
                <span
                  className="ti"
                  style={{ "--ti-src": `url(/tech/${s.icon}.svg)`, width: 16, height: 16 } as CSSProperties}
                  aria-hidden
                />
                <span className="sb-label">{s.nav}</span>
                <StateIcon state={st} />
              </a>
            );
          })}
        </nav>

        <div className="sb-foot">
          <a className="sb-resume" href="/api/resume">
            <span className="ti" style={{ "--ti-src": "url(/tech/g-download.svg)", width: 15, height: 15 } as CSSProperties} aria-hidden />
            Résumé
          </a>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
