# Sovereign Portal

Sovereign Portal is the public Next.js app for Sovereign Engine and the Soul
Deed / Genesis Access mint path. It owns the browser experience: public pages,
Coinbase/Base entry, wallet connection, Coinbase EAS status display, checkout,
mint order flow, receipt recovery, and private admin support screens.

Protected generation truth lives in `/Users/thebridge/Desktop/SynthesisisZodiacEngine`.
Planning docs live in `/Users/thebridge/Desktop/StarArtifactProgram`.

## Portal mint commerce

The portal keeps mint execution backend-funded so users pay the configured
checkout fee while the backend wallet pays Base mint gas. The checkout amount is
runtime-configurable from the private admin panel; do not treat the fallback
environment value as the live price without checking `/api/portal-settings`.

- `NEXT_PUBLIC_PORTAL_PAYMENT_MODE=checkout` shows the thirdweb checkout block.
- `PORTAL_PAYMENT_MODE=required` makes live `/api/mint` calls require a paid mint
  order before the mint worker is called.
- Checkout `purchaseData` includes a mint `orderId`; thirdweb payment webhooks
  must point to `/api/payments/webhook` so that order can be marked paid.
- The payment verifier expects Base USDC-style token decimals by default. Set
  `PORTAL_PAYMENT_TOKEN_DECIMALS` if the accepted checkout token differs.
- Mint orders use a DynamoDB table named by `PORTAL_LEDGER_TABLE`. The table only
  needs a string partition key named `pk`; it stores the order record and the
  one-wallet mint claim.
- The IAM principal used by Vercel for the ledger needs these table-scoped
  DynamoDB actions: `GetItem`, `PutItem`, `UpdateItem`, `DeleteItem`, and
  `ConditionCheckItem`. The app uses `ConditionCheckItem` inside order creation
  transactions to block wallets that already have a submitted mint before a new
  checkout order is opened.
- Submitted mint orders store receipt recovery fields when the mint succeeds:
  transaction identifiers, token URI, image URI, deed name, and chain details.
- Receipt display keeps canonical `ipfs://` metadata/image URIs, but converts
  them through the Pinata public gateway first for browser previews. The public
  `ipfs.io` gateway remains a fallback because fresh pins can fail or lag there.
- Users can recover the latest submitted mint receipt for their connected wallet
  through a signed wallet recovery request. The private admin operations page can
  look up orders by order ID or wallet for support triage.

Local mock mode uses an in-memory order ledger for development. Never use that
fallback for a live mint deployment.

Run the live integrity verifier after production deploys:

```bash
npm run verify:portal
```

The verifier checks the live Portal, protected admin/recovery routes, active
payment settings, Base contract state, current token metadata/images, royalty
math, and a known Coinbase EAS eligible wallet. It uses public endpoints and
does not need secrets. It also signs a temporary test wallet message to prove
the live recovery endpoint accepts valid wallet signatures.

To prove full recovery for a real minted wallet, sign this exact message with
the wallet that minted:

```text
Sovereign Portal mint receipt recovery
Wallet: <lowercase wallet address>
```

Then run:

```bash
PORTAL_VERIFY_RECOVERY_WALLET=<wallet> \
PORTAL_VERIFY_RECOVERY_SIGNATURE=<signature> \
PORTAL_VERIFY_REQUIRE_SIGNED_RECOVERY=1 \
npm run verify:portal
```

Run the local mint-order lifecycle verifier before deploys that touch order,
payment, receipt, or mint state:

```bash
npm run verify:orders
```

That verifier uses the in-memory ledger path only. It does not touch DynamoDB,
AWS, payment providers, or production mint orders.

## Local Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For Coinbase/Base route checks, use [http://localhost:3000/coinbase](http://localhost:3000/coinbase).
For the live mint flow, use [http://localhost:3000/portal](http://localhost:3000/portal).

## Admin And Support

Private admin routes are for owner/support use only:

- `/admin`: contract and portal controls.
- `/admin/operations`: mint-order lookup and receipt support.
- `/admin/token-inspector`: token URI, metadata, image, stats, royalty quote,
  original minter, and splitter inspection.

Keep these routes Basic-Auth protected in production. They must never expose
secrets, private keys, or backend credentials.

## Mint Wiring

The portal keeps minting in preview mode unless `PORTAL_MINT_MODE=live` is set.

Live portal minting needs these server-only environment variables:

```bash
PORTAL_ENGINE_URL=
PORTAL_MINT_WORKER_URL=
```

`PORTAL_ENGINE_URL` must return final ERC-721 metadata with a real IPFS deed image URI. The portal rejects live mints when the engine still returns placeholder or local-test image references.

`PORTAL_MINT_WORKER_URL` should point at the NFT mint worker origin. The portal posts wallet and metadata to its `/mint` route, and that worker pins metadata through Pinata before calling the Base `backendMint` path.

## Deployment Notes

Production deploys must ship the exact reviewed commit. After deploying changes
that touch payment, minting, receipt recovery, or admin support, run:

```bash
npm run verify:portal
```

For changes that touch local order state, payment gates, or receipt state, also
run:

```bash
npm run verify:orders
```

These checks do not perform a real mainnet mint.
