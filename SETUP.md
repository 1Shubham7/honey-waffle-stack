# FoodSnap Local Setup

This document is for the `food-recorgnition/` subproject inside this repo.

I verified the local setup on this machine on April 19, 2026:

- `node -v` -> `v24.12.0`
- `npm -v` -> `11.6.2`
- `npm ci` succeeded
- `npm run build` succeeded
- `npm run dev -- --host 127.0.0.1` started the app at `http://127.0.0.1:8080/`

## What This Subproject Is

This is a frontend-only React + Vite app.

- No backend server is required for this subproject.
- No database is required.
- No Python is required.
- No Google Colab is required.
- No Gemini / Google AI Studio setup is required.

The only external service this app depends on is the OpenAI API.

## What You Need

Install these first if you do not already have them:

1. `git`
2. `node`
3. `npm`

Recommended install method for Node.js:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Then restart your terminal and run:

```bash
nvm install --lts
nvm use --lts
node -v
npm -v
```

If `node -v` and `npm -v` print versions, you are ready.

## OpenAI Account And API Key

You will need your own OpenAI API key because this app sends image analysis requests to OpenAI directly from the browser.

What you need to do:

1. Create or log into an OpenAI Platform account:
   `https://platform.openai.com/`
2. Go to API keys:
   `https://platform.openai.com/api-keys`
3. Create your own API key.
4. Make sure your API account has billing/credits enabled, otherwise image analysis can fail with insufficient credit errors.

Useful official references:

- Quickstart: `https://platform.openai.com/docs/quickstart`
- Authentication: `https://platform.openai.com/docs/api-reference/authentication`
- Prepaid billing help article: `https://help.openai.com/en/articles/8264778-what-is-prepaid-billing`

Important:

- This project currently uses the key in the browser, not through a backend.
- That is acceptable for a college demo, but not a production-safe design.
- Use your own key only.
- Prefer a separate low-risk API key / project for testing.

## Run It Locally

From the repo root:

```bash
cd /home/shubham/Code/Personal/calorymeter/food-recorgnition
npm ci
npm run dev -- --host 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8080/
```

If port `8080` is busy, Vite may choose another local port. Use the URL shown in the terminal.

## How To Use The App

1. Open the local URL in your browser.
2. Paste your OpenAI API key into the app.
3. Upload up to 3 food images.
4. Click analyze.
5. Review the nutrition output.
6. Optionally export CSV or PDF.

Supported upload types:

- `.jpg`
- `.jpeg`
- `.png`

## Optional Checks

Install already done and you want to verify before demo:

```bash
cd /home/shubham/Code/Personal/calorymeter/food-recorgnition
npm run build
```

## Troubleshooting

### `node: command not found` or `npm: command not found`

Install Node.js first, preferably with `nvm`, then reopen the terminal.

### `npm ci` fails

Try:

```bash
cd /home/shubham/Code/Personal/calorymeter/food-recorgnition
rm -rf node_modules
npm install
```

Use `npm ci` again later if you want a clean lockfile-based install.

### The app opens but analysis fails with `401`

Your OpenAI API key is invalid, revoked, or copied incorrectly.

### The app opens but analysis fails with `402`

Your OpenAI account likely does not have usable API credits / billing.

### The app opens but analysis fails with `429`

You hit an OpenAI rate limit or usage limit. Wait a bit, then retry.

### Browser security concern

This app sends requests from the browser directly to OpenAI with your key. Do not deploy this publicly as-is with a real personal key.

## Exact Minimal Demo Flow

```bash
cd /home/shubham/Code/Personal/calorymeter/food-recorgnition
npm ci
npm run dev -- --host 127.0.0.1
```

Then:

1. Open `http://127.0.0.1:8080/`
2. Paste your OpenAI API key
3. Upload a food photo
4. Click analyze

