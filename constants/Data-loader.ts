import { getProductsByCategory } from "@/lib/products";

export const loadData = async (category: string) => {
	return getProductsByCategory(category);
};
