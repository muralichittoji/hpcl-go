import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
	message: string;
	variant: "error" | "stopped";
	onRetry: () => void;
	onEdit: () => void;
};

const SearchFailureCard = ({ message, variant, onRetry, onEdit }: Props) => {
	const isStopped = variant === "stopped";

	return (
		<View
			style={[
				styles.container,
				isStopped ? styles.stoppedContainer : styles.errorContainer,
			]}
		>
			<View style={styles.headerRow}>
				<Ionicons
					name={isStopped ? "stop-circle" : "alert-circle"}
					size={20}
					color={isStopped ? "#92400E" : "#DC2626"}
				/>
				<Text
					style={[
						styles.message,
						isStopped ? styles.stoppedText : styles.errorText,
					]}
				>
					{message}
				</Text>
			</View>

			<View style={styles.actions}>
				<TouchableOpacity style={styles.retryButton} onPress={onRetry}>
					<Ionicons name="refresh" size={16} color="#FFF" />
					<Text style={styles.retryButtonText}>Retry</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.editButton} onPress={onEdit}>
					<Ionicons name="create-outline" size={16} color={Colors.blueDark} />
					<Text style={styles.editButtonText}>Edit</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default SearchFailureCard;

const styles = StyleSheet.create({
	container: {
		alignSelf: "flex-start",
		width: "98%",
		maxWidth: "98%",
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 14,
		marginTop: 10,
		marginBottom: 8,
		marginHorizontal: "1%",
		borderWidth: 1,
	},

	errorContainer: {
		backgroundColor: "#FEE2E2",
		borderColor: "#FECACA",
	},

	stoppedContainer: {
		backgroundColor: "#FEF3C7",
		borderColor: "#FDE68A",
	},

	headerRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		width: "100%",
	},

	message: {
		flex: 1,
		marginLeft: 10,
		fontSize: 13,
		lineHeight: 19,
		flexWrap: "wrap",
	},

	errorText: {
		color: "#DC2626",
	},

	stoppedText: {
		color: "#92400E",
	},

	actions: {
		flexDirection: "row",
		marginTop: 12,
		gap: 10,
		flexWrap: "wrap",
	},

	retryButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.blueDark,
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 8,
		gap: 6,
	},

	retryButtonText: {
		color: "#FFF",
		fontSize: 13,
		fontWeight: "600",
	},

	editButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFF",
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Colors.blueDark,
		gap: 6,
	},

	editButtonText: {
		color: Colors.blueDark,
		fontSize: 13,
		fontWeight: "600",
	},
});
