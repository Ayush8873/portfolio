import type { PortfolioContent } from "./types";

/**
 * Builds the portfolio map: career → workloads → platform.
 * Every edge comes from the content: who delivered a project, and which skill
 * groups a project's tech tags belong to.
 */

export type MapNode = {
  id: string;
  tier: "career" | "work" | "platform";
  label: string;
  sub: string;
  group?: string;
  status?: string;
  icon?: string;
};
export type MapEdge = { from: string; to: string; kind: "path" | "delivered" | "uses" };
export type PortfolioMap = { nodes: MapNode[]; edges: MapEdge[]; groups: string[] };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Tags whose skill-group match isn't a plain substring.
const ALIASES: Record<string, string> = {
  acr: "Azure",
  "azure acr": "Azure",
  "custom domain": "Web & networking",
  "ci cd": "CI/CD",
  "rds backups": "AWS",
  "ebs snapshots": "AWS",
  "dedicated server": "Hosting & systems",
  "shared hosting": "Hosting & systems",
  oidc: "Identity & security",
  saml: "Identity & security",
  "zoho cliq": "Monitoring & logging",
  "socket io": "Web & networking",
};

function groupsForTag(tag: string, skills: PortfolioContent["skills"]): string[] {
  const t = norm(tag);
  if (ALIASES[t]) return [ALIASES[t]];
  return skills
    .filter((g) =>
      g.items.some((item) => {
        // whole-word containment either way, so "Lightsail" matches "AWS Lightsail" but "ECR" never matches "secrets"
        const i = ` ${norm(item)} `;
        const tt = ` ${t} `;
        return i === tt || i.includes(tt) || tt.includes(i);
      }),
    )
    .map((g) => g.name);
}

export function buildPortfolioMap(data: PortfolioContent): PortfolioMap {
  const nodes: MapNode[] = [];
  const edges: MapEdge[] = [];

  // career, oldest first, linked as a progression
  const career = [...data.experience].reverse();
  career.forEach((e, i) => {
    nodes.push({
      id: `c:${e.org}`,
      tier: "career",
      label: e.org,
      sub: e.roles[0].title,
      status: e.current ? "current" : undefined,
      icon: e.education ? "g-award" : e.current ? "g-server" : "g-flag",
    });
    if (i > 0) edges.push({ from: `c:${career[i - 1].org}`, to: `c:${e.org}`, kind: "path" });
  });
  const employer = data.experience.find((e) => e.current);

  // workloads, grouped by platform
  const work = [
    ...data.featured_projects.map((p) => ({ title: p.title, status: p.status, tags: p.tags, platform: "AWS" })),
    ...data.projects.map((p) => ({ title: p.title, status: p.status, tags: p.tags, platform: p.platform })),
  ];
  const groups = [...new Set(work.map((w) => w.platform))];
  for (const w of work) {
    const id = `w:${w.title}`;
    nodes.push({ id, tier: "work", label: w.title, sub: w.platform, group: w.platform, status: w.status });
    if (employer) edges.push({ from: `c:${employer.org}`, to: id, kind: "delivered" });
    const used = new Set(w.tags.flatMap((t) => groupsForTag(t, data.skills)));
    for (const g of used) edges.push({ from: id, to: `p:${g}`, kind: "uses" });
  }

  // platform = skill groups (only the ones something connects to, plus all for completeness)
  for (const g of data.skills) {
    nodes.push({ id: `p:${g.name}`, tier: "platform", label: g.name, sub: `${g.items.length} tools`, icon: g.icon });
  }

  // the internship worked hands-on with AWS and containers (from its description)
  const intern = data.experience.find((e) => /intern/i.test(e.roles[0].title));
  if (intern) {
    for (const g of ["AWS", "Containers & releases"]) {
      if (data.skills.some((s) => s.name === g)) edges.push({ from: `c:${intern.org}`, to: `p:${g}`, kind: "uses" });
    }
  }

  return { nodes, edges, groups };
}
