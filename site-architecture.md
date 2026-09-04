# Site architecture

*Read on demand: before starting a new section, before designing a new world, or when deciding what a new section inherits. Not needed to write a page inside an existing section.*

---

## The four shapes

Ten planned sections, but far fewer designs. A section's shape is decided by what the reader is doing, not by which Adobe product it covers.

| Shape | Reader is | Sections | Status |
|---|---|---|---|
| **Curriculum** | Learning a subject in order | Adobe Analytics Learning, CJA Learning, RTCDP, AJO, AEP Fundamentals | Built: `world-learning.css` |
| **Procedure** | Executing a task with a correct sequence | Web SDK Migration, Mobile Web SDK implementation, Mobile Analytics (legacy), Setting up CJA reports | Built: `world-shell.css` |
| **Certification** | Testing recall and finding gaps | Cert prep per product | Not designed |
| **Playbook** | Producing an artifact | Delivery documents, long-term project management | Not designed |

**The two built shapes are templates, not one-offs.** Mobile Web SDK implementation is the procedure shape almost unchanged: `step`, `kb`, `ref` types, the `actionblock` and `astep` walkthrough, the `Why?` bridge to knowledge-base articles, numbered citations against a references page. Three future sections fit it.

Certification and Playbook are genuinely new and need design before content.

---

## What carries across every shape

These belong to the site and the author, not to any layout. They do not change when the design does.

- **Voice.** Problem first, then why, then how. Second person, zero first person, no em or en dashes. See `CLAUDE.md`.
- **Semantic colour.** `--warning` amber means "this will hurt you", `--info` blue means "worth knowing", `--success` green means "confirmed, or go deeper", and the path violet `#534AB7` is fixed. **Only `--accent` changes per world.** A reader who learns the visual language once must find it true everywhere.
- **The build gate.** `hugo --gc`, never `--minify`, assert the page count, crawl the built HTML.
- **The three silent-failure traps.** See `CLAUDE.md`.
- **Front matter**: `slug`, `title`, `seotitle`, `description` at 110 to 160 characters, `lastmod` set by hand.
- **SVG discipline.** Colour in a `style` attribute with a hex fallback, `role="img"`, a full-sentence `aria-label`.
- **Publishing.** Work on `develop`. Never `main` without Amit saying so in that session.
- **Content files are `.html`, never `.md`.**

## What does not carry

Page anatomy, component vocabulary, navigation model, and the curriculum arc all belong to a shape. A curriculum section's opener-then-h3-stack-then-`path-box`-then-`ref-box` anatomy means nothing in a procedure section, which has no h3 stack at all.

`content-component-rulebook.html` says it is "designed to be reused unchanged for Customer Journey Analytics, AEP, or any world built after." That is true for **curriculum-shaped** worlds and overclaims for the others. Correct it when that file is next edited.

---

## What a world is, mechanically

A self-contained sub-site selected by URL prefix, with its own stylesheet, JS, shell, and print document. The switch is an if/else chain in `layouts/partials/head.html:37` and `layouts/_default/baseof.html:4-6`.

**Before a third world exists, two things must change:**

1. **`params.phases` must become per-world.** `wherefits.html:12` and `homemap.html:10` read `.Site.Params.phases` globally and unscoped, so a second curriculum world would inherit Adobe Analytics' phase structure. Needs to become `params.worlds.<world>.phases` with the partials taking a world argument.
2. **The world switch should key off `.Section`** rather than growing an if/else branch per world in two files. Eight sections would make it eight branches deep.

For a new **curriculum** world the CSS is cheap: copy `world-learning.css`, change `--accent`, `--accent2`, `--accent-light` only. Every component is already token-driven.

---

## Bringing in an externally designed section

Certification and Playbook will likely be designed outside this project. A design drops straight in if it arrives with:

- The **component inventory**: every block type, what it is for, and when it is *correctly absent*
- The **states**: hover, active, answered, correct, wrong, revealed, and dark mode for each
- The **page anatomy**: what opens a page, what closes it, what is mandatory, what is optional
- Confirmation it uses **the existing tokens**, with only `--accent` swapped

A design supplied as pictures alone means guessing at the rules behind it, and produces a stylesheet that drifts from the other three.

---

## Section roadmap

Order as planned. Only the first two exist.

1. **Web SDK Migration** — live since June 2026. Procedure shape.
2. **Adobe Analytics Learning** — in progress. Curriculum shape.
3. CJA Learning — curriculum
4. RTCDP — curriculum
5. AJO — curriculum
6. AEP Fundamentals — curriculum
7. Web SDK mobile app implementation — procedure
8. Certification preparation, per product — new shape
9. Delivery documents, and managing a long-term project — new shape
10. A RAG chatbot over the whole site

Also planned, shape assigned but not sequenced: Mobile Analytics legacy implementation (procedure), Setting up CJA reports (procedure).

**Starting a new section is a kickoff conversation, not a build task.** What only Amit has: who the reader is and how they differ from the last section's reader, the arc, the module or step list with titles and seotitles, and what the official documentation gets wrong. Build the vessel before writing pages.

---

## Hosting, at scale

Hugo handles 2000 pages comfortably; the current 219 build in about 320 ms. GitHub Pages limits are 1 GB published size and 100 GB/month bandwidth, and 2000 pages of text HTML is roughly 100 MB. Space is not the constraint. Keeping figures as inline SVG rather than images is what holds the size down.

**GitHub Pages cannot host the RAG chatbot.** It serves static files only, and a chatbot needs an endpoint, a vector store, and an LLM call whose key must never reach the browser. When that time comes, either move hosting to Cloudflare Pages, which offers Workers in the same place, or keep Pages and put only the chatbot API elsewhere. The Hugo site does not change either way. Decide it then, not now.

### The staging copy, and how to stand it back up

**Cloudflare Pages hosted a staging build from 2 September 2026 until launch on
4 September, then it was deleted.** Not paused: testers had the URL, and a copy
of the site that anyone can forward, which quietly drifts out of date the moment
work resumes, is worse than no copy. `X-Robots-Tag: noindex` kept it out of
Google, but noindex has never stopped a human being sharing a link.

Everything needed to recreate it, recorded before the project was deleted:

| Setting | Value |
|---|---|
| Project name | `amitdusane-stage` |
| Repository | `amitdusane2026/amitdusane.com` |
| Production branch | `develop` |
| Build command | `hugo --gc --source amitdusane-site-complete -b $CF_PAGES_URL/` |
| Build output directory | `amitdusane-site-complete/public` |
| Root directory | *(empty)* |
| Build system version | 3 |
| Build cache | Disabled |
| Build watch paths | `*` |
| Deploy hooks | none |
| Bindings | none |
| Environment variable | `HUGO_VERSION` = `0.123.7` (type: Text) |

**Two of those are load-bearing and neither is obvious.**

`HUGO_VERSION` exists because Cloudflare's default Hugo is far older than this
site's, and without it the build either fails or, worse, succeeds against a
version whose behaviour differs. Pin it to whatever the local toolchain runs.

`-b $CF_PAGES_URL/` is what makes the noindex guard work. The guard in
`layouts/index.headers` emits `X-Robots-Tag: noindex` for any baseURL that is
not amitdusane.com, so staging protects itself by virtue of never being built
with the production baseURL. Drop that flag and the staging copy becomes
indexable duplicate content against the live site. It is not an optimisation.

**Whoever recreates this should also decide whether it needs to be public at
all.** Cloudflare Pages supports access control on preview deployments, which
would remove the reason it had to be deleted this time.
