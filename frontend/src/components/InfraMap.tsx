"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { MapNode, PortfolioMap } from "@/lib/graph";

type Path = { d: string; key: string; from: string; to: string; kind: string };

const TIER_TITLE = { career: "Career path", work: "Workloads", platform: "Platform & skills" } as const;
const TIER_HINT = { career: "where the work happened", work: "what I shipped", platform: "what it runs on" } as const;

function Glyph({ name }: { name: string }) {
  return <span className="ti" style={{ "--ti-src": `url(/tech/${name}.svg)`, width: 14, height: 14 } as CSSProperties} aria-hidden />;
}

export default function InfraMap({ map, initial }: { map: PortfolioMap; initial: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, HTMLButtonElement>());
  const [paths, setPaths] = useState<Path[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [selected, setSelected] = useState(initial);
  const [hover, setHover] = useState<string | null>(null);
  const active = hover ?? selected;

  const byId = useMemo(() => new Map(map.nodes.map((n) => [n.id, n])), [map.nodes]);
  const neighbors = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const e of map.edges) {
      if (!m.has(e.from)) m.set(e.from, new Set());
      if (!m.has(e.to)) m.set(e.to, new Set());
      m.get(e.from)!.add(e.to);
      m.get(e.to)!.add(e.from);
    }
    return m;
  }, [map.edges]);
  const linked = neighbors.get(active) ?? new Set<string>();

  // Edges are drawn from the real node positions, so they follow any layout change.
  const measure = useCallback(() => {
    const root = wrap.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    setSize({ w: box.width, h: box.height });
    const next: Path[] = [];
    map.edges.forEach((e, i) => {
      const a = els.current.get(e.from)?.getBoundingClientRect();
      const b = els.current.get(e.to)?.getBoundingClientRect();
      if (!a || !b) return;
      let d: string;
      if (e.kind === "path") {
        const x = a.left + a.width / 2 - box.left;
        d = `M${x},${a.bottom - box.top} L${x},${b.top - box.top}`;
      } else {
        const x1 = a.right - box.left;
        const y1 = a.top + a.height / 2 - box.top;
        const x2 = b.left - box.left;
        const y2 = b.top + b.height / 2 - box.top;
        const dx = Math.max((x2 - x1) * 0.5, 24);
        d = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
      }
      next.push({ d, key: `${i}`, from: e.from, to: e.to, kind: e.kind });
    });
    setPaths(next);
  }, [map.edges]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const node = (n: MapNode) => {
    const state = n.id === active ? "is-active" : linked.has(n.id) ? "is-linked" : "is-dim";
    return (
      <button
        key={n.id}
        ref={(el) => {
          if (el) els.current.set(n.id, el);
          else els.current.delete(n.id);
        }}
        className={`imap-node tier-${n.tier} ${state}`}
        aria-pressed={n.id === selected}
        onClick={() => setSelected(n.id)}
        onMouseEnter={() => setHover(n.id)}
        onMouseLeave={() => setHover(null)}
        onFocus={() => setHover(n.id)}
        onBlur={() => setHover(null)}
      >
        {n.status && <span className={`imap-status st-${n.status}`} aria-hidden />}
        {n.icon && <Glyph name={n.icon} />}
        <span className="imap-label">{n.label}</span>
        {n.tier !== "work" && <span className="imap-sub">{n.sub}</span>}
      </button>
    );
  };

  const tiers = (["career", "work", "platform"] as const).map((t) => map.nodes.filter((n) => n.tier === t));
  const activeNode = byId.get(active);
  const rel = (tier: MapNode["tier"]) => [...linked].map((id) => byId.get(id)!).filter((n) => n.tier === tier);

  return (
    <div className="imap">
      <div className="imap-canvas" ref={wrap}>
        <svg className="imap-edges" width={size.w} height={size.h} aria-hidden>
          {paths.map((p) => {
            const on = p.from === active || p.to === active;
            return <path key={p.key} d={p.d} className={`imap-edge k-${p.kind}${on ? " is-on" : ""}`} />;
          })}
        </svg>

        <div className="imap-cols">
          {tiers.map((nodes, ti) => {
            const tier = (["career", "work", "platform"] as const)[ti];
            return (
              <div key={tier} className={`imap-col col-${tier}`}>
                <div className="imap-col-head">
                  <span className="micro">{String(ti + 1).padStart(2, "0")} · {TIER_TITLE[tier]}</span>
                  <span className="imap-col-hint">{TIER_HINT[tier]}</span>
                </div>
                {tier === "work"
                  ? map.groups.map((g) => (
                      <div key={g} className={`imap-group pf-${g.toLowerCase()}`}>
                        <span className="imap-group-name">{g}</span>
                        {nodes.filter((n) => n.group === g).map(node)}
                      </div>
                    ))
                  : nodes.map(node)}
              </div>
            );
          })}
        </div>
      </div>

      {activeNode && (
        <div className="imap-detail" aria-live="polite">
          <div className="imap-detail-head">
            <span className="micro">{TIER_TITLE[activeNode.tier]}</span>
            <b>{activeNode.label}</b>
            <span className="imap-detail-sub">{activeNode.sub}</span>
          </div>
          <div className="imap-detail-links">
            {(["career", "work", "platform"] as const)
              .filter((t) => rel(t).length)
              .map((t) => (
                <div key={t}>
                  <span className="micro">{TIER_TITLE[t]}</span>
                  <ul>
                    {rel(t).map((n) => (
                      <li key={n.id}>
                        <button onClick={() => setSelected(n.id)}>{n.label}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
