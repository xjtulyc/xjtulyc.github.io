# AGENTS.md

This directory contains the LaTeX source files for Youcheng Li's Chinese and English resumes.

## Files

- Chinese resume source: `cv_ch.tex`
- English resume source: `cv_en.tex`
- Chinese generated PDF: `cv_ch.pdf`
- English generated PDF: `cv_en.pdf`

## Compile Requirements

- Compile with XeLaTeX from this directory.
- Run XeLaTeX twice for each resume so page references such as `LastPage` are correct.
- Use nonstop mode and fail on errors:

```bash
xelatex -interaction=nonstopmode -halt-on-error cv_ch.tex
xelatex -interaction=nonstopmode -halt-on-error cv_ch.tex
xelatex -interaction=nonstopmode -halt-on-error cv_en.tex
xelatex -interaction=nonstopmode -halt-on-error cv_en.tex
```

- If only one language changed, compiling only that language twice is enough.
- The templates are expected to compile on the current machine even when `fontawesome5.sty` is missing; keep the icon fallback logic intact.
- The current machine has `Noto Sans SC`; do not switch Chinese fonts to unavailable CJK font names unless you also verify compilation locally.

## Sync Requirements

After compiling resumes intended for the website, sync generated PDFs to the repository `pdf/` directory:

```bash
cp cv_en.pdf ../pdf/youcheng_li_cv.pdf
cp cv_ch.pdf ../pdf/youcheng_li_cv_ch.pdf
```

- `../pdf/youcheng_li_cv.pdf` is the public English CV download.
- `../pdf/youcheng_li_cv_ch.pdf` is the public Chinese CV download.
- If these public paths change, also update `../config/site-config.js`, `../index.html`, and any related dynamic loader logic.
- Keep the English and Chinese resumes factually synchronized unless the user explicitly wants them to diverge.

## Output Checks

- Check PDF metadata/page count with `pdfinfo`.
- Spot-check text extraction with `pdftotext` when changing content:

```bash
pdfinfo cv_en.pdf
pdfinfo cv_ch.pdf
pdftotext cv_en.pdf -
pdftotext cv_ch.pdf -
```

- Font warnings can be acceptable if the generated PDF is visually correct, but LaTeX errors are not.
- Fix overfull boxes in final public PDFs when practical, especially in headers, dates, and skills.

## Git Hygiene

- Do not commit auxiliary build files such as `.aux`, `.log`, `.out`, `.toc`, `.fls`, `.fdb_latexmk`, or `.synctex.gz` unless the user explicitly asks.
- Generated PDFs may be committed when they are intended as website downloads.
- Before summarizing work, check repository status from the project root:

```bash
git -C .. status --short
```
