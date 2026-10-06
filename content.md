# Site content

Every line here comes from `brand_assets/` (mainly `resume-portfolio.md`, then `profile.md` and `projects.md`).
Edit this file first, then copy the change into `site/index.html`. Details still marked ADD, EDIT ME or CONFIRM
in `brand_assets/` are left off the site (see DECISIONS.md).

---

## Hero (floor G: Lobby)
- Heading: **Fahmy Mahamud**
- Avatar: `brand_assets/avatar.png`
- Headline: Data engineering & AI automation
- Subline: Former lift engineer, now building data pipelines and AI automations. Based in Singapore, open to remote.
- Buttons: **View projects** (→ #projects) · **Contact me** (→ #contact)
- Skyline label: Singapore · 1.35°N 103.82°E

## 1. My story
Heading: From lifts to data.

I spent 9+ years in engineering operations and facilities. At SMRT I kept lifts and escalators running for
Singapore's rail network, was promoted to Assistant Engineer II, and stepped up as team lead on short notice
to clear a backlog of undone documentation by priority. That is where I saw how much more I could do with data
and AI. So I retrained through Generation Singapore's Junior Data Engineer programme (with Microsoft and
Temasek Polytechnic), and now I build data pipelines and AI automations.

## 2. Skills
Heading: What I work with.

- **Data engineering:** Python, SQL, ETL/ELT pipelines, Microsoft Fabric, Power BI, computational notebooks, Snowflake, Databricks
- **Cloud:** Microsoft Azure, Google Cloud (Cloud Run, Firebase), Supabase, Vercel
- **AI & automation:** prompt engineering, AI agents (Claude Code), Trigger.dev, Telegram bots, workflow automation
- **Web:** HTML, CSS, JavaScript, TypeScript, GitHub, version control
- **Also:** stakeholder management, vendor and contractor coordination, regulatory compliance (BCA, LTA), Agile

## 3. Projects
Heading: Things I've built.

### MyJobSearchBot (featured)
Daily bot that checks 5 job sites, keeps remote AI/data roles open to Singapore, ranks them against my resume,
and sends the top 15 to Telegram. Open source.
Stack: TypeScript, Trigger.dev, Telegram Bot API, GitHub
Link: https://github.com/fahmymahamud/remotejobsearch

### Also built (3D escalator ride, 4 clickable cards with real screenshots of each site)
1. **Crew scheduling app** (client project): scheduling web app for a Singapore cleaning company: job creation and assignment,
   WhatsApp message generation, crew availability forms, calendar sync, Google sign-in and an audit log of changes.
   JavaScript · Supabase · Google sign-in → https://crewscheduling.netlify.app/
2. **RemindClient** (web app): sends polite, AI-crafted payment and lesson reminders to your clients. Built to help freelancers
   send reminders through a Telegram bot. → https://remindclient.app/
3. **Waseel: Quran memory tester** (free web app): tests Quran memorisation with a random ayah by Juz.
   HTML · JavaScript · GitHub Pages → https://waseelapp.github.io/quranmemorytester/
4. **DataSentinel** (open source): an agent-based pipeline that uses the Model Context Protocol (MCP) to automate data auditing.
   Python · MCP · Docker → https://github.com/fahmymahamud/DataSentinel

## 4. Your task (picker)
Heading: Got something eating your time?
Pick a problem, see "How I'd tackle it", what's already built, and the certifications behind it:
- "I copy the same data between spreadsheets every week" → Automate repetitive work (MyJobSearchBot)
- "My weekly report takes hours to put together" → Data pipelines & dashboards (Generation capstone)
- "I keep chasing people for payments and replies" → AI assistants & bots (RemindClient)
- "My team runs on WhatsApp groups and sticky notes" → Custom web apps for small teams (Crew scheduling app)
- "My app needs a proper home online" → Cloud setup & hosting (Crew app on Supabase, this site on Vercel)

## 5. What I enjoy doing (services linked both ways to a certificate directory)
1. AI assistants & bots · Built: RemindClient, DataSentinel · AI-900, Databricks Generative AI Fundamentals, AI Prompting Essentials
2. Data pipelines & dashboards · Built: data pipeline capstone (Microsoft Fabric, Power BI) · DP-900, Google Data Analytics, Advanced Data Analytics
3. Cloud setup & hosting · Built: Crew scheduling app (Supabase), this site (Vercel) · Google Cloud ACE, AZ-900
4. Automate repetitive work · Built: MyJobSearchBot · Google IT Automation with Python, AI Prompting Essentials
5. Custom web apps for small teams · Built: Crew scheduling app, Waseel · GitHub Foundations (GH-900)

## 6. Live demo
"Watch messy data get cleaned." A made-up lift maintenance log (10 rows) goes through a real 4-step pipeline in the browser:
tidy names, one date format, remove duplicates, flag missing status. Result: 7 clean rows, 3 duplicates removed, 2 flagged,
plus a jobs-per-station chart. Labelled as sample data.

## 7. Certified (inspection-certificate plates; hover or tap to flip)
Google Cloud ACE (Jul 2026), SnowPro Associate: Platform (Apr 2026), AI-900 (Feb 2026), AZ-900 (Jan 2026), DP-900 (Dec 2025),
GitHub Foundations GH-900 (Aug 2026), Databricks Generative AI Fundamentals (Nov 2025), Google IT Automation with Python (Oct 2025),
Google Advanced Data Analytics (Sep 2025), Google Data Analytics (Jul 2025), Google AI Prompting Essentials (Jun 2025),
Google Cybersecurity (Mar 2026). Back of each: "Used it for" projects, "Helps with" service, Verify link where public.

## 8. Badge wall
All 26 badges from https://www.credly.com/users/fahmy-m/badges/credly and
https://www.credential.net/profile/fahmymahamud87873/wallet, filterable by AI, Data, Cloud, Automation, Security & IT,
Work & design. Each badge links to its verification page. Images in site/assets/badges/.

## 9. Contact
Heading: Making everyday tasks effortless on the side.

- Email: fahmymahamud@gmail.com
- GitHub: https://github.com/fahmymahamud
- LinkedIn: https://www.linkedin.com/in/fahmymahamud/
- Instagram: https://www.instagram.com/careershifttechguy/
- Facebook: https://www.facebook.com/profile.php?id=61592200658626
(Shown as a row of logo links: Gmail, LinkedIn, GitHub, Instagram, Facebook.)
