# amitdusane.com — Development Plan

## Context

amitdusane.com is a live Hugo site publishing practitioner-level Adobe Analytics content. Section 1 (Web SDK Migration, 13 steps + 24 KB articles) is complete. Section 2 (Adobe Analytics Learning, 21 modules) is roughly half written. The long-term roadmap adds CJA, RTCDP, AJO, AEP fundamentals, mobile WebSDK, certification prep, delivery-document authoring, and eventually a RAG chatbot.

The work ahead is mostly **content production at scale** — 45 unwritten lessons in the current section alone, and six more sections after it. That only works if the voice and formatting conventions are captured as machine-readable rules rather than re-derived by hand each time. This plan front-loads that capture, fixes what is silently broken on the live site, then establishes a repeatable per-lesson production loop.

Exploration confirmed the site has **no Hugo shortcodes and no theme** — every component is raw HTML against a fixed CSS class vocabulary, authored in `.html` files. That constraint shapes everything below.

---

## Verified state of the content

Census run against `content/adobe-analytics-learning/` (FULL = has `description:` front matter, the site's de-facto publish flag; STUB = body is literally "This section is not yet written."):

| # | Module | Lessons | Full | Thin | Stub |
|---|---|---|---|---|---|
| 1 | Adobe Analytics Fundamentals | 5 | 5 | – | – |
| 2 | Report Suites | 8 | 6 | – | **2** |
| 3 | Variables: Props, eVars, Events | 8 | 8 | – | – |
| 4 | Data Collection | 6 | 6 | – | – |
| 5 | Data Layers | 4 | 3 | – | **1** |
| 6 | Adobe Launch (Tags) | 8 | 7 | – | **1** |
| 7 | Tracking Calls | 7 | 6 | – | **1** |
| 8 | Processing Rules | 4 | 4 | – | – |
| 9 | VISTA Rules | 3 | 3 | – | – |
| 10 | Marketing Channels | 6 | 6 | – | – |
| 11 | Classifications | 6 | 6 | – | – |
| 12 | Calculated Metrics | 3 | – | 1 | 2 |
| 13 | Segments | 6 | 6 | – | – |
| 14 | Analysis Workspace | 10 | – | 6 | 4 |
| 15 | Attribution Models | 4 | – | – | 4 |
| 16 | Data Warehouse | 4 | – | 4 | – |
| 17 | Data Feeds | 4 | – | 4 | – |
| 18 | Activity Map | 4 | – | 4 | – |
| 19 | Solution Design Reference | 6 | – | – | 6 |
| 20 | Testing and Debugging | 5 | – | 5 | – |
| 21 | Adobe Analytics and CJA | 5 | – | 2 | 3 |

**Totals: 116 lessons — 66 written, 45 to write in modules 12/14–21, plus 5 orphan stubs inside otherwise-complete modules** (2.6 Bot Filtering, 2.7 Privacy & Data Retention, 5.4 Data Layer Design, 6.8 Consent & Tag Management, 7.5 Experience Cloud ID).

Module 13 (Segments) was written ahead of order, so the true count is 12 modules done, 9 remaining.

---

## Phase 0 — Baseline and rule capture

Nothing else starts until this is done. It is the cheapest phase and it de-risks every phase after it.

**0.1 Version control.** The site is live with no git repository. `git init`, `.gitignore` for `public/` and `.hugo_build.lock`, commit the current state as the rollback point.

**0.2 Ingest your two documents.** Save the tracker and the formatting-rules doc to `_docs/` in the repo. I read both and reconcile them against the exploration findings, then report any conflicts — places where the written rule and the shipped code disagree. Those conflicts are the interesting part; they are where the site has drifted from its own spec.

**0.3 Write `CLAUDE.md` at the project root.** This is the deliverable of Phase 0 and the thing that makes every later phase fast. It loads automatically in every future session. Contents:

- **Voice rules.** Second person only, zero first person (measured: 1,756 "you" / 0 "I" across the learning section — the only "I" on the entire site is `content/about.html`). Contraction policy by era: `foundations/variables/` and `web-sdk-migration/` use them, the July 2026 modules (Classifications, Marketing Channels, Segments) are near contraction-free. War-story signposting without first person — "This is the one that catches experienced practitioners", "the story everyone learns the hard way", "losing days to it", generic actor + future-tense failure + organisational consequence. The recurring theme word is *silence*: things break without telling you.
- **Structural rules.** No H1/H2 in body content — the layout supplies them. A lesson is a flat stack of `<h3 class="subsec-title">` sections. Untitled opener (1–3 paragraphs, continuity recap or scenario), body, final h3 as synthesis + named handoff to the next lesson, then `path-box`, then `ref-box`. Editorial heading wording, not label wording.
- **Component vocabulary.** The full class catalogue with required HTML structure: `warn-box`/`warn-hdr`, `info-box`/`info-hdr`, `pro-tip`/`pro-tip-hdr`, `path-box`/`path-title`/`path-ico`, `ref-box`/`ref-title`, `tbl-wrap` (wrapper is mandatory), `code-block`/`code-hdr`/`code-lang`/`code-copy` with `onclick="copyCode(this)"`, `diagram-box`/`diagram-title`/`diagram-content`, `flow-horizontal`/`flow-step`/`flow-arrow`, `cards`/`card`, `comparison-grid`, plus the migration-world set (`narrative`, `why-row`, `actionblock`/`abh`/`astep`, `call mistake|check|margin|danger`, `cite`, `khook`, `arch`).
- **Front matter contract** per content type (`category`, `module`, `lesson`, `step`, `kb`, `ref`, `glossary`), including the three non-obvious rules below.
- **Three traps to never violate:**
  1. `description:` is the site's publish flag. `wherefits.html:77` and `homemap.html:56` count lessons that have one; without it a lesson renders dimmed and unclickable in both maps.
  2. New modules must be added to the correct `modules = [...]` array in `hugo.toml` `[params.phases]`. Miss it and the module appears in the left nav but vanishes from both maps, with no build error.
  3. `lesson/single.html:9` regex-matches the exact string `<div class="ref-box">` to auto-inject the doc-note. Any variation — single quotes, an extra class, extra whitespace — silently breaks it.
- **New content must be `.html`, not `.md`** — see Phase 1.

**0.4 Sanity-check the build.** `hugo server` locally, confirm the site builds clean before we change anything.

---

## Phase 1 — Fix what is silently broken

Small, contained, no content risk. Ships in one sitting.

**1.1 Restore the lost category intro copy.** All five category landing pages are dropping their hand-written intro paragraphs. `hugo.toml` has no `[markup.goldmark.renderer]` block, so `unsafe` defaults to `false`, and the raw `<p>` tags in the five `_index.md` files are stripped. Verified in the built output — `public/adobe-analytics-learning/analyze/index.html:690-691` contains two `<!-- raw HTML omitted -->` comments where the copy should be.

Fix: rename the five files to `_index.html`.
- `content/adobe-analytics-learning/foundations/_index.md`
- `content/adobe-analytics-learning/collect/_index.md`
- `content/adobe-analytics-learning/shape/_index.md`
- `content/adobe-analytics-learning/analyze/_index.md`
- `content/adobe-analytics-learning/deliver/_index.md`

Chosen over setting `unsafe = true` because it changes nothing globally and matches the rest of the site, which is already `.html` throughout. Also rename `content/_index.md`, `content/web-sdk-migration/_index.md`, and `content/web-sdk-migration/kb/_index.md` only if they contain raw HTML — check first.

**1.2 Verify.** Rebuild, confirm zero `raw HTML omitted` in `public/`, and eyeball all five category pages.

---

## Phase 2 — First content batch: the 5 orphan stubs

**Recommended first target** (subject to what your tracker says — it may already sequence these differently, in which case the tracker wins).

Rationale: these five sit inside modules 1–11, which you consider complete. They are live right now, and each renders "This section is not yet written." Each is a single lesson against an already-proven module with established neighbours, so the voice calibration loop is short and cheap. Getting these done makes the finished half genuinely finished.

| Lesson | File |
|---|---|
| 2.6 Bot Filtering | `content/adobe-analytics-learning/foundations/report-suites/06-bot-filtering.html` |
| 2.7 Privacy & Data Retention | `.../foundations/report-suites/07-privacy-data-retention.html` |
| 5.4 Data Layer Design | `.../collect/data-layers/04-data-layer-design.html` |
| 6.8 Consent & Tag Management | `.../collect/adobe-launch-tags/08-consent-and-tag-management.html` |
| 7.5 Experience Cloud ID (ECID) | `.../collect/tracking-calls/05-experience-cloud-id-ecid.html` |

Note 2.6 and 2.7 already have `description:` written in their front matter — the intent was captured, only the body is missing. Module 6's closer explicitly hands off to 6.8, so that gap is visible to any reader who finishes the module.

**We write lesson 1 of these five first and stop.** You review it against your own voice before I touch the other four. That single review is the calibration gate for all 45 lessons after it.

---

## Phase 3 — Content production loop

The repeatable process, run per lesson, once Phase 2 has calibrated it:

1. **You dump notes** — the gotchas, the client scars, what Adobe's docs get wrong, the thing that cost someone a week. Rough and unstructured is fine; that is the raw material only you have.
2. **I propose the h3 skeleton** — section headings in your editorial style, plus which component goes where (which claim earns a `warn-box`, where the `diagram-box` lands, what the `code-lang` label reads). Short, quick to approve or reshape.
3. **I write the full lesson** — complete `.html` file, correct front matter, correct component markup, opener and closer following the module-anatomy pattern, `path-box` and `ref-box` in place.
4. **Verify** — `hugo server`, check the lesson renders, appears in the left nav, is no longer dimmed in the pocket map and home map, prev/next works, print output is clean.
5. **You edit for accuracy**, I apply corrections.

Module order after Phase 2, unless the tracker says otherwise: **12 → 14 → 15 → 21 → 20 → 19 → 16 → 17 → 18**. Reasoning: 12 makes modules 1–14 contiguous once 14 lands; 14 (Analysis Workspace) is the biggest search draw; 15 and 19 are entirely empty so they need the most work; 16/17/18 are thin but coherent and are the cheapest to upgrade, so they make good filler between heavy modules.

Diagrams are hand-authored inline SVG with `role="img"` and a full-sentence `aria-label`, using `var(--token, #hexfallback)` pairs so they theme correctly — matching the existing convention exactly.

---

## Phase 4 — Learning-world search

Deferred until the learning section has enough written content to make indexing worthwhile. Indexing a half-empty section produces bad results and teaches users the search is useless.

The button and its `/` keyboard hint already render at `baseof.html:71-74`; nothing is wired. `world-learning.js:3` documents it as intentional — "Search wiring lands in a later phase (L6)". Work required:

- `layouts/index.json:2` — widen or drop the `where .Site.RegularPages "Section" "web-sdk-migration"` filter, and derive badges for `module`, `lesson`, and `glossary` types.
- `layouts/_default/baseof.html:150-160` — move the `window.SEARCH_INDEX` assignment and the `search.js` include out of the migration-only `$mig` branch.
- Add the search overlay markup to the learning world and style `.sbadge.lesson` / `.sbadge.module` / `.sbadge.glossary` in `world-learning.css` (only `.step` and `.kb` are styled today, in `world-shell.css:384-385`).
- Wire `#lSearchBtn` in `world-learning.js`.

`search.js` itself needs no changes — its scoring and keyboard handling are world-agnostic.

---

## Phase 5 — Hygiene

Zero user-visible value, so it goes last, but it removes traps for future sections.

- **Derive the hardcoded stats.** `layouts/web-sdk-migration/list.html:10-12` hardcodes 13 steps / 24 KB topics / 42 sources. All three are correct today; the first two should be `{{ len (where .Site.RegularPages "Type" "step") }}` and the KB equivalent. `step/single.html:4` already derives its count correctly — follow that pattern.
- **Extract `partials/logo.html`.** The monogram SVG is copy-pasted in seven places (`baseof.html:65,123,138`, `adobe-analytics-learning/list.html:4`, `category/list.html:4`, `module/list.html:2`, `glossary/single.html:2`).
- **Delete dead code** after confirming it is unreferenced: `static/guide.css`, `static/theme.js`, `layouts/partials/header.html`, `layouts/partials/footer.html`.
- **Fix or remove mis-nested config.** `brandColor` and `accentColor` sit under `[services.googleAnalytics]` in `hugo.toml`, so `.Site.Params.brandColor` does not resolve. Either move them under `[params]` or delete them.
- **`[menu.main]`** is defined but never rendered — no template reads `.Site.Menus`. Remove or wire it.
- **Update the stale comment** at `world-learning.js:15` ("5 categories, 21 modules and 116 sections").
- **Author bio is duplicated in three places** with a "16+ years" figure that needs annual maintenance: `baseof.html:139-143`, `index.html:4-10`, `content/about.html`.

---

## Phase 6 — Groundwork for the next section (CJA)

Not started in this plan, but flagged now because one decision in Phase 5 affects it.

A "world" here is a self-contained sub-site chosen purely by URL prefix, with its own stylesheet, JS, shell, and print document. Adding CJA means a new prefix branch in both `head.html:37` and `baseof.html:4-6` — an if/else chain that grows linearly and will be eight branches deep by the time all six planned sections exist. Worth converting to a `.Section`-keyed lookup or a `world` front-matter param before the third world, not after the sixth.

**The real blocker:** `wherefits.html:12` and `homemap.html:10` read `.Site.Params.phases` globally and unscoped. A second world using those partials inherits Adobe Analytics' phase structure. `params.phases` needs to become `params.worlds.<world>.phases`, with the partials taking a world argument. This is the single structural change that must happen before CJA starts, and it is cheap to do now and expensive to retrofit later.

Cheapest path for a new world's CSS: copy `world-learning.css` and change only the `:root` and `[data-theme="dark"]` token blocks (lines 12–23). Every content component is already token-driven, so the entire authoring vocabulary carries over unchanged.

---

## Verification

Per phase:

- **Phase 0/1:** `hugo server` builds clean; `grep -rc "raw HTML omitted" public/` returns zero; all five category pages show their intro copy.
- **Phase 2/3, per lesson:** page renders at its slug URL; appears in the left sidebar under the right module; is no longer `.soon`-dimmed in the pocket map and the home map; prev/next links resolve in both directions across the module boundary; the `ref-box` triggers the auto-injected doc-note; print preview (Ctrl-P) shows the lesson with the branded header and no split components; light and dark themes both render correctly.
- **Phase 4:** search returns learning results with correct badges; `/` and Cmd/Ctrl-K open the overlay; arrow keys and Enter navigate.
- **Phase 5:** derived counts match the previous hardcoded values; every page still renders the logo; no console errors after the dead-file deletions.

Every phase ends with a git commit, so any phase can be reverted independently.

---

## Open items

- Your tracker may sequence the remaining work differently from Phase 2/3 above. The tracker wins; I will reconcile and revise before writing anything.
- Your formatting-rules document may contradict what the shipped code does. I will report those conflicts rather than silently pick one.
