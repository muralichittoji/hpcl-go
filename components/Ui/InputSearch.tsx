import { Colors } from '@/constants/theme';
import { getAnswer } from '@/utils/authService';
import { useNetwork } from '@/utils/NetworkProvider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import CameraScreen from './Camera';

const { width } = Dimensions.get('window');

type SearchProps = {
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setSlowNet: React.Dispatch<React.SetStateAction<boolean>>;
	placeHolder?: string;
};

const InputSearch = ({
	setLoading,
	setSlowNet,

	placeHolder = 'Search Products',
}: SearchProps) => {
	const [search, setSearch] = useState('');
	const { isOnline } = useNetwork();
	const [lowNetwork, setLowNetwork] = useState<boolean>(false);

	const findScreen = () => {
		if (!search?.trim()) return;
		getSearch(search.trim());
		// router.push({
		// 	pathname: "/result",
		// 	params: {
		// 		response: "Static response for testing",
		// 		question: search,
		// 		productCode: null,
		// 	},
		// });
	};

	const safeParse = (text: string) => {
		try {
			const first = JSON.parse(text);

			// Handle double-encoded JSON (very common with Azure)
			if (typeof first === 'string') {
				try {
					return JSON.parse(first);
				} catch {
					return { response: first };
				}
			}

			return first;
		} catch {
			// Fallback → treat as plain text
			return { response: text };
		}
	};

	const getSearch = async (question: string) => {
		let timeoutId: any;

		try {
			setLoading(true);

			// 🚫 Offline handling
			if (!isOnline) {
				setLowNetwork(true);
				setSlowNet(true);
				return;
			}

			// ⏱️ Slow network guard (90s)
			timeoutId = setTimeout(() => {
				setLoading(false);
				setLowNetwork(true);
				setSlowNet(true);
			}, 90000);

			const res = await getAnswer({ question });

			clearTimeout(timeoutId);

			console.log('Raw API response:', res);

			const rawAnswer = res?.results?.[0]?.answer;

			// ❌ No response
			if (!rawAnswer) {
				setSlowNet(true);
				setLowNetwork(true);
				return;
			}

			// ✅ Network OK
			setLowNetwork(false);
			setSlowNet(false);

			// 🔥 SAFE PARSE (core fix)
			const parsed = safeParse(rawAnswer);

			// 🧠 Always ensure response exists
			const finalResponse =
				parsed?.response ?? rawAnswer ?? 'No response available';

			const productCode = parsed?.app_product_code ?? 'na';

			// 🚀 Navigate safely
			router.push({
				pathname: '/(tabs)/result',
				params: {
					response: finalResponse,
					productCode,
					question,
					lowNetwork: 'false', // avoid stale state issue
				},
			});
		} catch (e) {
			console.log('Search Error:', e);

			setSlowNet(true);
			setLowNetwork(true);
		} finally {
			setLoading(false);
			clearTimeout(timeoutId);
		}
	};

	return (
		<View style={styles.searchInputContainer}>
			<View style={styles.inputWrapper}>
				<Ionicons name="search" size={22} color="#888" />
				<TextInput
					placeholder={placeHolder}
					placeholderTextColor={Colors.grayDeep}
					style={styles.searchInput}
					value={search}
					onChangeText={setSearch}
					onSubmitEditing={findScreen}
					returnKeyType="search"
				/>
			</View>
			<CameraScreen />
		</View>
	);
};

export default InputSearch;

const styles = StyleSheet.create({
	searchInputContainer: {
		width: '95%',
		maxWidth: '95%',
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: '#e6e6e6',
		borderRadius: 15,
		marginVertical: 20,
		marginHorizontal: 10,
		paddingHorizontal: 10,
		shadowColor: '#000',
		shadowOpacity: 0.3,
		shadowRadius: 2,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4,
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		width: width / 1.27,
	},
	searchInput: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16,
	},
});
