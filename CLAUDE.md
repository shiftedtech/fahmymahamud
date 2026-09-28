# CLAUDE.md — Fahmy's portfolio site

Read this file before every task. These rules win over anything else unless I say otherwise in chat.

## What we're building
A one-page personal portfolio for **Fahmy Mahamud** (full name Mohammad Fahmy Bin Mahamud), a Singaporean career switcher moving
from lift & escalator engineering (SMRT) into **data engineering and AI automation**.
Audience: recruiters and hiring managers for remote data / AI automation roles, and small businesses that might hire me
for automation work. The page's one job: make them want to contact me.

## Source of truth
- Facts come ONLY from `brand_assets/`: **`resume-portfolio.md` is the main source**, plus `projects.md` and `profile.md`.
  `Fahmy_Mahamud_Resume.pdf` is older and was tailored for another job: use it only to double-check dates, never copy its
  role-specific wording, and never publish it or its phone number. Never invent jobs, dates, numbers,
  clients, testimonials or certifications. If something is missing, leave it out and tell me.
- If `docs/web-design-rules.md` exists (the community web-design CLAUDE.md), follow it too. On conflict, THIS file wins.

## Privacy (public website)
- Never publish: phone number, home address, NRIC/IC or passport numbers, date of birth, salary, family details.
- Contact on the site = email + LinkedIn + GitHub only (from `brand_assets/profile.md`).
- Don't publish the resume PDF itself unless I say so. Its phone number (+65 …) must not appear anywhere on the site or in the repo.

## Brand
Colours (use as CSS variables, nothing else):
```
--white:#FFFFFF; --off-white:#FAFAFA; --light-grey:#F5F5F5; --grey-100:#F0F0F0; --grey-200:#E5E5E5;
--grey-300:#D4D4D4; --grey-400:#A3A3A3; --grey-500:#737373; --grey-600:#525252;
--black:#111111; --near-black:#1A1A1A; --dark:#262626;
--green:#007A3D; --green-dark:#005C2E; --green-light:#E6F5ED;
--red:#CE1126; --red-dark:#A50D1E; --red-light:#FCE8EB;
--amber:#F59E0B; --amber-light:#FFFBEB;
```
- Background white. Text `--black`. Accent `--green` (links, buttons, highlights). Red only for small emphasis.
- **Light theme only.** No dark sections or dark hero — I find dark backgrounds hard to read.
- Font: **Inter** (Google Fonts), fallback `system-ui, sans-serif`. Body 18px, line-height 1.6.
- The site is about **me, Fahmy Mahamud**. My name is the brand: it leads the hero, the page title and the header.
- Logo: `brand_assets/logo.png` (avatar + "Fahmy Mahamud") in the header; `brand_assets/avatar.png` is my illustrated avatar for the hero/about.
- Favicon: `brand_assets/favicon.ico` and `favicon-512.png`.
- **shiftedtech** is only my GitHub organisation / side-business name. Mention it at most once (e.g. in the footer or project links), never as the site's brand.
- Images: only my own files from `brand_assets/` (my avatar is fine). Do not generate new people images, no stock photos.
- Voice: plain, confident, specific. Short sentences. No buzzwords ("passionate", "synergy", "rockstar").

## Tech rules
- **Static site. No framework, no build step.** Plain HTML + CSS + a little JS.
- Deployable files live in `site/` (`site/index.html`, `site/assets/...`). `vercel.json` sets `"outputDirectory": "site"`.
- Tooling, scratch and screenshots stay out of `site/`. `.tools/`, `node_modules/`, `.env` are git-ignored.
- Must work at 390px (phone) and 1440px (desktop). No horizontal scrolling. Images have `alt` text.
- Respect `prefers-reduced-motion`. Scroll effects must never hide content if JS fails.
- Page weight: keep images compressed (WebP where possible); total under ~3 MB.
- Add basic SEO: `<title>`, meta description, Open Graph title/description/image, favicon.

## Design skill
Use Nate Herk's **scroll-craft** skill. It is cloned at `.tools/scroll-craft/`. Find its `SKILL.md`
(under `plugins/nateherk-design/skills/`) and follow its design + verification workflow, within the brand rules above.
Use my own photos only, so no `KIE_AI_API_KEY` is needed.

## Signature element: interactive Singapore skyline (hero background)
The hero background is an original, hand-built **Singapore skyline** that shows where I'm from. It must feel 2026: light, crisp, alive.
- Built in code only (inline SVG layers or canvas). No photos, no downloaded images, no copied artwork.
- Landmarks as clean silhouettes: Marina Bay Sands (3 towers + SkyPark), Singapore Flyer, Supertree Grove,
  Esplanade "durian" domes, ArtScience Museum lotus, CBD towers, and a calm bay/water line with soft reflections.
- **Light palette only**: sky from `--white` to `--green-light`; far layer `--grey-200`, middle `--grey-300`, near layer
  `--green` / `--green-dark` accents; tiny `--amber` window lights that twinkle. Never a dark or night-black sky.
- Interaction: 3 parallax depth layers that move with the mouse (desktop) and with scroll (all devices);
  the Flyer turns slowly; Supertrees glow softly on hover; the sky warms slightly toward `--amber-light` as you scroll.
- A small label in the corner: "Singapore · 1.35°N 103.82°E".
- Readability first: skyline sits in the lower ~40% of the hero; name and headline stay on clean white above it.
- Performance: under ~60 KB, 60fps, pause animation when the hero is off-screen, static version for
  `prefers-reduced-motion`, and it must still look good at 390px wide.

## Screenshot loop (every visual change)
1. Screenshot the page at 1440px and 390px wide (save to `screenshots/`, git-ignored).
2. Compare against this file. List what's off.
3. Fix and re-screenshot. Max 3 rounds per change, then move on.

## Autonomy
- Work end to end **without asking me for approval**. Make sensible decisions and note them in `DECISIONS.md`.
- Only stop if something truly needs me: a browser login (GitHub or Vercel), a missing file you can't work around,
  or a paid step. Then tell me exactly what to do, wait, and continue.
- Never skip the privacy rules to save time.

## Deployment
- GitHub repo: **https://github.com/shiftedtech/fahmymahamud** (branch `main`). Must be **public**:
  Vercel's free plan can't deploy private repos owned by an organisation.
- Commits use my own git identity (already configured on this computer).
- Vercel account/team: **https://vercel.com/fahmymahamud-9940** → scope `fahmymahamud-9940`, project name `fahmymahamud`.
- Deploy with the Vercel CLI (`npx vercel@latest`), connected to the GitHub repo so every push to `main` redeploys.
