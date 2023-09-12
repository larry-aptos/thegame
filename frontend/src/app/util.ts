export const DEVNET_FULLNODE = "https://fullnode.devnet.aptoslabs.com";

export const truncateAddress = (address: string | undefined) => {
  if (!address) return;
  if (address.length < 5) return address;
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
};

export function fetchAPI(endPoint: string) {
  const url = `http://localhost:8000/${endPoint}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((responseData) => {})
    .catch((error) => {});
}
