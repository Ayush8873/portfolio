"use client";

import { useEffect, useRef, useState } from "react";

export type Milestone = {
  date: string;
  title: string;
  org: string;
  kind: "education" | "role" | "promotion" | "now";
  note?: string;
};

const KIND_LABEL: Record<Milestone["kind"], string> = {
  education: "education",
  role: "role",
  promotion: "milestone",
  now: "today",
};

/** Career milestones on one track; the track fills in once it scrolls into view. */
export default function Timeline({ items }: { items: Milestone[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol className={`tl${shown ? " is-shown" : ""}`} ref={ref} style={{ ["--n" as string]: items.length }}>
      <span className="tl-track" aria-hidden>
        <span className="tl-fill" />
      </span>
      {items.map((m, i) => (
        <li key={`${m.date}-${m.title}`} className={`tl-item k-${m.kind}`} style={{ ["--i" as string]: i }}>
          <span className="tl-dot" aria-hidden />
          <time className="tl-date">{m.date}</time>
          <span className="tl-kind">{KIND_LABEL[m.kind]}</span>
          <b className="tl-title">{m.title}</b>
          <span className="tl-org">{m.org}</span>
          {m.note && <p className="tl-note">{m.note}</p>}
        </li>
      ))}
    </ol>
  );
}
