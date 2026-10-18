# Clover-X website

A fast, plain HTML/CSS/JS website. There is **no build step**: upload the files to GitHub and the site is live.

```
index.html          Home page (services, team cards, projects, contact …)
team.html           Team page (all member cards, team skills, certifications)
portfolio/          One portfolio page per team member (member-1.html … member-4.html)
privacy.html        Privacy policy (template, fill in the [brackets])
imprint.html        Imprint / Impressum (template, fill in the [brackets])
404.html            "Page not found" page
assets/css/style.css   All styling. Colours are at the top.
assets/js/main.js      Loader, mobile menu, project filter, contact form
assets/img/            Logos, social preview image; put team photos in team/ and project images in projects/
assets/fonts/          Outfit + Manrope, self-hosted (no Google connection, GDPR-friendly)
brand/                 Logo deliverables (SVG + PNG), favicon set, source files
scripts/build-brand.mjs  Regenerates logos/favicons (only needed if the logo changes)
```

## Before you launch: checklist

1. **Your web address.** Search all files for `https://www.clover-x.example/` and replace it with the real address (e.g. `https://www.clover-x.de/`). It appears in `index.html`, `privacy.html`, `imprint.html`, `robots.txt` and `sitemap.xml`.
2. **Contact email.** Search for `hello@clover-x.example` and replace it with your real address. This also switches on the contact form (see below).
3. **Imprint and privacy policy.** Fill in every `[bracket]` in `imprint.html` and `privacy.html`, and have them checked by a legal professional. Both are required for a German business website.
4. **Location.** The site says "Berlin, Germany". Change it in `index.html` if that's wrong.
5. **Your domain in links.** `index.html`, `team.html`, the `portfolio/` pages, `privacy.html`, `imprint.html`, `robots.txt` and `sitemap.xml` all contain the placeholder address.
6. **Team and projects.** Replace the placeholder names, photos and project texts (see below).

## Editing text

Open `index.html` in any text editor (Notepad, VS Code) and change the words between the tags. Each section starts with a comment like `<!-- ===== SERVICES ===== -->`, so you can find your way around. Lines marked `EDIT:` are the ones you will most likely want to change.

- **Team members (4 cards):** each person appears in three places, so update all three:
  1. their card in `index.html` (Team section),
  2. their card in `team.html`,
  3. their own page, `portfolio/member-1.html` … `member-4.html` (name, role, introduction, about, experience, skills, certifications, projects, LinkedIn link).

  Search for `Team Member 1` (etc.) to find every spot. **Photos:** save a portrait (about 480×600 px) as `assets/img/team/member-1.jpg` (etc.), then follow the `EDIT photo:` comment next to each placeholder to swap in the `<img>` line. To rename a page (e.g. `portfolio/jane-doe.html`), rename the file and update the links on the cards.
- **Projects:** the Projects section in `index.html` has four example cards ("Project name 1" …). Edit the title, summary, client description, technologies, the details under "Read project details", and which team member worked on it. Each person's page has its own project cards too. Only include client names, numbers or images the client has agreed to share.
- **Skills and certifications** are on `team.html`. Each skill is one `<li class="chip">Skill</li>`; add or remove freely.

## Loading screen

The Clover-X loader (from `brand/source/loader-ref.html`) shows for **2 seconds** each time a page opens (home, team and portfolio pages). To change the time, edit `LOADER_MS` at the top of `assets/js/main.js` (milliseconds, e.g. `3000` = 3 seconds). It is skipped automatically if JavaScript is off, and its animation stops for visitors who turn on "reduce motion".

Only add client names, logos, numbers or testimonials that the client has agreed to share.

## Changing colours

Open `assets/css/style.css`. The first block (`:root { … }`) holds every colour, taken from the Clover-X UI kit:

| Name | Value | Used for |
|---|---|---|
| `--brand` | `#163944` | Logo teal, primary buttons, headings |
| `--deep` | `#0F2B36` | Dark sections, pressed buttons |
| `--mint` | `#5CD0C2` | Accent: only on dark backgrounds or small highlights |
| `--focus` | `#2F7F78` | Keyboard focus rings |
| `--surface` | `#F4F7F7` | Page background |

All text colours meet WCAG AA contrast (4.5:1). If you change them, check contrast with a tool like webaim.org/resources/contrastchecker.

## Contact form

The form sends messages to your inbox through **FormSubmit** (formsubmit.co), a free service that works on static sites such as GitHub Pages. No account is needed.

1. In `index.html`, change `action="https://formsubmit.co/hello@clover-x.example"` to your email address.
2. Publish the site, then send one test message from the live site.
3. FormSubmit emails you an activation link. Click it once. Every message after that arrives in your inbox.

Built in: a hidden "honeypot" spam trap, friendly validation messages, a required GDPR consent checkbox linking to the privacy policy, a loading state on the button and an on-page success message.

## Publishing on GitHub Pages

1. Create a repository on GitHub (e.g. `clover-x-website`).
2. Upload everything in this folder **except** `node_modules/` (it is listed in `.gitignore`, so `git push` skips it automatically).
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder `/ (root)`** → Save.
4. After a minute the site is live at `https://<your-username>.github.io/<repository>/`.

All links in the site are relative, so it works at that address and on your own domain.

**Your own domain (recommended):** in **Settings → Pages → Custom domain**, enter e.g. `www.clover-x.de`. Then, at your domain provider, add a `CNAME` record pointing `www` to `<your-username>.github.io`. When the check passes, tick **Enforce HTTPS**.

## Logo and brand files (`brand/`)

| File | Use |
|---|---|
| `svg/clover-x-logo-dark.svg` | Full logo on light backgrounds |
| `svg/clover-x-logo-white.svg` | Full logo on dark backgrounds |
| `svg/clover-x-mark-dark.svg` / `-white.svg` | Clover mark only (icons, avatars, small spaces) |
| `svg/clover-x-wordmark-*.svg` | Wordmark only |
| `png/*` | PNG exports of all of the above, plus favicon and app icons |
| `source/` | The original files supplied (logo PNG, loader reference, button UI kit) |

**Usage rules:** keep clear space around the logo equal to the height of one petal. The full logo must be at least **120 px wide** and the mark at least **32 px**. Don't recolour, stretch or add effects.

**About these files:** the logo was supplied only as PNGs (`source/logo.png` for the mark, and the wordmark embedded in `source/loader-ref.html`). The SVGs here are careful vector traces of those PNGs, checked against the originals at 400% (`check/`). They are sharp at all web sizes. For print or very large signage, ask the designer for the original vector file and replace these.

**Regenerating** (only if the logo source changes): install Node.js, then run `npm install` and `npm run brand` in this folder.

## Privacy notes

The site sets no cookies, uses no analytics and loads no third-party fonts or scripts, so **no cookie banner is needed**. If you later add analytics, embedded videos, maps or chat widgets, you will need a consent banner and an updated privacy policy.
