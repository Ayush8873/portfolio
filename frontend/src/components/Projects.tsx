"use client";

import { useState } from "react";
import type { FeaturedProject, Portfolio, Project } from "@/lib/types";
import BlueGreen from "./BlueGreen";
import { TechChip } from "./Tech";
import MiniPipeline from "./MiniPipeline";

function StatusPill({ status, label }: { status: string; label: string }) {
  return <span className={`pill pill-${status}`}>{label}</span>;
}

function DetailTabs({ details }: { details: Record<string, string> }) {
  const keys = Object.keys(details);
  const [tab, setTab] = useState(keys[0]);
  return (
    <div className="dtabs">
      <div className="dtabs-bar" role="tablist">
        {keys.map((k) => (
          <button key={k} role="tab" aria-selected={k === tab} onClick={() => setTab(k)}>
            {k.toLowerCase()}
          </button>
        ))}
      </div>
      <p className="dtabs-body" role="tabpanel" key={tab}>
        {details[tab]}
      </p>
    </div>
  );
}

function Featured({ p }: { p: FeaturedProject }) {
  return (
    <article className="feat reveal pf-aws">
      <div className="feat-main">
        <div className="feat-pills">
          <StatusPill status={p.status} label={p.status_label} />
          {p.badge && <span className="pill pill-info">{p.badge}</span>}
        </div>
        <h3 className="feat-title">{p.title}</h3>
        <p className="feat-sum">{p.summary}</p>
        <ul className="chips">
          {p.tags.map((t) => (
            <TechChip key={t} label={t} />
          ))}
        </ul>
        <MiniPipeline steps={p.pipeline} />
        <DetailTabs details={p.details} />
      </div>
      <div className="feat-side">
        {p.bluegreen && <BlueGreen steps={p.bluegreen.steps} />}
        {p.monitoring && (
          <div className="mon">
            <span className="mono-label">monitoring topology</span>
            <div className="mon-flow">
              {p.monitoring.map((g, gi) => (
                <div className="mon-group" key={g.group}>
                  <span className="mon-group-name">{g.group}</span>
                  {g.items.map((it) => (
                    <div className="mon-item" key={it.k + it.v}>
                      <span className="mon-k">{it.k}</span>
                      <span className="mon-v">{it.v}</span>
                    </div>
                  ))}
                  {gi < p.monitoring!.length - 1 && <span className="mon-arrow" aria-hidden>↓</span>}
                </div>
              ))}
            </div>
            <ul className="mon-alerts">
              {["target down", "high CPU", "low disk", "memory pressure", "container restarts"].map((a) => (
                <li key={a}>
                  <span className="mon-alert-dot" /> {a}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <article className={`card pf-${p.platform.toLowerCase()}`}>
      <div className="card-top">
        <StatusPill status={p.status} label={p.status_label} />
        <span className="card-platform">{p.platform}</span>
      </div>
      <h3 className="card-title">{p.title}</h3>
      <p className="card-sub">{p.subtitle}</p>
      <p className="card-body">{p.body}</p>
      {p.note && (
        <p className="card-note">
          <span className="card-note-k">{p.note.k}</span>
          {p.note.v}
        </p>
      )}
      <ul className="chips chips-sm">
        {p.tags.map((t) => (
          <TechChip key={t} label={t} />
        ))}
      </ul>
    </article>
  );
}

export default function Projects({ data }: { data: Portfolio }) {
  const [filter, setFilter] = useState("all");
  const list = data.projects.filter((p) => filter === "all" || p.cats.includes(filter));

  return (
    <>
      <div className="feat-list">
        {data.featured_projects.map((p) => (
          <Featured key={p.id} p={p} />
        ))}
      </div>

      <div className="grid-head reveal">
        <div className="filters" role="group" aria-label="Filter projects">
          {data.project_filters.map((f) => {
            const n = f.id === "all" ? data.projects.length : data.projects.filter((p) => p.cats.includes(f.id)).length;
            return (
              <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
                <span className="filter-n">{n}</span>
              </button>
            );
          })}
        </div>
        <span className="grid-count mono">
          {list.length} deployment{list.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid" aria-live="polite">
        {list.map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
        {list.length === 0 && <p className="muted">No projects in this category.</p>}
      </div>
    </>
  );
}
