import { saveToken } from "@/utils/authStorage";
import axios from "axios";
import api from "./apiClient";

type LoginPayload = {
	email: string;
	password: string;
};

type GetDataPayload = {
	question: string;
	signal?: AbortSignal;
};

export const loginUser = async ({ email, password }: LoginPayload) => {
	const res = await api.post("/auth/get_token", {
		email,
		password,
	});

	const token = res.data?.token;

	if (!token) {
		throw new Error("Token not found in response");
	}

	await saveToken(token);

	return res.data;
};

export const AdloginUser = async ({ email, password }: LoginPayload) => {
	console.log("AD LOGIN RAW RESPONSE:", {
		userName: "hpcl\\" + email,
		password,
	});
	const res = await axios.post(
		"http://10.90.22.145:8081/mlapi/login",
		{
			userName: email,
			password,
		},
		{
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			timeout: 90000,
		},
	);
	console.log("AD LOGIN RESPONSE:", res);

	return res.data;
};

export const getAnswer = async ({ question, signal }: GetDataPayload) => {
	const res = await api.post(
		"/query-answer-agentic-workflow",
		{
			queries: [
				{
					query: question,
				},
			],
			agentic_workflow_name: "Product_App",
		},
		{ signal },
	);

	// Validate response structure
	if (!res.data || !res.data.results || !Array.isArray(res.data.results)) {
		console.log("Invalid response structure:", res.data);
		throw new Error("Invalid API response structure");
	}

	// Check if answer is an error message (starts with "E", "Error", "Failed", etc.)
	const answer = res.data.results[0]?.answer;
	if (
		typeof answer === "string" &&
		/^(error|error:|e\s|failed|exception)/i.test(answer.trim())
	) {
		console.log("API returned error message:", answer.substring(0, 200));
		throw new Error(`API Error: ${answer.substring(0, 100)}`);
	}

	return res.data;
};

export const imageUpload = async (formData: FormData) => {
	try {
		const res = await api.post("/upload-files-to-s3", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			timeout: 60000, // 60 seconds timeout for uploads
		});

		return res.data;
	} catch (error: any) {
		console.log("UPLOAD ERROR DATA:", error.response?.data);
		console.log("UPLOAD ERROR STATUS:", error.response?.status);
		throw error;
	}
};
