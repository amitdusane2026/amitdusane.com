# Screenshot capture briefs

> **Licensing was raised, researched and closed on 14 Aug 2026. The site proceeds with cropped screenshots as designed.** The reasoning is recorded in `development-plan.md`; do not reopen it.
>
> **The one rule that is not negotiable: capture only from the Adobe training account, which holds fictitious data.** Never the employer's company account. No account names, no organization names, no identifying data in anything published. That was always the real risk, and it is controlled at the source rather than by editing images afterward.

Running record of every screenshot the site needs, one block per shot. Written while a section is drafted, so capture day is a checklist rather than an act of memory.

**Save to:** `amitdusane-site-complete/static/img/`
**Format:** save PNG. Conversion to WebP happens on the way into the page, from the archived original so there is only one resample.

**Conversion, ImageMagick 7 (installed 14 Aug 2026):**

```
magick ORIGINAL.png -resize 1500x -define webp:lossless=true static/img/NAME.webp
```

Add `-crop x<height>+0+0 +repage` before `-resize` to trim page bleed off the bottom.

**Always lossless, never lossy.** Measured on the first two shots: lossless WebP is 64% smaller than PNG at RMSE 0, pixel for pixel identical. Lossy `-quality 85` is 82% smaller but introduces about 1% error, concentrated on high-contrast edges, which is exactly where interface text lives. Readers zoom into these to read Adobe's labels. The extra ~70KB across a section is not worth softening that.

**`hugo --gc` does not delete a stale file from `public/`.** After changing a format or a filename, remove `public/` and rebuild, or the old copy lingers and every size measurement is wrong.
**Naming:** `aal_module<NN>_section<NN>_ss<N>.png`, lowercase, numbers zero-padded to two digits.

**Before every capture:** browser zoom at 100% (`Ctrl+0`), the same window width every time, Adobe's light theme, and never so narrow that Workspace collapses its left rail.

**Widths are targets after resize, not capture requirements.** Snip a little wider than needed and crop tight. Never upscale: if a shot comes out narrower than the target, leave it and say so.

**Redaction:** every capture comes from a real account. Check for report suite names, client names, and identifiable page or product values before handing the file over.

---

## M14 Analysis Workspace

### §1 Analysis Workspace Overview — **DONE, 2 shots shipped**

**Shipped:** `ss1` the whole screen, `ss2` the Data Dictionary showing all four colors. Both live in the section, zero blur in either.

**Cut deliberately, and the reasoning matters for every later section.** The original list had five. Three were dropped because the section already carries three diagrams, and eight visuals in 3,600 words is clutter:

- **`ss3` panel header** — `ss1` already shows the report suite top right and the schematic labels it. Redundant.
- **`ss4` table with a segment column** — the blue-segment-as-a-column point belongs to §3 Freeform Tables, where it can be taught rather than illustrated. **Banked there.**
- **`ss5` blank project** — the prose does it in one sentence.

**The working rule that came out of it: two screenshots per section is plenty, and a screenshot has to beat the diagram that would otherwise sit in that slot.** Colour was the case that could not be done in text. Layout could have been, and the screenshot only earns its place because the schematic beside it is doing the abstract half.

**Processing, for reference.** Originals are archived unmodified in `screenshot-originals/` in the working directory. Web copies in `static/img/` are resized with `System.Drawing`: `ss1` to 1500px, `ss2` to 1200px with 82px of page bleed trimmed off the bottom. Still PNG, not WebP, because no conversion tooling is installed. `winget install ImageMagick.ImageMagick` when that becomes worth doing.

### §1 original briefs, kept for reference

---

**`aal_module14_section01_ss1.png` — the whole screen**

- **Goes in:** "What you are actually looking at", directly under the schematic diagram, so the map and the territory sit together.
- **Screen:** Workspace, any project with one panel and a populated freeform table.
- **Crop:** the full application area. Menu bar at the top, left rail, one panel with a table. Exclude the browser's own chrome (tabs, address bar).
- **Must show:** the menu bar, the rail with the Components tab active, and one panel containing a header and a table. All four regions visible at once.
- **Redact:** report suite name, and any page or product values that identify a client.
- **Width:** about 1500px.
- **Note:** this is the one full-screen shot in the section and the one that carries the zoom link. Every other shot is a tight crop.

---

**`aal_module14_section01_ss2.png` — the left rail and its four colors**

- **Goes in:** "Four colors, and they are the fastest thing on the screen", under the color table.
- **Screen:** Workspace, left rail, Components tab selected.
- **Crop:** the rail column only, from the three tabs at the top down far enough to include all four component groups.
- **Must show:** the three tabs (Panels, Visualizations, Components) **and** all four color-coded groups in one frame: Dimensions orange, Metrics green, Segments blue, Date Ranges purple.
- **Capture tip:** collapse the four component groups first. Collapsed, their colored headers stack into a short strip and all four fit easily. Expanded, they will not.
- **Redact:** custom component names if any identify a client.
- **Width:** about 800px. It is a narrow column, so do not upscale it.
- **Why it matters:** highest-value shot in the section. The rail is roughly 300px wide natively, so it renders close to full size on a phone.

---

**`aal_module14_section01_ss3.png` — the panel header**

- **Goes in:** "The report suite belongs to the panel, not to the project", after the first paragraph.
- **Screen:** Workspace, the header strip of any panel.
- **Crop:** a horizontal strip of the panel header only. Nothing above it, and none of the table below.
- **Must show:** the panel name on the left, and the report suite selector and the date range calendar sitting together at the **top right**. The position is the entire point of the shot.
- **Redact:** report suite name, or select a generically named suite before capturing.
- **Width:** about 1200px.

---

**`aal_module14_section01_ss4.png` — a finished table with a segment column**

- **Goes in:** the follow-along section, after the code block, as the payoff for the ten steps.
- **Screen:** the table built by the walkthrough: one dimension, one metric, and a segment dropped in as a second column.
- **Crop:** the table only. Header row plus five or six data rows.
- **Must show:** an orange dimension header, a green metric header, and a **blue segment sitting in a column position**. That last one is what makes the color argument concrete.
- **Redact:** page or product values if identifiable.
- **Width:** about 1200px.

---

**`aal_module14_section01_ss5.png` — a blank project (optional)**

- **Goes in:** "A space where the work is analysis", if it is worth it.
- **Shows:** what "blank canvas" actually means, before anything is dragged in.
- **Width:** about 1200px.
- **Skip it** if the section is already carrying enough. Lowest priority of the five.
