# AGENTS.md

This directory contains the LaTeX source files for Youcheng Li's Chinese and English resumes.

## Files

- Chinese resume source: `cv_ch.tex`
- English resume source: `cv_en.tex`
- Chinese generated PDF: `cv_ch.pdf`
- English generated PDF: `cv_en.pdf`

## Template and Compile Requirements

- Both `.tex` files are standalone documents and open directly in the Codex LaTeX editor. Use the built-in compiler for diagnostics after editing; open the edited source for its live PDF preview.
- Each template embeds the original portrait as JPEG data in a PDF special. No external image file is required. Preserve this data when changing text.
- CJK text uses the TeX-provided `gbsn00lp.ttf` font with explicit main, sans, and mono families plus synthetic bold. The templates do not use Font Awesome icons or system-installed Noto fonts. Verify any font replacement in the final rendered PDFs.
- For exported PDFs, use an existing XeLaTeX installation or the already bundled Tectonic runtime. Do not install TeX solely to use the built-in editor.
- With XeLaTeX, compile twice from this directory and fail on errors:

```bash
xelatex -interaction=nonstopmode -halt-on-error cv_ch.tex
xelatex -interaction=nonstopmode -halt-on-error cv_ch.tex
xelatex -interaction=nonstopmode -halt-on-error cv_en.tex
xelatex -interaction=nonstopmode -halt-on-error cv_en.tex
```

- Tectonic automatically runs the necessary passes; invoke the verified existing executable with `cv_ch.tex` and `cv_en.tex`. Its bundled location may change across app updates; do not hardcode a cache path in the repository.
- Both current CVs have two pages and an explicit `2` in the footer. If pagination changes, update the footer total and verify every page.
- The Chinese template was synchronized from the user-confirmed September 28, 2026 CV. Keep the English translation factually synchronized. Do not modify the separate source outside this repository as part of routine website updates.

## Sync Requirements

After compiling resumes intended for the website, sync generated PDFs to the repository `pdf/` directory:

```bash
cp cv_en.pdf ../pdf/youcheng_li_cv.pdf
cp cv_ch.pdf ../pdf/youcheng_li_cv_ch.pdf
```

- `../pdf/youcheng_li_cv.pdf` is the public English CV download.
- `../pdf/youcheng_li_cv_ch.pdf` is the public Chinese CV download.
- If these public paths change, also update `../config/site-config.js`, `../index.html`, all page links, and any related dynamic loader logic.
- Keep the English and Chinese resumes factually synchronized unless the user explicitly wants them to diverge.

## Output Checks

- Check PDF metadata/page count with `pdfinfo`.
- Check text extraction with `pdftotext` when available, or `pypdf` from the bundled Python runtime:

```bash
pdfinfo cv_en.pdf
pdfinfo cv_ch.pdf
pdftotext cv_en.pdf -
pdftotext cv_ch.pdf -
```

- Render every final page with `pdftoppm` and visually inspect alignment, clipping, portrait quality, and CJK glyphs. Confirm each public PDF is byte-for-byte identical to its generated PDF in this directory.
- Font warnings can be acceptable if the generated PDF is visually correct, but LaTeX errors are not.
- Fix overfull boxes in final public PDFs when practical, especially in headers, dates, and skills.

## Git Hygiene

- Do not commit auxiliary build files such as `.aux`, `.log`, `.out`, `.toc`, `.fls`, `.fdb_latexmk`, or `.synctex.gz` unless the user explicitly asks.
- Generated PDFs may be committed when they are intended as website downloads.
- Before summarizing work, check repository status from the project root:

```bash
git -C .. status --short
```
