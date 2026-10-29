"use client";

import { useEffect, useRef, useState } from "react";
import type { KV } from "@/lib/types";
import { StateIcon, type StageState } from "./pipeline";

const STEP_MS = 1100;
const HOLD_MS = 2600;

/**
 * A project's release pipeline that actually runs: stages go queued → running →
 * passed one after another, the connector carries a pulse to the next stage,
 * and the run restarts after a short hold. Only animates while on screen.
 */
export default function MiniPipeline({ steps }: { steps: KV[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(-1); // -1 = queued, steps.length = all passed
  const [visible, setVisible] = useState(false);
  const [durations, setDurations] = useState<string[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(steps.length);
      return;
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [steps.length]);

  useEffect(() => {
    if (!visible) return;
    const done = current >= steps.length;
    const t = setTimeout(
      () => {
        if (done) {
          setCurrent(-1);
          setDurations([]);
        } else {
          if (current >= 0) setDurations((d) => [...d, `${(0.6 + Math.random() * 2.4).toFixed(1)}s`]);
          setCurrent((c) => c + 1);
        }
      },
      done ? HOLD_MS : current < 0 ? 500 : STEP_MS,
    );
    return () => clearTimeout(t);
  }, [visible, current, steps.length]);

  const stateOf = (i: number): StageState => (i < current ? "passed" : i === current ? "running" : "queued");
  const allDone = current >= steps.length;

  return (
    <div className={`mp${allDone ? " mp-done" : ""}`}>
      <div className="mp-head">
        <span className="micro">release pipeline</span>
        <span className={`mp-status mp-${allDone ? "passed" : current < 0 ? "queued" : "running"}`}>
          {allDone ? "✓ passed" : current < 0 ? "queued" : `running ${current + 1}/${steps.length}`}
        </span>
      </div>
      <ol className="mini-pipe" ref={ref} aria-label="Release pipeline">
        {steps.map((s, i) => {
          const st = stateOf(i);
          return (
            <li key={s.k} className={`mp-node mp-${st}`}>
              <div className="mp-top">
                <StateIcon state={st} />
                <span className="mp-k">{s.k}</span>
                {durations[i] && <span className="mp-t">{durations[i]}</span>}
              </div>
              <span className="mp-v">{s.v}</span>
              {i < steps.length - 1 && (
                <span className={`mp-edge${i < current ? " is-filled" : ""}${i === current - 1 ? " is-pulse" : ""}`} aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
