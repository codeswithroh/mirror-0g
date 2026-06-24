export const MIRROR_NFT_ADDRESS = (process.env.NEXT_PUBLIC_MIRROR_CONTRACT ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const MIRROR_NFT_ABI = [
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "storageRootHash", type: "bytes32" },
      { name: "accessFee", type: "uint256" },
      { name: "metadataURI", type: "string" },
    ],
    name: "mintPersona",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "purchaseAccess",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    name: "hasAccess",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }],
    name: "personas",
    outputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "storageRootHash", type: "bytes32" },
      { name: "accessFee", type: "uint256" },
      { name: "creator", type: "address" },
      { name: "createdAt", type: "uint256" },
      { name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "creator", type: "address" }],
    name: "getCreatorPersonas",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalPersonas",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "newRootHash", type: "bytes32" },
    ],
    name: "updateStorageRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export type PersonaOnChain = {
  name: string;
  description: string;
  storageRootHash: `0x${string}`;
  accessFee: bigint;
  creator: `0x${string}`;
  createdAt: bigint;
  active: boolean;
};
