export const http = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      ...options?.headers,
      "Content-Type": "application/json",
    },
    credentials: "include",
    ...options,
  });
  if (!response.ok) {
    throw new Error(`HTTP error!: ${(await response.json()).message}`);
  }
  const data = await response.json();
  return data;
};
