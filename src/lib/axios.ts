import axios, { AxiosError } from "axios";

const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

export const apiClient = axios.create({
	baseURL: configuredBaseUrl ? configuredBaseUrl.replace(/\/$/, "") : undefined,
	withCredentials: true,
	headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export function getApiErrorMessage(error: unknown, fallback = "Request failed.") {
	if (axios.isAxiosError(error)) {
		const body = error.response?.data as
			| { detail?: string | Array<{ msg?: string }> }
			| undefined;
		if (typeof body?.detail === "string") return body.detail;
		if (Array.isArray(body?.detail)) {
			const messages = body.detail.map((item) => item.msg).filter(Boolean);
			if (messages.length) return messages.join(" ");
		}
		if (error.response?.status === 401) return "Please log in to continue.";
		if (error.response?.status === 403) return "You do not have permission to do that.";
		if (!error.response) return "Unable to reach the LIFESOURCE API. Check your connection and API URL.";
		return error.message || fallback;
	}
	return error instanceof Error ? error.message : fallback;
}

apiClient.interceptors.request.use((config) => {
	if (!configuredBaseUrl) {
		throw new AxiosError(
			"NEXT_PUBLIC_API_BASE_URL is not configured. Set it to the LIFESOURCE API origin.",
			"ERR_BAD_URL",
		);
	}
	return config;
});
