export type KV = { k: string; v: string };

export type Status = "prod" | "wip" | "poc";

export type PortfolioContent = {
  profile: {
    name: string;
    role: string;
    company: string;
    location: string;
    location_short: string;
    email: string;
    linkedin: string;
    github: string;
    headline: string;
    intro: string;
    facts: KV[];
    toolbelt: string[];
  };
  release_log: ({ kind: "cmd" | "done"; text: string } | ({ kind: "step" } & KV))[];
  about: { title: string; paragraphs: string[]; principles: KV[] };
  workflow: {
    title: string;
    lead: string;
    stages: { id: string; label: string; title: string; body: string; tools: string[] }[];
    request_path: {
      title: string;
      lead: string;
      nodes: (KV & { accent?: boolean; details?: string[] })[];
    };
    aws_org: {
      title: string;
      lead: string;
      root: string;
      ous: string[];
      note: string;
      environments: { name: string; items: string[] }[];
    };
  };
  featured_projects: FeaturedProject[];
  project_filters: { id: string; label: string }[];
  projects: Project[];
  experience: {
    org: string;
    location: string;
    current?: boolean;
    education?: boolean;
    roles: { title: string; period: string; tag?: string; start: string; end: string | null }[];
    points: string[];
  }[];
  skills: { icon: string; name: string; items: string[] }[];
  learning: { kind: string; title: string; body: string }[];
  contact: { title: string; lead: string };
};

/** Content plus the build stamp derived from it at render time. */
export type Portfolio = PortfolioContent & { build: { sha: string } };

export type FeaturedProject = {
  id: string;
  status: Status;
  status_label: string;
  badge: string | null;
  title: string;
  summary: string;
  tags: string[];
  pipeline: KV[];
  details: Record<string, string>;
  bluegreen?: { blue: string; green: string; steps: string[] };
  monitoring?: { group: string; items: KV[] }[];
};

export type Project = {
  title: string;
  subtitle: string;
  status: Status;
  status_label: string;
  platform: string;
  cats: string[];
  body: string;
  note?: KV;
  tags: string[];
};
