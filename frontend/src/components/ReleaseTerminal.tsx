"use client";

import { useEffect, useState } from "react";
import type { Portfolio } from "@/lib/types";

type Line = Portfolio["release_log"][number];

const PROMPT = "~/pharmacy-platform (main) $";

function stamp(offsetMs: number) {
  const s = offsetMs / 1000;
  return `00:${String(Math.floor(s)).padStart(2, "0")}.${String(Math.floor((s % 1) * 10))}`;
}

export default function ReleaseTerminal({ lines, sha }: { lines: Line[]; sha: string }) {
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState(0);
  const [cycle, setCycle] = useState(0);

  const cmd = lines[0]?.kind === "cmd" ? lines[0].text : "";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(cmd.length);
      setShown(lines.length);
      return;
    }
    setTyped(0);
    setShown(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 500;
    for (let i = 1; i <= cmd.length; i++) {
      timers.push(setTimeout(() => setTyped(i), t));
      t += 45 + Math.random() * 40;
    }
    for (let i = 1; i <= lines.length; i++) {
      t += i === 1 ? 350 : 520 + Math.random() * 380;
      timers.push(setTimeout(() => setShown(i), t));
    }
    // Replay after a pause so the terminal never looks frozen.
    timers.push(setTimeout(() => setCycle((c) => c + 1), t + 9000));
    return () => timers.forEach(clearTimeout);
  }, [cycle, cmd, lines.length]);

  const running = shown > 0 && shown < lines.length;

  return (
    <div className="terminal" aria-label="Example release log">
      <div className="term-bar">
        <span className="term-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="term-title">release.log</span>
        <span className={`term-status ${running ? "is-running" : shown >= lines.length ? "is-done" : ""}`}>
          {shown >= lines.length ? "● live" : running ? "● running" : "○ idle"}
        </span>
      </div>
      <div className="term-body">
        <div className="term-line">
          <span className="t-prompt">{PROMPT}</span> <span className="t-cmd">{cmd.slice(0, typed)}</span>
          {shown === 0 && <span className="t-cursor" />}
        </div>
        {lines.slice(1, shown).map((l, i) => {
          const isLast = i === shown - 2 && shown < lines.length;
          return (
            <div className="term-line t-in" key={`${cycle}-${i}`}>
              <span className="t-time">{stamp((i + 1) * 3700 + (i * 1300) % 900)}</span>
              {l.kind === "step" ? (
                <>
                  <span className="t-arrow">{isLast ? <span className="t-spin" /> : "→"}</span>
                  <span className="t-key">{l.k}</span>
                  <span className="t-val">{l.v.replace("<commit>", sha)}</span>
                </>
              ) : l.kind === "done" ? (
                <span className="t-done">✓ {l.text}</span>
              ) : null}
            </div>
          );
        })}
        {shown >= lines.length && (
          <div className="term-line">
            <span className="t-prompt">{PROMPT}</span> <span className="t-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}
