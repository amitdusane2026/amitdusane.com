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

**~~A work item neither of us had listed: 12 written sections are not QA'd.~~ Resolved 7 Aug 2026.** The tracker showed Modules 11 (Classifications) and 13 (Segments), all 12 sections, as created but not QA-approved. Amit confirmed the QA had in fact been done at the time and the tracker was never updated. All 12 marked QA'd and final. This was tracker drift, not outstanding work, and it is the second instance of the same failure found in one session (see the SEO title audit below).

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

**That audit was mechanical, and mechanical is not the same as correct.** Every check above is a pattern match: dashes, class names, glyphs, character counts. None of them reads a sentence and asks whether it is true. Writing M02 §7 surfaced the first counterexample: M02 §4 stated that IP obfuscation "runs early, before bot rules and geo-lookup," when Adobe documents the exact opposite, that IP filtering, bot rules and geo-segmentation all complete *before* the address is obfuscated. The page passed all nine mechanical checks while telling the reader something backwards, and it had been signed off. Corrected 7 Aug 2026 in both places it appeared (the bullet at `04:60` and the warn-box at `04:70`).

The lesson generalises: a passed rulebook audit says the section is well-formed, not that it is right. Sections written before this project began have not had their technical claims checked against Adobe's documentation, and at least one was wrong. Where a new section builds on a claim made in an older one, verify the older claim rather than inheriting it.

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

**Phase 0.3 — `CLAUDE.md` written.** Startup core, loaded every session. Points at the governing documents rather than restating them, and holds what they leave implicit: document precedence, the build gate, the three silent-failure traps, voice measured from the corpus, Amit's voice statement as the governing intent, the publishing model, and the session start and close routines. Capped at roughly 250 lines, with `site-architecture.md` split out to be read on demand.

**Repository connected.** One repo at the parent folder covering the site and the supporting documents, pushed to `amitdusane2026/amitdusane.com` on a `develop` branch. `main` untouched and still building the June site. The deploy workflow was recovered from GitHub, moved to the repo root, and corrected to build from `amitdusane-site-complete/`; without that, a merge to `main` would have failed the build with "Unable to locate config file" and stopped the site updating.

**Tracker converted to TSV**, tab-delimited because the description column is full of commas. Rebuilt once after the first conversion silently dropped every numeric column.

**Phase 2 started. Bot Filtering (M02 §6) written, reviewed and signed off.**

---

## Phase 2 — The orphan sections

Five single gaps sitting inside modules that are otherwise finished, so each is a short piece of work against established neighbours. **One done, four remaining.**

| Section | File | Status |
|---|---|---|
| M02 §6 Bot Filtering | `foundations/report-suites/06-bot-filtering.html` | **Signed off 6 Aug 2026** |
| M02 §7 Privacy and Data Retention | `foundations/report-suites/07-privacy-data-retention.html` | **Signed off 7 Aug 2026** |
| M05 §4 Data Layer Design | `collect/data-layers/04-data-layer-design.html` | **Signed off 7 Aug 2026** |
| M06 §8 Consent and Tag Management | `collect/adobe-launch-tags/08-consent-and-tag-management.html` | |
| M07 §5 Experience Cloud ID (ECID) | `collect/tracking-calls/05-experience-cloud-id-ecid.html` | |

**Modules 2 and 5 are now complete**, all sections created, QA'd and signed off. Phase 2 is three of five done, with M06 §8 Consent and Tag Management and M07 §5 ECID remaining.

### Tracker audit, 7 Aug 2026: the SEO title column was systematically stale

Marking M05 §4 done surfaced two sections in the same module that were content-complete and QA'd but stuck at `Final result = No`. The cause was not the content. The tracker's `SEO title` cell was empty and flagged `No`, while the page files carried a perfectly good `seotitle`.

A full audit against the front matter of all 116 slugged pages found the same defect on **23 rows**, every one of them the identical clean case: tracker blank, file populated, zero rows where the two disagreed on an actual value. Descriptions were fully in sync, so the defect was confined to that one column. All 23 were synced from the files, per the precedence rule that code wins.

**Eleven rows flipped to `Final result = Yes` as a result**, all of Launch (M06 §1 to §6) and most of Data Collection (M04). Those sections were finished long ago; the tracker was simply under-reporting them. Totals are now 70 created, 58 QA'd, 58 final, and `final` equals `QA'd` exactly, which is the expected state once SEO is no longer a blocker.

Immediately afterwards the same failure appeared again from a different direction: the 12 Classifications and Segments rows carried `Content QA'd? = No` when the QA had actually been done and simply never been recorded. Marking those closed Phase 4 outright. Final totals for the session: **70 created, 70 QA'd, 70 final.**

**Lesson for the close-out routine: the tracker can be wrong in the direction of under-reporting, and that is the harder error to notice**, because nothing looks broken. Sections quietly sit at `No` and a future session reads them as outstanding work. Two separate instances surfaced in one session, together hiding 23 finished sections and a whole closed phase.

The root cause is structural and worth stating: **the tracker is updated by hand, and every column except `Content created?` has no automatic check against reality.** `Content created?` is self-verifying, because the `description` publish flag makes an unwritten section visibly dimmed in the maps. The SEO and QA columns have no such feedback, so drift there is silent and accumulates. Re-run the front-matter audit whenever a row refuses to reach `Final result = Yes` for no visible reason, and treat any `No` on an old row as suspect rather than as work.

### What M02 §7 taught about writing the technically dense sections

§7 was written without a notes dump, entirely from Adobe documentation verified during drafting. The first draft passed every mechanical check, used the components correctly, and was still rejected on review: the three-gate theme survived only in the infographic, because the prose was explaining mechanisms instead of carrying the story. It took two reads to extract a structure the diagram had already stated.

The fix generalises, and it matters because the roadmap is full of sections with this same problem shape (SDR, Data Feeds, Data Warehouse, Attribution):

- **When tables and diagrams carry the exact detail, prose must carry the theme.** Restating technical content in sentences beside a table that already holds it is what makes a section feel dense. Cut the elaboration rather than rewording it.
- **One concrete scenario, carried the whole way through, is the device that prevents drift.** Each section opens on where the scenario stands and closes by returning to it.
- **Build the scenario so its incidental details are the technical points.** In §7 a purchase "two years ago" is 24 months against a 25-month default policy; "they signed in" is why a person-level ID exists; "a phone then, a laptop since" is why browser-side ID retrieval silently misses half a request. Nothing is decoration.
- **Test the heading list on its own.** If the arc is not legible from headings alone, the section will need a second read.

Amit has granted standing authority to construct scenarios of this kind. The rule that still holds: no experience attributed to a real engagement, and every technical claim traceable to documentation.

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

## Phase 4 — QA the 12 unQA'd sections ✅ CLOSED 7 Aug 2026

Modules 11 (Classifications) and 13 (Segments) were never unQA'd. The QA had been done and the tracker was not updated. All 12 rows marked QA'd and final; no content work was required.

**The written corpus is now fully reconciled: 70 created, 70 QA'd, 70 final.** Every page that exists is signed off, and `Content created?` is now the only column that distinguishes done from outstanding. The remaining work is purely the 46 unwritten sections, with no QA backlog behind it.

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
