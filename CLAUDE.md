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

## Read these before writing content

Four documents govern this project. **Read the relevant one; do not work from memory or from this summary.**

| Document | Authority over | Read it before |
|---|---|---|
| `structure-map.html` | Titles, seotitles, slugs, module and section numbering, the curriculum arc | Creating any page, or naming anything |
| `content-component-rulebook.html` | Every component, its tier, when it is earned, prose rules, the 20-item checklist | Writing any section body |
| `QA_Rulebook.html` | The 13-point delivery gate, binary PASS/FAILED | Declaring anything done |
| `completion-tracker.tsv` | Which pages are written, QA'd, SEO-complete | Deciding what to work on |

**Precedence when documents disagree with the code: the code wins, and flag the document.** The rulebook states this principle itself about the stylesheet. Two known stale spots: the rulebook's front matter examples omit `seotitle` and `tagline` (both required) and number Classifications as module 10 (it is 11); the structure map says "nothing has been built" (the restructure shipped) and its M03 §8 note says SDR is M20 (it is M19).

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

3. **`layouts/lesson/single.html:9` regex-matches the literal string `<div class="ref-box">`** to inject the doc-note block above it. Single quotes, an extra class, or extra whitespace silently breaks the injection.

A fourth, already fixed and documented in `hugo.toml`: the `[frontmatter]` block decouples `lastmod` from the `date` cascade. Without it a `lastmod` one day ahead of a UTC build clock gives the page a future `publishDate` and Hugo drops it silently. This once removed 103 pages while the build reported success. **Do not remove those lines.**

---

## Building

```bash
hugo --gc
```

**Never `hugo --minify`.** The minifier destroys inline SVG text elements.

**Assert the page count after every build.** Current baseline: 219 pages. If the count drops, stop and find out why before doing anything else. This single check would have caught the 103-page outage in one second.

Then crawl the built HTML, not the source. Source passing every check proves nothing; the bug lives in the interaction between source and build.

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

- **Problem first, then why, then how.** A section that opens by defining the feature has already failed. Open with the real problem, establish why the technology exists, and only then explain its mechanics.
- **Components are load-bearing, not decorative.** An analogy, a diagram, a warning, or a tip is there to build a mental model that survives the reader closing the tab. This is the same judgment the rulebook enforces when it says a component is earned.
- **The reader should finish thinking differently.** Not merely informed. If a draft only transfers facts, it is not done, however accurate it is.

### Mechanics

The rulebook states the prose rules. What follows is measured from the corpus and is not written down anywhere else.

**Second person only. Zero first person.** Measured: 1,756 "you" and 0 "I" across the learning world. The only "I" on the whole site is in `content/about.html`. The documented exception is quoted speech, and it is used sparingly: a team saying "we set up a CNAME" is a character speaking.

**War stories carry no author.** Because first person is banned, experience is signalled structurally: name a generic actor ("teams", "practitioners", "everyone", "nobody"), predict the failure in future tense, and attach an organisational rather than technical consequence. "Skipping side-by-side parity is how discrepancies surface in month-end reporting, in front of stakeholders." Not "I once saw a client".

**The recurring theme is silence.** Things break without telling you. "Nothing breaks, no error appears, and..." is the signature construction. When a topic has a silent failure mode, that is usually the spine of the section.

**Contractions split by era.** `foundations/variables/` and the migration world use them. The July 2026 modules (Classifications, Marketing Channels, Segments) are near contraction-free: "it is", "do not", "cannot". Match the era of the module being worked on; new work follows the July 2026 register.

**Sentence rhythm is long and comma-chained, broken by one-sentence paragraphs used as beats.** "The data is not lost. It is in the wrong building." A long paragraph is almost always followed by a short one. Nothing exceeds about 120 words.

**Openers are never definitions.** Three patterns recur: a continuity recap that walks back over what the reader has and names the gap; a concrete scenario or extended metaphor carried through the whole section; or the failing report shown before the feature is named.

**Humour is dry, structural, and rare.** A wry observation inside an otherwise serious paragraph. Never a joke, never an exclamation mark, never a parenthetical aside.

---

## Section anatomy

**No H1 or H2 in body content.** The layout supplies them. A section is a flat stack of `<h3 class="subsec-title">` blocks, typically 5 to 17.

Invariant structure:

1. **Untitled opener.** One to three paragraphs before the first h3, doing continuity recap or scenario setup, with inline links back to earlier sections.
2. **Body.** The h3 stack, each 2 to 6 paragraphs, interleaved with earned components.
3. **Final h3 is synthesis plus handoff**, named by function not topic: "What you have now", "Everything hinges on one thing", "Where this module leaves you". Its last paragraph names and links the next section.
4. **`path-box`**, second to last, if and only if the subject has a screen.
5. **`ref-box`**, last, always, exactly one. Nothing follows it.

Heading wording is editorial, not label-like. Full clauses, often with a comma, often a promise or a question. "The waterfall, and why order decides everything", not "Rule Order".

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

**Content is written from Amit's notes.** For each section he supplies the gotchas, the scars, and what the documentation gets wrong; that raw material is what only he has. The drafting, structuring, and component work is mine. Do not invent war stories or attribute experience that was not supplied.

Per-section loop: notes, then a proposed h3 skeleton with component placement for approval, then the full `.html`, then verification, then his accuracy edits.

Before declaring any section done: the rulebook's 20-item checklist, then the QA Rulebook's 13 points, then a real build with the page count asserted.

---

## Session close-out routine

Run this whenever Amit says to close out, wrap up, or end the session. It is what makes the next session start from truth instead of from a stale snapshot.

1. **Update `completion-tracker.tsv`.** Mark every section touched this session: `Content created?`, `Content QA'd?`, and the SEO columns. The tracker is the single record of where the project stands; a future session reads it to decide what to do next.

   Tab-delimited, 1 header row plus 144 data rows, 15 columns: Phase, Module, Section #, Page name, Page type, URL, SEO title, SEO title done?, SEO description, SEO desc done?, Title chars, Desc chars, Content created?, Content QA'd?, Final result. Tabs are the delimiter because descriptions are full of commas. Never introduce a tab inside a field. `Final result` is Yes only when SEO title, SEO desc, Content created and Content QA'd are all Yes.
2. **Update `development-plan.md`** if a phase completed, an estimate moved, or the order changed.
3. **Correct any source document** proven wrong during the session, per the precedence rule above, and add a revision-history entry.
4. **Build once more**: `hugo --gc`, assert the page count, confirm it is clean.
5. **Commit everything** with a message describing what was written and what remains. The working tree must be clean at the end of a session.
6. **Write a memory** only if something durable was learned that is not already captured in a file.
7. **Report** in two lines: what shipped, and what the next session should pick up first.

At session start, read `development-plan.md` and the tracker before proposing work.
