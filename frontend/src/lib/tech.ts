/**
 * Maps a tech/skill label from the content file to an icon in public/tech
 * and a brand colour. First matching rule wins, so specific rules come first.
 * `null` colour means "use the text colour" (for near-black brand marks).
 */

const AWS = "#FF9900";
const AZURE = "#0089D6";
const ACCENT = "var(--accent)";

type Rule = [RegExp, string, string | null];

const RULES: Rule[] = [
  // AWS services: AWS orange on a glyph that says what the service is
  [/^(RDS|RDS PostgreSQL|RDS backups)$/, "g-database", AWS],
  [/^S3$/, "g-bucket", AWS],
  [/^(EC2|Elastic IP)$/, "g-server", AWS],
  [/^(ECR|Amazon ECR|ECS)$/, "g-box", AWS],
  [/^CloudFront$/, "g-globe", AWS],
  [/^CloudWatch$/, "g-activity", AWS],
  [/^(IAM|IAM instance roles|IAM & access control)$/, "g-key", AWS],
  [/^(AWS )?Lightsail$/, "g-server", AWS],
  [/^(AWS )?Amplify/, "g-layers", AWS],
  [/^AWS Backup$/, "g-archive", AWS],
  [/^EBS snapshots$/, "g-disk", AWS],
  [/^CodeCommit$/, "g-branch", AWS],
  [/^Security groups$/, "g-shield", AWS],
  [/^Billing/, "g-receipt", AWS],
  [/Organizations/, "aws", AWS],
  [/^AWS$/, "aws", AWS],

  // Azure services
  [/^(ACR|Azure ACR|Azure Container Registry|Container Registry)$/, "g-box", AZURE],
  [/^Virtual Machines$/, "g-monitor", AZURE],
  [/^Entra ID$/, "g-users", AZURE],
  [/^App Service$/, "g-cloud", AZURE],
  [/^Storage Accounts$/, "g-bucket", AZURE],
  [/^VNets/, "g-network", AZURE],
  [/^Resource Groups$/, "g-folder", AZURE],
  [/^RBAC$/, "g-key", AZURE],
  [/^Azure Monitor$/, "g-activity", AZURE],
  [/^Azure$/, "azure", AZURE],

  // brands
  [/GitHub Actions|Self-hosted runners/, "githubactions", "#2088FF"],
  [/^GitHub$/, "github", null],
  [/GitLab|\.gitlab-ci/, "gitlab", "#FC6D26"],
  [/^Jenkins$/, "jenkins", "#D24939"],
  [/^Git$/, "git", "#F05032"],
  [/^Docker/, "docker", "#2496ED"],
  [/^NGINX$/, "nginx", "#009639"],
  [/^Prometheus$|Node Exporter/, "prometheus", "#E6522C"],
  [/^Alertmanager$/, "g-bell", "#E6522C"],
  [/^Grafana$/, "grafana", "#F46800"],
  [/Loki|Promtail/, "loki", "#F46800"],
  [/^cAdvisor$/, "g-gauge", "#2496ED"],
  [/Uptime Kuma|Segue Monitor/, "uptimekuma", "#5CDD8B"],
  [/^Zabbix/, "g-activity", "#D40000"],
  [/Zoho Cliq/, "g-bell", "#E42527"],
  [/^Zoho/, "zoho", "#E42527"],
  [/^Authentik$/, "authentik", "#FD4B2D"],
  [/pnpm|Turborepo/, "pnpm", "#F69220"],
  [/^Next\.js$/, "nextdotjs", null],
  [/^NestJS$/, "nestjs", "#E0234E"],
  [/^Node\.js$/, "nodedotjs", "#5FA04E"],
  [/^Prisma$/, "prisma", null],
  [/^PostgreSQL$/, "postgresql", "#4169E1"],
  [/^Python$/, "python", "#3776AB"],
  [/^Socket\.IO$/, "socketdotio", null],
  [/^PM2$/, "pm2", "#7B4DFF"],
  [/^cPanel$/, "cpanel", "#FF6C2C"],
  [/^Moodle$/, "moodle", "#F98012"],
  [/Ubuntu/, "ubuntu", "#E95420"],
  [/Windows/, "windows", "#0078D4"],
  [/^OIDC$/, "openid", "#F78C40"],
  [/^OAuth/, "oauth", "#EB5424"],
  [/^Claude/, "claude", "#D97757"],
  [/Antigravity/, "antigravity", "#4285F4"],
  [/^ChatGPT$/, "g-sparkle", "#10A37F"],

  // concepts
  [/Blue\/green|Load-balancing/, "g-lb", ACCENT],
  [/Rollback/, "g-rollback", ACCENT],
  [/health|Health/, "g-heart", ACCENT],
  [/Smoke tests|Container state/, "g-check", ACCENT],
  [/Restart policies/, "g-refresh", ACCENT],
  [/Deployment lock/, "g-lock", ACCENT],
  [/Deployment environments/, "g-layers", ACCENT],
  [/Commit-SHA|Image versioning/, "g-tag", ACCENT],
  [/Image layering|Image optimisation/, "g-layers", ACCENT],
  [/CI\/CD|CI \(POC\)/, "g-branch", ACCENT],
  [/TLS|SSL|VPN|SAML|Secrets/, "g-lock", ACCENT],
  [/SSO|Zero-trust|hardening/, "g-shield", ACCENT],
  [/Rate limiting/, "g-gauge", ACCENT],
  [/WebSockets/, "g-zap", ACCENT],
  [/gzip/, "g-zap", ACCENT],
  [/^DNS$|Custom domain/, "g-globe", ACCENT],
  [/TCP\/IP/, "g-network", ACCENT],
  [/Cron/, "g-clock", ACCENT],
  [/Backups/, "g-archive", ACCENT],
  [/hosting|Dedicated server/i, "g-hosting", ACCENT],
  [/Linux/, "g-terminal", ACCENT],
];

export type TechIcon = { src: string; color: string | null };

const cache = new Map<string, TechIcon | null>();

export function techIcon(label: string): TechIcon | null {
  if (cache.has(label)) return cache.get(label)!;
  const rule = RULES.find(([re]) => re.test(label));
  const icon = rule ? { src: `/tech/${rule[1]}.svg`, color: rule[2] } : null;
  cache.set(label, icon);
  return icon;
}
