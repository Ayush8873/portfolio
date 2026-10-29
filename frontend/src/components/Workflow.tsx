"use client";

import { useEffect, useState } from "react";
import type { Portfolio } from "@/lib/types";
import { TechChip } from "./Tech";

type Stage = Portfolio["workflow"]["stages"][number];

export default function Workflow({ stages }: { stages: Stage[] }) {
  const [sel, setSel] = useState(0);
  const [auto, setAuto] = useState(true);

  // Walk through the stages on its own, like a pipeline running, until the visitor takes over.
  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setSel((s) => (s + 1) % stages.length), 4200);
    return () => clearInterval(id);
  }, [auto, stages.length]);

  const pick = (i: number) => {
    setAuto(false);
    setSel(i);
  };

  const stage = stages[sel];

  return (
    <div className="wf">
      <div className="wf-graph" role="tablist" aria-label="Delivery pipeline stages">
        {stages.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            id={`wf-tab-${s.id}`}
            aria-selected={i === sel}
            aria-controls="wf-panel"
            className={`wf-node ${i < sel ? "is-past" : ""} ${i === sel ? "is-active" : ""}`}
            onClick={() => pick(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") pick((i + 1) % stages.length);
              if (e.key === "ArrowLeft") pick((i - 1 + stages.length) % stages.length);
            }}
          >
            <span className="wf-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="wf-label">{s.label}</span>
            {i < stages.length - 1 && <span className="wf-edge" aria-hidden />}
          </button>
        ))}
      </div>

      <div id="wf-panel" role="tabpanel" aria-labelledby={`wf-tab-${stage.id}`} className="wf-panel" key={stage.id}>
        <div className="wf-panel-head">
          <span className="wf-panel-step">
            stage {sel + 1}/{stages.length}
          </span>
          <h3>{stage.title}</h3>
          {auto && (
            <button className="wf-pause" onClick={() => setAuto(false)}>
              ❚❚ pause auto-run
            </button>
          )}
        </div>
        <p>{stage.body}</p>
        <ul className="chips">
          {stage.tools.map((t) => (
            <TechChip key={t} label={t} />
          ))}
        </ul>
        {auto && <span className="wf-timer" aria-hidden />}
      </div>
    </div>
  );
}
