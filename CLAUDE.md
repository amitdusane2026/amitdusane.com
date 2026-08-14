# amitdusane.com

Hugo site publishing practitioner-level Adobe Analytics content. Author: Amit G. Dusane, 16 years in Adobe Analytics, 7 of them at Adobe Systems. The site's value is real implementation experience, not product documentation. Adobe Experience League already documents where to click.

```
Adobe Analytics/                     <- working directory, supporting docs live here
├── CLAUDE.md                        <- this file
├── development-plan.md              <- current plan, phases and status
├── structure-map.html               <- naming authority
├── content-component-rulebook.html  <- formatting and voice authority
├── QA_Rulebook.html                 <- delivery gate
├── completion-tracker.tsv          <- per-page status
└── amitdusane-site-complete/        <- the Hugo site, website files ONLY
```

Never put supporting documents inside `amitdusane-site-complete/`. It is git-tracked and holds website files only.

---

## Repository and publishing

GitHub: `amitdusane2026/amitdusane.com`. Two branches, and the difference is load-bearing.

| Branch | Role |
|---|---|
| `develop` | **All work happens here.** Everything: the site, the learning section, the supporting documents. Pushing here publishes nothing. |
| `main` | **Production.** Every push to `main` triggers `.github/workflows/deploy.yml`, which builds with `hugo --gc --source amitdusane-site-complete` and publishes to amitdusane.com within a couple of minutes. |

**Never push or merge to `main` without Amit saying so explicitly, in that session.** There is no staging environment: `main` is the live site.

The reason this matters right now: 24 learning sections still read "This section is not yet written." They are on `develop`, invisible to the world. Merged to `main` they become publicly indexable.

The Adobe Analytics Learning section has never been published. `amitdusane.com/adobe-analytics-learning/` currently returns 404, by design, until the section is finished.

Also unpublished: the home page (`layouts/index.html`) has only one topic card, Web SDK Migration. A second card for the learning section is needed at launch, using the existing `.tcard` component with the crimson accent.

The other repo on that account, `amitdusane2026/adobe-analytics-learning`, is an old single-page guide from January 2026. It is unrelated to this project despite the name.

---

## Read these before writing content

This file is the startup core: it holds only what applies to every task, and it is loaded every session. Everything else is read when the work calls for it.

**There is no line limit. The rule is supersession, not accumulation.** This file is meant to carry the memory of decisions that shape the site, so it will grow, and that is correct. What it must never do is grow exponentially by stacking new guidance on top of old guidance that the new guidance has replaced.

So whenever something written here is made wrong, narrower, or redundant by a later decision, **delete the old text rather than qualifying it**. The new rule takes over. A file holding two rules that disagree is worse than a longer file holding one rule that is right. When something matters only for one kind of work, it still belongs in a document this table points at rather than here.

| Document | Authority over | Read it before |
|---|---|---|
| `structure-map.html` | Titles, seotitles, slugs, module and section numbering, the curriculum arc | Creating any page, or naming anything |
| `content-component-rulebook.html` | Every component, its tier, when it is earned, prose rules, the 20-item checklist | Writing any section body |
| `QA_Rulebook.html` | The 13-point delivery gate, binary PASS/FAILED | Declaring anything done |
| `completion-tracker.tsv` | Which pages are written, QA'd, SEO-complete | Deciding what to work on |
| `site-architecture.md` | The four section shapes, what carries between them, world mechanics, the roadmap, hosting at scale | Starting a new section, designing a new world, or deciding what a section inherits |
| `development-plan.md` | Phases, status, what is next | Deciding what to work on |

**Read the relevant one; do not work from memory or from this summary.**

These documents were produced during earlier plain chat sessions. They are close to accurate but not infallible, and they predate parts of what shipped. Never follow a specific literally without checking it.

**Precedence when documents disagree with the code: the code wins. Say so out loud, then correct the source document and add a revision-history entry**, so it becomes fact rather than a legacy record of intent. Amit has asked explicitly for this; the documents are meant to get stronger as the site grows, not to rot. The rulebook states this principle itself about the stylesheet. One known stale spot: the structure map says "nothing has been built" (the restructure shipped) and its M03 §8 note says SDR is M20 (it is M19). The rulebook's front matter examples were the other, and they were fixed in its own 6 August 2026 revision: `seotitle` and `tagline` are both present and marked required, and Classifications is numbered 11.

---

## Site architecture

**Hugo v0.123.7 extended. No theme. No shortcodes anywhere.** Every component is raw HTML written directly into `.html` content files, styled by a fixed class vocabulary in `static/`. There is no `layouts/shortcodes/` and there never has been.

**New content files are `.html`, never `.md`.** `hugo.toml` has no `[markup.goldmark.renderer]` block, so `unsafe` defaults to false and Goldmark silently strips raw HTML from Markdown. This shipped as a live bug on five category pages until August 2026.

**A "world" is a self-contained sub-site** selected by URL prefix, with its own stylesheet, JS, shell, and print document. Two exist: `/web-sdk-migration/` (blue accent, `world-shell.css`) and `/adobe-analytics-learning/` (crimson accent, `world-learning.css`). The switch is an if/else chain in `layouts/partials/head.html:37` and `layouts/_default/baseof.html:4-6`.

**Content types** map to templates by front matter `type`: `category`, `module`, `lesson`, `glossary` in the learning world; `step`, `kb`, `ref` in the migration world.

---

## The three silent-failure traps

None of these produce an error. All three have bitten this site.

1. **`description:` is the publish flag.** `layouts/partials/wherefits.html:77` and `homemap.html:56` count child pages that have a `description`. A section without one renders dimmed and unclickable in the pocket map and the home map, and a module whose sections all lack one collapses to "Coming soon". The tracker's "Content created" column and this field agree exactly.

2. **A new module must be added to `[params.phases]` in `hugo.toml`.** That block is the only module-to-phase mapping. Miss it and the module appears in the left navigation but vanishes from both maps, with no build error.

3. **`layouts/lesson/single.html:9` regex-matches the literal string `<div class="ref-box">`** to inject the doc-note block above it. Single quotes, an extra class, or extra whitespace silently breaks the injection. **The match has a second condition that is easy to miss**: the regex also requires an Adobe domain (`experienceleague.adobe.com`, `adobe.com/go`, or `://adobe`) to appear inside the box, so a `ref-box` of purely internal links is deliberately skipped. That is intentional and commented in the template, but it means a `ref-box` can be perfectly well-formed and still get no doc-note, which looks identical to the injection being broken.

A fourth, fixed 14 Aug 2026 and easy to undo by accident: **the `?v=` content hash on the stylesheet and script tags** in `layouts/partials/head.html:41` and `layouts/_default/baseof.html:162`. Without it the asset URL never moves when the file changes, so browsers serve a stale copy and a CSS edit appears to do nothing at all. It cost an hour of debugging a component that was correct the whole time, and in production it would have left every returning visitor on the old stylesheet. **Do not remove those, and never confirm styling by injecting CSS into a page** — that proves the CSS works when applied, not that the page applies it. Check the delivered page.

A fifth, already fixed and documented in `hugo.toml`: the `[frontmatter]` block decouples `lastmod` from the `date` cascade. Without it a `lastmod` one day ahead of a UTC build clock gives the page a future `publishDate` and Hugo drops it silently. This once removed 103 pages while the build reported success. **Do not remove those lines.**

---

## Building

```bash
hugo --gc
```

**Never `hugo --minify`.** The minifier destroys inline SVG text elements.

**Assert the page count after every build.** Current baseline: 219 pages. If the count drops, stop and find out why before doing anything else. This single check would have caught the 103-page outage in one second.

Then crawl the built HTML, not the source. Source passing every check proves nothing; the bug lives in the interaction between source and build.

---

## What this site is for, and why anyone would return to it

**Write for one reader: somebody who has already been through the documentation, still has questions, and finds the topic rigid and boring.** Not a beginner, and not someone who needs convincing that Adobe Analytics exists. Somebody stuck. That single assumption decides what to explain and what to take as read, and it is the most useful line in this file.

**The site is not a replacement for Adobe's documentation. It is what makes that documentation legible.** Adobe writes reference material for people who already know what they need, which is a permanent constraint rather than a failing: they sell to every customer, so every answer has to be "it depends". That constraint is exactly why the gap here is durable. A reader who understands why a thing exists can go back to Experience League and find that it suddenly makes sense, including the parts that previously looked arbitrary. **The `ref-box` is that handoff, not a courtesy** — it is where an equipped reader goes next.

**The real subject is how to think about a topic, not the topic.** Any single section teaches one concept and opens doors to others. What should survive is the method, because a reader who has it can teach themselves the next thing without you. That is the master key, and it is why a section that only transfers facts has failed even when every fact is right.

**The identity is deliberately narrow: answer WHY, then solve HOW.** Not comprehensive coverage. An actor who tries every genre masters none; the ones who last pick a lane. History, story and real situations are how the WHY gets delivered, and the technical detail follows once the reader knows why they need it.

**Chase uniqueness, not completeness. A gap is acceptable; drift is not.** A missing fact costs a reader's respect once. A section that has wandered off its subject, or off the voice, costs the reason they came. So the right content at the right point beats more content, always, and "we do not cover that" is a legitimate answer.

**This matters more than it sounds, because every quality mechanism here can only add.** The rulebook's checklist finds things absent or malformed. The QA gate finds things missing or inconsistent. Comparing a section against a generated reference finds things not covered. **None of them can say cut this.** Additions-only review is therefore the default direction of the whole process, and left alone it drifts the site toward the shape of a reference document, one defensible addition at a time, invisibly, because each addition is individually justified.

The counterweight has to be deliberate. When reviewing a draft or proposing an addition, ask what comes out, whether the section is still about one thing, and whether the new material serves the reader at that point or only makes the page more complete. Established 10 Aug 2026, after comparing M12 and M13 against generated references on the same topics: both comparisons produced only recommendations to add, which is the one output that shape of analysis can produce. Amit's ruling: **do not run that comparison across the finished modules.** Use a generated reference as a checklist *before* drafting the unwritten sections, where it costs nothing and touches no signed-off work, and use the factual accuracy pass rather than a coverage pass on what already exists, because wrong is worse than incomplete.

**Give opinions, not options.** A learner driver facing an oncoming car does not need four alternatives and a trade-off table, they need "do this". Four options is what documentation already provides and it is why documentation does not teach. Take a position and say which one to use.

**An opinion is scaffolding, not doctrine, and that has to be visible.** The framing is *follow these for your first case*, with *then derive your own* implied rather than laboured. Stated that way an opinion needs no hedging, because its status already carries the limit. Data Layer Design does this well: "There is no single correct design, which is not the same as anything goes." ECID's walkthrough closes on "there is nothing else to configure", which is true and reads as doctrine. Make the scaffolding explicit once per section rather than leaving it to whether it occurred to me that day.

**The test is the meeting, not the exam.** Picture a room arguing about why visitor numbers do not match CRM, why revenue does not match the order system, why the company is not using its own customer ID. Reciting cookie names answers none of it. Write what equips somebody to make a decision and hold that conversation.

**Technical detail is not thrown away, it is subordinated.** Fundamentals matter when they are actually required, so include them where they carry a WHY or an opinion, and cut them where they only help someone recite facts. Amit's own test: he remembers relational concepts, keys and joins, and has always looked up SQL syntax. **The site should be the part you remember, not the part you look up.**

Things worth saying that nobody else will say, like "if you are using analytics as your book-keeping system you are making a mistake", are the reason a reader comes back. Adobe will not say it. Neither will most blogs.

---

## Voice

### The governing intent, in Amit's own words

> My writing is not about explaining Adobe features; it is about explaining the engineering decisions behind them. Every topic begins with a real problem, then answers why the technology exists before explaining how it works. I want readers to understand the design intent, not just memorize terminology. Whether I'm writing about Report Suites, eVars, Web SDK, or Tag Management, the goal is always the same: help the reader think like an implementation architect rather than simply operate a tool.
>
> I deliberately connect business requirements, architecture, implementation, and practical experience into one continuous story. I don't just define concepts—I explain when to use them, when not to use them, what trade-offs they introduce, and the mistakes people commonly make in real projects. Analogies, diagrams, warnings, and implementation tips are not decoration; they are there to convert complex technical ideas into intuitive mental models that readers can remember long after they finish the article.
>
> Above all, every article should leave the reader thinking differently, not just knowing more. If someone finishes a section and understands why a technology exists, what problem it solves, how to make better implementation decisions, and where to go deeper in the official documentation, then the article has achieved its purpose. My role is not to replace Adobe documentation, but to make the journey of learning Adobe Analytics clear, practical, connected, and enjoyable.

This is the test a draft has to pass. Everything below is mechanics in service of it.

Three things follow directly, and they are easy to get wrong:

- **A section that opens by defining the feature has already failed.** The operational form of the WHY-then-HOW rule stated above.
- **Components are load-bearing, not decorative.** An analogy, a diagram, a warning, or a tip is there to build a mental model that survives the reader closing the tab. This is the same judgment the rulebook enforces when it says a component is earned.
- **State the fact on our own authority. Never cite Adobe as the source of a claim.** Write "five features refuse calculated metrics", not "Adobe documents five features that refuse calculated metrics". Verifying every claim against Experience League while drafting is mandatory and stays invisible; the moment it appears in the prose, the page has told the reader that the real answer is somewhere else, and a reader who believes that goes there instead. This site sits at the same tier as the documentation, not beneath it. **Adobe as an actor is fine and different**: "Adobe ships a set of default metrics", "Adobe updates the segment everywhere it is used", "Adobe provides no housekeeping for this" are statements about what the product does, one of which is a criticism. The banned move is deferring to Adobe as the authority behind our own sentence. Two legitimate exceptions: pointing at a reference catalogue the section deliberately does not reproduce, which is what the `ref-box` exists for, and closing down a genuinely contested question where the vendor's stated position is the closure ("Adobe recommends"). Established 10 Aug 2026 on M12; Amit had raised it in earlier QA and it had never been written down.
- **The reader should finish thinking differently.** Not merely informed. If a draft only transfers facts, it is not done, however accurate it is.

### Mechanics

The rulebook states the prose rules. What follows is measured from the corpus and is not written down anywhere else.

**Second person only. Zero first person.** Measured: 1,756 "you" and 0 "I" across the learning world. The only "I" on the whole site is in `content/about.html`. The documented exception is quoted speech, and it is used sparingly: a team saying "we set up a CNAME" is a character speaking.

**Experience carries no author.** Because first person is banned, there are two ways to signal it and both are in use.

The first is structural, for failure modes: name a generic actor ("teams", "practitioners", "everyone", "nobody"), predict the failure in future tense, and attach an organisational rather than technical consequence. "Skipping side-by-side parity is how discrepancies surface in month-end reporting, in front of stakeholders." Not "I once saw a client".

The second is an extended scenario or analogy carried through the whole section, which is what the strongest sections use: the camera in the shared garden in M06 §8, the shopkeeper's register in M07 §5. These are not war stories and they attribute nothing to anyone. Reach for this one when the section needs to answer *why does this exist* before it can explain anything, which is most of the time.

**The recurring theme is silence.** Things break without telling you. "Nothing breaks, no error appears, and..." is the signature construction. When a topic has a silent failure mode, that is usually the spine of the section.

**Contractions split by era.** `foundations/variables/` and the migration world use them. The July 2026 modules (Classifications, Marketing Channels, Segments) are near contraction-free: "it is", "do not", "cannot". Match the era of the module being worked on; new work follows the July 2026 register.

**That split makes every corpus search a trap.** Grepping `do not sum` misses a section that says `don't sum`, and the result looks exactly like a gap. On 10 Aug 2026 that produced a proposed addition to M03 §6 that duplicated an info-box already sitting three paragraphs away. **Always search both forms**, or match on the distinctive noun rather than the verb phrase.

**Sentence rhythm is long and comma-chained, broken by one-sentence paragraphs used as beats.** "The data is not lost. It is in the wrong building." A long paragraph is almost always followed by a short one. Nothing exceeds about 120 words.

**Openers are never definitions.** Three patterns recur: a continuity recap that walks back over what the reader has and names the gap; a concrete scenario or extended metaphor carried through the whole section; or the failing report shown before the feature is named.

**Humour is dry, structural, and rare.** A wry observation inside an otherwise serious paragraph. Never a joke, never an exclamation mark, never a parenthetical aside.

---

## Section anatomy

**No H1 or H2 in body content.** The layout supplies them. A section is a flat stack of `<h3 class="subsec-title">` blocks, typically 5 to 17.

Invariant structure:

1. **Untitled opener.** One to three paragraphs before the first h3, doing continuity recap or scenario setup, with inline links back to earlier sections.
2. **Body.** The h3 stack, each 2 to 6 paragraphs, interleaved with earned components.
3. **The practical walkthrough, second to last h3.** Before the section closes, answer the question the reader actually has: *what do I do with all of this?* An ordered, numbered walkthrough in a `code-block` — which screen to open, what to install, what to save, how to verify — ending with an explicit statement that there is nothing else to configure, and a line making clear these steps are a floor rather than a ceiling. Deployment gotchas hang off this block rather than sitting apart from it, because they belong to the doing. Established 10 Aug 2026 on M07 §5; skip it only when the subject genuinely has nothing to configure.

   **This block is the engine, not the appendix.** Amit learned by following experts' steps first, getting an outcome, and only then asking whether there was a better way, at which point the documentation finally made sense. Outcome precedes understanding, so the walkthrough is what earns the reader's second visit and their willingness to think harder. Treat it as load-bearing.
4. **Final h3 is synthesis plus onward link**, named by function not topic: "What you have now", "Everything hinges on one thing", "Where this module leaves you". Its last paragraph names a related section, says what that section covers, and links it.
5. **`path-box`**, then **`ref-box`** last, always, exactly one. Nothing follows it.

Heading wording is editorial, not label-like. Full clauses, often with a comma, often a promise or a question. "The waterfall, and why order decides everything", not "Rule Order".

**The completed-site rule governs every reference, in both directions.** Write as though the whole site is already finished and the reader arrived from a search engine, because most of them do. They have read nothing else and are not working through the curriculum in order.

Never write "the previous section", "the section before", "is next", "comes next", "earlier we saw", "by now you have", or "this module has been building toward". All of them assert a journey the reader may not have taken, and all of them are simply false to a search lander.

Instead: **name the concept, link it, and recap it in a few words**, so the sentence is true for both kinds of reader.

- Wrong: "The previous section closed on an assumption..."
- Wrong: "Privacy and Data Retention is next."
- Right: "...carry obligations that sit outside analytics entirely, and they are covered in [Privacy and Data Retention]."
- Right: "Tag management has surfaced before, most directly in [Deployment: TMS vs Direct], where the choice was framed as a trade."

**Not assuming a journey is not the same as being complete alone.** A search lander arrives on one section, reads it, and leaves. So every section states the idea it rests on in its own opening, in its own words, at the size that section needs. The way to do that without three sections repeating each other is that **the recap has to do work inside the section carrying it**, never sit at the front as a preamble. In M12, §1 spends its whole opening on why a ratio reveals what a count hides; §2 recaps it in two sentences and then uses the funnel to choose denominators; §3 recaps it in two sentences and then audits the mess that follows. Nobody reading all three feels a repeat, because each version is being used for something different. Established 10 Aug 2026.

### Landing pages are directional, and that is all

**A module or category landing page is one or two paragraphs. No theory, no technical discussion, no argument.** It says what this phase or module covers, bridges from what came before, and points at the sections. A trailer.

The reason is the learner's path, and Amit was explicit about it: somebody who reads a real explanation on a landing page, then walks into the curriculum and meets the same idea again at greater depth, has been made to backtrack and read the same thing twice. It breaks the flow and it confuses. **Knowledge lives in sections. A landing page exists so that a reader who arrives on one knows where to go next.**

So material that belongs to a whole module gets distributed across its sections, never collected on the landing page. Established 10 Aug 2026, when exactly that was proposed for M12 and rejected.

This is QA Rulebook check 4 and rule 5 of the component rulebook. It is the easiest rule on the site to break while writing a good sentence.

A `path-box` is included only if the subject has an Adobe screen. A data layer does not; a report suite setting does.

---

## Component quick reference

Full specifications, including when each is earned, are in `content-component-rulebook.html`. Read it. This table exists only so the class names are correct.

| Component | Structure |
|---|---|
| `warn-box` | `> .warn-hdr + p`. Icon must be `⚠️` with the U+FE0F variation selector |
| `info-box` | `> .info-hdr + p` |
| `pro-tip` | `> .pro-tip-hdr + p` |
| `path-box` | `> .path-title > .path-ico + text, then p`. `path-ico` is an empty span |
| `ref-box` | `> .ref-title + ul > li > a`. Official Adobe docs only, 2 to 4 links, `target="_blank"` |
| `code-block` | `> .code-hdr > .code-lang + .code-copy` then `.code-body > pre`. Copy button needs `onclick="copyCode(this)"` |
| `tbl-wrap` | Wraps every table. Never a bare `<table>` |
| `diagram-box` | `> .diagram-title` then inline `<svg>` directly, or `.diagram-content` wrapping a layout component |
| `cards` | `> .card` (or `a.card`) `> .card-icon + .card-title + .card-desc` |
| `shot-box` | `> .shot-title + .shot-frame` (holding the `<img>` and a `button.shot-zoom-btn`) `+ .shot-note`. Product screenshots |

**A screenshot is never wrapped in a link and never redacted.** The image carries `pointer-events:none`; only the zoom button opens anything, and it opens an overlay in the same tab that `world-learning.js` builds. Crop to the feature rather than the screen, because the image area is about 290px on a phone. Every shot earns a `shot-note` that points at something, and if none can be written the shot is not earned. Two per section is plenty. Capture from the Adobe training account with a harmless dimension so there is nothing to hide; blur is not redaction. Files are `static/img/aal_module14_section01_ss1.png`, zero-padded, originals archived outside the site folder.

Never invent a class. If it is not in `static/world-learning.css`, it does not exist.

Never nest a `code-block` inside a `warn-box`, `pro-tip`, or `info-box`. State the rule in the box, put the code block after it at normal level.

`code-lang` is a **label, not a language**. "Marketing Channel Rule", "club-members.csv", "Follow along: build a basic sequence" are all correct. The component's most valuable use is UI configuration walkthroughs, not code.

**SVG colour must live in a `style` attribute with a hex fallback.** `fill="var(--accent)"` as a presentation attribute does not resolve reliably. Correct form:

```html
<svg viewBox="0 0 700 250" style="width:100%;height:auto;display:block"
     role="img" aria-label="Plain-language description of what this shows">
  <rect style="fill:var(--card, #ffffff);stroke:var(--accent, #e11d48);stroke-width:2"/>
</svg>
```

Every SVG needs `role="img"` and a full-sentence `aria-label`.

---

## Front matter

Learning-world section page:

```yaml
---
slug: "designing-the-key"
title: "Designing the Key"
seotitle: "Designing a Classification Key in Adobe Analytics"
lastmod: 2026-08-06
description: "The key is not a setting. It is the raw value you already collect. Five rules that decide whether classifications work for you or against you."
type: lesson
modulenum: 11
sectionnum: 2
weight: 2
---
```

`title` shows on the page and in navigation. `seotitle` is the browser title and the search result. Both are prescribed per section in `structure-map.html`; use its values rather than coining new ones.

`description` is the Google snippet and the LinkedIn preview. 110 to 160 characters. Written as a promise about the content, not a summary. No "Learn about", no "Master the".

`lastmod` is set manually, never derived from git. A date that lies is worse than no date.

Changing a slug on a live page requires an `aliases` entry. Never let an old URL 404.

---

## Working agreement

**Content is written from Amit's notes, when he supplies them.** For each section he supplies the gotchas, the scars, and what the documentation gets wrong; that raw material is what only he has. The drafting, structuring, and component work is mine.

**When he hands a section over without notes, constructed scenarios are authorised** (granted 7 Aug 2026, during M02 §7). Carry one plausible situation through the whole section, and build it so its incidental details are the technical points rather than decoration. Two limits hold absolutely: never attribute experience to a real engagement, client, or person, and every technical claim must trace to documentation verified while drafting. A scenario is a teaching device, not a war story. `development-plan.md` records the worked example and the review that produced this rule.

**The tracker decides what needs writing, and nothing else does.** If `completion-tracker.tsv` says `Content created? = No`, that section gets written fresh. Whatever the file currently holds is irrelevant: a placeholder line, thin legacy prose from the pre-rewrite era, or anything else. It was written early to fill a gap, it was not thought through, and Amit has said explicitly that he does not want energy spent reading it, mining it for value, or adapting it.

So do not open the existing body to see what can be salvaged, do not summarise it back to him, and do not treat "rewrite" and "write" as different jobs. They are one job. Read the neighbouring completed sections for continuity and the structure map for naming, then write with a fresh mind.

Per-section loop: notes, then a proposed h3 skeleton with component placement for approval, then the full `.html`, then verification, then his accuracy edits.

**When revising a section he has already read, highlight the new material so he can read it end to end.** Agreed 7 Aug 2026 during M07 §5. Amber fill (`#fde68a` with `color:#1f2937`, which stays legible in dark mode) on new prose, and an amber outline on new components so `warn-box` and `pro-tip` keep their own colours and can still be judged. Tag every one with `data-newblock="1"`.

**Commit the clean version first, then apply the highlighting as an uncommitted working-tree change.** Nothing highlighted ever enters git history, so it cannot reach the site if either of us forgets. Removal is then `git checkout` on the one file, followed by a grep for `data-newblock` that must return zero.

**Run this before every commit, without exception.** It must print nothing:

```bash
git diff --cached --name-only -z -- amitdusane-site-complete | xargs -0 grep -l data-newblock
```

Scope it to `amitdusane-site-complete` as shown. Unscoped, it flags this file and `development-plan.md`, which mention the attribute in prose rather than carrying it as markup.

This exists because on 10 Aug 2026 a `git add -A` swept up two files that were still highlighted for review and committed them, then pushed. `main` was never touched so the site was safe, but the guard is the point: highlighting is applied for one file at a time while other files may still be marked, and "commit clean first" is not sufficient on its own once more than one file is in flight.

**To verify highlighting is gone, check the source and the tree, not `public/`.** The two authoritative checks are `grep -rl data-newblock amitdusane-site-complete/content/` returning nothing, and `git status --porcelain` returning nothing. The build directory lies in both directions, for two reasons proved on 13 Aug 2026: stale renders survive later builds, and `sed -i` leaves temp files there holding old copies of pages. **Use `Edit` rather than `sed -i` for front-matter changes** so those temp files never appear.

**Never chain `git checkout` and a build in one command.** This repository sits inside OneDrive, whose sync layer can delay a restored file becoming readable, so Hugo reads the pre-checkout content and writes a stale page carrying that build's own timestamp. It looks exactly like a failed revert and is not one. Restore, verify the source, then build as a separate step.

Before declaring any section done: the rulebook's 20-item checklist, then the QA Rulebook's 13 points, then a real build with the page count asserted.

---

## Session close-out routine

Run this whenever Amit says to close out, wrap up, or end the session. It is what makes the next session start from truth instead of from a stale snapshot.

1. **Update `completion-tracker.tsv`.** Mark every section touched this session: `Content created?`, `Content QA'd?`, and the SEO columns. The tracker is the single record of where the project stands; a future session reads it to decide what to do next.

   Tab-delimited, 1 header row plus 183 data rows, 15 columns: Phase, Module, Section #, Page name, Page type, URL, SEO title, SEO title done?, SEO description, SEO desc done?, Title chars, Desc chars, Content created?, Content QA'd?, Final result. Tabs are the delimiter because descriptions are full of commas. Never introduce a tab inside a field. `Final result` is Yes only when SEO title, SEO desc, Content created and Content QA'd are all Yes.

   **`Page type` splits the file into two kinds of row, and every statistic must filter on it.** Content is `Section` (116), `Module landing` (21), `Category landing` (5), `Home` and `Glossary`. Platform work is `Feature` (39), added 7 Aug 2026, carrying `Phase = Platform` and grouped by `Module` into navigation, presentation, seo, chrome, infrastructure and tech-debt. For a Feature row the SEO columns do not apply and are set to `NA`, `URL` holds the implementing file path rather than a URL, and `Content created?` means built. **Quoting a total without filtering by `Page type` will mix sections and features and be wrong.**

   Every Feature row is deliberately `Content QA'd? = No` and `Final result = No`. Amit will re-QA the platform himself once the content front is finished, so nothing there should be marked QA'd on my judgment.
2. **Update `development-plan.md`** if a phase completed, an estimate moved, or the order changed.
3. **Correct any source document** proven wrong during the session, per the precedence rule above, and add a revision-history entry.
4. **Build once more**: `hugo --gc`, assert the page count, confirm it is clean.
5. **Commit everything** with a message describing what was written and what remains. The working tree must be clean at the end of a session.
6. **Write a memory** only if something durable was learned that is not already captured in a file.
7. **Report** in two lines: what shipped, and what the next session should pick up first.

---

## Session start routine

`.claude/hooks/session-start.sh` runs steps 1 and 2 automatically: it fetches, says how far behind `origin/develop` the checkout is, lists the incoming commits, and installs Hugo in web sessions, which do not ship it. Read its output before anything else. It deliberately does not pull, because the commit messages have to be read first.

1. **Pull first, always.** `git fetch origin && git status` to see whether `origin/develop` is ahead. Amit works from more than one device: this laptop and web or mobile sessions on claude.ai/code, both against the `develop` branch. A local copy that has not pulled is stale, and advice given from it will be wrong.

   If the remote is ahead, `git pull` and read the incoming commit messages before proposing anything. They carry the reasoning for whatever changed.

   If both sides have changed the same file, reconcile deliberately and tell Amit what conflicted rather than resolving it silently.

2. **Read `development-plan.md` and `completion-tracker.tsv`** before proposing work. The plan says what phase we are in; the tracker says exactly which sections are written and QA'd.

3. **Confirm the working tree is clean** and report where things stand in a line or two.

### Never report status from a stale ref

**Fetch immediately before any status claim, not once at the start of the session.** A status report is worth exactly as much as its last fetch. Name the commit it rests on, so Amit can see how fresh it is.

**The tracker records intent; the files and the build are the truth.** Cross-check every count against the content files before reporting it. A number read out of `completion-tracker.tsv` and never verified is a guess wearing a suit.

On 7 Aug 2026 a session fetched once at startup, reported detailed status forty minutes later from that same snapshot, and called two finished, signed-off sections unwritten. It was eleven commits behind and had said itself, in the same conversation, that staleness was the main risk in a two-device setup. Had Amit not known better, the next hour would have gone into rewriting Module 2.
