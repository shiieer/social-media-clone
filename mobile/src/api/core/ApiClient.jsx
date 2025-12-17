// src/api/core/ApiClient.jsx
import { API_URL } from "@env";
import { handleUnauthorized } from "./apiInterceptor";

class ApiClient {
	constructor(baseURL) {
		this.baseURL = baseURL || `${API_URL}/auth`;
	}

	async request(endpoint, options = {}) {
		const url = `${this.baseURL}${endpoint}`;

		// Debug: Log URL being used (remove in production)
		console.log(`[API] Requesting: ${url}`);
		if (!API_URL || API_URL === undefined) {
			console.error("[API ERROR] API_URL is not defined! Make sure .env file exists and contains API_URL");
		}

		// Create base config with method
		const config = {
			method: options.method || "GET",
			headers: {
				// Default headers
				"Content-Type": "application/json",
				Accept: "application/json",
				// Merge with custom headers
				...options.headers,
			},
		};

		// Add body if it exists (for POST, PUT requests)
		if (options.body) {
			// If it's FormData, don't stringify and let the browser set Content-Type
			if (options.body instanceof FormData) {
				config.body = options.body;
				// Remove Content-Type for FormData to let browser set it automatically
				delete config.headers["Content-Type"];
			} else {
				config.body = JSON.stringify(options.body);
			}
		}

		try {
			const response = await fetch(url, config);

			let data;
			try {
				data = await response.json();
			} catch (parseError) {
				console.error("Failed to parse JSON response:", parseError);
				data = { detail: "Invalid JSON response" };
			}

			if (!response.ok) {
				// Handle unauthorized errors (401/403) - token expired
				if (response.status === 401 || response.status === 403) {
					// Call global unauthorized handler
					handleUnauthorized(response.status);
				}

				return {
					success: false,
					error: this.getErrorMessage(data),
					data,
					status: response.status,
				};
			}

			return {
				success: true,
				data,
				status: response.status,
			};
		} catch (error) {
			console.error(`[API ERROR] Request failed: ${endpoint}`, error);
			console.error(`[API ERROR] URL used: ${url}`);
			console.error(`[API ERROR] API_URL: ${API_URL || 'NOT DEFINED'}`);
			return {
				success: false,
				error: `Network error: ${error.message}. Make sure backend is running and API_URL is correct in .env file`,
				status: 0,
			};
		}
	}

	getErrorMessage(responseData) {
		if (typeof responseData === "string") {
			return responseData;
		}

		if (responseData.detail) {
			return Array.isArray(responseData.detail)
				? responseData.detail[0]
				: responseData.detail;
		}

		if (typeof responseData === "object") {
			const fieldErrors = Object.values(responseData).flat();
			return fieldErrors[0] || "Request failed";
		}

		return "Request failed";
	}

	async get(endpoint, headers = {}) {
		return this.request(endpoint, { method: "GET", headers });
	}

	async post(endpoint, data, headers = {}) {
		return this.request(endpoint, {
			method: "POST",
			body: data,
			headers,
		});
	}

	async put(endpoint, data, headers = {}) {
		return this.request(endpoint, {
			method: "PUT",
			body: data,
			headers,
		});
	}

	async delete(endpoint, headers = {}) {
		return this.request(endpoint, { method: "DELETE", headers });
	}
}

export default ApiClient;

