# Clover-X website

The website of Clover-X, Gujarat, India: **https://clover-x.in/** · contact: **info@clover-x.in**

A fast, plain HTML/CSS/JS website. There is **no build step**: upload the files to GitHub and the site is live.

```
index.html          Home page (services, team cards, projects, contact form)
team.html           Team page (all member cards)
portfolio/          One portfolio page per team member (aman-varma.html, nihar-mehta.html)
privacy.html        Privacy policy (India, DPDP Act 2023)
imprint.html        Legal notice
404.html            "Page not found" page
assets/css/style.css   All styling. Colours are at the top.
assets/js/main.js      Loader, mobile menu, project filter, contact form
assets/img/            Logos, social preview image, team photos (team/), project diagrams (projects/)
assets/fonts/          Outfit + Manrope, self-hosted (no Google connection)
brand/                 Logo deliverables (SVG + PNG), favicon set, source files  (local only, not uploaded)
scripts/build-brand.mjs  Regenerates logos/favicons, only if the logo changes  (local only, not uploaded)
```

## Editing text

Open any `.html` file in a text editor (Notepad, VS Code) and change the words between the tags. Each section starts with a comment like `<!-- ===== SERVICES ===== -->`, so you can find your way around.

- **Team members:** each person appears in three places, so update all three:
  1. their card in `index.html` (Team section),
  2. their card in `team.html`,
  3. their own page in `portfolio/`.

  **Photos:** portraits are 480×600 px, saved as both `.jpg` and `.webp` in `assets/img/team/` (e.g. `nihar-mehta.jpg` / `nihar-mehta.webp`). To change one, replace both files with the same names.

- **Adding a new team member:** copy `portfolio/nihar-mehta.html` to e.g. `portfolio/first-last.html` and change its content; then copy a card `<li>…</li>` in `index.html` and `team.html`, point it at the new page, and add the new card to the "Also on the team" list on the other portfolio pages. Add the page to `sitemap.xml`.
- **Projects:** the Projects section in `index.html` shows six projects copied from the team's portfolio pages, each credited to its author. Copy a `<li data-domains="…">…</li>` block to add one; `data-domains` controls the filter buttons (`security`, `web-apps`, `software`, `communication`). Only include client names, logos or numbers that the client has agreed to share.

## Loading screen

The Clover-X loader (from `brand/source/loader-ref.html`) shows for exactly **2 seconds** each time any page opens. To change the time, edit `LOADER_MS` at the top of `assets/js/main.js` (milliseconds, e.g. `3000` = 3 seconds); the 404 page has its own `2000` near the bottom of `404.html`. It is skipped automatically if JavaScript is off, and its animation stops for visitors who turn on "reduce motion".

## Contact form

The form is connected to **Formspree** (form ID `mdeekrwv`, endpoint `https://formspree.io/f/mdeekrwv`). Messages are emailed to the address of the Formspree account and are also listed in the Formspree dashboard.

- Free plan: 50 submissions per month. Upgrade in Formspree if you need more.
- In the Formspree dashboard you can change the email address messages go to, turn on reCAPTCHA, and restrict the form to your domain (`clover-x.in`) so it can't be used from other sites.
- Built in: a hidden "honeypot" spam trap (`_gotcha`), friendly validation messages, a required consent checkbox linking to the privacy policy, a loading state on the button and an on-page success message.

**After publishing, send one test message from the live site** to confirm it arrives.

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

## Publishing on GitHub Pages

1. Create a repository on GitHub (e.g. `clover-x-website`).
2. Upload the folder with `git push`. Files listed in `.gitignore` (`brand/`, `scripts/`, `package.json`, `node_modules/` …) stay on your computer and are skipped automatically. If you upload by drag-and-drop on github.com instead, leave those out yourself.
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder `/ (root)`** → Save.
4. After a minute the site is live at `https://<your-username>.github.io/<repository>/`.

**Connecting clover-x.in:** in **Settings → Pages → Custom domain**, enter `clover-x.in` and save. At your domain provider, add these DNS records:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `CNAME` | `www` | `<your-username>.github.io` |

When GitHub's DNS check passes, tick **Enforce HTTPS**. The page addresses in the HTML, `sitemap.xml` and `robots.txt` already use `https://clover-x.in/`.

## Logo and brand files (`brand/`)

This folder is kept on your computer only (it is in `.gitignore`). **Back it up**, e.g. to cloud storage: it holds the logo files and your original reference files.

| File | Use |
|---|---|
| `svg/clover-x-logo-dark.svg` | Full logo on light backgrounds |
| `svg/clover-x-logo-white.svg` | Full logo on dark backgrounds |
| `svg/clover-x-mark-dark.svg` / `-white.svg` | Clover mark only (icons, avatars, small spaces) |
| `svg/clover-x-wordmark-*.svg` | Wordmark only |
| `png/*` | PNG exports of all of the above, plus favicon and app icons |
| `source/` | The original files supplied (logo PNG, loader reference, button UI kit) |

**Usage rules:** keep clear space around the logo equal to the height of one petal. The full logo must be at least **120 px wide** and the mark at least **32 px**. Don't recolour, stretch or add effects.

**About these files:** the logo was supplied only as PNGs. The SVGs here are careful vector traces, checked against the originals at 400% (`check/`). They are sharp at all web sizes. For print or very large signage, ask the designer for the original vector file.

**Regenerating** (only if the logo source changes): install Node.js, then run `npm install` and `npm run brand` in this folder.

## Privacy notes

The site sets no cookies, uses no analytics and loads no third-party fonts or scripts, so **no cookie banner is needed**. The only outside services are GitHub Pages (hosting) and Formspree (contact form), both named in `privacy.html`. If you later add analytics, embedded videos, maps or chat widgets, add a consent banner and update the privacy policy.
