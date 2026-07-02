export interface ParsedResponse {
	response: string;
	app_product_code?: string | null;
	[key: string]: any;
}

export const safeParse = (text: string): ParsedResponse => {
	try {
		const parsed = JSON.parse(text);

		// Azure sometimes returns JSON encoded as a string
		if (typeof parsed === "string") {
			try {
				return JSON.parse(parsed);
			} catch {
				return {
					response: parsed,
				};
			}
		}

		return parsed;
	} catch {
		// Plain text response
		return {
			response: text,
		};
	}
};
