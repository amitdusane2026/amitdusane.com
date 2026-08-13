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
| M07 §5 Experience Cloud ID (ECID) | `collect/tracking-calls/05-experience-cloud-id-ecid.html` | **Signed off 7 Aug 2026** |

**Phase 2 is complete. All five orphan sections written and signed off.**

Modules 6 and 7 closed with them, taking the total to **12 of 21 modules complete** and sections to 71 of 116 (61.2%), with `final` now equal to `created` at 71.

**Modules 2 and 5 are now complete**, all sections created, QA'd and signed off.

---

## M12 Calculated Metrics ✅ SIGNED OFF 10 Aug 2026

All three sections written, reviewed and signed off on content and QA together. **Modules 1 to 13 are now a contiguous run with no gaps**, which was the milestone Phase 2 was aiming at. Totals: **13 of 21 modules complete, 74 of 116 sections created, QA'd and final.**

This was the first module written whole rather than a section at a time, and the process differed in a way worth keeping:

**Amit wrote the module out in his own words first, as he would brief a colleague, and that draft reshaped the module.** It supplied the opener (calculation is what anybody does once data is quantifiable), the channel example where Search wins on 100 orders and loses badly on orders per 100 visits, the KPI framing that connects the feature to the vocabulary of the meeting, and the closing judgment that no single ratio is a verdict. §1 was rewritten around it; §2 and §3 were extended. **Ask for the module-level dump before the section skeleton on any module where he has the material.**

Three rules were established or corrected during it, all now recorded in `CLAUDE.md`:

1. **State facts on our own authority. Never cite Adobe as the source of a claim.** Amit had raised this in earlier QA and it had never been written down. Adobe as an actor stays ("Adobe ships", "Adobe provides no housekeeping for this"); Adobe as the authority behind our sentence goes.
2. **Module and category landing pages are directional only, one or two paragraphs.** No theory, no technical discussion. A learner who reads an argument on a landing page and then meets it again inside the sections has been made to backtrack. This corrected a proposal to put the module-level material on the M12 landing.
3. **Each section carries its own compressed why, doing work inside that section** rather than sitting as a preamble. Not assuming a journey is not the same as being complete alone, and most readers arrive on one section from a search.

**Diagram density went up and should stay up.** Nine diagrams across three sections, on the standard that a reader gets the point in one or two seconds. Reach for a picture wherever a claim is comparative, sequential, or counterintuitive.

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

**Order now that the orphans and M12 are done**, following the structure map's arc, one module at a time and complete before moving on:

~~M12 (3)~~ **done** → M14 (10) → M15 (4) → M16 (4) → M17 (4) → M18 (4) → M19 (6) → M20 (5) → M21 (5)

**M14 Analysis Workspace is next, and it is the largest module in the curriculum at ten sections.** Six of those exist only as names. It is also the module every other analyze module points into, so it carries more inbound links than anything written so far.

M19 (SDR, 6 sections, all new) is the largest single piece and doubles as the prototype for your later "how to create a delivery document" section.

---

## Phase 4 — QA the 12 unQA'd sections ✅ CLOSED 7 Aug 2026

Modules 11 (Classifications) and 13 (Segments) were never unQA'd. The QA had been done and the tracker was not updated. All 12 rows marked QA'd and final; no content work was required.

**The written corpus is now fully reconciled: 70 created, 70 QA'd, 70 final.** Every page that exists is signed off, and `Content created?` is now the only column that distinguishes done from outstanding. The remaining work is purely the 46 unwritten sections, with no QA backlog behind it.

---

## The tracker now covers features, not just pages (7 Aug 2026)

Amit asked for the whole website in one record rather than pages alone. 39 `Feature` rows were added, inventoried from the code rather than from these documents, grouped into navigation, presentation, seo, chrome, infrastructure and tech-debt.

**28 of 39 built (72%), 11 outstanding.** Every one is `Content QA'd? = No` and `Final result = No` by instruction: Amit re-QAs the platform himself at the end, so nothing is marked passed on my judgment.

The agreed order of work is **content first, then features, then landing pages.** Do not start platform work while sections remain unwritten.

Two live defects were found during the inventory and are recorded as rows rather than fixed:

- **The learning-world search button is a dead control.** `#lSearchBtn` renders and is visible, has no click handler, the overlay markup is absent from the DOM, and `window.SEARCH_INDEX` is undefined. The overlay, `search.js` and the index all sit inside the migration-world branch of `baseof.html`. A visible affordance that does nothing is worse than no search at all, so at launch this is either wired or the button is hidden.
- **Google Analytics emits nothing.** The ID is correctly nested at `[services.googleAnalytics]` and `_internal/google_analytics.html` is invoked at `head.html:13`, yet a production `hugo --gc` build produces zero `gtag` output on any page. Cause not yet diagnosed. The site has therefore been collecting no analytics of its own, which is worth knowing before launch.

**Landing pages need content, and it is not the same job as a section.** All 21 module landings and 5 category landings sit at `Content created? = No`. Each needs a short description of what the phase or module covers, not a full section. That work belongs with the features pass, after the sections are done.

## PENDING — E-E-A-T and SEO discoverability audit (raised 7 Aug 2026, deferred by Amit)

Amit asked for a comprehensive E-E-A-T and search-discoverability analysis of the whole site, then deferred it to continue content work. **Do it before the learning world is published**, because every fix is free while the section still 404s and expensive once Google has indexed it.

Scope agreed: Experience, Expertise, Authoritativeness and Trust signals as they actually appear in the built HTML, plus the mechanical discoverability layer (indexation, structured data, canonicals, titles and descriptions across every page, heading structure, internal link depth, orphan pages, Core Web Vitals proxies, mobile rendering). Report ranked by impact, each finding naming file and line, split into pre-launch blockers and improvements. No fabricated score: E-E-A-T is a rater framework, not a measurable ranking factor.

Known findings already banked, so they do not need rediscovering:

- **No article-level author markup or byline anywhere.** Amit's 16 years, 7 of them at Adobe, appear on the About page and essentially nowhere else. A search lander on any section sees no indication of who wrote it. This is the single largest E-E-A-T gap and the cheapest to fix.
- No `Article` schema and no `datePublished`/`dateModified` on any learning page; only `BreadcrumbList` renders.
- Google Analytics emits nothing, so there is currently no measurement of discoverability at all.
- No RSS feed, and the learning-world search button is a dead control.
- 45 sections still unwritten. A half-finished section competes against its own site.

**Honest note for the report:** sections written from documentation rather than Amit's notes (Privacy and Data Retention, and the first draft of Consent) are thinner on the Experience axis than notes-driven ones. The corpus is not uniform and the report should say so rather than average it away.

### The generated-reference comparison: what has been run, and the rule for what comes next (10 Aug 2026)

A reference document on the same topic was generated externally and used as a **trap checklist**, never as a coverage checklist. The filter, which held across every run and reproduced the calls actually made:

> **Take it** if a reader who followed our section would produce a wrong number, or be genuinely surprised by a result, and nothing in the product would tell them. **Skip it** if it is a feature, a recipe, a catalogue, a platform translation, or anything whose absence only makes us less complete.

| Module | Yield | What it produced |
|---|---|---|
| M12 Calculated Metrics | 6 | Bounce rate denominator, double percent, Column Sum context, the IF threshold, table-dependency check |
| M13 Segments | 2 + 1 | eVar persistence at hit scope, unique visitors across columns, the noun heuristic |
| M01 Fundamentals | 2 | The other three visit-end conditions, midnight |
| M02 Report Suites | 1 | Landed in M03 (repurposed eVar), plus a currency clause in M02 |
| M03 Variables | 3 | Never-expire warning, the expiration counterpart, prop truncation symptom |
| M04 Data Collection | 3 + 1 banked | Identity reset on a tracking-server change, multi-suite settings divergence, PII in captured query strings; AQE truncation marker banked for M20 |
| M05 Data Layers | 3 + 1 banked | SPA router double-count on the entry screen, data layer value discipline (types and enumerations), ACDL array reassignment; meaning-not-presence validation banked for M19 |
| M06 Adobe Launch (Tags) | 4 + 2 banked | Rule order does not sequence async work, parallel libraries silently revert each other, storage duration and default value hide problems, the property split is one-way; setDebug and the Debugger environment switch banked for M20 |
| M07 Tracking Calls | 3 + 4 banked | sendBeacon and the exit-link race, `abort` resets after every hit, media heartbeats sit outside Server Call Usage; 200-is-not-acceptance, `pe`/`pev2`, preserve-log, and request-before-report banked for M20. Also corrected the M04 §2 beacon diagram |
| M08 Processing Rules | 4 | Delete does not undo persistence, an event outlives the value it was set on, guard the target as well as the source, test the negative case. **Three verified errors in the reference, two of which §4 had already named as myths** |

**Nine modules remain unreviewed and that is deliberate.** Amit's ruling stands: do not sweep the finished modules. The pattern in the yield says where it pays. **Modules with mechanical depth reward it; conceptual modules do not.** M03 Variables scored highest of the retrospective runs because persistence is the hardest mechanism in the product. M02 Report Suites scored lowest because it is mostly architecture and judgment, which is where our writing is already stronger than a reference can be.

**For the 42 unwritten sections, generate the reference before drafting**, not after. It costs nothing, catches gaps at their cheapest, and touches no signed-off work. Start with M14.

### The M04 run, and the third bucket the filter was missing (12 Aug 2026)

Amit asked for M04 Data Collection specifically, which overrides the no-sweep ruling for that one module. Six sections read in full, every candidate checked against the whole corpus in both contraction forms. **Three additions applied, one banked, and the run produced something the previous five did not.**

**The filter needs a third bucket: the reference is wrong here.** Four claims in the generated document are contradicted by our own corpus, and in each case we are right:

| Reference claim | What the corpus says |
|---|---|
| Exclusions (bot rules, IP exclusion, IP obfuscation) run at stage 6, after marketing channels and attribution | `04-report-suite-settings.html:60` has IP exclusion, bot rules and geo-lookup all completing *before* obfuscation. This is the same error corrected in M02 §4 on 7 Aug |
| VISTA rules "run after processing rules", stated flat | M09 §1 says Adobe can configure them either side, so a fixed order cannot be assumed |
| A first-party CNAME sets the cookie in an HTTP header, "outside that particular cap" | M07 §7 has the post-Safari-16.4 position: a server-set cookie is still capped at seven days if Safari judges the CNAME to be cloaking. The reference gives the 2020 answer and would send a reader to a fix that stopped working |
| Hierarchy variables "largely superseded" | M03 is more careful about where they still apply |

Two of the five previous runs also contained factual errors we had already corrected. **Record the wrong-here findings, because they are the only evidence that the corpus is ahead of a generated reference, and that is worth knowing before the E-E-A-T report characterises the site.**

**A second framing lesson.** The reference organised by mechanism in eleven parts; our module organises by method in six sections. Its Parts 8 to 11 (post-hit processing, consent, debugging, architecture) map to M08 to M11, M02 §7, M20 and M19, not to M04 at all. A naive coverage read would have flagged all four as missing. **Check the module boundary before calling anything a gap.**

### The M05 run: the reference got the module's central mechanic wrong (12 Aug 2026)

Four sections read in full. Three additions applied, one banked, and the third bucket paid off again, harder than on M04.

**The reference states ACDL's core rule as "the `event` key triggers listeners, everything else is merged into computed state."** Under that rule `eventInfo` merges into state. It does not, and M05 §2 demonstrates the opposite with two console readouts. Both documents name that split as the crux (the reference calls it "the key to using ACDL well", our §2 calls it "the single most important detail in the whole section") and only one has it right. It is also the mechanic that makes ACDL worth adopting at all, since getting it backwards means every add-to-cart overwrites the last.

Two smaller places we are ahead: the reference never mentions that renaming the ACDL object leaves two objects on the page, and it presents "publish XDM directly versus domain-shaped" as an open fork without noting that ACDL feeds the Edge cleanly either way.

**Not taken, but worth recording as the best idea in the document:** assert in the end-to-end test suite that a checkout flow produces the expected pushes, in the expected order, with the expected types. Not a trap, so it fails the filter, but it catches the one defect class manual tagging QA never catches, which is a refactor that removes a push nobody remembered was required. **Belongs in the M19 §6 Validation and Sign-off pre-drafting checklist**, alongside the banked meaning-not-presence item.

**Also not taken, and a judgment call left open for Amit:** the reference takes a clear position on whether an application should publish XDM directly or publish domain-shaped data mapped to XDM in the tag layer. M05 does not address the question anywhere. It is not a trap, so it fails the filter, but it is exactly the kind of architectural fork the site exists to answer, and M05 §3 already has the character for it.

### M05 §3 has no `ref-box`, deliberately (12 Aug 2026)

`03-do-you-need-acdl.html` carried a `ref-box` titled "Related in this module" holding two internal links with no `target="_blank"`, the only one of its shape in the learning world. It broke the rulebook (Adobe docs only, external) and QA check 13 never caught it, because that check confirms a `ref-box` exists and is last, not what is inside it. Same lesson as M02 §4: the checks are pattern matches.

**Amit's ruling: remove it outright rather than find Adobe links for it.** The section argues against Adobe's own recommendation, so a box pointing at Adobe documentation would undercut its position, and the two internal links are already made in the body.

**So §3 is now the only section in the learning world with zero `ref-box`, and that is intentional. Do not "fix" it by adding one.** The section anatomy rule in `CLAUDE.md` still holds everywhere else.

No rendering consequence: `layouts/lesson/single.html:9` only injects the doc-note when the `ref-box` contains an Adobe domain, so §3 was already getting no doc-note before the box was removed. That second condition was missing from `CLAUDE.md`'s description of trap 3 and has been corrected there.

### The M06 run: the first time a written sentence pointed the wrong way (13 Aug 2026)

Eight sections read in full. Four additions applied, two banked, and one finding of a kind the previous runs did not produce.

**M06 §7 Environments actively reassured the reader about something untrue.** It said separate development environments let teams "build, test, and promote independently, without disturbing anyone else's work in progress." Environments are isolated; the resources are not. Rules and data elements belong to the property, and two teams in two development environments edit the same pool, so the second library to publish silently replaces the first team's revision. Every earlier finding across M04, M05 and M06 was an omission. **This was the first one where the corpus told the reader something wrong**, and it survived QA because check 13 and the rulebook checklist both read structure, never claims. Corrected in §7 and given its own warn-box in §6.

**Where the reference beat us on scope, and it is a real gap:** Part 10, the Reactor API. Export a property to version control on a schedule, template new properties, audit drift across an estate. Not a trap, so it failed the filter, but M06 has no coverage of Tags-as-software at all, and for an estate of a dozen properties it is the difference between managed and hoped-for. **Worth a decision before launch: either a short §9, or an explicit scope note that it is out of range.** Amit to rule.

**Raised, not taken, and reflexive.** M06 §3 sells the extension catalogue enthusiastically and never mentions that an installed exchange extension runs third-party code in every visitor's browser with full page access. The reference does say it. Our §8 spends 29KB on what third-party code is permitted to do, so the omission in §3 is not a knowledge gap, it is a one-sidedness, produced by the same additions-only bias we identified in the M05 reference's treatment of ACDL. **The bias is not only in generated documents. It is in our own sections, and it shows up as an argument with no counterweight rather than as a missing fact.**

### The M07 run: two references contradicted each other, and checking paid twice (13 Aug 2026)

Seven sections read. Three additions applied, four banked for M20, and one correction to our own diagram.

**The M07 reference labelled the path segment after the report suite ID "response type", claiming `1` requests the pixel and `10` requests none. The M04 reference had called the same segment "hit source", and the M04 §2 beacon diagram was built on that.** Two generated documents flatly contradicting each other about a label added to a signed-off section the day before.

**Verified against Adobe rather than picking a side.** [Implementing with hardcoded image requests](https://experienceleague.adobe.com/en/docs/analytics/implementation/other/hardcoded) states "/1/ is the hit source", cross-referenced to the `hit_source` column in the Data column reference. **Our label was right and the M07 reference is wrong**, along with its `10` claim, which follows from the same error. Worth noting how it went wrong: response type is a real concept in the [Data Insertion API](https://developer.adobe.com/analytics-apis/docs/1.4/guides/data-insertion/), where the path genuinely carries one. The reference imported a true fact from an adjacent context into the wrong slot, which is now the second time a run has produced exactly that failure shape.

**But checking the challenged claim exposed a different defect beside it.** The diagram omitted the library version segment, so it matched Adobe's *hardcoded* image request example rather than what AppMeasurement actually puts on the wire. The diagram's stated purpose is "this is what the entry in your network tab is actually saying", so it was wrong by one segment on any live site. Rebuilt to six segments, geometry verified in the browser against the rendered font, and the version now earns its place with the H-code diagnostic: an `H.` prefix on a site that migrated years ago means a hardcoded library still firing from a forgotten template.

**Two lessons worth keeping.** When two generated references disagree on the same fact, neither is evidence; go to Adobe. And **a challenge to one claim is worth treating as a prompt to re-examine everything around it**, because the thing that was actually wrong was not the thing being disputed.

### The M08 run: the module predicted the reference's mistakes (13 Aug 2026)

Four sections read, four additions applied, and the strongest validation of the corpus these runs have produced.

**M08 §4 contains this sentence, written months ago:** *"Two limits are worth naming precisely because they are widely believed and simply untrue. A rule is not restricted to a single action... And a rule is not stuck at 'if this, then that'; the Otherwise branch is a genuine else. Older guides still repeat both myths."*

**The reference repeated both, and a third.** All three verified against Adobe:

| Reference claim | Verified position |
|---|---|
| "Cannot express an else branch. Rules are independent if-blocks" | The [interface documentation](https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/report-suite-general/processing-rules/pr-interface) documents an "Otherwise do the following" section that executes when the condition is false |
| Four actions, with "Concatenate value of" listed separately | Three actions. Concatenation is done inside "Overwrite value of" by combining values, which is exactly §2's framing |
| Processing rules run before VISTA rules, stated flat | [Processing order](https://experienceleague.adobe.com/en/docs/analytics/technotes/processing-order): VISTA "can potentially run before or after Processing rules... Most VISTA rules generally run after." §1 already carries that hedge |

**A section written to inoculate readers against bad guidance correctly predicted what a fresh generated document would get wrong.** That is worth more than any individual trap the five runs have yielded, and it is the clearest evidence so far that the corpus is ahead of a generated reference rather than merely different from it. Worth citing in the E-E-A-T report when it runs.

**The one genuinely new mechanic** came from verifying rather than from the reference's prose: Adobe's processing order puts processing rules at pre-processing step 7 and eVar persistence at visit/visitor-level step 5, far downstream. So deleting a value on a hit removes the incoming value and leaves the persisted one untouched, and the report goes on crediting it. §2 described delete as a way to "undo a value an earlier rule set", which is true within the hit and invites precisely the wrong expectation about attribution.

**Held back deliberately, both open for Amit.** The reference's Web SDK double-mapping trap (a legacy rule and a datastream mapping both writing one eVar) asserts "the last one wins, the outcome depends on ordering you did not choose", which is not something to put in writing unverified. And its rule-register idea, a markdown file of every rule with owner and date living in the implementation repository rather than a wiki, is a governance practice rather than a trap, so it fails the filter while being the best thing in the document.

**One tooling lesson, learned the hard way.** A proposed addition to M03 §6 turned out to duplicate an info-box already there. The search used `do not sum`; the section is from the era that uses contractions and says `don't sum`. **The corpus is split by era, so every search pattern has to be contraction-tolerant**, or it will report a gap that is not there. Earlier comparisons in this session used the contraction-free forms and may have produced a false negative or two.

### Banked for M14 Analysis Workspace: annotations are absent from the whole corpus (10 Aug 2026)

The word "annotation" appears nowhere in the learning world. Workspace annotations are a dated note attached to a project or a metric, explaining a spike, a release, an outage, or a configuration change, and they are the cheapest institutional memory the platform offers.

They matter beyond M14, because several sections now end with advice to record a date somewhere a future analyst will find it: the eVar repurposing trap in M03 §2, the seam warnings in M02 §4, the superseded-metric habit in M12 §3, and, added 12 Aug 2026, the identity-reset warning in M07 §7 First-Party Cookies. **Annotations are the answer to all four, and there is currently nowhere to link.** When M14 covers them, those sections gain a destination.

### Banked for M20 Testing and Debugging (12 to 13 Aug 2026)

Three items, all free to bank because all five M20 sections are unwritten.

- **The `AQE` truncation marker.** `AQB` and `AQE` appear nowhere in the learning world. `AQE=1` closes the payload of a classic hit, so its absence is the check that a hit arrived intact. Belongs in §3 Browser Developer Tools alongside the `b/ss` filter that section already documents. From the M04 run.
- **`_satellite.setDebug(true)` as the first move when a rule is not firing.** It logs rule evaluation, which conditions passed, and which actions ran, which turns a guessing game into reading output. M06 §2 lists the function in a table without saying it is where triage starts. From the M06 run.
- **The Experience Platform Debugger can switch a live production page onto a development build with no site change.** Arguably the single most useful validation trick in the product, and it appears nowhere in the corpus. Belongs in §2 Adobe Experience Platform Debugger. From the M06 run.
- **A 200 means the request arrived, not that the data was accepted.** A delivered hit can still be discarded by a VISTA rule, dropped by a processing rule, filtered as bot traffic, or land in a suite you did not intend. Network success is necessary and never sufficient. Belongs in §5 Common Issues and Solutions. From the M07 run.
- **`pe`, `pev1` and `pev2` are what make a hit a link call**, and reading them is how you confirm a link call in a debugger. M07 §2 teaches the three link types and their reports but never the parameters. Belongs in §3 Browser Developer Tools. From the M07 run.
- **Preserve the network log before testing exit links**, or the hit disappears along with the page you were on. From the M07 run.
- **The habit that halves every investigation: look at the request before you look at the report.** Reporting problems have many causes; the request tells you immediately whether the data was ever collected. Worth being the opening principle of the whole M20 module rather than a tip inside one section. From the M07 run.

Surfaced by the M02 reference comparison. Not retrofitted, because M14 is unwritten and this belongs in its pre-drafting checklist rather than as a forward reference to a page that does not exist.

### Banked finding: the restructure orphaned content, and visit mechanics proves it (10 Aug 2026)

M01 §3 Key Terminology defined a visit solely by the 30-minute timeout, in three places, and said nothing about the other three conditions or about visits spanning midnight. Amit knew the mechanics perfectly well; **he had planned to teach them in the old Dimensions and Metrics module, which the restructure deleted.** The knowledge fell through the seam and nobody noticed for months, because nothing was ever marked missing: the tracker showed the section written, QA'd and final, and it was.

**The generalizable lesson: when the movement ledger deletes a section with a stated destination, the destination has to be verified, not assumed.** The structure map's ledger records these deletions from the old M13:

| Deleted section | Stated destination |
|---|---|
| Understanding Dimensions | "taught in Props and eVars" |
| Understanding Metrics | "taught in Events" |
| Dimension and Metric Best Practices | deleted outright, no destination |

Visit mechanics belonged to Understanding Metrics, and its stated destination was Events, which covers success events rather than baseline traffic metrics. So the handoff was incomplete in exactly the way that produces no error signal anywhere.

**Work item for the pre-launch pass:** read the movement ledger's deleted sections, list what each was expected to carry, and confirm the receiving section actually carries it. Three deletions, so this is a short check, and it is the only mechanism that would catch a second instance. Anything found is likely to be foundational, because that is what an early module was holding.

### Banked finding: eight sections assert a journey the reader has not taken (10 Aug 2026)

Found by sweeping the learning world for journey-assuming constructions. **All eight are signed off and all eight passed QA**, which is the same lesson as M02 §4: every check in the rulebook is a pattern match, and none of them reads a sentence and asks whether it is true for the reader in front of it. This is QA Rulebook check 4 and component rulebook rule 5, both failing silently.

**Six of the eight are in the opening paragraph**, which is the worst place, because it is the first thing a search lander reads and it tells them they have read five sections they have not.

| File | The line |
|---|---|
| `analyze/segments/05-segment-types-sharing.html:12` | "Everything in this module so far built a single segment, alone…" |
| `analyze/segments/06-segment-best-practices.html:12` | "Everything in this module so far built the machinery…" |
| `collect/adobe-launch-tags/05-rules.html:12` | "Everything in this module has been quietly building toward this section" |
| `collect/adobe-launch-tags/06-publishing-workflow.html:12` | "By now you have done the heavy lifting" |
| `collect/tracking-calls/03-server-calls-billing.html:12` | "By now you have sent two different kinds of calls…" |
| `foundations/report-suites/05-multi-suite-tagging.html:12` | "By now you have effectively met it twice already" |
| `collect/data-collection/06-mobile-sdk.html:131` | "Every method in this module so far…" |
| `shape/marketing-channels/03-marketing-channel-processing-rules.html:364` | "the question this module has been building toward since the overview" |

Each fix is one or two sentences: name the concept, link it, recap it in a few words, so the sentence is true for both a curriculum reader and a search lander. **Deliberately deferred by Amit to be handled holistically with this audit rather than scattered across content sessions**, because every one of them only damages a search lander and the learning world still 404s, which makes them free to fix now and expensive after indexation.

Three near-misses were judged acceptable and left alone: `data-collection/01` ("Everything in this module is just detail hung on that line", a forward statement from the module's first section), `marketing-channels/05` ("Everything in this module now sits in a single line of causation", mid-section synthesis), and `marketing-channels/06` ("Everything in this module can be wrong without telling you", a statement about the subject rather than the reader).

**The list was incomplete, and the grep is why (found 12 Aug 2026, no action taken, deferred with the rest).** The pattern searched `the previous section` but not `the last section`, which is a whole family the corpus actually prefers. Widening it finds **eight more instances, three of them in opening paragraphs**, taking the banked total from 8 to 16:

| File | The line |
|---|---|
| `foundations/report-suites/02-global-vs-individual-report-suites.html:12` | "Remember the one-way rule from the last section" (opener) |
| `foundations/report-suites/02-global-vs-individual-report-suites.html:13` | "take the automobile manufacturer from the last section" |
| `foundations/report-suites/03-virtual-report-suites.html:12` | "The last two sections left one promise hanging" (opener) |
| `foundations/report-suites/03-virtual-report-suites.html:74` | "defaulting to global in the last section" |
| `foundations/variables/04-default-reserved-variables.html:49` | "The commerce events the last section pointed here" |
| `foundations/variables/07-context-data-variables.html:12` | "The last section closed on a promise" (opener) |
| `collect/data-collection/05-server-side-collection.html:24` | "from the last two sections" |
| `collect/tracking-calls/04-spa-tracking.html:99` | "the discipline from the last section" |

The `report-suites/02` pair is the worst of the sixteen: line 13 references an automobile-manufacturer example the search lander has never seen, so the sentence is not merely presumptuous, it is unintelligible.

**The generalisable point is about the method, not the lines.** A sweep for a prose pattern is only as good as the phrasings that occurred to whoever wrote the grep, and this corpus has an era split that guarantees variants. Treat any pattern-based sweep as a lower bound, and widen it once before trusting the count.

**Re-run the widened sweep before launch rather than trusting this list**, since sections written after this date could reintroduce the pattern:

```
grep -rn -i -o '[^.>]\{0,70\}\(so far in this\|in this module so far\|everything in this module\|the previous section\|the last section\|the last two sections\|the previous two sections\|the sections before\|the section before\|earlier we saw\|by now you have\|up to now you\|this module has been building\|as we saw\|we have met\|comes next\|is next\b\)[^.]\{0,60\}' --include=*.html .
```

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
