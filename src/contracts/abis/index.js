export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address, uint256) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export const PRESALE_ABI = [
  "function buyTokens(uint256) nonpayable",
  "function totalRaised() view returns (uint256)",
  "function hardCap() view returns (uint256)",
  "function rate() view returns (uint256)",
  "function contributions(address) view returns (uint256)",
  "function paymentToken() view returns (address)",
  "event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost)"
];

export const PAYMENT_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

export const AIRDROP_ABI = [
  "function claim()",
  "function isEligible(address) view returns (bool)",
  "function hasClaimed(address) view returns (bool)",
  "function AIRDROP_AMOUNT() view returns (uint256)",
  "event TokensClaimed(address indexed claimer, uint256 amount)"
];
