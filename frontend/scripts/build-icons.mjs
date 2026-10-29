// Generates public/tech/*.svg: brand marks from simple-icons / devicon plus
// hand-drawn line glyphs for concepts. The output is committed, so this only
// needs re-running when adding icons:
//
//   npm i --no-save simple-icons devicon   (or point ICON_SRC at a node_modules dir that has them)
//   node scripts/build-icons.mjs
//
// Icons render through CSS mask-image, so only their shape matters; colour comes from CSS.

import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("public/tech");
const SRC = process.env.ICON_SRC ? path.resolve(process.env.ICON_SRC) : path.resolve("node_modules");
fs.mkdirSync(OUT, { recursive: true });

const SIMPLE = [
  "githubactions", "docker", "nginx", "prometheus", "grafana", "gitlab", "jenkins", "git", "github",
  "uptimekuma", "authentik", "zoho", "pnpm", "turborepo", "nextdotjs", "nestjs", "prisma", "socketdotio",
  "pm2", "cpanel", "moodle", "ubuntu", "postgresql", "python", "nodedotjs", "claude", "openid",
];
const DEVICON = {
  aws: "amazonwebservices/amazonwebservices-plain.svg",
  azure: "azure/azure-plain.svg",
  windows: "windows11/windows11-original.svg",
  loki: "grafanaloki/grafanaloki-plain.svg",
  oauth: "oauth/oauth-plain.svg",
  antigravity: "antigravity/antigravity-plain.svg",
};

for (const slug of SIMPLE) {
  const file = path.join(SRC, "simple-icons/icons", `${slug}.svg`);
  fs.copyFileSync(file, path.join(OUT, `${slug}.svg`));
}
for (const [name, rel] of Object.entries(DEVICON)) {
  fs.copyFileSync(path.join(SRC, "devicon/icons", rel), path.join(OUT, `${name}.svg`));
}

// 24×24 stroke glyphs in one consistent style.
const G = {
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  database: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  bucket: '<path d="M3.5 6h17l-2 14a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7z"/><ellipse cx="12" cy="6" rx="8.5" ry="2.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  key: '<circle cx="8" cy="15" r="4.5"/><path d="M11.2 11.8 20 3M16 7l3 3M18 5l2 2"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  lock: '<rect x="4" y="10.5" width="16" height="10.5" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5M12 15v2"/>',
  box: '<path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9z"/><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  rollback: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v5h5"/>',
  refresh: '<path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
  heart: '<path d="M20.5 8.5c0 5.5-8.5 11-8.5 11S3.5 14 3.5 8.5a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2z"/><path d="M7 11h2.5l1.5-2.5 2 5 1.5-2.5H17"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  branch: '<circle cx="6" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="7" r="2.2"/><path d="M6 7.2v9.6M18 9.2c0 5-12 3-12 7.6"/>',
  tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-3.5 3.2-5.5 6.5-5.5s6 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.3 2.5 3.5 5.2"/>',
  network: '<rect x="9" y="2.5" width="6" height="5" rx="1"/><rect x="2.5" y="16.5" width="6" height="5" rx="1"/><rect x="15.5" y="16.5" width="6" height="5" rx="1"/><path d="M12 7.5v4.5M5.5 16.5V12h13v4.5"/>',
  gauge: '<path d="M3.5 17a9 9 0 1 1 17 0"/><path d="m12 14 4.5-5.5"/><circle cx="12" cy="14.5" r="1.5"/>',
  split: '<path d="M4 12h5l4-6h7M13 18l-4-6M13 18h7"/><path d="m17 3 3 3-3 3M17 15l3 3-3 3"/>',
  terminal: '<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="m7 9.5 3 2.5-3 2.5M12.5 15H17"/>',
  cloud: '<path d="M7 19a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 19 9.5 4.8 4.8 0 0 1 17.5 19z"/>',
  archive: '<rect x="2.5" y="4" width="19" height="5" rx="1"/><path d="M4.5 9v10a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4"/>',
  disk: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 14h18M7 16.5h.01M10 16.5h.01"/>',
  monitor: '<rect x="2.5" y="3.5" width="19" height="13" rx="2"/><path d="M8 20.5h8M12 16.5v4"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  sparkle: '<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z"/><path d="M19 15.5c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5z"/>',
  file: '<path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z"/><path d="M14 2.5V8h5.5M10 13l-2 2 2 2M14 13l2 2-2 2"/>',
  zap: '<path d="M13 2.5 4 14h7l-1 7.5L19 10h-7z"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  receipt: '<path d="M5 2.5h14v19l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  folder: '<path d="M3 6.5a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  hosting: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M7 6h.01M10 6h.01M8 13.5h8M8 17h5"/>',
  lb: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="12" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v9M10.5 7 6 16.8M13.5 7 18 16.8"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 4-6.5 8-6.5s7.2 2.5 8 6.5"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.5c0-2 1.3-3 2.7-3s2.3 1 2.3 3V17"/>',
  wave: '<path d="M2.5 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/><path d="M2.5 17c2-4 4-4 6 0s4 4 6 0 4-4 6 0" opacity=".5"/>',
};

for (const [name, body] of Object.entries(G)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>\n`;
  fs.writeFileSync(path.join(OUT, `g-${name}.svg`), svg);
}

console.log(`wrote ${SIMPLE.length + Object.keys(DEVICON).length + Object.keys(G).length} icons to ${OUT}`);
