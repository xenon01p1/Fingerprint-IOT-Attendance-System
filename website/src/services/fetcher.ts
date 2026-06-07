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
    let message = 'Something went wrong';

    try {
      const errorBody = await response.json();
      message = errorBody?.message || message;
    } catch {
      // Keep the default message when the server does not return JSON.
    }

    throw new Error(message);
  }

  return response.json();
}
