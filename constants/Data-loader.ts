export const loadData = async (category: string) => {
	switch (category) {
		case "motor-fuels":
			return (await import("./Data/data-motor-fuels.json")).default;

		case "lpg":
			return (await import("./Data/data-lpg.json")).default;

		case "lubricants":
			return (await import("./Data/data-lubricants.json")).default;

		case "industrial":
			return (await import("./Data/data-industrial-fules.json")).default;

		case "aviation":
			return (await import("./Data/data-aviation.json")).default;

		default:
			return {};
	}
};
