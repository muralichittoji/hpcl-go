import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export const useNetwork = () => {
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			const online = state.isConnected && state.isInternetReachable;

			setIsOnline(!!online);
		});

		return unsubscribe;
	}, []);

	return isOnline;
};
