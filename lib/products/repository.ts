import type { ProductData } from "@/hooks/types";
import { getDb } from "@/lib/database";

import { rowToProduct, rowToSummary } from "./mappers";
import type {
	PaginatedProducts,
	ProductRow,
	ProductSummary,
} from "./types";

export type { ProductData } from "@/hooks/types";
export type { PaginatedProducts, ProductSummary } from "./types";

export const PRODUCT_PAGE_SIZE = 30;

function ensureProductsReady() {
	getDb();
}

function getProductRow(code: string): ProductRow | null {
	ensureProductsReady();

	return (
		getDb().getFirstSync<ProductRow>(
			`
			SELECT *
			FROM products
			WHERE code = ?
			`,
			[code],
		) ?? null
	);
}

/** Fetch a single product by code — primary lazy-load entry point. */
export function getProduct(code: string): ProductData | null {
	const row = getProductRow(code);
	return row ? rowToProduct(row) : null;
}

export function getProductTitle(code: string): string | null {
	ensureProductsReady();

	return (
		getDb().getFirstSync<{ title: string }>(
			`SELECT title FROM products WHERE code = ?`,
			[code],
		)?.title ?? null
	);
}

export function getProductSummary(code: string): ProductSummary | null {
	ensureProductsReady();

	const row = getDb().getFirstSync<Pick<ProductRow, "code" | "title" | "subTitle">>(
		`
		SELECT code, title, subTitle
		FROM products
		WHERE code = ?
		`,
		[code],
	);

	return row ? rowToSummary(row) : null;
}

export function getProductSummaries(codes: string[]): ProductSummary[] {
	if (codes.length === 0) return [];

	ensureProductsReady();

	const placeholders = codes.map(() => "?").join(", ");

	const rows = getDb().getAllSync<Pick<ProductRow, "code" | "title" | "subTitle">>(
		`
		SELECT code, title, subTitle
		FROM products
		WHERE code IN (${placeholders})
		`,
		codes,
	);

	const byCode = new Map(rows.map((row) => [row.code, rowToSummary(row)]));

	return codes
		.map((code) => byCode.get(code))
		.filter((item): item is ProductSummary => Boolean(item));
}

export function getProductsByCodes(codes: string[]): ProductData[] {
	return codes
		.map((code) => getProduct(code))
		.filter((item): item is ProductData => Boolean(item));
}

export function getProductsPage(
	offset = 0,
	limit = PRODUCT_PAGE_SIZE,
	category?: string,
): PaginatedProducts<ProductSummary> {
	ensureProductsReady();

	const db = getDb();

	if (category) {
		const total =
			db.getFirstSync<{ count: number }>(
				`SELECT COUNT(*) AS count FROM products WHERE category = ?`,
				[category],
			)?.count ?? 0;

		const items = db
			.getAllSync<Pick<ProductRow, "code" | "title" | "subTitle">>(
				`
				SELECT code, title, subTitle
				FROM products
				WHERE category = ?
				ORDER BY title ASC
				LIMIT ? OFFSET ?
				`,
				[category, limit, offset],
			)
			.map(rowToSummary);

		return {
			items,
			hasMore: offset + items.length < total,
		};
	}

	const total =
		db.getFirstSync<{ count: number }>(`SELECT COUNT(*) AS count FROM products`)
			?.count ?? 0;

	const items = db
		.getAllSync<Pick<ProductRow, "code" | "title" | "subTitle">>(
			`
			SELECT code, title, subTitle
			FROM products
			ORDER BY title ASC
			LIMIT ? OFFSET ?
			`,
			[limit, offset],
		)
		.map(rowToSummary);

	return {
		items,
		hasMore: offset + items.length < total,
	};
}

export function searchProducts(
	query: string,
	offset = 0,
	limit = PRODUCT_PAGE_SIZE,
): PaginatedProducts<ProductSummary> {
	ensureProductsReady();

	const db = getDb();
	const pattern = `%${query.trim()}%`;

	const total =
		db.getFirstSync<{ count: number }>(
			`
			SELECT COUNT(*) AS count
			FROM products
			WHERE title LIKE ?
			   OR code LIKE ?
			   OR subTitle LIKE ?
			`,
			[pattern, pattern, pattern],
		)?.count ?? 0;

	const items = db
		.getAllSync<Pick<ProductRow, "code" | "title" | "subTitle">>(
			`
			SELECT code, title, subTitle
			FROM products
			WHERE title LIKE ?
			   OR code LIKE ?
			   OR subTitle LIKE ?
			ORDER BY title ASC
			LIMIT ? OFFSET ?
			`,
			[pattern, pattern, pattern, limit, offset],
		)
		.map(rowToSummary);

	return {
		items,
		hasMore: offset + items.length < total,
	};
}

/** Returns products for a category as a code → product map. */
export function getProductsByCategory(category: string): Record<string, ProductData> {
	ensureProductsReady();

	const rows = getDb().getAllSync<ProductRow>(
		`
		SELECT *
		FROM products
		WHERE category = ?
		ORDER BY title ASC
		`,
		[category],
	);

	return Object.fromEntries(
		rows.map((row) => [row.code, rowToProduct(row)]),
	);
}

export function getProductCount(): number {
	ensureProductsReady();

	return (
		getDb().getFirstSync<{ count: number }>(`SELECT COUNT(*) AS count FROM products`)
			?.count ?? 0
	);
}
