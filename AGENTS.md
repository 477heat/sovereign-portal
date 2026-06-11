<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sovereign Portal Agent Rules

Give beginner-friendly explanations and recommend best practices. Be direct
when something is risky, stale, or likely to affect money, minting, metadata, or
production.

## Project Role

This repo owns the public website and minting user journey:

- public pages and Coinbase/Base entry route
- wallet connection UI
- Coinbase EAS status display
- identity and terms UX
- Thirdweb checkout UI
- mint order/status screens
- private admin UI, including mint-order lookup and token inspection
- Vercel deployment

This repo does not own protected Engine truth. Do not recalculate zodiac stats,
rewrite minted metadata rules, change Lambda image generation, or alter contract
logic here unless the owner explicitly asks for that full-stack change.

## Critical Boundaries

Do not casually edit these areas:

- `/Users/thebridge/Desktop/SynthesisisZodiacEngine`
- `/Users/thebridge/Desktop/StarArtifactProgram` except for approved planning docs
- payment/webhook logic
- Coinbase EAS verification logic
- `/api/mint`, `/api/mint-order`, `/api/payments/webhook`, `/api/attestation`
- contract addresses, token settings, environment-variable names, or secrets

Never paste secrets into files, logs, commits, or docs.

## Coinbase/Base Listing Work

For Coinbase listing polish:

- `/coinbase` is the preferred Coinbase/Base entry route.
- `/manifest.json` should start at `/coinbase`.
- Lean into Sovereign Engine as the larger Engine System.
- Treat Soul Deed as the Genesis Access artifact, not the whole product.
- Do not add `/.well-known/farcaster.json` unless Base.dev or Farcaster
  explicitly requires signed account association.
- Keep listing assets compressed and avoid large video/media additions.

Asset source folder:

```text
/Users/thebridge/Desktop/StarArtifactProgram/coinbase_app/listing-assets/
```

Served production asset folder, when approved:

```text
/Users/thebridge/Desktop/sovereign-portal/public/coinbase-assets/
```

## Collaboration Rules

- Work on a branch for any meaningful change.
- Do not overwrite or revert changes you did not make.
- If the worktree is dirty, identify unrelated changes before editing.
- Internal PM briefs, planning notes, handoffs, and checklists belong in
  `/Users/thebridge/Desktop/StarArtifactProgram` unless the owner explicitly
  approves putting them in this repo.
- Other agents may draft aesthetics or copy, but TED/Codex reviews before merge,
  deploy, or production alias changes.

## Validation

Before production review, run the checks that match the scope:

```bash
npm run lint
npx -y tsc --noEmit
npm run build
```

For Coinbase display work, also verify:

```bash
curl -I http://localhost:3000/manifest.json
curl -I http://localhost:3000/opengraph-image
curl -I http://localhost:3000/twitter-image
curl -Ls http://localhost:3000 | rg 'og:title|og:image|twitter:card|twitter:image|manifest|base:app_id'
curl -Ls http://localhost:3000/coinbase | rg 'og:title|og:image|twitter:card|twitter:image|base:app_id'
```

Production deploys must ship the exact reviewed commit. If the main checkout is
dirty, use an isolated clean worktree or deployment path rather than deploying
unreviewed local edits.

Private admin support routes currently include `/admin`, `/admin/operations`,
and `/admin/token-inspector`. Keep those routes Basic-Auth protected in
production and do not expose token inspection helpers on public pages.
