Read CLAUDE.md first and follow it for this whole task.
Run fully on your own, start to finish. Do NOT stop to ask for my approval.
Only pause if you truly need me (a browser login, a missing file you can't work around, a paid step):
tell me exactly what to click or type, wait, then continue. Log your decisions in DECISIONS.md.

Targets:
- GitHub repo: https://github.com/shiftedtech/fahmymahamud (public, branch main)
- Vercel: https://vercel.com/fahmymahamud-9940 (scope fahmymahamud-9940, project name fahmymahamud)

## 1. Setup
1. Read everything in brand_assets/. resume-portfolio.md is the main source (the PDF is older, tailored for another job,
   and must never be published or have its phone number copied). Also read profile.md, projects.md, logo.png, avatar.png, favicons.
   If a value is still "ADD", "EDIT ME" or "CONFIRM", leave that detail off the site and note it in DECISIONS.md.
2. Check tools: node 18+, git, ffmpeg (FULL build), gh (GitHub CLI). Install anything missing with winget:
   `winget install Gyan.FFmpeg`, `winget install GitHub.cli`. Reopen the shell / refresh PATH if needed.
3. Clone the design skill: `git clone https://github.com/nateherkai/scroll-craft .tools/scroll-craft`
   Find its SKILL.md under .tools/scroll-craft/plugins/nateherk-design/skills/ and read it and its references fully.
4. From .tools/scroll-craft, run its doctor script first, then its workspace script with --ensure (paths in its README).
   Fix every issue doctor reports. Install playwright-core if it asks.
5. Create .gitignore (node_modules, .env, .tools, .vercel, screenshots, *.log, brand_assets/*.pdf) and vercel.json:
   {"outputDirectory": "site", "cleanUrls": true}

## 2. Content
Write content.md using ONLY brand_assets/ (resume-portfolio.md first):
1. Hero: "Fahmy Mahamud" as the main heading, my avatar, headline "Data engineering & AI automation",
   one short subline, buttons "View projects" and "Contact me"
2. My story: engineering → team lead at SMRT → data & AI (3–4 short sentences)
3. Skills: grouped (Data engineering, Cloud, AI & automation, Web)
4. Projects: cards from projects.md (what it does, stack, link)
5. Certifications: from the resume, grouped by provider
6. Experience: short timeline from the resume
7. Contact: email, LinkedIn, GitHub
If brand_assets/inspiration.png exists, borrow LAYOUT ideas only (spacing, section order), never text/images/colours.
If brand_assets/component.txt exists (a 21st.dev component), use it once, restyled to my brand.

## 3. Build
1. Build the site in site/ with the scroll-craft skill, inside the CLAUDE.md brand and tech rules.
2. Build the **interactive Singapore skyline hero background** exactly as described in CLAUDE.md
   (hand-built SVG/canvas, light palette, parallax on mouse + scroll, turning Flyer, glowing Supertrees,
   twinkling window lights, "Singapore · 1.35°N 103.82°E" label, reduced-motion fallback).
3. Use logo.png in the header, avatar.png in the hero, favicon.ico + favicon-512.png for icons.
   Compress images to WebP in site/assets/.
4. <title>: "Fahmy Mahamud — Data engineering & AI automation". Add meta description, Open Graph tags
   (title, description, image = a 1200×630 screenshot of the hero you generate), and favicon links.
5. Start a local preview.

## 4. Check and polish (screenshot loop)
Run the CLAUDE.md screenshot loop at 1440px and 390px. Check: nothing overflows sideways, text readable,
skyline never covers text, animation smooth and paused off-screen, buttons tappable on phone, all links work,
no dark sections, no invented facts, no phone/address/IC anywhere. Also run a quick Lighthouse-style check
(performance, accessibility) and fix obvious issues. Max 3 rounds, then continue.

## 5. GitHub
1. `gh auth status`. If not logged in: `gh auth login --web` and tell me to approve in the browser.
2. If https://github.com/shiftedtech/fahmymahamud already exists: add it as origin and push main.
   Otherwise create it: `gh repo create shiftedtech/fahmymahamud --public --source . --remote origin --push`
   Make sure the repo is public.
3. Write README.md: what the site is, live URL, how to edit content (brand_assets/ + content.md), stack,
   and "Built with Claude Code + scroll-craft, #AISChallenge Day 5". Commit and push.

## 6. Vercel (CLI, no dashboard)
1. `npx vercel@latest whoami`. If not logged in: `npx vercel@latest login` and tell me to approve in the browser.
2. `npx vercel@latest link --yes --project fahmymahamud --scope fahmymahamud-9940`
3. `npx vercel@latest git connect --yes --scope fahmymahamud-9940`
   (connects the GitHub repo so every push to main redeploys; if it fails because Vercel's GitHub app can't
   see the shiftedtech org, tell me: vercel.com → Settings → Git → GitHub → "Adjust GitHub App Permissions"
   → allow shiftedtech, then retry)
4. `npx vercel@latest deploy --prod --yes --scope fahmymahamud-9940`
5. Open the live URL, screenshot it at 1440px and 390px, confirm it matches local.
6. Put the live URL in README.md and the Open Graph url tag. Commit and push (Vercel redeploys).

## 7. Finish
Tell me: live URL, repo URL, what's in DECISIONS.md, anything left marked "ADD", and 3 ideas to improve next.
