import NetInfo from "@react-native-community/netinfo";
import React, { createContext, useContext, useEffect, useState } from "react";

type NetworkContextType = {
	isOnline: boolean;
};

const NetworkContext = createContext<NetworkContextType>({
	isOnline: true,
});

export const NetworkProvider = ({ children }: any) => {
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			setIsOnline(!!(state.isConnected && state.isInternetReachable));
		});

		return unsubscribe;
	}, []);

	return (
		<NetworkContext.Provider value={{ isOnline }}>
			{children}
		</NetworkContext.Provider>
	);
};

export const useNetwork = () => useContext(NetworkContext);
