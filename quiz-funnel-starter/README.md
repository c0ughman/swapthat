# Quiz Funnel Starter

A self-contained quiz funnel: 15 questions → weighted scoring → personality profile →
fake "analyzing" screen → email capture → personalized offer page.

Vanilla HTML/CSS/JS. No build step, no framework, no npm, no backend. Drop it on any
static host. Extracted from the Briefed codebase as a starting point — all copy, colors,
and branding are Briefed's and are meant to be replaced.

## Run it

```
python3 -m http.server 8000
# open http://localhost:8000/pages/quiz.html
```

## Files

```
pages/quiz.html    Quiz shell. All screens exist as divs, toggled via .hidden
pages/offer.html   Post-email offer page
js/quiz.js         quizData (content) + engine. Start here.
js/offer.js        fullProfileData (offer copy per profile) + render
css/quiz.css       Quiz styles
css/offer.css      Offer styles
css/main.css       Shared base + Google Fonts import
media/             Logos — replace
_redirects         Netlify-style clean URLs
```

## How it works

One page, many divs. Each screen is in the HTML from the start; the engine adds and
removes the `hidden` class to advance. No router, no navigation until the redirect to
`offer.html` at the end.

Content and engine are separate. Everything you'd want to change lives in the `quizData`
object at the top of `js/quiz.js` — questions, options, interstitial messages, loading
checks, profiles. The rendering code below it is generic and content-agnostic.

Scoring is a weighted tally. Each option carries a `profileWeight` map adding points to
four buckets. `calculateProfile()` returns the highest scorer. Ties resolve to whichever
bucket is first in the object.

Quiz hands off to the offer page via `localStorage` (key: `quizProfile`) plus query
params. `offer.js` reads it back.

## What to change

1. **`js/quiz.js` → `quizData`** — questions, options, `profileWeight`, `profiles`.
2. **`js/offer.js` → `fullProfileData`** — offer copy. Profile keys must match `quizData.profiles`.
3. **`media/`** — logos. Referenced in `pages/quiz.html` and `pages/offer.html`.
4. **Colors** — profile colors live in the data objects; the rest is in the CSS.

## Known gaps — read before shipping

**Email capture is a stub and saves nothing.** `saveQuizResults()` in `js/quiz.js`
`console.log`s and resolves a `setTimeout`. There is no fetch, no storage. Wire this to
your backend, CRM, or form service or every submission is lost. This is the one piece
that needs a backend; everything else is genuinely static.

**Profile bucket names are hardcoded in three places.** Changing the number of profiles
(it's four: firefighter, detective, collector, islander) means editing `quizState.profileScores`,
the weight-summing in `handleOptionSelect()`, and the default in `calculateProfile()`.
Genericize this if you want a different count.

**The discount code on the offer page is generated client-side**, so a user can read or
forge it from the console. Validate server-side before honoring it.

**Options render via `innerHTML`.** Fine while the content is authored by you. If question
text ever comes from a database or user input, switch to `textContent` first.

**Q1–Q5 carry no `profileWeight`** and don't affect the outcome — they're demographic and
exist to build commitment. Intentional, but worth knowing.

**`offer.js` links to Briefed product pages** (`./bubbles.html`, `./genie.html`,
`./chat.html`, `./bites.html`) that are not in this folder. Repoint them.
