class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export class ApiClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async handleResponse(response) {
    if (!response.ok) {
      throw new ApiError(
        response.status,
        `API request failed: ${response.statusText}`,
      );
    }

    return await response.json();
  }

  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    if (this.apiKey) {
      searchParams.append("api_key", this.apiKey);
    }

    const url = `${this.baseUrl}${endpoint}?${searchParams.toString()}`;
    const response = await fetch(url);
    return this.handleResponse(response);
  }
}
