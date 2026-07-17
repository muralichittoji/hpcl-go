import axios from "axios";
import { router } from "expo-router";
import { getToken, removeToken } from "./authStorage";

const api = axios.create({
	baseURL: "https://gpt.hpcl.co.in/backend/hpcl-vigilance",
	timeout: 90000,
	headers: {
		"Content-Type": "application/json",
	},
});

// ============================
// REQUEST INTERCEPTOR
// ============================
	api.interceptors.request.use(
	async (config) => {
		const token = await getToken();

		if (token) {
			// ✅ ensure headers exists
			config.headers = config.headers ?? {};
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

// ============================
// RESPONSE INTERCEPTOR
// ============================
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const status = error?.response?.status;
		const contentType = error?.response?.headers?.["content-type"];

		// Log detailed error information for debugging
		console.log("API Error Status:", status);
		console.log("Content-Type:", contentType);

		if (contentType?.includes("text/html")) {
			console.log(
				"HTML Response (likely error page):",
				error?.response?.data?.substring(0, 200),
			);
		}

		if (status === 401) {
			await removeToken();

			// ✅ Use correct Expo Router path here
			router.replace("/(auth)/login" as any);
		}

		if (status === 502) {
			console.log("502 Bad Gateway - Backend server may be down");
		}

		return Promise.reject(error);
	},
);

export default api;
