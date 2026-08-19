// Centralized image registry
import { ALL_IMAGES } from "@/hooks/Allimages";

import React, { useEffect } from "react";
import {
	Animated,
	Dimensions,
	FlatList,
	Image,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native";

// Theme colors
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/theme";

import {
	clearNotifications,
	getNotifications,
	getUnreadCount,
	markAsRead,
	notificationEmitter,
} from "@/lib/notification";
// Screen width for responsive sizing
const { width } = Dimensions.get("window");

/* -------------------------------------------------------------------------- */
/*                                   Header                                   */
/* -------------------------------------------------------------------------- */
const Header = ({
	caption,
	screen,
	subCaption,
	scrollY,
}: {
	caption?: string; // Main heading text
	screen?: string; // Screen identifier (eg: "Login")
	subCaption?: string; // Optional subtitle text
	scrollY?: Animated.Value; // Scroll position reference
}) => {
	const [userEmail, setUserEmail] = React.useState<string | null>(null);
	const [notificationVisible, setNotificationVisible] = React.useState(false);
	const [notifications, setNotifications] = React.useState(getNotifications());
	const [unreadCount, setUnreadCount] = React.useState(getUnreadCount());

	const refreshNotifications = () => {
		setNotifications(getNotifications());
		setUnreadCount(getUnreadCount());
	};

	const headerHeight = scrollY
		? scrollY.interpolate({
				inputRange: [0, 150],
				outputRange: [140, 80],
				extrapolate: "clamp",
		  })
		: screen === "welcome"
		? width * (1140 / 5410)
		: 140;

	const logoHeight = scrollY
		? scrollY.interpolate({
				inputRange: [0, 150],
				outputRange: [90, 45],
				extrapolate: "clamp",
		  })
		: 90;

	const titleSize = scrollY
		? scrollY.interpolate({
				inputRange: [0, 150],
				outputRange: [30, 20],
				extrapolate: "clamp",
		  })
		: 30;

	const imageWidth = scrollY
		? scrollY.interpolate({
				inputRange: [0, 150],
				outputRange: [90, 50],
				extrapolate: "clamp",
		  })
		: 90;

	/* ---------------------------------------------------------------------- */
	/*              Dynamic container style based on screen type              */
	/* ---------------------------------------------------------------------- */
	const getStyle = (): ViewStyle => ({
		flexDirection: screen ? "column" : "row",
		justifyContent: screen ? "center" : "flex-start",
		alignItems: screen ? "flex-start" : "center",
		gap: screen ? 0 : 10,
		paddingHorizontal: screen ? 0 : 15,
		width: screen ? width : width - 20,
		marginHorizontal: screen ? 0 : 10,
		marginTop: screen ? 0 : 0,
	});

	useEffect(() => {
		refreshNotifications();

		const update = () => refreshNotifications();

		notificationEmitter.on("changed", update);

		return () => {
			notificationEmitter.off("changed", update);
		};
	}, []);

	/* ---------------------------------------------------------------------- */
	/*               Render header logo based on screen context               */
	/* ---------------------------------------------------------------------- */
	const getHeader = () => {
		switch (screen) {
			case "Login":
				return (
					<View style={{ width: "100%", alignItems: "center" }}>
						<Image
							style={styles.mainLogoFull}
							source={ALL_IMAGES.MASTER_FULL_LOGO}
							resizeMode="contain"
						/>
					</View>
				);
			case "welcome":
				return (
					<View style={{ width: "100%", alignItems: "stretch" }}>
						<Image
							style={styles.mainLogo}
							source={ALL_IMAGES.MASTER_HEADER}
							resizeMode="contain"
						/>
					</View>
				);

			default:
				return (
					<Animated.Image
						source={ALL_IMAGES.MASTER_LOGO}
						resizeMode="contain"
						style={{
							width: imageWidth,
							height: logoHeight,
						}}
					/>
				);
		}
	};

	const handleLogout = () => {
		AsyncStorage.setItem("user_details", JSON.stringify({ email: "guest" }))
			.then(() => {
				setUserEmail("guest");
				router.replace("/homeScreen");
			})
			.catch((e) => {
				console.log("Error resetting guest session:", e);
			});
	};

	useEffect(() => {
		// Log the current screen for debugging
		AsyncStorage.getItem("user_details")
			.then((userDetails: any) => {
				const parsedDetails = JSON.parse(userDetails);
				setUserEmail(parsedDetails.email);
				// console.log("Logged in user email:", parsedDetails.email);
			})
			.catch((e) => {
				console.log("Error fetching user email from AsyncStorage:", e);
			});
	}, [screen]);

	/* ---------------------------------------------------------------------- */
	/*                                  Render                                */
	/* ---------------------------------------------------------------------- */
	return (
		<SafeAreaView
			edges={
				screen === "welcome" ? ["left", "right"] : ["top", "left", "right"]
			}
			style={{ backgroundColor: screen === "welcome" ? "#fff" : "transparent" }}
		>
			<View style={{ flexDirection: "column" }}>
				{/* {screen !== "Login" && screen !== "welcome" && (
					<View
						style={{
							justifyContent: "space-between",
							flexDirection: "row",
							paddingHorizontal: 10,
							alignItems: "center",
							paddingVertical: 5,
						}}
					>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
						>
							<Text
								style={{
									textAlign: "center",
									color: "#000",
									fontSize: 16,
									fontWeight: "600",
								}}
							>
								{userEmail ? userEmail : null}
							</Text>
							{/* <TouchableOpacity
              onPress={() => {
                refreshNotifications();
                setNotificationVisible(true);
              }}
              style={{
                padding: 5,
                borderRadius: 20,
              }}
            >
              <MaterialIcons
                name="notifications"
                size={30}
                color={Colors.yellowDeep}
              />

              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity> */}
				{/* </View>
						{userEmail && userEmail !== "guest" ? (
							<TouchableOpacity
								onPress={handleLogout}
								style={{
									backgroundColor: Colors.blueDeep,
									padding: 5,
									borderRadius: 10,
								}}
							>
								<Text
									style={{
										textAlign: "center",
										color: "#fff",
										fontWeight: "600",
										fontSize: 16,
									}}
								>
									Logout
								</Text>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								style={{
									backgroundColor: Colors.blueDeep,
									padding: 5,
									borderRadius: 10,
								}}
								onPress={handleLogout}
							>
								<Text
									style={{
										textAlign: "center",
										color: "#fff",
										fontWeight: "600",
										fontSize: 16,
									}}
								>
									Login
								</Text>
							</TouchableOpacity>
						)} */}
				{/* Show login button if no user is logged in */}
				{/* </View>
				)} */}
				<Animated.View
					style={[
						getStyle(),
						{
							height: headerHeight,
							minHeight: undefined,
							overflow: "hidden",
						},
					]}
				>
					{/* Logo section */}
					{getHeader()}

					{/* Title & subtitle */}
					<View style={{ width: "70%" }}>
						{caption && (
							<Animated.Text
								numberOfLines={2}
								adjustsFontSizeToFit
								minimumFontScale={0.65}
								style={[
									styles.content,
									{
										fontSize: titleSize,
									},
								]}
							>
								{caption}
							</Animated.Text>
						)}

						{subCaption && <Text style={styles.subTitle}>{subCaption}</Text>}
					</View>

					{/* Bottom divider */}
					<View style={styles.divider} />
				</Animated.View>
				<View>
					{caption && caption !== "Product \nCatalogue" && (
						<View style={styles.navRow}>
							<TouchableOpacity
								onPress={() => router.back()}
								style={[styles.headerFab, styles.headerFabLeft]}
								accessibilityRole="button"
								accessibilityLabel="Go back"
							>
								<MaterialIcons
									name="arrow-back"
									size={24}
									color={Colors.white}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => router.replace("/homeScreen")}
								style={[styles.headerFab, styles.headerFabRight]}
								accessibilityRole="button"
								accessibilityLabel="Go to home"
							>
								<MaterialIcons name="home" size={24} color={Colors.white} />
							</TouchableOpacity>
						</View>
					)}
				</View>
				<Modal
					visible={notificationVisible}
					transparent
					animationType="slide"
					onRequestClose={() => setNotificationVisible(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<Text style={styles.modalTitle}>Notifications</Text>

							<FlatList
								data={notifications}
								keyExtractor={(item) => item.id.toString()}
								renderItem={({ item }) => (
									<TouchableOpacity
										style={styles.notificationItem}
										onPress={() => {
											markAsRead(item.id);
											refreshNotifications();

											setNotificationVisible(false);

											router.push({
												pathname: "/(tabs)/ResultScreen",
												params: {
													chatLocalId: item.chatId.toString(),
												},
											});
										}}
									>
										<Text style={{ fontWeight: "700" }}>{item.title}</Text>

										<Text>{item.message}</Text>
									</TouchableOpacity>
								)}
								ListEmptyComponent={
									<Text style={{ textAlign: "center", padding: 20 }}>
										No notifications
									</Text>
								}
							/>

							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-around",
									alignItems: "center",
									height: 40,
								}}
							>
								<TouchableOpacity
									onPress={() => {
										clearNotifications();
										refreshNotifications();
									}}
								>
									<Text style={{ color: "red" }}>Clear</Text>
								</TouchableOpacity>

								<TouchableOpacity onPress={() => setNotificationVisible(false)}>
									<Text>Close</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		</SafeAreaView>
	);
};

export default Header;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
	// Login header container
	container: {
		width: "100%",
		padding: 0,
		margin: 0,
		elevation: 10,
	},

	mainLogo: {
		width: "100%",
		height: "100%",
		aspectRatio: 5410 / 1140,
	},

	mainLogoFull: {
		width: "90%",
		height: 180,
		marginHorizontal: 10,
	},

	// (Unused currently) Smaller logo style
	headImage: {
		width: "25%",
		height: 200,
		marginRight: 5,
	},

	// Main title text
	content: {
		color: Colors.blueDark,
		fontSize: 30,
		fontWeight: "700",
	},

	// Subtitle text
	subTitle: {
		fontSize: 14,
		color: Colors.grayDeep,
	},

	// Optional header branding text
	headText: {
		color: Colors.blueDeep,
		fontSize: 15,
		fontWeight: "700",
	},

	// Bottom divider line
	divider: {
		height: 1,
		backgroundColor: "#000",
	},
	navRow: {
		flexDirection: "row",
		paddingHorizontal: 14,
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 4,
		marginBottom: 2,
	},
	headerFab: {
		height: 44,
		width: 44,
		borderRadius: 22,
		backgroundColor: Colors.blueDeep,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.18,
		shadowRadius: 8,
		elevation: 5,
	},
	headerFabLeft: {
		backgroundColor: Colors.blueDeep,
	},
	headerFabRight: {
		backgroundColor: Colors.blueDeep,
	},
	badge: {
		position: "absolute",
		top: -3,
		right: -3,
		backgroundColor: "#E53935",
		borderRadius: 10,
		minWidth: 18,
		height: 18,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 4,
	},

	badgeText: {
		color: "#FFF",
		fontSize: 11,
		fontWeight: "700",
	},

	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.45)",
		justifyContent: "center",
		alignItems: "center",
	},

	modalContainer: {
		width: "90%",
		maxHeight: "70%",
		backgroundColor: "#FFF",
		borderRadius: 18,
		padding: 20,
	},

	modalTitle: {
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 15,
		textAlign: "center",
		color: Colors.blueDark,
	},

	notificationItem: {
		padding: 14,
		borderBottomWidth: 1,
		borderBottomColor: "#EEE",
	},
});
