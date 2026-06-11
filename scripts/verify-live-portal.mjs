import { Contract, JsonRpcProvider, Wallet } from "ethers";

const baseUrl = (
  process.env.PORTAL_VERIFY_BASE_URL || "https://soulmaster.xyz"
).replace(/\/$/, "");
const rpcUrl =
  process.env.PORTAL_VERIFY_RPC_URL || "https://base-rpc.publicnode.com";
const contractAddress =
  process.env.PORTAL_VERIFY_CONTRACT_ADDRESS ||
  "0x2df9151c4e32082a05c686bd3092180134d17deb";
const easWallet =
  process.env.PORTAL_VERIFY_EAS_WALLET ||
  "0x53824EBf95007cE59e185443e74c4086482daed5";
const recoveryWallet = process.env.PORTAL_VERIFY_RECOVERY_WALLET;
const recoverySignature = process.env.PORTAL_VERIFY_RECOVERY_SIGNATURE;
const requireRealRecovery =
  process.env.PORTAL_VERIFY_REQUIRE_SIGNED_RECOVERY === "1";
const contractTermsCid = "QmX7XvSPD1QJbv88Y8XSQKde5upKCHbhDbFgNJhgHLjwtM";
const verifiedTokenIds = [0, 1, 2];

const contractAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function mintPrice() view returns (uint256)",
  "function burnFee() view returns (uint256)",
  "function burnActive() view returns (bool)",
  "function isRevealed() view returns (bool)",
  "function paused() view returns (bool)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function originalMinter(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function royaltyInfo(uint256 tokenId, uint256 salePrice) view returns (address, uint256)",
];

const checks = [];

function record(name, passed, detail = "") {
  checks.push({ name, passed, detail });
  const marker = passed ? "PASS" : "FAIL";
  console.log(`${marker} ${name}${detail ? ` - ${detail}` : ""}`);
}

function assert(name, condition, detail = "") {
  record(name, Boolean(condition), detail);
}

function info(message) {
  console.log(`INFO ${message}`);
}

async function fetchText(pathOrUrl, init) {
  const url = pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${baseUrl}${pathOrUrl}`;
  const response = await fetch(url, init);
  const text = await response.text();

  return { response, text };
}

async function fetchJson(pathOrUrl, init) {
  const { response, text } = await fetchText(pathOrUrl, init);
  let json = null;

  try {
    json = JSON.parse(text);
  } catch {
    // The status assertion below will report enough context for this verifier.
  }

  return { response, json, text };
}

function ipfsGatewayUrl(uri) {
  return ipfsGatewayUrls(uri)[0] ?? null;
}

function ipfsGatewayUrls(uri) {
  const cid = ipfsCid(uri);

  if (!cid) {
    return [];
  }

  return [
    `https://ipfs.io/ipfs/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://dweb.link/ipfs/${cid}`,
  ];
}

function ipfsCid(uri) {
  return uri?.startsWith("ipfs://") ? uri.slice("ipfs://".length) : null;
}

async function fetchIpfsJson(uri) {
  const attempts = [];

  for (const url of ipfsGatewayUrls(uri)) {
    try {
      const result = await fetchJson(url);
      attempts.push(`${url} -> ${result.response.status}`);

      if (result.response.ok && result.json && typeof result.json === "object") {
        return { ...result, url, attempts };
      }
    } catch (error) {
      attempts.push(`${url} -> ${error.message}`);
    }
  }

  return { response: null, json: null, text: "", url: null, attempts };
}

async function fetchIpfsHead(uri) {
  const attempts = [];

  for (const url of ipfsGatewayUrls(uri)) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      attempts.push(`${url} -> ${response.status}`);

      if (response.ok) {
        return { response, url, attempts };
      }
    } catch (error) {
      attempts.push(`${url} -> ${error.message}`);
    }
  }

  return { response: null, url: null, attempts };
}

function recoveryMessage(wallet) {
  return [
    "Sovereign Portal mint receipt recovery",
    `Wallet: ${wallet.toLowerCase()}`,
  ].join("\n");
}

async function verifyPortalSurface() {
  const portal = await fetchText("/portal");
  const dplMatch = portal.text.match(/data-dpl-id="([^"]+)"/);

  assert("/portal returns 200", portal.response.status === 200);
  assert("portal exposes Vercel deployment id", Boolean(dplMatch?.[1]), dplMatch?.[1]);
  assert(
    "portal includes receipt recovery UI",
    portal.text.includes("Receipt Recovery") &&
      portal.text.includes("Recover Receipt"),
  );

  const settings = await fetchJson("/api/portal-settings");
  assert("/api/portal-settings returns 200", settings.response.status === 200);
  assert(
    "checkout remains enabled",
    settings.json?.checkoutEnabled === true,
    JSON.stringify(settings.json),
  );
  assert(
    "payment amount is active runtime setting",
    typeof settings.json?.paymentAmount === "string" &&
      settings.json.paymentAmount.length > 0,
    settings.json?.paymentAmount,
  );

  const recovery = await fetchJson("/api/mint-order/recover");
  assert(
    "unsigned receipt recovery rejects",
    recovery.response.status === 401 &&
      recovery.json?.message ===
        "Wallet signature is required to recover a mint receipt.",
  );

  const admin = await fetch(`${baseUrl}/api/admin/mint-orders`, {
    method: "HEAD",
  });
  assert("admin mint-order lookup stays protected", admin.status === 401);
  assert(
    "admin route sends Basic Auth challenge",
    admin.headers.get("www-authenticate")?.includes("Sovereign Portal Admin"),
  );

  const badOrder = await fetchJson("/api/mint-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  assert("invalid checkout order rejects", badOrder.response.status === 400);

  const badMint = await fetchJson("/api/mint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  assert("invalid mint request rejects", badMint.response.status === 400);
}

async function verifyContract() {
  const provider = new JsonRpcProvider(rpcUrl, 8453);
  const contract = new Contract(contractAddress, contractAbi, provider);
  const [name, symbol, mintPrice, burnFee, burnActive, isRevealed, paused] =
    await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.mintPrice(),
      contract.burnFee(),
      contract.burnActive(),
      contract.isRevealed(),
      contract.paused(),
    ]);

  assert("contract name is Soul Deed", name === "Soul Deed", name);
  assert("contract symbol is SLDD", symbol === "SLDD", symbol);
  assert("mint price is 0.00001 ETH", mintPrice === 10_000_000_000_000n);
  assert("burn fee is 0.005 ETH", burnFee === 5_000_000_000_000_000n);
  assert("burn remains active", burnActive === true);
  assert("metadata remains revealed", isRevealed === true);
  assert("contract is not paused", paused === false);

  for (const tokenId of verifiedTokenIds) {
    const [owner, originalMinter, tokenURI, royalty] = await Promise.all([
      contract.ownerOf(tokenId),
      contract.originalMinter(tokenId),
      contract.tokenURI(tokenId),
      contract.royaltyInfo(tokenId, 10n ** 18n),
    ]);

    assert(`token ${tokenId} owner exists`, /^0x[a-fA-F0-9]{40}$/.test(owner), owner);
    assert(
      `token ${tokenId} original minter matches owner`,
      originalMinter.toLowerCase() === owner.toLowerCase(),
      originalMinter,
    );
    assert(`token ${tokenId} tokenURI is IPFS`, tokenURI.startsWith("ipfs://"), tokenURI);
    assert(
      `token ${tokenId} royalty is 7 percent`,
      royalty[1] === 70_000_000_000_000_000n,
      royalty[1].toString(),
    );

    await verifyMetadata(tokenId, tokenURI);
  }
}

async function verifyMetadata(tokenId, tokenURI) {
  const metadataUrl = ipfsGatewayUrl(tokenURI);
  assert(`token ${tokenId} metadata has gateway URL`, Boolean(metadataUrl), metadataUrl);

  const metadataResult = await fetchIpfsJson(tokenURI);
  const metadata = metadataResult.json ?? {};
  const attrs = Array.isArray(metadata.attributes) ? metadata.attributes : [];
  const imageResult = metadata.image
    ? await fetchIpfsHead(metadata.image)
    : { response: null, url: null, attempts: [] };

  assert(
    `token ${tokenId} metadata returns JSON`,
    Boolean(metadataResult.response?.ok && metadataResult.json),
    metadataResult.url ?? metadataResult.attempts.join(" | "),
  );
  assert(
    `token ${tokenId} metadata name is current title`,
    metadata.name === "Certificate of Title for Spiritual Ownership",
    metadata.name,
  );
  assert(
    `token ${tokenId} metadata includes Genesis Access`,
    attrs.some(
      (attr) => attr.trait_type === "*Token Type" && attr.value === "Genesis Access",
    ),
  );
  assert(`token ${tokenId} metadata has 20 attributes`, attrs.length === 20, String(attrs.length));
  assert(
    `token ${tokenId} stats remain ordered`,
    attrs.slice(5, 8).map((attr) => attr.trait_type).join(",") ===
      "01 Presence,02 Wealth,03 Fortitude",
  );
  assert(
    `token ${tokenId} metadata links contract terms`,
    JSON.stringify(metadata).includes(contractTermsCid),
  );
  assert(
    `token ${tokenId} image returns 200`,
    imageResult.response?.status === 200,
    imageResult.url ?? imageResult.attempts.join(" | "),
  );
}

async function verifyEas() {
  const { response, json } = await fetchJson(
    `/api/attestation?address=${encodeURIComponent(easWallet)}`,
  );

  assert("known minted wallet EAS lookup returns 200", response.status === 200);
  assert("known minted wallet is EAS eligible", json?.eligible === true);
  assert("EAS lookup is live mode", json?.mode === "live");
}

async function verifyRecoverySignatureHandling() {
  const syntheticWallet = Wallet.createRandom();
  const syntheticSignature = await syntheticWallet.signMessage(
    recoveryMessage(syntheticWallet.address),
  );
  const synthetic = await fetchJson(
    `/api/mint-order/recover?wallet=${encodeURIComponent(
      syntheticWallet.address,
    )}&signature=${encodeURIComponent(syntheticSignature)}`,
  );

  assert(
    "signed receipt recovery verifies wallet signatures",
    synthetic.response.status === 404 &&
      synthetic.json?.message === "No mint order was found for this wallet.",
    synthetic.json?.message,
  );

  if (recoveryWallet && recoverySignature) {
    const realRecovery = await fetchJson(
      `/api/mint-order/recover?wallet=${encodeURIComponent(
        recoveryWallet,
      )}&signature=${encodeURIComponent(recoverySignature)}`,
    );

    assert(
      "real minted-wallet receipt recovery returns submitted receipt",
      realRecovery.response.status === 200 &&
        realRecovery.json?.receipt?.status === "submitted" &&
        realRecovery.json?.receipt?.tokenURI?.startsWith("ipfs://"),
      realRecovery.text,
    );
    return;
  }

  if (requireRealRecovery) {
    record(
      "real minted-wallet receipt recovery env vars are provided",
      false,
      "Set PORTAL_VERIFY_RECOVERY_WALLET and PORTAL_VERIFY_RECOVERY_SIGNATURE.",
    );
    return;
  }

  info(
    "Real minted-wallet receipt recovery not checked. Set PORTAL_VERIFY_RECOVERY_WALLET and PORTAL_VERIFY_RECOVERY_SIGNATURE to prove it.",
  );
}

async function main() {
  console.log(`Verifying live portal: ${baseUrl}`);
  console.log(`Verifying contract: ${contractAddress}`);
  await verifyPortalSurface();
  await verifyContract();
  await verifyEas();
  await verifyRecoverySignatureHandling();

  const failed = checks.filter((check) => !check.passed);

  if (failed.length > 0) {
    console.error(`\n${failed.length} verification check(s) failed.`);
    process.exit(1);
  }

  console.log(`\n${checks.length} verification checks passed.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
