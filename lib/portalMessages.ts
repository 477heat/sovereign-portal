export function buildMintOrderStatusMessage({
  wallet,
  orderId,
}: {
  wallet: string;
  orderId: string;
}) {
  return [
    "Sovereign Portal mint order status",
    `Wallet: ${wallet.toLowerCase()}`,
    `Order: ${orderId}`,
  ].join("\n");
}
