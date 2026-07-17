import type { ProductData } from "@/hooks/types";

export type { ProductData };

export type ProductSummary = {
	code: string;
	title: string;
	subTitle: string;
};

export type ProductRow = {
	code: string;
	productId: number;
	title: string;
	subTitle: string;
	description: string;
	MSDS: string;
	appData: string;
	sbu: string;
	industrial: string;
	documentation: string;
	specifications: string;
	packaging: string;
	alternatives: string;
	related: string;
	category: string | null;
};

export type PaginatedProducts<T> = {
	items: T[];
	hasMore: boolean;
};
