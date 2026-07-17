import axios from "axios";

export const isAbortError = (error: unknown) => {
	if (axios.isCancel(error)) return true;

	const err = error as { code?: string; name?: string };
	return err.code === "ERR_CANCELED" || err.name === "CanceledError";
};

export const getApiErrorMessage = (
	error: unknown,
	isOnline = true,
): string => {
	if (isAbortError(error)) {
		return "Search stopped by user.";
	}

	const err = error as {
		message?: string;
		code?: string;
		response?: { status?: number };
	};

	if (
		!isOnline ||
		err.code === "ERR_NETWORK" ||
		err.message === "Network Error"
	) {
		return "No internet connection. Check your network and try again.";
	}

	if (err.message?.includes("API Error:")) {
		return "Backend returned an error. Please try again.";
	}

	if (err.message?.includes("timeout") || err.code === "ECONNABORTED") {
		return "Request timed out. Please check your connection and try again.";
	}

	if (err.message?.includes("Invalid API response")) {
		return "Received invalid response from server. Please try again.";
	}

	const status = err.response?.status;

	switch (status) {
		case 401:
			return "Your session has expired. Please sign in again.";
		case 403:
			return "Access denied (403). The server blocked this request. Check your network or VPN, then try again.";
		case 404:
			return "Service not found. Please try again later.";
		case 500:
			return "Server error (500). The backend encountered a problem. Please try again in a moment.";
		case 502:
			return "Server is temporarily unavailable (502). Please try again in a moment.";
		case 503:
			return "Service is temporarily unavailable (503). Please try again in a moment.";
		case 504:
			return "Server took too long to respond (504). Please try again.";
		default:
			if (status && status >= 500) {
				return `Server error (${status}). Please try again later.`;
			}

			if (status && status >= 400) {
				return `Request failed (${status}). Please try again.`;
			}

			return "Failed to get answer. Please try again.";
	}
};
