# OP Mini Tournament (Netlify)

- `public/index.html` is the site (Beginner, Novice / Intermediate, Standings).
- `netlify/functions/state.mjs` saves teams and scores in Netlify Blobs, so everyone sees the same live results.
- Only someone with the organizer PIN can edit. The PIN is the `ORGANIZER_PIN` environment variable.

## Deploy with the Netlify CLI

Requires Node.js 18 or newer. Run these in this folder:

```
npm install
npx netlify-cli login
npx netlify-cli deploy --prod
```
When asked, choose "Create & configure a new project" and pick a name (e.g. op-mini-tournament).
The publish directory is read from netlify.toml.

Then set your PIN and deploy again so the function picks it up:

```
npx netlify-cli env:set ORGANIZER_PIN 482913
npx netlify-cli deploy --prod
```

## Or deploy from GitHub

Push this folder to a GitHub repo, then in Netlify choose Add new project → Import an existing project.
Leave the build command empty. Add `ORGANIZER_PIN` under Project configuration → Environment variables, then redeploy.

Drag-and-drop (Netlify Drop) will not work: it uploads static files only, so saving would fail.

## Using it

Open the site, tap **Organizer login**, enter the PIN. Add teams, then enter scores.
Viewers' pages refresh every 15 seconds.
