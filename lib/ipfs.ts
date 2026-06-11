const DEFAULT_IPFS_GATEWAY_BASE = "https://gateway.pinata.cloud/ipfs/";
const FALLBACK_IPFS_GATEWAY_BASES = ["https://ipfs.io/ipfs/"];

function normalizeGatewayBase(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

export function ipfsCidFromUri(uri?: string) {
  if (!uri?.startsWith("ipfs://")) {
    return undefined;
  }

  return uri.slice("ipfs://".length);
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
