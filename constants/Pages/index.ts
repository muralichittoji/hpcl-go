import pageAviation from "./page-aviation.json";
import pageIndustrialFules from "./page-industrial-fules.json";
import pageLpg from "./page-lpg.json";
import pageLubricants from "./page-lubricants.json";
import pageMotorFuel from "./page-motor-fuels.json";
import pageNaturalGas from "./page-natural-gas.json";
import pagePetchem from "./page-petchem.json";
import pageQuickHelp from "./page-quickhelp.json";
import pageRdProducts from "./page-rd-products.json";

export default {
	homeScreen: [
		pageMotorFuel,
		pageLpg,
		pageAviation,
		pageNaturalGas,
		pageIndustrialFules,
		pageLubricants,
		pagePetchem,
		pageRdProducts,
	],
	quickHelp: pageQuickHelp.quickHelp,
};
