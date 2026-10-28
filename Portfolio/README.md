# Ayush Kumar · Portfolio

Static personal site. No build step, no framework: plain HTML, CSS and a small vanilla JS file.

```
index.html                 all content (semantic HTML, works without JS)
favicon.svg
assets/css/styles.css      design tokens at the top, then components and sections
assets/js/main.js          nav, scroll reveal, hero terminal, pipeline tabs, project filter, copy email
assets/Ayush_Kumar_DevOps_Engineer_Resume.pdf
```

## Editing content

- **Projects:** each card in `#project-grid` is an `<article class="card" data-cat="...">`.
  Copy one, change the text, and set `data-cat` to any of `aws azure hosting security poc` (space-separated) so the filters pick it up.
- **Status labels:** `status-prod` (green), `status-wip` (amber), `status-poc` (violet).
- **Diagrams:** `.flow.flow-h` (horizontal) and `.flow.flow-v` (vertical) are reusable; each step is an `<li class="node">` with `.node-k` (label) and `.node-v` (value). Add `.node-accent` to highlight one.
- **Résumé:** replace the PDF in `assets/` with the same file name.
- **Colours / fonts:** change the variables in `:root` at the top of `styles.css`.

## Before going live

1. Add your domain to `<head>`: `<link rel="canonical" href="https://YOUR-DOMAIN/">` and `og:url`.
2. Optionally add a 1200×630 `og:image` for link previews.

## Deploy

Any static host works. Since the site is all about AWS, Azure and CI/CD, it is worth deploying it the same way:

- **AWS Amplify:** connect the GitHub repo, no build settings needed (artifact base directory `/`).
- **S3 + CloudFront:** sync the folder to a bucket, put CloudFront in front, add a GitHub Actions workflow that runs `aws s3 sync` and a CloudFront invalidation on push.
- **GitHub Pages:** push to a repo and enable Pages on the `main` branch.

Preview locally:

```bash
python -m http.server 8080
```
