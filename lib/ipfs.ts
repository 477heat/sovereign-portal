const DEFAULT_IPFS_GATEWAY_BASE = "https://gateway.pinata.cloud/ipfs/";
const FALLBACK_IPFS_GATEWAY_BASES = [
  "https://ipfs.io/ipfs/",
  "https://dweb.link/ipfs/",
];
const CID_PATTERN = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|baf[a-z0-9]{20,})$/i;

function normalizeGatewayBase(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

export function ipfsCidFromUri(uri?: string) {
  const value = uri?.trim();

  if (!value) {
    return undefined;
  }

  if (value.startsWith("ipfs://")) {
    return value.slice("ipfs://".length).replace(/^ipfs\//, "");
  }

  if (CID_PATTERN.test(value)) {
    return value;
  }

  return undefined;
}

export function ipfsGatewayUrl(uri?: string) {
  if (!uri) {
    return undefined;
  }

  if (uri.startsWith("https://")) {
    return uri;
  }

  const cid = ipfsCidFromUri(uri);

  if (!cid) {
    return undefined;
  }

  return `${DEFAULT_IPFS_GATEWAY_BASE}${cid}`;
}

export function ipfsGatewayUrls(uri?: string, extraUrl?: string) {
  const urls = new Set<string>();
  const cid = ipfsCidFromUri(uri);

  if (cid) {
    urls.add(`${DEFAULT_IPFS_GATEWAY_BASE}${cid}`);

    for (const gatewayBase of FALLBACK_IPFS_GATEWAY_BASES) {
      urls.add(`${normalizeGatewayBase(gatewayBase)}${cid}`);
    }
  } else if (uri?.startsWith("https://")) {
    urls.add(uri);
  }

  if (extraUrl) {
    urls.add(extraUrl);
  }

  return Array.from(urls);
}
