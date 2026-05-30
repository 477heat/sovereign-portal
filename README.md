This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Portal mint commerce

The portal keeps mint execution backend-funded so early users can pay a $5.00
checkout fee while the backend wallet pays Base mint gas.

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

Local mock mode uses an in-memory order ledger for development. Never use that
fallback for a live mint deployment.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Mint Wiring

The portal keeps minting in preview mode unless `PORTAL_MINT_MODE=live` is set.

Live portal minting needs these server-only environment variables:

```bash
PORTAL_ENGINE_URL=
PORTAL_MINT_WORKER_URL=
```

`PORTAL_ENGINE_URL` must return final ERC-721 metadata with a real IPFS deed image URI. The portal rejects live mints when the engine still returns placeholder or local-test image references.

`PORTAL_MINT_WORKER_URL` should point at the NFT mint worker origin. The portal posts wallet and metadata to its `/mint` route, and that worker pins metadata through Pinata before calling the Base `backendMint` path.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
