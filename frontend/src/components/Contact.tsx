"use client";

import { useState, type FormEvent } from "react";
import type { PortfolioContent } from "@/lib/types";

type Log = { t: "cmd" | "ok" | "err" | "info"; text: string };

export default function Contact({ profile }: { profile: PortfolioContent["profile"] }) {
  const { email } = profile;
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<Log[]>([]);
  const [copied, setCopied] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setBusy(true);
    setLog([{ t: "cmd", text: "curl -X POST /api/contact" }]);
    const started = performance.now();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const ms = Math.round(performance.now() - started);
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setLog((l) => [
          ...l,
          { t: "info", text: `HTTP ${res.status} Created · ${ms}ms` },
          { t: "ok", text: `✓ message queued as ${data.ticket}. I'll reply to ${body.email} soon.` },
        ]);
        form.reset();
      } else {
        const detail = Array.isArray(data.detail)
          ? data.detail.map((d: { loc: string[]; msg: string }) => `${d.loc.at(-1)}: ${d.msg.replace("Value error, ", "")}`).join("; ")
          : data.detail ?? res.statusText;
        setLog((l) => [...l, { t: "err", text: `HTTP ${res.status} · ${detail}` }]);
      }
    } catch {
      setLog((l) => [...l, { t: "err", text: `✗ backend unreachable. Email me directly at ${email}.` }]);
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
  }

  return (
    <div className="contact-grid">
      <form className="cform reveal" onSubmit={submit}>
        <div className="cform-head">
          <span className="mono-label">/api/contact</span>
        </div>
        <label>
          <span>name</span>
          <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" />
        </label>
        <label>
          <span>email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@company.com" />
        </label>
        <label>
          <span>message</span>
          <textarea name="message" required minLength={10} maxLength={4000} rows={5} placeholder="What are you building?" />
        </label>
        {/* honeypot */}
        <input name="company" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "sending…" : "Send message →"}
        </button>
        {log.length > 0 && (
          <div className="cform-log" aria-live="polite">
            {log.map((l, i) => (
              <div key={i} className={`cl cl-${l.t}`}>
                {l.t === "cmd" && <span className="t-prompt">$ </span>}
                {l.text}
              </div>
            ))}
          </div>
        )}
      </form>

      <div className="contact-side reveal">
        <div className="contact-actions">
          <a className="btn btn-primary" href={`mailto:${email}`}>
            Email me
          </a>
          <button className="btn btn-ghost" onClick={copy}>
            {copied ? "✓ Copied" : "Copy email"}
          </button>
          <a className="btn btn-ghost" href="/api/resume">
            Download résumé
          </a>
        </div>
        <dl className="links">
          <div>
            <dt>email</dt>
            <dd>
              <a href={`mailto:${email}`}>{email}</a>
            </dd>
          </div>
          <div>
            <dt>linkedin</dt>
            <dd>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                {profile.linkedin.replace("https://", "")}
              </a>
            </dd>
          </div>
          <div>
            <dt>github</dt>
            <dd>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                {profile.github.replace("https://", "")}
              </a>
            </dd>
          </div>
          <div>
            <dt>location</dt>
            <dd>{profile.location}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
