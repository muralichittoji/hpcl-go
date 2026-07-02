import DataAviation from "./data-aviation.json";
import DataIndustrial from "./data-industrial-fules.json";
import DataLpg from "./data-lpg.json";
import DataLubricants from "./data-lubricants.json";
import DataMotorFuels from "./data-motor-fuels.json";
import DataNaturalGas from "./data-natural-gas.json";
import DataPetchem from "./data-petchem.json";
import DataRDProducts from "./data-rd-products.json";

const allData = {
	...DataMotorFuels,
	...DataLpg,
	...DataNaturalGas,
	...DataPetchem,
	...DataRDProducts,
	...DataLubricants,
	...DataAviation,
	...DataIndustrial,
};

export default allData;
