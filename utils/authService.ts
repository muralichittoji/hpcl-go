import { saveToken } from "@/utils/authStorage";
import api from "./apiClient";

type LoginPayload = {
	email: string;
	password: string;
};

type GetDataPayload = {
	question: string;
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

export const getAnswer = async ({ question }: GetDataPayload) => {
	const res = await api.post("/query-answer-agentic-workflow", {
		queries: [
			{
				query: question,
			},
		],
		agentic_workflow_name: "Product_App",
	});
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
