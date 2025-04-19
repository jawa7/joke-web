type ApiResponse = {
  data: Joke | null;
  error: string | null;
};

type Joke = {
  id: string,
  setup: string,
  punchline: string,
}

async function fetchWithBasicAuth(url: string): Promise<ApiResponse> {
  const username = process.env.BACKEND_USERNAME;
  const password = process.env.BACKEND_PASSWORD;

  if (!username || !password) {
    return {
      data: null,
      error: "Username or password not found in environment variables.",
    };
  }

  const encodedCredentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });

    if (!response.ok) {
      return {
        data: null,
        error: `Request failed with status: ${response.status}`,
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message || "An unknown error occurred.",
    };
  }
}

export { fetchWithBasicAuth };