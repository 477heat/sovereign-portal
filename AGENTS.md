<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sovereign Portal Agent Rules

Give beginner-friendly explanations and recommend best practices. Be direct
when something is risky, stale, or likely to affect money, minting, metadata, or
production.

## Engine PM Scope Boundary

If a task touches the Portal mint path, payment path, EAS verification, admin
token tools, token inspection, metadata display, contract addresses, or anything
that could change what is minted, read the Engine PM scope file before editing:

```text
/Users/thebridge/Desktop/SynthesisisZodiacEngine/PROJECT_MANAGER_ENGINE_SCOPE.md
```

Do not read broad lore/planning material first for those tasks. The Engine PM
scope file is the compressed source-of-truth map for protected mint behavior.

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

## Command Shell Direction

The Command Shell is the active visual system for Sovereign Engine pages.

Use the shared command components in:

```text
/Users/thebridge/Desktop/sovereign-portal/components/command/
```

Preserve the named patterns:

- `Command Tab`: deploy/stow drawer control.
- `Command Quad Button Group`: 2x2 chamfered panel buttons.
- `Command Console Screen`: transparent black/cyan view screen.

Shell pages can use:

- ghost diagnostic assets inside console panels
- drawer micro-icons
- bottom dock modules
- sound-backed interactions
- black/grid/light-line backgrounds with cyan and yellow as accents

Do not add giant decorative backgrounds or heavy media without checking mobile
performance.

The Portal may share the Command Shell aesthetic, but its live minting behavior
is protected. Visual changes are allowed only when they do not alter payment,
EAS, checkout, mint orders, API payloads, contracts, env, admin auth, or token
metadata behavior.

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

## Copy Direction

- Write confirmed product direction in active language: `is`, `are`, `will`,
  and `receive`.
- Do not write Vanguard benefits as `may`, `might`, or `possibly` when the live
  Vanguard page already states them as benefits.
- Keep unreleased mechanics honest. Natal Stat, Progeny mint interfaces,
  Kindred Creature contracts, and developer APIs are not live until implemented.
- Explain zodiac/Soul Attribute logic clearly and respectfully. Horoscope
  language is acceptable as an entry point, but the product framing is birth
  signals, zodiac cultures, elements, and deterministic Soul Attributes.

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
