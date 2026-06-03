process.env.PORTAL_MINT_MODE = "mock";
delete process.env.PORTAL_LEDGER_TABLE;

type PortalOrders = typeof import("../lib/portalOrders");

let portalOrders: PortalOrders;

const checks: Array<{ name: string; passed: boolean; detail?: string }> = [];

function record(name: string, passed: boolean, detail = "") {
  checks.push({ name, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"} ${name}${detail ? ` - ${detail}` : ""}`);
}

function assert(name: string, condition: unknown, detail = "") {
  record(name, Boolean(condition), detail);
}

async function expectError(
  name: string,
  action: () => Promise<unknown>,
  expectedMessage: string,
) {
  try {
    await action();
    record(name, false, "No error was thrown.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    record(name, message.includes(expectedMessage), message);
  }
}

function eventTypes(order: { events?: Array<{ type: string }> }) {
  return (order.events ?? []).map((event) => event.type);
}

const payment = {
  amount: "0.02",
  minAmount: BigInt(20_000),
  seller: "0xd89A17cab674979A531657Cd426fC65aF29F8214",
  tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  decimals: 6,
  chainId: 8453,
};

async function verifyCheckoutLifecycle() {
  const {
    buildMintReceiptFromOrder,
    claimMintOrder,
    createComplimentaryMintOrder,
    createMintOrder,
    getLatestMintOrderForWallet,
    markMintOrderPaid,
    markMintOrderPaidByVerifiedTransaction,
    markMintOrderSubmitted,
    releaseMintOrder,
    toPublicMintOrder,
  } = portalOrders;
  const wallet = "0x1111111111111111111111111111111111111111";
  const publicMark = "T. One";
  const order = await createMintOrder({ wallet, publicMark, payment });

  assert("checkout order starts pending", order.status === "pending_payment");
  assert("checkout order records payment snapshot", order.paymentMinAmount === "20000");
  assert("checkout order records order_created event", eventTypes(order).includes("order_created"));

  await expectError(
    "underpaid webhook is rejected",
    () =>
      markMintOrderPaid({
        orderId: order.orderId,
        paymentId: "pay-under",
        receivedAmount: BigInt(1),
      }),
    "Payment amount is lower than this mint order requires.",
  );

  const paid = await markMintOrderPaid({
    orderId: order.orderId,
    paymentId: "pay-ok",
    paymentTransactionHash: "0xpayment",
    receivedAmount: BigInt(20_000),
  });

  assert("paid order is marked paid", paid?.status === "paid");
  assert("paid order records payment event", eventTypes(paid!).includes("payment_recorded"));

  await expectError(
    "paid order rejects different direct payment hash",
    () =>
      markMintOrderPaidByVerifiedTransaction({
        orderId: order.orderId,
        paymentId: "base-direct:0xdifferent",
        paymentTransactionHash: "0xdifferent",
        receivedAmount: BigInt(20_000),
      }),
    "Mint order is not pending payment.",
  );

  await expectError(
    "claim rejects wrong wallet",
    () =>
      claimMintOrder(
        order.orderId,
        "0x2222222222222222222222222222222222222222",
        publicMark,
      ),
    "Mint order does not match this wallet.",
  );
  await expectError(
    "claim rejects wrong public mark",
    () => claimMintOrder(order.orderId, wallet, "X. Bad"),
    "Mint order does not match this public covenant mark.",
  );

  const claimed = await claimMintOrder(order.orderId, wallet, publicMark);
  assert("paid order can be claimed for minting", claimed?.status === "minting");
  assert("claim records mint_claimed event", eventTypes(claimed!).includes("mint_claimed"));

  const latestWhileMinting = await getLatestMintOrderForWallet(wallet);
  assert(
    "latest wallet order follows active claim",
    latestWhileMinting?.orderId === order.orderId && latestWhileMinting.status === "minting",
  );

  const released = await releaseMintOrder(order.orderId, wallet);
  assert("failed mint release returns order to paid", released?.status === "paid");
  assert("release records mint_released event", eventTypes(released!).includes("mint_released"));

  const reclaimed = await claimMintOrder(order.orderId, wallet, publicMark);
  assert("released order can be claimed again", reclaimed?.status === "minting");

  const submitted = await markMintOrderSubmitted({
    orderId: order.orderId,
    mintTransactionId: "engine-tx-1",
    mintTransactionHash: "0xmint",
    chainId: 8453,
    deedName: "Certificate of Title for Spiritual Ownership of T. One",
    contractLanguageVersion: "certificate-title-spiritual-ownership-test",
    tokenURI: "ipfs://metadata-cid",
    metadataUrl: "https://ipfs.io/ipfs/metadata-cid",
    ipfsHash: "metadata-cid",
    imageURI: "ipfs://image-cid",
    imageUrl: "https://ipfs.io/ipfs/image-cid",
  });

  assert("claimed order can be submitted", submitted?.status === "mint_submitted");
  assert("submit records mint_submitted event", eventTypes(submitted!).includes("mint_submitted"));

  const latestSubmitted = await getLatestMintOrderForWallet(wallet);
  assert("latest wallet order remains submitted order", latestSubmitted?.orderId === order.orderId);

  const receipt = buildMintReceiptFromOrder(submitted!);
  assert("submitted order builds receipt", receipt?.status === "submitted");
  assert("receipt contains token URI", receipt?.tokenURI === "ipfs://metadata-cid");
  assert("receipt contains image URI", receipt?.imageURI === "ipfs://image-cid");

  const publicOrder = toPublicMintOrder(submitted!);
  assert("public order exposes status", publicOrder.status === "mint_submitted");
  assert(
    "public order does not expose public mark",
    !Object.prototype.hasOwnProperty.call(publicOrder, "publicMark"),
  );

  await expectError(
    "submitted wallet cannot create another checkout order",
    () => createMintOrder({ wallet, publicMark: "T. Two", payment }),
    "This wallet already has a submitted mint.",
  );
  await expectError(
    "submitted wallet cannot receive complimentary order",
    () =>
      createComplimentaryMintOrder({
        wallet,
        publicMark: "T. Gift",
        reason: "duplicate check",
      }),
    "This wallet already has a submitted mint.",
  );
}

async function verifyDirectPaymentClaimLifecycle() {
  const {
    createMintOrder,
    markMintOrderPaidByVerifiedTransaction,
  } = portalOrders;
  const wallet = "0x5555555555555555555555555555555555555555";
  const duplicateWallet = "0x6666666666666666666666666666666666666666";
  const transactionHash =
    "0xabc0000000000000000000000000000000000000000000000000000000000001";
  const order = await createMintOrder({
    wallet,
    publicMark: "D. One",
    payment,
  });

  const paid = await markMintOrderPaidByVerifiedTransaction({
    orderId: order.orderId,
    paymentId: `base-direct:${transactionHash}`,
    paymentTransactionHash: transactionHash,
    receivedAmount: BigInt(20_000),
  });

  assert("direct payment marks order paid", paid?.status === "paid");
  assert(
    "direct payment stores normalized tx hash",
    paid?.paymentTransactionHash === transactionHash.toLowerCase(),
  );

  const idempotent = await markMintOrderPaidByVerifiedTransaction({
    orderId: order.orderId,
    paymentId: `base-direct:${transactionHash}`,
    paymentTransactionHash: transactionHash,
    receivedAmount: BigInt(20_000),
  });
  assert("direct payment accepts same-order retry", idempotent?.orderId === order.orderId);

  const duplicateOrder = await createMintOrder({
    wallet: duplicateWallet,
    publicMark: "D. Two",
    payment,
  });

  await expectError(
    "direct payment tx hash cannot be reused for another order",
    () =>
      markMintOrderPaidByVerifiedTransaction({
        orderId: duplicateOrder.orderId,
        paymentId: `base-direct:${transactionHash}`,
        paymentTransactionHash: transactionHash,
        receivedAmount: BigInt(20_000),
      }),
    "Payment transaction has already been used.",
  );
}

async function verifyComplimentaryLifecycle() {
  const {
    claimMintOrder,
    createComplimentaryMintOrder,
    getComplimentaryMintOrder,
    getMintOrder,
    markMintOrderSubmitted,
  } = portalOrders;
  const wallet = "0x3333333333333333333333333333333333333333";
  const publicMark = "C. Gift";
  const order = await createComplimentaryMintOrder({
    wallet,
    publicMark,
    reason: "verifier",
  });

  assert("complimentary order starts paid", order.status === "paid");
  assert("complimentary order records payment kind", order.paymentKind === "complimentary");
  assert(
    "complimentary order records creation event",
    eventTypes(order).includes("complimentary_order_created"),
  );

  const found = await getComplimentaryMintOrder(wallet, publicMark);
  assert("complimentary order lookup matches public mark", found?.orderId === order.orderId);

  const wrongMark = await getComplimentaryMintOrder(wallet, "C. Nope");
  assert("complimentary order lookup rejects wrong public mark", wrongMark === null);

  await expectError(
    "same wallet cannot receive second complimentary order",
    () =>
      createComplimentaryMintOrder({
        wallet,
        publicMark: "C. Again",
        reason: "duplicate comp",
      }),
    "This wallet already has a complimentary mint order.",
  );

  await claimMintOrder(order.orderId, wallet, publicMark);
  const submitted = await markMintOrderSubmitted({
    orderId: order.orderId,
    mintTransactionId: "engine-comp-1",
    tokenURI: "ipfs://comp-metadata",
    imageURI: "ipfs://comp-image",
  });

  assert("complimentary order can be submitted", submitted?.status === "mint_submitted");

  const persisted = await getMintOrder(order.orderId);
  assert("submitted complimentary order is persisted", persisted?.status === "mint_submitted");
}

async function main() {
  portalOrders = await import("../lib/portalOrders");

  await verifyCheckoutLifecycle();
  await verifyDirectPaymentClaimLifecycle();
  await verifyComplimentaryLifecycle();

  const failed = checks.filter((check) => !check.passed);

  if (failed.length > 0) {
    console.error(`\n${failed.length} order lifecycle check(s) failed.`);
    process.exit(1);
  }

  console.log(`\n${checks.length} order lifecycle checks passed.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
