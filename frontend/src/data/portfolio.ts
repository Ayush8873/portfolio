// All portfolio content lives here. Edit this file to change what the site shows.
import type { PortfolioContent } from "@/lib/types";

export const PORTFOLIO: PortfolioContent = {
  "profile": {
    "name": "Ayush Kumar",
    "role": "DevOps Engineer L2",
    "company": "SegueIT",
    "location": "Ghaziabad, UP, India",
    "location_short": "Ghaziabad, UP",
    "email": "kumarayush088@gmail.com",
    "linkedin": "https://linkedin.com/in/ayush088",
    "github": "https://github.com/Ayush8873",
    "headline": "I build the path from git push to production, and keep it running.",
    "intro": "I turn a git push into a tested, versioned container running in production, and I make sure the team hears about it the moment something stops responding. Pipelines, containers, cloud infrastructure and monitoring for client and in-house applications on AWS, Azure and Linux servers.",
    "facts": [
      { "k": "Now", "v": "DevOps Engineer L2, SegueIT" },
      { "k": "Clouds", "v": "AWS · Azure" },
      { "k": "Based in", "v": "Ghaziabad, UP" }
    ],
    "toolbelt": ["GitHub Actions", "Docker", "Amazon ECR", "EC2", "Azure ACR", "NGINX", "Prometheus", "Grafana", "Loki", "Uptime Kuma", "AWS Organizations"]
  },

  "release_log": [
    { "kind": "cmd", "text": "git push origin main" },
    { "kind": "step", "k": "github-actions", "v": "lint ✓  test ✓  build ✓" },
    { "kind": "step", "k": "docker build", "v": "api, web  tag sha-<commit>" },
    { "kind": "step", "k": "push", "v": "ECR · pulled via IAM role" },
    { "kind": "step", "k": "deploy", "v": "lock acquired · compose pull && up -d" },
    { "kind": "step", "k": "verify", "v": "GET /health 200 · smoke tests ✓" },
    { "kind": "step", "k": "nginx -t", "v": "ok · reload" },
    { "kind": "done", "text": "release live · lock released · watching Grafana" }
  ],

  "about": {
    "title": "Building Reliable Infrastructure. Automating Delivery. Enabling Scale.",
    "paragraphs": [
      "I’m a DevOps Engineer focused on building reliable, scalable, and automated cloud infrastructure that simplifies deployments and improves operational efficiency.",
      "With hands-on experience in AWS/Azure, Docker, CI/CD pipelines, and infrastructure automation, I work on streamlining software delivery, reducing manual effort, and creating consistent, production-ready environments.",
      "My approach to DevOps goes beyond tools and technologies. I focus on solving real-world engineering challenges through automation, cloud-native practices, and continuous improvement—helping teams deliver software faster, maintain system reliability, and scale with confidence.",
      "I’m continuously expanding my expertise in cloud infrastructure, DevSecOps, observability, and modern deployment practices to build systems that are secure, resilient, and built for long-term growth."
    ],
    "principles": [
      { "k": "trace", "v": "Every image is tagged with its Git commit SHA, so any release maps to its source." },
      { "k": "least-priv", "v": "EC2 pulls from ECR through a scoped IAM role. One OU per client in AWS Organizations." },
      { "k": "verify", "v": "Deploys check /health and run smoke tests, rather than trusting container status." },
      { "k": "observe", "v": "Metrics, logs and uptime checks, so incidents get narrowed down quickly." },
      { "k": "document", "v": "Everything I set up and change gets written down." }
    ]
  },

  "workflow": {
    "title": "How code reaches production",
    "lead": "The delivery pipeline I run across projects. Select a stage to see what happens there and which tools I use.",
    "stages": [
      {
        "id": "source", "label": "Source", "title": "Source",
        "body": "Changes are pushed to GitHub and deployment workflows trigger from the approved branch. The pharmacy platform lives in a pnpm/Turborepo monorepo with a Next.js storefront and a NestJS API side by side.",
        "tools": ["Git", "GitHub", "pnpm / Turborepo"]
      },
      {
        "id": "ci", "label": "CI", "title": "Continuous integration",
        "body": "GitHub Actions runs lint, tests and the monorepo build before anything is packaged. Production deploys run on a self-hosted runner; static sites build on AWS Amplify with branch-based builds. I also built a GitLab CE + GitLab Runner pipeline as a proof of concept.",
        "tools": ["GitHub Actions", "Self-hosted runners", "AWS Amplify CI/CD", "GitLab CI (POC)"]
      },
      {
        "id": "package", "label": "Package", "title": "Package",
        "body": "Separate Docker images for the API and web app, each tagged with the Git commit SHA so a running container can always be traced back to the exact source it came from.",
        "tools": ["Docker", "Docker Compose", "Commit-SHA tags"]
      },
      {
        "id": "registry", "label": "Registry", "title": "Registry",
        "body": "AWS workloads push to Amazon ECR; Azure workloads push to Azure Container Registry. EC2 authenticates to ECR through an IAM instance role scoped to the repositories it needs, which removed long-lived access keys from the servers.",
        "tools": ["Amazon ECR", "Azure Container Registry", "IAM instance roles"]
      },
      {
        "id": "deploy", "label": "Deploy", "title": "Deploy",
        "body": "Targets vary by project: EC2 with Docker Compose behind NGINX, Azure, AWS Lightsail, AWS Amplify and cPanel-managed servers. Production deploys take a deployment lock so two releases can never overlap, and NGINX config is validated before every reload. The pharmacy platform releases blue/green: the new version is health-checked on the idle stack before NGINX switches traffic, and the previous stack stays ready for rollback.",
        "tools": ["EC2", "Azure", "Lightsail", "Amplify", "cPanel", "Deployment lock", "Blue/green", "Rollback"]
      },
      {
        "id": "verify", "label": "Verify", "title": "Verify",
        "body": "Deploy scripts hit the API and frontend /health endpoints and run smoke tests, and check container state, instead of relying on Docker's status alone. The lock is only released once the release is verified and reported.",
        "tools": ["/health checks", "Smoke tests", "Container state"]
      },
      {
        "id": "observe", "label": "Observe", "title": "Observe",
        "body": "Node Exporter, cAdvisor and Promtail on the production server feed Prometheus, Loki, Grafana and Alertmanager on a separate monitoring server. Segue Monitor, our white-labelled Uptime Kuma, runs HTTP and keyword checks and posts down/up alerts to a Zoho Cliq channel. CloudWatch covers AWS resources, and I'm adding Zabbix.",
        "tools": ["Prometheus", "Grafana", "Loki / Promtail", "Alertmanager", "cAdvisor", "Segue Monitor", "Zoho Cliq alerts", "CloudWatch", "Zabbix (in progress)"]
      }
    ],
    "request_path": {
      "title": "Request path in production",
      "lead": "What sits between a user and the application.",
      "nodes": [
        { "k": "client", "v": "Browser / Socket.IO client" },
        { "k": "dns", "v": "Domain → instance" },
        { "k": "nginx", "v": "Single public entry point", "accent": true,
          "details": ["TLS 1.2 / 1.3, HTTPS redirect", "Rate limit 10 req/s with burst", "Security headers, sensitive paths blocked", "WebSocket upgrade for Socket.IO", "gzip, static caching"] },
        { "k": "app", "v": "Next.js web · NestJS API on localhost" },
        { "k": "data", "v": "RDS PostgreSQL · S3 + CloudFront" }
      ]
    },
    "aws_org": {
      "title": "Client accounts on AWS",
      "lead": "Each client is isolated in its own organizational unit.",
      "root": "Management account",
      "ous": ["Client A", "Client B", "Client …"],
      "note": "Keeps access, resources and billing separate per client.",
      "environments": [
        { "name": "test", "items": ["own database endpoint", "own credentials & secrets", "GitHub environment", "security groups"] },
        { "name": "production", "items": ["own database endpoint", "own credentials & secrets", "GitHub environment", "restrictive security groups"] }
      ]
    }
  },

  "featured_projects": [
    {
      "id": "pharmacy",
      "status": "prod",
      "status_label": "Production",
      "badge": "Blue/green releases",
      "title": "Pharmacy E-commerce Platform on AWS",
      "summary": "Containerised release pipeline for a Next.js storefront and NestJS API, from monorepo commit to a verified deployment on EC2.",
      "tags": ["GitHub Actions", "Docker", "ECR", "EC2", "NGINX", "RDS", "S3", "CloudFront", "CloudWatch"],
      "pipeline": [
        { "k": "commit", "v": "monorepo" },
        { "k": "ci", "v": "lint · test · build" },
        { "k": "image", "v": "api + web · sha tag" },
        { "k": "ecr", "v": "IAM role pull" },
        { "k": "ec2", "v": "compose + nginx" },
        { "k": "verify", "v": "/health · smoke" }
      ],
      "details": {
        "Objective": "Ship two services from one pnpm/Turborepo monorepo to AWS with repeatable, traceable releases and no manual steps on the server.",
        "Approach": "GitHub Actions runs lint, tests and the monorepo build, builds separate API and web images tagged with the commit SHA, and pushes them to ECR. EC2 pulls through an IAM instance role and restarts the stack behind NGINX. RDS PostgreSQL with Prisma migrations, S3 for files delivered through CloudFront, CloudWatch for EC2 and RDS metrics and logs.",
        "Challenges": "Knowing a release is really healthy, not just that a container started; keeping AWS keys off the server; separating test and production configuration; config changes that could break NGINX on reload.",
        "Outcome": "In production with blue/green releases: the new version is verified on /health for both services and smoke-tested before NGINX switches traffic, and the previous stack stays up for instant rollback. Containers run with restart policies, nginx -t runs before every reload, and every release maps to a commit."
      },
      "bluegreen": {
        "blue": "current · kept for rollback",
        "green": "new · health-checked first",
        "steps": ["Start the new version on the idle stack", "Verify health", "Switch NGINX upstream", "Keep the previous stack for rollback"]
      }
    },
    {
      "id": "vms",
      "status": "prod",
      "status_label": "Production",
      "badge": null,
      "title": "Segue Visitor & Staff Management System: Operations and Monitoring",
      "summary": "A Dockerized REST and real-time backend shipped through GitHub Actions and ECR to EC2, behind NGINX, with locked deployments and a separate monitoring server watching it.",
      "tags": ["GitHub Actions", "Docker", "ECR", "EC2", "NGINX", "RDS", "S3", "Socket.IO", "Prometheus", "Grafana", "Loki", "Alertmanager"],
      "pipeline": [
        { "k": "trigger", "v": "approved branch" },
        { "k": "ci", "v": "validate · build" },
        { "k": "image", "v": "docker → ECR" },
        { "k": "runner", "v": "take deploy lock" },
        { "k": "ec2", "v": "deploy · nginx" },
        { "k": "verify", "v": "health · release lock" }
      ],
      "monitoring": [
        { "group": "production server", "items": [{ "k": "host", "v": "Node Exporter" }, { "k": "containers", "v": "cAdvisor" }, { "k": "logs", "v": "Promtail" }] },
        { "group": "monitoring server · store", "items": [{ "k": "metrics", "v": "Prometheus" }, { "k": "logs", "v": "Loki" }] },
        { "group": "monitoring server · act", "items": [{ "k": "dashboards", "v": "Grafana" }, { "k": "alerts", "v": "Alertmanager" }] }
      ],
      "details": {
        "Objective": "Keep a production backend serving /v1/ REST APIs and Socket.IO connections reliable, and make problems quick to locate.",
        "Approach": "GitHub Actions builds the Docker image and pushes it to ECR; a self-hosted runner on the server takes a deployment lock, deploys to EC2, verifies container state and health, then releases the lock and reports. RDS holds the data and S3 the files. NGINX handles TLS, /v1/ routing, rate limiting (10 req/s with burst) and WebSocket upgrades with timeouts tuned for long-lived connections.",
        "Challenges": "Real-time connections dropping behind a proxy; overlapping deployments interfering with each other; telling host, container and application issues apart; keeping monitoring alive when the production server itself is in trouble.",
        "Outcome": "In production. Prometheus, Loki, Grafana and Alertmanager run on a separate monitoring server, so the dashboards stay up when production doesn't. Host, container and log telemetry sit in one Grafana view, with alert rules for target down, high CPU, low disk, memory pressure and container restarts."
      }
    }
  ],

  "project_filters": [
    { "id": "all", "label": "All" },
    { "id": "azure", "label": "Azure" },
    { "id": "aws", "label": "AWS" },
    { "id": "hosting", "label": "Hosting" },
    { "id": "security", "label": "Security & IAM" },
    { "id": "poc", "label": "POCs" }
  ],

  "projects": [
    {
      "title": "Segue Monitor", "subtitle": "White-labelled Uptime Kuma",
      "status": "prod", "status_label": "Production", "platform": "Azure", "cats": ["azure"],
      "body": "White-labelled Uptime Kuma into Segue Monitor, the company's own uptime service, built as a custom image in ACR and shipped to Azure through GitHub Actions. It runs HTTP and keyword checks on our production sites.",
      "note": { "k": "alerting", "v": "Down and recovery alerts post to a dedicated Zoho Cliq channel, with the status code and the reason the check failed." },
      "tags": ["Azure", "ACR", "Docker", "GitHub Actions", "Uptime Kuma", "Zoho Cliq"]
    },
    {
      "title": "Transcriber", "subtitle": "Containerised application",
      "status": "prod", "status_label": "Production", "platform": "Azure", "cats": ["azure"],
      "body": "Containerised the Transcriber application and deployed it on Azure through a GitHub Actions pipeline, with images in Azure Container Registry.",
      "tags": ["Azure", "ACR", "Docker", "GitHub Actions"]
    },
    {
      "title": "Qlik-to-Fabric", "subtitle": "Application deployment",
      "status": "prod", "status_label": "Production", "platform": "Azure", "cats": ["azure"],
      "body": "Deployed the Qlik-to-Fabric application on Azure through a GitHub Actions pipeline, with images in Azure Container Registry.",
      "tags": ["Azure", "ACR", "Docker", "GitHub Actions"]
    },
    {
      "title": "Project Management System", "subtitle": "Application deployment",
      "status": "prod", "status_label": "Production", "platform": "Azure", "cats": ["azure"],
      "body": "Deployed the Project Management System on Azure through a GitHub Actions pipeline, with images in Azure Container Registry.",
      "tags": ["Azure", "ACR", "Docker", "GitHub Actions"]
    },
    {
      "title": "Makhana E-commerce Website", "subtitle": "Full-stack app on EC2",
      "status": "prod", "status_label": "Production", "platform": "AWS", "cats": ["aws", "hosting"],
      "body": "Deployed the Next.js + NestJS app from a pnpm/Turborepo monorepo on Ubuntu EC2. NGINX terminates TLS and proxies to the app on localhost, and PM2 keeps the processes running across crashes and reboots. Pointed the domain at the instance and worked through DNS, nameserver and NGINX virtual-host issues until the site served correctly.",
      "note": { "k": "challenge", "v": "The frontend build failed on backend Prisma config pulled in through a shared workspace reference. Traced the import and isolated the frontend build." },
      "tags": ["EC2", "Next.js", "NestJS", "Prisma", "PM2", "NGINX", "DNS"]
    },
    {
      "title": "SegueIT Company Website", "subtitle": "Containerised on Lightsail with CI/CD",
      "status": "prod", "status_label": "Production", "platform": "AWS", "cats": ["aws", "hosting"],
      "body": "Containerised the company website with Docker and deployed it on AWS Lightsail, with a GitHub Actions pipeline that ships every push.",
      "tags": ["AWS Lightsail", "Docker", "GitHub Actions"]
    },
    {
      "title": "Home Loan Advisory Website", "subtitle": "Amplify with branch builds",
      "status": "prod", "status_label": "Production", "platform": "AWS", "cats": ["aws", "hosting"],
      "body": "Deployed an Australian home loan advisory website on AWS Amplify with branch-based CI/CD builds and a custom domain.",
      "tags": ["AWS Amplify", "CI/CD", "Custom domain"]
    },
    {
      "title": "Education Client Hosting", "subtitle": "Moodle LMS and website",
      "status": "prod", "status_label": "Production", "platform": "Linux", "cats": ["hosting"],
      "body": "Manage the client's servers through cPanel: deployed and maintain the open-source Moodle LMS on a dedicated server, and host their website on Linux enterprise shared hosting.",
      "tags": ["cPanel", "Moodle", "Dedicated server", "Shared hosting"]
    },
    {
      "title": "AWS Security & Backup Operations", "subtitle": "Recovery and least privilege",
      "status": "prod", "status_label": "Production", "platform": "AWS", "cats": ["aws", "security"],
      "body": "Automated RDS backups with 7-day retention, EC2 snapshots for server recovery, and an AWS Backup plan running daily at 02:00 Sydney time with 14-day retention. Cron jobs handle scheduled backup and maintenance tasks on the servers. Reviewed IAM policies to remove unnecessary permissions and kept credentials out of code and images.",
      "tags": ["AWS Backup", "RDS backups", "EBS snapshots", "Cron jobs", "IAM"]
    },
    {
      "title": "Identity & Access Management", "subtitle": "Authentik and Zoho Directory",
      "status": "poc", "status_label": "POC · completed", "platform": "IAM", "cats": ["security", "poc"],
      "body": "Implemented an Authentik POC with Docker Compose and PostgreSQL to evaluate SSO for internal tools (users, groups, access policies, OIDC/SAML), and built a Zoho Directory POC for centralised user management and SSO.",
      "tags": ["Authentik", "Zoho Directory", "OIDC", "SAML", "Docker Compose"]
    },
    {
      "title": "GitLab CI/CD Pipeline", "subtitle": "Self-hosted GitLab on EC2",
      "status": "poc", "status_label": "POC · completed", "platform": "AWS", "cats": ["aws", "poc"],
      "body": "Installed GitLab CE and a self-hosted GitLab Runner on EC2. Built a build → test → deploy pipeline that builds a Docker image, checks HTTP status and page content, then deploys an NGINX container.",
      "tags": ["GitLab CE", "GitLab Runner", ".gitlab-ci.yml", "Docker", "NGINX"]
    }
  ],

  "experience": [
    {
      "org": "SegueIT", "location": "Ghaziabad, UP", "current": true,
      "roles": [
        { "title": "DevOps Engineer L2", "tag": "Promoted", "period": "Aug 2026 – Present", "start": "2026-08", "end": null },
        { "title": "Junior DevOps Engineer", "period": "Jan 2026 – Aug 2026", "start": "2026-01", "end": "2026-08" }
      ],
      "points": [
        "Own CI/CD, deployments and day-to-day operations for client and in-house applications on AWS, Azure and Linux servers.",
        "Took 10+ applications to production across EC2, Lightsail, Amplify, Azure and cPanel hosting, most of them containerised and shipped through GitHub Actions.",
        "Run client AWS accounts in AWS Organizations, plus backups, IAM and production monitoring.",
        "Handle system administration for Linux and Windows servers."
      ]
    },
    {
      "org": "TECH-A-INTERN", "location": "Remote",
      "roles": [{ "title": "AWS Cloud Development Intern", "period": "Jan 2025 – Feb 2025", "start": "2025-01", "end": "2025-02" }],
      "points": ["Provisioned EC2, IAM and an Elastic IP-backed WordPress site on AWS, and containerised app components with Docker."]
    },
    {
      "org": "Agumentik Software Pvt. Ltd.", "location": "Remote",
      "roles": [{ "title": "Technical Business Development", "period": "Jan 2024 – May 2024", "start": "2024-01", "end": "2024-05" }],
      "points": ["Generated leads, gathered client requirements, prepared proposals and presentations, and relayed client feedback to internal teams."]
    },
    {
      "org": "Lovely Professional University", "location": "Punjab", "education": true,
      "roles": [{ "title": "B.Tech, Computer Science and Engineering", "period": "2019 – 2023", "start": "2019", "end": "2023" }],
      "points": []
    }
  ],

  "skills": [
    { "icon": "aws", "name": "AWS", "items": ["Organizations (OUs)", "EC2", "ECS", "ECR", "CodeCommit", "Lightsail", "Amplify", "CloudFront", "CloudWatch", "IAM", "RDS PostgreSQL", "S3", "Elastic IP", "AWS Backup", "Security groups", "Billing & Cost Management"] },
    { "icon": "azure", "name": "Azure", "items": ["Virtual Machines", "Entra ID", "Container Registry", "App Service", "Storage Accounts", "VNets & NSGs", "Resource Groups", "RBAC", "Azure Monitor"] },
    { "icon": "g-branch", "name": "CI/CD", "items": ["GitHub Actions", "Self-hosted runners", "Deployment environments", "AWS Amplify CI/CD", "GitLab CI/CD", "GitLab Runner", "Jenkins", "Git"] },
    { "icon": "g-box", "name": "Containers & releases", "items": ["Docker", "Docker Compose", "Image layering", "Image optimisation", "Image versioning", "Health checks", "Restart policies", "Blue/green", "Rollback", "Smoke tests", "Deployment locking"] },
    { "icon": "g-globe", "name": "Web & networking", "items": ["NGINX", "TLS termination", "Rate limiting", "WebSockets", "gzip & caching", "DNS", "SSL/TLS", "TCP/IP", "VPN", "Load-balancing basics"] },
    { "icon": "g-activity", "name": "Monitoring & logging", "items": ["Prometheus", "Grafana", "Loki", "Promtail", "Alertmanager", "Node Exporter", "cAdvisor", "Uptime Kuma", "CloudWatch", "Zabbix (in progress)"] },
    { "icon": "g-server", "name": "Hosting & systems", "items": ["Ubuntu Linux", "PM2", "cPanel", "Dedicated & shared hosting", "Moodle", "System hardening", "Backups", "Cron jobs", "Windows Server"] },
    { "icon": "g-shield", "name": "Identity & security", "items": ["IAM & access control", "Zero-trust concepts", "SSO", "OIDC", "OAuth 2.0", "SAML", "Authentik", "Zoho Directory", "Secrets management"] },
    { "icon": "g-file", "name": "App stack (deploy side)", "items": ["Next.js", "NestJS", "Node.js", "pnpm / Turborepo", "Python", "Prisma", "PostgreSQL"] },
    { "icon": "g-sparkle", "name": "AI tools", "items": ["Claude Code", "Claude Cowork", "Claude connectors & skills", "Google Antigravity", "ChatGPT"] }
  ],

  "learning": [
    { "kind": "achievement", "title": "Promoted to DevOps Engineer L2", "body": "SegueIT, August 2026, after probation as a Junior DevOps Engineer." },
    { "kind": "certificate", "title": "GUVI–HCL DevOps Fundamentals", "body": "Certificate from the GUVI–HCL webinar on DevOps fundamentals." },
    { "kind": "course", "title": "AWS Educate: AWS Management Console", "body": "AWS Educate course on working with the AWS Management Console." },
    { "kind": "event", "title": "AWS AWSome Day", "body": "Attended the AWS AWSome Day online conference." },
    { "kind": "courses", "title": "AWS, Linux & DevOps", "body": "AWS and Linux courses on Udemy and Great Learning, the DevOps Bridge Course, and introductory AI training." },
    { "kind": "community", "title": "Volunteering", "body": "Technical support for non-profits and college events." }
  ],

  "contact": {
    "title": "Have a pipeline to build or a platform to run?",
    "lead": "I'm happy to talk about DevOps roles, projects or anything in this portfolio."
  }
};
