import { Stack } from "expo-router";

export default function HomeLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="SplashScreen" />
			<Stack.Screen name="welcomeScreen" />
			<Stack.Screen name="homeScreen" />
			<Stack.Screen name="loginScreen" />
			<Stack.Screen name="KnowledgeCenter" />
			<Stack.Screen name="ProductFinder" />
			<Stack.Screen name="ExploreMore" />
			<Stack.Screen name="ProductComparison" />
			<Stack.Screen name="InfoScreen" />
			<Stack.Screen name="SubPage" />
			<Stack.Screen name="SampleData" />
			<Stack.Screen name="ResultScreen" />
			<Stack.Screen name="index" />
		</Stack>
	);
}
