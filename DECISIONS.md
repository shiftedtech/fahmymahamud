# Decisions log

Built 28 Sep 2026 with Claude Code, following `CLAUDE.md` and `PROMPT.md`.

## Process
- **Checkpoints skipped on purpose.** CLAUDE.md asks me to stop before the plan, GitHub and Vercel. In chat you said
  "Run fully on your own... Do NOT stop to ask for my approval", and CLAUDE.md lets chat instructions override it.
- **New git repo in `portfolio/`.** The folder was inside a git repo rooted at `C:\Users\USER` (your whole home folder).
  I ran `git init` in `portfolio/` so only this project can be pushed. Commits use your configured identity (fahmymahamud).
- **scroll-craft workspace** is `design/` (via `.scrollcraft.json`). `design/builds/fahmy-portfolio/BRIEF.md` is the design
  brief, written by me under your creative delegation. `design/FINGERPRINTS.md` has this build's row.
- Doctor: node, full ffmpeg and Chrome were OK. I installed `playwright-core` (dev dependency) and `gh` (winget).
  There's no `KIE_AI_API_KEY`, and none was needed.

## Content left off (still ADD / EDIT ME / CONFIRM in brand_assets)
| Item | Where | Status on site |
|---|---|---|
| LinkedIn URL | profile.md (`ADD-YOUR-HANDLE`) | **left off**; contact shows email + GitHub only |
| DataSentinel stack | projects.md (none given) | card shows no stack line |
| Freelance start date | resume-portfolio.md (`CONFIRM`) | shown as "Now" |
| profile.md header still says "EDIT ME" | profile.md | used the values as written |

## Other content calls
- **Email:** `fahmymahamud@gmail.com`, as listed. profile.md suggests `hello@shiftedtech.com` as an option; change it in
  `site/index.html` (3 places) if you prefer that one.
- **Instagram:** `@careershifttechguy` appears only under the Freelance role in Experience, as you asked in chat (29 Sep).
  It is not in the contact section, which stays email + GitHub as CLAUDE.md asks.
- **GitHub link:** personal `github.com/fahmymahamud` (the project repo lives there). The shiftedtech org isn't linked separately.
- **Resume PDF:** not published and git-ignored (`brand_assets/*.pdf`). Nothing was taken from it, including the phone number.
- No `inspiration.png` or `component.txt` in brand_assets, so neither was used.
- The Story chapter adds a small "Then / Now" pair built from resume wording (lifts, escalators, travellators → pipelines,
  dashboards, automations).
- "Open source · runs every day" on MyJobSearchBot comes from the resume ("open-source daily job-alert automation").
- Only real numbers are animated: 9+ years, 60+ escalator units.

## Design
- **Grammar:** chaptered editorial. Each section is a "floor" with its own light ground (white, off-white, light grey,
  green-light). No dark sections.
- **Signature move: the lift.** A floor indicator (G, 1–6) follows your scroll. It sits in the left margin at ≥1280px and
  bottom-right on smaller screens. Press it to open a lift button panel that jumps to any section. On floor 3, brushed-steel
  doors slide open as you scroll to reveal MyJobSearchBot.
- **Update 29 Sep (your feedback):**
  - The indicator moved to the right edge on every screen, with a lift icon (frame, call arrows, doors). Text columns reserve
    room for it, so it never covers words (checked automatically at 1440, 1024 and 390).
  - Floor 3 is now a lift landing: wall, steel frame, a call-button plate and a digital HPI (hall position indicator) reading
    "▲ 3 PROJECTS". The arrow blinks while the car arrives, the hall lanterns light, the doors part, and then the landing
    scales past you as you step in.
  - "Also built" is an escalator: 4 clickable project cards (crew scheduling, RemindClient, Waseel, DataSentinel) stand on
    stepped treads (amber nose, cleats, risers) under a moving handrail. On desktop they ride up into place as the section
    arrives, then hold still for reading. On phone it is a swipe carousel with previous/next buttons. There's no motion
    under reduced motion. I didn't use the pasted Tailwind/3D sample: it needs a CDN framework, a dark theme and fake
    dashboards, which break the brand and tech rules. I rebuilt the idea in plain HTML/CSS in the site's own style.
- **Hero skyline:** a hand-built inline SVG (line art), with no images. From back to front: sun, far CBD towers, water,
  mid landmarks (Esplanade, Marina Bay Sands, ArtScience Museum, Singapore Flyer, towers) and near Supertrees with an OCBC
  Skyway. The Flyer turns (90s per turn), Supertree canopies glow softly, and 106 window lights twinkle at their own pace.
  Layers lean with the mouse and separate on scroll. Animation pauses when the hero is off screen or the tab is hidden.
  The skyline sits below the text in its own band, so it can never cover copy. Phones get their own crop that keeps
  the whole Flyer.
- **Reduced motion:** there's no parallax or animation, the doors never render, and the pinned act becomes a normal section.
- **No JS / failed JS:** all content shows. There's a no-js class, a 3s fallback if the engine never mounts, and the
  doors only exist once JS is ready.
- **Inter** as the brand requires. scroll-craft discourages Inter by default, but the brand rule wins.
- Kept the em dash in the `<title>` because you specified that exact title. Visible copy has no em dashes.
- The scroll-craft engine (`scrollcraft.js/.css`) is copied unmodified. All bespoke code is in `site/assets/site.js`/`site.css`.

## Checks run
- Screenshot loop, 3 rounds at 1440 and 390, plus 390 with reduced motion (screenshots/ is git-ignored). No horizontal
  overflow, no console errors or failed requests, all tap targets at least 44px, all anchors resolve, external links return 200.
- Round 1 fixes: hero subline measure, cert codes breaking mid-token, education years wrapping, a phone art-directed
  skyline crop, and the logo tap target.
- Lighthouse on the local server: desktop 99/100/100/100, mobile 86/100/100/100 (perf/a11y/best-practices/SEO).
  After that I made the font non-render-blocking, deferred the scripts and used a smaller logo. Most of the remaining
  mobile gap was missing gzip on the local server, which Vercel adds.
- Page weight: about 0.45 MB for the whole `site/` folder.

## GitHub & Vercel
- `shiftedtech/fahmymahamud` already existed (public) with an earlier `index.html` card page (5–6 Sep). I merged
  histories instead of force-pushing and moved that file to `archive/fahmy-card.html`. It's not served.
- gh: the winget install stalled on a Windows admin prompt, so I used the portable build in `.tools/gh` instead.
- Vercel project `fahmymahamud` (scope fahmymahamud-9940): Framework Other, output `site`. Production:
  https://fahmymahamud.vercel.app. `.vercelignore` keeps brand_assets (the resume PDF), .tools, design, archive and
  screenshots out of CLI uploads. Verified live: those paths return 404.
- `vercel git connect` failed with "You need to add a Login Connection to your GitHub account first". Until that's
  added in Vercel, pushes to main do not redeploy. Run `npx vercel@latest deploy --prod --scope fahmymahamud-9940` instead.

## Update 29 Sep (round 2): escalator after the Gemini sample, doors fixed on phones
- **Lift doors on phones.** Tested in WebKit (the iPhone Safari engine). Two causes:
  1. The walk-in scaled a giant wall layer (a 250vmax shadow ×5.5), which WebKit dropped, so the landing popped away.
  2. The doors were scroll-scrubbed over ~260px, which one thumb-flick skips.

  The doors now behave like a real lift. When you reach floor 3 the car arrives (HPI arrow stops, lanterns light), the doors
  open on a timer (1.1s) onto the lit car interior, and the landing fades as you step in. Scroll back above to reset.
  "View projects" now plays the whole arrival. Checked in Chrome desktop, Chrome phone and WebKit iPhone 13.
- **Escalator: follows the Gemini "3D escalator scroll showcase" structure.**
  - A pinned stage with the same tilted assembly (rotateX 24°, rotateY -18°, rotateZ 6°).
  - A truss, back and front glass balustrades, a step conveyor and two handrail belts that run with the scroll, plus a
    slow idle crawl.
  - Four cards ride the incline with depth, scale and pitch, using the same path maths.
  - A HUD shows escalator position, the project now riding and the direction. P1–P4 buttons jump to each project.
  - Changed from the sample for the brand and tech rules:
    - no Tailwind CDN, light palette
    - Inter only (no Space Grotesk or JetBrains Mono)
    - no fake charts: each card shows a real screenshot of the live site
    - no "customize" modal or auto-play
  - Phones get their own art direction: one card at a time with a crossfade, a shorter card and no HUD.
  - The glide is frame-rate independent.
  - Reduced motion or no JS shows a plain 2-column grid (1 column on phones).
- **Project screenshots.** Captured from the four public pages on 29 Sep (site/assets/projects/*.webp, 11–30 KB each).
  All are public landing pages; the crew app's public marketing page shows no client data. Re-run the capture if a site
  changes.
- **DataSentinel text and stack** come from its public GitHub repo description and topics (Python, MCP, Docker).
- **Escalator pacing (29 Sep, round 3).** Cards were hard to read because they moved constantly and overlapped.
  - Each card now owns its own stretch of scroll: ride in (20%), a near-stop reading hold in the middle of the incline
    (60%), ride out (20%). The next card only arrives after the last has left.
  - The pin grew from 4.2 to 7 screens. Measured: each card is alone and fully readable for about 1,300px of scroll on
    desktop and about 800px on phone, with zero overlap.
- **Vercel Hobby cannot connect Git repos owned by an organization** (per Vercel's limits docs). That is why
  `vercel git connect` failed for `shiftedtech/fahmymahamud`. Options: keep deploying with the CLI, move the repo to the
  personal account, or upgrade to Pro.
- **Non-commercial contact line (29 Sep).** At your request, the contact line no longer offers paid automation work, to stay
  within Vercel Hobby's personal, non-commercial terms. It now reads: "I really enjoy tinkering with AI automations and messy data
  problems on the side. If you're working on something interesting or want to bounce ideas around, feel free to reach out
  at fahmymahamud@gmail.com."
- **Contact section (29 Sep).** The heading is now "Making everyday tasks effortless on the side." A row of five logo links
  replaces the buttons: Gmail (mailto), LinkedIn, GitHub, Instagram and Facebook, as you asked (this overrides the CLAUDE.md
  email + LinkedIn + GitHub list). The logos are Simple Icons marks (CC0), drawn in the site green rather than brand colours to
  keep the palette. The LinkedIn URL is now filled in, so nothing in brand_assets is marked ADD anymore.
- **Contact line removed (29 Sep).** At your request the contact section is now just the heading and the five logo links.
- **Lift indicator follows the scroll (29 Sep).** It now rides the right edge like the browser scrollbar thumb: top of the page =
  top of the screen, bottom = bottom (16px margins). The floor panel opens downward in the top half and upward in the bottom
  half, so it stays on screen. Without JS it stays centred as before. Checked at 1440, 1024 and 390px along the whole page: it covers no text.

## Update 6 Oct: "What I enjoy doing" replaces Certifications and Where I've worked
- **Work history removed**, as you asked; visitors go to LinkedIn. The final section has every link: Gmail, LinkedIn,
  GitHub, Instagram, Facebook, Credly and Credential.net.
- **Wording stays non-commercial** ("What I enjoy doing", "How I'd tackle it", no prices or "hire me"), to keep the free
  Vercel Hobby plan.
- **Five ideas, five floors (lift numbers 4 to 8):**
  - 4 · Your task: a problem picker with 5 everyday problems. Each shows how I'd tackle it, what's already built and the
    certifications behind it.
  - 5 · What I enjoy doing: the 5 services from your table. Pointing at a service lights its certificates in a lobby-style
    "certificate directory" and draws green wires to them; pointing at a certificate does the reverse. On phones it's a tap.
  - 6 · Live demo: a real 4-step cleaning pipeline on a made-up lift maintenance log, clearly labelled sample data.
  - 7 · Certified: 12 certifications framed like a lift inspection certificate. Hover or tap: a VERIFIED stamp lands,
    then the plate flips to "Used it for" and "Helps with", plus a Verify link where one exists.
  - 8 · Badge wall: all 26 badges from Credly and Credential.net, with filters that regroup the wall (FLIP animation).
- **Proof added where your table left it blank** (factual, from projects.md): AI assistants & bots → RemindClient,
  DataSentinel; Automate repetitive work → MyJobSearchBot.
- **Dates:** plates use resume dates. Credly sometimes shows a later issue date for the same certificate (for example Google
  Data Analytics is Jul 2025 on the resume and Oct 2025 on Credly). Databricks Generative AI uses its credential date
  (Nov 2025). Credly-only badges use Credly dates.
- **Without a public verify link:** Microsoft AI-900, AZ-900, DP-900 and GitHub GH-900 (they're not on either profile).
  SnowPro and Cybersecurity have no project yet, so their plates say "Trained in" rather than claiming use.
- **The older Project Management v2 badge is left off the wall** to avoid a duplicate (v3 is shown).
- **Badge images** are downloaded from your own Credly/Credential.net badges into site/assets/badges (27 WebP files,
  220 KB). They are your credentials, not stock images.
- **Without JS** everything is readable: plates show both sides and the wall shows all badges.

## Update 6 Oct (later): new floor order
- **Order:** G Lobby · 1 Story · 2 What I enjoy doing · 3 Badge wall · 4 Live demo · 5 Projects · 6 Got something eating
  your time? · 7 Contact.
- **Removed, as asked:** "What I work with" (skills) and "Certified, and put to work" (the plates).
- **Projects:** the lift landing's HPI now reads 5. The picker's "See it in What I enjoy doing" arrow now points up.
- **Microsoft Learn credentials** (AI-900 27 Feb 2026, AZ-900 22 Jan 2026, DP-900 29 Dec 2025, GitHub Foundations
  18 Aug 2026) are now on the badge wall with their official badges and verify links (30 badges in all). The dates match
  the resume.
- **Grounds alternate so neighbours never blend:** white, off-white, light grey, off-white, white, off-white, green-light.
