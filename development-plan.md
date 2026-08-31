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

~~M12 (3)~~ **done** → ~~M14 (10)~~ **done 16 Aug 2026** → M15 (4) → M16 (4) → M17 (4) → M18 (4) → M19 (6) → M20 (5) → M21 (5)

**M14 Analysis Workspace is next, and it is the largest module in the curriculum at ten sections.** **All ten are unwritten**, not six: every M14 row reads `Content created? = No` and no section file carries a `description`, so the whole module renders dimmed. Six of the ten files hold pre-restructure legacy prose and four are bare stubs, which per the working agreement is the same job ten times.

Naming is mostly free. The structure map prescribes title and seotitle for §2 and §5 to §10. **Three seotitles need coining: §1 Analysis Workspace Overview, §3 Freeform Tables, §4 Visualizations**, and the map's own follow-up note already flags §3 and §4 as needing a pass.

Six written sections link inbound, all to the module landing or §1: M12 §3, M13 §2 and §6, M01 §2, M03 §1 and §2. M13 §6 closes on "Analysis Workspace is where it finally gets played", which sets §1's opener. `[params.phases.analyze]` already lists module 14, so trap 2 is clear.

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
| M10 Marketing Channels | 2 | Direct as a data-quality instrument, the Channel Breakdown setting. **Thinnest yield of any run, against three verified reference errors.** M09 VISTA skipped by Amit |
| M11 Classifications | 2 | Unspecified trended over time as a fourth instrument, subclassifications introduced in the schema. Second consecutive thin yield; the reference omitted the legacy deprecation entirely |

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

### The M10 run: the thin yield is the finding (13 Aug 2026)

Six sections read, two additions applied. **That is the lowest yield of any comparison, and it is not because the analysis was shallow.** Three of the reference's claims were verified as wrong, all on ground M10 already covers correctly.

| Reference claim | Verified position |
|---|---|
| "Expiration is set per channel, not globally" | No such setting. [The Marketing Channel Manager](https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/marketing-channels/c-channels) has five per-channel settings and expiration is not among them; visitor engagement expiration is report-suite level, as §5 says. The reference appears to conflate it with the Override Last-Touch checkbox, then builds a consequence on the invented setting |
| "The plain Marketing Channel dimension is the last touch one" | [Adobe](https://experienceleague.adobe.com/en/docs/analytics/components/marketing-channels/analyze-mc) calls Marketing Channel "the recommended Marketing Channels dimension to use" with flexible attribution, and First/Last Touch Channel **legacy** with pre-applied attribution. §1 and §4 both have this right |
| Session Refresh "there is a recurring instinct to remove it" | Channels cannot be removed at all, only disabled, as §2's warn-box states. The paragraph rests on an action the product does not permit |

**Both additions came from verification rather than from the reference's prose.** Channel Breakdown surfaced only because checking the per-channel expiration claim required reading Adobe's list of per-channel settings, where §2's list of four turned out to be missing one. Same shape as the M04 beacon diagram: a depiction of a screen that presents as complete and is not.

**What this says about the exercise.** Five earlier runs produced 17 additions; this one produced two. The modules that yield are the ones with mechanical depth, which is what the 10 Aug ruling already predicted. M10 is mostly judgment, sequencing and organisational design, and that is precisely the ground where a generated reference cannot compete, because it has no position to take and no engagement to draw on. **Yield falling as the module gets more conceptual is the expected result, not a sign the comparison stopped working.**

**One genuine gap the filter rejected**, worth recording in case it is ever wanted: the reference argues for a single structured tracking parameter (`cid=em_welcome_2026q3_varB`) over five UTM-style parameters, on the grounds that five parameters are five things five agencies can misspell, and marketing channel rules cannot pattern-match their way out of it. M10 builds rules that match query parameters and never takes a position on how the codes should be designed. Governance rather than a trap, so it failed the filter, but it is the one real absence.

### The M11 run, and the two cheap alarms now paired across modules (13 Aug 2026)

Six sections read, two additions. Second consecutive thin yield, and the same explanation as M10: the module is unusually complete and in several places materially more precise than the reference.

**The reference's largest failure is an omission, not an error.** Dated 12 August 2026, it says nothing about the legacy deprecation, eighteen days before the legacy Classification importer retires. §1 carries both dates and the point that matters: the importer and the Rule Builder are on separate clocks several months apart, so a team treating "classifications are being retired" as one event migrates the wrong things first.

**Where ours is sharper on the same ground.** The reference says the rule lookback "varies, so confirm the current window." §5 gives the dropdown range, the default, the Perform lookback button, the six-month ceiling, and the framing that actually lands it: files are retroactive to the beginning of your data, rules are not, which contradicts the module's own opening claim. It also has no equivalent for two traps §1 already carries: classification values are absent from hit-level data feeds though Data Warehouse carries them, and the Customer Attributes distinction where the same CSV produces materially different numbers because a classification attaches to a key while Customer Attributes attaches to the visitor profile.

**Both additions came from the same two places the last several runs did.** One is a coherence defect: §4 referenced subclassifications twice as though known, and no section had ever introduced them. Same class as M10's missing Channel Breakdown and the M04 diagram's missing segment, and the third time a list or forward reference presented as complete and was not.

**The other creates a deliberate pair.** Unspecified trended over time in M11 §6 and the Direct share in M10 §6 are now matched instruments, cross-linked, both framed as cheap upstream alarms that catch tagging failures in days rather than quarters. The reference is what suggested the pairing, and it is a genuinely good observation. **Worth watching for more of these: an instrument that only exists in one module is easy to miss, and a pattern the reader meets twice is one they keep.**

### PENDING before launch: M11 §1's deprecation warn-box goes stale on 31 Aug 2026

§1 carries a warn-box marked "verified July 2026" stating that the legacy Classification importer is deprecated after **31 August 2026** and the legacy Rule Builder after **28 February 2027**. The treatment is correct for a perishable fact, and the box tells the reader to confirm against Experience League.

**It becomes actively misleading the moment the first date passes.** Re-verify both dates and rewrite the box in the past tense for the importer before the learning world is published. This is the clearest example in the corpus of a dated snapshot that needs a scheduled review rather than a one-time check, and it is worth asking whether any other warn-box carries a date that will expire on its own.

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

### SEO-08 run: the ledger check, and it found a second orphan (20 Aug 2026)

The movement ledger records three deletions from the old M13. Each was checked against its stated destination.

| Deleted section | Stated destination | Verdict |
|---|---|---|
| Understanding Metrics | "taught in Events" | **Closed.** This was the known instance. M01 §3 now carries "A visit ends four ways, and only one of them is famous", with all four conditions and the midnight case. |
| Understanding Dimensions | "taught in Props and eVars" | **Partially honoured — a second orphan.** See below. |
| Dimension and Metric Best Practices | deleted outright, no destination | Nothing was promised, so nothing is owed. Noted only that M03 §8 Variable Planning is thin at three headings, and is the natural home if any of it is ever wanted back. |

**The second orphan is the unique-value ceiling on a dimension — Low Traffic.**

The destination was honoured for capacity but not for cardinality. M03 §1 teaches that a report suite gives 75 props at 100 bytes each and that longer values truncate silently; M03 §2 teaches eVar capacity and its 255 bytes. What no section teaches is that a dimension has a ceiling on how many *distinct values* it can hold in a reporting period, and that everything past it collapses into a single Low Traffic line.

The corpus mentions it twice, and neither is where a reader would look. One is a clause inside M04 §2 about keeping link names low in variety — "every dimension has a ceiling" — in a section about naming custom links. The other is a passing note in M02 §3 about virtual report suites sharing a schema.

**It is the same shape as the visit-mechanics gap, and it produces no error signal.** Both receiving sections are written, QA'd and final, and they are: the knowledge that moved arrived intact, and the knowledge that did not was never marked missing by anything. It also happens to be the site's own recurring theme — a report quietly stops showing you rows, and nothing anywhere says why.

Not written, because content is Amit's call and this needs his notes. Recorded so it is not lost a third time.

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

## The licensing question: raised, researched, and closed (14 Aug 2026)

**Do not reopen this. It was examined properly and decided.**

Adobe's [image use rights](https://www.adobe.com/legal/permissions/images-user-guides.html) page, read in full, is stricter than it first appears. Clause 4 says "your use must contain the entire screenshot, you may not use portions of the screenshot" and forbids altering one except to resize. Clause 10 repeats that screenshots must be reproduced in their entirety, with portions available only by written request. Clause 6 excludes third-party content. Clause 7 requires the attribution statement *"Adobe product screenshot(s) reprinted with permission from Adobe."*

Read literally, that prohibits cropping, which was the whole visual strategy.

**Amit researched it independently and ruled that the site proceeds as originally designed.** The reasoning, recorded so it does not have to be rebuilt:

- **Terms of this kind are an anchor, not an enforcement program.** Adobe, Microsoft and Google all publish them so they retain the option to act against the cases they care about: competitive advertising, misrepresentation, embedding UI inside a competing product, disparagement. None of that describes a teaching site.
- **Observed reality across a decade supports it.** Cropped screenshots are ubiquitous across practitioner blogs and YouTube product training, much of it showing full interfaces and data, and none of it has been stopped. Most of those sites do not carry the attribution statement either.
- **Adobe's terms are a license offer, not the outer limit of what is lawful.** Fair use exists independently and is not something Adobe can contract away from people who never agreed to it. Cropped screenshots used to teach and explain sit about as squarely inside it as anything does: educational and transformative purpose, functional rather than creative source, small portion, no substitution for anything Adobe sells.
- **The realistic worst case is a request to remove some images**, not a legal consequence.

**The real risk was never the interface. It is the account and the data**, and that is controlled at source, below.

### Capture source: the Adobe training account only

**Never the employer's company account.** That access sits under a strict security policy, is reachable only from the company laptop, and nothing leaves it. Closed permanently; do not suggest it.

**The Adobe training account, granted during Adobe training, carries fictitious data throughout.** That is the only source. It removes the exposure that actually mattered: no client data, no NDA risk, and no third-party content, since Adobe's own demo brands are Adobe's content rather than a third party's.

Amit's standing commitment: no account names, no organization names and no identifying data in any published capture. The pre-capture checklist in `screenshot-briefs.md` exists to make that mechanical rather than remembered.

**Worth adding anyway, cheap and unrelated to any of the above:** a trademark attribution line in the site footer, noting that Adobe and Adobe Analytics are trademarks of Adobe Inc. and that the site is not affiliated with or endorsed by Adobe. One line, it directly serves the no-implied-endorsement point, and it is what every serious independent training site carries. Tracked with the byline and Article schema in the pre-launch list.

## DECIDED, deferred by design: the site will carry screenshots (14 Aug 2026)

**Amit's decision, and the reasoning is deliberate rather than an oversight.** The site has no product screenshots anywhere. It teaches interfaces with hand-built SVG schematics, which strip the noise out and are better for teaching *structure*, and which do not answer the question a first-time reader actually has, which is "will I recognize this when I open it."

Screenshots are going in. **They were delayed on purpose so that concrete content existed first**, because a screenshot chosen to fit finished prose is a different and better artifact than prose written around a screenshot somebody already had. The order is: finish all modules, then the screenshot pass.

Raised while reviewing M14 §1 against the competitive field. It is the single largest gap versus Adobe documentation, practitioner blogs and video training, and it matters most in M14, which is the most visual module in the curriculum and expected to take most of the site's search traffic.

### The shape of the work, agreed in principle, not yet built

**Placeholder slots, not a post-hoc sweep.** A sitewide analysis after the modules are finished will re-derive intent from prose and will do it badly. The moment a section is written is the moment its author knows what the screenshot must show. So:

- **While writing each section**, drop an empty slot where a screenshot belongs, carrying the capture brief: which screen, which state, what must be visible, what must be redacted. Costs seconds. Makes capture a checklist later instead of an act of memory.
- **After the modules are done**, run the sitewide audit as an *audit*: catch sections that should have a slot and do not, remove slots that turned out to be decorative, and rationalize the set so the same screen is not captured five times.

**The slot must be self-announcing and countable**, because an un-filled placeholder reaching `main` is exactly the class of silent failure this site has already been bitten by three times. One class name, one grep, and a pre-commit guard in the same shape as the `data-newblock` guard.

### Settled specification (Amit's rulings, 14 Aug 2026)

**1. Screenshots are never hidden on mobile.** Considered and rejected. Google indexes the mobile rendering under mobile-first indexing, so hiding the images there would mean doing the whole capture programme and having the indexed version of the page not contain any of it. A "switch to desktop" message is also a request to leave, aimed at the readers most likely to arrive from a phone search.

**2. Crop to the feature, not the screen.** This is the primary mobile answer and it governs capture, not just presentation. Measured on a 375px phone, the image area renders at **293px**, so a 1500px full-screen capture shrinks 5.1x and Adobe's 12px interface labels land at roughly 2px. A header strip, a dropdown or one table region reads perfectly at that width. A whole window never will. Target roughly eighty percent of shots readable inline without zooming.

**3. Zoom uses native browser capability, no JavaScript.** The image is wrapped in a plain link to the full-size file, with a zoom icon supplied in CSS for discoverability. Tapping hands off to the browser's own image viewer, which already provides pinch-zoom, panning and scrolling on every phone and is maintained by the browser vendor. Deliberately not a JS lightbox: the learning world already carries one dead JS control (the search button), and the `<a>` wrapper is forward-compatible, so a lightbox can be added later without re-editing a single section.

**4. Naming. ~~`aal_module14_section01_ss1.png`, zero-padded so 116 sections sort correctly.~~ Superseded 24 Aug 2026.** All 34 shipped files were renamed to describe **what the picture shows**: `adobe-analytics-evar-allocation-expiration.webp`, `adobe-launch-tags-publishing-flow.webp`. Lowercase, hyphens, no module or section numbers, product prefix where it is not Adobe Analytics itself.

The old scheme optimised for sorting and grep. Neither turned out to matter — a shot appears in exactly one section, so the section file *is* the index — while the filename is a genuine image-search ranking signal that `aal_module03_section02_ss1` threw away entirely. Renamed before launch deliberately: after indexing it would cost a redirect per image. Convention and the full mapping live in `screenshot-briefs.md`.

**5. Location and format.** Files live in `amitdusane-site-complete/static/img/`, which does not exist yet and needs creating. There is no `assets/` directory in this project and Hugo's image pipeline is not in use (`Processed images | 0`). Amit captures and saves **PNG**; conversion to WebP happens on the way in, so no generation loss and nothing for him to think about.

**6. Capture discipline.** Browser zoom at 100%, the same window width every time, Adobe's light theme throughout, and never so narrow that Workspace collapses its left rail. Delivery widths after resize: about 1500px for a full canvas, 1200px for a panel or region, 800px for a single control. Exact dimensions are not a capture-time concern.

**7. Text-critical information never lives only inside a screenshot.** If the reader has to read a value, it appears in the caption or the prose as well. This is the mobile answer and the accessibility answer at the same time.

### BUILT AND SHIPPED, 14 Aug 2026. The template for everything after.

**M14 §1 carries the first two screenshots on the site, and the component is now the site standard.** Amit's ruling: this is the template for the modules still to be written *and* for retrofitting the finished ones. Full specification is in `content-component-rulebook.html` under `shot-box`; the short form is in `CLAUDE.md`.

What settled during the build, all of it from Amit's review rather than from planning:

- **The image is inert and never wrapped in a link.** The first version opened the full-size file in a new tab on any tap, which reads as broken. Only the zoom button opens anything, and it opens an overlay in the same tab.
- **The frame caps height**, 360px desktop and 260px mobile, so a capture is clearly inset instead of setting its own size and dominating the page.
- **The boundary has to be unmistakable.** Nested edges, 44px block margin, and a divider above the note. The first version blurred image, caption and body prose into one undifferentiated run and flattened the page hierarchy.
- **No permission or credit line under the image.** It arrived from nowhere and broke the reading flow.
- **Two screenshots per section is plenty**, and a screenshot has to beat the diagram that would otherwise sit in that slot. Three of the five planned for §1 were cut on that test.
- **Redaction is a symptom of the wrong capture.** Both shipped shots carry zero blur, achieved by capturing from the training account and choosing a harmless dimension. Blur was tried, was readable at the first attempt, and looked censored even once it worked.

**The infrastructure bug this exposed is the more valuable finding.** Asset URLs carried no cache busting, so the browser served a stale stylesheet and script and made a correct build look completely broken. Fixed with a content hash on both tags. In production it would have left every returning visitor on the old stylesheet after any CSS change. Recorded in `CLAUDE.md` as a trap and in the rulebook as a hard constraint.

**And the process lesson, which is the one to carry.** The first version was reported as verified when it was not: styling had been checked by injecting a fresh stylesheet into the page, which proves the CSS works when applied and says nothing about whether the page applies it. **Verify the delivered page, never a patched one.** Now a checklist item.

### Still open, for when the pass actually starts

1. ~~**Dark mode.**~~ **Settled.** Captured light, dimmed in CSS with `brightness(.9) contrast(1.02)` under `:root[data-theme="dark"]`. No second capture pass.
2. ~~**The component does not exist.**~~ **Built 14 Aug 2026.** `shot-box`, `shot-title`, `shot-frame`, `shot-zoom-btn`, `shot-note` and the overlay, in `world-learning.css` plus a lightbox IIFE in `world-learning.js`. The `shot-slot` placeholder idea was never needed, because captures are being taken as sections are written rather than in a later batch.
3. **No conversion tooling on the machine.** Checked 14 Aug 2026: no ImageMagick, no ffmpeg, no working Python, no Node. `winget install ImageMagick.ImageMagick` on capture day. Worst case the site ships PNG and the pages are heavier.
4. **Screenshots are perishable facts.** Adobe redesigns. Each one carries `data-captured` so a future session can tell what has rotted, in the same spirit as the dated-snapshot `warn-box` rule.
5. **Redaction.** Captures come from a real account and will contain real report suite names and real data. Every one needs a redaction check before it ships.
6. **Captions.** Every screenshot gets a note, and if no note can be written the screenshot is not earned. The note points at the thing to look at, states what is absent, or names what changed. It never describes the frame, which is the `alt` attribute's job.

**`CLAUDE.md` gains a short entry about inline slotting once the component exists.** Nothing goes in there before that, per its own supersession rule.

## M14 Analysis Workspace ✅ SIGNED OFF 16 Aug 2026

**Ten sections, 28,187 words, 18 diagrams, 14 screenshots, 11 tables, 30 links to Adobe documentation.** The largest module in the curriculum by a wide margin, and the first to carry product screenshots. Totals: **14 of 21 modules complete, 84 of 116 sections created, QA'd and final.**

The method changed partway through and the change is the reusable part. §1 and §2 were written from Amit's notes on the M12 pattern. §3 to §10 he handed over entirely, and the instruction was to write them as if he had.

### The voice calibration, which is the most valuable thing this module produced

After §3 to §6 were drafted, Amit rejected the prose: *"typical hook style, half sentences and pauses, dramatic, typical AI language."* He was right. The full diagnosis and the six habits that fix it are now recorded in `CLAUDE.md` under Voice, with the paragraph-median table.

Two points worth keeping here rather than there. **The corpus was the calibration, not the theory.** Reading M13 §1 and M11 §2 and measuring them produced a far better answer than analysing Amit's raw notes. And **`CLAUDE.md` already described the rhythm correctly**; the failure was inverting the stated ratio until the beats were the whole texture. A rule can be right and still be applied backwards, so measure rather than assume compliance.

### The external-draft comparison (16 Aug 2026)

Amit commissioned an independent 4,102-word guide on the same subject and asked for a comparison. **Seven trap candidates survived the filter, five were taken.** That is the highest yield since M12, and it confirms the 10 Aug ruling: mechanically deep modules reward the comparison, and M14 is the most mechanical module in the curriculum.

Taken: a breakdown says nothing about order; Unique Visitors do not sum; Unspecified is a finding rather than a row to hide; column-level segments and date ranges are near-invisible; previous period against previous year compares four weekends to five.

Not taken, and why: most of its apparent breadth is our other modules. Segments is M13, calculated metrics M12, attribution M15, CJA M21, bot filters and virtual suites M02. **The module-boundary check did most of the work again**, exactly as on M04.

**One structural idea was worth taking outright.** Its "Ten ways to be confidently wrong" is a better *artifact* than anything we had: a consolidated numbered trap list is what a practitioner bookmarks. Ours now sits at the end of §10, contents drawn from the module rather than copied. It also fixed a problem nobody had named, which is that the module previously ended on performance, the dullest possible last note.

**Where the external draft is behind, for the E-E-A-T report:** it opens with a definition, carries no history at all, gives cohort analysis one bullet against our 2,451 words, cites Adobe nowhere, and used the same wrong share-role labels this module carried until a screenshot caught them.

### Honest review of the finished module, for whoever revisits it

Six weaknesses, none fatal, recorded so they are not rediscovered:

1. **§1 is the front door and the least efficient section**, 4,082 words against a module average of 2,800. The history is the best writing in the module and also the thing between a search lander and an answer.
2. **Ten follow-alongs is two or three too many.** Same failure class as the repeated "floor rather than a ceiling" closer: the sentence was fixed, the structure it sat in was not.
3. **The module teaches every part and never assembles one.** There is no complete, realistic project anywhere in 28,000 words. This is the one real content hole and the thing a learner most wants after §3.
4. **Two of the fourteen screenshots illustrate rather than prove** (§4's visualization list, §8's curation summary), against the standard set by §3's breakdown and §10's four-hundred-rows-on-twenty-four.
5. **§10's trap list is the most useful artifact and sits on the least-visited page.** Structural mismatch with no clean fix inside a ten-section shape.
6. **Recaps are applied unevenly.** §5 recaps calculated metrics properly when refusing them; §3 links props and eVars with no recap at all.


## Design phase, 17 to 18 August 2026

Content work paused after M14 to fix the design before writing M15, on the reasoning that every fix is free while the learning world still 404s and expensive once Google has indexed it. **Sixteen commits, none pushed to `main`, nothing published.**

The plan for this work is `design-plan.html` in the repo root: **105 items**, prioritised, with launch blockers flagged and rejected ideas recorded so they are not re-argued. It supersedes nothing here; this section records what actually shipped.

### Shipped

**Typography, the whole core.** A type scale where there was none: the reading column was 16px throughout, so a section heading measured the same as the sentence under it. Eight tokens with a mobile and a print step. Body to 18px, line-height to 1.7, a five-step spacing scale replacing margins that had drifted across five arbitrary values. Heading rest stops went from 16px to 48px above, a ratio of 1.3:1 to 2.7:1. IBM Plex Sans and Mono, self-hosted, 59KB, because a system stack renders as a different typeface on every operating system and so cannot carry an identity.

**The measure, partially.** 111.6 characters per line measured across 52,686 characters of our own prose, now about 94 at 760px/18px. Short of the 65-75 target and deliberately so: at this type size you can have a 70-character measure, full-size infographics, or one width for prose and figures, but not all three. Infographics won. **TYP-02 is closed as partial, not done.**

**The in-page spine**, on all 116 sections, built from the h3 stack. Read time, the pocket map promoted out of its floating tab, then the heading list. Below 1244px it becomes a drawer on a floating button.

**Heading anchors at build time**, 629 of them, so Google sees them. A JS-injected id gives the reader a jump list and search nothing.

**Authorship.** A byline on every section and a shorter form on all 26 landings, `TechArticle` schema with `datePublished` and `dateModified`, and the name standardised on **Amit G Dusane** across eleven places that disagreed. A section previously emitted `BreadcrumbList` and nothing else.

**The monogram into one partial** after living in six copies, and the About control now carries the mark alone at 88px with no disc.

### What this cost, and the lesson worth keeping

**Seven of the sixteen commits were fixes to my own work**, and Amit found nearly all of them by looking at the rendered page. The pocket map vanished on 27 sections. 163 of 629 nav labels were meaningless. A floating button was white-on-white in dark mode. Two read times disagreed on the same screen.

The pattern is identical every time: **I verified against one page, or one condition, and missed the edges.** Where the whole corpus was measured instead, the numbers held. The rule that comes out of it: *pick regression samples at the edges of a condition, not in the comfortable middle.* A section with ten headings proves nothing about a section with two.

**A second lesson, about the plan rather than the work.** TYP-02 was written as "one CSS value, effort S". In reality the measure, the body size, the figure width and the side rail share one horizontal budget and cannot move independently; it took three rounds and two rejections to learn that. Several other items are scoped the same optimistic way and should be re-read before starting.

### Carried forward

- **`EAT-11`, a launch blocker**: on launch day set both `published` and `lastmod` to the launch date across all 116 sections. The dates were seeded from drafting dates, but none of those pages were ever public, and a date Google can contradict from its own crawl history is worse than no date.
- **`COL-02`, partial**: the accent's deliberate job list — current position in the spine, the `ref-box` as the handoff, the onward link, focus states, ordered-list markers — is still unwritten. What landed on 18 Aug only *reduced* accent usage rather than redistributing it.
- **`CMP-12`, partial**: fixed to 10px at every width, but the corpus still authors SVG text at 8 to 10.5px in 141 places, 16 of them under the ~9px legibility floor. That is an authoring standard, not a layout fix.
- **`CMP-06`**: SVG-*internal* text was outside the contrast audit and has never been checked in either theme.

## The colour and component pass, 18 August 2026

Second working day of the design phase. **COL-01, COL-04, COL-06, TYP-06, CMP-01 and CMP-02 closed; COL-02 and CMP-12 partial.** Commit `23a190f`, one stylesheet and two content files, 219 pages.

**The accent was a framework default and it was also failing.** `#e11d48` is Tailwind's rose-600 verbatim, which was the stated objection — but measuring it found something the plan had not: `.lmain` sets no background, so the reading column paints on `--bg1` (#f8fafc) rather than white, and the accent measured **4.49:1** there. Every inline link in 84 signed-off sections was under AA. It is now `#ba2142`, hue held at 347 so the change reads as a deepening rather than a rebrand, at 5.93:1.

**Then the audit found seven more failures, none of them caused by that change.** `warn-hdr` at 1.91:1 across 103 boxes; `ref-title` and its links at 2.25:1 across 83; `info-hdr` at 3.15:1 across 65; table headers at 2.34:1; inline `<code>` at 2.46:1, still painted in the old rose-400; `--text3` at 2.45:1 wherever it carried text, which includes the visible Last-updated stamp — a trust signal nobody could read; and white on the pocket-map tab at 3.30:1, on all 116 sections. The design plan's COL-06 predicted the box headers specifically and was right.

**The resolution matters more than the numbers, because it collided with a P0/decided item.** COL-03 fixes the semantic colours across every world. Rather than change them, the label voice stopped asking a semantic colour to carry small text at all: the tint, border and icon carry the meaning — they always did, and they are what a skimmer registers — so the label takes primary ink at 14 to 16:1. `--warning`, `--info` and `--success` are untouched. Where a semantic genuinely must carry text there are companion `-ink` tokens, which invert direction in dark for the same reason `--accent2` does.

**Zero AA failures now, across 8 page types × 2 themes**, measured on the delivered page by walking every text-bearing element and compositing the real backdrop.

### Three things this cost, and all three are method

**Testing dark mode by flipping the attribute is invalid, and it produced two confident false failures.** The site's own script also sets `style.colorScheme`, and several components carry colour transitions, so an attribute flip reports UA defaults and mid-transition values. Half an hour went into chasing a white button that was never white. Set `localStorage['site-theme']` and load the page.

**A token cannot be moved without checking every ground it lands on.** Darkening `--text3` for light-mode legibility would have taken `.code-lang` from 6.75:1 to 3.19:1, because the code header is dark in *both* themes. Caught by measuring before shipping, not after — which is the first time this phase that an edge was found ahead of Amit finding it.

**And CMP-12's framing in the plan was simply wrong.** It was written as a mobile problem. At 1280px the three-column shell leaves the article about 574px, so the same arithmetic gave 8.2px on a laptop — worse than the phone once the phone was fixed. It is a narrow-*column* problem. The fix is unconditional rather than sitting in a media query, and print had to invert it, because paper cannot scroll and would have cropped every diagram at the page edge.

## The label voice and the About mark, 19 August 2026 — SIGNED OFF

Amit reviewed the 18 August pass and accepted it with two corrections, then commissioned one new piece of work. **All of it signed off the same day.** Commits `bdab786`, `0b3ca43`, `656679a`, `f7dbe65`.

### The mono label voice was rejected, and the reason is the most useful thing here

The 18 August pass set every box and figure label in mono, uppercase and letter-spaced, following TYP-06 as written. Amit's verdict: **that treatment is a recognisable AI signature.** It appears constantly in LLM-produced HTML, a reader who has seen a few will place it, and a site whose entire claim is sixteen years of practice cannot carry a typographic tell that says otherwise.

His framing is worth keeping verbatim in spirit: he is happy to be transparent that the site is built with AI as a companion, but **AI is not the core engine, and the design must not announce it on his behalf.** The identity has to be the site's own.

What shipped instead: Plex Sans 700, sentence case, `--fs-label` stepped 13.5 → 15px. A label reads as a label through weight and size, not case or tracking — which is how print technical publishing has always done it. Uppercase survives only on table headers and `code-lang`, where it is a convention rather than a style.

**The second correction was that the site had stopped looking crimson**, and he was right. Setting labels to neutral ink had drained the accent off all 124 pro-tip headers. The colour is back, using the `-ink` companions so it is readable rather than merely present.

### The benefit audit, and three changes that failed it

Asked to justify each change against the standing rule — *if something is done without purpose, better it is not done* — three did not survive on their own merits: the mono voice (rejected), the diagram framing (taste, retained), and the accent reduction (a net loss until the colour came back). The rest were genuine legibility defects. **The audit is the pattern worth repeating**, not the outcome: several changes had a stated purpose in `design-plan.html` and still failed, because a stated purpose is not the same as a benefit to the reader.

### IDN-07, a new item: the About mark

Removing the disc in IDN-04 was right but cost the mark its affordance — a bare logo in a corner does not read as a button. It now carries a permanent indigo halo, plus a hover gesture. Two rounds: the first was crimson (fought the navy monogram) and looked like a drawn circle (its gradient died at 78% of the radius while still at .18 alpha, and that surviving step *was* the edge). Recorded in full under IDN-07 in `design-plan.html`.

It also uncovered a real bug: **the hover glow had never fired in dark mode**, because two rules at equal specificity were decided by source order. That is now the second time this session that trap has cost real time.

### Method

**A hidden browser pane freezes transitions and animations**, so hovering an element and reading `getComputedStyle` returns its resting values even when the hover rule matched. It made a working hover look broken three times before the cause was found. To check a hover's *cascade* rather than its *timeline*, neutralise the transition and read again. Added to CLAUDE.md as trap nine, alongside trap eight, which it closely resembles.

---

## The diagram programme, 19-20 August 2026 — COMPLETE, 14 of 14

Amit's call, and it came out of a single observation: the corpus contained **two visible generations of infographic**. Measured, the split was real — July was 76% HTML/CSS box diagrams, August was 66% hand-drawn SVG — and the two were mixed *within* modules, which is why it read as inconsistency rather than progress.

**The cause was not that the old ones were worse. They were quarantined.** Every design pass this phase excluded the diagram internals: of the 64 CSS rules styling HTML diagrams, **none used the type scale**, all 23 font sizes were hardcoded from 10 to 22px, and 45 spacing values were hardcoded. CLAUDE.md records the exclusion in TYP-01's own result. So the gap widened with every improvement elsewhere and would have kept widening.

Amit's decision: **redraw everything in SVG rather than lift the HTML**, accepting that HTML reflows better on a phone, because the diagrams are the differentiator and quality wins. Serial, module 1 through 21, one cycle each.

### `diagram-spec.html` — written first, deliberately

Rules before drawing, so fourteen cycles produce one system rather than fourteen micro-generations. Amit's four reader criteria lead it and outrank every mechanic: does it communicate the story, does it land in two seconds, does it work on phone and desktop, is it attractive. **The two-second test is the one that fails most often** — a figure can be entirely accurate and still fail it.

The four rules that carry the difference: **draw the metaphor rather than label it**; one movement for the eye; wide and short, never tall; the title states the takeaway.

Two corrections from Amit shaped the colour rules, and both are recorded there:

- **No cap on hue count.** The constraint is text, not colour. A shape carrying text takes a soft tint, a saturated stroke and an ink; a shape carrying no text can be fully saturated. Five palette hues (`--dia-a` … `--dia-e`) are fixed in the stylesheet so 21 modules stay one system.
- **Content boxes are filled; containers are not.** Stripping fills entirely "changed the theme of the website". The genuine fault was only ever *nesting* tints — a 10% blue on a 10% crimson wash renders lavender.

### Where it ended

**All fourteen modules are done.** 130 figures in the corpus, down from 141. **125 are SVG and fully conformant; 5 remain HTML, all of them outside the fourteen-module table** in modules 15 to 21.

**Sixteen figures were removed or converted**, none for being ugly. Two were `<table>` elements wrapped in a diagram box, one was an exact duplicate across two sections, several were numbered lists wearing boxes, one was two emoji sitting under a sentence reading "technology is not adopted by diagrams", and the last was a six-row reference table in Marketing Channels §5 that a plain table renders better.

**The verify pass failed 41 of the 46 inherited SVGs it examined**, and the failure was the same one nearly every time: a pre-August generation that hardcoded what the token system now owns. Across the corpus the programme removed 414 hardcoded font stacks, 268 stale accent fallbacks, 200 uses of the dark `--text3` as a light one, 50 raw hex colours, 96 texts below the 11px floor, and 49 uppercase letter-spaced labels.

**The table said Analysis Workspace needed "verification only". It was the heaviest module of the fourteen.** Absence of HTML figures is not evidence of conformance, and a future programme should not read it that way.

**Modules 1 to 5 were completed before `diagram-check.js` existed, and their verification was weaker for it.** A census after cycle 14 found 118 hardcoded font stacks still inside their figures, 106 of them plain `sans-serif`, so those figures were not rendering in Plex at all. They were swept to the current standard at close-out. The lesson is not that those cycles were careless; it is that a written check finds what an eye does not, and everything before it needs re-running once it exists.

### The method lesson, which is the durable part

**A colour sweep is not a colour decision, and this is the sharpest lesson of the programme.** A find-and-replace mapping every legacy `--accent` onto `--dia-a` leaves a module conformant and monochrome. Segments came out 70 per cent one hue with two of five unused; Amit caught it on sight. The repair was not to spread colour around but to find what the module was already about — scope in Segments, the component rail in Workspace — and let the hues encode that. **Where the product already colour-codes something, borrow it.** Workspace had done exactly that in hardcoded hex, which is how the module turned out to hold its own answer.

**Amit caught three faults that every automated check passed**: colour clutter, a section rendering inside an unclosed code block, and a shape striking through the line beneath it. Each time the checks were extended afterwards — element opacity in contrast maths, div balance after scripted edits, text-versus-*every-shape* collision rather than text-versus-rect.

The pattern is not that the checks are bad. It is that **a check can only find what it was built to look for, and a rendered page is the only thing that shows what a reader sees.** Screenshots at the end of each cycle are part of the loop now, not a courtesy.

---

## Back to the design plan, 20 August 2026 — five items, and two finds worth more

With the diagram programme closed, five design items were picked deliberately against a filter Amit set out and which is worth keeping: **no last-leg work, nothing blocked on all sections being written, and no churn to improve today's view.** Four of my first five suggestions failed it — hiding the search button, the landing pages, the journey-phrase sweep, the second home card — and he was right about all four. The rule that survives: pull work forward only when deferring it costs more than doing it.

**CMP-05 and INF-07, dead code.** 80 lines of diagram CSS orphaned by the redraw programme, plus four dead files including a 16KB `guide.css`.

**The useful part was what nearly went with it.** A naive "class appears nowhere" scan returns 68 hits, and among them are `lmod-card`, `lmod-grid`, `welcome-stats`, `stat-val` and `cat-page` — the *landing page* components. They read as dead only because all 26 landing pages are empty. `shot-pending` is the same trap: a documented workflow attribute, unused by design. **Unused and not-yet-used look identical to a grep.** Any dead-code scan on this site has to know which components are waiting for content.

**CMP-11 and CMP-10.** Reduced motion was marked partial because two cases had been handled piecemeal and thirteen transitions plus the home-map keyframe had not. A universal block now covers all three stylesheets, set to `.01ms` rather than `none` so `animationend` still fires and nothing waiting on one hangs. `ref-box` hrefs are expanded in print, where the handoff to Experience League otherwise points nowhere.

**SEO-08, the ledger check, and it found the second orphan it predicted.** Recorded in full above.

**INF-05 and INF-06, done together as both items advised.** Six `hasPrefix` branches across three templates became one `[params.worlds]` lookup keyed on `.Section`, carrying each world's css, js and root; phases moved out of the global namespace a second world would have inherited. Adding CJA is now a config block. Verified hard, because it touches the shell of every page.

### The two finds

**The 18 August accent deepening was applied to one file, not to the site.** `chrome.css` still carried twelve hardcoded `#e11d48` — the rose replaced precisely because it measured 4.49:1 and failed AA — and that file styles the author fab and the About overlay, live on all 116 learning sections. Now `#ba2142`, and the overlay measures 6.21:1.

**It is wider still and deliberately untouched**: `world-shell.css` carries about twenty, `head.html` defines `--crimson:#e11d48` as the global token, and `hugo.toml` still has `brandColor = "#e11d48"` — mis-nested under `[services]` so it does not resolve at all. Those reach the published migration world, so recolouring them is a decision rather than a cleanup.

**The generalisable half:** a sweep that changes a value is only as complete as its file list, and nobody records the file list. This is the third time in two days the same shape has appeared — the print block that reset every token except the diagram palette, the modules verified before `diagram-check.js` existed, and now an accent change that stopped at one stylesheet.


---

## Phase 5 — Small corrections

- Three `description` outliers: `collect/_index.html` (180 chars), `deliver/_index.html` (187), `collect/data-layers/_index.md` (94).
- M17 §4 Processing Data Feeds gains the surface API mention.
- Fix the two stale cross-references in the source documents (rulebook front-matter examples, structure map's M20/M19 slip).

---

## Phase 6 — Learning-world search

Deferred until enough of the section is written to make indexing worthwhile. The button and `/` hint already render at `baseof.html:71-74`; `world-learning.js:3` documents the wiring as a later phase. Work: widen the `Section` filter in `layouts/index.json:2` and add badges for `module`/`lesson`/`glossary`; move `window.SEARCH_INDEX` and `search.js` out of the migration-only branch in `baseof.html:150-160`; add the overlay markup and badge styles; wire `#lSearchBtn`. `search.js` itself needs no changes.

---

## Phase 7 — Hygiene ✅ DONE (verified 20 Aug 2026)

Zero reader-visible value, so it goes last, but it removes traps: derive the hardcoded 13/24/42 stats in `web-sdk-migration/list.html:10-12`; extract `partials/logo.html` (the monogram SVG is copy-pasted 7 times); delete dead code (`static/guide.css`, `static/theme.js`, `partials/header.html`, `partials/footer.html`) after confirming it is unreferenced; fix `brandColor`/`accentColor`, mis-nested under `[services]` so `.Site.Params.brandColor` does not resolve; remove or wire the never-rendered `[menu.main]`; update the stale "21 modules, 116 sections" comment at `world-learning.js:15`.

---

## Phase 8 — Groundwork before CJA ✅ DONE (INF-05/INF-06, 20 Aug 2026)

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

## Open item ✅ ANSWERED

**How do changes reach the live site?** This folder is a dump, not the deploy repo. If a GitHub repo builds via Actions, our edits need a path back into it. Options: you copy files back, you point me at the real repo, or this folder becomes the source of truth and you push it. Writing can start before this is settled; shipping cannot.

---

## The design plan is closed, 21 August 2026

**Amit stopped it.** The design review of 17 August had become a 106-item plan; 35 items shipped, and the remaining 55 open and partial ones were discarded outright rather than deferred, along with the three unbuilt landing-page items.

His reasoning, and it is correct: a simple ask had been elevated to close to 150 points, most of them trivial and many ultimately discarded, and the work had reached the stage of debating with itself about whether its own items were necessary. Website building had stopped. Nothing on the list was adding anything concrete.

**This is the additions-only drift CLAUDE.md already documents, applied to process instead of prose.** Every quality mechanism here can only add — a checklist finds what is absent, a QA gate finds what is missing, a reference comparison finds what is not covered, and none of them can say *cut this*. A 106-item plan is that pathology at scale: every item individually defensible, the aggregate a net loss of momentum.

**What this means going forward.** `design-plan.html` is now a closed record of why shipped design decisions were made and what was rejected. It is never a source of work. Do not reopen the discarded items, do not re-derive them, and do not propose them back — Amit holds what matters and will raise it when the content is finished.

**The next work is content.** 32 of 116 sections remain unwritten, and that is the only front that matters until it is closed.

One thing genuinely on a clock is not a design item: the deprecation warn-box in Classifications §1 expires 31 August 2026. Those dates live in the content itself.

---

## The component and contact session, 22 August 2026

Four pieces of work, and the through-line is that every one started with Amit
looking at a rendered page and naming something that felt wrong.

### The dark block was three components wearing one costume

Measured across the corpus: **86% of the text inside near-black code blocks was
not code.** 33 blocks were genuinely code, 19 were hands-on walkthroughs, 63 were
transcripts of an Adobe settings screen. On Marketing Channel Processing Rules
every one of the ten blocks was a rule configuration, together occupying 19% of
the page's height as dark slabs — and a reader's eye reads "dark means code means
skippable", which is fatal when CLAUDE.md calls the walkthrough the engine of a
section.

Real code kept the terminal. Everything the reader is meant to *do* moved to
`.dothis`, a light panel with two body shapes: numbered steps where order
matters, a field list where it is a finished setup to copy. One component, two
shapes, because Amit's ruling was that these are the same family and should not
become two things to learn.

**47 blocks converted across modules 2 to 14**, module by module with a list
approved before each. Modules 1, 3, 5 and 9 needed nothing. The Analyze phase —
Workspace, Calculated Metrics, Segments — now has no dark blocks at all.

Three things the conversion surfaced that formatting alone would not have:

- **Five ASCII tables** in Classifications were tables pretending not to be,
  space-aligned inside a monospace block and unable to reflow. They became real
  `tbl-wrap` tables.
- **A content defect.** The ownership register in Classifications section 6 had
  an email address sitting in the OVERWRITE column of a table, and a "Notify on
  success" line with no matching failure line. A heading and a label had been
  lost. Amit confirmed the recipient and the label was restored rather than
  guessed.
- **An expired claim**, found by CNT-02: `data-collection/05` said the 1.4 API
  "reaches" end of life on a date eight days past.

An `--avoid` variant was added for the one case where the component's own header
would contradict its content: a rule shown so the reader does *not* build it.
Same panel, amber kicker reading "Avoid this". Used twice.

### The benchmark pass

Amit compared the site against Google Cloud docs and Experience League and asked
whether it still looked fresh. Two of the three suspected causes were wrong: the
light grey ground is Google's own `#f8f9fa`, and our crimson links measure
5.93:1 against Experience League's blue at 5.13:1.

**The real cause was that our reading text was grey and theirs is black.**
Google 15.27:1, Experience League 15.91:1, us 7.24:1. Prose moved to `--text1`
at 17.06:1, and both page titles dropped from 700 to 600 with the section
heading to 550, because size carries hierarchy and weight does not have to shout
as well.

The tinted semantic boxes were left alone on Amit's ruling: the colours have
become the site's vocabulary and readers have learned that blue means one thing
and amber another. Losing that to look current would be a bad trade.

### Icons, and a review that corrected itself

`icon-review.html` laid every icon out, existing against suggested. The argument
it leads with is that **the site already has an icon language** — 24-unit
viewBox, stroke 2, round caps — and the emoji were the only things not speaking
it. Four became drawn tiles across **340 component headers**, modelled exactly on
`path-ico`, which Amit had picked out as the one icon that works.

**Two corrections to my own review, both found while implementing.** The
"thirteen one-off emoji" I recommended removing were not one-offs at all: they
are the cards component's icon set, 28 cards each pairing a chosen glyph with a
title and description. I had sampled by frequency instead of by component and
mistaken a deliberate pattern for noise. All 28 were left alone. And the glossary
carried an `info-hdr` using a book emoji, which a label-based sweep would have
skipped silently.

### Ask Amit

The site had no way to reach Amit at all — one LinkedIn link on the About page.

The framing decided the design. Not "found an error" and not "feedback": both
make the reader an assessor of the site, and a correction prompt on 116 pages
tells every visitor the writing might be wrong before they have found anything
wrong. It is about the reader's question instead, and the address is `ask@`
rather than `support@` or `help@`, because a helpdesk address implies an SLA and
a person does not.

Three surfaces, one overlay, no new floating control: the spine's last entry, and
a bar that **arrives** at two thirds of the article rather than sitting pinned to
the bottom. Amit asked for a permanent mobile footer; the argument against was
that three floating controls already sit on a phone and a full-width bar would
outrank all of them for an action most readers never take. He took the
alternative, then extended it to desktop and had the permanent foot-of-section
line removed — which also dissolved the "nothing follows the ref-box" rule
conflict rather than arguing with it.

The panel offers three peer routes, deliberately equal: copy the address, open a
mail app, message on LinkedIn. Nothing filled, nothing dominant.

Dismissal originally persisted for the session. Amit reported it as a bug and he
was right: the offer is tied to *this* section, so suppressing it site-wide
treats a contextual prompt as a nag. It now lasts one reading pass.

**A real defect surfaced on the way.** `author.js` was the one script referenced
without a `?v=` content hash, so editing it served stale from cache and the new
code silently did not run. Trap 4, and it means any earlier edit to that file
never reached returning visitors. `author.js` and `search.js` are both hashed now.

### Screenshots

`shot-box` lost two nested layers of chrome, and the height cap that was the real
reason a reader had to expand on desktop: the image was clamped to 360px at
*every* viewport. Now 560, so a landscape capture fills the column.

A print bug Amit found on paper: the dark-mode brightness filter on screenshots
survives into print, because **printing does not clear the theme attribute**. A
print taken from dark mode carried a dimmed screenshot onto white paper. The
general lesson is now in the stylesheet: anything that paints for a theme needs
an explicit print reset, because print is not a theme.

**32 screenshot briefs** were then written across modules 1 to 13, each a
`shot-pending` box placed against the heading it illustrates, mirrored into
`screenshot-briefs.md` as a capture checklist. 74 sections were reviewed and most
got nothing. M9 VISTA has none by design — there is no customer-facing screen.

### What the next session should know

- **`ask@amitdusane.com` exists** on Namecheap Private Email. MX, SPF and DKIM are
  correct — DKIM is under the non-standard selector `privateemail._domainkey`,
  which is easy to mistake for missing. **DMARC is still absent** (verified again
  25 Aug), and mail to Gmail was landing in spam; a `p=none` record plus sending
  reputation is the fix.
- **The About page still has no contact block**, and the wording about
  availability for work is Amit's call, deliberately left alone.
- **The migration world has no working contact trigger.** `author.js` builds the
  overlay on every world, but both triggers are created by `world-learning.js`,
  which only loads on the learning world. Flagged, not fixed.
- The reading-progress hairline came up again and was declined again. It is
  `REJ-03`, and the reasoning still holds: the spine already shows position by
  heading, which is better than a bar. The one thin spot is mobile, where the
  spine is a drawer — if it ever matters, the fix is the page-nav button carrying
  progress, not a fourth piece of scroll-driven chrome.

---

## The mobile session, 25 August 2026

Started as one complaint — a screenshot too large on a phone — and ended with a
property of the whole learning world: **on a phone the reader scrolls only
vertically.** Nobody set that as an objective. It fell out of fixing one thing
properly and then asking each time whether the fix generalised.

### What was wrong, and why it mattered more than it looked

31 of the 113 tables ran wider than the 339px a phone gives the column, the worst
hiding 41% of itself. The find that justified the whole day came from asking
*which* column was falling off. It was the same column every time: **Data layer
path**, **Include it?**, **Forgiven?**, **Best for**, **Why**, **Where to look**,
**Durability**. Tables put the label on the left and the verdict on the right, so
horizontal cut-off does not remove a random 40% — **it removes the judgment**, and
leaves the reference data Adobe already publishes.

And a cut-off table does not look broken, it looks complete. There is no scrollbar
on touch. The reader forms a conclusion and leaves with a wrong answer rather than
a partial one. That is the site's own silent-failure theme, sitting in the
furniture. It was reaching the majority of readers: production GA shows **over 60%
of traffic on mobile**.

### The order of levers, which was measured rather than guessed

Fitting a table has three levers and they are not equal. On the worst table,
cutting type 14.5px → 12px bought **18px**; cutting horizontal padding 12px → 6px
bought **48px**. Once identifiers break, a column is its longest *segment* plus its
padding, and padding is a large share of a narrow column. So the ladder is
**breaks → padding → type**, each rung climbed only if the table still does not fit.
Result: 111 of 113 fit, **110 keeping full size**, only 3 needing any type change.

Breaks are logical, never arbitrary. `overflow-wrap:anywhere` was tried first and
rejected on sight — it fits every table by breaking words mid-syllable. The
replacement inserts `<wbr>` at separators (`. _ : / \ = & ? ; , | + -`) and at
camelCase boundaries, so `digitalData.page.pageInfo.name` comes apart at its dots
and `linkDownloadFileTypes` at its capitals. **`<wbr>` not a zero-width space**: a
ZWSP is a real character that rides into the clipboard, and on a site where people
copy variable names out of tables that hands them a string that looks right and is
not.

Amit set the floor: **12px, and no lower**. Two tables sit on it and still scroll
by about 20px. Both are four columns of ordinary prose with nothing left to break;
`hyphens:auto` was tested and does not help, because hyphenation opportunities do
not feed min-content in table layout — the same reason `overflow-wrap:break-word`
moved the worst table 576px → 576px while `anywhere` moved it to 339px.

### Figures, and two bugs the pilot had been hiding

The ECID diagram-zoom pilot went site-wide: 126 diagrams and 43 screenshots, each
with a control and a hint. Dropping the `diagram-zoomable` and `code-wrap` marker
classes rather than stamping them into 183 places meant **the whole roll-out was
two files and zero content edits**.

The roll-out exposed what one page could not. The JS-inserted `.diagram-frame`
wrapper had silently broken every `.diagram-box > svg` selector, and those rules
are CMP-12 — so the `--diagram-min` floor had quietly disappeared. On screen a
figure rendered 614px instead of 700 at 1280px, scaling authored 11px text to
9.6px. **On paper it was worse**: the print rule that releases the floor also
stopped matching, which would have run every printed diagram off the page edge.

M02 §2 turned out to be the corpus's only **mixed figure**, an svg timeline plus
three HTML bars. The frame took the svg alone, so the border enclosed the timeline
and left the bars outside it, and expanding showed half the figure. The frame now
takes everything from the svg to the end of the box.

A rotation experiment for wide diagrams on portrait phones was built, measured,
and **removed at Amit's call** — the whole diagram fitted and stayed readable, but
asking a reader to turn their phone is a worse deal than a swipe. Recorded because
the measurements are sound and the conclusion still stands: you cannot show a
700×130 drawing whole *and* readable on a 390px portrait screen.

### Print, where three defects were closed

1. **The `.print-doc` layout-cell leak** — see trap twelve in `CLAUDE.md`. Written
   as `.print-doc td`, a rule meant for content tables restyled the entire page.
2. **`.path-title` printed pale lavender on white** from dark mode, because its
   colour is a hardcoded hex rather than a token.
3. **Content tables had no vertical rules at all** — only `border-bottom`. Fine on
   screen, unreadable on paper once cells wrap. They now print a full grid.

### Components

Six `.comparison-grid` placements were three different things: bare on three
pages, wrapped in `.compare-card` on one, inside a `diagram-content` figure on two.
The component now carries its own card in tokens. `.compare-card` is deleted, and
with it a hardcoded `background:#ffffff` that rendered a **white slab in dark mode**.

### The state at close

Verified across 144 pages in both themes, 22,222 elements each: **no figure,
screenshot or code block scrolls sideways anywhere.** Two tables scroll ~20px at
the type floor, and two pages carry a 5–7px page-level drift from chrome
(`.wf-rail` on data-layer-design, `.lhead` on glossary) — both pre-existing,
both inspected by Amit and judged acceptable.

**32 sections remain unwritten** and that is still the front that matters:
M15 Attribution 4, M16 Data Warehouse 4, M17 Data Feeds 4, M18 Activity Map 4,
M19 SDR 6, M20 Testing & Debugging 5, M21 CJA 5. M15 §4 still needs its title
coined. Launch target is **end of September**.

---

## M15 Attribution Models, 26 August 2026 — WRITTEN, §1 SIGNED OFF

Four sections written from scratch. The module also produced the first real
correction to how I write for this site since the M14 voice calibration, and one
architectural ruling that closes a question I raised twice and got wrong twice.

### The ruling that matters most: shape versus analyze

I flagged M10 §4 Channel Attribution as duplicating M15, twice, and recommended
trimming it. **Amit rejected that, and his reasoning is better than mine.**

Marketing channels and attribution are not the same kind of thing, and the site's
own category structure already says so. **Marketing channel rules shape the data.**
They run at collection time and hardcode a channel value into the hit,
permanently, which is why M10 sits in `/shape/`. **Attribution changes nothing.**
It re-reads the same stored data every time the report runs and answers
differently as you move the settings, which is why M15 sits in `/analyze/`.

So attribution appearing in both modules is the architecture working, not drift.
M10 needs a full attribution discussion because a marketing channels module is
incomplete without one. A learner arriving at M15 later understands why it was
raised there and is being treated properly here. Amit's phrase: let attribution
sit in Marketing Channels as the junior brother.

**This question is closed. Do not propose the trim again.** It looks like
duplication to any mechanical check, and it is not.

### Amit's larger claim about the module, which is the identity of M15

His reading, and it is worth holding on to: **this is the first treatment he has
seen that writes about attribution on its own rather than as a sub-topic of
marketing channels.** Search the internet and attribution is always discussed as
a channel feature. It is in fact a distinct concept in data analytics and it
carries value by itself.

The CJA design supports this more strongly than the claim itself does. **The two
swap places in CJA.** In Adobe Analytics, marketing channels get a whole
subsystem (Channel Manager, a rules engine, engagement periods, and the First and
Last Touch Channel dimensions with frozen models) and attribution arrived later
as a report-time toggle. In CJA there is no Channel Manager: marketing channels
become a derived field, one of many, while attribution is promoted to a
**component setting held on the metric in the data view**, so it applies wherever
that metric is used. Attribution moved into the semantic model. Channels moved
out of admin.

Two details confirm it. CJA's attribution containers are Session, Person, and in
B2B, Global Account, Accounts, Opportunity and Buying Group. Attributing credit
to a buying group has nothing to do with media at all. And the CJA lookback
reaches 13 months in B2B, against the hard 90 day ceiling in Analytics that M15
§3 spends a heading working around.

**One precision worth keeping.** Adobe *does* state the general framing, once:
the attribution overview says a touch point can be any dimension, metric, channel
or event. Then every tutorial, and the Attribution Panel documentation itself,
demonstrates only the channel case. The fact is documented and never taught.
That gap is what M15 exists to fill.

**Consequence for M21.** CJA gets a natural spine from this: the things Analytics
treats as fixed, including where attribution lives, are the things CJA moves.
That is a better opening than defining what CJA is. §1 and §4 of M15 each carry a
short forward-looking mention of CJA, deliberately unlinked because M21's
sections have no `description` yet. **Add the links the day M21 ships.**

### The language correction, and why my own checks passed while failing the reader

The first draft was conceptually right and hard to read. Amit's diagnosis: it
reads like a movie script, where the first pass does not land, the second does,
and the third makes you admire the sentence construction. His test is the one
already in `CLAUDE.md` and I was not applying it at sentence level: **you are
sitting with a colleague who knows nothing about the topic, explaining it.**

The sentence he picked out is the whole diagnosis:

> Sitting immediately above the window in every one of the three places
> attribution is configured is a control that can silently overrule it, and its
> two options are not two flavours of the same thing.

Subordinate clause in front, subject delayed to the end, a metaphor closing it.
Everything to admire, nothing to understand on first read. It became:

> Just above the lookback window there is a second setting called the container.
> It has two options, Visit and Visitor, and picking the wrong one can cancel
> your window without telling you.

**The measurable failure, and it is a lesson about the verification itself.**
`CLAUDE.md` says to measure paragraph medians against M13 §1. I did, and passed.
Paragraph length was never the problem. Nothing in the check measured sentence
difficulty, so the draft cleared every gate while being hard to read.

| | Sentence median | Over 30 words |
|---|---|---|
| First draft | 23 to 25 words | 22 to 26% |
| After rewrite | 12 to 15 words | 4 to 8% |
| M13 §1 benchmark | 12 words | 10% |

**Add sentence median to the voice check, not just paragraph median.** Target the
low teens, and treat anything over about 34 words as needing a split.

Amit also ruled against three things that had crept in and that the existing
guidance arguably invites: **typical hook openers, dramatic one-sentence pauses,
and cause-and-effect rhetorical chains.** Openers are now plain situations told
the way you would tell a colleague, with no staging.

### Diagrams carry labels. The prose does the explaining.

Second correction, and it was a genuine misuse of the component. The figures had
become a second place to write prose. One carried 24 text elements including full
explanatory sentences under the drawing. **If a diagram has to be explained, the
content does that work, not the diagram.** Labels, and at most one short line of
takeaway.

Text elements per section after the fix: 24 to 16, 38 to 25 across two figures,
18 to 13, 15 to 11. Heights came down with them, 300 to 216 and 276 to 232, so
the figures also stopped being things to scroll past. Amit rated the M15 §3
lookback timeline the best figure on the site, and the fix did not touch what
makes it work.

### The closing-heading formula, found by Amit and only half fixed

Every M15 section closed on "What you have now". He caught it as a pattern a
clever learner would spot, and the count was worse than it looked: **18 sections
in the corpus close on that phrase, and 12 of them are in the two modules I
wrote.** M14 uses it on 9 of its 10 sections. M13 Segments, by contrast, never
uses it once and names every closer after that section's own conclusion.

`CLAUDE.md` offers "What you have now" as the first of three example phrasings.
An example became a default. M15's four closers are now specific to their own
content: "Credit is shared, not measured", "Three shapes, and two rules
underneath them", "The window decides what exists", "Consistency beats a perfect
model".

**M14's nine are still there.** It is signed off, so it was left alone. If it is
ever done, the fix is nine headings and touches no prose.

Related, and left alone deliberately: all four walkthroughs open "Follow along:",
as M14's nine do. That reads as furniture rather than a tic, the same as every
`path-box` saying "Where to find it in Adobe Analytics". Flagged to Amit, no
change requested.

### Facts established against Experience League

- **Report-time attribution ignores eVar allocation and expiration entirely.** It
  rebuilds persistence from the raw hits across the lookback window. Verified in
  two Adobe sources. The corollary nobody states: **a prop can be attributed**,
  and gains a 90 day memory it never had at collection time.
- **Attribution is unsupported on**: all calculated metrics, Unique Visitors,
  Visits, Occurrences, Page Views, A4T metrics, Time Spent, Bounces, Bounce Rate,
  Entries, Exits, Pages Not Found, Searches, Single Page Visits, Single Access.
  Amit's field note is that every practitioner hits this wall and finds the
  option missing. The reason is that a page view is not an achievement anybody
  competed to cause, so there is no credit to divide. This is an unlearning and
  it is now its own heading in §1.
- **Calculated metrics being on that list catches people twice.** Attribution is
  set on the metrics *inside* the definition, never on the finished calculated
  metric, which also buries the model where no column reader can see it.
- Two-touch-point journeys collapse the positional models: U-shaped to 50/50,
  J-curve to 75/25. A single touch point takes 100% under every model. The
  lookback ceiling is 90 days and Custom Time does not lift it.
- **Days Before First Purchase** and **Time Prior to Event** are the two
  dimensions that turn the lookback window from an opinion into a measurement.

### STILL OPEN: M03 §2 eVars contradicts M15 §1

`foundations/variables/02-evars-conversion-variables.html` closes by arguing that
report-time attribution can overrule allocation but never expiration, and advises
spending the design argument on expiration. **That is wrong for the Workspace
case it is describing**, per the finding above. It remains correct for classic
reports, feeds and warehouse extracts.

M15 §1 links to that page for where the settings live, so **a reader following
the link is currently contradicted.** It needs one paragraph rewritten. Amit has
not ruled on it; it is signed-off content and was not touched.

### A component fact nobody had discovered

`.pro-tip`, `.info-box` and `.warn-box` are **single-paragraph components**. Their
paragraphs are set to `margin:0` in the stylesheet, so a second `<p>` renders
butted against the first with a zero pixel gap. A scan of all 117 sections
confirms none has ever held more than one. `.path-box` is the exception at
`5px`. Put continuation prose after the box, in normal flow.

### Where the module stands

§1 read end to end by Amit and **signed off**. §2, §3 and §4 written and verified
but not yet read by him. Six screenshot placeholders carry full briefs and are
mirrored into `screenshot-briefs.md` as shots 33 to 38.

Verified throughout: 219 pages, div balanced, zero dashes, zero first person,
zero contractions, all internal and Adobe links resolving, no horizontal overflow
at 375px in either theme, every diagram colour at 5.71:1 or better in dark, all
30 spine labels rendering whole with no `data-nav` overrides needed.

**28 sections remain unwritten**: M16 Data Warehouse 4, M17 Data Feeds 4,
M18 Activity Map 4, M19 SDR 6, M20 Testing and Debugging 5, M21 CJA 5.
Launch target is still **end of September**.

### Closing headings, the rest of the corpus (26 August 2026)

Amit's ruling after the M15 fix: **do not make it a rule in either direction.**
Keep "What you have now" wherever it earns its place, repeat it where that makes
sense, introduce other repeatable phrasings freely, and write a bespoke heading
where the section deserves one. Give justice to the section, not to the rule.

The problem was never the phrase. It was repetition inside a stretch a reader
actually traverses. So the fix was scoped by that test rather than applied
everywhere.

**M14 Analysis Workspace, 9 of 10 sections.** Seven now carry a heading naming
their own conclusion: "A tool that refuses nothing", "Read the arrangement
before the number", "Every chart is a drawing of a table", "The suspicion this
teaches", "Calibrate it before you trust it", "The dull part decides whether it
gets used", "The whole of the handover problem". §2 and §6 keep "What you have
now" deliberately, spaced apart, because both blocks really are an inventory of
what the section built.

**M02 Report Suites §6 and §7 were adjacent**, which is the only other place a
reader meets it twice in a row. §7 became "All three fail quietly", which is the
section's own through-line and fits the silence theme better than the generic
heading did.

**Four singletons were left alone** on purpose: M06 §8, M05 §4, M07 §5, M10 §3.
One use inside a module is invisible and the heading is a good one.

Seven uses remain across the corpus, never more than two in a module and never
adjacent. Verified that no internal link anywhere targets a `#what-you-have-now`
anchor, so renaming broke nothing; the learning world is unpublished in any case.

---

## M16 Data Warehouse and M17 Data Feeds, 26 August 2026 — WRITTEN

Eight sections, written back to back, and the first modules on this site that are
about **features rather than ideas**. Amit set that distinction explicitly: M15
was philosophy and answering hard questions in a meeting, and these two have to
make somebody comfortable operating a thing.

### CORRECTION: the module numbers in this plan were wrong

Two earlier entries in this document said "M16 Activity Map, M17 Data Feeds,
M18 Data Warehouse". **The shipped code says otherwise, the code wins, and both
entries have been corrected in place:**

| Module | Number, per `_index.md` and `hugo.toml` |
|---|---|
| Attribution Models | 15 |
| **Data Warehouse** | **16** |
| **Data Feeds** | **17** |
| **Activity Map** | **18** |

The error came from reading the tracker's row order rather than `modulenum`. Amit
called Data Warehouse "module 16" and was right. **Activity Map is M18 and is
still unwritten.**

### The spine each module was given

**Data Warehouse: explain the name literally.** Amit's instruction, and it turned
out to be the best organising idea available. A real warehouse is not somewhere
you browse. You send an order in advance, somebody picks it, and it is delivered
to you in bulk. Analysis Workspace is the shop, where everything on the shelf is
everything there is. That metaphor predicts every limit of the tool before a
reader meets it: no clicking into a result, a wait measured in hours, and total
indifference to how many rows you asked for.

The counterweight sits right after it, because the name misleads anyone with a
data engineering background: **Adobe's Data Warehouse is not a data warehouse in
the modern sense.** No connection string, no SQL, no table to query, no live link
for a BI tool. It is a request and delivery service in front of a bulk copy. The
name describes the storage, and people hear it as describing an interface.

**Data Feeds: the image request is literally one row.** Amit's line, and it is the
spine of the module. Everything the curriculum has taught about collection lands
here as rows, and every number ever argued about was produced by counting them.
The module connects collection to presentation, which no other section does.

His second instruction was equally important and unusual: **be honest that raw
data has little direct value.** Nobody answers a business question by opening a
file with several hundred columns and no header row. The value is knowing the
layer exists, which changes how a reader holds every report above it and gives
them somewhere to go when two tools disagree. That is written as its own heading
rather than softened.

### The strongest teaching idea the research turned up

**The `post_` prefix is the processing chain made visible.** Many fields appear
twice in a feed: `evar1` holds what the browser sent, `post_evar1` holds what
Adobe made of it. Everything server side lives in the gap between them: VISTA,
processing rules, persistence, currency conversion. Compare two columns on one
row and you can see exactly what a processing rule did.

That makes the feed the best implementation debugging instrument in the product,
and it pays off M08 and M09 years after a reader met them. Adobe documents the
prefix in a reference table and never draws the conclusion.

**Second finding, for M17 §4:** reproducing standard metrics from raw rows is
genuinely hard, and that is the proof of Amit's "raw data is not free value"
point. A visit is a distinct combination of four columns. Unique visitors is a
concatenation of two. Matching Adobe at all requires discarding rows by
`exclude_hit`, `customer_perspective`, `hit_source` and `duplicate_purchase`.
None of that is obvious and all of it is documented in one place nobody reads.

### Continuity the corpus had already promised

`props-traffic-variables` already told readers that "every server call your site
sends becomes one row (the full structure is Data Feeds)". `appmeasurement-library`
promised that identity stitching "gets unpacked in Data Feeds". Both promises are
now paid off. `classifications-overview` had already established that classified
values reach Data Warehouse but not feeds, which became a real reason to choose
one export over the other rather than a fact stated twice.

### Shape of the writing, against M15

Feature modules came out shorter and more practical, which is correct. Read times
are 7 to 9 minutes against M15's 10 to 14. Sentence medians 10 to 15 words,
matching M15 and M13 §1. Every section carries a `dothis` walkthrough, including
the two with no Adobe screen at all, because the exercise is the point in both:
find your own Low Traffic wall, and find your own hit in the raw data.

Closing headings are all specific and none repeats: "Order it, do not browse it",
"Say what one row is, then build", "A file nobody collects is not a report",
"Complete, classified, and delivered elsewhere", "The bottom of the stack",
"A feed is a standing instruction", "The raw row is the source of truth",
"Nothing here is free".

### Verified

219 pages. 116 sections source-to-build checked, 0 mismatched. All 51 headings
render whole in the spine or cut cleanly at a joint; none truncates and none
needed a `data-nav` override. No horizontal overflow at 375px, including the nine
row column reference table, which fits at full type because the mobile machinery
breaks `post_visid_high` at its underscores. Every diagram colour measures
5.71:1 or better in dark. Zero dashes, zero first person, zero contractions, no
multi-paragraph callout boxes.

### Where this leaves the section

**Written: 100 of 116 sections.** 16 remain: M19 SDR 6,
M20 Testing and Debugging 5, M21 CJA 5.

M15 is written and awaiting Amit's screenshots before QA sign-off; only §1 is
signed off so far. M16 and M17 are written and unread. Launch target is still
**end of September**.

---

## M18 Activity Map, 26 August 2026 — WRITTEN

Four sections, written in the same pass as M16 and M17 and in the same style.
Amit has not read M16, M17 or M18 yet; all three are written and unreviewed. He
asked for M18 to be completed while he worked on other things.

### The spine, and the unlearning that carries the module

The obvious framing for Activity Map is "the click overlay", and that framing is
what makes most implementations of it useless. The module is built on the
opposite claim: **the overlay is the shop window and the four dimensions are the
product.**

`Activity Map Link`, `Activity Map Region`, `Activity Map Page` and
`Activity Map Link By Region` are ordinary dimensions. They segment, trend, break
down and take conversion metrics like anything else. The overlay can do none of
that. Most teams install the extension, look at a page, and never once put the
dimension into a report where it could be compared.

**Web SDK proves the point better than any argument.** Web SDK collects Activity
Map data through `clickCollectionEnabled`, on by default, so all four dimensions
populate normally. The browser overlay is **not supported on Web SDK at all.** So
a migration keeps every piece of analysis and deletes the picture. That matters
for this site specifically, given the migration world sitting next door.

### The two findings worth keeping

**Single page applications break the page dimension.** Activity Map watches for
DOM changes rather than page loads, which is what lets it work at all on a modern
site. What it does not do is re-establish which page it is on: clicks on views
reached without a browser reload are attributed to the page value from when the
view first loaded. Link and region names stay correct. The page is wrong and
nothing in the report says so. Any page-level breakdown on an SPA is suspect, and
the workaround is explicit `s_objectID` names carrying their own context.

**`<button type="button">` is never tracked.** Nor are anchors without a valid
href, nor inputs without a src. That is precisely what a React or Vue component
library produces, so on a modern site the most important interactive elements can
be missing from a report that looks complete. There is no empty row to notice.

### Where the data quality actually comes from

Not from Adobe. Link names are derived from the markup: visible text, input
value, or image alt. That fails three ways on every large site, and all three are
in the module: repeated generic text (forty links called "Learn more" collapse
into one row), no text at all (icon buttons), and text that changes (prices,
counts, personalised labels fragment one link into thousands of values).

`s_objectID` overrides the derived name and is the highest-value change
available. Twenty or thirty named elements is enough. Regions come from the
nearest ancestor `id`, so framework-generated ids produce worthless regions and
`regionIDAttribute` is the way out.

### Verified

219 pages. 116 sections source-to-build checked, 0 mismatched. All 26 headings
render whole in the spine, none truncated. 12 internal links resolve. No overflow
at 375px including the code block and the five-row element table. In dark mode
the only `--on-accent` text sits on a `--dia-b` fill at 7.02:1, and 5.17:1 in
light. Sentence medians 13 to 15 words. Read times 7 to 9 minutes.

Two screenshot briefs, shots 44 and 45. §1 and §4 get none: §1's figure does that
section's teaching, and §4 is judgment with no screen behind it.

---

## M19 SDR is deliberately NOT to be drafted

**Amit's instruction, 26 August 2026, and it is a hard stop.**

Do not write the Solution Design Reference module from market standards or from
Adobe's suggested format. There are generic SDR templates circulating and Adobe
suggests one, and drafting from those would produce exactly the generic content
this site exists to avoid.

**Amit built SDR templates while he was at Adobe. They were widely adopted and
became de facto standards, and he has searched and cannot find them published
anywhere.** He holds them and wants the module treated carefully on that basis.

So M19 waits for his material. A future session that reads the tracker, sees six
unwritten SDR sections and starts drafting would be actively destroying the one
thing that makes that module worth publishing. **Ask him for the templates; do
not substitute research for them.**

This is the same principle as the working agreement in `CLAUDE.md`: content is
written from Amit's notes when he supplies them, and the gotchas and scars are
the raw material only he has. M19 is the strongest case of it on the whole site.

### Figures, after Amit's review of M16, M17 and M18 (26 August 2026)

Three observations, all measurable and all correct.

**The new modules were 41 to 45% shorter than M15.** M15 sections average 1,703
prose words; M16 averaged 1,004, M17 1,017, M18 936. Amit's instruction was not
to pad them, so the length was left alone and the dryness treated as a figure
problem instead, which is what it mostly was.

**Figure density had collapsed.** M15 carries 5 figures across 4 sections. M16
had 2, M17 had 2, M18 had 1. **Eight of the twelve new sections had no figure at
all**, so they read as a wall of prose. This was an overcorrection: after the
"diagrams are too text heavy" note on M15, I stripped text out of figures and
also stopped drawing them.

**Some figures were still descriptive.** The measurable test is the longest text
string inside a figure. M15's figures top out at 9 to 11 words. The new ones
carried 13, 14 and 19-word explanatory sentences, and the Data Warehouse §1
figure had **three stacked at the bottom**, which is a paragraph inside a diagram.

**Fixed:** every descriptive line trimmed to a label or one short takeaway, and
seven figures added so all twelve sections carry one. Every figure now maxes at
9 words, matching M15.

The seven added, each drawn because prose is bad at that particular idea:

| Section | Figure |
|---|---|
| M16 §2 | Metrics widen the table, dimensions multiply it: 400,000 to 80 million to 7.2 billion |
| M16 §3 | The delivery timeline, showing the manifest arriving last |
| M17 §2 | A Monday hit arriving on Wednesday, and the lookback window reaching back for it |
| M17 §4 | The four exclusion filters as a shrinking cascade |
| M18 §2 | Derived name against `s_objectID`, as two routes from one element |
| M18 §3 | Link merging three regions into one row, against Link By Region keeping them apart |
| M18 §4 | Three views, no page reload, all reporting as the entry page |

**The durable rule, and it is now measurable rather than a matter of taste:**
a figure carries labels plus at most one short takeaway line. **Nothing inside a
figure should exceed about 10 words.** If an idea needs a sentence, it belongs in
the prose. Check it with a one-line grep over `<text>` contents rather than by
eye, because the drift is gradual and every individual line looks reasonable.

Verified after the change: 219 pages, all 12 diagram-box counts matching between
source and build, no overflow at 375px, every diagram text colour 5.71:1 or
better in dark, figure heights 180 to 224 with at least 10px below the last
baseline, no hardcoded hex, no presentation-attribute fills.

### A collision detector for figures (26 August 2026)

Amit spotted by eye that the M16 §1 figure had a label sitting on top of two
boxes. He was right: the "same shape" label on the dashed connector rendered 59
units wide, and the gap between the two boxes it sat between is 42.

That label was mine, added when the connector moved during the text trim. It is
the kind of fault no existing check catches. The source is valid, the build is
clean, contrast passes, nothing overflows, and the figure still measures within
every rule in `diagram-spec.html`.

**There is now an automated check for it.** Render each figure into a detached
node, call `getBBox()` on every `text` and `rect`, then flag two things: any two
text elements whose boxes overlap, and any text overlapping a rect whose centre
is not inside that rect. The second condition is what separates a label sitting
correctly inside its own box from one colliding with somebody else's.

Verified by re-injecting the removed label and confirming the detector flagged
exactly the two boxes Amit saw. All 12 figures in M16, M17 and M18 pass.

**Run it after drawing or moving anything inside a figure.** Arithmetic on
coordinates is not enough: rendered text width depends on the font and cannot be
predicted from the number of characters, which is precisely how this one got
through.

### Modules 15 to 18: content signed off, screenshots are the only blocker (26 Aug 2026)

Amit has now read all four modules. **Content is approved with no edits on 16, 17
and 18**, and 15 was approved after the plain-language rewrite and the three
practical corrections from his own product testing.

**All sixteen sections remain `Content QA'd? = No`, and that is correct.** His
rule: QA is not complete until the screenshots are in. Nothing gets marked until
the images land.

**One flag corrected.** M15 §1 had been set to QA'd and Final on the strength of
his "finalized" comment about the prose. That predates his rule about
screenshots, and §1 still has a pending shot, so it has been put back to No. The
tracker now says what it should: 100 sections written, 84 QA'd, 32 outstanding.

**13 shots outstanding across the four modules**, briefed in the page files and
listed in `screenshot-briefs.md` as shots 33 to 45. That file now also carries a
capture-day list grouping all 13 by where in the interface they are taken, so the
session is one pass per screen rather than thirteen trips around the product.
Five come from one Workspace freeform table, two from a single built Attribution
panel, two from one Data Warehouse request form, and two are not Adobe screens at
all.

Three need data set up before capture rather than during it: the Attribution
panel needs journeys with several touch points or it builds almost nothing, and
the None and Low Traffic shots both need data that actually produces a large row.

### Modules 15 to 18 signed off, 30 August 2026

Amit has signed off all 16 sections. Every one now reads `Content created = Yes`,
`Content QA'd = Yes`, `Final result = Yes`.

**The corpus is at 100 of 116 sections written, and all 100 are signed off.**
There is no longer any gap between written and QA'd; the two numbers have
converged for the first time. 16 sections remain, all of them unwritten:
M19 SDR 6, M20 Testing and Debugging 5, M21 CJA 5.

**The duplicate seotitle in M11 is not a defect and should not be re-raised.**
The SEO audit flagged that the Classifications module landing and Classifications
Overview share "Classifications in Adobe Analytics". Amit's ruling: one of the two
is a landing page, landing pages are not written yet, and nothing on them has been
reviewed. Their titles and descriptions will be set when the landing pages are
done, which happens after the remaining sections. Until then, any SEO check will
keep finding collisions between landings and their first section, and that is
expected rather than wrong.

**What that leaves before launch**, none of it section writing:

- 16 sections across M19, M20, M21. M19 is blocked on Amit's SDR templates.
- 27 landing pages: 21 module landings that are front matter only with no body
  at all, 5 category landings, and the glossary.
- The home page has no route into the learning section. `layouts/index.html`
  carries one `.tcard` pointing at the migration guide and does not contain the
  string `adobe-analytics-learning` anywhere.
- M11 §1's deprecation warn-box goes stale on 31 August 2026.
- M03 §2 still contradicts M15 §1 on whether attribution can overrule eVar
  expiration.

The screenshot programme is closed and the pre-merge guard is satisfied: no
`shot-pending` and no `data-newblock` anywhere in content.

---

## Session close, 30 August 2026

The largest single day on the project. **16 sections written, reviewed, corrected
and signed off**, taking the corpus from 84 to 100 of 116.

### What shipped

**Four modules, in curriculum order.** M15 Attribution Models, M16 Data Warehouse,
M17 Data Feeds, M18 Activity Map. All 16 sections are `created`, `QA'd` and
`final`. 18 of 21 modules are now complete and no module is half-finished.

**Eight screenshots**, blurred, metadata-stripped, archived and live. The
screenshot programme is closed at 51 across the site.

**Both pre-merge guards are satisfied for the first time**: no `shot-pending` and
no `data-newblock` anywhere in content.

### The three corrections that changed how the work is done

**Plain language, and the check that was measuring the wrong thing.** Paragraph
median passed while Amit had to read sentences three times. Sentence median was
23 to 25 words against M13 §1's 12. Both measurements are now in `CLAUDE.md`
under Voice, with the before-and-after sentence that diagnosed it.

**Figures carry labels, not sentences**, capped at about 10 words. Then the
overcorrection: after text was stripped out of figures, the next three modules
were written with almost none, and eight of twelve sections had no figure at all.
Both rules are now in `diagram-spec.html` with a revision entry.

**Closing headings had become a formula.** "What you have now" closed 18 sections,
12 of them in the two modules written by me. M14's nine and M15's four were
renamed to name each section's own conclusion; seven scattered uses were left,
because one use inside a module is invisible.

### Facts established, all verified against Experience League

Report-time attribution ignores eVar allocation and expiration entirely, so a
prop can be attributed. Attribution is unsupported on traffic metrics and on
calculated metrics as a whole. Data Warehouse takes its name from bulk storage
and is not a queryable database. Data feed `post_` columns are the processing
chain made visible. Activity Map's overlay is unsupported on Web SDK while the
dimensions keep working.

Amit's own testing added four Data Warehouse corrections the documentation does
not carry, including that a custom date range disables scheduling and that a
cloud destination makes the notification address mandatory.

### Still open, and the first three are short

1. **M11 §1's warn-box goes stale on 31 August 2026.** One day away.
2. **M03 §2 contradicts M15 §1** on whether attribution can overrule eVar
   expiration. One paragraph, on a page M15 §1 links to.
3. **The home page has no route into the learning section.** One `.tcard`.
4. **27 landing pages**, 21 of them front matter with no body. Amit has said
   these are mine to write without his input; he will QA them.
5. **16 sections**: M20 Testing 5 and M21 CJA 5 are mine. **M19 SDR 6 is blocked
   on Amit's own templates and must not be drafted from market generics.**

### Open question, deliberately unresolved

Data Warehouse delivery frequency. Amit is certain from experience that Yearly is
not offered and the ceiling is Quarterly. Adobe's scheduling page, read twice
with different prompts, lists Hourly, Daily, Weekly, Monthly, Yearly and contains
"Quarterly" nowhere. Nothing about frequency was written into the content, so
neither claim is published. **Do not add the frequency list from Adobe's docs
without asking him**, because his product testing outranks the page.

### Next session

Take the M11 expiry and the M03 §2 contradiction first, both short and both
already late, then M20 Testing and Debugging.

---

## Session close, 30 August 2026 (second session)

**Module 19, Solution Design Reference, written in full.** Six sections, from
Amit's own account of how he rebuilt the BRD, SDR and TSD during his years at
Adobe, plus five real client workbooks supplied as reference.

### What shipped

**Six sections**, all `Content created = Yes`, all awaiting Amit's QA.
What Is an SDR, Business Requirements Document, SDR Structure, Variable Mapping,
Developer Instructions, Validation and Sign-off. **The corpus is at 106 of 116
sections written.** M19 is no longer blocked; only M20 Testing 5 and M21 CJA 5
remain unwritten.

**Five downloadable workbooks**, built with Excel automation and published to
`static/templates/`. A fictional online homeware retailer, Kestrel and Co.,
carried through all six sections: BRD with 36 requirements and an out-of-scope
sheet, SDR with 24 solutions and 11 configuration items, TSD, validation report
across three cycles, and a project plan. Roughly 250KB in total.

**`.dl-box`, the site's first downloadable-file component.** The second
site-level component after `.lupdated`, recorded in the rulebook. Neutral card
ground rather than a tint, because every tint on the site says something about
the prose beside it and this one hands over an object. Contrast measured in both
themes: 4.81 to 17.85, all passing AA.

### The decision that made the module possible

The five client workbooks are real Adobe consulting deliverables for a named
listed company, carrying that client's complete implementation design, live data
layer paths and frank internal assessments of their development team. They could
not be screenshotted, and the site's own rule is that a screenshot is never
redacted. **Amit's ruling: build one fictional company and carry it through.**

That decision solved a second problem at the same time. The rebuilt workbooks are
the downloadable templates, so one piece of work serves the figures and the
downloads. **No screenshots were taken; the document excerpts are HTML tables**,
which reflow on a phone where a spreadsheet capture would not.

**The central claim of the module is literally true in the artifacts**: the SDR
is exactly the TSD's first seven columns, verified row by row across all 58 rows
of the Commerce sheet. Both files are generated from one source so they cannot
drift.

### Also ruled, and it shapes every section

Amit's story is the input, not the content. **No first person, no mention of
Adobe as an employer, no claim that this format became standard delivery
documentation anywhere.** The documents argue for themselves through their own
coherence. That boundary holds across all six sections.

### Facts verified against Experience League

Adobe's own solution design guidance recommends four fields: implementation
status, variable name, the Analytics variable it maps to, and the logic that sets
it. That is the inventory, precisely described, and it is quoted fairly in M19 §1
before the gap is named. A downloadable template does exist. Report suites carry
up to 75 traffic variables, up to 250 conversion variables and up to 1000 custom
events, all contract-dependent; the variable map workbook was rebuilt to those
maxima. Every one of the 13 external links in the module returns 200.

### Two corrections against the code

**The practical walkthrough is a `dothis` block, not a `code-block`.** `.dothis`
is in 51 content files with two documented body shapes, and neither `CLAUDE.md`
nor the rulebook had ever recorded it. Both corrected.

**The screenshot naming row in the rulebook was still specifying
`aal_module14_section01_ss1.png`**, a scheme replaced on 24 August and absent
from all 51 files in `static/img/`. Corrected.

### One trap fired, and the page-count check caught it

Dating the first section `2026-08-31` dropped it from the build silently. This
machine runs IST, five and a half hours ahead of UTC, so from 18:30 local the
local date is already tomorrow while Hugo's build clock is not. The build
reported success and the count went 219 to 218. **Date front matter from
`date -u`.** Added to `CLAUDE.md` as the everyday form of trap five.

### Still open

1. **M11 §1's deprecation warn-box.** Now expired, and still the first thing to
   do. Re-verify against Experience League and rewrite in past tense.
2. **M03 §2 contradicts M15 §1** on whether attribution can overrule eVar
   expiration. One paragraph.
3. **M20 Testing and Debugging, 5 sections.** Then M21 CJA, 5 sections.
4. **27 landing pages.** All 21 module landings are `_index.md` with front matter
   and no body. **They must be converted to `_index.html` before bodies are
   written**, because Goldmark strips raw HTML from Markdown here and every
   component would silently vanish.
5. **The home page has no route into the learning section.** One `.tcard`.
6. **M19 needs Amit's QA**, including a read of the five workbooks.

Nothing pushed. `origin/develop` is still on `fa87694`; production untouched.

---

## M19 revision, 30 August 2026

Amit read the module and returned ten inputs. Eight were acted on directly; two
needed a decision first, and both were his.

### The download UI became site furniture

His point was that on a module whose payload is a set of files, a download
control buried mid-article is only found by a reader who was already scrolling
for something else. **The files now appear in two generated places on every
section of the module**: a strip under the byline, and a card pinned to the top
of the in-page spine, above "On this page".

The spine was chosen over a fourth floating control because **it already solves
exactly this problem** for the path-box jump and Ask Amit. Its own code comment
makes the argument: it is the only furniture on a section page reachable from
any scroll position without scrolling first. The order of loudness — pocket map,
page nav, identity — was deliberate and does not gain a fourth voice.

Both surfaces come from `[params.worlds.<world>.moduledocs.m<NN>]` and are never
authored. Twenty of twenty-one modules emit nothing. It sits inside the world
rather than at params level for the same reason phases do: module numbers repeat
across worlds, and a global table would hand CJA's module 19 the learning
world's workbooks with no error anywhere.

### What else changed across all six sections

**The fictional company is now introduced before it is used.** A new section in
§1 says plainly what Kestrel and Co. is, that the project is a week from
go-live, and that the documents should be read as a record rather than a
template. The full `dl-box` moved up to sit with it, ahead of the ID discussion.

**Every section now assumes the files are open**, and says so in one line naming
the specific sheet under discussion. That doubles as orientation.

**The project-management theme is stated once and landed six times.** A new §1
section says the module is taught through an analytics implementation and is
almost entirely not about analytics. Each later section closes on the
transferable principle rather than repeating the claim.

**All six walkthroughs were rewritten to start from the downloaded file.** They
no longer teach spreadsheet mechanics. They say strip these rows, change this
prefix, fill this column.

**Four new figures**, on the BRD, SDR, variable map and validation sections.
None of them replicates a document; each explains the concept behind one.

### Two standing exceptions, recorded in the rulebook

**No ref-box anywhere in M19.** Amit's ruling after long consideration: Adobe is
the last word on the technology and has no standing on how to run a project. This
also turns off the "Need implementation steps?" note automatically, since the
template only injects it where a ref-box with an Adobe domain exists. These
sections therefore fail the checklist item *ref-box present, last on the page* on
purpose, and most now end on their closing paragraph.

**Screenshot density above the two-per-section cap**, because this module walks a
reader through documents rather than a product.

Both are in the rulebook. An undocumented exception is one a future session
helpfully undoes.

### The figure checker earned its keep

`diagram-check.js` found five real faults across the four new figures that no
amount of reading would have caught: a label overflowing its box by two pixels,
two labels within 1.2px of an edge, three text-on-shape overlaps caused by a
rounded-corner trick, and **white text on `--dia-c` at 2.54:1**. The site has a
full `--dia-*-ink` set for exactly that, and the figure now uses the soft fills
with ink text. All six figures pass in both themes at 1440, and nothing overflows
at 375.

One flag fires on every figure and is not ours: *renders at 743px, not 700*. It
appears identically on the signed-off Segments figures, so it is a pre-existing
condition of the column width at that viewport rather than anything in M19.

### Still open

**Pass two is the screenshots.** Amit has asked that I capture them, from the
Kestrel workbooks on this machine, and the brief is many small tight crops rather
than a few large ones — the 290px phone width is what forces that. Nothing to
redact for the first time on the site, because the documents are our own.

The rest of the queue is unchanged: M11 §1's expired warn-box, the M03 §2
contradiction, M20 Testing, M21 CJA, 27 landing pages, and the home page card.
