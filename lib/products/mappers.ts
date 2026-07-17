import type { ProductData } from "@/hooks/types";

import type { ProductRow, ProductSummary } from "./types";

function safeParse(value: any) {
	if (!value) return null;

	try {
		return typeof value === "string" ? JSON.parse(value) : value;
	} catch {
		return value;
	}
}

export function rowToProduct(row: ProductRow): ProductData {
	return {
		id: row.productId,
		title: row.title,
		subTitle: row.subTitle,
		description: row.description,
		specifications: JSON.parse(row.specifications),
		appData: row.appData,
		packaging: JSON.parse(row.packaging),
		SBU: row.sbu,
		industrial: row.industrial,
		documentation: row.documentation,
		alternatives: JSON.parse(row.alternatives),
		related: JSON.parse(row.related),
		MSDS: safeParse(row.MSDS),
	};
}

export function rowToSummary(
	row: Pick<ProductRow, "code" | "title" | "subTitle">,
): ProductSummary {
	return {
		code: row.code,
		title: row.title,
		subTitle: row.subTitle,
	};
}

export function rawToProduct(
	code: string,
	raw: Record<string, unknown>,
	category: string | null,
): ProductRow {
	return {
		code,
		productId: Number(raw.id ?? 0),
		title: String(raw.title ?? ""),
		subTitle: String(raw.subTitle ?? ""),
		description: String(raw.description ?? ""),
		MSDS: String(raw.MSDS ?? ""),
		appData: String(raw.appData ?? ""),
		sbu: String(raw.SBU ?? ""),
		industrial: String(raw.industrial ?? ""),
		documentation: String(raw.documentation ?? ""),
		specifications: JSON.stringify(raw.specifications ?? []),
		packaging: JSON.stringify(raw.packaging ?? []),
		alternatives: JSON.stringify(raw.alternatives ?? []),
		related: JSON.stringify(raw.related ?? []),
		category,
	};
}
