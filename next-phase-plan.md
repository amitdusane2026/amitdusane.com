# Next phase plan

Created 7 September 2026, at Amit's instruction, after a working session whose
decisions were not recorded anywhere. This file governs the next phase of work.
`development-plan.md` remains the overall plan; this is the detail for one phase
and should be folded back into it when the phase closes.

---

## Part A — What Amit wants, in his words

Restated so it can be checked before any work starts.

1. **How is data sourced in a mobile environment?** Context data, a data layer,
   or something else.
2. **How does that source data get into XDM?** Is there a Launch rule for each
   event, the way there is in web analytics?
3. **Break the mental model.** A reader from an Adobe Analytics and Launch
   background wrote a rule per event, and each rule populated props, eVars and
   events. What replaces that, in both SDKs.
4. **How much flexibility does the tag management system actually give on
   mobile?** Is it equivalent to web? Can somebody add, delete or change
   variable values?
5. **No demonstration of a real requirement exists in either world.** Two
   requirements now, not one: **page and screen load tracking**, and **internal
   search**. Both demonstrated end to end, in both worlds, for both Adobe
   Analytics and CJA.
6. **Both worlds cover both products.** Analytics and CJA together. When
   Analytics eventually becomes irrelevant, Analytics comes out and CJA and AEP
   remain. Not yet.
7. **Web SDK Implementation is standalone and complete.** It explains its own
   concepts even where that repeats the migration guide. Two reasons, both
   Amit's: when Migration becomes irrelevant, the way DTM-to-Launch did,
   Implementation must still stand on its own; and a reader should never cross
   worlds to learn one concept. **Interlinking is not dependency.** Link freely,
   depend on nothing.
8. **Mobile Basics is buried in the left rail** and its position is wrong. It
   must be discoverable without hiding the spine, and the fix must suit SEO.

---

## Part B — Where each objective gets answered

The part Amit asked for help with: he knows what he needs, not where it lands.

| # | Objective | Where it is answered |
|---|---|---|
| 1 | Mobile data sourcing | New mobile KB article, **Where XDM values come from** |
| 2 | Source data into XDM | Same article. The three paths, side by side |
| 3 | Mental model break | Mobile steps 1 and 5. Web SDK Migration steps 8 and 9. Implementation carries its own |
| 4 | Tag system flexibility on mobile | New mobile KB article, **What the mobile tag property can change**. Step 5 rewritten around it |
| 5 | Two demonstrations | Mobile step 8. Web SDK Migration step 9. Implementation, built in from the start |
| 6 | Analytics and CJA together | Enforced inside every demonstration: each value traced to an Analytics variable **and** a CJA dataset field |
| 7 | Standalone Implementation | Step 6 of this plan. Complete, repetition accepted |
| 8 | Mobile Basics discoverability | Step 1 of this plan. Rail restructured |

---

## Part C — The steps

### Step 1 — Fix the left rail, before any writing

**The problem, measured.** The rail carries **28 items**: fourteen steps, then
fourteen Part One topics listed flat underneath. Part One is therefore at the
bottom of a very long list, and on a phone it is far below the fold. The spine
cannot be hidden and neither can the basics.

**The fix, and it uses machinery that already exists.** Knowledge Base is
already a single rail link to its own front page of grouped cards. Part One
already has exactly that front page: four groups, fourteen cards, at
`/aep-mobile-sdk/mobile-basics/`. It is simply not being used that way, because
the rail duplicates its contents.

Restructure the rail into three labelled groups:

```
▸ Start here
    ◈ Mobile app basics          -> the existing front page
▸ The Implementation
    1 .. 14                       -> the spine, unchanged
▸ More
    ◇ Knowledge Base
    § References
```

**Why this is right rather than merely tidier:**

- The rail drops from 28 items to 17, and Part One moves from the bottom to the
  **top**, above the spine, without competing with it for space.
- Both single-page templates already carry a breadcrumb back to their front
  page, so the return path exists and needs no new work.
- It makes Part One and the Knowledge Base behave identically, which is easier
  to learn than two patterns.
- **SEO improves rather than suffers.** Fourteen thin rail links from every page
  are replaced by one link from every page to the front page, which concentrates
  internal link equity on the hub that should rank for the orientation queries.
  The topics keep their links from that hub, from step Why-rows, and from the
  inline links added on 7 September.

**Guard:** `baseof.html` is shared by both procedure worlds. The change must stay
inside the existing `{{ with $world.basics }}` condition so the migration guide,
which declares no basics, is untouched.

*Output: one template change. Verify the migration guide's rail is identical
before and after.*

---

### Step 2 — Fix the factual error in mobile step 5

`05-create-the-mobile-tag-property.html` says the mobile tag property "holds no
executable code at all". That is **wrong**. The Mobile SDK has a rules engine,
configured in the tag property, downloaded as JSON by Mobile Core, offering
**Attach Data** and **Modify Data** actions.

Rewrite the opening so it keeps the true contrast with the web property while
admitting the rules engine, and states the limit that makes the contrast hold:
**a rule can only act on an event the app already fires. It can decorate; it
cannot originate.**

*Output: one corrected page. It is a correctness fix, so it precedes new writing.*

---

### Step 3 — Answer objectives 1, 2 and 4

**Two knowledge base articles, not one.** Amit's decision. They answer different
questions and deserve separate front doors.

**3a. "Where XDM values come from."** The three paths, side by side:

| | Source | Where XDM is assembled |
|---|---|---|
| Web SDK | data layer, digitalData or ACDL | a tag rule, in the browser |
| Mobile, native | the app's own code | the app, via `Edge.sendEvent` |
| Mobile, Edge Bridge | context data on `trackAction` / `trackState` | the datastream, via Data Prep |

Points it must make: **there is no data layer on mobile**; context data still
exists, through Edge Bridge, and is the bridge from the old model; and the
answer to "is there a Launch rule per event" is **on web yes, on mobile no**,
because a browser has a readable page and an app does not.

**3b. "What the mobile tag property can change."** What reaches installed apps
with no release: datastream per environment, extension settings, default
consent, lifecycle session timeout, and rules that attach or modify data on
events the app already sends. What does not: a new event, a new value the app
never supplied, anything read from a data layer that does not exist.

Then wire them: **step 1** gains a short mental-model paragraph linking to both;
**step 5** is rewritten around 3b; Why-rows point at both.

*Output: two KB articles, step 1 amended, step 5 rewritten. KB returns to 20.*

---

### Step 4 — Two demonstrations, mobile world

Two requirements, in this order, because the first is universal and the second
is the custom case built on top of it.

**4a. Screen load, the universal one.** What every implementation needs before
anything else, and what fires on every single screen:

- **Screen name** — the primary dimension
- **App or site section** — the grouping everything gets rolled up by
- **A property identifier** — see below, this is the one worth teaching
- **URL** — web only, and its absence on mobile is itself the lesson
- **A custom screen-view event** — the counting metric

**The property identifier is the point of this example.** A large brand runs
many properties: separate country sites, or several apps, or both. Every hit
carries an identifier saying which property it came from, and that single value
is what lets one dataset be segmented by market afterwards. It is
business-supplied, decided by you, and it must be on every hit from the first
day, because it cannot be added retrospectively to data already collected.

**Do not confuse it with geo, and say so explicitly.** Geo country is derived at
the Edge from the request and is not sent by the client. The property identifier
is sent by the client and derived from nothing. They look like the same
dimension to somebody reading a report and they come from opposite directions,
which is exactly the sort of thing that produces a wrong answer confidently.
Both belong in the demonstration, contrasted.

**There is no URL on mobile.** The web equivalent has one and the app does not,
which is exactly the assumption a web-analytics reader carries in without
noticing. On mobile the property identifier does more work as a result.

**4b. Internal search.** Carries a **term** and a **result count**, so it
exercises a dimension and a metric, and it is not automatic, so it proves the
app must send it.

**Both follow the same seven-link chain**, so the shape is identical everywhere
it appears:

1. The requirement, as a stakeholder would state it
2. The XDM field added to the schema
3. The app code that fires it
4. What the tag property can and cannot do to it on the way past
5. The datastream mapping
6. Where it lands **as an Adobe Analytics variable**
7. Where it lands **as a CJA dataset field**

Closing counterfactual: *marketing now wants the result count bucketed into
ranges. Which of those seven can you do this afternoon, and which needs a
release?*

Home is **step 8, Track screens and actions**, which already owns both screen
views and custom actions.

*Output: step 8 substantially extended. Objectives 5 and 6 satisfied for mobile.*

---

### Step 5 — The same two things in Web SDK Migration

The migration guide has the identical holes: no demonstration, and the mental
model break is implied rather than stated.

**5a.** State the break where it belongs: **step 8, Map your variables** and
**step 9, Build the Send Event rule**. On web the rule survives, and that is the
point. It still runs in the browser, it still reads a data layer, and what it
populates is XDM rather than eVars and props. The reader's Launch skill
transfers; its output changes.

**5b.** Both demonstrations again, same seven links, same counterfactual, both
destinations. On web the page-load case gains the URL that mobile lacks, which
makes the pair read as a genuine comparison rather than a repeat.

*Output: two steps extended. Objectives 5 and 6 satisfied for Web SDK Migration.*

---

### Step 6 — Web SDK Implementation, a new section

**Standalone and complete.** It explains every concept it uses, including ones
the migration guide also explains. Interlinking where useful, dependency
nowhere. Amit's reasoning, recorded because it should outlive the decision: when
Migration becomes irrelevant the way DTM-to-Launch did, Implementation must
still stand on its own, and a reader should never cross worlds to learn one
concept.

Roughly fourteen steps. Against the migration guide's thirteen, measured:

- **Identical mechanics** (datastream, install the extension, send-event rule,
  consent, validate payload) — rewritten in this guide's own voice, **not
  referenced out**
- **Reframed** (schema from business requirements rather than from existing
  eVars; identity set up rather than migrated)
- **Genuinely new** (design the data layer from nothing; measurement plan from
  business requirements; validate against the requirement rather than against a
  legacy beacon; go live rather than decommission)
- **Absent** (take inventory; the Analytics Full Extension field group as a
  parity device; prove parity; decommission)

Two things that make it a distinct guide rather than a copy:

- **Destination.** Migration's implied goal is Analytics parity. Implementation's
  goal is the **dataset**: CJA and AEP are the point, Analytics is one service on
  the datastream. Analytics is covered fully, per objective 6, but it is not the
  centre.
- **Both demonstrations and the mental model are built in from the start**, not
  retrofitted, because steps 3, 4 and 5 will already have proved their shape.

**Web SDK Migration keeps its name and URLs.** Decided and closed: it is live on
production, "migration" is the higher-intent search term, and the gap is content
rather than a title.

*Output: a fourth world. The largest item in this plan by a wide margin.*

---

## Why this order

Steps 2 to 5 produce the material step 6 needs. The mental-model explanation and
both demonstrations are written once, judged, and corrected before they are
carried into a brand-new section. Building Implementation first would mean
inventing all of it inside a guide that has no readers yet.

Step 1 comes before everything because it is Amit's instruction and because it
is cheap, structural, and touches nothing that later steps will rewrite.

**This is sequencing, not deferral.** Step 6 is in this plan and nothing is
queued ahead of it.

---

## Decisions taken, 7 September 2026

- **Nothing launches yet.** QA is complete from this side only. Amit will read
  the finished Mobile SDK section word for word and give his own verdict before
  any launch is discussed. Making the changes in this plan matters more than
  shipping.
- **Steps 5 and 6 stay in this order.** Web SDK Migration gets the
  demonstrations before Implementation is built.
- **Two knowledge base articles**, not one.
- **The rail is restructured first.**

---

## Still to verify before writing

Facts that must be checked against Adobe documentation while drafting, not
recalled:

- ~~Whether geo dimensions are derived at the Edge from the request.~~
  **VERIFIED 7 September 2026.** They are. A network lookup on the visitor's IP
  populates `xdm.placeContext.geo.countryCode`, along with `stateProvince`,
  `city` and `postalCode`. It is switched on as **geolocation enrichment on the
  datastream**, not in the app or the tag property, and it runs **before IP
  obfuscation**, so obfuscating the address does not disable it. The contrast
  for step 4a is therefore sharper than expected: country arrives by enabling a
  setting on the datastream, and the property identifier arrives only because
  the app was written to send it.
- Which XDM field group a property identifier conventionally belongs in, so the
  demonstration puts it somewhere a reader can reuse rather than inventing a
  field.
- The exact datastream mapping route for a custom XDM field into an Adobe
  Analytics variable, for link 6 of the chain.
- Whether Data Prep on the datastream applies to mobile-sourced events as it
  does to web, which is documented for web and was not confirmed for mobile.

---

## Revision history

- **7 September 2026.** Created, then revised the same day after Amit's inputs:
  added the page and screen load requirement alongside internal search, added
  the rail restructure as step 1, and recorded the launch, ordering and article
  decisions. Supersedes the plan section briefly added to `development-plan.md`
  earlier that day, which was written before Amit rejected the "do not repeat
  the migration guide" condition. That condition is withdrawn.
