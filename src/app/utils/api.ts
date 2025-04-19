type ApiResponse = {
  data: any | null;
  error: string | null;
};

async function fetchWithBasicAuth(url: string): Promise<ApiResponse> {
  const username = process.env.BACKEND_USERNAME;
  const password = process.env.BACKEND_PASSWORD;

  if (!username || !password) {
    console.log(username)
    console.log(password)
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