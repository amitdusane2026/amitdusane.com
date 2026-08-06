# amitdusane.com — Development Plan (rev. 2, after document ingest)

## Context

amitdusane.com is a live Hugo site publishing practitioner-level Adobe Analytics content. Section 1 (Web SDK Migration) is complete. Section 2 (Adobe Analytics Learning, 21 modules / 116 sections) is 66 sections written. The roadmap after it: CJA, RTCDP, AJO, AEP fundamentals, mobile WebSDK, certification prep, delivery-document authoring, and eventually a RAG chatbot.

The work is content production at scale, governed by four supporting documents that already exist in the parent folder. This revision folds those documents in. **They are authoritative; this plan defers to them.**

| Document | Role |
|---|---|
| `structure-map.html` (v6, 19 Jul) | **Naming and taxonomy authority.** Every module/section title, seotitle, slug, URL change, and the curriculum arc. |
| `content-component-rulebook.html` (15 Jul) | **Formatting and voice authority.** Components, tiers, the five governing rules, hard technical constraints, the 20-item section checklist. |
| `QA_Rulebook.html` (v1.0) | **Delivery gate.** 13-point checklist, binary PASS/FAILED. |
| `completion-tracker.tsv` (27 Jul) | **Per-page status.** 144 rows, SEO/content/QA columns. |

Site folder holds website files only; supporting documents live in the parent folder.

---

## Reconciliation: the documents against the shipped code

Everything below was verified against the actual files and the built output, not assumed.

**The tracker matches the code exactly.** The tracker's "Content created" column and the site's `description:` front-matter flag agree on all 144 pages: 66 sections created, 50 pending. No drift.

**All 50 pending sections are written fresh.** An earlier revision of this plan split them into 24 empty stubs and 26 carrying thin legacy prose, and treated those as different sizes of job. Amit has ruled that distinction out: the stubs and the legacy bodies were both written early to fill gaps, without much thought, and he does not want energy spent reading them, mining them for value, or adapting them.

So the existing body of a pending section is never opened. The tracker's `Content created?` column is the only authority on what needs writing, and every one of the 50 is the same job: read the neighbouring completed sections for continuity, take naming from the structure map, and write with a fresh mind.

**A work item neither of us had listed: 12 written sections are not QA'd.** The tracker shows Modules 11 (Classifications) and 13 (Segments), all 12 sections, as created but not QA-approved. They are the two most recent modules. Under the QA Rulebook they cannot be called done.

**The structure map's status line is stale.** It says "nothing has been built" and "modules 1 to 19". The restructure has in fact been built: `/deliver/` exists, the data-layers module exists, `[params.phases]` already lists modules 1 to 21. Treat the map as authoritative for *naming*, not for *status*.

**The structure map hands us most of the naming for free.** It prescribes exact `title` and `seotitle` pairs for 35 of the pending sections. Only three need to be coined: M15 §4 Choosing an Attribution Model, M21 §1 What Is Customer Journey Analytics, M21 §5 What to Learn Next.

### Rulebook compliance audit of the 66 written sections

Run against the rulebook's own hard rules. The discipline is high:

| Rule | Result |
|---|---|
| Zero em-dashes or en-dashes | **0 occurrences** across all content |
| Every table wrapped in `tbl-wrap` | **100%**, no bare tables |
| No `code-block` nested inside a box | **0 violations** |
| SVG colour in `style` attr with hex fallback | **0 violations** in the learning world |
| `⚠️` carries the U+FE0F variation selector | **100%**, no bare glyphs |
| Exactly one `ref-box` per section | **66 of 66** |
| No first person outside quoted speech | **Clean.** All 17 hits are quoted speech or `Ctrl+Shift+I` |
| `seotitle` present on every written section | **100%** |
| `description` 110–160 chars | 93 pass, **3 outliers**, all on landing pages |

The three outliers: `collect/_index.html` (180), `deliver/_index.html` (187), `collect/data-layers/_index.md` (94).

### Conflicts to resolve

1. **The rulebook's front-matter examples are stale.** They omit `seotitle` and `tagline`, which the shipped code and the structure map both require. The example also numbers Classifications as module 10; it is 11. The rulebook's own footer says the stylesheet wins when documents disagree; the same principle applies here.
2. **The structure map has a stale cross-reference** — M03 §8 says "SDR content moved out to M20"; SDR is M19.
3. **Two content TODOs sit in the structure map and are not in the tracker**: M07 §6 Cross-Domain Tracking "needs a trim, it explains ECID today", and M17 §4 Processing Data Feeds "gains the surface API mention". The first becomes live work the moment M07 §5 ECID is written.

---

## Completed

**Phase 0.1 — git baseline.** `git init`, `.gitignore` for `public/` and `.hugo_build.lock`, 227 files committed. Three commits so far.

**Phase 0.4 — baseline build verified.** Hugo v0.123.7 extended, 219 pages, clean.

**Phase 1.1 — category intro copy restored.** All five category landing pages were silently dropping their hand-written intro paragraphs: no `[markup.goldmark.renderer]` block in `hugo.toml`, so `unsafe` defaulted to false and Goldmark stripped raw HTML from `.md`. Renamed the five `_index.md` to `_index.html`. Verified by full before/after build diff: exactly those 5 pages changed, page count unchanged.

**Phase 0.2 — documents ingested.** Reconciliation above.

---

## Phase 0.3 — Write `CLAUDE.md` (next)

A single project-root file that loads automatically every session, so the rules never have to be re-derived. It **points to** the four documents rather than restating them, and captures only what they leave implicit:

- **Document precedence:** structure map for naming, rulebook for form, QA rulebook for the gate, tracker for status. Where a document and the shipped code disagree, the code wins and the document gets flagged.
- **The build command:** `hugo --gc`. **Never `--minify`** — it destroys inline SVG text elements. Assert the page count after every build; a silent build failure once dropped 103 pages while reporting success.
- **The three silent-failure traps** found in the code and not written down anywhere: `description:` doubles as the maps' publish flag (`wherefits.html:77`, `homemap.html:56`); a new module must be added to `[params.phases]` in `hugo.toml` or it vanishes from both maps with no error; `lesson/single.html:9` regex-matches the literal string `<div class="ref-box">` to inject the doc-note, so any variation silently breaks it.
- **Voice specifics measured from the corpus**, which the rulebook states as principle but not as pattern: the war-story construction (generic actor, future-tense failure, organisational consequence, never first person); the contraction split by era (the July 2026 modules are near contraction-free); the flat `h3.subsec-title` structure with no H1/H2 in body; the closing-section convention (synthesis plus named handoff).
- **New content is `.html`, never `.md`.**

---

## Phase 2 — The orphan sections

The structure map's own "New sections to write" table opens with exactly the five sections that sit inside modules 1–11, the half of the curriculum considered complete. They are live right now showing "This section is not yet written."

| Section | File |
|---|---|
| M02 §6 Bot Filtering | `foundations/report-suites/06-bot-filtering.html` |
| M02 §7 Privacy and Data Retention | `foundations/report-suites/07-privacy-data-retention.html` |
| M05 §4 Data Layer Design | `collect/data-layers/04-data-layer-design.html` |
| M06 §8 Consent and Tag Management | `collect/adobe-launch-tags/08-consent-and-tag-management.html` |
| M07 §5 Experience Cloud ID (ECID) | `collect/tracking-calls/05-experience-cloud-id-ecid.html` |

Titles and seotitles for all five are already prescribed by the structure map. M02 §6 and §7 already have their `description:` written, so their intent is captured; only the body is missing.

**Writing M07 §5 triggers the M07 §6 trim** — Cross-Domain Tracking currently explains ECID, which is why §5 was placed before it. That edit ships in the same batch.

**We write one section first and stop** for your review. That is the voice calibration gate for everything after.

---

## Phase 3 — Production loop

Per section, repeatable:

1. **You dump notes** — the gotchas, the scars, what the docs get wrong.
2. **I propose the h3 skeleton** plus which component carries which claim, judged against the rulebook's tiers: `ref-box` mandatory and last; `path-box` if and only if the subject has a screen; `warn-box` only for irreversible, expensive, or silent failures, plus every perishable fact in a dated snapshot; `pro-tip` and `info-box` earned, never decorative.
3. **I write the full section** — `.html`, front matter per the structure map's prescribed title/seotitle, `description` 110–160 characters written as a promise not a summary, `lastmod` set manually and never in the future against a UTC clock.
4. **Verify** — `hugo --gc`, assert page count, then the QA Rulebook's 13 points and the rulebook's 20-item section checklist.
5. **You edit for accuracy**, I apply corrections.

**Order after the 4 remaining orphans**, following the structure map's arc, one module at a time and complete before moving on:

M12 (3) → M14 (10) → M15 (4) → M16 (4) → M17 (4) → M18 (4) → M19 (6) → M20 (5) → M21 (5)

Finishing M12 makes modules 1 to 13 a contiguous run with no gaps, which is the first point at which half the curriculum reads end to end.

M19 (SDR, 6 sections, all new) is the largest single piece and doubles as the prototype for your later "how to create a delivery document" section.

---

## Phase 4 — QA the 12 unQA'd sections

Modules 11 and 13 against the QA Rulebook: 13 checks, binary verdict, reported in the rulebook's own format. Independent of writing, so it can slot in whenever you want a break from drafting.

---

## Phase 5 — Small corrections

- Three `description` outliers: `collect/_index.html` (180 chars), `deliver/_index.html` (187), `collect/data-layers/_index.md` (94).
- M17 §4 Processing Data Feeds gains the surface API mention.
- Fix the two stale cross-references in the source documents (rulebook front-matter examples, structure map's M20/M19 slip).

---

## Phase 6 — Learning-world search

Deferred until enough of the section is written to make indexing worthwhile. The button and `/` hint already render at `baseof.html:71-74`; `world-learning.js:3` documents the wiring as a later phase. Work: widen the `Section` filter in `layouts/index.json:2` and add badges for `module`/`lesson`/`glossary`; move `window.SEARCH_INDEX` and `search.js` out of the migration-only branch in `baseof.html:150-160`; add the overlay markup and badge styles; wire `#lSearchBtn`. `search.js` itself needs no changes.

---

## Phase 7 — Hygiene

Zero reader-visible value, so it goes last, but it removes traps: derive the hardcoded 13/24/42 stats in `web-sdk-migration/list.html:10-12`; extract `partials/logo.html` (the monogram SVG is copy-pasted 7 times); delete dead code (`static/guide.css`, `static/theme.js`, `partials/header.html`, `partials/footer.html`) after confirming it is unreferenced; fix `brandColor`/`accentColor`, mis-nested under `[services]` so `.Site.Params.brandColor` does not resolve; remove or wire the never-rendered `[menu.main]`; update the stale "21 modules, 116 sections" comment at `world-learning.js:15`.

---

## Phase 8 — Groundwork before CJA

One structural change must happen before a third world exists, and it is cheap now and expensive later: `wherefits.html:12` and `homemap.html:10` read `.Site.Params.phases` globally and unscoped, so a second world using those partials inherits Adobe Analytics' phases. `params.phases` needs to become per-world, with the partials taking a world argument. The world switch itself is an if/else chain on URL prefix in two files (`head.html:37`, `baseof.html:4-6`) that would be eight branches deep by the sixth section; worth keying off `.Section` instead.

The rulebook's porting rule stands: copy `world-learning.css`, change `--accent` only. `--warning`, `--info`, `--success`, and the path violet stay fixed across every world so a reader never relearns the visual language.

---

## Verification

- **Every build:** `hugo --gc`, never `--minify`. Assert page count against expected; if fewer, stop.
- **Every section:** the rulebook's 20-item checklist, then the QA Rulebook's 13 points, binary verdict.
- **Every section, rendered:** appears in the left sidebar under the right module; no longer dimmed in the pocket map and home map; prev/next resolves across the module boundary; the `ref-box` triggers the injected doc-note; print preview shows the branded header with no split components; light and dark both correct.
- **Any slug change:** alias added, old URL must never 404, link crawl before delivery.
- Every phase ends with a git commit, so any phase reverts independently.

---

## Open item

**How do changes reach the live site?** This folder is a dump, not the deploy repo. If a GitHub repo builds via Actions, our edits need a path back into it. Options: you copy files back, you point me at the real repo, or this folder becomes the source of truth and you push it. Writing can start before this is settled; shipping cannot.
