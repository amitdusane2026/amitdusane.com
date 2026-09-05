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

A self-contained sub-site selected by URL prefix, with its own stylesheet, JS, shell, and print document.

**The world is a registry lookup, not an if/else chain** (INF-06, 20 August
2026). `baseof.html:8` does `index .Site.Params.worlds .Section`, and the entry
carries four keys: `css`, `js`, `root` and `og`. The `og` is a per-world social
card, added because `og-default.jpg` was the Web SDK card and was being served
on all 144 learning pages. **A new world needs an OG image made for it**, which
is easy to forget because nothing fails without one.

**Both recorded blockers to a third world are cleared.** `params.phases` is
per-world at `params.worlds.<world>.phases` (INF-05), and the switch keys off
`.Section` as above. Verified against `hugo.toml` and the templates on
6 September 2026.

**But "a third world is a config block" overstates it, and this is the part to
know before costing one.** `baseof.html` still carries `$mig` and `$learn`
booleans with **twelve** references between them, because forty-odd lines of
shell markup genuinely differ: the body class, two full content shells, the Ask
Amit bar (migration only), the search placeholder wording, and two world-specific
script blocks. A third world naively added becomes a third branch through all of
it.

**So the right move for a second procedure world is to generalise the flag
rather than add a branch** — `$mig` becomes "is this a procedure-shaped world",
read from the registry, and the existing shell serves both. That is the
container claim finally being tested rather than asserted. If the migration
shell cannot serve a second procedure world without forking, the container is
not reusable and it is better to learn that on the cheap section than on CJA.

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
2. **Adobe Analytics Learning** — live since 4 September 2026. Curriculum shape.
3. **Adobe Experience Platform Mobile SDK** — next. Procedure shape. `/aep-mobile-sdk/`.
4. CJA Learning — curriculum
5. RTCDP — curriculum
6. AJO — curriculum
7. AEP Fundamentals — curriculum
8. Certification preparation, per product — new shape
9. Delivery documents, and managing a long-term project — new shape
10. A RAG chatbot over the whole site

Also planned, shape assigned but not sequenced: Mobile Analytics legacy implementation (procedure), Setting up CJA reports (procedure).

**Mobile SDK moved from seventh to third on 6 September 2026**, ahead of CJA
and the three other curriculum worlds. Amit's reason is that CJA is the real
destination and it cannot teach what it is for on web data alone: one person
seen across app and web is the argument for CJA, and a course built on a single
channel teaches the mechanics while skipping the point. The second reason is
cost. This is the cheapest section available — the procedure container already
exists and its second instance is what finally tests whether the container is
reusable. Better to discover that on a section Amit knows cold than while also
working out how to teach CJA.

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

### Domains

**amitdusane.com is the site. amitdusane.in redirects to it**, 301, unmasked,
path and query string preserved. Done 4 September 2026 through Cloudflare, and
it is the last task left over from launch.

**Never put content on the .in.** It is worth holding defensively and to catch
the many people who type `.in` by habit; it is worth nothing as a destination,
and a copy of the site there would compete with a domain that only began
accumulating search signal on launch day.

**Namecheap's own URL Redirect Record was the trap, and it had in fact been
set.** The row was sitting there pointing at the .com, which is why `http://`
returned a 404 from the parking servers and `https://` refused to connect at
all: Namecheap issues no certificate for a forwarding-only domain, and browsers
try HTTPS first. A redirect nobody can reach is not a redirect. Namecheap's
nameservers now point at Cloudflare, so that row is inert and can be deleted.

**How it is built, and the one part that is not obvious.** Nameservers moved to
Cloudflare (`lovisa` / `mitch.ns.cloudflare.com`), then a single Redirect Rule.
The non-obvious half is DNS: a Redirect Rule only fires if the request reaches
Cloudflare at all, so the zone needs **two proxied A records** — apex and `www`
— pointing at `192.0.2.1`. That is a reserved documentation address with
nothing on it, and nothing ever connects to it: the rule answers at the edge
before any origin is contacted. **The orange cloud is the load-bearing part.**
Grey-clouded, the request bypasses Cloudflare and the domain stays broken.

The rule itself:

| | |
|---|---|
| Match | `(http.host eq "amitdusane.in") or (http.host eq "www.amitdusane.in")` |
| Type | Dynamic |
| Expression | `concat("https://amitdusane.com", http.request.uri.path)` |
| Status | 301 |
| Preserve query string | on |

**Dynamic rather than Static is what keeps the path.** Static sends every
visitor to the homepage whatever they typed.

**The five MX records and the SPF TXT were kept, and should stay.** Cloudflare's
scan found live Namecheap email forwarding (`eforward1-5.registrar-servers.com`)
on the .in, switched on by default rather than deliberately. MX records only
carry mail and cannot be proxied, so they cost nothing and deleting them would
silently break any address on that domain.

**Verified over the wire the same day.** Apex, `www`, `http://` and `https://`
all return a single 301 to the right place and land on a 200; a deep path
survives, and so does a query string. The certificate is Cloudflare's Universal
SSL, issued by Google Trust Services at 13:30 UTC, expiring 3 December 2026 and
renewing itself. That certificate is the whole reason this went through
Cloudflare rather than Namecheap.

**`Always Use HTTPS` is deliberately left off.** The rule already sends every
request straight to `https://amitdusane.com` in one hop whatever scheme it
arrived on; the toggle would only insert a pointless second hop through
`https://amitdusane.in`.

---

## Adobe Experience Platform Mobile SDK — Phase 0 decisions

Settled 6 September 2026, before any curriculum work. **These four are fixed;
Phase 1 designs within them.**

| Decision | Choice |
|---|---|
| Official name | **Adobe Experience Platform Mobile SDK.** Use Adobe's product name throughout; it is what readers search and it ends the AEP-vs-Adobe-Mobile confusion |
| URL prefix and world key | **`/aep-mobile-sdk/`** |
| iOS and Android | **One spine.** Split at step level only where the platforms genuinely differ |
| Where it stops | **Both destinations**: Adobe Analytics forwarding *and* the AEP XDM dataset |
| Screenshots | **None** |

**The URL breaks the pattern set by `/web-sdk-migration/`, deliberately.** That
one is task-shaped; this one is product-shaped and carries the acronym people
type into a search box. Amit's call, made against a recommendation to stay
consistent. Consistency of URL shape is worth less than matching the query.

**One spine rather than two tracks, because the split is narrower than it
looks.** The schema, the datastream, the tag property, the mobile extension
configuration and Assurance validation are all platform-neutral, and they are
where an analytics person actually gets stuck. What genuinely differs is
dependency installation, SDK registration, and lifecycle hooks. Two parallel
tracks would double the writing and halve the readership of every page.

**Both destinations, because one implementation feeds both and the reader needs
both.** The same SDK and the same schema reach Adobe Analytics and an AEP
dataset through two services on one datastream. Stopping at the XDM dataset
would leave an Adobe Analytics practitioner without their existing reporting;
stopping at Analytics would leave the CJA seam unbuilt, which is the reason this
section is being written third rather than seventh.

**No screenshots is not a compromise here, it is the container's existing
pattern.** `shot-box` belongs to the curriculum world. The Web SDK Migration
world contains **zero** screenshots and exactly **one** inline SVG diagram per
step, across all thirteen. So the diagram budget is the thing to plan, and code
blocks carry the app-side work — which suits mobile better than screenshots
would, since a reader copies Swift or Kotlin and cannot copy a picture of Xcode.

**Still outstanding from Phase 0**, and it feeds the Phase 1 curriculum map: who
this reader is and how they differ from the migration reader, what Experience
League gets wrong about mobile, and the failure modes worth building sections
around.
