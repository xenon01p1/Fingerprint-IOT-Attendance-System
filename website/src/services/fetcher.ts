const BASE_URL = 'http://localhost:8000';

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function fetcher<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options || {};

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },

    ...fetchOptions,
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return response.json();
}