import { Colors } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import BottomSheet from "./BottomSheet";

type Props = {
	title: string;
	visible: boolean;
	onClose: () => void;
};

const EnquireNow = ({ title, visible, onClose }: Props) => {
	const [name, setName] = useState("");
	const [orgName, setOrgName] = useState("");
	const [mobile, setMobile] = useState("");
	const [email, setEmail] = useState("");

	const [userName, setUserName] = useState<string | null>(null);
	const [isAnonymous, setIsAnonymous] = useState(false);

	useEffect(() => {
		const loadUser = async () => {
			const storedName = await AsyncStorage.getItem("user_name");
			const storedType = await AsyncStorage.getItem("user_type");

			if (storedName) {
				setUserName(storedName);
				setIsAnonymous(storedType === "anonymous");
			}
		};
		loadUser();
	}, []);

	const generateAnonymousName = () => {
		const now = new Date();
		return `User_${now.getFullYear()}_${
			now.getMonth() + 1
		}_${now.getDate()}_${now.getHours()}${now.getMinutes()}`;
	};

	const saveUser = async (name: string, type: "email" | "anonymous") => {
		await AsyncStorage.setItem("user_name", name);
		await AsyncStorage.setItem("user_type", type);
		setUserName(name);
		setIsAnonymous(type === "anonymous");
	};

	const handleContinue = () => {
		if (!name || !mobile || !email) return;
		saveUser(name, "email");
	};

	const handleAnonymous = () => {
		const anonName = generateAnonymousName();
		saveUser(anonName, "anonymous");
	};

	return (
		<BottomSheet visible={visible} onClose={onClose} heightRatio={0.75}>
			{/* Title Row */}
			<View style={styles.titleRow}>
				<Text style={styles.title}>{title}</Text>

				{isAnonymous && (
					<Pressable style={styles.registerBtn}>
						<Text style={styles.registerText}>Registered</Text>
					</Pressable>
				)}
			</View>

			<ScrollView
				contentContainerStyle={styles.container}
				keyboardShouldPersistTaps="handled"
			>
				{/* ===== USER FORM ===== */}
				{!userName && (
					<View style={styles.formContainer}>
						<Text style={styles.formTitle}>Please enter your details</Text>

						<TextInput
							placeholder="Name"
							placeholderTextColor={Colors.grayDeep}
							value={name}
							onChangeText={setName}
							style={styles.input}
						/>

						<TextInput
							placeholder="Organization Name"
							placeholderTextColor={Colors.grayDeep}
							value={orgName}
							onChangeText={setOrgName}
							style={styles.input}
						/>

						<TextInput
							placeholder="Mobile Number"
							placeholderTextColor={Colors.grayDeep}
							value={mobile}
							onChangeText={setMobile}
							keyboardType="phone-pad"
							style={styles.input}
						/>

						<TextInput
							placeholder="Email ID"
							placeholderTextColor={Colors.grayDeep}
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							style={styles.input}
						/>

						<Pressable
							style={[
								styles.continueBtn,
								(!name || !mobile || !email) && {
									opacity: 0.5,
								},
							]}
							disabled={!name || !mobile || !email}
							onPress={handleContinue}
						>
							<Text style={styles.continueText}>Submit</Text>
						</Pressable>
						{/* 
						<Pressable onPress={handleAnonymous} style={styles.anonBtn}>
							<Text style={styles.anonText}>Continue as Guest</Text>
						</Pressable> */}
					</View>
				)}

				{/* ===== SUCCESS VIEW ===== */}
				{userName && (
					<View style={styles.fullHeight}>
						<View>
							<Text style={styles.success}>Thank you, {userName} 👋</Text>
							<Text style={styles.message}>
								Our team will contact you soon.
							</Text>
						</View>

						<TextInput
							placeholder="Enter your query"
							placeholderTextColor="#9CA3AF"
							style={styles.input}
						/>
					</View>
				)}

				<View style={{ height: 300 }} />
			</ScrollView>
		</BottomSheet>
	);
};

export default EnquireNow;

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},

	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 20,
	},

	formContainer: {
		gap: 16,
	},

	formTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: Colors.blueDark,
		marginBottom: 10,
	},

	input: {
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 8,
		padding: 12,
		backgroundColor: "#fff",
		color: "#000",
	},

	fullHeight: {
		height: "60%",
		justifyContent: "space-between",
		paddingBottom: 20,
	},

	title: {
		fontSize: 20,
		fontWeight: "700",
		color: Colors.blueDark,
		flex: 1,
	},

	registerBtn: {
		borderWidth: 1,
		borderColor: Colors.greenDark,
		borderRadius: 6,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},

	registerText: {
		color: Colors.greenDark,
		fontWeight: "600",
		fontSize: 12,
	},

	continueBtn: {
		backgroundColor: Colors.blueDeep,
		padding: 12,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 10,
	},

	continueText: {
		color: "#fff",
		fontWeight: "600",
	},

	anonBtn: {
		alignItems: "center",
		marginTop: 40,
	},

	anonText: {
		color: Colors.blueDeep,
		fontWeight: "600",
		fontSize: 16,
	},

	success: {
		fontSize: 18,
		fontWeight: "700",
		color: Colors.greenDark,
		marginBottom: 6,
	},

	message: {
		fontSize: 15,
		color: "#555",
	},
});
