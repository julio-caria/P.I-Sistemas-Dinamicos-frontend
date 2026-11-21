
const API_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
}


async function apiFetch(
    endpoint: string,
    options: RequestInit = {}
) {
    const token = getToken();

    const headers = new Headers(options.headers);

    if (options.body !== undefined && options.body !== null) {
        headers.set("Content-Type", "application/json");
    }

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return response;
}

export { API_URL, apiFetch };
