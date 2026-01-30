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
