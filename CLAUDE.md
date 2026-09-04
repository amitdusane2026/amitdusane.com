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
├── design-plan.html                 <- CLOSED record of design decisions, not a work queue
├── diagram-spec.html                <- the drawing standard, and the redraw programme
├── diagram-check.js                 <- the per-figure pass, automated. Paste once, call per page
├── template-source/                 <- the source the five downloadable workbooks are BUILT from
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

**The site launched on 4 September 2026 and both branches now share one history.** Until that day they had none: `main` grew from the original GitHub upload with the site at the repo root, `develop` from a `git init` here with the site inside `amitdusane-site-complete/`. `git merge-base` returned nothing, so a merge was impossible without `--allow-unrelated-histories`, and it would have left 72 stale June files at the root and conflicted on `deploy.yml`, the one file both carried. `main` was therefore replaced outright with `git push origin develop:main --force-with-lease`. **That was a one-off. Every launch from here is an ordinary push**, and `main` should never again be force-pushed without a reason as good as that one.

**Versions are tagged, and the tag is what preserves them.** `v1.0` is the June site at `730c59a`, tagged immediately before the overwrite, because once `main` moved nothing pointed at those commits and git eventually discards what nothing points to. `v2.0` is the launch at `52603dd`. Tag each future launch; from now on the history is linear so nothing else is at risk.

**GA is the one thing that differs between the branches, deliberately and permanently.** It is ON on `main` and OFF on `develop`, where the call sits inside a comment wrapper. **Each launch is therefore two edits: delete the wrapper before shipping to `main`, put it back on `develop` the same hour.** Forgetting the second is the expensive half, and launch week is the data that cannot be cleaned up afterwards. The durable fix, still undone, is to let the line decide from the baseURL the way the noindex guard already does.

**The Cloudflare staging copy was deleted on 4 September 2026, straight after launch.** It ran from 2 September for tester feedback. Deleted rather than paused, because testers had the URL: `noindex` keeps a copy out of Google but does nothing about a person forwarding a link, and a public second copy that drifts out of date the moment work resumes is worse than none. `site-architecture.md` records every setting needed to stand it back up, including the two that are load-bearing and not obvious. **So there is no staging environment again, and the GA discipline above still matters** — it protects the next staging copy, and any local build somebody points at a real domain.

**The learning section is published**: 21 modules, 116 sections, live since 4 September. The home page carries both guides as `.tile tile-learning` and `.tile tile-migration`.

The other repo on that account, `amitdusane2026/adobe-analytics-learning`, held a single-page guide from January 2026, unrelated to this project despite the name. **On 4 September 2026 its `index.html` was replaced with a redirect to `/adobe-analytics-learning/`** and it now serves 846 bytes instead of 398KB.

**It was redirected rather than switched off, and the reason is worth keeping.** That page had been live and crawlable for eight months, under Amit's name, titled "Adobe Analytics Learning Hub" — a title competing directly with the section launched the same day, on a URL Google already trusted while the real one was hours old. Deleting it would have discarded that standing and left every bookmark dead. A meta refresh with a canonical is what Google reads as a permanent move, which is the closest GitHub Pages can get to a 301.

**Leave GitHub Pages enabled on it until roughly March 2027**, long enough for the signal to transfer, then set Source to None and archive the repo. Its README still describes the old hub as current and could say it moved.

---

## Read these before writing content

This file is the startup core: it holds only what applies to every task, and it is loaded every session. Everything else is read when the work calls for it.

**There is no line limit. The rule is supersession, not accumulation.** This file is meant to carry the memory of decisions that shape the site, so it will grow, and that is correct. What it must never do is grow exponentially by stacking new guidance on top of old guidance that the new guidance has replaced.

So whenever something written here is made wrong, narrower, or redundant by a later decision, **delete the old text rather than qualifying it**. The new rule takes over. A file holding two rules that disagree is worse than a longer file holding one rule that is right. When something matters only for one kind of work, it still belongs in a document this table points at rather than here.

| Document | Authority over | Read it before |
|---|---|---|
| `structure-map.html` | Titles, seotitles, slugs, module and section numbering, the curriculum arc | Creating any page, or naming anything |
| `diagram-spec.html` | Every figure: the reader's test, when to draw at all, type, colour, the canvas, the per-figure pass | Drawing, redrawing or removing any diagram |
| `diagram-check.js` | The measurable half of the per-figure pass, so it is not retyped fifteen times a session | Verifying any redrawn or inherited figure |
| `design-plan.html` | Why a shipped design decision was made, and what was rejected. **Closed 21 Aug 2026 -- not a work queue** | Understanding an existing design choice. Never for finding work |
| `content-component-rulebook.html` | Every component, its tier, when it is earned, prose rules, the 20-item checklist | Writing any section body |
| `QA_Rulebook.html` | The 13-point delivery gate, binary PASS/FAILED | Declaring anything done |
| `completion-tracker.tsv` | Which pages are written, QA'd, SEO-complete | Deciding what to work on |
| `site-architecture.md` | The four section shapes, what carries between them, world mechanics, the roadmap, hosting at scale | Starting a new section, designing a new world, or deciding what a section inherits |
| `development-plan.md` | Phases, status, what is next | Deciding what to work on |
| `template-source/README.md` | How the five downloadable workbooks are built, and how the M19 screenshots are captured | Changing anything in a template, or reshooting a spreadsheet |

**Read the relevant one; do not work from memory or from this summary.**

These documents were produced during earlier plain chat sessions. They are close to accurate but not infallible, and they predate parts of what shipped. Never follow a specific literally without checking it.

**Precedence when documents disagree with the code: the code wins. Say so out loud, then correct the source document and add a revision-history entry**, so it becomes fact rather than a legacy record of intent. Amit has asked explicitly for this; the documents are meant to get stronger as the site grows, not to rot. The rulebook states this principle itself about the stylesheet. One known stale spot: the structure map says "nothing has been built" (the restructure shipped) and its M03 §8 note says SDR is M20 (it is M19). The rulebook's front matter examples were the other, and they were fixed in its own 6 August 2026 revision: `seotitle` and `tagline` are both present and marked required, and Classifications is numbered 11.

---

## Site architecture

**Hugo v0.123.7 extended. No theme. No shortcodes anywhere.** Every component is raw HTML written directly into `.html` content files, styled by a fixed class vocabulary in `static/`. There is no `layouts/shortcodes/` and there never has been.

**New content files are `.html`, never `.md`.** `hugo.toml` has no `[markup.goldmark.renderer]` block, so `unsafe` defaults to false and Goldmark silently strips raw HTML from Markdown. This shipped as a live bug on five category pages until August 2026.

**The site is reusable containers, not one-off sections.** Two exist: a heavy-content container that teaches a whole platform (Adobe Analytics, then CJA, RTCDP, AJO) and a step-by-step task container (Web SDK migration, then mobile SDK, then Analytics to CJA). A certification-prep container is undesigned. **A new section should cost content and nothing else**, which is the whole reason the shared layer below exists. Stated by Amit 2 Sep 2026.

**The global layer, shared by every world and living in `chrome.css` plus four scripts.** The header (`partials/siteheader.html` + `siteheader.js`), the print document (`partials/printdoc.html` + `printdoc.js`), the byline, the search shell (`search.js`), figure zoom and the overlay (`figures.js`), the Ask Amit bar (`askbar.js`), and the About mark with its overlay. `--header-h` is owned by `chrome.css` and read by both worlds' layouts. **Anything genuinely identical in two worlds belongs here, not copied.**

**A "world" is what remains after that**: a top-level `.Section` with its own stylesheet, JS and content shell. Two exist: `/web-sdk-migration/` (blue accent, `world-shell.css`) and `/adobe-analytics-learning/` (crimson accent, `world-learning.css`). The switch is a lookup in `[params.worlds]` in `hugo.toml`, keyed on `.Section`, carrying each world's `css`, `js` and `root`. **Adding a world is a config block, not a new branch** — INF-05 and INF-06, done 20 Aug 2026, deliberately before CJA becomes the third one. Each world also owns its own `phases`; they used to sit in a single global `[params.phases]` that any world using `wherefits.html` or `homemap.html` would silently inherit.


**Every size comes from a token. Never hard-code a px in a component.** `:root` in `world-learning.css` carries a type scale (`--fs-title` 34, `--fs-h3` 24, `--fs-body` 17, `--fs-sm`, `--fs-label`, `--fs-meta`, `--fs-micro`, `--fs-code`), a spacing scale (`--sp-xs` 6 through `--sp-xl` 48), line-heights, and one column width (`--column` 760px, prose and figures alike). Each has a mobile step in the 880px query and the type scale has a print step in points. Changing a size means changing a token, never a rule. Before this existed the whole reading column was 16px and component margins had drifted across five arbitrary values.

**Colour is tokenised the same way, and three of the tokens exist because a colour cannot be reused across grounds.** The accent is `--accent` (#ba2142, deepened off Tailwind's rose-600 on 18 Aug because the old value measured 4.49:1 on the page ground and failed AA), with `--accent2` as its companion and `--accent-light` as its wash. Alongside them:

- **`--on-accent`** is what goes *on* an accent fill: `#fff` in light, the dark ink in dark. **Never hardcode `#fff` on an accent background** — it measured 3.19:1 in dark before this existed.
- **`--success-ink` / `--warning-ink` / `--info-ink` / `--danger-ink`** are the semantic colours dark enough to carry *text*. The bare `--success`, `--warning` and `--info` remain the cross-world constants and keep doing tints, borders and icons. **Never set small type in a bare semantic token**: `warn-hdr` on its own amber wash measured 1.91:1. The `-ink` tokens go *lighter* in dark, not darker, exactly as `--accent2` does.
- **`--code-chrome-ink`** exists because the code header is dark in *both* themes. **A token used on a fixed-dark surface cannot follow the theme** — darkening `--text3` for light-mode legibility would have taken `.code-lang` from 6.75:1 to 3.19:1. Check every consumer of a neutral before you move it.

`--diagram-min` (700px) is the width an inline-SVG figure holds so its text stays legible; see the diagram note below.

## Typography: three faces, and the rule that keeps them apart

**IBM Plex Sans, IBM Plex Mono and Manrope, all self-hosted** in `static/fonts/`, three woff2 files totalling 84KB, all three preloaded on every page, `@font-face` rules in `chrome.css`. **Never add a CDN font link**; the site loads no external assets at all.

**The rule is one sentence: Manrope names things, Plex says things, Mono is for code.** Manrope is the display face and it is spent only on *identity* — a name, a mark, or the title of a destination. Every other word on the site is Plex. That contrast is the whole reason the wordmark reads as a mark rather than as large text, so the constraint is not stylistic tidiness: **each new Manrope selector makes every existing one worth slightly less.**

Where Manrope is allowed, and this list is exhaustive as of 2 Sep 2026:

| Selector | What it sets |
|---|---|
| `.site-brand-name`, `.site-section` | the header wordmark and the section name beside it |
| `.hm-word`, `.hm-title`, `.tile-title`, `.hm-foot-brand b` | home: wordmark, H1, the two guide tiles, footer mark |
| `.ab-name`, `.gfoot-brand b` | About: the name, the footer mark |
| `.about-name` | the About overlay's name, global |
| `body.page-plain .guide h1` | the 404 heading |

Everything else is **IBM Plex Sans**, inherited from `body`: all prose, lesson and step titles, every h3, taglines, bylines, navigation, tile sub-lines, both worlds. **IBM Plex Mono** is code and identifiers only: code blocks in both worlds, inline `<code>`, and `.ab-cert-id`.

**Before adding a Manrope rule, the test is whether the text is a NAME.** "Adobe Analytics Learning" on a tile is a destination's name, so it qualifies. A tagline, a heading inside an article, or a section label is not a name however important it looks, and it stays Plex.

**Never verify a typeface from `getComputedStyle().fontFamily`.** It reports what the CSS asked for, not what the browser drew, and it will report `"IBM Plex Sans"` on a page rendering Segoe UI. The only honest check is to measure: put the string in an off-screen `white-space:nowrap` span at the element's own size and weight, once with the page's stack and once with each candidate named alone, and compare widths. Identical width to the candidate is the proof. `[...document.fonts].map(f => f.family + ':' + f.status)` is the second check and should list all three families as `loaded`.

**A section page is three columns above 1244px**: sidebar, article, and the in-page spine. The spine is built by `world-learning.js` from the h3 stack and is switched on by the `has-rail` body class, which `baseof.html` adds for `type: lesson` only. Below 1244px it becomes a drawer on a floating button. It is generated, never authored.
**Content types** map to templates by front matter `type`: `category`, `module`, `lesson`, `glossary` in the learning world; `step`, `kb`, `ref` in the migration world.

---

## The silent-failure traps

None of these produce an error. All of them have bitten this site.

1. **`description:` is the publish flag.** `layouts/partials/wherefits.html:77` and `homemap.html:56` count child pages that have a `description`. A section without one renders dimmed and unclickable in the pocket map and the home map, and a module whose sections all lack one collapses to "Coming soon". The tracker's "Content created" column and this field agree exactly.

2. **A new module must be added to `[params.phases]` in `hugo.toml`.** That block is the only module-to-phase mapping. Miss it and the module appears in the left navigation but vanishes from both maps, with no build error.

3. **`layouts/lesson/single.html:9` regex-matches the literal string `<div class="ref-box">`** to inject the doc-note block above it. Single quotes, an extra class, or extra whitespace silently breaks the injection. **The match has a second condition that is easy to miss**: the regex also requires an Adobe domain (`experienceleague.adobe.com`, `adobe.com/go`, or `://adobe`) to appear inside the box, so a `ref-box` of purely internal links is deliberately skipped. That is intentional and commented in the template, but it means a `ref-box` can be perfectly well-formed and still get no doc-note, which looks identical to the injection being broken.

A fourth, fixed 14 Aug 2026 and easy to undo by accident: **the `?v=` content hash on the stylesheet and script tags** in `layouts/partials/head.html:41` and `layouts/_default/baseof.html:162`. Without it the asset URL never moves when the file changes, so browsers serve a stale copy and a CSS edit appears to do nothing at all. It cost an hour of debugging a component that was correct the whole time, and in production it would have left every returning visitor on the old stylesheet. **Do not remove those, and never confirm styling by injecting CSS into a page** — that proves the CSS works when applied, not that the page applies it. Check the delivered page.

A fifth, already fixed and documented in `hugo.toml`: the `[frontmatter]` block decouples `lastmod` from the `date` cascade. Without it a `lastmod` one day ahead of a UTC build clock gives the page a future `publishDate` and Hugo drops it silently. This once removed 103 pages while the build reported success. **Do not remove those lines.**

**The everyday form of that trap is the clock, not the config, and it fired again on 30 Aug 2026.** This machine runs IST, which is five and a half hours ahead of UTC, so from 18:30 local until midnight the local date is already tomorrow while Hugo's build clock is still on today. Dating a new section with the local date makes `published` a future date, and the page silently vanishes: the build reports success and the count drops by one. **Date front matter from `date -u`, not from the local calendar**, and never write today's date after 18:30 IST without checking. The page-count assertion is what catches it, which is the entire reason that check exists.

A sixth, found 18 Aug 2026 while rolling out the three-column shell: **a CSS grid item with a pixel `max-width` does not shrink below its track.** `min-width:0` is not enough; it needs `max-width:min(760px,100%)`. Without it the article rendered 109px wider than a 390px phone, and because a `position:fixed` header with `left:0;right:0` sizes to the *overflowed* width, the header stretched too and slid away sideways when the reader scrolled. Two symptoms, one cause, and neither looks like a grid problem. **Whenever a container becomes a grid or flex item, check it at 390px before anything else.**

A seventh, and it has caught me three times in one session: **`body.world-learning .lcontent p` and `… li` are specificity (0,2,2) and beat any bare component selector.** A new rule like `.lscale{font-size:var(--fs-meta)}` silently renders at body size instead. It hit the breadcrumb, the five box-prose rules, and the landing-page scale line. **Any new `<p>` or `<li>` inside `.lcontent` needs the scoped form** — `body.world-learning .lcontent p.lscale` — or add an element qualifier to win on specificity. The symptom is always the same: the token is correct, the rule looks right, and the page ignores it.

**The same trap has a second form that is harder to see: equal specificity, decided by source order.** On 18 Aug a new `body.world-learning .lcontent th` rule was written to restyle table headers, and it was ignored — because the existing rule has *identical* specificity (0,2,2) and sits several hundred lines later in the file. Scoping harder does nothing here; you have to edit the existing rule in place, which is the better outcome anyway because it leaves one rule rather than two fighting. **When a new rule does nothing and its specificity already matches, check whether the rule you are trying to beat comes later in the file.**

An eighth, found the same day and worth knowing before any theme work: **flipping `data-theme` on `documentElement` from the console is not a valid way to test dark mode.** The site's own theme script also sets `style.colorScheme`, and several components carry `transition:background,color`, so an attribute flip reports UA-default backgrounds and mid-transition colours. It produced two confident, entirely false AA failures. **Test dark by setting `localStorage['site-theme']` and loading the page**, the way the site itself does it.

A ninth, and it is the twin of the eighth: **a hidden page freezes transitions and animations, so computed styles read back the pre-transition value.** If the browser pane is not displayed, `document.visibilityState` is `hidden`, and hovering an element then reading `getComputedStyle` returns its *resting* transform and filter even though the hover rule matched. On 19 Aug that made a working hover look broken three times over. The tell is an inconsistency: the animation *name* appears while the transform still reads as rest. **To check a hover's cascade rather than its timeline, neutralise the transition** (`transition:none !important`) and read again.


**A tenth trap, and it is the worst kind because the build reports success.** Removing a component from a content file by script can eat a closing `</div>` that belonged to something else. On 19 Aug an unwrap that took two figures out of M03 §3 left two divs unclosed, and the `code-block` that followed never closed — so the rest of the section rendered *inside* it, white prose on the code block's near-black ground, for the whole page. Hugo built 219 pages and said nothing, because unbalanced divs are valid enough to parse.

**Check div balance after any scripted edit to content**, and never trust a page you have not looked at:

```bash
for f in $(find amitdusane-site-complete/content -name '*.html'); do o=$(grep -o '<div' "$f" | wc -l); c=$(grep -o '</div>' "$f" | wc -l); [ "$o" -ne "$c" ] && echo "UNBALANCED $f  open $o close $c"; done
```

Depth counting has to count *every* `<div` and `</div>` on a line, not line-anchored patterns: inner tags are indented, outer ones are not, and a pattern like `/^<\/div>$/` closes the block at the first outer-looking tag it meets, which may not be the right one.

**An eleventh, found 20 Aug 2026, and it is expensive because it wastes whole verification passes.** `hugo server`'s file watcher **silently misses in-place rewrites in this tree** — a `perl -pi` or any editor that replaces rather than appends. The source is correct, a clean build is correct, and the served page is the old one. It looks exactly like an edit that did nothing, which is the same symptom as trap four, so the instinct is to go hunting in the CSS or the cascade.

It cost three false verification passes in one session, each one a full re-measure of nine figures in two themes.

**Fixed 1 Sep 2026, and the cause is the filesystem rather than Hugo.** This tree sits inside OneDrive, whose sync layer does not reliably emit the filesystem events `hugo server` listens for, so an in-place rewrite often produces no event at all. Measured before the fix: twelve edits and reverts, six picked up and six missed, with no pattern. Intermittent is worse than broken, because a served page cannot be trusted and cannot be shown to be wrong.

`--poll` replaces event watching with polling and removes the problem entirely: the same twelve-edit test passed twelve out of twelve. `.claude/launch.json` now carries `--poll 700ms`, and **the server can therefore stay running all day**, which is what Amit needs it for. Do not remove that flag; without it the preview silently serves stale pages about half the time.

**The other half of the old rule still stands, and `--poll` does not touch it.** A CLI `hugo --gc` must never run against the same tree as a live server, because `--gc` collects the shared resource cache underneath it. That is what silently wrote stale content into two pages on 26 Aug while reporting success. The fix is to give the verification build its own output and its own cache, so the two processes share nothing:

```bash
hugo --gc --source amitdusane-site-complete --destination "$SCRATCH/verify-public" --cacheDir "$SCRATCH/hugo-cache"
```

Verified 1 Sep 2026: 219 pages, the server still answering on 1313 throughout, and the project's own `public/` untouched. Use that form for every verification build while a server is up, and keep `rm -rf public && hugo --gc` for the final build before a commit, with the server stopped.


**A fourteenth, found 2 Sep 2026, and it had been shipping for however long the Plex migration had been live.** A CSS comment that closes early turns the prose after it into a selector, and **an invalid selector makes the parser discard the block that follows it as well**. In `chrome.css` the comment above the `@font-face` block terminated on its second line; the next three lines of explanation became a selector, and the rule it swallowed was `@font-face{font-family:'IBM Plex Sans'}`. Manrope above it and IBM Plex Mono below it both parsed, so two of three faces loaded and the site quietly rendered its body text in Segoe UI.

Nothing reports this. The build succeeds, the console is clean, and the network tab shows the woff2 downloading with a 200 either way, because a `<link rel=preload>` fetches the file whether or not any `@font-face` claims it. `getComputedStyle().fontFamily` reports `"IBM Plex Sans"` throughout, because that is what the CSS asked for.

**So verify a typeface by measuring, never by reading the cascade**, using the width test in the typography section above. And after any edit near an `@font-face`, check `[...document.fonts].map(f => f.family + ':' + f.status)` lists every family as `loaded` — a missing family is the whole symptom. Amit spotted this from a screenshot before any check did.

**A thirteenth, and it fired four times in one session (2 Sep 2026), which is why it is worth naming.** When a component becomes global, **a world stylesheet holding a stale local copy of it loads last and silently wins.** Every instance looked like a different bug and all four were this: `world-learning.css` still declared `--header-h:60px` on `:root`, and because a media query adds no specificity it beat `chrome.css`'s responsive value and pinned the header at desktop height on a phone; `world-shell.css` kept the whole print chrome, so the migration running header printed at 9pt in #5b6370 from page two; the same file kept `.author-fab{width:48px}`, shrinking the About mark below the size it had in the other world; and its `.fig-svg svg{min-width:560px}` meant a figure could never shrink to the column. **When you globalise something, grep every world stylesheet for the classes and tokens it owns and delete what you find**, then verify in the world you did NOT build it for. `lFillPrintDoc` in the twelfth note below is now `printdoc.js`; the trap it describes is unchanged.

**A twelfth, found 25 Aug 2026, and it only shows on paper.** `.print-doc` is not a wrapper, it is a **layout `<table>`**: its `thead` cell carries the running header, its `tfoot` cell the footer, and its single `tbody` cell holds *the entire article*, copied in by `lFillPrintDoc` on `beforeprint`. So **`.print-doc td` does not mean "a table cell in the content", it means "the page"**. A rule meant to give content tables a grid was written that way and instead drew a border around the whole sheet, boxed the header, and set every paragraph on the page to 8.5pt. It builds clean, it is invisible on screen, and it only appears in a print preview. **Scope every print rule for a content element through the class that identifies it** — `.print-doc .tbl-wrap td`, never `.print-doc td`.

The same file has a related trap in the other direction. A dark-mode rule survives into print if it does not use tokens, because the print block resets `--text*` and friends but cannot reach a hardcoded hex. On 25 Aug `[data-theme="dark"] .path-title{color:#CECBF6}` printed pale lavender on white. Its neighbour `.path` escaped only by accident: that rule is scoped `[data-theme="dark"] body.world-learning .lcontent .path`, and the print document lives in `#printBody`, **outside `.lcontent`**, so it stops matching. **A dark rule that hardcodes a colour and carries no `.lcontent` ancestor will reach paper**; those are the ones to audit. Overriding needs `!important`, since the dark rules sit hundreds of lines after the print block at equal specificity.

---

## Building

```bash
hugo --gc
```

**Never `hugo --minify`.** The minifier destroys inline SVG text elements.

**Delete `public/` before rebuilding after any content change.** Building on top of an existing `public/` produced a corrupt page on 16 Aug 2026: M14 §2 rendered with its content cut off mid-tag, dropping the last `ref-box` link and its closing tags so the prev/next navigation fell inside the box. The source was perfect throughout, and a clean rebuild fixed it with no edit. A `hugo server` running against the same tree while `hugo --gc` collects the shared resource cache is the likely aggravator. It costs a second:

```bash
rm -rf amitdusane-site-complete/public && hugo --gc --source amitdusane-site-complete
```

**A workbook open in Excel freezes the dev server, silently.** Hugo copies `static/templates/*.xlsx` on every build, and Windows will not let it read a file Excel has open. The build fails at the static copy step with `The process cannot access the file because it is being used by another process`, *after* the pages have rendered, so the error names the file rather than the cause.

On a CLI build that error is at least visible. **On `hugo server` it is not.** The server keeps serving the last successful build and every later rebuild fails in the background, so the source moves and the served page does not. It looks exactly like a dead file watcher, and on 1 Sep 2026 it sent me chasing `--poll` for half an hour before a failed server restart printed the real error. The `--poll` finding above still stands; it was tested before the workbook was opened, and it is not what broke.

**So when the served page is stale, check for a locked workbook before suspecting the watcher.** `Get-CimInstance Win32_Process -Filter "Name='EXCEL.EXE'"` names it, and closing the workbook is the whole fix. This will keep happening, because M20 tells the reader to open the validation report and follow along, which is exactly what Amit was doing.

**Assert the page count after every build.** Current baseline: **195 pages on a production build, 196 on a staging build**. It was 219 and 220 until 3 Sep 2026, when RSS was built properly: Hugo had been emitting a feed for every section, 27 of them, none linked from anywhere, while the three pages a person would subscribe to had none. Killing the 27 and adding 3 is the whole of the difference. **HTML page count did not move: 187 before and after, with identical file lists.** Hugo counts each output format as a page, so a feed change moves this number without touching a word of the site. The extra one is the generated `_headers` file, which `layouts/index.headers` emits only when the baseURL is not amitdusane.com; on production the template produces nothing and Hugo writes no file. A non-production build reporting 195, or a production build reporting 196, means the guard has inverted and should be investigated before anything else. If the count drops, stop and find out why before doing anything else. This single check would have caught the 103-page outage in one second.

**A dropped page does not surface as a 404, it surfaces as "Coming soon".** The pocket map, the home map and both landing templates count published children, so when pages vanish for any reason every module falls through to its empty state and the site fills with that phrase. It reached testers on 3 Sep 2026, from content dated a day into the future, and read as a half-built site rather than an absent section. Nothing here has a "coming soon" mode; there are only templates with nothing left to list. When the count drops, look at that empty state before believing a feature was switched off.

Then crawl the built HTML, not the source. Source passing every check proves nothing; the bug lives in the interaction between source and build.

**The page count is not enough, and on 26 Aug 2026 it missed a real fault.** A build reported 219 pages and success while silently writing stale content into two pages, with a file timestamp *newer* than the source. The cause was a `hugo server` running against the same tree while `hugo --gc` ran. Nothing flagged it. Amit found it by reading the site, which is the expensive way.

**So compare source against build, not just the count.** Extract the `h3.subsec-title` text from every section source and from its built page and compare. It takes seconds and it is the only check that catches a build that lies about having succeeded. Any mismatch means the build output cannot be trusted anywhere, not just on the page that flagged.

**Only one `hugo server` may run against this tree, and no CLI build may share its output or its cache.** Two servers plus a CLI build is what corrupted it. `.claude/launch.json` defines exactly one server, on port 1313, with `--poll 700ms`.

That server is meant to stay up while work happens, so do not stop it out of habit. While it runs, verification builds go to a separate destination and cacheDir (see trap eleven); only the final build before a commit uses `rm -rf public && hugo --gc`, with the server stopped first. If a preview still looks stale, confirm the served markup carries something unique to your edit before debugging any CSS.

---

## What this site is for, and why anyone would return to it

**Write for one reader: somebody who has already been through the documentation, still has questions, and finds the topic rigid and boring.** Not a beginner, and not someone who needs convincing that Adobe Analytics exists. Somebody stuck. That single assumption decides what to explain and what to take as read, and it is the most useful line in this file.

**The site is not a replacement for Adobe's documentation. It is what makes that documentation legible.** Adobe writes reference material for people who already know what they need, which is a permanent constraint rather than a failing: they sell to every customer, so every answer has to be "it depends". That constraint is exactly why the gap here is durable. A reader who understands why a thing exists can go back to Experience League and find that it suddenly makes sense, including the parts that previously looked arbitrary. **The `ref-box` is that handoff, not a courtesy** — it is where an equipped reader goes next.

**The real subject is how to think about a topic, not the topic.** Any single section teaches one concept and opens doors to others. What should survive is the method, because a reader who has it can teach themselves the next thing without you. That is the master key, and it is why a section that only transfers facts has failed even when every fact is right.

**The identity is deliberately narrow: answer WHY, then solve HOW.** Not comprehensive coverage. An actor who tries every genre masters none; the ones who last pick a lane. History, story and real situations are how the WHY gets delivered, and the technical detail follows once the reader knows why they need it.

**Chase uniqueness, not completeness. A gap is acceptable; drift is not.** A missing fact costs a reader's respect once. A section that has wandered off its subject, or off the voice, costs the reason they came. So the right content at the right point beats more content, always, and "we do not cover that" is a legitimate answer.

**This matters more than it sounds, because every quality mechanism here can only add.** The rulebook's checklist finds things absent or malformed. The QA gate finds things missing or inconsistent. Comparing a section against a generated reference finds things not covered. **None of them can say cut this.** Additions-only review is therefore the default direction of the whole process, and left alone it drifts the site toward the shape of a reference document, one defensible addition at a time, invisibly, because each addition is individually justified.

The counterweight has to be deliberate. When reviewing a draft or proposing an addition, ask what comes out, whether the section is still about one thing, and whether the new material serves the reader at that point or only makes the page more complete. Established 10 Aug 2026, after comparing M12 and M13 against generated references on the same topics: both comparisons produced only recommendations to add, which is the one output that shape of analysis can produce. Amit's ruling: **do not run that comparison across the finished modules.** Use a generated reference as a checklist *before* drafting the unwritten sections, where it costs nothing and touches no signed-off work, and use the factual accuracy pass rather than a coverage pass on what already exists, because wrong is worse than incomplete.

**The same drift produces backlogs, and on 21 August 2026 one was killed for it.** The design review of 17 August became a 106-item plan; by the time it was closed, sessions were spent arguing about whether its own items were necessary while the remaining 32 sections went unwritten. Amit's ruling: **stop the activity, discard the 55 open items outright, and do not carry them forward.** He holds what matters himself and will raise it when the content is done.

So: **do not build or maintain long backlogs of improvements, and never let meta-work displace writing.** A list of possible work is not progress, and a list that only grows will always argue itself into more work. When something worth doing appears mid-task, either it is small enough to do now, or it is important enough to say in one line, or it does not survive. `design-plan.html` is a closed record of *why* shipped things look the way they do; it is never a source of what to do next.

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

**That ratio is the single easiest thing to get backwards, and getting it backwards is what makes writing read as generic.** During M14 the beats became the default texture and the long accumulating sentence nearly disappeared. Amit's diagnosis: "typical hook style, half sentences and pauses, dramatic, typical AI language." He was right, and the fault is measurable. Paragraph medians, taken from the corpus:

| Section | Median paragraph | Under 18 words |
|---|---|---|
| M13 §1 understanding-segments | 75 words | 0% |
| M11 §2 designing-the-key | 41 words | 8% |
| M14 §4 **before** the fix | 39 words | 10% |
| M14 §4 **after** the fix | 72 words | 3% |

**Measure a draft against M13 §1 and M11 §2 before declaring it done.** Median paragraph in the sixties or seventies, beats at roughly one per section, not one per heading.

**Paragraph median is not sufficient, and on 26 Aug 2026 it passed while the writing failed.** M15 cleared it and Amit still had to read sentences two and three times. His diagnosis: it read like a movie script, where the first pass does not land, the second does, and the third makes you admire the construction. The fault was at sentence level, which nothing was measuring.

**So measure sentence median too. Target the low teens, and treat anything over about 34 words as needing a split.** M13 §1 sits at a median of 12 with 10% of sentences over 30 words. M15's first draft sat at 23 to 25 with a quarter over 30, and reads completely differently after the rewrite despite saying the same things.

**The sentence he picked out is the whole diagnosis**, and the shape recurs: a subordinate clause in front, the subject delayed to the end, and a figure of speech closing it.

> Sitting immediately above the window in every one of the three places attribution is configured is a control that can silently overrule it, and its two options are not two flavours of the same thing.

became

> Just above the lookback window there is a second setting called the container. It has two options, Visit and Visitor, and picking the wrong one can cancel your window without telling you.

**Put the subject at the front. One idea per sentence. Say the thing before explaining it.** The test is the colleague sitting next to you who knows nothing about the topic: praise should come from being understood, never from the construction.

**Amit also ruled out three habits the guidance below can otherwise invite** (26 Aug 2026): staged dramatic openers, one-sentence pauses used for effect, and cause-and-effect rhetorical chains. Openers are still situations, told plainly, with no build-up.

The problem is structural rather than stylistic, and six habits fix it:

1. **Openers are unfolding situations with people and time passing**, never aphorisms. M13 §1 opens on three requests across one working day before any summary lands. "Nobody has ever been persuaded by a table" is the failure mode.
2. **Accumulate, do not reveal.** Paragraphs pile clauses until they arrive somewhere. The setup-turn-landing unit, repeated, is the signature of persuasive-essay AI prose.
3. **Cut the turn construction.** "It is not." "You have not." "It never had." This was the most artificial habit in the writing and it was everywhere.
4. **Headings ask or reassure**, rather than declaring. "Why not just call it a filter" beats a label.
5. **Enumerate fully instead of compressing elegantly.** "Referrer Type report, then calculated metrics, then flows, then fallout" is better than "five report types". The full list is what makes a reader feel the weight.
6. **Develop an analogy across a paragraph** and walk it through step by step, the way M13 §1 does with the encyclopedia. An analogy fired in one sentence is decoration.

Add connective tissue, and allow productive redundancy: say a hard idea a second way. Prose where every paragraph could be reordered without damage is essay writing, not explaining. **The test is always the junior colleague sitting beside you**, which is Amit's own instruction and the thing all six habits serve.

**Openers are never definitions.** Three patterns recur: a continuity recap that walks back over what the reader has and names the gap; a concrete scenario or extended metaphor carried through the whole section; or the failing report shown before the feature is named.

**Humour is dry, structural, and rare.** A wry observation inside an otherwise serious paragraph. Never a joke, never an exclamation mark, never a parenthetical aside.

---

## Section anatomy

**No H1 or H2 in body content.** The layout supplies them. A section is a flat stack of `<h3 class="subsec-title">` blocks, typically 5 to 17.

Invariant structure:

1. **Untitled opener.** One to three paragraphs before the first h3, doing continuity recap or scenario setup, with inline links back to earlier sections.
2. **Body.** The h3 stack, each 2 to 6 paragraphs, interleaved with earned components.
3. **The practical walkthrough, second to last h3.** Before the section closes, answer the question the reader actually has: *what do I do with all of this?* An ordered, numbered walkthrough in a **`dothis` block** — which screen to open, what to install, what to save, how to verify — ending with an explicit statement that there is nothing else to configure, and a line making clear these steps are a floor rather than a ceiling. Deployment gotchas hang off this block rather than sitting apart from it, because they belong to the doing. Established 10 Aug 2026 on M07 §5; skip it only when the subject genuinely has nothing to configure.

   **The component is `dothis`, not `code-block`** — corrected 30 Aug 2026 against the code, which is the authority. `.dothis` is in 51 content files and has two body shapes, and its CSS comment records Amit's ruling that they are one family: `.dothis-steps` for a sequence where order matters, `.dothis-fields` for a finished setup to copy. Markup is `.dothis > .dothis-hdr` (holding `<b>Do this</b>` and a `<span>` subtitle), then `ol.dothis-steps` whose `li` each carry `span.ds-do` and `span.ds-see`, with `li.ds-group` splitting long walkthroughs into parts, and a closing `p.dothis-end`. The `code-block` remains what it always was, a labelled block of code or configuration, and it is still correct inside a walkthrough step.

   **This block is the engine, not the appendix.** Amit learned by following experts' steps first, getting an outcome, and only then asking whether there was a better way, at which point the documentation finally made sense. Outcome precedes understanding, so the walkthrough is what earns the reader's second visit and their willingness to think harder. Treat it as load-bearing.
4. **Final h3 is synthesis plus onward link**, named by function not topic: "What you have now", "Everything hinges on one thing", "Where this module leaves you". Its last paragraph names a related section, says what that section covers, and links it.
5. **`path-box`**, then **`ref-box`** last, always, exactly one. Nothing follows it.

Heading wording is editorial, not label-like. Full clauses, often with a comma, often a promise or a question. "The waterfall, and why order decides everything", not "Rule Order".

**That comma-clause shape now has a second job, so the first clause has to stand alone.** The in-page spine builds its labels by cutting each heading at its natural joint, the `, and` or the `: `, because reproducing full editorial headings makes a list nobody can scan. "A space where the work is analysis, and the name is the whole definition" becomes "A space where the work is analysis". Write the heading so that first clause still says something on its own. Where it cannot, put `data-nav="short label"` on the `h3` and the spine uses that instead.

**Heading text also becomes a permanent URL.** `layouts/lesson/single.html` slugifies every `h3.subsec-title` into an `id` at build time, so the anchors exist in the served HTML where Google can use them. Rewording a heading after publication changes its anchor and breaks any link made to it, in the same way changing a slug does.

**The `path-box` is now linked from the spine as well**, as the last entry, so a reader who only wants to know which Adobe screen this lives on can get there without reading. Its `path-title` supplies the label, which is one more reason to word it plainly.

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

**All 26 were written on 1 Sep 2026, and Amit's brief sharpened the rule into two different jobs.** They came out at 83 to 109 words, two paragraphs each, with no components, links, headings or figures of any kind. Plain language, no teaching.

**A module landing states the reader's real problem, then names three or four concepts that are the stars of that module.** Classifications opens on campaign codes nobody wants to read, not on what a classification is. The test is whether somebody deciding *should I spend an hour here* gets an honest answer.

**A phase landing is not a bucket label.** The five phases mean something: foundation, collection, shaping, analysis, maintenance. Each landing explains *why that stage exists at all* and leaves the content to the modules. The shaping page earns its place by saying that something has to sit between collection and reporting and give raw values meaning, which is the entire argument for the phase.

**Watch for the description repeating the body.** Both `module/list.html` and `category/list.html` print `{{ .Description }}` as a paragraph immediately above `{{ .Content }}`, now inside the "About this module" / "About this phase" block below the map. On the foundations page the description and the opening line listed the same three things one after the other, which Amit caught on sight. When writing a landing, read the description first and write away from it.

**The map comes first and the prose sits under it, and the two landings are deliberately different shapes.** Rebuilt 2 Sep 2026 after the first round of user testing, where almost every tester said the same three things: they went looking for the pocket map and it was not there, they expected the page to teach and it did not, and they could not tell a module landing from a phase landing.

All three were true and mechanical. The pocket map was rendered for `type: lesson` only, so the two page types whose entire job is orientation were the two without it; `baseof.html` now renders it for `lesson`, `module` and `category`, and `wherefits.html` is type-aware (a phase names no module, which is correct). Both landings opened with prose and put the links underneath, which on a 390x700 phone put the first link at y=1028 — so the page read as an article that never reached its point. And the two templates were near-identical: same crumb, title class, byline, scale line and `<ol>`, differing only in list contents.

So: a **module landing is a numbered contents list** (`ol.lland-secs`), because its children are an ordered reading sequence, and each row carries that section's own `description` — the line that decides which section you want, already written and previously shown nowhere a reader could use it. A **phase landing is a grid of module cards** (`.lland-mods`), because its children are four or five destinations chosen between rather than worked through. Each carries an eyebrow naming its place: "Module 11 of 21 · Shape the data", "Phase 3 of 5".

**The prose itself did not change and must not be rewritten to suit the new shape.** It is signed-off writing that does real work for a search lander; it was only ever in the wrong place on the page.

**The left rail was the other half of the same complaint.** Every phase and module row used to be a link to a landing, so the rail read as a list of 26 landings with the 116 sections buried under them, and clicking "Classifications" expecting its contents got a page that teaches nothing. **Each row is a `<button>` now and toggles what is inside it**; the landing survives as a quiet `.lnav-ovw` Overview row within, separated by a hairline. The accordion JS keys on `.lnav-header` / `.lnav-cathead` rather than the old chevron classes, which are decorative spans today.

**Do not dim anything with `--text3` and expect it to read as quieter.** `--text2` and `--text3` are both `#94a3b8` in dark, so a colour step that works in light does nothing at night. The first Overview row was distinguished by colour plus a 600 weight and came out *louder* than the sections beneath it — the exact inversion the row exists to avoid. Separate with a rule, a size, or position instead.

**`module/list.html` did not render `.Content` at all until 1 Sep 2026.** The category layout always had it; the module one did not, so a module landing had nowhere for a body to go. That is the likeliest reason none was ever written. One line was added to match the category layout.

**Every landing is now `_index.html`.** The 21 module landings were `.md` and were converted with their front matter carried across unchanged. The old permission for a `.md` module index no longer applies to anything, and reintroducing one would restore the Goldmark trap for no gain.

A `path-box` is included only if the subject has an Adobe screen. A data layer does not; a report suite setting does.

---

## Component quick reference

Full specifications, including when each is earned, are in `content-component-rulebook.html`. Read it. This table exists only so the class names are correct.

**Every box and figure label is one voice: Plex Sans 700, sentence case, `--fs-label` (15px).** That covers `warn-hdr`, `info-hdr`, `pro-tip-hdr`, `ref-title`, `path-title`, `diagram-title` and `shot-title`. A label reads as a label through **weight and size**, never through case or tracking. Uppercase survives in exactly two places, where it is a convention rather than a style: table column headers and `code-lang`. **Do not set a label in mono, uppercase or letter-spaced.** That version was built on 18 Aug and rejected on 19 Aug: mono with caps and tracking is a recognisable generated-page signature, and this site cannot carry a typographic tell that undercuts its own claim. Colour comes from the `-ink` tokens above, never the bare semantic.

| Component | Structure |
|---|---|
| `warn-box` | `> .warn-hdr + p`. Icon is `<span class="warn-ico"></span>`, a drawn tile. No emoji |
| `info-box` | `> .info-hdr + p` |
| `pro-tip` | `> .pro-tip-hdr + p` |
| `path-box` | `> .path-title > .path-ico + text, then p`. `path-ico` is an empty span |
| `ref-box` | `> .ref-title + ul > li > a`. Official Adobe docs only, 2 to 4 links, `target="_blank"` |
| `code-block` | `> .code-hdr > .code-lang + .code-copy` then `.code-body > pre`. Copy button needs `onclick="copyCode(this)"` |
| `tbl-wrap` | Wraps every table. Never a bare `<table>` |
| `diagram-box` | `> .diagram-title` then inline `<svg>` directly, or `.diagram-content` wrapping a layout component |
| `cards` | `> .card` (or `a.card`) `> .card-icon + .card-title + .card-desc` |
| `shot-box` | `> .shot-title + .shot-frame` (holding the `<img>` and a `button.shot-zoom-btn`) `+ .shot-note`. Product screenshots |

**`pro-tip`, `info-box` and `warn-box` hold exactly one paragraph.** Their `p` is set to `margin:0`, so a second one renders butted against the first with no gap. A scan of all 117 sections on 26 Aug 2026 found none had ever held two. `path-box` is the exception at `5px`. Put continuation prose after the box, in normal flow.

**A screenshot is never wrapped in a link and never redacted.** The image carries `pointer-events:none`; only the zoom button opens anything, and it opens an overlay in the same tab that `world-learning.js` builds. Crop to the feature rather than the screen, because the image area is about 290px on a phone. Every shot earns a `shot-note` that points at something, and if none can be written the shot is not earned. Two per section is plenty. Capture from the Adobe training account with a harmless dimension so there is nothing to hide; blur is not redaction. **Name the file for what the picture shows, not for where it sits** (changed 24 Aug 2026): `static/img/adobe-analytics-evar-allocation-expiration.webp`, lowercase, hyphens, no module or section numbers. A filename is a real ranking signal in image search and the old `aal_module<NN>_section<NN>_ss<N>` scheme told a crawler nothing. Rename before publication, never after. Originals archived under the same name in `screenshot-originals/`, outside the site folder.


### Generated furniture: never authored, never hand-copied

Four things now appear on a section that no author writes. Knowing they exist matters, because editing a section can break them.

| | Built by | Notes |
|---|---|---|
| **Byline** | `partials/byline.html` | `full=true` on sections, `full=false` on the 21 module and 5 phase landings, where it is name and credential only. Read time is computed **here, once**, and published on `data-readmins` for the spine to read. Never count words twice: doing so once showed 13 minutes in one place and 14 in another. |
| **In-page spine** | `world-learning.js` | From the h3 stack, on pages carrying `has-rail`. |
| **Heading anchors** | `lesson/single.html` | At build time, so Google sees them. |
| **Monogram** | `partials/logo.html` | The only copy. It was in six places and every change was six edits. Takes `size`, `hidden`, and `ink` for the print header, which forces the light palette and cannot use `currentColor`. |

**The floating controls have a deliberate order of loudness**, and it should not be disturbed: the green pocket map is the loudest because it carries a reader across 116 sections, the page-nav button is quiet surface-and-border, and the About mark is the monogram alone with no container. A utility for moving inside one page must never outweigh the site's identity.

**The About mark carries a permanent indigo halo** (19 Aug 2026), because removing its disc cost it its affordance: a bare logo in a corner does not read as a button. It is permanent rather than hover-only, since a hover-only cue does not exist on a phone. Three things about it are load-bearing. It is a **radial-gradient pseudo-element, never a box-shadow** — a box-shadow spreads from the button's square box and blooms as a rounded square. Its falloff must reach **true zero at the full radius**; the first version stopped at 78% while still at .18 alpha, and that surviving step read as a drawn circle. And it is **indigo, not the crimson accent**, because the monogram is navy and a red halo behind a blue letterform reads as an applied ring rather than as light. It stays indigo on every world, including the blue migration world, because this is the personal-brand mark rather than a per-world control. This deliberately raises the mark above the order of loudness above; Amit asked for it on 19 Aug, and WAY-07 should be decided knowing it.

Never invent a class. If it is not in `static/world-learning.css`, it does not exist.

Never nest a `code-block` inside a `warn-box`, `pro-tip`, or `info-box`. State the rule in the box, put the code block after it at normal level.

`code-lang` is a **label, not a language**. "Marketing Channel Rule", "club-members.csv", "Follow along: build a basic sequence" are all correct. The component's most valuable use is UI configuration walkthroughs, not code.

**SVG colour must live in a `style` attribute with a hex fallback.** `fill="var(--accent)"` as a presentation attribute does not resolve reliably. Correct form:

```html
<svg viewBox="0 0 700 250" style="width:100%;height:auto;display:block"
     role="img" aria-label="Plain-language description of what this shows">
  <rect style="fill:var(--card, #ffffff);stroke:var(--accent, #ba2142);stroke-width:2"/>
</svg>
```

Every SVG needs `role="img"` and a full-sentence `aria-label`.

**Use a 700-unit `viewBox`, and treat authored px as rendered px above 880px.** 61 of the 65 inline SVGs already use 700. Above the 880px breakpoint the figure holds `--diagram-min` (700px) and the box scrolls when the column is narrower, so a `font-size="11"` renders at 11px rather than at whatever the column happened to allow. Before that it was a lottery: the same diagram rendered at 4.3px on a phone and 8.2px in the three-column desktop shell, because an inline SVG is one scalable image and its text shrinks with the frame.

**At 880px and below that is deliberately reversed, and the zoom button is what pays for it.** Verified against the code 31 Aug 2026, after a measurement on a 375px phone read authored 11px text rendering at 5.1px and looked like a defect. It is not one. The mobile query sets `.diagram-box{overflow-x:hidden}` and `.diagram-frame > svg{min-width:0;width:100%}`, so the figure shrinks to fit the column, and `world-learning.js` inserts a `.diagram-frame`, a `.diagram-zoom-btn` and a `.fig-hint` reading "Tap &#10530; to see this full size". The CSS comment records the trade: horizontal scrolling inside a page is easy to miss and left roughly 390px of every figure off-screen, so once there is a way to open a figure at authored size, shrinking to the column is better than a scroller nobody finds. **So never diagnose small phone text in a figure as a fault, and never add a scroller back without reading that comment.** What the floor still buys is the enlarged view: authored below 11px is illegible even zoomed.

**Nothing in a diagram should be authored below 11px.** The corpus still has 141 places at 8 to 10.5px, 16 of which land under the ~9px legibility floor; those are known and listed under CMP-12. An HTML/CSS diagram layout does not have this problem at all — it is real DOM text, so it reflows and keeps its size, which is the strongest argument for reaching for an HTML layout over an SVG when a diagram can be built either way.

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

**A second guard runs before any merge to `main`, never before a commit.** `shot-pending` marks a screenshot placeholder holding its capture brief. Those are meant to sit on `develop` while a module is drafted, so committing them is correct and expected. What must never happen is one reaching production:

```bash
grep -rl shot-pending amitdusane-site-complete/content/
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

   Tab-delimited, 1 header row plus 222 data rows (25 Aug 2026), 15 columns: Phase, Module, Section #, Page name, Page type, URL, SEO title, SEO title done?, SEO description, SEO desc done?, Title chars, Desc chars, Content created?, Content QA'd?, Final result. Tabs are the delimiter because descriptions are full of commas. Never introduce a tab inside a field. `Final result` is Yes only when SEO title, SEO desc, Content created and Content QA'd are all Yes.

   **`Page type` splits the file into two kinds of row, and every statistic must filter on it.** Content is `Section` (116), `Module landing` (21), `Category landing` (5), `Home` and `Glossary` — 144 in total, and that number is fixed. Platform work is `Feature` (78 as of 25 Aug 2026, and it grows with each platform change), added 7 Aug 2026, carrying `Phase = Platform` and grouped by `Module` into navigation, presentation, seo, chrome, infrastructure and tech-debt. For a Feature row the SEO columns do not apply and are set to `NA`, `URL` holds the implementing file path rather than a URL, and `Content created?` means built. **Quoting a total without filtering by `Page type` will mix sections and features and be wrong.**

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
