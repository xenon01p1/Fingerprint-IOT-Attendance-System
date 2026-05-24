const BASE_URL = 'http://localhost:3000';

type FetchOptions = RequestInit;

export async function fetcher<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },

    ...options,
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return response.json();
}