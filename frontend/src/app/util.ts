export const TESTNET_FULLNODE = "https://fullnode.testnet.aptoslabs.com";

export const truncateAddress = (address: string | undefined) => {
  if (!address) return;
  if (address.length < 5) return address;
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
};
