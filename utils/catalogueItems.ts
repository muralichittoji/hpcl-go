export const countCatalogueItems = (node: any): number => {
	if (node == null) return 0;
	if (typeof node === "string") return 1;
	if (Array.isArray(node)) {
		return node.reduce((sum, child) => sum + countCatalogueItems(child), 0);
	}
	if (typeof node === "object") {
		if (Array.isArray(node.value)) return countCatalogueItems(node.value);
		if (typeof node.value === "string") return 1;
		if (node.label) return 1;
	}
	return 0;
};

export type CatalogueLeaf = {
	label: string;
	value: string;
	category: string;
};

export const flattenCatalogueItems = (
	node: any,
	category = "",
): CatalogueLeaf[] => {
	if (node == null) return [];
	if (typeof node === "string") {
		const value = node.trim();
		if (!value) return [];
		return [{ label: value, value, category }];
	}
	if (Array.isArray(node)) {
		return node.flatMap((child) => flattenCatalogueItems(child, category));
	}
	if (typeof node === "object") {
		const nextCategory =
			category || (typeof node.label === "string" ? node.label : "");
		if (Array.isArray(node.value)) {
			return flattenCatalogueItems(node.value, nextCategory);
		}
		if (typeof node.value === "string" && node.value.trim()) {
			return [
				{
					label: node.label ?? node.value,
					value: node.value,
					category: nextCategory,
				},
			];
		}
	}
	return [];
};
