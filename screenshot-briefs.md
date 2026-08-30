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

---

## M15 Attribution Models — briefed 25 Aug 2026, 6 shots, none captured

Six placeholders sit in the content as `shot-box shot-pending` blocks, each carrying its own
brief. Every one of them needs a report suite with a conversion metric and a multi-touch
dimension; the Adobe training account should cover all six with no additional entitlement, since
attribution is a Workspace feature rather than a licensed add-on.

**Two of the six are the ones that matter.** Shot 33 is the only screen in the module that shows
the three controls together, and a reader cannot act on any of these four sections until they
have found it. Shot 34 is the evidence for the module's central claim, that the disagreement
between models is the finding, which is unconvincing in prose and immediate in a picture.

| # | Section | File | Screen |
|---|---|---|---|
| 33 | M15 §1 What Is Attribution | `adobe-analytics-attribution-column-settings` | **Column settings: model, container, window** |
| 34 | M15 §2 Models Compared | `adobe-analytics-attribution-panel-model-comparison` | **Attribution panel, three models at once** |
| 35 | M15 §2 Models Compared | `adobe-analytics-attribution-overlap-diagram` | The overlap Venn from the panel |
| 36 | M15 §3 Lookback Windows | `adobe-analytics-attribution-none-row` | A large None row beside real channels |
| 37 | M15 §3 Lookback Windows | `adobe-analytics-attribution-lookback-window-options` | The window drop-down, open, with the container above it |
| 38 | M15 §4 Choosing a Model | `adobe-analytics-calculated-metric-attribution-settings` | A metric named for its own model |

**Setup needed before capture day.** Shots 34 and 35 need a report suite where journeys actually
contain several touch points, or the panel builds and shows almost nothing; the training account
should be checked for this before the session rather than during it. Shot 36 needs a dimension
and window combination that produces a visibly large None row, which is easiest to force by
setting a deliberately short lookback.

**Naming note.** All six lead with `adobe-analytics-attribution-` except 38, which leads with the
component it shows. Attribution is the search term in five of them and the calculated metric
builder is the search term in the sixth.

---

## M16 Data Warehouse and M17 Data Feeds — briefed 26 Aug 2026, 5 shots, none captured

Fewer shots than the modules before them, on purpose. Both modules are about a
file rather than a screen, and three of their sections have no Adobe interface to
photograph at all. The briefs below are only where seeing the real screen teaches
something the prose cannot.

**Two of these need no Adobe entitlement beyond a report suite**, but shot 41
needs a feed that has actually delivered, and shot 43 needs a real delivered
file rather than an Adobe screen.

| # | Section | File | Screen |
|---|---|---|---|
| 39 | M16 §1 Data Warehouse Overview | `adobe-analytics-low-traffic-row` | **A large Low Traffic row beside real values** |
| 40 | M16 §2 Creating Requests | `adobe-analytics-data-warehouse-build-report` | Build your report, with a breakdown indented |
| 41 | M16 §3 Delivery Options | `adobe-analytics-data-warehouse-report-options` | The three tick boxes that keep a pipeline honest |
| 42 | M17 §2 Feed Configuration | `adobe-analytics-data-feed-column-selection` | Column selection and the template control |
| 43 | M17 §3 Data Feed Contents | `adobe-analytics-data-feed-post-columns` | **A raw column and its post_ column on one row** |

**Shot 39 is the most important of the five.** The whole Data Warehouse module
exists because of that row, and a reader who has never noticed it does not know
they have the problem. It needs a report suite with a genuinely high cardinality
dimension, so the training account may need a busy month chosen deliberately.

**Shot 43 is not an Adobe screen.** It is a real data feed row displayed with its
column names, in a terminal, editor or spreadsheet. It needs a delivered file to
exist, and it needs a row where a raw column and its `post_` counterpart visibly
differ, which usually means finding a hit where an eVar persisted from an earlier
hit. Choose a row with harmless values rather than blurring anything; the visitor
ID should not be a real production identifier.

**Nothing is briefed for M16 §4, M17 §1 or M17 §4.** M16 §4 and M17 §4 are
judgment and arithmetic with no screen behind them. M17 §1 carries the request
to row figure, which does that section's teaching better than a screenshot of a
text file would.

---

## M18 Activity Map — briefed 26 Aug 2026, 2 shots, none captured

Only two, and both are in the middle sections. §1 carries the click-to-dimensions
figure, which teaches that section better than a picture would, and §4 is
judgment with no Adobe screen behind it.

| # | Section | File | Screen |
|---|---|---|---|
| 44 | M18 §2 Implementation and Setup | `adobe-analytics-activity-map-link-dimension` | A ranked link list full of unusable names |
| 45 | M18 §3 Using Activity Map | `adobe-analytics-activity-map-overlay` | **The overlay drawn on a live page** |

**Shot 45 needs care about which site is on screen.** It is the only brief on the
site that photographs a rendered web page rather than an Adobe interface, so it
must be the Adobe demo or training property. No customer page, and no page that
could be identified from its layout.

**Shot 44 wants a genuinely messy report**, not a tidy one. The section opens on
a report where the top link is called "Learn more" with 90,000 clicks. If the
training account's data is too clean to show that, a real pattern from any site
with repeated generic link text will do, provided the values are not identifying.

---

## Capture day: all 13 outstanding shots, grouped by where you have to be

Modules 15 to 18 are content-reviewed and signed off by Amit (26 Aug 2026).
**Screenshots are the only thing blocking QA on all sixteen sections.**

The per-shot briefs stay where they are, in the page files and in the module
sections above. This list exists so capture day is one pass per screen rather
than thirteen trips around the interface. Full brief for each is in its own
`shot-pending` block in the content file named.

### Group A — Analysis Workspace, freeform tables (5 shots, one sitting)

All five are a freeform table plus, in two cases, the column settings panel
opened on top of it. Build one table and most of these fall out of it.

| # | File | Needs |
|---|---|---|
| 33 | `adobe-analytics-attribution-column-settings` | Column settings open, non-default attribution ticked, all three controls visible |
| 37 | `adobe-analytics-attribution-lookback-window-options` | Same panel, lookback drop-down open, container visible above it |
| 36 | `adobe-analytics-attribution-none-row` | A visibly large None row beside real channels |
| 39 | `adobe-analytics-low-traffic-row` | A visibly large Low Traffic row on a high cardinality dimension |
| 44 | `adobe-analytics-activity-map-link-dimension` | Activity Map Link ranked, with generic or blank names near the top |

**Set up before this sitting.** Shot 36 wants a short lookback so None is large;
force it rather than hoping. Shot 39 wants a dimension with genuinely high
cardinality and may need a busy month chosen deliberately. Shot 44 wants a messy
report, not a tidy one, so pick a period where generic link text is visible.

### Group B — Analysis Workspace, Attribution panel (2 shots, one sitting)

Both come from a single built panel, so build it once and take both.

| # | File | Needs |
|---|---|---|
| 34 | `adobe-analytics-attribution-panel-model-comparison` | Three models selected, rows ranking differently between them |
| 35 | `adobe-analytics-attribution-overlap-diagram` | The Venn overlap, three items, intersections labelled |

**Set up before this sitting.** The panel needs a report suite where journeys
really do contain several touch points. On thin data it builds and shows almost
nothing, and there is no way to fake it at capture time. Worth checking the
training account for this before the session rather than during it.

### Group C — Components, calculated metric builder (1 shot)

| # | File | Needs |
|---|---|---|
| 38 | `adobe-analytics-calculated-metric-attribution-settings` | Attribution set on a metric inside the definition, title and description filled in |

The title should read like `Orders, U-shaped, 60 day, Visitor` and the
description should be filled, because the section's argument is that the name and
description are where a decision survives its author.

### Group D — Tools, Data Warehouse (2 shots, one sitting)

| # | File | Needs |
|---|---|---|
| 40 | `adobe-analytics-data-warehouse-build-report` | Build your report tab, a breakdown indented under a dimension, a segment applied |
| 41 | `adobe-analytics-data-warehouse-report-options` | Report options tab with the three tick boxes on: date range in name, manifest, empty file |

Both are tabs of the same request form, so build one request and move between
tabs rather than starting twice.

### Group E — Admin, Data feeds (1 shot)

| # | File | Needs |
|---|---|---|
| 42 | `adobe-analytics-data-feed-column-selection` | Data structure section, columns selected including `post_` ones, template control visible |

### Group F — Outside Adobe (2 shots, and these are the awkward ones)

| # | File | Needs |
|---|---|---|
| 43 | `adobe-analytics-data-feed-post-columns` | A real `hit_data.tsv` row shown with its column names, in a terminal, editor or spreadsheet |
| 45 | `adobe-analytics-activity-map-overlay` | The Activity Map extension running over a live page |

**43 needs a delivered feed file to exist**, and a row where a raw column and its
`post_` counterpart visibly differ, which usually means finding a hit where an
eVar persisted from an earlier hit. Choose a row with harmless values rather than
blurring anything, and do not use a real production visitor ID.

**45 is the only brief on the site that photographs a rendered web page.** It
must be the Adobe demo or training property. No customer page, and no page
identifiable from its layout.

### The two that carry the most weight

If capture time runs short, **33 and 45** are the ones to do first. Shot 33 is
the only screen showing the three attribution controls together, and a reader
cannot act on any of module 15 until they have found it. Shot 45 is the version
of Activity Map everybody has heard of and many readers have never seen.

### Naming, as a reminder

Save as PNG, archive the original under the same name in `screenshot-originals/`
outside the site folder, then convert into `static/img/` as lossless WebP. The
file names above are final and already referenced in the content, so they must
not change.

---

## M15 capture, 30 Aug 2026 — 5 of 6 shipped

Amit captured and supplied five of the six M15 shots. All five are blurred,
archived and live in the sections.

| # | File | Status |
|---|---|---|
| 33 | `adobe-analytics-attribution-column-settings` | shipped |
| 34 | `adobe-analytics-attribution-panel-model-comparison` | shipped |
| 35 | `adobe-analytics-attribution-overlap-diagram` | shipped |
| 36 | `adobe-analytics-attribution-none-row` | **not captured, placeholder removed** |
| 37 | `adobe-analytics-attribution-lookback-window-options` | shipped |
| 38 | `adobe-analytics-calculated-metric-attribution-settings` | shipped |

**Shot 36 could not be reproduced.** It needed a report suite whose data
produces a visibly large None row, and the training account did not have it. The
`shot-pending` block has been removed from M15 §3 rather than left in the file,
because a placeholder cannot ship and it would block the merge to `main`. The
section's prose on the None row is unaffected and stands on its own. If a suitable
report suite turns up later, the brief above is recoverable from git history.

**Shot 38 differs from its brief and the note was rewritten to match.** The brief
asked for the title and description fields filled in, to make the naming argument.
The capture shows the definition canvas and the attribution dialog instead, which
carries a better point: the gear sits on the metric *inside* the definition, so a
model can be buried where no column header reveals it. The note now says that.

### Blurring applied

Report suite name, metric names and dimension values in all five, at Amit's
instruction, even though the training account values are generic. Regions were
identified by reading each image, blurred with ImageMagick at `-blur 0x18`, and
each result was re-read to confirm before conversion.

**What was deliberately left sharp**, because it is the teaching content: model
names, the Model / Container / Lookback window controls, the open lookback list,
the numbers and percentages in the comparison table, the overlap counts, and the
"Use non-default attribution model" tick box.

**One thing to know for the next capture.** The chart axis labels in the
Attribution panel are dimension values too, and they sit well away from the table.
They were missed on the first pass and caught on review. Check axis labels, not
just table cells.

**Archived originals are the blurred versions**, matching the existing convention
in `screenshot-originals/`, which is tracked in git. Raw captures are not kept.

---

## M16 and M17 partial capture, 30 Aug 2026

Amit supplied two Data Warehouse shots and one Data Feeds shot, already blurred
by him. All three are live.

| # | File | Status |
|---|---|---|
| 39 | `adobe-analytics-low-traffic-row` | **not captured, placeholder removed** |
| 40 | `adobe-analytics-data-warehouse-build-report` | shipped |
| 41 | `adobe-analytics-data-warehouse-report-options` | shipped |
| 42 | `adobe-analytics-data-feed-column-selection` | shipped |

**No extra blurring was needed and none was applied.** Amit had already blurred
the report suite selector and the segment name in all three. Everything else
visible is Adobe's own out-of-the-box component naming: Page Views, Cart
Additions, Checkouts, Mobile Device Type, Browser, Page, and feed column names
like `accept_language` and `browser_height`. Those strings are identical in every
Adobe implementation and carry no trace of any account. Blurring them would have
destroyed the point of each shot: the breakdown indent in 40, the three toggles
in 41, and the 1187-against-2 column ratio in 42.

**Shot 39 could not be reproduced**, same reason as the M15 None row shot: it
needs a report suite whose data yields a visibly large Low Traffic row. Its
placeholder is removed. The prose in M16 §1 is unaffected.

**Shot 42 differs from its brief and its note was rewritten.** The brief asked
for `post_` columns among the selected list. The capture shows `browser` and
`browser_height` instead, but it does show the template controls, which is the
part the section actually argues about, so the note leads on the 1187 to 2 ratio
and on Save as template.

### Metadata, from Amit's instruction on 30 Aug 2026

**Every published image and every archived original is now metadata-free**, and
this is now the standing rule.

The audit found something worth recording. Amit's own captures were clean. The
contamination came from **my own ImageMagick blur step**: writing a PNG makes
ImageMagick add a `tEXt` chunk holding `date:create` and `date:timestamp`, plus a
`tIME` chunk. `-strip` removes the `tEXt` but **ImageMagick writes a fresh `tIME`
on every PNG write**, so `-strip` alone is not enough.

The working recipe, for any PNG written from now on:

```
magick IN.png -strip -define png:exclude-chunk=tEXt,zTXt,iTXt,tIME,eXIf,date OUT.png
```

WebP output takes `-strip` and comes out clean.

Verified across the whole library: 51 published WebP files carry no EXIF, XMP or
ICC, and 51 archived PNGs carry no `tEXt`, `iTXt`, `zTXt`, `eXIf` or `tIME`. Four
older archived originals from earlier sessions were carrying chunks and have been
stripped as well.

**Note the `date:create` trap when auditing.** `magick identify -verbose` prints
`date:create` and `date:modify` for every file, and those are read from the
filesystem rather than from the file. They are not embedded metadata and they
reappear on any copy. Scan the bytes for chunk names instead of trusting that
output.
