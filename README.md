# fahmymahamud: portfolio site

The one-page portfolio of **Fahmy Mahamud** (shiftedtech): data engineering and AI automation, Singapore, open to remote.

**Live:** https://fahmymahamud.vercel.app

The page works like a lift. A floor indicator follows you down the page, pressing it opens a lift-button panel that jumps
between sections, and on floor 3 the doors slide open onto the projects. The hero is a hand-drawn SVG line drawing of the
Singapore skyline: the Flyer turns, the Supertrees glow, and the whole city leans as you move your mouse.

## Edit the content
1. Update the facts in `brand_assets/` (`resume-portfolio.md`, `profile.md`, `projects.md`). These are the source of truth.
2. Mirror the change in `content.md` (the copy deck for the site).
3. Edit the matching text in `site/index.html`. Every section is a plain, commented `<section>`.
4. Commit and push to `main`. Vercel redeploys automatically.

Things still waiting on you are listed in `DECISIONS.md` (LinkedIn URL, two project links, three dates).

## Stack
- Plain HTML, CSS and a little JavaScript. No framework, no build step.
- Deployable files live in `site/`. `vercel.json` serves that folder with clean URLs.
- Scroll behaviour uses the [scroll-craft](https://github.com/nateherkai/scroll-craft) engine, unmodified
  (`site/assets/scrollcraft.*`). All site-specific code is in `site/assets/site.js` and `site/assets/site.css`.
- Font: Inter. Images: WebP. The whole site is under 0.5 MB.
- `tools/shots.mjs` takes the 1440px/390px screenshot loop (needs `npm install` for playwright-core, plus Chrome).
  `tools/og.mjs` regenerates the Open Graph image from the hero.

## Run locally
Serve the `site/` folder with any static server, for example `npx serve site`, then open the printed URL.

---
Built with Claude Code + scroll-craft, #AISChallenge Day 5.
