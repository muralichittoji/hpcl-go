/**
 * @deprecated Product data now lives in SQLite. Use `@/lib/products` instead.
 *
 * Category JSON files in this folder are only used during the one-time DB seed.
 */
export {
	getProduct,
	getProductsByCategory,
	searchProducts,
} from "@/lib/products";
