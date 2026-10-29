"use client";

import { useEffect, useState } from "react";

type Color = "blue" | "green";

/**
 * Animated blue/green release: walks through the steps, flips the NGINX
 * upstream on "switch", and the old stack is kept for rollback. Each loop is
 * the next release, landing on whichever stack is idle.
 */
export default function BlueGreen({ steps }: { steps: string[] }) {
  const [step, setStep] = useState(0); // steps.length = release complete, holding
  const [live, setLive] = useState<Color>("blue");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(steps.length);
      return;
    }
    const id = setInterval(() => setStep((s) => (s + 1) % (steps.length + 1)), 1800);
    return () => clearInterval(id);
  }, [steps.length]);

  useEffect(() => {
    if (step === 2) setLive((l) => (l === "blue" ? "green" : "blue"));
  }, [step]);

  const desc = (c: Color) => {
    if (c === live) return "live · serving traffic";
    if (step === 0) return "new release · starting";
    if (step === 1) return "new release · health-checking";
    return "previous · kept for rollback";
  };

  return (
    <div className="bg-box">
      <div className="bg-head">
        <span className="mono-label">blue/green release</span>
        <span className="pill pill-prod">live</span>
      </div>
      <div className="bg-diagram">
        {(["blue", "green"] as Color[]).map((c) => (
          <div
            key={c}
            className={`bg-stack bg-${c} ${c === live ? "is-live" : ""} ${c !== live && step < 2 ? "is-check" : ""}`}
            style={{ order: c === "blue" ? 0 : 2 }}
          >
            <b>{c}</b>
            <span>{desc(c)}</span>
          </div>
        ))}
        <div className={`bg-nginx to-${live}`} style={{ order: 1 }}>
          <span className="bg-nginx-k">nginx</span>
          <span className="bg-nginx-v">upstream → {live}</span>
          <span className="bg-flow" aria-hidden>
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
      <ol className="bg-steps">
        {steps.map((s, i) => (
          <li key={s} className={i < step ? "is-done" : i === step ? "is-now" : ""}>
            <span className="bg-step-n">{i < step ? "✓" : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
