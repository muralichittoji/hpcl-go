import axios from "axios";
import { router } from "expo-router";
import { getToken, removeToken } from "./authStorage";

const api = axios.create({
	baseURL: "https://gpt.hpcl.co.in/backend/hpcl-vigilance",
	timeout: 30000,
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
		console.log(config.timeout);
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

		if (status === 401) {
			await removeToken();

			// ✅ Use correct Expo Router path here
			router.replace("/(auth)/login" as any);
		}

		return Promise.reject(error);
	},
);

export default api;
