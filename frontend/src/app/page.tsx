import type { CSSProperties } from "react";
import { getPortfolio } from "@/lib/content";
import { JobHeader, PipelineProvider } from "@/components/pipeline";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import ReleaseTerminal from "@/components/ReleaseTerminal";
import Workflow from "@/components/Workflow";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { TechChip, TechIcon } from "@/components/Tech";
import InfraMap from "@/components/InfraMap";
import Timeline, { type Milestone } from "@/components/Timeline";
import { buildPortfolioMap } from "@/lib/graph";

// Short, stable pseudo commit hashes for the git-log style timeline.
function hashOf(s: string) {
  let h = 0x811c9dc5;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 0x01000193);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

function Glyph({ name, size = 16 }: { name: string; size?: number }) {
  return <span className="ti" style={{ "--ti-src": `url(/tech/${name}.svg)`, width: size, height: size } as CSSProperties} aria-hidden />;
}

const LEARNING_ICON: Record<string, string> = {
  achievement: "g-award",
  certificate: "g-file",
  course: "g-terminal",
  courses: "g-layers",
  event: "g-users",
  community: "g-heart",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(d: string) {
  const [y, m] = d.split("-");
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
}

/** Career milestones straight from the experience data, oldest first. */
function milestones(experience: ReturnType<typeof getPortfolio>["experience"]): Milestone[] {
  const out: Milestone[] = [];
  for (const e of [...experience].reverse()) {
    for (const r of [...e.roles].reverse()) {
      if (e.education) {
        const degree = r.title.split(",")[0];
        out.push({ date: fmtDate(r.start), title: `Started ${degree}`, org: e.org, kind: "education" });
        if (r.end) out.push({ date: fmtDate(r.end), title: `Graduated, ${degree}`, org: e.org, kind: "education" });
      } else {
        const promoted = r.tag === "Promoted";
        out.push({ date: fmtDate(r.start), title: promoted ? `Promoted to ${r.title}` : r.title, org: e.org, kind: promoted ? "promotion" : "role" });
      }
    }
  }
  const current = experience.find((e) => e.current);
  const shipped = current?.points.find((p) => /10\+ applications to production/.test(p));
  if (current && shipped) {
    out.push({ date: "Now", title: "10+ applications in production", org: current.org, kind: "now", note: shipped.replace(/^Took 10\+ applications to production across /, "Across ").split(",").slice(0, -1).join(",").replace(/, most of them$/, "") + "." });
  }
  return out;
}

export default function Home() {
  const data = getPortfolio();
  const { profile, about, workflow, experience, skills, learning, contact, build } = data;
  const rp = workflow.request_path;
  const org = workflow.aws_org;
  const [first, ...rest] = profile.name.split(" ");
  const portfolioMap = buildPortfolioMap(data);

  const stats = [
    { n: "10+", k: "apps taken to production" },
    { n: String(data.featured_projects.length + data.projects.length), k: "projects in this portfolio" },
    { n: String(new Set(skills.flatMap((s) => s.items)).size), k: "tools & technologies" },
    { n: "2", k: "clouds · AWS & Azure" },
  ];

  return (
    <PipelineProvider>
      <TopBar sha={build.sha} />
      <Reveal />

      <div className="shell container">
        {/* ---------- profile header ---------- */}
        <header className="profile">
          <div className="profile-id">
            <div>
              <p className="profile-name">
                <b>{first}</b> {rest.join(" ")}
              </p>
              <p className="profile-role">
                {profile.role} · {profile.company}
              </p>
            </div>
          </div>
          <div className="profile-avail">
            <span className="micro">availability</span>
            <b>
              <i className="dot-live" /> Open to DevOps roles & projects
            </b>
            <span className="mono">{profile.location_short}, India</span>
          </div>
          <div className="profile-actions">
            <a className="btn btn-outline btn-sm" href="/api/resume">
              <Glyph name="g-download" size={15} /> Download CV
            </a>
            <a className="profile-email" href={`mailto:${profile.email}`}>
              <Glyph name="g-mail" size={14} /> {profile.email}
            </a>
            <div className="socials">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Glyph name="g-linkedin" size={17} />
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Glyph name="github" size={17} />
              </a>
              <a href={`mailto:${profile.email}`} aria-label="Email">
                <Glyph name="g-mail" size={17} />
              </a>
            </div>
          </div>
        </header>

        <div className="shell-body">
          <Sidebar sha={build.sha} />

          <main id="main" className="panels">
            {/* ---------- 00 init / overview ---------- */}
            <section id="top" className="panel hero">
              <div className="hero-glow" aria-hidden />
              <div className="hero-grid">
                <div className="hero-copy">
                  <p className="eyebrow">
                    <span className="eyebrow-dot" />
                    {profile.role} · {profile.company}
                  </p>
                  <h1 className="hero-title">
                    I build the path from <span className="hl">git&nbsp;push</span> to production, and keep it running.
                  </h1>
                  <p className="hero-lead">
                    I&apos;m <strong>{profile.name}</strong>, a DevOps engineer in {profile.location_short.split(",")[0]}, India.{" "}
                    {profile.intro}
                  </p>
                  <div className="hero-cta">
                    <a className="btn btn-primary" href="#projects">
                      See my work
                    </a>
                    <a className="btn btn-ghost" href="#contact">
                      Get in touch
                    </a>
                  </div>
                </div>
                <ReleaseTerminal lines={data.release_log} sha={build.sha} />
              </div>

              <div className="marquee" aria-label="Toolbelt">
                <div className="marquee-track">
                  {[...profile.toolbelt, ...profile.toolbelt].map((t, i) => (
                    <span key={i} aria-hidden={i >= profile.toolbelt.length}>
                      <TechIcon label={t} size={18} />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* ---------- 01 about ---------- */}
            <section id="about" className="panel">
              <JobHeader index={1} title="About me." />
              <div className="about-grid">
                <dl className="meta reveal">
                  {[
                    { k: "role", v: profile.role },
                    { k: "company", v: profile.company },
                    { k: "location", v: profile.location_short },
                    { k: "clouds", v: "AWS · Azure" },
                  ].map((m) => (
                    <div key={m.k}>
                      <dt className="micro">{m.k}</dt>
                      <dd>{m.v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="prose reveal">
                  <p className="prose-lede">{about.title}</p>
                  {about.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </div>

              <h3 className="sub-title">Track record</h3>
              <div className="stats reveal">
                {stats.map((s) => (
                  <div key={s.k} className="stat">
                    <b>{s.n}</b>
                    <span className="micro">{s.k}</span>
                  </div>
                ))}
              </div>

              <h3 className="sub-title">How I work</h3>
              <div className="principles">
                {about.principles.map((p, i) => (
                  <div key={p.k} className="principle reveal">
                    <span className="principle-n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="micro principle-k">{p.k}</span>
                    <p>{p.v}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------- 02 architecture map ---------- */}
            <section id="map" className="panel">
              <JobHeader
                index={2}
                title="How it all connects"
                lead="My career, the workloads I've shipped and the platforms they run on, as one system. Select any node to trace its connections."
              />
              <div className="reveal">
                <InfraMap map={portfolioMap} initial={`w:${data.featured_projects[0].title}`} />
              </div>
            </section>

            {/* ---------- 03 workflow ---------- */}
            <section id="workflow" className="panel">
              <JobHeader index={3} title={workflow.title} lead={workflow.lead} />
              <div className="reveal">
                <Workflow stages={workflow.stages} />
              </div>

              <div className="arch-grid">
                <div className="arch reveal">
                  <h3 className="arch-title">{rp.title}</h3>
                  <p className="muted">{rp.lead}</p>
                  <ol className="flow-v">
                    {rp.nodes.map((n) => (
                      <li key={n.k} className={`node${n.accent ? " node-accent" : ""}`}>
                        <span className="node-k">{n.k}</span>
                        <span className="node-v">{n.v}</span>
                        {n.details && (
                          <ul className="node-details">
                            {n.details.map((d) => (
                              <li key={d}>{d}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="arch reveal">
                  <h3 className="arch-title">{org.title}</h3>
                  <p className="muted">{org.lead}</p>
                  <div className="org">
                    <div className="node node-accent org-root">
                      <span className="node-k">aws organizations</span>
                      <span className="node-v">{org.root}</span>
                    </div>
                    <div className="org-ous">
                      {org.ous.map((o) => (
                        <div key={o} className="node org-ou">
                          <span className="node-k">ou</span>
                          <span className="node-v">{o} accounts</span>
                        </div>
                      ))}
                    </div>
                    <p className="org-note">{org.note}</p>
                    <span className="micro">inside each workload</span>
                    <div className="org-envs">
                      {org.environments.map((e) => (
                        <div key={e.name} className={`env env-${e.name}`}>
                          <b>{e.name}</b>
                          <ul>
                            {e.items.map((i) => (
                              <li key={i}>{i}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ---------- 03 projects ---------- */}
            <section id="projects" className="panel">
              <JobHeader
                index={4}
                title="Selected work"
                lead="Client names are generalised. Status labels show exactly where each piece of work stands."
              />
              <Projects data={data} />
            </section>

            {/* ---------- 04 experience ---------- */}
            <section id="experience" className="panel">
              <JobHeader index={5} title="Career timeline" lead="From a computer science degree to owning production releases." />
              <Timeline items={milestones(experience)} />
              <ol className="gitlog">
                {experience.map((e) => (
                  <li key={e.org} className={`commit reveal${e.current ? " is-head" : ""}`}>
                    <span className="commit-dot" aria-hidden />
                    <div className="commit-meta">
                      <span className="commit-hash">{hashOf(e.org)}</span>
                      {e.current && <span className="ref ref-head">HEAD → main</span>}
                      {e.roles.some((r) => r.tag) && <span className="ref ref-tag">tag: promoted</span>}
                      {e.education && <span className="ref ref-root">root commit</span>}
                    </div>
                    <div className="commit-card">
                      <div className="commit-org">
                        <h3>{e.org}</h3>
                        <span>{e.location}</span>
                      </div>
                      <ul className="commit-roles">
                        {e.roles.map((r) => (
                          <li key={r.title}>
                            <b>{r.title}</b>
                            {r.tag && <span className="pill pill-prod">{r.tag}</span>}
                            <span className="commit-period">{r.period}</span>
                          </li>
                        ))}
                      </ul>
                      {e.points.length > 0 && (
                        <ul className="commit-points">
                          {e.points.map((p) => (
                            <li key={p.slice(0, 24)}>{p}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* ---------- 05 skills ---------- */}
            <section id="skills" className="panel">
              <JobHeader index={6} title="Technical expertise" lead="Only what I've actually worked with." />
              <div className="skills">
                {skills.map((s) => (
                  <div key={s.name} className="skill reveal">
                    <div className="skill-head">
                      <span className={`skill-icon${s.icon === "aws" ? " pf-aws" : s.icon === "azure" ? " pf-azure" : ""}`}>
                        <span
                          className="ti"
                          style={{ "--ti-src": `url(/tech/${s.icon}.svg)`, "--ti-color": "var(--accent)" } as CSSProperties}
                          aria-hidden
                        />
                      </span>
                      <h3>{s.name}</h3>
                      <span className="skill-n">{s.items.length}</span>
                    </div>
                    <ul className="chips chips-sm">
                      {s.items.map((i) => (
                        <TechChip key={i} label={i} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------- 06 learning ---------- */}
            <section id="learning" className="panel">
              <JobHeader index={7} title="Learning & achievements" />
              <div className="artifacts">
                {learning.map((l) => (
                  <div key={l.title} className={`artifact reveal art-${l.kind}`}>
                    <div className="artifact-top">
                      <span className="artifact-icon">
                        <Glyph name={LEARNING_ICON[l.kind] ?? "g-file"} size={16} />
                      </span>
                      <span className="micro">{l.kind}</span>
                    </div>
                    <h3>{l.title}</h3>
                    <p>{l.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------- 07 contact ---------- */}
            <section id="contact" className="panel">
              <JobHeader index={8} title={contact.title} lead={contact.lead} />
              <Contact profile={profile} />
            </section>
          </main>
        </div>
      </div>

      <Footer name={profile.name} />
    </PipelineProvider>
  );
}
