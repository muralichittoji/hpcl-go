import type * as SQLite from "expo-sqlite";

import DataAviation from "@/constants/Data/data-aviation.json";
import DataIndustrial from "@/constants/Data/data-industrial-fules.json";
import DataLpg from "@/constants/Data/data-lpg.json";
import DataLubricants from "@/constants/Data/data-lubricants.json";
import DataMotorFuels from "@/constants/Data/data-motor-fuels.json";
import DataNaturalGas from "@/constants/Data/data-natural-gas.json";
import DataPetchem from "@/constants/Data/data-petchem.json";
import DataRDProducts from "@/constants/Data/data-rd-products.json";
import newDevData from "@/constants/newDevData.json";

import { rawToProduct } from "./mappers";
import type { ProductRow } from "./types";

const PRODUCTS_SEED_VERSION = "1";

const CATEGORY_SOURCES = [
	{ category: "motor-fuels", data: DataMotorFuels },
	{ category: "lpg", data: DataLpg },
	{ category: "natural-gas", data: DataNaturalGas },
	{ category: "petchem", data: DataPetchem },
	{ category: "rd-products", data: DataRDProducts },
	{ category: "lubricants", data: DataLubricants },
	{ category: "aviation", data: DataAviation },
	{ category: "industrial", data: DataIndustrial },
] as const;

function insertProduct(db: SQLite.SQLiteDatabase, row: ProductRow) {
	db.runSync(
		`
		INSERT OR REPLACE INTO products (
			code,
			productId,
			title,
			subTitle,
			description,
			msds,
			appData,
			sbu,
			industrial,
			documentation,
			specifications,
			packaging,
			alternatives,
			related,
			category
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`,
		[
			row.code,
			row.productId,
			row.title,
			row.subTitle,
			row.description,
			row.msds,
			row.appData,
			row.sbu,
			row.industrial,
			row.documentation,
			row.specifications,
			row.packaging,
			row.alternatives,
			row.related,
			row.category,
		],
	);
}

export function seedProductsIfNeeded(db: SQLite.SQLiteDatabase) {
	const current = db.getFirstSync<{ value: string }>(
		`SELECT value FROM app_meta WHERE key = 'products_seed_version'`,
	);

	if (current?.value === PRODUCTS_SEED_VERSION) {
		return;
	}

	db.execSync("BEGIN");

	try {
		db.runSync(`DELETE FROM products`);

		const seededCodes = new Set<string>();

		for (const source of CATEGORY_SOURCES) {
			for (const [code, raw] of Object.entries(source.data)) {
				insertProduct(
					db,
					rawToProduct(code, raw as Record<string, unknown>, source.category),
				);
				seededCodes.add(code);
			}
		}

		for (const [code, raw] of Object.entries(newDevData)) {
			if (seededCodes.has(code)) continue;

			insertProduct(
				db,
				rawToProduct(code, raw as Record<string, unknown>, null),
			);
		}

		db.runSync(
			`
			INSERT OR REPLACE INTO app_meta (key, value)
			VALUES ('products_seed_version', ?)
			`,
			[PRODUCTS_SEED_VERSION],
		);

		db.execSync("COMMIT");
	} catch (error) {
		db.execSync("ROLLBACK");
		throw error;
	}
}
