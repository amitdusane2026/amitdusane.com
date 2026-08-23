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
**Naming (changed 24 Aug 2026):** name the file for **what the picture shows**, not for where it sits. Lowercase, hyphens, no module or section numbers: `adobe-analytics-evar-allocation-expiration.webp`, `adobe-launch-tags-publishing-flow.webp`, `adobe-analytics-amcv-cookie-expiry.webp`.

The old scheme was `aal_module<NN>_section<NN>_ss<N>`, which sorted nicely and told a crawler nothing. A filename is a real ranking signal in image search, and this site is likely to be the only current, privacy-cleaned source of Adobe Analytics interface screenshots at this scale, so the names should carry the words somebody would actually search. Lead with the product where it is not Adobe Analytics itself — `adobe-launch-tags-`, `adobe-experience-platform-`, `adobe-client-data-layer-`.

Rename before publication, never after: once a URL is indexed, changing it costs a redirect. Traceability now comes from the checklist table below and from the fact that each shot appears in exactly one section.

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

**`adobe-analytics-analysis-workspace-interface.png` — the whole screen**

- **Goes in:** "What you are actually looking at", directly under the schematic diagram, so the map and the territory sit together.
- **Screen:** Workspace, any project with one panel and a populated freeform table.
- **Crop:** the full application area. Menu bar at the top, left rail, one panel with a table. Exclude the browser's own chrome (tabs, address bar).
- **Must show:** the menu bar, the rail with the Components tab active, and one panel containing a header and a table. All four regions visible at once.
- **Redact:** report suite name, and any page or product values that identify a client.
- **Width:** about 1500px.
- **Note:** this is the one full-screen shot in the section and the one that carries the zoom link. Every other shot is a tight crop.

---

**`adobe-analytics-workspace-data-dictionary.png` — the left rail and its four colors**

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

---

# Modules 1 to 13 — briefs written 21 August 2026

**32 shots across 12 modules.** Every one is also written into the section itself as a
`shot-pending` box, so the brief sits where the picture will go and can be read in context.
This list is the capture-day checklist; the box in the section is the detail.

**Selection was deliberate and most sections got nothing.** 74 sections were reviewed. A shot
was briefed only where seeing the real interface teaches something the prose and the diagrams
cannot — the precedent is M14 §1, which started with five briefs and shipped two, because a
section already carrying three diagrams does not need more pictures. Sections whose subject has
no Adobe screen at all were skipped outright.

**M9 VISTA Rules has none, on purpose.** VISTA rules are built by Adobe engineering; there is no
customer-facing screen to capture.

**Nine are not Adobe screens.** DevTools and console captures carry the same rules: training or
demo site only, nothing identifying in a URL, a value or a cookie.

| # | Section | File | Screen |
|---|---|---|---|
| 1 | M1 §1 What Is Adobe Analytics | `adobe-experience-cloud-app-switcher` | Experience Cloud app switcher |
| 2 | M1 §5 Account Structure | `adobe-analytics-product-profile-permissions` | Admin Console, product profile permissions |
| 3 | M2 §1 What Are Report Suites | `adobe-analytics-report-suite-manager` | Report Suite Manager list |
| 4 | M2 §3 Virtual Report Suites | ~~dropped~~ | VRS builder — never captured, placeholder removed 23 Aug |
| 5 | M2 §4 Report Suite Settings | `adobe-analytics-report-suite-edit-settings-menu` | Edit Settings menu, fully expanded |
| 6 | M2 §7 Privacy and Data Retention | ~~dropped~~ | Data governance labelling — never captured, placeholder removed 23 Aug |
| 7 | M3 §1 Props | `adobe-analytics-traffic-variables-props` | Traffic Variables list |
| 8 | M3 §2 eVars | `adobe-analytics-evar-allocation-expiration` | **Allocation and expiration dropdowns** |
| 9 | M3 §3 Events | `adobe-analytics-success-event-type-dropdown` | Success Events, the Type dropdown |
| 10 | M4 §2 AppMeasurement | `adobe-analytics-code-manager-appmeasurement` | Code Manager |
| 11 | M4 §2 AppMeasurement | `adobe-analytics-tracking-beacon-devtools` | **DevTools Network, one beacon decoded** |
| 12 | M4 §3 Web SDK | `adobe-experience-platform-datastream-services` | A datastream and its services |
| 13 | M5 §1 What Is a Data Layer | `adobe-analytics-data-layer-console-digitaldata` | **Console, data layer expanded** |
| 14 | M5 §2 ACDL | `adobe-client-data-layer-getstate` | Console, `getState()` |
| 15 | M6 §2 Properties | `adobe-launch-tags-property-overview` | Property navigation |
| 16 | M6 §3 Extensions | `adobe-launch-tags-extension-catalog` | Extension catalog |
| 17 | M6 §4 Data Elements | `adobe-launch-tags-data-element-builder` | Builder with its option checkboxes |
| 18 | M6 §5 Rules | `adobe-launch-tags-rule-events-conditions-actions` | **One rule, all three parts** |
| 19 | M6 §6 Publishing Workflow | `adobe-launch-tags-publishing-flow` | The four columns |
| 20 | M6 §7 Environments | `adobe-launch-tags-embed-code-environment` | Embed code dialog |
| 21 | M7 §3 Server Calls and Billing | ~~dropped~~ | Server Call Usage — never captured, placeholder removed 24 Aug |
| 22 | M7 §5 ECID | `adobe-experience-cloud-id-service-extension` | ECID extension config |
| 23 | M7 §7 First-Party Cookies | `adobe-analytics-amcv-cookie-expiry` | **DevTools, the Expires column** |
| 24 | M8 §2 Conditions and Actions | `adobe-analytics-processing-rules-builder` | Processing Rules builder |
| 25 | M10 §2 Channel Configuration | `adobe-analytics-marketing-channel-manager` | Marketing Channel Manager |
| 26 | M10 §3 Channel Processing Rules | `adobe-analytics-marketing-channel-processing-rules` | The waterfall, numbered |
| 27 | M11 §3 Classification Sets | `adobe-analytics-classification-sets` | A set and its three tabs |
| 28 | M11 §4 Importing | `adobe-analytics-classification-import-schema` | Schema Preview before upload |
| 29 | M11 §5 Rule Builder | `adobe-analytics-classification-rule-builder` | **Test rule set, both panels** |
| 30 | M12 §2 Building Calculated Metrics | `adobe-analytics-calculated-metric-builder` | The canvas with a formula |
| 31 | M13 §2 Segment Containers | `adobe-analytics-segment-containers` | A container nested in a container |
| 32 | M13 §4 Sequential Segments | `adobe-analytics-sequential-segment-builder` | The THEN join and its window |

**Access to confirm before capture day.** Some briefs need entitlements the training account may
not have: a Tags property with the Analytics and ECID extensions installed (shots 15 to 20, 22), a
datastream (12), Classification Sets (27 to 29), Marketing Channel Manager (25, 26), Server Call
Usage (21), and Admin Console access at the product-profile level (2). Amit said to list what is
needed rather than work around it.

**The bolded rows are the ones that carry the most weight.** If capture time runs short, those
eight are the ones to do first: each of them shows a control the section spends a whole heading
arguing about, and which is nearly invisible in the interface.
