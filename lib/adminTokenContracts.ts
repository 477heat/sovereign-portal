import { SOUL_DEED_CONTRACT_ADDRESS } from "@/lib/soulContract";

export const CUSTOM_ADMIN_TOKEN_CONTRACT_ID = "custom";
export const DEFAULT_ADMIN_TOKEN_CONTRACT_ID = "soul-deed";

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export type AdminTokenContract = {
  id: string;
  name: string;
  symbol: string;
  address: string;
  standard: "erc721-compatible";
  description: string;
};

export const ADMIN_TOKEN_CONTRACTS: AdminTokenContract[] = [
  {
    id: DEFAULT_ADMIN_TOKEN_CONTRACT_ID,
    name: "Soul Deed",
    symbol: "SLDD",
    address: SOUL_DEED_CONTRACT_ADDRESS,
    standard: "erc721-compatible",
    description: "Live Genesis Access ERC-721 contract.",
  },
];

export function isContractAddress(value: string) {
  return ADDRESS_PATTERN.test(value.trim());
}

export function getAdminTokenContractById(id: string) {
  return ADMIN_TOKEN_CONTRACTS.find((contract) => contract.id === id) ?? null;
}

export function createCustomAdminTokenContract(
  address: string,
): AdminTokenContract | null {
  const normalizedAddress = address.trim();

  if (!isContractAddress(normalizedAddress)) {
    return null;
  }

  return {
    id: CUSTOM_ADMIN_TOKEN_CONTRACT_ID,
    name: "Custom Token Contract",
    symbol: "CUSTOM",
    address: normalizedAddress,
    standard: "erc721-compatible",
    description:
      "Owner-controlled ERC-721-compatible contract using the Soul Deed admin shape.",
  };
}
