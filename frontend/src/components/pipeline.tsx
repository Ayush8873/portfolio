"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/** Each page section is one job in the "portfolio deploy" pipeline. */
export const STAGES = [
  { id: "top", label: "init", nav: "Overview", icon: "g-terminal" },
  { id: "about", label: "about", nav: "About", icon: "g-user" },
  { id: "map", label: "map", nav: "Architecture", icon: "g-network" },
  { id: "workflow", label: "workflow", nav: "Workflow", icon: "g-branch" },
  { id: "projects", label: "projects", nav: "Projects", icon: "g-grid" },
  { id: "experience", label: "experience", nav: "Experience", icon: "g-flag" },
  { id: "skills", label: "skills", nav: "Skills", icon: "g-layers" },
  { id: "learning", label: "learning", nav: "Learning", icon: "g-award" },
  { id: "contact", label: "contact", nav: "Contact", icon: "g-mail" },
] as const;

export type StageState = "queued" | "running" | "passed";

type Ctx = {
  active: number;
  done: boolean;
  now: number;
  started: (number | null)[];
  durations: (number | null)[];
  stateOf: (i: number) => StageState;
};

const PipelineCtx = createContext<Ctx | null>(null);

export function usePipeline() {
  const ctx = useContext(PipelineCtx);
  if (!ctx) throw new Error("usePipeline outside PipelineProvider");
  return ctx;
}

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const started = useRef<(number | null)[]>(STAGES.map((_, i) => (i === 0 ? Date.now() : null)));
  const durations = useRef<(number | null)[]>(STAGES.map(() => null));
  const activeRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let idx = 0;
      STAGES.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < line) idx = i;
      });
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      if (atBottom) idx = STAGES.length - 1;

      const prev = activeRef.current;
      if (idx !== prev) {
        const t = Date.now();
        // Close out every stage we moved past; stages are never "un-passed".
        for (let i = 0; i < idx; i++) {
          if (durations.current[i] == null) {
            const s = started.current[i] ?? t - 400;
            durations.current[i] = Math.max(t - s, 300);
          }
        }
        if (started.current[idx] == null) started.current[idx] = t;
        activeRef.current = Math.max(idx, prev);
        setActive(activeRef.current);
      }
      if (atBottom && durations.current[STAGES.length - 1] == null) {
        const s = started.current[STAGES.length - 1] ?? Date.now();
        durations.current[STAGES.length - 1] = Math.max(Date.now() - s, 300);
        setDone(true);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearInterval(tick);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const stateOf = (i: number): StageState => {
    if (durations.current[i] != null) return "passed";
    if (i === active) return "running";
    return i < active ? "passed" : "queued";
  };

  return (
    <PipelineCtx.Provider
      value={{ active, done, now, started: started.current, durations: durations.current, stateOf }}
    >
      {children}
    </PipelineCtx.Provider>
  );
}

export function fmtDuration(ms: number) {
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(s < 10 ? 1 : 0)}s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
}

export function StateIcon({ state }: { state: StageState }) {
  if (state === "passed")
    return (
      <svg className="st-icon st-passed" viewBox="0 0 16 16" aria-hidden>
        <circle cx="8" cy="8" r="7" />
        <path d="M4.8 8.2l2.1 2.1 4.3-4.5" />
      </svg>
    );
  if (state === "running")
    return (
      <svg className="st-icon st-running" viewBox="0 0 16 16" aria-hidden>
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5" />
      </svg>
    );
  return (
    <svg className="st-icon st-queued" viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="6.5" />
    </svg>
  );
}

/** Section header rendered as a CI job header. */
export function JobHeader({ index, title, lead }: { index: number; title: string; lead?: string }) {
  const { stateOf, durations, started, now } = usePipeline();
  const state = stateOf(index);
  const stage = STAGES[index];
  const elapsed =
    state === "passed"
      ? durations[index]
      : state === "running" && started[index] != null
        ? Math.max(0, now - (started[index] as number))
        : null;

  return (
    <header className="job-head reveal">
      <div className={`job-meta job-${state}`}>
        <StateIcon state={state} />
        <span className="job-id">
          job {String(index).padStart(2, "0")}/{String(STAGES.length - 1).padStart(2, "0")}
        </span>
        <span className="job-sep">·</span>
        <span className="job-name">{stage.label}</span>
        <span className="job-state">
          {state}
          {elapsed != null && <> · {fmtDuration(elapsed)}</>}
        </span>
      </div>
      <h2 className="section-title">
        {/* the closing punctuation becomes the accent mark */}
        {title.replace(/[.?]$/, "")}
        <span className="title-dot">{title.endsWith("?") ? "?" : "."}</span>
      </h2>
      <span className="title-bar" aria-hidden />
      {lead && <p className="section-lead">{lead}</p>}
    </header>
  );
}
