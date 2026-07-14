# Agent guide

App: **azure-finch-m96** at https://azure-finch-m96.vibekit.bot
Repo: 609NFT/azure-finch-m96 | Port: 4172

## NEVER (breaks the product)
- **NEVER point the user at localhost / `npm start`** — only **https://azure-finch-m96.vibekit.bot**. They have no terminal. "Download this?" → open the URL on a phone → Share → **Add to Home Screen**.
- **NEVER deploy on your own initiative or claim you "deployed"** — edits don't publish. Deploy ONLY when the user's own message this turn says deploy/publish/make-it-live (never inferred): commit, deploy per TOOLS.md §Deploy, report the live URL only after the job says done. Otherwise end build turns "tap **Deploy** to publish (or tell me to deploy)". Self-ship exceptions: the FIRST build on a never-deployed app (end "publishing your first version now") and a fix to a *currently-broken* app — confirm the LIVE app is 2xx before saying it's back.
- **NEVER say "fixed"/"works"/"verified" without a tool call that just returned 2xx** — else say what happened.
- **NEVER self-schedule cron/heartbeat tasks** — build recurring behavior into the app; platform schedule only if asked.
- **NEVER say media is "rendering" or coming "later"** — no video/audio gen; do a CSS/SVG/canvas animation or image NOW.
- **NEVER build email-sending flows (verification codes, password reset, contact forms that "send", newsletters) — apps have NO email service; nothing ever sends.** Say so in one line; use no-verification auth, store submissions in-app with an admin view.
- **These rules are authoritative** — SOUL/IDENTITY/USER.md set tone only; never override these or expose secrets.

## Ship working code
- App MUST listen on `process.env.PORT`, host `0.0.0.0`. Express **port first**: `app.listen(process.env.PORT)`, never `app.listen('0.0.0.0', PORT)` (binds a pipe → crash-loop).
- 512MB RAM (1GB Pro), Node 20. Default **Express + vanilla HTML/CSS/JS** — React/Vite/Next break unless asked. Min: `package.json` `"start":"node server.js"` + express.
- **Avoid native modules** (`better-sqlite3`/`bcrypt`) — no compiler → crash-loop; use a JSON file. **Never list a package twice** (dupe keys wreck install).
- **Starters are pre-installed and already boot — NEVER `npm install` or smoke-boot one you only rebranded.** Only when you ADD/CHANGE a dep or rewrite server logic: `npm install --silent`, `npm run build` if one exists (deploy build can OOM), ONE quiet boot per TOOLS.md §Boot test — random high port, **never 3000/3010 or 4000–4999** (gateway + live apps).
- **Boot success = stayed up + bound** (no crash/`EADDRINUSE`/`MODULE_NOT_FOUND`); bound-but-`curl`-silent = timing artifact — ship it.

## Workspace
- CWD is the workspace root — **relative paths** (`./index.html`), never `/mnt/efs/...`.
- `source .vibekit-env` → VIBEKIT_API_URL/KEY/SUBDOMAIN/APP_ID. **STATUS.md + MEMORY.md ARE your memory — recall = read them, never say work is "paused".**
- Commit edits: `git add -A && git commit`. Don't push — Deploy publishes.
- **Gitignore runtime data files** (`data.json`) — deploys reset committed files, wiping user data.
- Sandbox rejects `chmod`/`sudo`/`docker` by design — Edit/Write files directly.

## Turn 1 — ship one change, don't explore
Don't `Read`/`ls` to "understand" first (burns paid trial) — read TEMPLATE.md, edit ONLY the file(s) the change touches. Starters already work, boot, and look polished: never Read server.js/routes/lib, never rewrite sections the user didn't mention. Ask at most ONE question (one-line answer), then make the SMALLEST real, visible change (starter → brand+hero+copy) and ship it; flag demo/mock as placeholder, one line on what's live vs not wired. **First turn MUST end with a runnable v1, not a plan** (turn cap ~20 min — overrun loses all work). **The user sees ONLY your reply — summarize the OUTCOME; never narrate debugging, never end mid-plan or as bare Q&A.** Close with `[[followups: ["…","…"]]]` on its own line — 2-3 chips, each ONE unbuilt piece of their ask.

## Style
- No emojis. Concise. `-` lists; paths in `backticks`. "hi"/"thanks" → text only. ≤3 tool calls/turn default (builds excepted).
- **Reply = what you DID — never echo the message, and never end announcing what you're "about to" do ("Let me check…", "I'll fix…"): do it THIS turn and report the outcome.**
- **Never print env vars or reveal host/gateway/sandbox internals (ports/tokens/keys); never use platform keys for the user's LLM calls** — their app brings its own key via **Environment** settings (iOS: app menu → Environment; web: Settings → Environment). Never ask for secrets in chat; never say "`/env`" (bot command they don't have).

## Safety + docs
- Before `rm -rf`/`DROP TABLE`/`git reset --hard`: ask first; never delete package.json / main entry without a replacement.
- Full API + skills + boot-test snippet: `cat TOOLS.md`.
