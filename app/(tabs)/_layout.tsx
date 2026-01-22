import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeLayout() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Stack>
				<Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
				<Stack.Screen name="welcomeScreen" options={{ headerShown: false }} />
				<Stack.Screen name="homeScreen" options={{ headerShown: false }} />
				<Stack.Screen name="loginScreen" options={{ headerShown: false }} />
				<Stack.Screen name="KnowledgeCenter" options={{ headerShown: false }} />
				<Stack.Screen name="ProductFinder" options={{ headerShown: false }} />
				<Stack.Screen name="ExploreMore" options={{ headerShown: false }} />
				<Stack.Screen name="InfoScreen" options={{ headerShown: false }} />
				<Stack.Screen name="SubPage" options={{ headerShown: false }} />
				<Stack.Screen name="SampleData" options={{ headerShown: false }} />
			</Stack>
		</SafeAreaView>
	);
}
