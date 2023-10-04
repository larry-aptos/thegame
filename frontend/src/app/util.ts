export const truncateAddress = (address: string | undefined) => {
  if (!address) return;
  if (address.length < 5) return address;
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
};

export function fetchAPI(endPoint: string, payload?: any): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL || ""}/${endPoint}`;

  if (payload) {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    };
    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`,
          );
        }
        return response.json();
      })
      .catch((error) => {});
  } else {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`,
          );
        }
        return response.json();
      })
      .catch((error) => {});
  }
}
