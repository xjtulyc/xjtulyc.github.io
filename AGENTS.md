# AGENTS.md

This repository is Youcheng Li's personal academic website hosted by GitHub Pages at `youchengli.com`.

## Project Shape

- This is a plain static website, not a Node, Jekyll, or Python project.
- The production entry point is `index.html`.
- The custom domain is configured by `CNAME`.
- Main site content is centralized in `config/site-config.js`.
- Dynamic homepage sections are rendered by `js/dynamic-content-loader.js`.
- Page interactions live mostly in `js/single-page-app.js` and `js/modern-script.js`.
- Styling lives in `style/`.
- Static assets live in `resources/`, `pub/`, `pdf/`, `demo/`, and `teaching/`.
- Resume sources live in `personal_cv/`.

## Editing Rules

- For profile, news, publications, projects, awards, teaching, talks, resources, or sidebar content, edit `config/site-config.js` first.
- Only edit `index.html` when the page structure, script/style includes, SEO metadata, or static fallback content must change.
- If changing personal identity, CV links, SEO fields, or social links, keep `config/site-config.js` and relevant static metadata in `index.html` consistent.
- Preserve the current static-site architecture. Do not introduce a build system, framework, package manager, or bundler unless explicitly requested.
- Keep changes scoped. Avoid broad visual rewrites or unrelated refactors.
- Do not remove the `CNAME` file.
- Treat `GETTING-STARTED.md` and `README-CONFIG-SYSTEM.md` as partially stale; verify actual files before trusting referenced paths.

## Website Verification

- Since this is a static site, prefer a local HTTP server for browser testing:

```bash
python3 -m http.server 8000
```

- Then open `http://localhost:8000/`.
- Check the browser console after changing JavaScript or `config/site-config.js`.
- If testing only markup or CSS, opening `index.html` directly can work, but a local server is closer to GitHub Pages behavior.

## Resume Workflow

- Chinese resume source: `personal_cv/cv_ch.tex`.
- English resume source: `personal_cv/cv_en.tex`.
- Compile from `personal_cv/` with XeLaTeX:

```bash
xelatex -interaction=nonstopmode -halt-on-error cv_ch.tex
xelatex -interaction=nonstopmode -halt-on-error cv_ch.tex
xelatex -interaction=nonstopmode -halt-on-error cv_en.tex
xelatex -interaction=nonstopmode -halt-on-error cv_en.tex
```

- The current environment may not have `fontawesome5.sty`; the CV templates include a fallback for missing icons.
- The current environment has `Noto Sans SC`, not necessarily `Noto Serif CJK SC` or `Noto Sans CJK SC`.
- Do not commit LaTeX auxiliary files such as `.aux` and `.log` unless the user specifically asks for them.
- Generated PDF resumes may be committed when they are intended for website download or sharing.

## Content and Translation Notes

- Prefer official English names for institutions, companies, competitions, and products.
- If an official English name is unknown, ask the user before finalizing public-facing resume or homepage text.
- Keep publication titles and venue names exactly as published.
- Be careful with time-sensitive claims such as accepted/published status, funding stage, and deployment/customer descriptions.

## Git Hygiene

- The worktree may contain user changes. Do not revert files you did not change.
- Check `git status --short` before summarizing changes.
- Keep generated or temporary files out of commits unless they are intentionally part of the site.
