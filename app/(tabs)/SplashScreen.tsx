/* eslint-disable react-hooks/exhaustive-deps */
import { ALL_IMAGES } from "@/hooks/Allimages";
import { getDeviceUUID } from "@/hooks/deviceUUID";
import { loginUser } from "@/utils/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";

export default function SplashScreen() {
	const [progress, setProgress] = useState(0);
	const [email] = useState("product_app@hpcl.co.in");
	const [password] = useState("AdminforAPP#12345");
	const blinkAnim = useRef(new Animated.Value(1)).current;

	const testInternetSpeed = async () => {
		try {
			const start = Date.now();

			await fetch("https://www.google.com/images/phd/px.gif", {
				cache: "no-store",
			});

			const end = Date.now();
			const duration = (end - start) / 1000;
			const sizeInMB = 0.005;
			const speed = sizeInMB / duration;

			return speed;
		} catch (error) {
			console.error(error);
			return 0;
		}
	};

	const handleLogin = async () => {
		try {
			await loginUser({
				email,
				password,
			});
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	useEffect(() => {
		let progressInterval: any;

		const checkSpeedAndStart = async () => {
			// 🌐 Network speed
			const speed = await testInternetSpeed();
			await AsyncStorage.setItem("NETWORK_MODE", speed > 1 ? "FAST" : "SLOW");

			// 🔐 Device UUID (generated once)
			const deviceUUID = await getDeviceUUID();
			console.log("Device UUID:", deviceUUID);

			// 📊 Progress bar animation
			progressInterval = setInterval(() => {
				setProgress((prev) => {
					const next = prev + 0.01;

					if (next >= 1) {
						clearInterval(progressInterval);
						return 1;
					}

					return next;
				});
			}, 50);
		};

		checkSpeedAndStart();
		handleLogin();

		return () => clearInterval(progressInterval);
	}, []);

	useEffect(() => {
		if (progress === 1) {
			router.replace("/welcomeScreen");
		}
	}, [progress]);

	// Blinking "Loading..." animation
	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(blinkAnim, {
					toValue: 0,
					duration: 500,
					useNativeDriver: true,
				}),
				Animated.timing(blinkAnim, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}),
			]),
		).start();
	}, []);

	return (
		<View style={styles.container}>
			<Image
				source={ALL_IMAGES.MASTER_LOGO}
				style={styles.logo}
				resizeMode="contain"
			/>
			<View style={{ alignItems: "center" }}>
				<Progress.Bar
					progress={progress}
					width={350}
					color="#1E3A8A"
					borderRadius={10}
					height={10}
				/>

				<Text style={styles.percentText}>
					{Math.min(Math.round(progress * 100), 100)}%
				</Text>

				<Animated.Text style={[styles.loadingText, { opacity: blinkAnim }]}>
					Loading...
				</Animated.Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "space-around",
		alignItems: "center",
	},
	logo: {
		width: 350,
		height: 350,
	},
	percentText: {
		marginTop: 10,
		fontSize: 16,
		fontWeight: "600",
		color: "#1E3A8A",
	},
	loadingText: {
		marginTop: 5,
		fontSize: 14,
		color: "#555",
	},
});
